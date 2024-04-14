const mongoose = require("mongoose");

const memberModel = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    community: {
        type: String,
        ref: "community"
    },
    user: {
        type: String,
        ref: "auth"
    },
    role: {
        type: String,
        ref: "role"
    }
}, {
    timestamps: true,
});

const Member = mongoose.model("member", memberModel);

module.exports = { Member};