const form = document.getElementById("productoForm");
const tabla = document.getElementById("tablaProductos");
const btnSubmit = document.getElementById("btnSubmit");

let editandoId = null;
const API_URL = "http://localhost:4000/api/productos";

// Crear o actualizar producto
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const producto = {
    nombre: document.getElementById("nombre").value,
    descripcion: document.getElementById("descripcion").value,
    precio: document.getElementById("precio").value,
    stock: document.getElementById("stock").value,
    categoria: document.getElementById("categoria").value
  };

  if (editandoId) {
    await fetch(`${API_URL}/${editandoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(producto)
    });
    editandoId = null;
    btnSubmit.textContent = "Guardar Producto";
  } else {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(producto)
    });
  }

  form.reset();
  obtenerProductos();
});

// Obtener productos
async function obtenerProductos() {
  const res = await fetch(API_URL);
  const data = await res.json();

  tabla.innerHTML = "";
  data.forEach(p => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${p.nombre}</td>
      <td>${p.descripcion}</td>
      <td>$${p.precio}</td>
      <td>${p.stock}</td>
      <td>${p.categoria}</td>
      <td>
        <button onclick="editarProducto('${p._id}')">Editar</button>
        <button onclick="eliminarProducto('${p._id}')">Eliminar</button>
      </td>
    `;
    tabla.appendChild(row);
  });
}

// Editar producto
async function editarProducto(id) {
  const res = await fetch(`${API_URL}/${id}`);
  const p = await res.json();

  document.getElementById("nombre").value = p.nombre;
  document.getElementById("descripcion").value = p.descripcion;
  document.getElementById("precio").value = p.precio;
  document.getElementById("stock").value = p.stock;
  document.getElementById("categoria").value = p.categoria;

  editandoId = id;
  btnSubmit.textContent = "Actualizar Producto";
}

// Eliminar producto
async function eliminarProducto(id) {
  if (confirm("¿Seguro que deseas eliminar este producto?")) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    obtenerProductos();
  }
}

obtenerProductos();
