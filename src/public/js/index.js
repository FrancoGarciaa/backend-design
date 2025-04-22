document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.add-to-cart');

    buttons.forEach(button => {
    button.addEventListener('click', async () => {
        const productId = button.dataset.pid;
        const cartId = button.dataset.cid;

        try {
        const res = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'POST',
            credentials: 'include'
        });

        if (res.ok) {
            alert('Producto agregado al carrito!');
        } else if (res.status === 401) {
            alert('Debes iniciar sesión para agregar productos al carrito.');
        } else {
            alert('Error al agregar producto al carrito');
        }
        } catch (err) {
        console.error('Error al agregar producto:', err);
        alert('Hubo un problema al procesar tu solicitud.');
        }
    });
    });
});