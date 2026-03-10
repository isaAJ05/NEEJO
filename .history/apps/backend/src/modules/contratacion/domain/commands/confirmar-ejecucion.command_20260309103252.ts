import { Injectable, NotFoundException } from '@nestjs/common';
import { EstadoOrden } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ICommand } from '../interfaces/command.interface';

export interface ConfirmarEjecucionParams {
  ordenId: string;
  usuarioId?: string;
  comentarios?: string;
}


/**
 * COMMAND 3: Confirmar Ejecución
 */
@Injectable()
export class ConfirmarEjecucionCommand implements ICommand<ConfirmarEjecucionParams> {
  constructor(private readonly prisma: PrismaService) {}

  async validate(params: ConfirmarEjecucionParams): Promise<boolean> {
    const orden = await this.prisma.ordenServicio.findUnique({
      where: { id: params.ordenId },
    });

    if (!orden) {
      throw new NotFoundException('Orden no encontrada');
    }

    if (orden.estado !== EstadoOrden.EN_PROGRESO) {
      throw new Error('Solo se pueden confirmar órdenes en progreso');
    }

    return true;
  }

  async execute(params: ConfirmarEjecucionParams): Promise<any> {
    await this.validate(params);

    const ordenActual = await this.prisma.ordenServicio.findUnique({
      where: { id: params.ordenId },
    });

    // Actualizar orden
    const ordenActualizada = await this.prisma.ordenServicio.update({
      where: { id: params.ordenId },
      data: {
        estado: EstadoOrden.COMPLETADA,
        fechaFinalizacion: new Date(),
      },
    });

    // Registrar en historial
    await this.prisma.historialEstado.create({
      data: {
        ordenId: params.ordenId,
        estadoAnterior: ordenActual.estado,
        estadoNuevo: EstadoOrden.COMPLETADA,
        motivo: params.comentarios || 'Servicio completado exitosamente',
        cambiadoPor: params.usuarioId || 'SISTEMA',
      },
    });

    return {
      orden: ordenActualizada,
      mensaje: 'Ejecución confirmada y orden completada',
    };
  }

  getDescription(params: ConfirmarEjecucionParams): string {
    return `Confirmar ejecución de orden ${params.ordenId}`;
  }
}