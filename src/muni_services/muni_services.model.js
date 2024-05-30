const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const file = new Schema({
    link: { type: String },
    id: { type: String },
    name: { type: String }
}, { _id: false });

const obj = new Schema({
    name: { type: String },
    details: { type: String },
    isArchived: { type: Boolean, default: false },
    icon: { type: file }
}, {
    virtuals: {
        id: { get() { return this._id; } },
    },
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
    timestamps: true,
});

module.exports = mongoose.model("muni_services", obj);
