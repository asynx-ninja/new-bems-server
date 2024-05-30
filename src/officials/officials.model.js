const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const file = new Schema({
    link: { type: String },
    id: { type: String },
    name: { type: String }
}, { _id: false });

const obj = new Schema({
    picture: { type: file },
    firstName: { type: String },
    middleName: { type: String },
    lastName: { type: String },
    suffix: { type: String },
    position: { type: String },
    fromYear: { type: Date },
    toYear: { type: Date },
    isArchived: { type: Boolean, default: false },
    area: { type: String }
}, {
    virtuals: {
        id: { get() { return this._id; } },
        fullName: { get() { return `${this.firstName} ${this.middleName[0]}. ${this.lastName} ${this.suffix}`; } },
    },
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
    timestamps: true,
});

module.exports = mongoose.model("officials", obj);
