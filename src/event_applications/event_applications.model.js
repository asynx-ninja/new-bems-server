const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const file = new Schema({
    link: { type: String },
    id: { type: String },
    name: { type: String }
}, { _id: false });


const obj = new Schema({
    event_form: { type: Schema.Types.ObjectId, ref: 'event_forms' },
    application_id: { type: String },
    files: { type: [file] },
    status: { type: String, default: 'For Review', enum: ['For Review', 'Cancelled', 'Rejected', 'Approved'] },
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

module.exports = mongoose.model("event_applications", obj);
