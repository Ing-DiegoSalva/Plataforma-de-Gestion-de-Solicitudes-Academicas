import {
  createContext, useCallback, useContext, useEffect, useState
} from "react";
import {
  crearSolicitud,
  obtenerSolicitudes,
  actualizarSolicitud,
  eliminarSolicitud
} from "../api/solicitudesApi.js";
import { useAuth } from "./AuthContext.jsx";

const SolicitudesContext = createContext(null);

export function SolicitudesProvider({ children }) {
  const { autenticado, invalidarSesion } = useAuth();
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  const manejarError = useCallback((errorPeticion) => {
    if (errorPeticion.status === 401) invalidarSesion();
    else setError(errorPeticion.message);
  }, [invalidarSesion]);

  const cargarSolicitudes = useCallback(async ({ signal } = {}) => {
    setCargando(true);
    setError("");
    try {
      const datos = await obtenerSolicitudes({ signal });
      if (!signal?.aborted) setSolicitudes(datos);
    } catch (err) {
      if (err.name !== "AbortError" && !signal?.aborted) {
        manejarError(err);
      }
    } finally {
      if (!signal?.aborted) setCargando(false);
    }
  }, [manejarError]);

  useEffect(() => {
    if (!autenticado) {
      setSolicitudes([]);
      setCargando(false);
      setError("");
      return;
    }
    const controller = new AbortController();
    cargarSolicitudes({ signal: controller.signal });
    return () => controller.abort();
  }, [autenticado, cargarSolicitudes]);

  async function ejecutarOperacion(operacion) {
    setEnviando(true);
    setError("");
    try {
      return await operacion();
    } catch (err) {
      manejarError(err);
      throw err;
    } finally {
      setEnviando(false);
    }
  }

  function agregarSolicitud(datos) {
    return ejecutarOperacion(async () => {
      const creada = await crearSolicitud(datos);
      setSolicitudes(prev => [creada, ...prev]);
      return creada;
    });
  }

  function editarSolicitud(id, datos) {
    return ejecutarOperacion(async () => {
      const actualizada = await actualizarSolicitud(id, datos);
      setSolicitudes(prev =>
        prev.map(s => s.id === id ? actualizada : s)
      );
      return actualizada;
    });
  }

  function borrarSolicitud(id) {
    return ejecutarOperacion(async () => {
      await eliminarSolicitud(id);
      setSolicitudes(prev => prev.filter(s => s.id !== id));
    });
  }

  return (
    <SolicitudesContext.Provider value={{
      solicitudes, cargando, enviando, error,
      cargarSolicitudes, agregarSolicitud,
      editarSolicitud, borrarSolicitud
    }}>
      {children}
    </SolicitudesContext.Provider>
  );
}

export function useSolicitudes() {
  const contexto = useContext(SolicitudesContext);
  if (!contexto) {
    throw new Error("useSolicitudes debe usarse dentro de SolicitudesProvider");
  }
  return contexto;
}