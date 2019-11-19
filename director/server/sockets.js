const socketIO = require('socket.io');

/* ####################################
SOCKET SETUP
#################################### */

module.exports = function (server) {
    const io = socketIO(server);

    io.on('connection', (socket) => {
        io.emit('message', "Welcome friend!");
        socket.on("SerialWrite", (message) => {
            if (activePort != null) {
                activePort.write(message);
            }
        });
    });

    return io;
}