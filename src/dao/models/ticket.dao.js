import TicketModel from '../../models/ticket.model.js';

class TicketDAO {
async create(data) {
    return await TicketModel.create(data);
}

async getById(id) {
    return await TicketModel.findById(id);
}

async getAll() {
    return await TicketModel.find();
}

async delete(id) {
    return await TicketModel.findByIdAndDelete(id);
}

async getByUserEmail(email) {
    return await TicketModel.findOne({ purchaser: email }).lean();
}

}

export default new TicketDAO();