const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const obj = new Schema({
    request: { type: Schema.Types.ObjectId, ref: 'service_requests' },
    doc_title: { type: String },
    date: { type: Date },
    usapin_blg: { type: String },
    reason: { type: String },
    patawag: { type: String },
    complainant: [{ type: Schema.Types.ObjectId, ref: 'profile' }],
    defendant: [{ type: Schema.Types.ObjectId, ref: 'profile' }],
    message: { type: [String] },
    bcpc_vawc: { type: String },
    brgy_info: { type: Schema.Types.ObjectId, ref: 'brgy_info' },
}, {
    virtuals: {
        id: { get() { return this._id; } },
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
});

module.exports = mongoose.model("patawag_doc", obj);
