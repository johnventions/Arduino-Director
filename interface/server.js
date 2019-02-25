var express = require("express");
const path = require('path');
var bodyParser = require("body-parser");
const opn = require('opn');

const socketIO = require('socket.io');
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline')


var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Machine = require('./models/machine');
var Sequence = require('./models/sequence');
var Component = require('./models/component');


var activePort;
var connected = false;
const parser = new Readline();

const INDEX = path.join(__dirname, 'index.html');

/* ####################################
APP SETUP
#################################### */

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static('dist'));

var server = app.listen(process.env.PORT || 5000, function() {
    var port = server.address().port;
    console.log("Arduino Director now running on port", port);
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/src/index.html');
});


/* ####################################
DATABASE SETUP
#################################### */

var db;

var mongoURL = process.env.MONGODB_URI || "mongodb://localhost:27017/director";
mongoose.connect(mongoURL, { useNewUrlParser: true} );


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Database Connection Ready!");
  opn('http://localhost:5000/');
});

/* ####################################
SOCKET SETUP
#################################### */

const io = socketIO(server);
io.on('connection', (socket) => {
    io.emit('message', "Welcome friend!");
    socket.on("SerialWrite", (message) => {
        if (activePort != null) {
            activePort.write(message);
        }
    });
});

/* ####################################
SERIAL PORT SETUP
#################################### */

parser.on('data', line => {
    console.log(`> ${line}`);
    if (line.indexOf(":") > -1) {
        var components = line.split(":");
        io.emit(components[0], components[1]);
    } else {
        io.emit("SerialMessage", line);
    }
});

/* ####################################
API ROUTES
#################################### */

app.get("/ports", function(req, res) {
	SerialPort.list(function (err, ports) {
        ports.forEach(function(val) {
            val.connected = false;
            if (connected == true && activePort) {
                if (activePort.path == val.comName) {
                    val.connected = true;
                }
            }
        });
        return res.status(200).json(ports);
      });
});

app.post("/connect", function(req, res) {
    if (connected && activePort) {
        if (activePort.connnected) {
            activePort.close();
            connected = false;
            return res.status(200).json({success:true});
        }
    }
    var port = req.body.comName;
    activePort = new SerialPort(port, {baudRate: 500000});
    activePort.on('open', function() {
        console.log("Connected to port " + port + " @ " + activePort.settings.baudRate);
        connected = true;
        activePort.pipe(parser);
        io.emit("CONNECTED", port);
        return res.status(200).json({success:true});
    })
        
});

app.post("/disconnect", function(req, res) {
    connnected = false;
    if (activePort != null) {
        activePort.close();
        activePort = null;
        io.emit("DISCONNECTED", {});
        console.log("Disconnecting");
    }
    return res.status(200).json({success:true});
});

app.get("/api/machines", function(req, res) {
    Machine.find({}, 'name', function(err, docs) {
        if (err) {
            res.status(200).json([]);
        }
        res.status(200).json(docs);
    });
});


app.post("/api/machines", function(req, res) {
    var machine = req.body;
    machine._id = new mongoose.Types.ObjectId;

    var m = new Machine(machine);
    m.save(function() {
        res.status(201).json(m);
    });
});


app.get("/api/machines/:id/sequences", function(req, res) {
    Machine.findOne({_id: req.params.id}, function(err, machine) {
        res.status(200).json(machine.sequences);
    });
});

app.post("/api/machines/:id/sequences", function(req, res) {
    var seq = req.body;
    seq._id = new mongoose.Types.ObjectId;
    Machine.findOne({_id: req.params.id}, function(err, machine) {
        machine.sequences.push(seq);
        machine.save(function() {
            res.status(201).json(seq);
        });
    });
});

app.get("/api/machines/:id/sequences/:seq", function(req, res) {
    Machine.findOne({_id: req.params.id}, function(err, machine) {
        var seq = machine.sequences.id(req.params.seq);
        res.status(200).json(seq);
    });
});


app.post("/api/machines/:id/sequences/:seq", function(req, res) {
    var seq = req.body;
    Machine.findOne({_id: req.params.id}, function(err, machine) {
        var targ = machine.sequences.id(req.params.seq);
        Object.assign(targ, seq);
        machine.save(function() {
            res.status(201).json(seq);
        });
    });
});

app.post("/api/machines/:id/sequences/:seq/components", function(req, res) {
    var comp = req.body;
    comp._id = new mongoose.Types.ObjectId;
    Machine.findOne({_id: req.params.id}, function(err, machine) {
        var seq = machine.sequences.id(req.params.seq);
        seq.components.push(comp);
        machine.save(function() {
            res.status(201).json(comp);
        });
    });
});