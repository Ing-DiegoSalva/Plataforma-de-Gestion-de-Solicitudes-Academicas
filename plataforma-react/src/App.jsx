import { useEffect, useMemo, useState } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import FiltroSolicitudes from './components/FiltroSolicitudes.jsx';
import ResumenSolicitudes from './components/ResumenSolicitudes.jsx';
import SolicitudForm from './components/SolicitudForm.jsx';
import SolicitudList from './components/SolicitudList.jsx';
import { useSolicitudes } from './context/SolicitudesContext.jsx';
import {
  cambiarFiltro,
  restablecerFiltro,
} from './redux/filtroSlice.js';

function App() {
  const {
    solicitudes,
    cargando,
    enviando,
    error,
    cargarSolicitudes,
    agregarSolicitud,
  } = useSolicitudes();
  const [mensaje, setMensaje] = useState('');
  const filtro = useSelector((state) => state.filtro.estadoSeleccionado);
  const dispatch = useDispatch();

  const solicitudesFiltradas = useMemo(() => {
    if (filtro === 'Todas') return solicitudes;
    return solicitudes.filter((solicitud) => solicitud.estado === filtro);
  }, [filtro, solicitudes]);

  async function registrarSolicitud(nuevaSolicitud) {
    await agregarSolicitud(nuevaSolicitud);
    dispatch(restablecerFiltro());
    setMensaje('La solicitud se registró correctamente.');
  }

  useEffect(() => {
    if (!mensaje) return undefined;
    const temporizador = setTimeout(() => setMensaje(''), 3000);
    return () => clearTimeout(temporizador);
  }, [mensaje]);

  const resultadoSolicitudes = cargando ? (
    <div className="cargando" role="status">
      <span className="cargando__indicador" aria-hidden="true" />
      Cargando solicitudes…
    </div>
  ) : error ? (
    <div className="mensaje-error" role="alert">
      <p>{error}</p>
      <button type="button" onClick={() => cargarSolicitudes()}>
        Intentar nuevamente
      </button>
    </div>
  ) : (
    <SolicitudList solicitudes={solicitudesFiltradas} />
  );

  return (
    <div className="aplicacion">
      <header className="encabezado">
        <div className="contenedor encabezado__contenido">
          <div>
            <strong>Gestión Académica</strong>
            <p>Plataforma de solicitudes</p>
          </div>
          <nav className="menu-navegacion" aria-label="Navegación principal">
            <NavLink to="/" end>Inicio</NavLink>
            <NavLink to="/registro">Registro</NavLink>
            <NavLink to="/solicitudes">Solicitudes</NavLink>
          </nav>
        </div>
      </header>

      <main className="contenedor contenido-principal">
        {mensaje && (
          <div className="mensaje-exito" role="status">{mensaje}</div>
        )}

        <Routes>
          <Route
            path="/"
            element={(
              <>
                <section className="presentacion">
                  <p className="etiqueta">Portal del estudiante</p>
                  <h1>Gestiona tus solicitudes académicas</h1>
                  <p>
                    Registra solicitudes y consulta su estado desde un solo lugar.
                  </p>
                </section>
                <ResumenSolicitudes />
              </>
            )}
          />
          <Route
            path="/registro"
            element={(
              <section className="panel">
                <div className="panel__titulo">
                  <p className="paso">Nueva solicitud</p>
                  <h2>Registra un trámite</h2>
                </div>
                <SolicitudForm
                  onAgregar={registrarSolicitud}
                  enviando={enviando}
                />
              </section>
            )}
          />
          <Route
            path="/solicitudes"
            element={(
              <section className="seccion-solicitudes">
                <FiltroSolicitudes
                  filtro={filtro}
                  onCambiarFiltro={(valor) => dispatch(cambiarFiltro(valor))}
                  total={solicitudesFiltradas.length}
                />
                {resultadoSolicitudes}
              </section>
            )}
          />
          <Route path="*" element={<h2>Página no encontrada</h2>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
