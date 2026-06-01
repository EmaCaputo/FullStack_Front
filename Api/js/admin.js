import { getToken } from "./auth.js";

const API_PRODUCTOS = "http://localhost:8080/productos";
const API_CATEGORIAS = "http://localhost:8080/categorias";
const API_COLORES = "http://localhost:8080/colores";
const API_TIPOS = "http://localhost:8080/tipos";


document.addEventListener("DOMContentLoaded", async () => {
    await cargarSelects();
});

document.addEventListener("DOMContentLoaded", async () => {
    await cargarSelects();
    await cargarProductos();
});

async function cargarSelects() {
    try {
        const categorias = await fetch(API_CATEGORIAS).then(r => r.json());
        const colores = await fetch(API_COLORES).then(r => r.json());
        const tipos = await fetch(API_TIPOS).then(r => r.json());

        llenarSelect("categoria", categorias.categorias);
        llenarSelect("tipo", tipos.tipos);
        llenarSelect("color", colores.colors);

    } catch (error) {
        console.error("Error cargando selects:", error);
    }
}

document.getElementById("productoForm")
.addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = document.getElementById("productoForm");
    const id = form.dataset.id;

    const producto = {
        nombre: document.getElementById("nombre").value,
        marca: document.getElementById("marca").value,
        modelo: document.getElementById("modelo").value,
        precio: Number(document.getElementById("precio").value),
        stock: Number(document.getElementById("stock").value),
        talle: document.getElementById("talle").value,
        imagen: document.getElementById("imagen").value,
        categoria: document.getElementById("categoria").value,
        tipo: document.getElementById("tipo").value,
        color: document.getElementById("color").value
    };

    const token = getToken();
    let res;

    if (id) {
        res = await fetch(`${API_PRODUCTOS}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(producto)
        });
    } else {
        res = await fetch(API_PRODUCTOS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(producto)
        });
    }

    if (res.ok) {
        alert(id ? "Producto actualizado" : "Producto creado");

        form.reset();
        delete form.dataset.id;

        document.getElementById("btn-submit").innerText = "Crear producto";
        document.getElementById("titulo-form").innerText = "Crear producto";

        cargarProductos();

    } else {
        alert("Error");
    }
});

function llenarSelect(id, lista) {
    const select = document.getElementById(id);


    if (!select || !lista) {
        console.warn("Falta select o lista:", id);
        return;
    }

    select.innerHTML = `<option value="">Seleccionar ${id}</option>`;

    lista.forEach(item => {
        const option = document.createElement("option");
        option.value = item._id;
        option.textContent = item.nombre;
        select.appendChild(option);
    });
}

async function cargarProductos() {
    const res = await fetch(API_PRODUCTOS);
    const data = await res.json();

    const lista = document.getElementById("lista-productos");
    lista.innerHTML = "";

    data.productos.forEach(p => {
        const div = document.createElement("div");
        div.classList.add("producto-item");

        div.innerHTML = `
            <span>
            ${p.nombre} - ${p.color?.nombre || ''} - $${p.precio}
            </span>

            <div>
                <button onclick="editarProducto('${p._id}')">✏️</button>
                <button onclick="eliminarProducto('${p._id}')">🗑️</button>
            </div>
        `;

        lista.appendChild(div);
    });
}

window.editarProducto = function(id) {
    fetch(`${API_PRODUCTOS}/${id}`)
        .then(res => res.json())
        .then(data => {
            const p = data.producto;

            document.getElementById("nombre").value = p.nombre;
            document.getElementById("marca").value = p.marca;
            document.getElementById("modelo").value = p.modelo;
            document.getElementById("precio").value = p.precio;
            document.getElementById("stock").value = p.stock;
            document.getElementById("talle").value = p.talle;
            document.getElementById("imagen").value = p.imagen;

            // 🔥 CLAVE
            document.getElementById("categoria").value = p.categoria;

            document.getElementById("tipo").value =
                p.tipo?._id || p.tipo;

            document.getElementById("color").value =
                p.color?._id || p.color;

            document.getElementById("productoForm").dataset.id = p._id;
            document.getElementById("titulo-form").innerText = "Editar producto";
            document.getElementById("btn-submit").innerText = "Actualizar producto";
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
};

window.eliminarProducto = async function(id) {
    const token = getToken();

    if (!confirm("¿Eliminar producto?")) return;

    await fetch(`${API_PRODUCTOS}/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    cargarProductos();
};