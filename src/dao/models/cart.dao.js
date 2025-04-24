import CartModel from '../../models/cart.model.js';

class CartDAO {
async getById(id) {
    return await CartModel.findById(id).populate('products.product');
}

async update(id, data) {
    return await CartModel.findByIdAndUpdate(id, data, { new: true });
}

async create(data) {
    return await CartModel.create(data);
}

async delete(id) {
    return await CartModel.findByIdAndDelete(id);
}

async getByUserId(userId) {
    return await CartModel.findOne({ user: userId }).populate("products.product");
}

}

export default new CartDAO();
