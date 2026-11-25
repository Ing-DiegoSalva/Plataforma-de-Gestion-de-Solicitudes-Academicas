
import Link from "next/link";

export const dynamic = "force-dynamic";

interface EstadoAPI {
  mensaje: string;
  estado: string;
}

async function consultarEstado(): Promise<EstadoAPI | null> {
  const apiUrl = process.env.API_BASE_URL;

  if (!apiUrl) {
    console.warn("API_BASE_URL no está configurada");
    return null;
  }

  try {
    const respuesta = await fetch(apiUrl, {
      cache: "no-store",
    });

    if (!respuesta.ok) {
      console.error("Error HTTP:", respuesta.status);
      return null;
    }

    const datos: unknown = await respuesta.json();

    if (
      typeof datos !== "object" ||
      datos === null ||
      !("mensaje" in datos) ||
      !("estado" in datos) ||
      typeof datos.mensaje !== "string" ||
      typeof datos.estado !== "string"
    ) {
      return null;
    }

    return {
      mensaje: datos.mensaje,
      estado: datos.estado,
    };
  } catch (error) {
    console.error("Error al consultar la API:", error);
    return null;
  }
}

export default async function EstadoServicioPage() {
  const datos = await consultarEstado();

  const fechaConsulta = new Date().toLocaleString("es-PE", {
    timeZone: "America/Lima",
  });

  return (
    <main style={{ maxWidth: 960, margin: "40px auto", padding: 24 }}>
      <Link href="/">← Volver al inicio</Link>

      <h1>Estado del servicio académico</h1>

      <p>
        Consulta del estado del backend mediante
        Server-Side Rendering (SSR).
      </p>

      <section
        style={{
          padding: 24,
          border: "1px solid #ccc",
          borderRadius: 12,
          marginTop: 24,
        }}
      >
        <h2>Estado del backend</h2>

        <p>
          <strong>Conexión:</strong>{" "}
          {datos ? "Disponible" : "No disponible"}
        </p>

        <p>
          <strong>Respuesta:</strong>{" "}
          {datos?.mensaje ?? "No se pudo consultar la API"}
        </p>

        <p>
          <strong>Estado:</strong>{" "}
          {datos?.estado ?? "Sin respuesta"}
        </p>

        <p>
          <strong>Última consulta:</strong> {fechaConsulta}
        </p>
      </section>
    </main>
  );
}
