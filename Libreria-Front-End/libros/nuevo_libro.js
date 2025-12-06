// ============================================================
//   NUEVO_LIBRO.JS — AJUSTADO AL BACKEND ACTUAL
// ============================================================

const API_BASE = "http://127.0.0.1:8000";

document.getElementById("formNuevoLibro").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;

    const payload = {
        nombre: form.nombre.value.trim(),
        precio: Number(form.precio.value),
        categoria: form.categoria ? form.categoria.value.trim() : "",
        descripcion: form.descripcion ? form.descripcion.value.trim() : "",
        paginas_por_libro: Number(form.paginas_por_libro.value)
    };

    // Validaciones simples
    if (!payload.nombre) {
        alert("❌ Debes ingresar un nombre.");
        return;
    }
    if (isNaN(payload.precio) || payload.precio < 0) {
        alert("❌ Precio inválido.");
        return;
    }
    if (isNaN(payload.paginas_por_libro) || payload.paginas_por_libro <= 0) {
        alert("❌ Las páginas por libro deben ser un número positivo.");
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/libros/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const errData = await res.json();
            alert("❌ Error: " + (errData.detail || "No se pudo crear el libro."));
            return;
        }

        alert("✅ Libro creado correctamente.");
        window.location.href = "libros.html";

    } catch (error) {
        console.error(error);
        alert("❌ Error de conexión con el servidor.");
    }
});
