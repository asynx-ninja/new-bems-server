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
    service_id: { type: String },
    service_name: { type: String },
    details: { type: String },
    fee: { type: Number },
    collections: { type: collections },
    brgy: { type: String },
    status: { type: String, enum: ["Approved", "Disapproved", "For Review"] },
    isArchived: { type: Boolean, default: false },
}, {
    virtuals: {
        id: { get() { return this._id; } },
        brgy: { get() { return this.brgy.toUpperCase(); } }
    },
    timestamps: true,
});

module.exports = mongoose.model("services", obj);
