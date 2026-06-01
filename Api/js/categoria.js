const API_URL = "http://localhost:8080/categorias";

export async function obtenerCategorias() {
    const res = await fetch(API_URL);
    return res.json();
}