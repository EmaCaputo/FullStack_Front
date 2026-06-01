import { obtenerProductos } from './producto.js';
import { obtenerCategorias } from './categoria.js';
import { agregarAlCarrito } from './carrito.js';
import { isAuthenticated } from './auth.js';

const cantidades = {};
const stockDisponibleMap = {};

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const path = window.location.pathname
            .replaceAll("/", "")
            .toLowerCase();

        const dataCategorias = await obtenerCategorias();
        if (!dataCategorias.categorias) return;

        const categoria = dataCategorias.categorias.find(c =>
            c.nombre.toLowerCase() === path
        );

        if (!categoria) {
            console.warn("Categoría no encontrada");
            return;
        }

        const categoriaId = categoria._id;

        const dataProductos = await obtenerProductos();
        if (!dataProductos.productos) return;

        const productosFiltrados = dataProductos.productos.filter(p =>
            (p.categoria?._id || p.categoria) === categoriaId
        );

        renderProductos(productosFiltrados);

        document.querySelector("h2").innerText = categoria.nombre;

    } catch (error) {
        console.error("Error:", error);
    }
});

function renderProductos(productos) {
    const contenedor = document.getElementById("contenedor-productos");
    const estaLogueado = isAuthenticated();
    if (!contenedor) return;

    contenedor.innerHTML = "";

    productos.forEach(prod => {

        const stockDisponible = prod.stock - (prod.stockReservado || 0);

        cantidades[prod._id] = 1;
        stockDisponibleMap[prod._id] = stockDisponible;

        const div = document.createElement("div");
        div.classList.add("item-producto");

        div.innerHTML = `
            <img src="/images/${prod.imagen || 'default.jpg'}">

            <h3>${prod.nombre}</h3>
            <p>${prod.marca}</p>

            <p>Color: ${prod.color?.nombre || prod.color}</p>

            <p>Stock disponible: ${stockDisponible}</p>

            <h4>
                ${prod.precio.toLocaleString('es-AR', {
                    style: 'currency',
                    currency: 'ARS'
                })}
            </h4>

            <div class="cantidad-control">
                <button onclick="cambiarCantidad('${prod._id}', -1)">-</button>
                <span id="cant-${prod._id}">1</span>
                <button onclick="cambiarCantidad('${prod._id}', 1)">+</button>
            </div>

            <button onclick="${
                estaLogueado 
                ? `agregarProductoConCantidad('${prod._id}')` 
                : `window.location.href='/login'`
            }">
                ${estaLogueado ? 'Agregar al carrito' : 'Iniciá sesión para comprar'}
            </button>
        `;

        contenedor.appendChild(div);
    });
}

window.cambiarCantidad = function(productoId, cambio) {
    if (!cantidades[productoId]) cantidades[productoId] = 1;

    const stockMax = stockDisponibleMap[productoId] || 1;

    cantidades[productoId] += cambio;


    if (cantidades[productoId] < 1) {
        cantidades[productoId] = 1;
    }

  
    if (cantidades[productoId] > stockMax) {
        cantidades[productoId] = stockMax;
        alert(`Solo hay ${stockMax} unidades disponibles`);
    }

    document.getElementById(`cant-${productoId}`).innerText =
        cantidades[productoId];
};

window.agregarProductoConCantidad = async function(productoId) {
    try {

        // 🔒 VALIDACIÓN DE LOGIN (CLAVE)
        if (!isAuthenticated()) {
            alert("Tenés que iniciar sesión");
            window.location.href = "/login";
            return;
        }

        const cantidad = cantidades[productoId] || 1;
        const stockMax = stockDisponibleMap[productoId] || 1;

        if (cantidad > stockMax) {
            alert("Stock insuficiente");
            return;
        }

        await agregarAlCarrito(productoId, cantidad);

        alert("Producto agregado al carrito ✅");

    } catch (error) {
        alert("Error al agregar producto");
        console.error(error);
    }
};