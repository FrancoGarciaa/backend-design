import TicketModel from "../models/ticket.model.js";
import CartModel from "../models/cart.model.js"; // suponiendo que ya existe
import { v4 as uuidv4 } from "uuid";
import CartService from "../services/cart.service.js";

export const purchaseCart = async (req, res) => {
  const { cid } = req.params;
  const cart = await CartModel.findById(cid).populate("products.product");
  const userEmail = req.user.email;

  const purchasedProducts = [];
  const failedProducts = [];
  let totalAmount = 0;

  for (const item of cart.products) {
    const product = item.product;
    const quantity = item.quantity;

    if (product.stock >= quantity) {
      product.stock -= quantity;
      await product.save();
      totalAmount += product.price * quantity;
      purchasedProducts.push(item);
    } else {
      failedProducts.push(product._id);
    }
  }

  // Crear ticket
  const ticket = await TicketModel.create({
    code: uuidv4(),
    amount: totalAmount,
    purchaser: userEmail
  });

  // Filtrar productos no comprados
  cart.products = cart.products.filter(p =>
    failedProducts.includes(p.product._id)
  );
  await cart.save();

  res.json({
    message: "Compra procesada",
    ticket,
    productos_fallidos: failedProducts
  });

  try {
    const result = await CartService.purchase(req.params.cid, req.user.email);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error al procesar la compra", details: error.message });
  }
};

