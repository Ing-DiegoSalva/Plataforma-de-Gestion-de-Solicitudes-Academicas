import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute() {

    const { autenticado, cargando } = useAuth();

    if (cargando) {
        return (
            <div className="cargando" role="status">
                <span
                    className="cargando__indicador"
                    aria-hidden="true"
                />
                Verificando sesión...
            </div>
        );
    }

    if (!autenticado) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}