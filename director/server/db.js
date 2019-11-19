const settings = require("./settings");
const opn = require('opn');

/* ####################################
DATABASE SETUsP
#################################### */

module.exports = function (mongoose) {
    // Mongo DB
    var Schema = mongoose.Schema;
    var mongoURL = process.env.MONGODB_URI || settings.mongoURL;
    mongoose.connect(mongoURL, { useNewUrlParser: true });

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        console.log("Database Connection Ready!");
        opn('http://localhost:5000/');
    });

    return db;
}