import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/persistence/prisma/prisma.service';
import { EstadoOrden } from '@prisma/client';

/**
 * PATRÓN: Command (Comportamiento)
 * 
 * Propósito: Encapsular una acción como un objeto, permitiendo parametrizar,
 * encolar, registrar y deshacer operaciones.
 * 
 * Ventajas:
 * - Desacopla el objeto que invoca la operación del que la ejecuta
 * - Permite implementar deshacer/rehacer
 * - Facilita el registro de operaciones (auditoría)
 * - Permite encolar y ejecutar comandos de forma asíncrona
 */

// Interfaz base del Command
export interface ICommand {
  execute(): Promise<any>;
  validate(): Promise<boolean>;
  getDescription(): string;
}

/**
 * COMMAND 1: Cancelar Orden
 */
@Injectable()
export class CancelarOrdenCommand implements ICommand {
  constructor(private readonly prisma: PrismaService) {}

  private ordenId: string;
  private motivo: string;
  private usuarioId?: string;

  setParams(ordenId: string, motivo: string, usuarioId?: string) {
    this.ordenId = ordenId;
    this.motivo = motivo;
    this.usuarioId = usuarioId;
    return this;
  }

  async validate(): Promise<boolean> {
    const orden = await this.prisma.ordenServicio.findUnique({
      where: { id: this.ordenId },
    });

    if (!orden) {
      throw new NotFoundException('Orden no encontrada');
    }

    // Solo se puede cancelar si está en ciertos estados
    const estadosPermitidos: EstadoOrden[] = [EstadoOrden.CREADA, EstadoOrden.ASIGNADA, EstadoOrden.EN_PROGRESO];
    if (!estadosPermitidos.includes(orden.estado)) {
      throw new Error(`No se puede cancelar una orden en estado ${orden.estado}`);
    }

    return true;
  }

  async execute(): Promise<any> {
    await this.validate();

    const ordenActual = await this.prisma.ordenServicio.findUnique({
      where: { id: this.ordenId },
    });

    // Actualizar orden
    const ordenActualizada = await this.prisma.ordenServicio.update({
      where: { id: this.ordenId },
      data: {
        estado: EstadoOrden.CANCELADA,
        motivoCancelacion: this.motivo,
      },
    });

    // Registrar en historial
    await this.prisma.historialEstado.create({
      data: {
        ordenId: this.ordenId,
        estadoAnterior: ordenActual.estado,
        estadoNuevo: EstadoOrden.CANCELADA,
        motivo: this.motivo,
        cambiadoPor: this.usuarioId || 'SISTEMA',
      },
    });

    return {
      orden: ordenActualizada,
      mensaje: 'Orden cancelada exitosamente',
    };
  }

  getDescription(): string {
    return `Cancelar orden ${this.ordenId} por: ${this.motivo}`;
  }
}

/**
 * COMMAND 2: Reprogramar Orden
 */
@Injectable()
export class ReprogramarOrdenCommand implements ICommand {
  constructor(private readonly prisma: PrismaService) {}

  private ordenId: string;
  private nuevaFechaInicio: Date;
  private motivo: string;
  private usuarioId?: string;

  setParams(
    ordenId: string,
    nuevaFechaInicio: Date,
    motivo: string,
    usuarioId?: string,
  ) {
    this.ordenId = ordenId;
    this.nuevaFechaInicio = nuevaFechaInicio;
    this.motivo = motivo;
    this.usuarioId = usuarioId;
    return this;
  }

  async validate(): Promise<boolean> {
    const orden = await this.prisma.ordenServicio.findUnique({
      where: { id: this.ordenId },
    });

    if (!orden) {
      throw new NotFoundException('Orden no encontrada');
    }

    if (orden.estado === EstadoOrden.COMPLETADA || orden.estado === EstadoOrden.CANCELADA) {
      throw new Error('No se puede reprogramar una orden completada o cancelada');
    }

    if (this.nuevaFechaInicio <= new Date()) {
      throw new Error('La nueva fecha debe ser futura');
    }

    return true;
  }

  async execute(): Promise<any> {
    await this.validate();

    const ordenActual = await this.prisma.ordenServicio.findUnique({
      where: { id: this.ordenId },
    });

    // Actualizar orden
    const ordenActualizada = await this.prisma.ordenServicio.update({
      where: { id: this.ordenId },
      data: {
        fechaInicio: this.nuevaFechaInicio,
        estado: EstadoOrden.REPROGRAMADA,
      },
    });

    // Registrar en historial
    await this.prisma.historialEstado.create({
      data: {
        ordenId: this.ordenId,
        estadoAnterior: ordenActual.estado,
        estadoNuevo: EstadoOrden.REPROGRAMADA,
        motivo: `Reprogramada para ${this.nuevaFechaInicio.toISOString()}: ${this.motivo}`,
        cambiadoPor: this.usuarioId || 'SISTEMA',
      },
    });

    return {
      orden: ordenActualizada,
      mensaje: 'Orden reprogramada exitosamente',
    };
  }

  getDescription(): string {
    return `Reprogramar orden ${this.ordenId} para ${this.nuevaFechaInicio.toISOString()}`;
  }
}

/**
 * COMMAND 3: Confirmar Ejecución
 */
@Injectable()
export class ConfirmarEjecucionCommand implements ICommand {
  constructor(private readonly prisma: PrismaService) {}

  private ordenId: string;
  private usuarioId?: string;
  private comentarios?: string;

  setParams(ordenId: string, usuarioId?: string, comentarios?: string) {
    this.ordenId = ordenId;
    this.usuarioId = usuarioId;
    this.comentarios = comentarios;
    return this;
  }

  async validate(): Promise<boolean> {
    const orden = await this.prisma.ordenServicio.findUnique({
      where: { id: this.ordenId },
    });

    if (!orden) {
      throw new NotFoundException('Orden no encontrada');
    }

    if (orden.estado !== EstadoOrden.EN_PROGRESO) {
      throw new Error('Solo se pueden confirmar órdenes en progreso');
    }

    return true;
  }

  async execute(): Promise<any> {
    await this.validate();

    const ordenActual = await this.prisma.ordenServicio.findUnique({
      where: { id: this.ordenId },
    });

    // Actualizar orden
    const ordenActualizada = await this.prisma.ordenServicio.update({
      where: { id: this.ordenId },
      data: {
        estado: EstadoOrden.COMPLETADA,
        fechaFinalizacion: new Date(),
      },
    });

    // Registrar en historial
    await this.prisma.historialEstado.create({
      data: {
        ordenId: this.ordenId,
        estadoAnterior: ordenActual.estado,
        estadoNuevo: EstadoOrden.COMPLETADA,
        motivo: this.comentarios || 'Servicio completado exitosamente',
        cambiadoPor: this.usuarioId || 'SISTEMA',
      },
    });

    return {
      orden: ordenActualizada,
      mensaje: 'Ejecución confirmada y orden completada',
    };
  }

  getDescription(): string {
    return `Confirmar ejecución de orden ${this.ordenId}`;
  }
}
