import { Injectable, NotFoundException } from '@nestjs/common';
import { EstadoOrden, EstadoSolicitudReprogramacion } from '@prisma/client';
import { PrismaService } from '../../infrastructure/persistence/prisma/prisma.service';
import { ICommand } from '../interfaces/command.interface';

export interface SolicitarReprogramacionParams {
  ordenId: string;
  nuevaFechaInicio: Date;
  motivo?: string;
  usuarioId: string;
}

/**
 * COMMAND: Solicitar reprogramacion con aprobacion mutua.
 */
@Injectable()
export class SolicitarReprogramacionCommand
  implements ICommand<SolicitarReprogramacionParams>
{
  constructor(private readonly prisma: PrismaService) {}

  async validate(params: SolicitarReprogramacionParams): Promise<boolean> {
    const orden = await this.prisma.ordenServicio.findUnique({
      where: { id: params.ordenId },
    });

    if (!orden) {
      throw new NotFoundException('Orden no encontrada');
    }

    if (orden.estado === EstadoOrden.CANCELADA || orden.estado === EstadoOrden.COMPLETADA) {
      throw new Error('No se puede reprogramar una orden cancelada o completada');
    }

    if (!params.usuarioId) {
      throw new Error('usuarioId es requerido');
    }

    const esCliente = orden.clienteId === params.usuarioId;
    const esProveedor = orden.proveedorId === params.usuarioId;

    if (!esCliente && !esProveedor) {
      throw new Error('Solo cliente o proveedor pueden solicitar reprogramacion');
    }

    if (!orden.proveedorId) {
      throw new Error('La orden aun no tiene proveedor asignado');
    }

    if (orden.estadoSolicitudReprogramacion === EstadoSolicitudReprogramacion.PENDIENTE) {
      throw new Error('Ya existe una solicitud de reprogramacion pendiente');
    }

    if (params.nuevaFechaInicio <= new Date()) {
      throw new Error('La nueva fecha debe ser futura');
    }

    return true;
  }

  async execute(params: SolicitarReprogramacionParams): Promise<any> {
    await this.validate(params);

    const orden = await this.prisma.ordenServicio.findUnique({
      where: { id: params.ordenId },
    });

    const proponeCliente = orden.clienteId === params.usuarioId;
    const usuarioDestino = proponeCliente ? orden.proveedorId : orden.clienteId;

    const ordenActualizada = await this.prisma.ordenServicio.update({
      where: { id: params.ordenId },
      data: {
        fechaInicioPropuesta: params.nuevaFechaInicio,
        motivoReprogramacion: params.motivo ?? 'Solicitud de reprogramacion',
        propuestaReprogramacionPorId: params.usuarioId,
        propuestaReprogramacionParaId: usuarioDestino,
        estadoSolicitudReprogramacion: EstadoSolicitudReprogramacion.PENDIENTE,
      },
    });

    await this.prisma.historialEstado.create({
      data: {
        ordenId: params.ordenId,
        estadoAnterior: orden.estado,
        estadoNuevo: orden.estado,
        motivo: `Solicitud de reprogramacion para ${params.nuevaFechaInicio.toISOString()}: ${params.motivo ?? 'Sin motivo'}`,
        cambiadoPor: params.usuarioId,
      },
    });

    return {
      mensaje: 'Solicitud de reprogramacion enviada. Pendiente de aprobacion de la contraparte.',
      orden: ordenActualizada,
    };
  }

  getDescription(params: SolicitarReprogramacionParams): string {
    return `Solicitar reprogramacion de orden ${params.ordenId} para ${params.nuevaFechaInicio.toISOString()}`;
  }
}
