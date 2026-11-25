
import Link from "next/link";

const secciones = [
  {
    titulo: "Catálogo de trámites",
    descripcion:
      "Consulta los trámites académicos disponibles mediante generación estática (SSG).",
    ruta: "/tramites",
    tecnologia: "SSG",
  },
  {
    titulo: "Estado del servicio",
    descripcion:
      "Consulta el estado de nuestra API Node.js mediante renderizado en el servidor.",
    ruta: "/estado-servicio",
    tecnologia: "SSR",
  },
  {
    titulo: "Consulta de solicitudes",
    descripcion:
      "Visualiza solicitudes académicas de demostración utilizando rutas dinámicas.",
    ruta: "/solicitudes/1",
    tecnologia: "Ruta dinámica",
  },
];

export default function Home() {
  return (
    <main
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "60px 24px",
      }}
    >
      <header style={{ marginBottom: 48 }}>
        <p style={{ color: "#60a5fa", fontWeight: 700 }}>
          ISIL — PROGRAMACIÓN WEB II
        </p>

        <h1 style={{ fontSize: "2.5rem", marginTop: 12 }}>
          Plataforma de Gestión de Solicitudes Académicas
        </h1>

        <p style={{ marginTop: 16, opacity: 0.8 }}>
          PA4 — Implementación de Next.js con SSR, SSG
          y rutas dinámicas.
        </p>
      </header>

      <section>
        <h2>Explora las funcionalidades</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
            marginTop: 24,
          }}
        >
          {secciones.map((seccion) => (
            <article
              key={seccion.ruta}
              style={{
                border: "1px solid #64748b",
                borderRadius: 14,
                padding: 24,
              }}
            >
              <p
                style={{
                  color: "#60a5fa",
                  fontWeight: 700,
                  marginBottom: 12,
                }}
              >
                {seccion.tecnologia}
              </p>

              <h3>{seccion.titulo}</h3>

              <p style={{ margin: "16px 0" }}>
                {seccion.descripcion}
              </p>

              <Link
                href={seccion.ruta}
                style={{
                  color: "#60a5fa",
                  fontWeight: 700,
                }}
              >
                Explorar sección →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <footer
        style={{
          marginTop: 64,
          paddingTop: 24,
          borderTop: "1px solid #64748b",
        }}
      >
        <p>PA4 — Actividad 2 | Next.js</p>
        <p>Responsable: Diego Fernando Salva Puerta</p>
      </footer>
    </main>
  );
}
