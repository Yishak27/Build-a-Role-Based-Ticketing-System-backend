const mongoose = require('mongoose');
const AttemptSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    attempt: {
        type: Number,
        required: true,
        default: 1,
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('attempt', AttemptSchema);