import CartDAO from "../dao/models/cart.dao.js";

class CartRepository {
    getCartById(id) {
        return CartDAO.getById(id);
    }

async update(id, data) {
    return await CartDAO.update(id, data);
}

async create(data) {
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