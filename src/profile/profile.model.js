const mongoose = require("mongoose");
const moment = require("moment");

const Schema = mongoose.Schema;

const address = new Schema({
    street: { type: String, uppercase: true },
    brgy: { type: String, uppercase: true, index: true },
    city: { type: String, uppercase: true },
}, { _id: false });

const file = new Schema({
    link: { type: String },
    id: { type: String },
    name: { type: String }
}, { _id: false });

const struct = new Schema({
    link: { type: String, default: "" },
    name: { type: String, default: "" },
}, { _id: false });

const socials = new Schema({
    facebook: { type: struct },
    instagram: { type: struct },
    twitter: { type: struct },
}, { _id: false });

const verification = new Schema({
    user_folder_id: { type: String, default: "" },
    primary_id: { type: String, default: "" },
    primary_file: { type: [file] },
    secondary_id: { type: String, default: "" },
    secondary_file: { type: [file] },
    selfie: { type: file },
}, { _id: false })

const obj = new Schema({
    firstName: { type: String },
    middleName: { type: String },
    lastName: { type: String },
    suffix: { type: String },
    religion: { type: String },
    birthday: { type: Date },
    age: { type: Number },
    sex: { type: String, enum: ['Male', 'Female'] },
    address: { type: address },
    occupation: { type: String },
    civil_status: { type: String, enum: ['Single', 'Married', 'Widowed', 'Legally Separated'] },
    isVoter: { type: Boolean, default: false },
    isHead: { type: Boolean, default: false },
    avatar: { type: file },
    socials: { type: socials },
    verification: { type: verification }
}, {
    virtuals: {
        id: { get() { return this._id; } },
        fullName: { get() { return `${this.firstName} ${this.middleName} ${this.lastName} ${this.suffix}`; } },
        age: { get() { return this.birthday ? moment().diff(this.birthday, 'years', false) : 0; } },
        fullAddress: { get() { return `${this.address.street} ${this.address.brgy} ${this.address.city}, Philippines` } }
    },
    timestamps: true,
});

module.exports = mongoose.model("profile", obj);
