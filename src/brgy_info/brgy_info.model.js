const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const file = new Schema({
    link: { type: String },
    id: { type: String },
    name: { type: String }
}, { _id: false });

const theme = new Schema({
    name: { type: String },
    scheme: {
        bg_primary: { type: String },
        primary: { type: String },
        secondary: { type: String },
        accent: { type: String },
        neutral: { type: String },
        text: { type: String },
    }
}, { _id: false });

const obj = new Schema({
    story: { type: String },
    mission: { type: String },
    vision: { type: String },
    brgy: { type: String, uppercase: true, index: true },
    email: { type: String },
    address: { type: String },
    tel_no: { type: String },
    banner: { type: file },
    logo: { type: file },
    theme: { type: theme }
}, {
    virtuals: {
        id: { get() { return this._id; } },
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
});

module.exports = mongoose.model("brgy_info", obj);
