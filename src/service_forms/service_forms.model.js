const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const obj = new Schema({
    brgy_info: { type: Schema.Types.ObjectId, ref: 'brgy_info' },
    services: { type: Schema.Types.ObjectId, ref: 'services' },
    service_form_name: { type: String },
    service_form_layout: { type: Schema.Types.Mixed },
    document_form_name: { type: String },
    document_type_name: { type: String },
    details: { type: String },
    punong_brgy: { type: String },
    witnessed_by: { type: String },
    inputs: [{ type: String }],
    isActive: { type: Boolean, default: false }
}, {
    virtuals: {
        id: { get() { return this._id; } },
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
});

module.exports = mongoose.model("service_forms", obj);
