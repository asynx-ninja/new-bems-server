const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const obj = new Schema({
    event: { type: Schema.Types.ObjectId, ref: 'events' },
    form_title: { type: String },
    form: { type: Schema.Types.Mixed },
    isActive: { type: Boolean, default: false }
}, {
    virtuals: {
        id: { get() { return this._id; } },
    },
    timestamps: true,
});

module.exports = mongoose.model("event_forms", obj);
