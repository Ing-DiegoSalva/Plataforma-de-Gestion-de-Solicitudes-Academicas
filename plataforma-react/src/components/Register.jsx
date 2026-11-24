import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { registrarUsuario } from '../api/authApi.js';
import { useAuth } from '../context/AuthContext.jsx';
import './Login.css';

export default function Register() {

    const navigate = useNavigate();
    const { autenticado, cargando } = useAuth();

    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');

    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [error, setError] = useState('');
    const [enviando, setEnviando] = useState(false);

    async function manejarRegistro(e) {
        e.preventDefault();
        setError('');

        if (nombre.trim().length < 3) {
            setError('El nombre debe tener al menos 3 caracteres');
            return;
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (password !== confirmarPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setEnviando(true);

        try {
            await registrarUsuario({
                nombre: nombre.trim(),
                email: email.trim(),
                password
            });

            navigate('/login', {
                replace: true,
                state: {
                    mensaje: 'Cuenta creada correctamente. Ya puedes iniciar sesión.'
                }
            });

        } catch (error) {
            setError(error.message);

        } finally {
            setEnviando(false);
        }
    }

    if (cargando) {
        return <p>Verificando sesión...</p>;
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
                        <circle cx="9" cy="7" r="4" />
                        <path d="M2 21v-2a7 7 0 0 1 14 0v2" />
                        <path d="M19 8v6M16 11h6" />
                    </svg>
                </div>

                <p className="paso">Portal del estudiante</p>

                <h2>Crea tu cuenta</h2>

                <p className="login-descripcion">
                    Regístrate para gestionar tus solicitudes académicas.
                </p>

            </div>

            <form
                className="login-form"
                onSubmit={manejarRegistro}
            >

                {error && (
                    <div className="mensaje-error" role="alert">
                        {error}
                    </div>
                )}

                <div className="campo">
                    <label htmlFor="nombre">
                        Nombre completo
                    </label>

                    <input
                        id="nombre"
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Ingresa tu nombre completo"
                        autoComplete="name"
                        minLength={3}
                        maxLength={100}
                        disabled={enviando}
                        required
                    />
                </div>

                <div className="campo">
                    <label htmlFor="email">
                        Correo electrónico
                    </label>

                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="correo@isil.pe"
                        autoComplete="email"
                        disabled={enviando}
                        required
                    />
                </div>

                <div className="campo">
                    <label htmlFor="password">
                        Contraseña
                    </label>

                    <div className="login-password">

                        <input
                            id="password"
                            type={mostrarPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mínimo 6 caracteres"
                            autoComplete="new-password"
                            minLength={6}
                            disabled={enviando}
                            required
                        />

                        <button
                            type="button"
                            className="login-mostrar"
                            onClick={() =>
                                setMostrarPassword(!mostrarPassword)
                            }
                            aria-label={mostrarPassword
                                ? 'Ocultar contraseñas'
                                : 'Mostrar contraseñas'}
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
                                <circle cx="12" cy="12" r="3" />

                                {mostrarPassword && (
                                    <path d="M3 3l18 18" />
                                )}
                            </svg>
                        </button>

                    </div>
                </div>

                <div className="campo">
                    <label htmlFor="confirmarPassword">
                        Confirmar contraseña
                    </label>

                    <input
                        id="confirmarPassword"
                        type={mostrarPassword ? 'text' : 'password'}
                        value={confirmarPassword}
                        onChange={(e) =>
                            setConfirmarPassword(e.target.value)
                        }
                        placeholder="Repite tu contraseña"
                        autoComplete="new-password"
                        disabled={enviando}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="boton-primario"
                    disabled={enviando}
                >
                    {enviando
                        ? 'Creando cuenta...'
                        : 'Crear cuenta'}
                </button>

            </form>

            <div className="login-pie">
                ¿Ya tienes una cuenta?{' '}
                <Link to="/login">Inicia sesión</Link>
            </div>

        </section>
    );
}