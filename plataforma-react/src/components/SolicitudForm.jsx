import { useState } from 'react';

const formularioInicial = {
  estudiante: '',
  tipo: '',
  descripcion: '',
};

function SolicitudForm({ onAgregar, enviando }) {
  const [formulario, setFormulario] = useState(formularioInicial);
  const [error, setError] = useState('');

  function manejarCambio(evento) {
    const { name, value } = evento.target;
    setFormulario((anterior) => ({ ...anterior, [name]: value }));
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError('');

    const solicitud = {
      estudiante: formulario.estudiante.trim(),
      tipo: formulario.tipo.trim(),
      descripcion: formulario.descripcion.trim(),
      estado: 'Pendiente',
    };

    if (solicitud.estudiante.length < 3) {
      setError('El nombre del estudiante debe tener al menos 3 caracteres.');
      return;
    }
    if (solicitud.descripcion.length < 10) {
      setError('La descripción debe tener al menos 10 caracteres.');
      return;
    }

    try {
      await onAgregar(solicitud);
      setFormulario(formularioInicial);
    } catch (errorPeticion) {
      setError(errorPeticion.message);
    }
  }

  return (
    <form className="solicitud-formulario" onSubmit={manejarEnvio}>
      {error && (
        <div className="mensaje-error" role="alert">
          {error}
        </div>
      )}

      <div className="campo campo--completo">
        <label htmlFor="estudiante">Nombre del estudiante</label>
        <input
          id="estudiante"
          name="estudiante"
          value={formulario.estudiante}
          onChange={manejarCambio}
          minLength="3"
          maxLength="100"
          disabled={enviando}
          required
        />
      </div>

      <div className="campo campo--completo">
        <label htmlFor="tipo">Tipo de solicitud</label>
        <select
          id="tipo"
          name="tipo"
          value={formulario.tipo}
          onChange={manejarCambio}
          disabled={enviando}
          required
        >
          <option value="">Selecciona una opción</option>
          <option>Constancia de estudios</option>
          <option>Cambio de horario</option>
          <option>Convalidación de curso</option>
          <option>Otro trámite académico</option>
        </select>
      </div>

      <div className="campo campo--completo">
        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={formulario.descripcion}
          onChange={manejarCambio}
          rows="4"
          minLength="10"
          maxLength="500"
          disabled={enviando}
          required
        />
      </div>

      <button className="boton-primario" type="submit" disabled={enviando}>
        {enviando ? 'Registrando…' : 'Registrar solicitud'}
      </button>
    </form>
  );
}

export default SolicitudForm;
