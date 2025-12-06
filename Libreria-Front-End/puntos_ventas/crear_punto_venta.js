// ============================================================
//   CREAR_PUNTO_VENTA.JS — Versión final estable
// ============================================================

console.log("JS CARGADO OK");

const API_PV = "http://127.0.0.1:8000/puntos-venta";

const formPV = document.getElementById("formPV");
const btnCancelarPV = document.getElementById("btnCancelarPV");

// ============================================================
// ENVIAR FORMULARIO
// ============================================================
formPV.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = formPV.nombre.value.trim();
  const ubicacion = formPV.ubicacion.value.trim();
  const tipo = formPV.tipo.value;

  // Validaciones
  if (!nombre || !ubicacion || !tipo) {
    alert("❌ Todos los campos son obligatorios.");
    return;
  }

  if (!["tienda", "metro", "online"].includes(tipo)) {
    alert("❌ Tipo de punto de venta inválido.");
    return;
  }

  const payload = { nombre, ubicacion, tipo };

  try {
    const resp = await fetch(API_PV, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ detail: "Error desconocido" }));
      alert("❌ Error: " + (err.detail || "No se pudo crear el punto de venta."));
      return;
    }

    alert("✅ Punto de venta creado correctamente.");
    window.location.href = "puntos_venta.html";

  } catch (error) {
    console.error("Error:", error);
    alert("⚠ Error al conectar con el servidor.");
  }
});

// ============================================================
// CANCELAR
// ============================================================
btnCancelarPV.addEventListener("click", () => {
  window.location.href = "puntos_venta.html";
});
