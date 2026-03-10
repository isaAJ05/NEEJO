import { Injectable, NotFoundException } from '@nestjs/common';
import { EstadoOrden } from '../enums/estado-orden.enum';
import { PrismaService } from '../../infrastructure/persistence/prisma/prisma.service';
import { ICommand } from '../interfaces/command.interface';

export interface ReprogramarOrdenParams {
  ordenId: string;
  nuevaFechaInicio: Date;
  motivo?: string;
  usuarioId?: string;
}

/**
 * COMMAND 2: Reprogramar Orden
 */
@Injectable()
export class ReprogramarOrdenCommand implements ICommand<ReprogramarOrdenParams> {
  constructor(private readonly prisma: PrismaService) {}

  async validate(params: ReprogramarOrdenParams): Promise<boolean> {
    const orden = await this.prisma.ordenServicio.findUnique({
      where: { id: params.ordenId },
    });

    if (!orden) {
      throw new NotFoundException('Orden no encontrada');
    }

    if (orden.estado === EstadoOrden.COMPLETADA || orden.estado === EstadoOrden.CANCELADA) {
      throw new Error('No se puede reprogramar una orden completada o cancelada');
    }

    if (params.nuevaFechaInicio <= new Date()) {
      throw new Error('La nueva fecha debe ser futura');
    }

    return true;
  }

  async execute(params: ReprogramarOrdenParams): Promise<any> {
    await this.validate(params);
    const motivo = params.motivo ?? 'Reprogramacion solicitada';

    const ordenActual = await this.prisma.ordenServicio.findUnique({
      where: { id: params.ordenId },
    });

    // Actualizar orden
    const ordenActualizada = await this.prisma.ordenServicio.update({
      where: { id: params.ordenId },
      data: {
        fechaInicio: params.nuevaFechaInicio,
        estado: EstadoOrden.REPROGRAMADA,
      },
    });

    // Registrar en historial
    await this.prisma.historialEstado.create({
      data: {
        ordenId: params.ordenId,
        estadoAnterior: ordenActual.estado,
        estadoNuevo: EstadoOrden.REPROGRAMADA,
        motivo: `Reprogramada para ${params.nuevaFechaInicio.toISOString()}: ${motivo}`,
        cambiadoPor: params.usuarioId || 'SISTEMA',
      },
    });

    return {
      orden: ordenActualizada,
      mensaje: 'Orden reprogramada exitosamente',
    };
  }

  getDescription(params: ReprogramarOrdenParams): string {
    return `Reprogramar orden ${params.ordenId} para ${params.nuevaFechaInicio.toISOString()}`;
  }
}
