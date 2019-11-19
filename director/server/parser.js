const Readline = require('@serialport/parser-readline')

/* ####################################
SERIAL PORT SETUP
#################################### */

module.exports = function (io) {
    const parser = new Readline();

    parser.on('data', line => {
        console.log(`> ${line}`);
        if (line.indexOf(":") > -1) {
            var components = line.split(":");
            io.emit(components[0], components[1]);
        } else {
            io.emit("SerialMessage", line);
        }
    });

    return parser;
}