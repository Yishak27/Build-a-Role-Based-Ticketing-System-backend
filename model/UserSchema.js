const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        require: false,
    },
    phoneNumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        require: false,
    },
    isActive: {
        type: Boolean,
        default: true,
        require: false,
    },
    isLocked: {
        type: Boolean,
        default: false,
        require: false,
    },
    lastLogin: {
        type: Date,
        require: false
    },
    token: {
        type: String,
        require: false
    },
    roleCode: [{
        type: String,
        require: false,
        enum: ["user", "admin", "superadmin"]
    }],
    status: {
        type: String,
        enum: ["Active", "Pending", "Inactive"],
        default: "Active"
    },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);