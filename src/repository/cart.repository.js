import CartDAO from '../dao/models/cart.dao.js';

class CartRepository {
async getCartById(id) {
    return await CartDAO.getById(id);
}

async update(id, data) {
    return await CartDAO.update(id, data);
}

async createCart(data) {
    return await CartDAO.create(data);
}

async deleteCart(id) {
    return await CartDAO.delete(id);
}

async getCartByUserId(userId) {
    return await CartDAO.getByUserId(userId);
}

}


export default new CartRepository();