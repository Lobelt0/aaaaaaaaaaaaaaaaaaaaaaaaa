// ============================================================
//   ADMIN.JS — Dashboard Administrador (versión final compatible backend)
// ============================================================

const API_BASE = "http://127.0.0.1:8000";

// ============================================================
// RESUMEN GLOBAL
// ============================================================
async function cargarResumen() {
  try {
    // Total puntos de venta
    const resPV = await fetch(`${API_BASE}/puntos-venta/`);
    const puntos = await resPV.json();

    // Total usuarios
    const resUsers = await fetch(`${API_BASE}/usuarios/`);
    const users = await resUsers.json();

    // Inventario global
    const resInv = await fetch(`${API_BASE}/inventario/`);
    const inventario = await resInv.json();

    // Sumar stock global
    const stockTotal = inventario.reduce((sum, item) => sum + item.stock, 0);

    document.getElementById("resumen-locales").textContent = puntos.length;
    document.getElementById("resumen-usuarios").textContent = users.length;
    document.getElementById("resumen-stock").textContent = stockTotal;

  } catch (e) {
    console.error("Error cargando resumen:", e);
  }
}

// ============================================================
// ALERTAS — LIBROS
// ============================================================
async function cargarAlertasLibros() {
  try {
    // NUEVO endpoint correcto
    const res = await fetch(`${API_BASE}/inventario/stock-bajo-libros`);
    const alertas = await res.json();

    const ul = document.getElementById("alerta-libros");
    ul.innerHTML = "";

    if (!alertas.length) {
      ul.innerHTML = "<li>No hay alertas de stock.</li>";
      return;
    }

    alertas.forEach(a => {
      ul.innerHTML += `
        <li>
          📕 ${a.libro} — Stock: ${a.stock} (Mínimo: ${a.stock_minimo})
        </li>`;
    });

  } catch (e) {
    console.error("Error alertas libros:", e);
  }
}

// ============================================================
// ALERTAS — MATERIAS PRIMAS
// ============================================================
async function cargarAlertasMP() {
  try {
    const res = await fetch(`${API_BASE}/materias_primas/`);
    const materias = await res.json();

    const ul = document.getElementById("alerta-materias-primas");
    ul.innerHTML = "";

    const criticos = materias.filter(mp => mp.stock_actual < mp.stock_minimo);

    if (!criticos.length) {
      ul.innerHTML = "<li>No hay alertas.</li>";
      return;
    }

    criticos.forEach(mp => {
      ul.innerHTML += `
        <li>📦 ${mp.nombre} — Stock: ${mp.stock_actual} (Min: ${mp.stock_minimo})</li>
      `;
    });

  } catch (e) {
    console.error("Error alertas MP:", e);
  }
}

// ============================================================
// TABLA DE PUNTOS DE VENTA
// ============================================================
async function cargarPuntosVentaAdmin() {
  try {
    const res = await fetch(`${API_BASE}/puntos-venta/`);
    const data = await res.json();

    const tbody = document.getElementById("tabla-admin-pv");
    tbody.innerHTML = "";

    data.forEach(pv => {
      tbody.innerHTML += `
        <tr>
          <td>${pv.nombre}</td>
          <td>${pv.ubicacion || "—"}</td>
          <td>${pv.tipo}</td>
          <td><a class="link" href="/inventario/inventario.html?pv=${pv.id_punto_venta}">Ver inventario</a></td>
        </tr>
      `;
    });

  } catch (e) {
    console.error("Error puntos de venta:", e);
  }
}

// ============================================================
//  PROTEGER RUTA ADMIN
// ============================================================
function protegerAdmin() {
  const rol = localStorage.getItem("userRole");

  if (rol !== "admin") {
    localStorage.clear();
    window.location.href = "index.html";
  }
}

// ============================================================
// INICIALIZADOR
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  protegerAdmin();
  cargarResumen();
  cargarAlertasLibros();
  cargarAlertasMP();
  cargarPuntosVentaAdmin();
});
