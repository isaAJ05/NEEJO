/**
 * Estados posibles para una orden de servicio
 * Sincronizado con el schema de Prisma
 */
export enum EstadoOrden {
  CREADA = 'CREADA',
  ASIGNADA = 'ASIGNADA',
  EN_PROGRESO = 'EN_PROGRESO',
  COMPLETADA = 'COMPLETADA',
  CANCELADA = 'CANCELADA',
  REPROGRAMADA = 'REPROGRAMADA',
}
