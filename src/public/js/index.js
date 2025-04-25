document.addEventListener("DOMContentLoaded", () => {
document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", async (event) => {
    const productId = event.currentTarget.dataset.pid;
    const cartId = event.currentTarget.dataset.cid;

    try {
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: "POST",
        credentials: "include"
        });

        if (response.ok) {
        alert("Producto agregado al carrito!");
        } else {
        alert("Error al agregar el producto al carrito");
        }
    } catch (error) {
        console.error("Error en el fetch:", error);
        alert("Error al procesar la solicitud");
    }
    });
});
});