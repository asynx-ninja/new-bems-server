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
    go_to: { type: String, enum: ["Events", "Application", "Services", "Requests", "Inquiries", "Patawag"] }
}, { _id: false })

const read_by = new Schema({
    readerId: { type: String },
    read_at: { type: Date, default: new Date() }
}, { _id: false })

const target = new Schema({
    user_id: { type: String },
    area: { type: String }
}, { _id: false })

const obj = new Schema({
    category: { type: String, enum: ['All', 'One', 'Many'] },
    compose: { type: compose },
    type: { type: String, index: true, enum: ['Municipality', 'Barangay', 'Resident'] },
    target: { type: target },
    read_by: { type: [read_by] },
    banner: { type: file },
    logo: { type: file },
}, {
    virtuals: {
        id: { get() { return this._id; } },
    },
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
    timestamps: true,
});

module.exports = mongoose.model("notifications", obj);
