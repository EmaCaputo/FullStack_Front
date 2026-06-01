import { getToken } from './auth.js';

const API_URL = "http://localhost:8080/carrito";

export async function agregarAlCarrito(productoId, cantidad) {
    const token = localStorage.getItem("token");

    await fetch("http://localhost:8080/carrito", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            productoId,
            cantidad
        })
    });
    
}

export async function obtenerCarrito() {
    const token = getToken();

    if (!token) return null;

    const res = await fetch(API_URL, {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data;
}

export async function eliminarDelCarrito(productoId) {
    const token = getToken();

    await fetch(`http://localhost:8080/carrito/${productoId}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    });
}

export async function vaciarCarrito() {
    const token = localStorage.getItem("token");

    await fetch("http://localhost:8080/carrito/vaciar", {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    });
}



