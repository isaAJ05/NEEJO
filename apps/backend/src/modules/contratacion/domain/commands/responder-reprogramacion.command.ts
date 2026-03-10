import { Injectable, NotFoundException } from '@nestjs/common';
import { EstadoSolicitudReprogramacion } from '@prisma/client';
import { PrismaService } from '../../infrastructure/persistence/prisma/prisma.service';
import { ICommand } from '../interfaces/command.interface';
import { ReprogramarOrdenCommand } from './reprogramar-orden.command';

export interface ResponderReprogramacionParams {
  ordenId: string;
  usuarioId: string;
  aceptar: boolean;
  motivoRechazo?: string;
}

/**
 * COMMAND: Responder solicitud de reprogramacion (aceptar/rechazar).
 */
@Injectable()
export class ResponderReprogramacionCommand
  implements ICommand<ResponderReprogramacionParams>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly reprogramarOrdenCommand: ReprogramarOrdenCommand,
  ) {}

  async validate(params: ResponderReprogramacionParams): Promise<boolean> {
    const orden = await this.prisma.ordenServicio.findUnique({
      where: { id: params.ordenId },
    });

    if (!orden) {
      throw new NotFoundException('Orden no encontrada');
    }

    if (orden.estadoSolicitudReprogramacion !== EstadoSolicitudReprogramacion.PENDIENTE) {
      throw new Error('No hay una solicitud de reprogramacion pendiente');
    }

    if (!params.usuarioId) {
      throw new Error('usuarioId es requerido');
    }

    if (orden.propuestaReprogramacionParaId !== params.usuarioId) {
      throw new Error('Solo la contraparte puede responder la solicitud de reprogramacion');
    }

    if (!params.aceptar && !params.motivoRechazo) {
      throw new Error('Debes indicar un motivo de rechazo');
    }

    return true;
  }

  async execute(params: ResponderReprogramacionParams): Promise<any> {
    await this.validate(params);

    const orden = await this.prisma.ordenServicio.findUnique({
      where: { id: params.ordenId },
    });

    if (params.aceptar) {
      const resultadoReprogramacion = await this.reprogramarOrdenCommand.execute({
        ordenId: params.ordenId,
        nuevaFechaInicio: orden.fechaInicioPropuesta,
        motivo: `Aprobada por contraparte. Motivo original: ${orden.motivoReprogramacion ?? 'Sin motivo'}`,
        usuarioId: params.usuarioId,
      });

      await this.prisma.ordenServicio.update({
        where: { id: params.ordenId },
        data: {
          fechaInicioPropuesta: null,
          motivoReprogramacion: null,
          propuestaReprogramacionPorId: null,
          propuestaReprogramacionParaId: null,
          estadoSolicitudReprogramacion: EstadoSolicitudReprogramacion.ACEPTADA,
        },
      });

      return {
        mensaje: 'Solicitud de reprogramacion aceptada',
        ...resultadoReprogramacion,
      };
    }

    const ordenActualizada = await this.prisma.ordenServicio.update({
      where: { id: params.ordenId },
      data: {
        fechaInicioPropuesta: null,
        motivoReprogramacion: null,
        propuestaReprogramacionPorId: null,
        propuestaReprogramacionParaId: null,
        estadoSolicitudReprogramacion: EstadoSolicitudReprogramacion.RECHAZADA,
      },
    });

    await this.prisma.historialEstado.create({
      data: {
        ordenId: params.ordenId,
        estadoAnterior: orden.estado,
        estadoNuevo: orden.estado,
        motivo: `Solicitud de reprogramacion rechazada: ${params.motivoRechazo}`,
        cambiadoPor: params.usuarioId,
      },
    });

    return {
      mensaje: 'Solicitud de reprogramacion rechazada',
      orden: ordenActualizada,
    };
  }

  getDescription(params: ResponderReprogramacionParams): string {
    return `${params.aceptar ? 'Aceptar' : 'Rechazar'} reprogramacion de orden ${params.ordenId}`;
  }
}
