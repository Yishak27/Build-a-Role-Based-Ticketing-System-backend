const mongoose = require('mongoose');
const TicketSchema = mongoose.Schema({
    ticketNumber: {
        type: String,
        required: true,
    },
    ticketTitle: {
        type: String,
        required: true,
    },
    ticketDescription: {
        type: String,
        required: true,
    },
    ticketStatus: {
        type: String,
        required: false,
        enum: ["open", "closed", "onprogress"],
        default: "onprogress"
    },
    createdBy: {
        type: String,
        required: true
    },
    ticketCreatedDate: {
        type: Date,
        required: false,
        default: new Date()
    },
    ticketUpdatedDate: {
        type: Date,
        required: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ticket', TicketSchema);