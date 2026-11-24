import { useState } from "react";
import { useNavigate, Navigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "./Login.css";

export default function Login() {
  const { login, autenticado, cargando } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);

  async function manejarLogin(e) {
    e.preventDefault();

    setError("");
    setEnviando(true);

    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (error) {
      setError(error.message);
    } finally {
      setEnviando(false);
    }
  }

  if (cargando) {
    return (
      <div className="cargando" role="status">
        <span className="cargando__indicador" />
        Verificando sesión...
      </div>
    );
  }

  if (autenticado) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className="panel login-panel">
      <div className="panel__titulo">
        <div className="login-icono">
          <svg
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M2 10l10-5 10 5-10 5-10-5Z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
            <path d="M22 10v6" />
          </svg>
        </div>

        <p className="paso">Portal del estudiante</p>

        <h2>¡Bienvenido!</h2>

        <p className="login-descripcion">
          Inicia sesión para gestionar tus solicitudes académicas.
        </p>
      </div>

      {location.state?.mensaje && (
        <div className="mensaje-exito" role="status">
          {location.state.mensaje}
        </div>
      )}

      <form onSubmit={manejarLogin} className="login-form">
        {error && (
          <div className="mensaje-error" role="alert">
            {error}
          </div>
        )}

        <div className="campo">
          <label htmlFor="email">Correo electrónico</label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@isil.pe"
            autoComplete="username"
            disabled={enviando}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="password">Contraseña</label>

          <div className="login-password">
            <input
              id="password"
              type={mostrarPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              autoComplete="current-password"
              disabled={enviando}
              required
            />

            <button
              type="button"
              className="login-mostrar"
              onClick={() => setMostrarPassword(!mostrarPassword)}
            ></button>
          </div>
        </div>

        <button type="submit" className="boton-primario" disabled={enviando}>
          {enviando ? "Iniciando sesión..." : "Iniciar sesión"}
        </button>
      </form>

      <div className="login-pie">
        ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
      </div>
    </section>
  );
}
