// ============================================================
//   CREAR_USUARIO.JS — versión final y compatible
// ============================================================

const API_BASE = "http://127.0.0.1:8000";

document.addEventListener("DOMContentLoaded", async () => {

    cargarPuntosVenta();

    const form = document.getElementById("formNuevoUsuario");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nombre = form.nombre.value.trim();
        const email = form.email.value.trim();
        const contrasena = form.contrasena.value.trim();
        const rol = form.rol.value;
        const punto_venta_id = rol === "vendedor" ? Number(form.punto_venta_id.value) : null;

        if (!nombre || !email || !contrasena) {
            alert("❌ Todos los campos son obligatorios.");
            return;
        }

        const payload = {
            nombre,
            email,
            contrasena,
            rol,
            punto_venta_id
        };

        try {
            const resp = await fetch(`${API_BASE}/usuarios/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!resp.ok) {
                const err = await resp.json();
                alert("❌ Error: " + (err.detail || "No se pudo crear usuario."));
                return;
            }

            alert("✅ Usuario creado correctamente.");
            window.location.href = "user.html";

        } catch (error) {
            alert("⚠ Error al conectar con el servidor.");
            console.error(error);
        }
    });
});


// ============================================================
// Cargar Puntos de Venta en el select
// ============================================================
async function cargarPuntosVenta() {
    const sel = document.getElementById("selectPV");

    sel.innerHTML = `<option value="">Seleccionar...</option>`;

    try {
        const res = await fetch(`${API_BASE}/puntos-venta/`);
        const data = await res.json();

        data.forEach(pv => {
            sel.innerHTML += `<option value="${pv.id_punto_venta}">${pv.nombre}</option>`;
        });

    } catch (error) {
        console.error("Error cargando PV:", error);
    }
}
