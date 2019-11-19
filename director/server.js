var express = require("express");
const path = require('path');
var bodyParser = require("body-parser");


var mongoose = require("mongoose");


const INDEX = path.join(__dirname, 'index.html');

var app = express();
var server = app.listen(process.env.PORT || 5000, function() {
    var port = server.address().port;
    console.log("Arduino Director now running on port", port);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static('dist'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/src/index.html');
});

const director = {
    connected: false,
    activePort: null
}

const db = require('./server/db')(mongoose);
const io = require("./server/sockets.js")(server);
const parser = require("./server/parser.js")(io);
const apiRoutes = require('./server/api/routes')(io, parser, director);

app.use('/api', apiRoutes);
