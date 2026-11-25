import { useEffect, useMemo, useState } from "react";
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import FiltroSolicitudes from "./components/FiltroSolicitudes.jsx";
import ResumenSolicitudes from "./components/ResumenSolicitudes.jsx";
import SolicitudForm from "./components/SolicitudForm.jsx";
import SolicitudList from "./components/SolicitudList.jsx";

import { useSolicitudes } from "./context/SolicitudesContext.jsx";
import { cambiarFiltro, restablecerFiltro } from "./redux/filtroSlice.js";

import Login from "./components/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import Register from "./components/Register.jsx";

function App() {
  const navigate = useNavigate();
  const { usuario, autenticado, logout } = useAuth();

  const [errorSesion, setErrorSesion] = useState("");
  const [mensaje, setMensaje] = useState("");

  const {
    solicitudes,
    cargando,
    enviando,
    error,
    cargarSolicitudes,
    agregarSolicitud,
  } = useSolicitudes();

  const filtro = useSelector((state) => state.filtro.estadoSeleccionado);
  const dispatch = useDispatch();

  // Filtrar solicitudes mediante Redux
  const solicitudesFiltradas = useMemo(() => {
    if (filtro === "Todas") return solicitudes;

    return solicitudes.filter(
      (solicitud) => solicitud.estado === filtro
    );
  }, [filtro, solicitudes]);

  // Registrar una solicitud mediante la API
  async function registrarSolicitud(nuevaSolicitud) {
    await agregarSolicitud(nuevaSolicitud);

    dispatch(restablecerFiltro());
    setMensaje("La solicitud se registró correctamente.");
  }

  // Cerrar sesión
  async function manejarLogout() {
    setErrorSesion("");

    try {
      await logout();

      setMensaje("");
      dispatch(restablecerFiltro());

      navigate("/login", { replace: true });
    } catch (error) {
      setErrorSesion(error.message);
    }
  }

  // Ocultar mensajes de confirmación
  useEffect(() => {
    if (!mensaje) return undefined;

    const temporizador = setTimeout(() => {
      setMensaje("");
    }, 3000);

    return () => clearTimeout(temporizador);
  }, [mensaje]);

  // Mostrar solicitudes, carga o errores
  const resultadoSolicitudes = cargando ? (
    <div className="cargando" role="status">
      <span
        className="cargando__indicador"
        aria-hidden="true"
      />
      Cargando solicitudes…
    </div>
  ) : error ? (
    <div className="mensaje-error" role="alert">
      <p>{error}</p>
      <button
        type="button"
        onClick={() => cargarSolicitudes()}
      >
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

          <nav
            className="menu-navegacion"
            aria-label="Navegación principal"
          >
            {autenticado ? (
              <>
                <NavLink to="/" end>
                  Inicio
                </NavLink>

                <NavLink to="/registro">
                  Registro
                </NavLink>

                <NavLink to="/solicitudes">
                  Solicitudes
                </NavLink>

                <div className="usuario-sesion">
                  <div className="usuario-avatar">
                    {usuario?.nombre?.charAt(0).toUpperCase()}
                  </div>

                  <div className="usuario-info">
                    <span>{usuario?.nombre}</span>
                    <small>{usuario?.rol}</small>
                  </div>
                </div>

                <button
                  type="button"
                  className="boton-logout"
                  onClick={manejarLogout}
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <NavLink to="/login">
                Iniciar sesión
              </NavLink>
            )}
          </nav>
        </div>
      </header>

      <main className="contenedor contenido-principal">
        {mensaje && (
          <div className="mensaje-exito" role="status">
            {mensaje}
          </div>
        )}

        {errorSesion && (
          <div className="mensaje-error" role="alert">
            {errorSesion}
          </div>
        )}

        <Routes>
          {/* ================================= */}
          {/* RUTAS PÚBLICAS                     */}
          {/* ================================= */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* ================================= */}
          {/* RUTAS PROTEGIDAS CON SESIÓN JWT   */}
          {/* ================================= */}

          <Route element={<ProtectedRoute />}>

            {/* Inicio */}
            <Route
              path="/"
              element={
                <>
                  <section className="presentacion">
                    <p className="etiqueta">
                      Portal del estudiante
                    </p>

                    <h1>
                      Gestiona tus solicitudes académicas
                    </h1>

                    <p>
                      Registra solicitudes y consulta su
                      estado desde un solo lugar.
                    </p>
                  </section>

                  <ResumenSolicitudes />
                </>
              }
            />

            {/* Registro de solicitudes */}
            <Route
              path="/registro"
              element={
                <section className="panel">
                  <div className="panel__titulo">
                    <p className="paso">
                      Nueva solicitud
                    </p>

                    <h2>
                      Registra un trámite
                    </h2>
                  </div>

                  <SolicitudForm
                    onAgregar={registrarSolicitud}
                    enviando={enviando}
                  />
                </section>
              }
            />

            {/* Listado de solicitudes */}
            <Route
              path="/solicitudes"
              element={
                <section className="seccion-solicitudes">
                  <FiltroSolicitudes
                    filtro={filtro}
                    onCambiarFiltro={(valor) =>
                      dispatch(cambiarFiltro(valor))
                    }
                    total={solicitudesFiltradas.length}
                  />

                  {resultadoSolicitudes}
                </section>
              }
            />

          </Route>
          {/* FIN DE RUTAS PROTEGIDAS */}

          {/* Ruta no encontrada */}
          <Route
            path="*"
            element={<h2>Página no encontrada</h2>}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
