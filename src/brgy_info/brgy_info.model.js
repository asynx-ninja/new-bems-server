const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const file = new Schema({
    link: { type: String },
    id: { type: String },
    name: { type: String }
}, { _id: false });

const theme = new Schema({
    primary_bg: { type: String },
    secondary_bg: { type: String },
    accent_colors: { type: [String] },
}, { _id: false });

const obj = new Schema({
    story: { type: String },
    mission: { type: String },
    vision: { type: String },
    brgy: { type: String },
    email: { type: String },
    address: { type: String },
    tel_no: { type: String },
    banner: { type: file },
    logo: { type: file },
    theme: { type: theme }
}, {
    virtuals: {
        id: { get() { return this._id; } },
        brgy: { get() { return this.brgy.toUpperCase(); } }
    },
    timestamps: true,
});

module.exports = mongoose.model("brgy_info", obj);
