import Link from "next/link";

// Fuerza el renderizado dinámico en el servidor.
export const dynamic = "force-dynamic";

interface EstadoAPI {
  mensaje: string;
  estado: string;
}

async function consultarEstado(): Promise<EstadoAPI | null> {
  try {
    const respuesta = await fetch("http://localhost:3000/", {
      cache: "no-store",
    });

    if (!respuesta.ok) {
      return null;
    }

    return await respuesta.json();
  } catch {
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
      <Link href="/tramites">← Volver a trámites</Link>

      <h1>Estado del servicio académico</h1>

      <p>
        Esta página utiliza Server-Side Rendering (SSR)
        para consultar el estado de nuestra API Node.js.
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