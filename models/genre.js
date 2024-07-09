const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GnereSchema = new Schema({
    name: { type: String, required: true, minLength: 3, maxLength: 100 },
});

GnereSchema.virtual("url").get(function() {
    return `/catalog/genre/${this._id}`;
});

module.exports = mongoose.model("Gnere", GnereSchema);