import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback
} from 'react';

import {
    iniciarSesion,
    obtenerUsuario,
    cerrarSesion
} from '../api/authApi.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [usuario, setUsuario] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    // Verificar si existe una sesión activa
    async function verificarSesion() {
        setCargando(true);
        setError('');

        try {
            const datos = await obtenerUsuario();
            setUsuario(datos.usuario);

        } catch (error) {
            setUsuario(null);

            if (error.status !== 401) {
                setError('No se pudo verificar la sesión');
            }

        } finally {
            setCargando(false);
        }
    }

    // Verificar sesión al cargar la aplicación
    useEffect(() => {
        verificarSesion();
    }, []);

    // Iniciar sesión
    async function login(email, password) {
        setError('');

        try {
            const datos = await iniciarSesion(email, password);
            setUsuario(datos.usuario);
            return datos.usuario;

        } catch (error) {
            setError(error.message);
            throw error;
        }
    }

    // Cerrar sesión
    async function logout() {
        setError('');

        try {
            await cerrarSesion();
            setUsuario(null);

        } catch (error) {
            setError(error.message);
            throw error;
        }
    }

    const invalidarSesion = useCallback(() => {
        setUsuario(null);
        setError('La sesión ha expirado');
    }, []);

    return (
        <AuthContext.Provider
            value={{
                usuario,
                cargando,
                error,
                autenticado: Boolean(usuario),
                login,
                logout,
                verificarSesion,
                invalidarSesion
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const contexto = useContext(AuthContext);

    if (!contexto) {
        throw new Error(
            'useAuth debe utilizarse dentro de AuthProvider'
        );
    }

    return contexto;
}