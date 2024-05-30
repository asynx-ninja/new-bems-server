const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const file = new Schema({
    link: { type: String },
    id: { type: String },
    name: { type: String }
}, { _id: false });

const collections = new Schema({
    folder_id: { type: String },
    banner: { type: file },
    logo: { type: file },
    file: { type: [file] },
}, { _id: false })

const obj = new Schema({
    event_id: { type: String },
    event_name: { type: String },
    details: { type: String },
    event_date: { type: Date },
    end_reg_date: { type: Date },
    attendees_limit: { type: Number },
    collections: { type: collections },
    brgy: { type: String, uppercase: true },
    isOpen: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
}, {
    virtuals: {
        id: { get() { return this._id; } },
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
});

module.exports = mongoose.model("events", obj);
