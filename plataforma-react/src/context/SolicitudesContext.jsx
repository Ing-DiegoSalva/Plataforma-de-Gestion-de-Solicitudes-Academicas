import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  crearSolicitud,
  obtenerSolicitudes,
} from '../api/solicitudesApi.js';

const SolicitudesContext = createContext(null);

export function SolicitudesProvider({ children }) {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  const cargarSolicitudes = useCallback(async ({ signal } = {}) => {
    setCargando(true);
    setError('');

    try {
      const datos = await obtenerSolicitudes({ signal });
      setSolicitudes(datos);
    } catch (errorPeticion) {
      if (errorPeticion.name !== 'AbortError') {
        setError(
          'No se pudieron cargar las solicitudes. Verifica que el backend esté encendido.',
        );
      }
    } finally {
      if (!signal?.aborted) setCargando(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    cargarSolicitudes({ signal: controller.signal });
    return () => controller.abort();
  }, [cargarSolicitudes]);

  async function agregarSolicitud(nuevaSolicitud) {
    setEnviando(true);
    setError('');

    try {
      const solicitudCreada = await crearSolicitud(nuevaSolicitud);
      setSolicitudes((anteriores) => [solicitudCreada, ...anteriores]);
      return solicitudCreada;
    } catch (errorPeticion) {
      setError(errorPeticion.message);
      throw errorPeticion;
    } finally {
      setEnviando(false);
    }
  }

  return (
    <SolicitudesContext.Provider
      value={{
        solicitudes,
        cargando,
        enviando,
        error,
        cargarSolicitudes,
        agregarSolicitud,
      }}
    >
      {children}
    </SolicitudesContext.Provider>
  );
}

export function useSolicitudes() {
  const contexto = useContext(SolicitudesContext);

  if (!contexto) {
    throw new Error(
      'useSolicitudes debe utilizarse dentro de SolicitudesProvider',
    );
  }

  return contexto;
}
