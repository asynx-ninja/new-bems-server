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
    doc_title: { type: String },
    date: { type: Date },
    usapin_blg: { type: String },
    reason: { type: String },
    patawag: { type: String },
    complainant: { type: Schema.Types.ObjectId, ref: 'profile' },
    defendant: { type: Schema.Types.ObjectId, ref: 'profile' },
    message: { type: [String] },
    bcpc_vawc: { type: String },
    brgy_info: { type: Schema.Types.ObjectId, ref: 'brgy_info'},
}, {
    virtuals: {
        id: { get() { return this._id; } },
    },
    timestamps: true,
});

module.exports = mongoose.model("patawag_doc", obj);
