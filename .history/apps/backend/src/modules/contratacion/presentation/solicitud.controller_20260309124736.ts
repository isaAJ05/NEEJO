import { Controller, Post, Get, Body, Param, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../infrastructure/persistence/prisma/prisma.service';
import { EstadoSolicitud } from '@prisma/client';

/**
 * CONTROLADOR: Solicitudes de Servicio
 */

@Controller('solicitudes')
export class SolicitudController {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * ENDPOINT: Crear solicitud de servicio
   * POST /api/v1/solicitudes
   */
  @Post()
  async crearSolicitud(@Body() body: any) {
    // Validar que el clienteId existe
    if (!body.clienteId) {
      throw new BadRequestException('clienteId es requerido');
    }

    const clienteExiste = await this.prisma.usuario.findUnique({
      where: { id: body.clienteId },
    });

    if (!clienteExiste) {
      throw new BadRequestException(
        `Cliente con ID "${body.clienteId}" no existe. Usa GET /api/v1/usuarios para ver clientes disponibles.`,
      );
    }

    const solicitud = await this.prisma.solicitudServicio.create({
      data: {
        titulo: body.titulo,
        descripcion: body.descripcion,
        clienteId: body.clienteId,
        tipoServicio: body.tipoServicio,
        presupuestoEstimado: body.presupuestoEstimado,
        estado: EstadoSolicitud.PENDIENTE,
      },
      include: {
        cliente: { select: { id: true, nombre: true, email: true } },
      },
    });

    return {
      mensaje: 'Solicitud creada exitosamente',
      solicitud,
    };
  }

  /**
   * ENDPOINT: Listar solicitudes
   * GET /api/v1/solicitudes
   */
  @Get()
  async listarSolicitudes() {
    const solicitudes = await this.prisma.solicitudServicio.findMany({
      include: {
        cliente: { select: { id: true, nombre: true, email: true } },
        cotizaciones: true,
        _count: { select: { ordenes: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      total: solicitudes.length,
      solicitudes,
    };
  }

  /**
   * ENDPOINT: Obtener solicitud específica
   * GET /api/v1/solicitudes/:id
   */
  @Get(':id')
  async obtenerSolicitud(@Param('id') id: string) {
    return await this.prisma.solicitudServicio.findUnique({
      where: { id },
      include: {
        cliente: true,
        cotizaciones: true,
        ordenes: true,
      },
    });
  }
}
