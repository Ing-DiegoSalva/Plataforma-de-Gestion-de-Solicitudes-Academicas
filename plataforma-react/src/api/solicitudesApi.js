const API_URL = import.meta.env.VITE_API_URL ||
  'http://localhost:3000/api/solicitudes';

function estadoParaInterfaz(estado) {
  return estado === 'En revision' ? 'En revisión' : estado;
}

function estadoParaApi(estado) {
  return estado === 'En revisión' ? 'En revision' : estado;
}

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

async function leerRespuesta(respuesta) {
  const contenido = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    const detalles = Array.isArray(contenido.detalles)
      ? `: ${contenido.detalles.join(', ')}`
      : '';
    throw new Error(
      `${contenido.mensaje || 'La API no pudo completar la petición'}${detalles}`,
    );
  }

  return contenido;
}

export async function obtenerSolicitudes({ signal } = {}) {
  const respuesta = await fetch(API_URL, { signal });
  const solicitudes = await leerRespuesta(respuesta);
  return solicitudes.map(normalizarSolicitud);
}

export async function crearSolicitud(solicitud) {
  const respuesta = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      estudiante: solicitud.estudiante,
      curso: solicitud.tipo,
      descripcion: solicitud.descripcion,
      estado: estadoParaApi(solicitud.estado || 'Pendiente'),
    }),
  });

  return normalizarSolicitud(await leerRespuesta(respuesta));
}
