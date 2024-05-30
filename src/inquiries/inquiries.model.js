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
    to: { type: String, enum: ["Admin", "Staff", "Resident"]},
}, { _id: false });

const chat = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'profile' },
    message: { type: String },
    date: { type: Date, default: new Date() },
    file: { type: [file] },
}, { _id: false });

const obj = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'profile' },
    inquiry_id: { type: String },
    compose: { type: compose },
    status: { type: String, default: 'Submitted', enum: ['Submitted', 'In Progress', 'Completed'] },
    response: { type: [chat] },
    isArchived: { type: Boolean, default: false },
    folder_id: { type: String }
}, {
    virtuals: {
        id: { get() { return this._id; } },
    },
    timestamps: true,
});

module.exports = mongoose.model("inquiries", obj);
