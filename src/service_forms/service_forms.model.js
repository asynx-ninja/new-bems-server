const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const obj = new Schema({
    services: { type: Schema.Types.ObjectId, ref: 'services' },
    form_name: { type: String },
    form: { type: Schema.Types.Mixed },
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
