// ============================================================
//   INVENTARIO_PV.JS — ACTUALIZADO A LA NUEVA LÓGICA BACKEND
// ============================================================

const API = "http://127.0.0.1:8000";

const tablaPV = document.getElementById("tabla-pv");


// ============================================================
// 1. Cargar inventario del Punto de Venta
// ============================================================
async function cargarInventarioPV() {
    tablaPV.innerHTML = "<tr><td colspan='6'>Cargando...</td></tr>";

    try {
        const res = await fetch(`${API}/inventario-pv/`);
        const data = await res.json();

        if (!data.length) {
            tablaPV.innerHTML = "<tr><td colspan='6'>Sin resultados</td></tr>";
            return;
        }

        tablaPV.innerHTML = "";

        data.forEach(item => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${item.id_inventario}</td>
                <td>${item.libro}</td>
                <td>${item.punto_venta}</td>
                <td>${item.stock}</td>
                <td>
                    <button class="link" onclick="abrirModalVenta(${item.id_inventario})">Vender</button>
                </td>
            `;

            tablaPV.appendChild(tr);
        });

    } catch (err) {
        console.error(err);
        tablaPV.innerHTML = "<tr><td colspan='6'>Error al conectar</td></tr>";
    }
}

document.addEventListener("DOMContentLoaded", cargarInventarioPV);


// ============================================================
// 2. FABRICACIÓN (Crear inventario PV)
// ============================================================

const modalCrear = document.getElementById("modal-crear");
const selLibro = document.getElementById("sel-libro");
const selPV = document.getElementById("sel-pv");

document.getElementById("btn-nuevo-pv").addEventListener("click", abrirModalCrear);

async function abrirModalCrear() {
    modalCrear.classList.remove("hidden");
    await cargarLibros();
    await cargarPuntosVenta();
}

function cerrarModal() {
    modalCrear.classList.add("hidden");
}

async function cargarLibros() {
    selLibro.innerHTML = "";

    const res = await fetch(`${API}/libros/`);
    const datos = await res.json();

    datos.forEach(l => {
        selLibro.innerHTML += `<option value="${l.id_libro}">${l.nombre}</option>`;
    });
}

async function cargarPuntosVenta() {
    selPV.innerHTML = "";

    const res = await fetch(`${API}/puntos-venta/`);
    const datos = await res.json();

    datos.forEach(p => {
        selPV.innerHTML += `<option value="${p.id_punto_venta}">${p.nombre}</option>`;
    });
}

document.getElementById("crear-inv-btn").addEventListener("click", async () => {
    const payload = {
        id_libro: Number(selLibro.value),
        id_punto_venta: Number(selPV.value),
        stock: Number(document.getElementById("stock-inicial").value)
    };

    try {
        const res = await fetch(`${API}/inventario-pv/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const error = await res.json();
            alert(error.detail || "Error al fabricar");
            return;
        }

        cerrarModal();
        cargarInventarioPV();

    } catch (error) {
        alert("Error al fabricar inventario.");
    }
});


// ============================================================
// 3. VENTAS
// ============================================================

let idInventarioVenta = null;

const modalVenta = document.getElementById("modal-venta");
const btnConfirmarVenta = document.getElementById("btn-confirmar-venta");

function abrirModalVenta(id) {
    idInventarioVenta = id;
    modalVenta.classList.remove("hidden");
}

function cerrarModalVenta() {
    modalVenta.classList.add("hidden");
    idInventarioVenta = null;
}

btnConfirmarVenta.addEventListener("click", async () => {
    const cantidad = Number(document.getElementById("cantidad-venta").value);

    if (cantidad <= 0) {
        alert("La cantidad debe ser mayor a cero.");
        return;
    }

    const payload = {
        id_inventario_pv: idInventarioVenta,
        cantidad: cantidad,
        usuario_id: 1  // TODO: reemplazar por usuario real de sesión
    };

    try {
        const res = await fetch(`${API}/inventario-pv/vender`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const error = await res.json();
            alert(error.detail);
            return;
        }

        cerrarModalVenta();
        cargarInventarioPV();

    } catch (err) {
        alert("Error al procesar la venta.");
        console.error(err);
    }
});
