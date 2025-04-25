import CartModel from "../../models/cart.model.js";
import mongoose from "mongoose";

class CartDAO {
async getById(id) {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("ID inválido");
        }

        return await CartModel.findById(id)
            .populate("products.product")
            .lean();
    } catch (error) {
        throw new Error(`Error al obtener el carrito por ID: ${error.message}`);
    }
}

async getByUserId(userId) {
    try {
    return await CartModel.findOne({ user: userId })
        .populate("products.product")
        .lean();
    } catch (error) {
    throw new Error(`Error al obtener el carrito por usuario: ${error.message}`);
    }
}

async create(data) {
    try {
    return await CartModel.create(data);
    } catch (error) {
    throw new Error(`Error al crear el carrito: ${error.message}`);
    }       
}

async update(id, data) {
    try {
        return await CartModel.findByIdAndUpdate(id, { $set: data }, { new: true });
    } catch (error) {
        throw new Error(`Error al actualizar el carrito: ${error.message}`);
    }
}

async delete(id) {
    try {
    return await CartModel.findByIdAndDelete(id);
    } catch (error) {
    throw new Error(`Error al eliminar el carrito: ${error.message}`);
    }
}
}

export default new CartDAO();
