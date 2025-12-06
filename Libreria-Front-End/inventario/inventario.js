// ============================================================
//   INVENTARIO.JS — VERSION FINAL FUNCIONAL
// ============================================================

const API = "http://127.0.0.1:8000";

// Elementos del DOM
const selectPV = document.getElementById("selectPV");
const tabla = document.getElementById("tabla-libros");
const panelAgregarPV = document.getElementById("panelAgregarPV");


// ============================================================
// CARGAR PUNTOS DE VENTA
// ============================================================
async function cargarPuntosVenta() {
    try {
        const res = await fetch(`${API}/puntos-venta/`);
        const data = await res.json();

        data.forEach(pv => {
            const opt = document.createElement("option");
            opt.value = pv.id_punto_venta;
            opt.textContent = pv.nombre;
            selectPV.appendChild(opt);
        });

    } catch (error) {
        console.error("Error cargando puntos de venta:", error);
    }
}


// ============================================================
// CARGAR INVENTARIO POR PV O GLOBAL
// ============================================================
async function cargarInventario() {
    tabla.innerHTML = `<tr><td colspan="6">Cargando inventario...</td></tr>`;

    const pvId = selectPV.value;
    let url = pvId === ""
        ? `${API}/inventario-pv/`
        : `${API}/inventario-pv/por-pv/${pvId}`;

    panelAgregarPV.style.display = pvId === "" ? "none" : "block";

    try {
        const res = await fetch(url);
        const items = await res.json();

        tabla.innerHTML = "";

        if (!items.length) {
            tabla.innerHTML = `<tr><td colspan="6">No hay inventario registrado</td></tr>`;
            return;
        }

        items.forEach(item => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${item.id_inventario}</td>
                <td>${item.libro}</td>
                <td>${item.punto_venta ?? "—"}</td>
                <td>${item.stock}</td>
                <td>${item.stock_minimo ?? "—"}</td>
                <td>
                    <button class="link" onclick="abrirEditar(
                        ${item.id_inventario},
                        ${item.stock},
                        '${item.libro}',
                        ${item.paginas_por_libro ?? 0}
                    )">Editar</button>
                    <button class="link" onclick="vender(${item.id_inventario})">Vender</button>
                </td>
            `;
            tabla.appendChild(tr);
        });

    } catch (error) {
        console.error("Error cargando inventario:", error);
        tabla.innerHTML = `<tr><td colspan="6">Error cargando inventario</td></tr>`;
    }
}


// ============================================================
// MODAL AGREGAR LIBRO A PV
// ============================================================
const modal = document.getElementById("modalAgregar");
const libroSelect = document.getElementById("libroSelect");

async function abrirModalAgregar() {
    modal.style.display = "flex";
    await cargarLibrosSelect();
}

function cerrarModal() {
    modal.style.display = "none";
}

async function cargarLibrosSelect() {
    libroSelect.innerHTML = "";
    const res = await fetch(`${API}/libros/`);
    const libros = await res.json();

    libros.forEach(l => {
        libroSelect.innerHTML += `<option value="${l.id_libro}">${l.nombre}</option>`;
    });
}

async function confirmarAgregar() {
    const payload = {
        id_libro: Number(libroSelect.value),
        id_punto_venta: Number(selectPV.value),
        stock: Number(document.getElementById("stockInicial").value),
        stock_minimo: Number(document.getElementById("stockMinimo").value)
    };

    try {
        const res = await fetch(`${API}/inventario-pv/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const error = await res.json();
            alert("Error: " + error.detail);
            return;
        }

        alert("Libro agregado correctamente.");
        cerrarModal();
        cargarInventario();

    } catch (error) {
        alert("Error al conectar");
    }
}


// ============================================================
// REGISTRO DE VENTAS (CORRECTO)
// ============================================================
async function vender(idInventario) {

    const cantidad = Number(prompt("Cantidad a vender:"));
    if (!cantidad || cantidad <= 0) return;

    const payload = {
        id_inventario_pv: idInventario,
        cantidad,
        usuario_id: Number(localStorage.getItem("userId"))
    };

    try {
        const res = await fetch(`${API}/inventario-pv/vender`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const data = await res.text();
            alert("Error al vender:\n" + data);
            return;
        }

        alert("Venta registrada");
        cargarInventario();

    } catch (error) {
        alert("Error de conexión al vender.");
    }
}


// ============================================================
// MODAL DE EDICIÓN DE INVENTARIO
// ============================================================
let editID = null;
let paginasLibro = 0;

window.abrirEditar = function (idInventario, stockActual, nombreLibro, paginas) {

    editID = idInventario;
    paginasLibro = paginas;

    document.getElementById("editLibroNombre").textContent = nombreLibro;
    document.getElementById("editStockActual").value = stockActual;
    document.getElementById("editStockNuevo").value = stockActual;
    document.getElementById("editDiferencia").value = 0;
    document.getElementById("editMP").value = 0;

    document.getElementById("modalEditar").classList.remove("hidden");
};


// Actualizar diferencia automáticamente
document.getElementById("editStockNuevo")?.addEventListener("input", function () {

    const actual = Number(document.getElementById("editStockActual").value);
    const nuevo = Number(this.value);

    const diff = nuevo - actual;
    document.getElementById("editDiferencia").value = diff;

    if (diff > 0 && paginasLibro > 0) {
        document.getElementById("editMP").value = diff * paginasLibro;
    } else {
        document.getElementById("editMP").value = 0;
    }
});


// ============================================================
// GUARDAR EDICIÓN DE STOCK — FIX DEFINITIVO
// ============================================================
window.guardarEdicion = async function () {

    const actual = Number(document.getElementById("editStockActual").value);
    const nuevo = Number(document.getElementById("editStockNuevo").value);
    const delta = nuevo - actual;

    const papelUsado = Number(document.getElementById("editMP").value);

    try {
        // 1️⃣ Ajustar inventario PV
        const res1 = await fetch(`${API}/inventario-pv/${editID}/ajustar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ delta })
        });

        const debug1 = await res1.text(); // 

        if (!res1.ok) {
            alert("❌ Error al ajustar inventario:\n" + debug1);
            return;
        }

        // 2️⃣ Salida de materia prima
        if (delta > 0 && papelUsado > 0) {

            const res2 = await fetch(`${API}/materias-primas/1/salida`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cantidad: papelUsado,
                    usuario_id: Number(localStorage.getItem("userId")) || null,
                    observaciones: "Ajuste / fabricación manual"
                })
            });

            const debug2 = await res2.text(); // 🟣 ver respuesta cruda

            if (!res2.ok) {
                alert("❌ Error al descontar papel:\n" + debug2);
                return;
            }
        }

        alert("Stock actualizado correctamente.");
        cerrarModalEditar();
        cargarInventario();

    } catch (error) {
        alert("🔥 Error JS: " + error);
    }
};


window.cerrarModalEditar = function () {
    document.getElementById("modalEditar").classList.add("hidden");
};


// ============================================================
// INICIALIZACIÓN
// ============================================================
document.addEventListener("DOMContentLoaded", async () => {

    await cargarPuntosVenta();
    await cargarInventario();

    selectPV.addEventListener("change", cargarInventario);

    const filterForm = document.getElementById("filterForm");
    filterForm.addEventListener("submit", e => {
        e.preventDefault();
        cargarInventario();
    });
});
