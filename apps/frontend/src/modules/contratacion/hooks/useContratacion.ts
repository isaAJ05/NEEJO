import { useState, useCallback } from 'react';
import contratacionService, {
  DatosContratacion,
  ResultadoContratacion,
  OrdenServicio,
} from '../services/contratacionService';

interface UseContratacionReturn {
  // Estados
  cargando: boolean;
  error: string | null;
  exito: boolean;
  resultado: ResultadoContratacion | null;

  // Acciones
  contratar: (datos: DatosContratacion) => Promise<void>;
  cancelar: (ordenId: string, motivo?: string, usuarioId?: string) => Promise<void>;
  reprogramar: (ordenId: string, nuevaFecha: Date, motivo?: string, usuarioId?: string) => Promise<void>;
  confirmar: (ordenId: string, usuarioId?: string, comentarios?: string) => Promise<void>;
  obtenerOrdenes: (clienteId: string) => Promise<OrdenServicio[]>;
  
  // Limpiar estados
  limpiar: () => void;
}

/**
 * HOOK: useContratacion
 * Maneja toda la lógica de contratación en componentes React
 */
export function useContratacion(): UseContratacionReturn {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);
  const [resultado, setResultado] = useState<ResultadoContratacion | null>(null);

  const limpiar = useCallback(() => {
    setError(null);
    setExito(false);
    setResultado(null);
  }, []);

  const contratar = useCallback(async (datos: DatosContratacion) => {
    setCargando(true);
    limpiar();
    try {
      const respuesta = await contratacionService.contratarServicio(datos);
      setResultado(respuesta.resultado);
      setExito(true);
    } catch (err: any) {
      setError(err.message);
      setExito(false);
    } finally {
      setCargando(false);
    }
  }, [limpiar]);

  const cancelar = useCallback(
    async (ordenId: string, motivo?: string, usuarioId?: string) => {
      setCargando(true);
      limpiar();
      try {
        await contratacionService.cancelarOrden(ordenId, motivo, usuarioId);
        setExito(true);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    },
    [limpiar]
  );

  const reprogramar = useCallback(
    async (
      ordenId: string,
      nuevaFecha: Date,
      motivo?: string,
      usuarioId?: string
    ) => {
      setCargando(true);
      limpiar();
      try {
        await contratacionService.reprogramarOrden(
          ordenId,
          nuevaFecha,
          motivo,
          usuarioId
        );
        setExito(true);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    },
    [limpiar]
  );

  const confirmar = useCallback(
    async (ordenId: string, usuarioId?: string, comentarios?: string) => {
      setCargando(true);
      limpiar();
      try {
        await contratacionService.confirmarEjecucion(
          ordenId,
          usuarioId,
          comentarios
        );
        setExito(true);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    },
    [limpiar]
  );

  const obtenerOrdenes = useCallback(
    async (clienteId: string): Promise<OrdenServicio[]> => {
      setCargando(true);
      try {
        const respuesta = await contratacionService.obtenerMisOrdenes(clienteId);
        return respuesta.ordenes || [];
      } catch (err: any) {
        setError(err.message);
        return [];
      } finally {
        setCargando(false);
      }
    },
    []
  );

  return {
    cargando,
    error,
    exito,
    resultado,
    contratar,
    cancelar,
    reprogramar,
    confirmar,
    obtenerOrdenes,
    limpiar,
  };
}

export default useContratacion;
