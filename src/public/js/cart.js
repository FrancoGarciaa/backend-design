document.addEventListener("DOMContentLoaded", () => {
    const cartId = document.body.dataset.cart;

    if (!cartId) {
    console.warn("No se encontró el cartId en el <body>");
    return;
    }

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
            try {
                const response = await fetch(`/api/carts/${cartId}/products/${pid}`, {
                    method: "DELETE"
                });
                if (!response.ok) {
                    throw new Error('Error al eliminar producto del carrito');
                }
                await response.json();
                const row = btn.closest("tr");
                row.remove();

                const rowsLeft = document.querySelectorAll("table tbody tr").length;
                if (rowsLeft === 0) {
                    const totalPara = document.querySelector("#cart-total")?.closest('p');
                    if (totalPara) totalPara.remove();
                    document.querySelector("table").remove();
                    document.getElementById("btn-empty-cart").remove();
                    document.getElementById("btn-checkout").remove();
                    document.getElementById("btn-back").remove();
                    document.querySelector(".container").insertAdjacentHTML("beforeend", `
                        <p>Tu carrito está vacío</p>
                        <div class="actions">
                        <a href="/home">Volver a la tienda</a>
                        </div>
                    `);
                } else {
                    updateCartTotal();
                }

            } catch (error) {
                console.error('Error al eliminar el producto del carrito', error);
                alert('Hubo un error al eliminar el producto. Intenta nuevamente.');
            }
        });
    });

    const emptyBtn = document.getElementById("btn-empty-cart");
    if (emptyBtn) {
        emptyBtn.addEventListener("click", async () => {
            await fetch(`/api/carts/${cartId}`, { method: "DELETE" });
            location.reload();
        });
    }

    const checkoutBtn = document.getElementById("btn-checkout");
    if (checkoutBtn) {
    checkoutBtn.addEventListener("click", async () => {
        try {
        const res = await fetch(`/api/carts/${cartId}/purchase`, {
            method: "POST",
            credentials: "include"
        });
        if (!res.ok) {
            const error = await res.json();
            alert("Error en la compra: " + error.message);
            return;
        }
        const data = await res.json();
        const tid = data.ticket._id;
        const fallidos = encodeURIComponent(JSON.stringify(data.productos_fallidos || []));
        window.location.href = `/tickets?tid=${tid}&fallidos=${fallidos}`;
        } catch (err) {
        alert("Error inesperado");
        console.error(err);
        }
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

function updateCartTotal() {
    const totalEl = document.querySelector("#cart-total");
    if (!totalEl) return;

    let total = 0;
    document.querySelectorAll("table tbody tr").forEach(row => {
        const price = parseFloat(row.querySelector(".price").innerText.replace("$", ""));
        const qty = parseInt(row.querySelector(".quantity").innerText, 10);
        total += price * qty;
    });
    totalEl.innerText = total.toFixed(2);
}
