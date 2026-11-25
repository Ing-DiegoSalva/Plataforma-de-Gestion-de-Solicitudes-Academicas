import Link from "next/link";

const tramites = [
  {
    id: 1,
    nombre: "Constancia de estudios",
    descripcion: "Solicita un documento que acredite tu condición de estudiante.",
    plazo: "3 días hábiles",
  },
  {
    id: 2,
    nombre: "Rectificación de notas",
    descripcion: "Solicita una revisión de tus calificaciones académicas.",
    plazo: "5 días hábiles",
  },
  {
    id: 3,
    nombre: "Reserva de matrícula",
    descripcion: "Consulta el procedimiento para reservar tu matrícula.",
    plazo: "2 días hábiles",
  },
];

export default function TramitesPage() {
  return (
    <main style={{ maxWidth: 960, margin: "40px auto", padding: 24 }}>
      <Link href="/">← Volver al inicio</Link>

      <h1>Catálogo de Trámites Académicos</h1>

      <p>
        Consulta los trámites disponibles en nuestra plataforma.
      </p>

      <section style={{ display: "grid", gap: 20, marginTop: 30 }}>
        {tramites.map((tramite) => (
          <article
            key={tramite.id}
            style={{
              padding: 24,
              border: "1px solid #ccc",
              borderRadius: 12,
            }}
          >
            <h2>{tramite.nombre}</h2>
            <p>{tramite.descripcion}</p>
            <p>
              <strong>Plazo estimado:</strong> {tramite.plazo}
            </p>
          </article>
        ))}
      </section>

      <p style={{ marginTop: 24 }}>
        Información demostrativa para el proyecto académico.
      </p>
    </main>
  );
}