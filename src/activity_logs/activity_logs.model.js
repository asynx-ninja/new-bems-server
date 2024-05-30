const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const obj = new Schema({
    event: { type: String },
    action: { type: String },
    ip: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'account_login' },
    protocol: { type: String },
    payload: { type: String },
    session_id: { type: String },
}, {
    virtuals: {
        id: { get() { return this._id; } },
    },
    timestamps: true,
});

module.exports = mongoose.model("activity_logs", obj);
