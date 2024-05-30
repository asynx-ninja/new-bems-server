const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const obj = new Schema({
    root: { type: String, index: true },
    events: { type: String, index: true },
    application: { type: String, index: true },
    request: { type: String, index: true },
    service: { type: String, index: true },
    pfp: { type: String, index: true },
    official: { type: String, index: true },
    info: { type: String, index: true },
    inquiries: { type: String, index: true },
    verification: { type: String, index: true },
    blotters: { type: String, index: true },
    brgy: { type: String, index: true, uppercase: true },
}, {
    virtuals: {
        id: { get() { return this._id; } },
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
});

module.exports = mongoose.model("folders", obj);
