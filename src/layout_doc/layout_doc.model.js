const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const obj = new Schema({
    brgy_info: { type: Schema.Types.ObjectId, ref: 'brgy_info' },
    service: { type: Schema.Types.ObjectId, ref: 'services' },
    doc_title: { type: String },
    doc_type: { type: String },
    details: { type: String },
    punong_brgy: { type: String },
    witnessed_by: { type: String },
    inputs: { type: [String] },
    isActive: { type: Boolean, default: false },
}, {
    virtuals: {
        id: { get() { return this._id; } },
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
});

module.exports = mongoose.model("layout_doc", obj);
