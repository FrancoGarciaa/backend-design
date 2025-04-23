import CartService from "../services/cart.service.js";
import { sendMail } from "../utils/mailer.js";

export const purchaseCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const userEmail = req.user.email;

    const result = await CartService.purchase(cid, userEmail);
    const { ticket, outOfStockProducts } = result;

    await sendMail({
      to: userEmail,
      subject: '¡Gracias por tu compra!',
      html: `
        <h2>Compra confirmada</h2>
        <p><strong>Código del ticket:</strong> ${ticket.code}</p>
        <p><strong>Fecha:</strong> ${ticket.purchase_datetime}</p>
        <p><strong>Total:</strong> $${ticket.amount}</p>
        <p>Gracias por comprar en nuestra tienda de celulares.</p>
      `
    });

    res.redirect(`/tickets?tid=${ticket._id}`);
    
  } catch (error) {
    res.status(500).json({
      error: "Error al procesar la compra",
      details: error.message
    });
  }
};

export const addProductToCart = async (req, res) => {
  const { cid, pid } = req.params;

  try {
    await CartService.addProduct(cid, pid);
    res.redirect("/home");
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    res.status(500).send("Error al agregar producto al carrito");
  }
};
