import { Injectable, NotFoundException } from '@nestjs/common';
import { EstadoOrden } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ICommand } from '../interfaces/command.interface';

export interface CancelarOrdenParams {
  ordenId: string;
  motivo?: string;
  usuarioId?: string;
}

/**
 * COMMAND 1: Cancelar Orden
 */
@Injectable()
export class CancelarOrdenCommand implements ICommand<CancelarOrdenParams> {
  constructor(private readonly prisma: PrismaService) {}

  async validate(params: CancelarOrdenParams): Promise<boolean> {
    const orden = await this.prisma.ordenServicio.findUnique({
      where: { id: params.ordenId },
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

  async execute(params: CancelarOrdenParams): Promise<any> {
    await this.validate(params);
    const motivo = params.motivo ?? 'Cancelada por solicitud del cliente';

    const ordenActual = await this.prisma.ordenServicio.findUnique({
      where: { id: params.ordenId },
    });

    // Actualizar orden
    const ordenActualizada = await this.prisma.ordenServicio.update({
      where: { id: params.ordenId },
      data: {
        estado: EstadoOrden.CANCELADA,
        motivoCancelacion: motivo,
      },
    });

    // Registrar en historial
    await this.prisma.historialEstado.create({
      data: {
        ordenId: params.ordenId,
        estadoAnterior: ordenActual.estado,
        estadoNuevo: EstadoOrden.CANCELADA,
        motivo,
        cambiadoPor: params.usuarioId || 'SISTEMA',
      },
    });

    return {
      orden: ordenActualizada,
      mensaje: 'Orden cancelada exitosamente',
    };
  }

  getDescription(params: CancelarOrdenParams): string {
    return `Cancelar orden ${params.ordenId} por: ${params.motivo ?? 'sin motivo'}`;
  }
}
