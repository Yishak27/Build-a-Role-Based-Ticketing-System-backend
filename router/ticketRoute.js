const express = require('express');
const statusConstant = require('../constants/statusConstant');
const { STATUS } = require('../constants/constant');
const { createTicket } = require('../services/ticketService');
const TicketSchema = require('../model/TicketSchema');
const ticketRoute = express.Router();

ticketRoute.post('/create', async (req, res) => {
    try {
        const { ticketNumber, ticketTitle, ticketDescription, createdBy } = req.body;
        if (!ticketNumber || !ticketTitle || !ticketDescription || !createdBy) {
            return res.status(statusConstant.CREATED).json({
                status: STATUS.FAILED,
                message: "All fields are required"
            });
        }
        const result = await createTicket(req.body);
        if (result && result.status == STATUS.SUCCESS) {
            return res.status(statusConstant.OK).send({
                status: STATUS.SUCCESS,
                message: "Ticket created successfully",
                data: result.data
            })
        } else {
            return res.status(statusConstant.CREATED).json({
                status: STATUS.FAILED,
                message: "Unable to create ticket"
            });
        }
    } catch (error) {
        console.log('Error in creating ticket', error);
        return res.status(statusConstant.INTERNAL_SERVER_ERROR).json({
            status: STATUS.FAILED,
            message: "Internal server error"
        });
    }
});

ticketRoute.get('/getticket/:userName', async (req, res) => {
    try {
        const { userName } = req.params;
        const ticket = await TicketSchema.find({ createdBy: userName });
        if (ticket) {
            return res.status(statusConstant.OK).send({
                status: STATUS.SUCCESS,
                message: "Ticket found",
                data: ticket
            });
        } else {
            return res.status(statusConstant.CREATED).json({
                status: STATUS.FAILED,
                message: "Ticket not found"
            });
        }
    } catch (error) {
        console.log('Error in getting ticket', error);
        return res.status(statusConstant.INTERNAL_SERVER_ERROR).json({
            status: STATUS.FAILED,
            message: "Internal server error"
        });
    }
});
ticketRoute.get('/getAllTicket', async (req, res) => {
    try {
        const ticket = await TicketSchema.find({});
        if (ticket) {
            return res.status(statusConstant.OK).send({
                status: STATUS.SUCCESS,
                message: "Ticket found",
                data: ticket
            });
        } else {
            return res.status(statusConstant.CREATED).json({
                status: STATUS.FAILED,
                message: "Ticket not found"
            });
        }
    } catch (error) {
        console.log('Error in getting ticket', error);
        return res.status(statusConstant.INTERNAL_SERVER_ERROR).json({
            status: STATUS.FAILED,
            message: "Internal server error"
        });
    }
});

ticketRoute.post('/updateTicket/:ticketNumber', async (req, res) => {
    try {
        const { ticketNumber } = req.params;
        const {  ticketStatus } = req.body;
        console.log(ticketNumber, ticketStatus, 'is here...');
        
        if (!ticketStatus) {
            return res.status(statusConstant.CREATED).json({
                status: STATUS.FAILED,
                message: "Ticket status is required"
            });
        }
        const result = await TicketSchema.findOneAndUpdate({ticketNumber: ticketNumber }, { ticketStatus }, { new: true });
        if (result) {
            return res.status(statusConstant.OK).send({
                status: STATUS.SUCCESS,
                message: "Ticket updated successfully",
                data: result
            });
        } else {
            return res.status(statusConstant.CREATED).json({
                status: STATUS.FAILED,
                message: "Ticket not found"
            });
        }
    } catch (error) {
        console.log('Error in updating ticket', error);
        return res.status(statusConstant.INTERNAL_SERVER_ERROR).json({
            status: STATUS.FAILED,
            message: "Internal server error"
        });
    }
})
module.exports = ticketRoute;