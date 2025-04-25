import TicketDAO from "../dao/models/ticket.dao.js";

class TicketRepository {
async createTicket(data) {
    return await TicketDAO.create(data);
}

async getTicketById(id) {
    return await TicketDAO.getById(id);
}

async getAllTickets() {
    return await TicketDAO.getAll();
}

async deleteTicket(id) {
    return await TicketDAO.delete(id);
}
}

export default new TicketRepository();