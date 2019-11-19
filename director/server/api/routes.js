const routes = require('express').Router();
const machines = require('./machines')();
const SerialPort = require('serialport');


/* ####################################
API ROUTES
#################################### */

module.exports = function (io, parser, director) {
    
    routes.use("/machines", machines);

    routes.get("/ports", function(req, res) {
        SerialPort.list().then(
            ports => {
                ports.forEach( val => {
                    val.connected = false;
                    if (director.connected == true && director.activePort) {
                        if (director.activePort.path == val.comName) {
                            val.connected = true;
                        }
                    }
                });
                return res.status(200).json(ports);
            },
            err => {
                console.log(err);
            }
        );
    });
    
    routes.post("/ports/:com", function(req, res) {
        var port = req.params.com;

        console.log("Connecting to", port);
        if (director.connected && director.activePort) {
            if (director.activePort.connnected) {
                director.activePort.close();
                director.connected = false;
                return res.status(200).json({success:true});
            }
        }
        director.activePort = new SerialPort(port, {baudRate: 500000});
        
        director.activePort.on('open', function() {
            console.log("Connected to port " + port + " @ " + director.activePort.settings.baudRate);
            director.connected = true;
            director.activePort.pipe(parser);
            io.emit("CONNECTED", port);
            return res.status(200).json({success:true});
        })
            
    });

    routes.delete("/ports", function(req, res) {
        director.connnected = false;
        if (director.activePort != null && director.activePort.connected) {
            director.activePort.close();
            director.activePort = null;
            io.emit("DISCONNECTED", {});
            console.log("Disconnecting");
        }
        return res.status(200).json({success:true});
    });

    return routes;
}