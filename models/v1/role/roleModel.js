const mongoose = require("mongoose");

const roleModel = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        ref: "community"
    },
}, {
    timestamps: true,
});

const Role = mongoose.model("role", roleModel);

module.exports = {Role};