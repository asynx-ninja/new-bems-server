const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const file = new Schema({
    link: { type: String },
    id: { type: String },
    name: { type: String }
}, { _id: false });

const obj = new Schema({
    title: { type: String },
    details: { type: String },
    isArchived: { type: Boolean, default: false },
    banner: { type: file }
}, {
    virtuals: {
        id: { get() { return this._id; } },
    },
    timestamps: true,
});

module.exports = mongoose.model("muni_abouts", obj);
