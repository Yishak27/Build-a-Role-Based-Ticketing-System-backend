const express = require('express');
const statusConstant = require('../constants/statusConstant');
const { STATUS } = require('../constants/constant');
const { createTicket } = require('../services/ticketService');
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

module.exports = ticketRoute;