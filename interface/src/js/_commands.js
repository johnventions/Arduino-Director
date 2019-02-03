var controller = {
    timer: null,
    queue: [],
    buffer: 51,
    lastCall: null,
    sendCommand: function(c) {
        if (c != "") {
            socket.emit("SerialWrite", c);
        }
    },
    start: function() {
        this.lastCall = new Date().getTime();
        this.timer = setInterval(this.process.bind(this), 5);
    },
    process: function() {
        if (this.queue.length > 0) {
            var d = new Date().getTime();
            if (d - this.lastCall > this.buffer) {
                this.sendCommand(this.queue[0]);
                this.queue.splice(0, 1);
                this.lastCall = new Date().getTime();
            }
        }
    },
    addCommand: function(c) {
        this.queue.push(c);
    }
}