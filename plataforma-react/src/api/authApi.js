const API_URL = import.meta.env.VITE_AUTH_URL ||
    'http://localhost:3000/api/auth';

async function leerRespuesta(respuesta) {
    const contenido = await respuesta.json().catch(() => ({}));

    if (!respuesta.ok) {
        const error = new Error(
            contenido.mensaje || 'Error en la petición'
        );

        error.status = respuesta.status;
        throw error;
    }

    return contenido;
}

// Registrar usuario
export async function registrarUsuario(usuario) {
    const respuesta = await fetch(`${API_URL}/register`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuario)
    });

    return leerRespuesta(respuesta);
}

// Iniciar sesión
export async function iniciarSesion(email, password) {
    const respuesta = await fetch(`${API_URL}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    return leerRespuesta(respuesta);
}

// Obtener usuario autenticado
export async function obtenerUsuario() {
    const respuesta = await fetch(`${API_URL}/me`, {
        method: 'GET',
        credentials: 'include'
    });

    return leerRespuesta(respuesta);
}

// Cerrar sesión
export async function cerrarSesion() {
    const respuesta = await fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include'
    });

    return leerRespuesta(respuesta);
}