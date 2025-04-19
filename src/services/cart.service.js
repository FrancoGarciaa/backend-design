// services/cart.service.js
import CartRepository from '../repository/cart.repository.js';
import ProductRepository from '../repository/product.repository.js';
import TicketModel from '../models/ticket.model.js';
import { generateUniqueCode } from '../utils/codeGenerator.js';

class CartService {
static async purchase(cartId, userEmail) {
    const cart = await CartRepository.getCartById(cartId);
    if (!cart) throw new Error('Carrito no encontrado');

    const productsToBuy = [];
    const productsOutOfStock = [];

    for (const item of cart.products) {
    const product = await ProductRepository.getById(item.product._id);

    if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await ProductRepository.update(product._id, { stock: product.stock });
        productsToBuy.push({ product, quantity: item.quantity });
    } else {
        productsOutOfStock.push({ product: product._id, requested: item.quantity, available: product.stock });
    }
    }

    const totalAmount = productsToBuy.reduce((sum, p) => sum + p.product.price * p.quantity, 0);

    const ticket = await TicketModel.create({
    code: await generateUniqueCode(),
    amount: totalAmount,
    purchaser: userEmail,
    });

    // Limpiar del carrito los productos que sí se compraron
    cart.products = cart.products.filter(item =>
    productsOutOfStock.some(p => p.product.equals(item.product))
    );
    await CartRepository.update(cart._id, { products: cart.products });

    return {
    ticket,
    outOfStockProducts: productsOutOfStock,
    };
}
}

export default CartService;