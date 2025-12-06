// ============================================================
//   USUARIOS.JS — Gestión Completa de Usuarios (VAC + Edit + Del)
// ============================================================

const API = "http://127.0.0.1:8000";

// ============================================================
// CARGAR LISTA DE USUARIOS
// ============================================================
async function cargarUsuarios(query = "") {
  const tbody = document.getElementById("tabla-usuarios");
  tbody.innerHTML = "<tr><td colspan='6'>Cargando...</td></tr>";

  let url = `${API}/usuarios/`;
  if (query.trim()) url += `?q=${query}`;

  try {
    const res = await fetch(url);
    const datos = await res.json();

    tbody.innerHTML = "";

    if (!datos.length) {
      tbody.innerHTML = "<tr><td colspan='6'>No se encontraron usuarios</td></tr>";
      return;
    }

    datos.forEach(u => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${u.id_usuario}</td>
        <td>${u.nombre}</td>
        <td>${u.email}</td>
        <td>${u.rol}</td>
        <td>${u.punto_venta || "-"}</td>
        <td>
          <a href="#" class="link" onclick="abrirModalEditar(${u.id_usuario})">Editar</a>
          <a href="#" class="link" onclick="eliminarUsuario(${u.id_usuario})">Eliminar</a>
        </td>
      `;

      tbody.appendChild(tr);
    });

  } catch (error) {
    console.error(error);
    tbody.innerHTML = "<tr><td colspan='6'>Error al cargar usuarios.</td></tr>";
  }
}


// ============================================================
// CARGAR PUNTOS DE VENTA EN SELECTs
// ============================================================
async function cargarPVEnSelect(selectId) {
  const sel = document.getElementById(selectId);
  sel.innerHTML = `<option value="">Seleccionar...</option>`;

  const res = await fetch(`${API}/puntos-venta/`);
  const data = await res.json();

  data.forEach(pv => {
    sel.innerHTML += `<option value="${pv.id_punto_venta}">${pv.nombre}</option>`;
  });
}


// ============================================================
// MODAL CREAR USUARIO
// ============================================================
function abrirModalCrear() {
  document.getElementById("modal-crear").classList.remove("hidden");
  cargarPVEnSelect("crear-pv");
}

function cerrarModalCrear() {
  document.getElementById("modal-crear").classList.add("hidden");
}


// ============================================================
// CREAR USUARIO
// ============================================================
document.getElementById("form-crear-usuario").addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    nombre: document.getElementById("crear-nombre").value.trim(),
    email: document.getElementById("crear-email").value.trim(),
    contrasena: document.getElementById("crear-pass").value.trim(),
    rol: document.getElementById("crear-rol").value,
    punto_venta_id:
      document.getElementById("crear-rol").value === "vendedor"
        ? Number(document.getElementById("crear-pv").value)
        : null
  };

  const res = await fetch(`${API}/usuarios/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    alert("❌ Error: " + (err.detail || "No se pudo crear usuario"));
    return;
  }

  alert("✅ Usuario creado correctamente.");
  cerrarModalCrear();
  cargarUsuarios();
});


// ============================================================
// MODAL EDITAR USUARIO
// ============================================================
async function abrirModalEditar(id) {
  document.getElementById("modal-editar").classList.remove("hidden");

  cargarPVEnSelect("editar-pv");

  const res = await fetch(`${API}/usuarios/${id}`);
  const u = await res.json();

  document.getElementById("editar-id").value = u.id_usuario;
  document.getElementById("editar-nombre").value = u.nombre;
  document.getElementById("editar-email").value = u.email;
  document.getElementById("editar-rol").value = u.rol;
  document.getElementById("editar-pv").value = u.punto_venta_id || "";
}

function cerrarModalEditar() {
  document.getElementById("modal-editar").classList.add("hidden");
}


// ============================================================
// GUARDAR CAMBIOS DE USUARIO (EDITAR)
// ============================================================
document.getElementById("form-editar-usuario").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("editar-id").value;

  const payload = {
    nombre: document.getElementById("editar-nombre").value,
    email: document.getElementById("editar-email").value,
    rol: document.getElementById("editar-rol").value,
    punto_venta_id:
      document.getElementById("editar-rol").value === "vendedor"
        ? Number(document.getElementById("editar-pv").value)
        : null
  };

  const pass = document.getElementById("editar-pass").value.trim();
  if (pass !== "") payload.contrasena = pass;

  const res = await fetch(`${API}/usuarios/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    alert("❌ Error: " + err.detail);
    return;
  }

  alert("✅ Usuario modificado.");
  cerrarModalEditar();
  cargarUsuarios();
});


// ============================================================
// ELIMINAR USUARIO
// ============================================================
async function eliminarUsuario(id) {
  if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;

  const res = await fetch(`${API}/usuarios/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await res.json();
    alert("⚠ Error: " + (err.detail || "No se pudo eliminar"));
    return;
  }

  alert("🗑 Usuario eliminado.");
  cargarUsuarios();
}


// ============================================================
// INICIALIZACIÓN
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const formFiltro = document.getElementById("filterFormUsuarios");

  formFiltro.addEventListener("submit", (e) => {
    e.preventDefault();
    cargarUsuarios(formFiltro.q.value.trim());
  });

  cargarUsuarios();
});
