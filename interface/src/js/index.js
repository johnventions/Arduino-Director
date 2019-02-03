var director;
var socket = io();

function initiate() {
    director = new Vue({
        el: "#director",
        data: {
            activePort: null,
            ports: null,
            actors: [],
            buttons: [],
            command: "",
            activeMachine: null,
            machines: [],
            activeSequence: null,
            sequences: [],
            interval: null,
            curTime: 0,
            lastTime: 0,
        },
        methods: {
            getPorts: function() {
                $.get("/ports", function(data) {
                    this.ports = data;
                    var active = data.find(function(elem) {
                        return elem.connected;
                    });
                    if (active != null) {
                        this.activePort = active.comName;
                        this.getOptions();
                    }
                }.bind(this));
            },
            getMachines: function() {
                $.get("/api/machines", function(data) {
                    this.machines = data;
                }.bind(this));
            },
            getSequences: function() {
                $.get("/api/machines/" + this.activeMachine + "/sequences", function(data) {
                    this.castSequences(data);
                }.bind(this));
            },
            castSequences: function(seq) {
                this.sequences = [];
                seq.forEach(function(s) {
                    var x = Object.assign(new Sequence(s.name), s);
                    this.sequences.push(x);
                }.bind(this));
            },
            connect: function(port) {
                console.log("Connecting");
                $.post("/connect", port, function(data) {
                    console.log(data);
                }.bind(this));
            },
            disconnect: function() {
                $.post("/disconnect", {}, function(data) {
                    console.log(data);
                }.bind(this));
            },
            getOptions: function() {
                socket.emit("SerialWrite", "OPTIONS");
            },
            sendCommand: function(c) {
                controller.addCommand(c);
                this.command = "";
            },
            selectMachine: function(machine) {
                this.activeMachine = machine._id;
                this.getSequences();
            },
            selectSequence: function(sequence) {
                sequence.components = [];
                this.activeSequence = sequence;
                $.get("/api/machines/" + this.activeMachine + "/sequences/" + sequence._id, function(data) {
                    this.castComponents(data);
                }.bind(this));
            },
            castComponents: function(seq) {
                var comp = [];
                seq.components.forEach(function(val) {
                    comp.push(Object.assign(new Component(val.name), val));
                }.bind(this));
                this.activeSequence.components = comp;
            },
            addSequence: function() {
                this.sequences.push(new Sequence("New Sequence"));
                this.activeSequence = this.sequences[this.sequences.length - 1];
            },
            addComponent: function() {
                var pkg = {
                    name: "New Component"
                };
                $.post("/api/machines/" + this.activeMachine + "/sequences/" + this.activeSequence._id + "/components", pkg, function(data) {
                    this.activeSequence.components.push(Object.assign(new Component(), data))
                }.bind(this));
            },
            linkMotors: function(seq) {
                seq.components.forEach(function(comp) {
                    var m = this.actors.find(function(el) {
                        return el.name == comp.name;
                    });
                    if (m) {
                        comp.motorID = m.id;
                    } else {
                        comp.motorID = -1;
                    }
                }.bind(this));
            },
            playSequence: function(seq) {
                this.curTime = 0;
                this.lastTime = new Date().getTime();
                this.linkMotors(seq);
                clearInterval(this.interval);
                this.interval = setInterval(function() {
                    var d2 =  new Date().getTime();
                    var delta = (d2 - this.lastTime)/1000; 
                    seq.components.forEach(function(comp) {
                        var items = comp.data.filter(function(d) {
                            return (d.x > this.curTime && d.x < (this.curTime + delta));
                        }.bind(this));
                        if (items.length > 0) {
                            this.processData(comp, items);
                        }
                    }.bind(this));
                    this.curTime += delta;
                    this.lastTime = d2;
                    if (this.curTime > seq.duration) {
                        clearInterval(this.interval);
                    }
                }.bind(this), delta)
            },
            processData: function(comp, items) {
                items.forEach(function(i) {
                    var p = Math.floor(i.y);
                    comp.currentPosition = p;
                    console.log("S:" + p);
                    if (comp.motorID != -1) {
                        this.sendCommand(`SERVO:${comp.motorID},${p}`);    
                    }
                }.bind(this));
            },
            intervalPos: function() {
                return (this.curTime * scale) + offset;
            }
        },
        created: function() {
            console.log("App initialized");
            this.getPorts();
            this.getMachines();
        }
    });
}

function sockets() {
    socket.on("SerialMessage", (data) => {
        console.log(data);
    });
    socket.on("OPTIONS", (pkg) => {
        var components = pkg.split("|");
        var actors = [];
        var buttons = [];
        components.forEach(function(val) {
            if (val.indexOf(",") > -1) {
                var o = val.split(",");
                var _o = {
                    id: o[0],
                    name: o[1],
                    type: o[2]
                };
                if (o[2] == "S") { //Servo
                    actors.push(_o);
                } else if (o[2] == "B") { //Button
                    buttons.push(_o);
                }
            }
        });
        director.actors = actors;
        director.buttons = buttons;
    });
    socket.on("CONNECTED", (port) => {
        director.activePort = port;
        director.getOptions();
    });
    socket.on("DISCONNECTED", () => {
        director.activePort = null;
        director.actors = null;
        director.buttons = null;
    });
}

$(document).ready(function() {
    console.log("Welcome to Director");
    initiate();
    sockets();
    controller.start();
});