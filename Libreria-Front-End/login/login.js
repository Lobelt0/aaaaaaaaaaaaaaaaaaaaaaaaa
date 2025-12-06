// ============================================================
//   LOGIN.JS — versión estable compatible con tu backend ACTUAL
// ============================================================
console.log("LOGIN.JS CARGADO");

document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.querySelector("input[name='email']").value.trim();
  const contrasena = document.querySelector("input[name='password']").value.trim();

  if (!email || !contrasena) {
    alert("⚠️ Debes ingresar email y contraseña.");
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/usuarios/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, contrasena })
    });

    const data = await response.json();

    if (!response.ok) {
      alert("❌ " + (data.detail || "Credenciales incorrectas"));
      return;
    }

    // Limpiar
    localStorage.clear();

    // BACKEND SOLO ENTREGA role y punto_venta_id
    localStorage.setItem("userRole", data.role);

    if (data.punto_venta_id !== undefined && data.punto_venta_id !== null) {
      localStorage.setItem("punto_venta_id", data.punto_venta_id);
    }

    alert("✅ Login exitoso.");

    // Redirigir según rol
    if (data.role === "admin") {
      window.location.href = "/pages/admin/admin.html";
    } else {
      window.location.href = "/usuarios/user.html";
    }

  } catch (error) {
    alert("⚠ Error al conectar con el servidor.");
    console.error(error);
  }
});

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}