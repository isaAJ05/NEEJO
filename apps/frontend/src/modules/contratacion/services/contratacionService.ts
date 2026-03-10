import apiClient from '@shared/services/api';

/**
 * TIPOS DE SERVICIO
 */
export enum TipoServicioEnum {
  POR_HORAS = 'POR_HORAS',
  POR_TAREA = 'POR_TAREA',
  POR_PAQUETE = 'POR_PAQUETE',
}

/**
 * DATOS PARA CONTRATAR UN SERVICIO
 */
export interface DatosContratacion {
  clienteId: string;
  tipoServicio: TipoServicioEnum;
  descripcion: string;
  parametrosServicio: {
    // Para POR_HORAS
    tarifaPorHora?: number;
    horasEstimadas?: number;
    
    // Para POR_TAREA
    montoBase?: number;
    complejidad?: 'BAJA' | 'MEDIA' | 'ALTA';
    
    // Para POR_PAQUETE
    montoPorEntregable?: number;
    cantidadEntregables?: number;
  };
}

/**
 * RESULTADO DE CONTRATACIÓN
 */
export interface ResultadoContratacion {
  solicitudId: string;
  cotizacionId: string;
  ordenId: string;
  montoFinal: number;
  duracionEstimada: number;
  pasosSeguidos: string[];
}

/**
 * ORDEN DE SERVICIO
 */
export interface OrdenServicio {
  id: string;
  codigoOrden: string;
  estado: 'CREADA' | 'ASIGNADA' | 'EN_PROGRESO' | 'COMPLETADA' | 'CANCELADA' | 'REPROGRAMADA';
  clienteId: string;
  proveedorId?: string;
  tipoServicio: TipoServicioEnum;
  montoTotal: number;
  fechaInicio?: string;
  fechaFinalizacion?: string;
  motivoCancelacion?: string;
}

/**
 * SERVICIO DE CONTRATACIÓN
 * Integra Frontend ↔ Backend
 */
class ContratacionService {
  /**
   * CREAR UNA NUEVA ORDEN DE SERVICIO
   * Ejecuta el flujo completo: validar → cotizar → crear orden
   */
  async contratarServicio(datos: DatosContratacion) {
    try {
      const response = await apiClient.post('/contratacion/contratar', datos);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Error al contratar servicio'
      );
    }
  }

  /**
   * CANCELAR UNA ORDEN
   */
  async cancelarOrden(ordenId: string, motivo?: string, usuarioId?: string) {
    try {
      const response = await apiClient.patch(
        `/ordenes/${ordenId}/cancelar`,
        { motivo, usuarioId }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Error al cancelar orden'
      );
    }
  }

  /**
   * REPROGRAMAR UNA ORDEN
   */
  async reprogramarOrden(
    ordenId: string,
    nuevaFecha: Date,
    motivo?: string,
    usuarioId?: string
  ) {
    try {
      const response = await apiClient.patch(
        `/ordenes/${ordenId}/reprogramar`,
        {
          nuevaFechaInicio: nuevaFecha.toISOString(),
          motivo,
          usuarioId,
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Error al reprogramar orden'
      );
    }
  }

  /**
   * CONFIRMAR EJECUCIÓN DE UNA ORDEN
   */
  async confirmarEjecucion(
    ordenId: string,
    usuarioId?: string,
    comentarios?: string
  ) {
    try {
      const response = await apiClient.patch(
        `/ordenes/${ordenId}/confirmar`,
        { usuarioId, comentarios }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Error al confirmar ejecución'
      );
    }
  }

  /**
   * OBTENER ÓRDENES DEL USUARIO
   */
  async obtenerMisOrdenes(clienteId: string) {
    try {
      const response = await apiClient.get(`/ordenes?clienteId=${clienteId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Error al obtener órdenes'
      );
    }
  }

  /**
   * OBTENER DETALLES DE UNA ORDEN
   */
  async obtenerOrden(ordenId: string) {
    try {
      const response = await apiClient.get(`/ordenes/${ordenId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Error al obtener orden'
      );
    }
  }
}

export default new ContratacionService();
