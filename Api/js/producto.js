const API_URL = "http://localhost:8080/productos";

export async function obtenerProductos() {
    const res = await fetch(API_URL);
    return res.json();
}