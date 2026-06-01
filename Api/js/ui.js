import { getToken, logout } from './auth.js';
import { obtenerCarrito } from './carrito.js';

export async function mostrarUsuario() {
    const token = getToken();
    const contenedor = document.getElementById("usuario-nav");

    if (!contenedor) return;


    if (!token) {
        contenedor.innerHTML = `<a href="/login">Login</a>`;
        return;
    }

    try {
        const res = await fetch("http://localhost:8080/auth/me", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!res.ok) {
            localStorage.removeItem("token");
            contenedor.innerHTML = `<a href="/login">Login</a>`;
            return;
        }

        const data = await res.json();

        contenedor.innerHTML = `
            <span>Hola, ${data.user.nombre}</span>
             ${data.user.role === 'admin' ? `
            <a href="/admin" class="btn-admin">Administrar</a>
            ` : ""}

        <button id="logoutBtn">Salir</button>
    `;

        document
            .getElementById("logoutBtn")
            .addEventListener("click", logout);

    } catch (error) {
        console.error("Error usuario:", error);
        contenedor.innerHTML = `<a href="/login">Login</a>`;
    }
}


export async function actualizarContador() {
    const contador = document.getElementById("contador-carrito");

    if (!contador) return;

    try {
        const data = await obtenerCarrito();

        if (!data || !data.carrito) {
            contador.innerText = "0";
            return;
        }

        const totalItems = data.carrito.items.reduce(
            (acc, item) => acc + item.cantidad,
            0
        );

        contador.innerText = totalItems;

    } catch (error) {
        console.error("Error carrito:", error);
        contador.innerText = "0";
    }
}