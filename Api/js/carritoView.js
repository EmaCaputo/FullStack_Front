import { getToken } from './auth.js';
import { eliminarDelCarrito } from './carrito.js';
import { vaciarCarrito as vaciarCarritoAPI } from './carrito.js';
import { obtenerCarrito } from './carrito.js';

const API_URL = "http://localhost:8080/carrito";

document.addEventListener("DOMContentLoaded", () => {
    cargarCarrito();

    const btn = document.getElementById("vaciarCarritoBtn");

    if (btn) {
        btn.addEventListener("click", async () => {
            await vaciarCarritoAPI();
            cargarCarrito();
        });
    }
});


async function cargarCarrito() {
    
    const token = getToken();

    if (!token) {
        alert("Tenés que iniciar sesión");
        window.location.href = "/login";
        return;
    }

    try {
        const res = await fetch(API_URL, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!res.ok) {
            console.error("Error al obtener carrito");
            return;
        }

        const data = await res.json();


        const contenedor = document.getElementById("lista-carrito");
        const totalHTML = document.getElementById("total");

        contenedor.innerHTML = "";

        let total = 0;

        const items = data.carrito?.items || data.items;

        if (!items || items.length === 0) {
            contenedor.innerHTML = "<p>El carrito está vacío</p>";
            totalHTML.innerText = "Total: $0";
            return;
            }

        items.forEach(item => {

            const precio = item.productoId.precio;
            const subtotal = precio * item.cantidad;

            total += subtotal;

            const div = document.createElement("div");

            div.innerHTML = `
                <div class="carrito-item">
                    <div class="info">
                        <h4>${item.productoId.nombre}</h4>
                        <p>Cantidad: ${item.cantidad}</p>
                    </div>

                    <div class="precio">
                        <p>$${precio}</p>
                        <strong>$${subtotal}</strong>
                    </div>

                    <button onclick="eliminarItem('${item.productoId._id}')">
                        ❌
                    </button>
                </div>
            `;

            contenedor.appendChild(div);
        });

        totalHTML.innerText = `Total: $${total}`;

    } catch (error) {
        console.error(error);
    }
}

window.eliminarItem = async function(productoId) {

    await eliminarDelCarrito(productoId);

    await cargarCarrito(); 
};

window.finalizarCompra = async function() {
    const response = await obtenerCarrito();
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    
    const carrito = response.carrito;
    const items = carrito.items;

     if (!items || items.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    const nombre = usuario.user.nombre;

    let mensaje = "Hola! Quiero hacer un pedido:%0A%0A";

    mensaje += "👤 Cliente: " + nombre + "%0A%0A";

    items.forEach(prod => {
        mensaje += `🛒 ${prod.nombre} - Cantidad: ${prod.cantidad}%0A`;
    });

    let total = 0;
    items.forEach(prod => {
        total += prod.precio * prod.cantidad;
    });

    mensaje += "%0A💰 Total: $" + total;

    const telefono = "5491122787061"; 

    const url = `https://wa.me/${telefono}?text=${mensaje}`;

    window.open(url, "_blank");
}

