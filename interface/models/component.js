var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Component = new Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    order: Number,
    data: [Schema.Types.Mixed]
});

module.exports = Component;
