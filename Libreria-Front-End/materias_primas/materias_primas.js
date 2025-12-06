// ============================================================
//   MATERIAS_PRIMAS.JS — VERSION FINAL COMPATIBLE BACKEND NUEVO
// ============================================================

const API_BASE = "http://127.0.0.1:8000";

// ================================
// CARGAR MATERIAS PRIMAS
// ================================
async function cargarMateriasPrimas(q = "") {
  const tbody = document.getElementById("tabla-materias-primas");
  tbody.innerHTML = "<tr><td colspan='5'>Cargando...</td></tr>";

  let url = `${API_BASE}/materias-primas/`;
  if (q) url += `?q=${encodeURIComponent(q)}`;

  try {
    const res = await fetch(url);
    const items = await res.json();
    mostrarMateriasPrimas(items, tbody);
  } catch (err) {
    console.error("Error al cargar materias primas", err);
    tbody.innerHTML = "<tr><td colspan='5'>Error al cargar datos</td></tr>";
  }
}

// ================================
// MOSTRAR EN TABLA
// ================================
function mostrarMateriasPrimas(items, tbody) {
  tbody.innerHTML = "";

  if (!items.length) {
    tbody.innerHTML = "<tr><td colspan='5'>No hay materias primas registradas</td></tr>";
    return;
  }

  items.forEach(mp => {
    const stockColor =
      mp.stock_actual < mp.stock_minimo
        ? 'style="color:#dc2626;font-weight:bold;"'
        : "";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${mp.id_mp}</td>
      <td>${mp.nombre}</td>
      <td ${stockColor}>${mp.stock_actual}</td>
      <td>${mp.stock_minimo}</td>
      <td>
        <a class="link" onclick="abrirModalAjuste(${mp.id_mp})">Editar</a>
        <a class="link" onclick="eliminarMateriaPrima(${mp.id_mp})">Eliminar</a>
        <a class="link" onclick="abrirModalEntrada(${mp.id_mp})">Entrada</a>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ================================
// MODAL: REGISTRAR ENTRADA
// ================================
function abrirModalEntrada(id_mp = null) {
  const modal = document.getElementById("modal-entrada");
  modal.classList.remove("hidden");

  // Si viene con ID, seleccionarlo automáticamente
  fetch(`${API_BASE}/materias_primas/`)
    .then(res => res.json())
    .then(items => {
      const sel = document.getElementById("entrada-mp");
      sel.innerHTML = "";
      items.forEach(mp => {
        sel.innerHTML += `<option value="${mp.id_mp}">${mp.nombre}</option>`;
      });
      if (id_mp) sel.value = id_mp;
    });
}

function cerrarModalEntrada() {
  document.getElementById("modal-entrada").classList.add("hidden");
  document.getElementById("form-entrada").reset();
}

document.getElementById("form-entrada").addEventListener("submit", async (e) => {
  e.preventDefault();

  const mpId = document.getElementById("entrada-mp").value;
  const cantidad = parseInt(document.getElementById("entrada-cantidad").value);
  const observaciones = document.getElementById("entrada-observaciones").value;

  if (!cantidad || cantidad <= 0) {
    alert("⚠ Ingresa una cantidad válida.");
    return;
  }

  const payload = {
    cantidad,
    usuario_id: 1,
    observaciones
  };

  const res = await fetch(`${API_BASE}/materias_primas/${mpId}/entrada`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const error = await res.json();
    alert("❌ Error: " + (error.detail || "No se pudo registrar la entrada"));
    return;
  }

  alert("✅ Entrada registrada.");
  cerrarModalEntrada();
  cargarMateriasPrimas();
});

// ================================
// MODAL: AJUSTAR
// ================================
function abrirModalAjuste(id_mp) {
  fetch(`${API_BASE}/materias_primas/${id_mp}`)
    .then(res => res.json())
    .then(mp => {
      document.getElementById("ajuste-id").value = mp.id_mp;
      document.getElementById("ajuste-nombre").value = mp.nombre;
      document.getElementById("ajuste-unidad").value = mp.unidad;
      document.getElementById("ajuste-minimo").value = mp.stock_minimo;
      document.getElementById("modal-ajuste").classList.remove("hidden");
    })
    .catch(err => {
      console.error(err);
      alert("❌ No se pudo cargar la materia prima.");
    });
}

function cerrarModalAjuste() {
  document.getElementById("modal-ajuste").classList.add("hidden");
}

document.getElementById("form-ajuste").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("ajuste-id").value;
  const payload = {
    nombre: document.getElementById("ajuste-nombre").value,
    unidad: document.getElementById("ajuste-unidad").value,
    stock_minimo: Number(document.getElementById("ajuste-minimo").value)
  };

  const res = await fetch(`${API_BASE}/materias_primas/${id}`, {
    method: "PUT",  // <-- backend usa PUT
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    alert("❌ Error al modificar materia prima");
    return;
  }

  alert("✅ Materia prima actualizada.");
  cerrarModalAjuste();
  cargarMateriasPrimas();
});

// ================================
// CREAR MATERIA PRIMA
// ================================
function abrirModalCrearMP() {
  document.getElementById("modal-crear-mp").classList.remove("hidden");
}

function cerrarModalCrearMP() {
  document.getElementById("modal-crear-mp").classList.add("hidden");
  document.getElementById("form-crear-mp").reset();
}

document.getElementById("form-crear-mp").addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    nombre: document.getElementById("crear-nombre").value,
    unidad: document.getElementById("crear-unidad").value,
    stock_minimo: Number(document.getElementById("crear-minimo").value),
    stock_actual: Number(document.getElementById("crear-stock").value)
  };

  const res = await fetch(`${API_BASE}/materias_primas/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    alert("❌ Error al crear materia prima");
    return;
  }

  alert("✅ Materia prima creada.");
  cerrarModalCrearMP();
  cargarMateriasPrimas();
});

// ================================
// ELIMINAR MATERIA PRIMA
// ================================
async function eliminarMateriaPrima(id) {
  if (!confirm("¿Seguro que deseas eliminar esta materia prima?")) return;

  const res = await fetch(`${API_BASE}/materias_primas/${id}`, {
    method: "DELETE"
  });

  if (res.ok) {
    alert("🗑 Materia prima eliminada.");
    cargarMateriasPrimas();
  } else {
    alert("❌ No se pudo eliminar.");
  }
}

// ================================
// INICIALIZACIÓN
// ================================
document.addEventListener("DOMContentLoaded", () => {
  cargarMateriasPrimas();

  const formFiltro = document.getElementById("filterFormMP");
  formFiltro.addEventListener("submit", function (e) {
    e.preventDefault();
    cargarMateriasPrimas(this.q.value.trim());
  });
});
