import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {

    const { login, autenticado, cargando } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [enviando, setEnviando] = useState(false);

    async function manejarLogin(e) {
        e.preventDefault();

        setError('');
        setEnviando(true);

        try {
            await login(email, password);
            navigate('/', { replace: true });

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
                <p className="paso">Acceso al sistema</p>
                <h2>Iniciar sesión</h2>
            </div>

            <form onSubmit={manejarLogin}
                  className="login-form">

                {error && (
                    <div className="mensaje-error" role="alert">
                        {error}
                    </div>
                )}

                <label htmlFor="email">
                    Correo electrónico
                </label>

                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@isil.pe"
                    autoComplete="username"
                    required
                />

                <label htmlFor="password">
                    Contraseña
                </label>

                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingrese su contraseña"
                    autoComplete="current-password"
                    required
                />

                <button type="submit" disabled={enviando}>
                    {enviando
                        ? 'Iniciando sesión...'
                        : 'Iniciar sesión'}
                </button>

            </form>

        </section>
    );
}