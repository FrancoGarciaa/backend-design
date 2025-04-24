document.addEventListener("DOMContentLoaded", () => {
    const cartId = document.body.dataset.cart;

    if (!cartId) {
    console.warn(" No se encontró el cartId en el <body>");
    return;
    }

    document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", async (event) => {

        const productId = event.currentTarget.dataset.pid;
        const cartId = event.currentTarget.dataset.cid;

        console.log("Info del click:", { cartId, productId });

        alert(`Probando click: Cart ID ${cartId}, Product ID ${productId}`);

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

    document.querySelectorAll(".btn-increase").forEach(btn => {
    btn.addEventListener("click", async () => {
        const pid = btn.dataset.id;
        await updateProductQuantity(cartId, pid, 1);
    });
    });

    document.querySelectorAll(".btn-decrease").forEach(btn => {
    btn.addEventListener("click", async () => {
        const pid = btn.dataset.id;
        await updateProductQuantity(cartId, pid, -1);
    });
    });

    document.querySelectorAll(".btn-delete").forEach(btn => {
    btn.addEventListener("click", async () => {
        const pid = btn.dataset.id;
        await fetch(`/api/carts/${cartId}/products/${pid}`, {
        method: "DELETE"
        });
        location.reload();
    });
    });

    const emptyBtn = document.getElementById("btn-empty-cart");
    if (emptyBtn) {
    emptyBtn.addEventListener("click", async () => {
        await fetch(`/api/carts/${cartId}`, {
        method: "DELETE"
        });
        location.reload();
    });
    }

    const checkoutBtn = document.getElementById("btn-checkout");
    if (checkoutBtn) {
    checkoutBtn.addEventListener("click", async () => {
        window.location.href = `/api/carts/${cartId}/purchase`;
    });
    }
});

async function updateProductQuantity(cartId, productId, change) {
    await fetch(`/api/carts/${cartId}/products/${productId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity: change })
    });
    location.reload();
}