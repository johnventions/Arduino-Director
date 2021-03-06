var director;
var wavesurfer;
var paused;
var socket = io();

function initiate() {
    director = new Vue({
        el: "#director",
        store,
        data: {
            activePort: null,
            ports: null,
            actors: [],
            buttons: [],
            command: "",
            activeMachine: null,
            machines: [],
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
                        setTimeout(function() {
                            this.getOptions();
                        }.bind(this), 1000);
                    }
                }.bind(this));
            },
            getMachines: function() {
                $.get("/api/machines", function(data) {
                    this.machines = data;
                }.bind(this));
            },
            getSequences: function(machine) {
                $.get("/api/machines/" + machine._id + "/sequences", function(data) {
                    this.activeMachine = machine._id;
                    this.sequences = this.castSequences(data);
                }.bind(this));
            },
            castSequences: function(seq) {
                 var sequences = [];
                seq.forEach(function(s) {
                    var x = Object.assign(new Sequence(s.name), s);
                    sequences.push(x);
                }.bind(this));
                return sequences;
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
                this.getSequences(machine);
            },
            selectSequence: function(sequence) {
                sequence.components = [];
                this.$store.commit('setSequence', sequence);
                $.get("/api/machines/" + this.activeMachine + "/sequences/" + sequence._id, function(data) {
                    this.castComponents(data);
                    this.setupSequence();
                }.bind(this));
            },
            saveSequence: function() {
                var s = this.activeSequence;
                $.post("/api/machines/" + this.activeMachine + "/sequences/" + s._id, 
                    s,
                    function(data) {
                        console.log(data);
                    }.bind(this));
            },
            back: function() {
                this.$store.commit('setSequence', null);
            },
            castComponents: function(seq) {
                var comp = [];
                seq.components.forEach(function(val) {
                    comp.push(Object.assign(new Component(val.name), val));
                }.bind(this));
                this.$store.commit('setComponents', comp);
            },
            setupSequence: function() {
                this.setupAudio();
            },
            setupAudio: function() {
                $("#waveform").empty();
                var s = this.activeSequence;
                if (s.audio != "" && s.audio != null) {
                    wavesurfer = WaveSurfer.create({
                        container: '#waveform',
                        waveColor: 'violet',
                        progressColor: 'purple',
                        minPxPerSec: 50,
                        scrollParent: true,
                    });
                    wavesurfer.load(s.audio);
                    wavesurfer.on('seek', function(t) {
                        this.$store.commit('setTime', wavesurfer.getCurrentTime());
                    }.bind(this));
                }
            },
            addMachine: function() {
                var machinename = prompt("Machine Name", "New Machine");
                var pkg = {
                    name: machinename
                };
                $.post("/api/machines",
                    pkg,
                    function(data) {
                        this.selectMachine(data);
                    }.bind(this)
                    );
            },
            addSequence: function() {
                var machinename = prompt("Sequence Name", "New Sequence");
                var pkg = {
                    name: machinename
                };
                $.post("/api/machines/" + this.activeMachine + "/sequences",
                    pkg,
                    function(data) {
                        var s = this.castSequences([data]);
                        this.sequences.push(s[0]);
                        this.$store.commit('setSequence', this.sequences[this.sequences.length - 1]);
                    }.bind(this)
                    );
            },
            addComponent: function() {
                var s = this.activeSequence;
                var pkg = {
                    name: "New Component"
                };
                $.post("/api/machines/" + this.activeMachine + "/sequences/" + s._id + "/components",
                    pkg,
                    function(data) {
                        this.$store.commit('addComponent', Object.assign(new Component(), data));
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
                this.$store.commit('setTime', 0);
                this.curTime = 0;
                this.lastTime = new Date().getTime();
                this.linkMotors(seq);
                paused = false;
                if (seq.audio != "") {
                    wavesurfer.seekTo(0);
                    wavesurfer.play();
                }
                clearInterval(this.interval);
                this.interval = setInterval(function() {
                    if (paused) {
                        return;
                    }
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
                    this.$store.commit('increaseTime', delta);
                    this.curTime += delta;
                    this.lastTime = d2;
                    if (this.curTime > seq.duration) {
                        clearInterval(this.interval);
                    }
                }.bind(this), delta)
            },
            pauseSequence: function(seq) {
                if (!paused) {
                    if (seq.audio != "") { 
                        wavesurfer.pause();
                    }
                } else {
                    if (seq.audio != "") { 
                        wavesurfer.play();
                        this.lastTime = new Date().getTime();
                    }
                }
                paused = !paused;
                
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
            zoom: function(z) {
                this.$store.commit("changeScale", z);
            },
            shift: function(x) {
                this.$store.commit("changeOffset", x);
            }
        },
        computed: Vuex.mapState({
            activeSequence: state => state.activeSequence,
        }),
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
        setTimeout(function() {
            director.getOptions();
        }, 2000);
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