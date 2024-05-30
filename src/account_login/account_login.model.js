const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const obj = new Schema({
    user_id: { type: String, required: true, index: true },
    email: {
        type: String, required: true, index: true, validate: [
            (val) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val),
        ],
    },
    contact: { type: String, required: true, index: true },
    username: { type: String, required: true, index: true },
    password: { type: String, required: true, index: true },
    account_type: { type: String, required: true, index: true, enum: ['Head Admin', 'Brgy Admin', 'Staff', 'Resident'] },
    acc_status: { type: String, required: true, index: true, enum: ['For Review', 'Partially Verified', 'Fully Verified', 'Denied'] },
    isArchived: { type: Boolean, required: true, index: true, default: false },
    otp: { type: String },
    pin: { type: String },
    brgy: { type: String, required: true },
    profile: { type: Schema.Types.ObjectId, ref: 'profile' },
}, {
    virtuals: {
        id: { get() { return this._id; } },
        brgy: { get() { return this.brgy.toUpperCase(); } }
    },
    timestamps: true,
});

module.exports = mongoose.model("account_login", obj);
