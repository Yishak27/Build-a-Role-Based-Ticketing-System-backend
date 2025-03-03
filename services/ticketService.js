const { STATUS } = require("../constants/constant");
const TicketSchema = require("../model/TicketSchema");

class TicketService {
    static async createTicket(params) {
        try {
            const ticket = new TicketSchema(params);
            await ticket.save();
            return {
                status: STATUS.SUCCESS,
                data: ticket
            }
        } catch (error) {
            throw new Error('Something went wrong. Unable to create ticket', error);
        }
    }
}

module.exports = TicketService;