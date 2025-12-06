// ============================================================
//  utils/api.js — Cliente HTTP centralizado para tu FrontEnd
// ============================================================

const API_URL = "http://localhost:8000";

// ------------------------------------------------------------
//  Método general para realizar llamadas a la API
// ------------------------------------------------------------
async function apiRequest(endpoint, method = "GET", data = null) {
    const options = {
        method,
        headers: { "Content-Type": "application/json" },
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: response.statusText }));
            throw new Error(error.detail || "Error en la solicitud");
        }

        return await response.json();
    } catch (err) {
        console.error("API Error:", err.message);
        throw err;
    }
}
