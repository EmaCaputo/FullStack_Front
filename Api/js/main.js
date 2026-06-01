import { agregarAlCarrito } from './carrito.js';
import { mostrarUsuario, actualizarContador } from './ui.js';
import { isAuthenticated } from './auth.js';


window.agregarAlCarrito = async function(productoId) {
    if (!isAuthenticated()) {
        alert("Tenés que iniciar sesión");
        window.location.href = "/login";
        return;
    }

    await agregarAlCarrito(productoId);
    await actualizarContador();
};

document.addEventListener("DOMContentLoaded", () => {

    mostrarUsuario();

    if (isAuthenticated()) {
        actualizarContador(); 
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.querySelector(".menu-toggle");
    const menu = document.querySelector(".menu");

    if (toggle && menu) {
        toggle.addEventListener("click", () => {
            menu.classList.toggle("active");
        });
    }
});