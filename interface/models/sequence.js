var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Component = require('./component');

var Sequence = new Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    duration: Number,
    audio: String,
    components: [Component],
});

module.exports = Sequence;
