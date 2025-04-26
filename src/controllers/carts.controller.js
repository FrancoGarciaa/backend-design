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
      subject: "¡Gracias por tu compra!",
      html: `
        <h2>Compra confirmada</h2>
        <p><strong>Código del ticket:</strong> ${ticket.code}</p>
        <p><strong>Fecha:</strong> ${ticket.purchase_datetime}</p>
        <p><strong>Total:</strong> $${ticket.amount}</p>
        <p><strong>Productos:</strong></p>
          <ul>
            ${ticket.products.map(p => `<li>${p.name} x${p.quantity}</li>`).join("")}
          </ul>
        <p>Gracias por comprar en nuestra tienda de celulares.</p>
      `
    });

    res.status(200).json({
      ticket,
      productos_fallidos: outOfStockProducts
    });
    
  } catch (error) {
    res.status(500).json({
      error: "Error al procesar la compra",
      details: error.message
    });
  }
};

export const addProductToCart = async (req, res) => {
  const { pid } = req.params;
  const userId = req.user._id;
  try {
    await CartService.addProductToCart(userId, pid);
    res.status(200).json({ message: "Producto agregado al carrito" });
  } catch (error) {
    console.error("Error al agregar el producto al carrito", error);
    res.status(500).json({ message: "Error al agregar el producto al carrito" });
  }
};  

export const updateProductQuantity = async (req, res) => {
  const { pid } = req.params; 
  const { quantity } = req.body;
  const userId = req.user._id; 

  try {
      const cart = await CartService.updateProductQuantity(userId, pid, quantity);
      res.status(200).json({ message: "Cantidad actualizada", cart });
  } catch (error) {
      console.error("Error al actualizar la cantidad del producto", error);
      res.status(500).json({ message: "Error al actualizar la cantidad", error: error.message });
  }
};
export const deleteProductFromCart = async (req, res) => {
  const { cid, pid } = req.params;
  console.log("Parametros recibidos:", { cartId: cid, productId: pid });

  try {
    const updatedCart = await CartService.removeProduct(cid, pid);
    res.json({ message: "Producto eliminado del carrito", cart: updatedCart });
  } catch (error) {
      console.error("Error eliminando producto:", error);
      res.status(500).json({ error: "No se pudo eliminar el producto" });
  }
};
export const deleteCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const result = await CartService.clearCart(cartId);
    res.json({ status: "success", payload: result });
  } catch (error) {
    console.error("Error al vaciar carrito", error);
    res.status(500).json({ error: error.message });
  }
};