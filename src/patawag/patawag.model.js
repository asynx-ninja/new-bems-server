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

const format = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'profile' },
}, { _id: false })

const personnel = new Schema({
    complainant: { type: [format] },
    defendant: { type: [format] }
}, { _id: false })

const obj = new Schema({
    request: { type: Schema.Types.ObjectId, ref: 'service_requests' },
    patawag_id: { type: String },
    patawag_name: { type: String },
    to: { type: personnel },
    brgy: { type: String },
    responses: { type: [chat] },
    folder_id: { type: String },
    status: { type: String, default: "In Progress", enum: ["In Progress", "Resolved"] },
    isArchived: { type: Boolean, default: false },
}, {
    virtuals: {
        id: { get() { return this._id; } },
    },
    timestamps: true,
});

module.exports = mongoose.model("patawags", obj);
