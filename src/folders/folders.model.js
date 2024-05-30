const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const file = new Schema({
    link: { type: String },
    id: { type: String },
    name: { type: String }
}, { _id: false });

const compose = new Schema({
    subject: { type: String },
    message: { type: String },
    date: { type: Date, default: new Date() },
    file: { type: [file] },
    to: { type: String, enum: ["Admin", "Staff", "Resident"] },
}, { _id: false });

const chat = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'profile' },
    message: { type: String },
    date: { type: Date, default: new Date() },
    file: { type: [file] },
}, { _id: false });

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
    brgy: { type: String, index: true },
}, {
    virtuals: {
        id: { get() { return this._id; } },
        brgy: { get() { return this.brgy.toUpperCase(); } }
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
});

module.exports = mongoose.model("folders", obj);
