
import { useState } from "react";

function SolicitudCard({ solicitud, onEditar, onEliminar, enviando }) {
  const [editando, setEditando] = useState(false);
  const [error, setError] = useState("");
  const [datos, setDatos] = useState({
    estudiante: solicitud.estudiante,
    tipo: solicitud.tipo,
    descripcion: solicitud.descripcion,
    estado: solicitud.estado
  });

  const claseEstado = solicitud.estado.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");

  async function guardar(evento) {
    evento.preventDefault();
    setError("");

    if (datos.estudiante.trim().length < 3 ||
        !datos.tipo.trim() ||
        datos.descripcion.trim().length < 10) {
      setError("Revisa el nombre, tipo y descripción.");
      return;
    }

    try {
      await onEditar(solicitud.id, {
        ...datos,
        estudiante: datos.estudiante.trim(),
        descripcion: datos.descripcion.trim()
      });
      setEditando(false);
    } catch (err) {
      setError(err.message);
    }
  }

  async function eliminar() {
    if (!window.confirm("¿Eliminar esta solicitud definitivamente?")) return;
    setError("");
    try {
      await onEliminar(solicitud.id);
    } catch (err) {
      setError(err.message);
    }
  }

  function cancelar() {
    setDatos({
      estudiante: solicitud.estudiante,
      tipo: solicitud.tipo,
      descripcion: solicitud.descripcion,
      estado: solicitud.estado
    });
    setError("");
    setEditando(false);
  }

  return (
    <article className="solicitud-card">
      {error && <p className="mensaje-error" role="alert">{error}</p>}

      {editando ? (
        <form className="solicitud-formulario" onSubmit={guardar}>
          <label>Estudiante
            <input value={datos.estudiante}
              maxLength={100} minLength={3} required
              disabled={enviando}
              onChange={e => setDatos({...datos, estudiante:e.target.value})}/>
          </label>

          <label>Tipo de solicitud
            <select value={datos.tipo} required disabled={enviando}
              onChange={e => setDatos({...datos, tipo:e.target.value})}>
              <option>Constancia de estudios</option>
              <option>Cambio de horario</option>
              <option>Convalidación de curso</option>
              <option>Otro trámite académico</option>
            </select>
          </label>

          <label>Descripción
            <textarea value={datos.descripcion} minLength={10}
              maxLength={500} required disabled={enviando}
              onChange={e => setDatos({...datos, descripcion:e.target.value})}/>
          </label>

          <label>Estado
            <select value={datos.estado} disabled={enviando}
              onChange={e => setDatos({...datos, estado:e.target.value})}>
              <option>Pendiente</option>
              <option value="En revisión">En revisión</option>
              <option>Aprobado</option>
              <option>Rechazado</option>
            </select>
          </label>

          <div style={{display:"flex",gap:10,marginTop:12}}>
            <button type="submit" disabled={enviando}>
              Guardar cambios
            </button>
            <button type="button" onClick={cancelar} disabled={enviando}>
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="solicitud-card__encabezado">
            <h3>{solicitud.tipo}</h3>
            <span className={`estado estado--${claseEstado}`}>
              {solicitud.estado}
            </span>
          </div>

          <p className="solicitud-card__estudiante">{solicitud.estudiante}</p>
          <p>{solicitud.descripcion}</p>

          <div style={{display:"flex",gap:10,marginTop:16}}>
            <button type="button" disabled={enviando}
              onClick={() => setEditando(true)}>
              Editar
            </button>
            <button type="button" disabled={enviando}
              onClick={eliminar}>
              Eliminar
            </button>
          </div>
        </>
      )}
    </article>
  );
}

export default SolicitudCard;
