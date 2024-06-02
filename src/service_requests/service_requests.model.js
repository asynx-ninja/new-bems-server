const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const file = new Schema({
    link: { type: String },
    id: { type: String },
    name: { type: String }
}, { _id: false });

const chat = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'profile' },
    message: { type: String },
    date: { type: Date, default: new Date() },
    file: { type: [file] },
}, { _id: false });

const obj = new Schema({
    answered_form: { type: Schema.Types.Mixed },
    service_form: { type: Schema.Types.ObjectId, ref: 'service_forms' },
    request_id: { type: String },
    files: { type: [file] },
    status: { type: String, default: 'For Review', enum: ['For Review', 'Cancelled', 'Rejected', 'Processing', 'Transaction Completed'] },
    response: { type: [chat] },
    isArchived: { type: Boolean, default: false },
    folder_id: { type: String }
}, {
    virtuals: {
        id: { get() { return this._id; } },
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
});

module.exports = mongoose.model("service_requests", obj);
