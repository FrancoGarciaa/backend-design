import CartService from "../services/cart.service.js";

export const purchaseCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const userEmail = req.user.email;

    const result = await CartService.purchase(cid, userEmail);

    res.json({
      message: "Compra procesada",
      ticket: result.ticket,
      productos_fallidos: result.outOfStockProducts
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al procesar la compra",
      details: error.message
    });
  }
};