import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

// Datos demostrativos; no contienen información privada.
const solicitudes = [
  {
    id: "1",
    estudiante: "Estudiante de prueba 1",
    tramite: "Constancia de estudios",
    estado: "Pendiente",
  },
  {
    id: "2",
    estudiante: "Estudiante de prueba 2",
    tramite: "Rectificación de notas",
    estado: "En revisión",
  },
  {
    id: "3",
    estudiante: "Estudiante de prueba 3",
    tramite: "Reserva de matrícula",
    estado: "Aprobada",
  },
];

export default async function DetalleSolicitud({ params }: Props) {
  const { id } = await params;

  const solicitud = solicitudes.find(
    (item) => item.id === id
  );

  if (!solicitud) {
    notFound();
  }

  return (
    <main
      style={{
        maxWidth: 850,
        margin: "40px auto",
        padding: 24,
      }}
    >
      <Link href="/tramites">
        ← Volver al catálogo
      </Link>

      <h1>Detalle de solicitud académica</h1>

      <section
        style={{
          marginTop: 24,
          padding: 24,
          border: "1px solid #ccc",
          borderRadius: 12,
        }}
      >
        <h2>Solicitud #{solicitud.id}</h2>

        <p>
          <strong>Estudiante:</strong>{" "}
          {solicitud.estudiante}
        </p>

        <p>
          <strong>Trámite:</strong>{" "}
          {solicitud.tramite}
        </p>

        <p>
          <strong>Estado:</strong>{" "}
          {solicitud.estado}
        </p>
      </section>

      <p style={{ marginTop: 24 }}>
        Información demostrativa para PA4.
      </p>
    </main>
  );
}