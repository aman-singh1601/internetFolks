const mongoose = require("mongoose");

const communityModel = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    owner: {
        type: String,
        ref: "auth",
    }
}, {
    timestamps: true,
});

const Community = mongoose.model("community", communityModel);

module.exports = {Community};