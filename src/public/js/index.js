document.addEventListener("DOMContentLoaded", () => {
    const cartId = document.body.dataset.cart;

    if (!cartId) return;

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