import CartRepository from "../repository/cart.repository.js";
import ProductRepository from "../repository/product.repository.js";
import TicketModel from "../models/ticket.model.js";
import { generateUniqueCode } from "../utils/codeGenerator.js";

class CartService {
static async purchase(cartId, userEmail) {
    const cart = await CartRepository.getCartById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    const productsToBuy = [];
    const productsOutOfStock = [];

    for (const item of cart.products) {
    const product = await ProductRepository.getById(item.product);
    if (!product) continue;

    if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await ProductRepository.update(product._id, { stock: product.stock });
        productsToBuy.push({ product, quantity: item.quantity });
    } else {
        productsOutOfStock.push({
        product: product._id,
        requested: item.quantity,
        available: product.stock,
        });
    }
    }

    const totalAmount = productsToBuy.reduce(
      (sum, p) => sum + p.product.price * p.quantity,
    0
    );

    const ticket = await TicketModel.create({
    code: await generateUniqueCode(),
    amount: totalAmount,
    purchaser: userEmail,
    });

    cart.products = cart.products.filter((item) =>
    productsOutOfStock.some((p) => p.product.equals(item.product))
    );
    await CartRepository.update(cart._id, { products: cart.products });

    return {
    ticket,
    outOfStockProducts: productsOutOfStock,
    };
}

static async addProductToCart(userId, productId) {
    const cart = await CartRepository.getCartByUserId(userId);
    if (!cart) throw new Error("Carrito no encontrado");

    const product = await ProductRepository.getById(productId);
    if (!product) throw new Error("Producto no encontrado");

    const existingProductIndex = cart.products.findIndex((item) => {
    const id = item.product._id || item.product;
    return id.toString() === productId.toString();
    });

    if (existingProductIndex !== -1) {
    cart.products[existingProductIndex].quantity += 1;
    } else {
    cart.products.push({ product: productId, quantity: 1 });
    }

    await CartRepository.update(cart._id, { products: cart.products });
    return cart;
}

static async updateProductQuantity(userId, productId, change) {
    const cart = await CartRepository.getCartByUserId(userId);
    if (!cart) throw new Error("Carrito no encontrado");

    const index = cart.products.findIndex((item) => {
    const id = item.product._id || item.product;
    return id.toString() === productId.toString();
    });

    if (index === -1) throw new Error("Producto no encontrado en el carrito");

    cart.products[index].quantity += change;

    if (cart.products[index].quantity <= 0) {
    cart.products.splice(index, 1);
    }

    await CartRepository.update(cart._id, { products: cart.products });
    return cart;
}

static async clearCart(cartId) {
    const cart = await CartRepository.getCartById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    cart.products = [];
    await CartRepository.update(cart._id, { products: [] });
    return cart;
}

static async removeProduct(cartId, productId) {
    const cart = await CartRepository.getCartById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");
    console.log(
    "Antes:",
    cart.products.map(item => item.product._id.toString())
    );
    const filtered = cart.products.filter(item => {
    return item.product._id.toString() !== productId;
    });
    console.log(
    "Después:",
    filtered.map(item => item.product._id.toString())
    );
    if (filtered.length !== cart.products.length) {
    const newProducts = filtered.map(item => ({
        product: item.product._id, 
        quantity: item.quantity
    }));
    return await CartRepository.update(cartId, { products: newProducts });
    }
    return cart;}
}

export default CartService;