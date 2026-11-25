
const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000/api/solicitudes";

// Convertir estados entre API e interfaz
function estadoParaInterfaz(estado) {
  return estado === "En revision" ? "En revisión" : estado;
}

function estadoParaApi(estado) {
  return estado === "En revisión" ? "En revision" : estado;
}

// Adaptar respuesta de MongoDB al formato de React
function normalizarSolicitud(solicitud) {
  return {
    id: solicitud._id || solicitud.id,
    estudiante: solicitud.estudiante,
    tipo: solicitud.curso,
    descripcion: solicitud.descripcion,
    estado: estadoParaInterfaz(solicitud.estado),
    createdAt: solicitud.createdAt,
    updatedAt: solicitud.updatedAt,
  };
}

// Manejo centralizado de respuestas y errores
async function leerRespuesta(respuesta) {
  const contenido = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    const detalles = Array.isArray(contenido.detalles)
      ? `: ${contenido.detalles.join(", ")}`
      : "";

    const error = new Error(
      `${contenido.mensaje || "La API no pudo completar la petición"}${detalles}`
    );

    error.status = respuesta.status;
    throw error;
  }

  return contenido;
}

// READ - Consultar solicitudes
export async function obtenerSolicitudes({ signal } = {}) {
  const respuesta = await fetch(API_URL, {
    signal,
    credentials: "include",
  });

  const solicitudes = await leerRespuesta(respuesta);

  return solicitudes.map(normalizarSolicitud);
}

// CREATE - Registrar solicitud
export async function crearSolicitud(solicitud) {
  const respuesta = await fetch(API_URL, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      estudiante: solicitud.estudiante,
      curso: solicitud.tipo,
      descripcion: solicitud.descripcion,
      estado: estadoParaApi(solicitud.estado || "Pendiente"),
    }),
  });

  return normalizarSolicitud(await leerRespuesta(respuesta));
}

// UPDATE - Editar solicitud
export async function actualizarSolicitud(id, solicitud) {
  const respuesta = await fetch(
    `${API_URL}/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        estudiante: solicitud.estudiante,
        curso: solicitud.tipo,
        descripcion: solicitud.descripcion,
        estado: estadoParaApi(solicitud.estado || "Pendiente"),
      }),
    }
  );

  return normalizarSolicitud(await leerRespuesta(respuesta));
}

// DELETE - Eliminar solicitud
export async function eliminarSolicitud(id) {
  const respuesta = await fetch(
    `${API_URL}/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  return leerRespuesta(respuesta);
}
