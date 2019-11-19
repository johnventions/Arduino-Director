var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Sequence = require('./sequence');

var machineSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    createDate: { type: Date, Default: Date.now },
    sequences: [Sequence],
});

var Machine = mongoose.model('Machine', machineSchema);

module.exports = Machine;
