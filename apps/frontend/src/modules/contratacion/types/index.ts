export enum TipoServicio {
  POR_HORAS = 'POR_HORAS',
  POR_TAREA = 'POR_TAREA',
  POR_PAQUETE = 'POR_PAQUETE',
}

export enum EstadoSolicitud {
  PENDIENTE = 'PENDIENTE',
  EN_COTIZACION = 'EN_COTIZACION',
  COTIZADA = 'COTIZADA',
  ACEPTADA = 'ACEPTADA',
  RECHAZADA = 'RECHAZADA',
  CANCELADA = 'CANCELADA',
}

export enum EstadoOrden {
  CREADA = 'CREADA',
  ASIGNADA = 'ASIGNADA',
  EN_PROGRESO = 'EN_PROGRESO',
  COMPLETADA = 'COMPLETADA',
  CANCELADA = 'CANCELADA',
  REPROGRAMADA = 'REPROGRAMADA',
}

export enum EstadoSolicitudReprogramacion {
  PENDIENTE = 'PENDIENTE',
  ACEPTADA = 'ACEPTADA',
  RECHAZADA = 'RECHAZADA',
}

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  rol: string;
}

export interface SolicitudServicio {
  id: string;
  titulo: string;
  descripcion: string;
  clienteId: string;
  tipoServicio: TipoServicio;
  presupuestoEstimado?: number;
  estado: EstadoSolicitud;
  createdAt: string;
  updatedAt: string;
  cliente?: Usuario;
}

export interface OrdenServicio {
  id: string;
  codigoOrden: string;
  solicitudId: string;
  cotizacionId: string;
  clienteId: string;
  proveedorId?: string;
  tipoServicio: TipoServicio;
  montoTotal: number;
  estado: EstadoOrden;
  fechaInicio?: string;
  fechaInicioPropuesta?: string;
  fechaFinalizacion?: string;
  motivoCancelacion?: string;
  motivoReprogramacion?: string;
  propuestaReprogramacionPorId?: string;
  propuestaReprogramacionParaId?: string;
  estadoSolicitudReprogramacion?: EstadoSolicitudReprogramacion;
  createdAt: string;
  updatedAt: string;
  cliente?: Usuario;
  proveedor?: Usuario;
  solicitud?: SolicitudServicio;
}

export interface CreateSolicitudDTO {
  titulo: string;
  descripcion: string;
  clienteId: string;
  tipoServicio: TipoServicio;
  presupuestoEstimado?: number;
}