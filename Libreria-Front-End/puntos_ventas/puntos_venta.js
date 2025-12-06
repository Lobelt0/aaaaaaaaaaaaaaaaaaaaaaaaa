// ==================================================
//   PUNTOS_VENTA.JS — Versión final compatible backend nuevo
// ==================================================

const API_BASE = "http://127.0.0.1:8000";

// ==================================================
// CARGAR LISTA DE PUNTOS DE VENTA
// ==================================================
async function cargarPuntosVenta(q = "") {
  const tbody = document.getElementById("tabla-puntos-venta");
  tbody.innerHTML = "<tr><td colspan='5'>Cargando...</td></tr>";

  try {
    const res = await fetch(`${API_BASE}/puntos-venta/`);
    if (!res.ok) throw new Error("No se pudo obtener puntos de venta");

    let puntosVenta = await res.json();

    // Filtro frontend (nombre o ubicación)
    if (q.trim() !== "") {
      const term = q.trim().toLowerCase();
      puntosVenta = puntosVenta.filter(pv =>
        pv.nombre.toLowerCase().includes(term) ||
        (pv.ubicacion || "").toLowerCase().includes(term)
      );
    }

    mostrarPuntosVenta(puntosVenta, tbody);

  } catch (e) {
    console.error(e);
    tbody.innerHTML =
      "<tr><td colspan='5'>Error al cargar los puntos de venta.</td></tr>";
  }
}


// ==================================================
// RENDERIZAR TABLA
// ==================================================
function mostrarPuntosVenta(items, tbody) {
  tbody.innerHTML = "";

  if (!items.length) {
    tbody.innerHTML = "<tr><td colspan='5'>No hay puntos de venta registrados</td></tr>";
    return;
  }

  items.forEach(pv => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${pv.id_punto_venta}</td>
      <td>${pv.nombre}</td>
      <td>${pv.ubicacion || "—"}</td>
      <td>${pv.tipo}</td>
      <td>
        <a class="link" href="#" onclick="abrirModalEditarPV(${pv.id_punto_venta});return false;">Editar</a>
        <a class="link" href="#" onclick="eliminarPuntoVenta(${pv.id_punto_venta});return false;">Eliminar</a>
      </td>
    `;

    tbody.appendChild(tr);
  });
}


// ==================================================
// MODAL — EDITAR PV
// ==================================================
window.abrirModalEditarPV = async function (pvId) {
  try {
    const res = await fetch(`${API_BASE}/puntos-venta/${pvId}`);
    if (!res.ok) throw new Error("No se pudo cargar el PV");

    const pv = await res.json();

    document.getElementById("editar-pv-id").value = pv.id_punto_venta;
    document.getElementById("editar-pv-nombre").value = pv.nombre;
    document.getElementById("editar-pv-ubicacion").value = pv.ubicacion;
    document.getElementById("editar-pv-tipo").value = pv.tipo;

    document.getElementById("modalEditarPV").classList.remove("hidden");

  } catch (err) {
    console.error(err);
    alert("❌ Error al cargar datos del punto de venta.");
  }
};

window.cerrarModalEditarPV = function () {
  document.getElementById("modalEditarPV").classList.add("hidden");
};


// ==================================================
// ACTUALIZAR PV (PUT)
// ==================================================
document.addEventListener("DOMContentLoaded", () => {
  const formEditarPV = document.getElementById("formEditarPV");

  if (formEditarPV) {
    formEditarPV.addEventListener("submit", async (e) => {
      e.preventDefault();

      const id = document.getElementById("editar-pv-id").value;
      const payload = {
        nombre: document.getElementById("editar-pv-nombre").value.trim(),
        ubicacion: document.getElementById("editar-pv-ubicacion").value.trim(),
        tipo: document.getElementById("editar-pv-tipo").value
      };

      try {
        const res = await fetch(`${API_BASE}/puntos-venta/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const data = await res.json();
          alert("❌ Error al modificar: " + (data.detail || "Error desconocido"));
          return;
        }

        alert("✅ Punto de venta modificado.");
        cerrarModalEditarPV();
        cargarPuntosVenta();

      } catch (error) {
        alert("⚠ Error de conexión.");
      }
    });
  }
});


// ==================================================
// ELIMINAR PV
// ==================================================
window.eliminarPuntoVenta = async function (id) {
  if (!confirm("¿Seguro que deseas eliminar este punto de venta?")) return;

  try {
    const res = await fetch(`${API_BASE}/puntos-venta/${id}`, {
      method: "DELETE"
    });

    if (res.ok) {
      alert("🗑 Punto de venta eliminado.");
      cargarPuntosVenta();
    } else {
      const error = await res.json();
      alert("❌ No se pudo eliminar: " + (error.detail || "Error desconocido"));
    }

  } catch (error) {
    console.error(error);
    alert("⚠ Error conectando al servidor.");
  }
};


// ==================================================
// INICIALIZACIÓN
// ==================================================
document.addEventListener("DOMContentLoaded", () => {
  cargarPuntosVenta();

  const formFiltro = document.getElementById("filterFormPV");
  if (formFiltro) {
    formFiltro.addEventListener("submit", (e) => {
      e.preventDefault();
      cargarPuntosVenta(formFiltro.q.value.trim());
    });
  }
});
