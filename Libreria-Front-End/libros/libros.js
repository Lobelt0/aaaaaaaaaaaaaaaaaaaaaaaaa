// ============================================================
//   LIBROS.JS — VERSION FINAL CON EDICIÓN COMPLETA DE LIBROS
// ============================================================

const API_BASE = "http://127.0.0.1:8000";

let libroEditando = null;

// ============================================================
// CARGAR LISTA DE LIBROS
// ============================================================
async function cargarLibros(q = "") {
    const tbody = document.getElementById("tabla-libros-gestion");
    if (!tbody) return;

    tbody.innerHTML = "<tr><td colspan='5'>Cargando libros...</td></tr>";

    let url = `${API_BASE}/libros/`;
    if (q.trim() !== "") {
        url += `?q=${encodeURIComponent(q.trim())}`;
    }

    try {
        const res = await fetch(url);
        const libros = await res.json();

        tbody.innerHTML = "";

        if (!libros.length) {
            tbody.innerHTML = "<tr><td colspan='5'>No hay libros registrados</td></tr>";
            return;
        }

        libros.forEach(libro => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${libro.id_libro}</td>
                <td>${libro.nombre}</td>
                <td>${libro.stock_total}</td>
                <td>${libro.precio ? "$" + libro.precio : "—"}</td>
                <td>
                    <a href="#" class="link" onclick="modificarLibro(${libro.id_libro}); return false;">Editar</a>
                    <a href="#" class="link" onclick="eliminarLibro(${libro.id_libro}); return false;">Eliminar</a>
                </td>
            `;
            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error(err);
        tbody.innerHTML = "<tr><td colspan='5'>Error cargando datos</td></tr>";
    }
}

// ============================================================
// OBTENER DATOS DEL LIBRO Y ABRIR MODAL
// ============================================================
window.modificarLibro = async function (libroId) {
    try {
        const res = await fetch(`${API_BASE}/libros/${libroId}`);
        if (!res.ok) {
            alert("No se pudo cargar los datos del libro");
            return;
        }

        const libro = await res.json();
        libroEditando = libroId;

        // Llenar campos del modal
        document.getElementById("edit-nombre").value = libro.nombre ?? "";
        document.getElementById("edit-categoria").value = libro.categoria ?? "";
        document.getElementById("edit-descripcion").value = libro.descripcion ?? "";
        document.getElementById("edit-precio").value = libro.precio ?? 0;
        document.getElementById("edit-paginas").value = libro.paginas_por_libro ?? 1;

        // Mostrar modal
        document.getElementById("modalEditarLibro").classList.remove("hidden");

    } catch (error) {
        console.error(error);
        alert("Error al conectar con servidor");
    }
};

// ============================================================
// CERRAR MODAL
// ============================================================
window.cerrarModalEditarLibro = function () {
    document.getElementById("modalEditarLibro").classList.add("hidden");
    libroEditando = null;
};

// ============================================================
// GUARDAR CAMBIOS DEL LIBRO EDITADO
// ============================================================
window.guardarCambiosLibro = async function () {
    if (!libroEditando) return;

    const payload = {
        nombre: document.getElementById("edit-nombre").value.trim(),
        categoria: document.getElementById("edit-categoria").value.trim(),
        descripcion: document.getElementById("edit-descripcion").value.trim(),
        precio: Number(document.getElementById("edit-precio").value),
        paginas_por_libro: Number(document.getElementById("edit-paginas").value)
    };

    try {
        const res = await fetch(`${API_BASE}/libros/${libroEditando}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const data = await res.json();
            alert("❌ Error: " + (data.detail || "No se pudo actualizar"));
            return;
        }

        alert("✅ Libro actualizado correctamente.");

        cerrarModalEditarLibro();
        cargarLibros();

    } catch (err) {
        console.error(err);
        alert("⚠ Error de red");
    }
};

// ============================================================
// ELIMINAR LIBRO
// ============================================================
window.eliminarLibro = async function (libroId) {
    if (!confirm("¿Eliminar este libro?")) return;

    try {
        const res = await fetch(`${API_BASE}/libros/${libroId}`, {
            method: "DELETE"
        });

        if (!res.ok) {
            alert("No se pudo eliminar el libro");
            return;
        }

        alert("Libro eliminado");
        cargarLibros();

    } catch (error) {
        console.error(error);
        alert("Error de conexión");
    }
};

// ============================================================
// INICIALIZAR
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    cargarLibros();

    const formFiltro = document.getElementById("filterFormLibros");
    formFiltro.addEventListener("submit", e => {
        e.preventDefault();
        cargarLibros(formFiltro.q.value.trim());
    });
});
