import { Controller, Post, Get, Body, Param, BadRequestException, Query } from '@nestjs/common';
import { PrismaService } from '../infrastructure/persistence/prisma/prisma.service';
import { EstadoOrden, EstadoSolicitud } from '@prisma/client';

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
  async listarSolicitudes(@Query('usuarioId') usuarioId?: string) {
    const where: any = {};

    if (usuarioId) {
      where.OR = [
        // Solicitudes publicas aun no tomadas
        {
          estado: EstadoSolicitud.PENDIENTE,
          clienteId: { not: usuarioId },
          ordenes: { none: {} },
        },
        // Solicitudes creadas por el usuario
        { clienteId: usuarioId },
        // Solicitudes ya tomadas donde participa el usuario
        {
          ordenes: {
            some: {
              OR: [{ clienteId: usuarioId }, { proveedorId: usuarioId }],
            },
          },
        },
      ];
    }

    const solicitudes = await this.prisma.solicitudServicio.findMany({
      where,
      include: {
        cliente: { select: { id: true, nombre: true, email: true } },
        cotizaciones: true,
        ordenes: {
          select: {
            id: true,
            clienteId: true,
            proveedorId: true,
            estado: true,
          },
        },
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
   * ENDPOINT: Listar solicitudes publicas disponibles para tomar
   * GET /api/v1/solicitudes/disponibles?usuarioId=...
   */
  @Get('disponibles')
  async listarDisponibles(@Query('usuarioId') usuarioId?: string) {
    const solicitudes = await this.prisma.solicitudServicio.findMany({
      where: {
        estado: EstadoSolicitud.PENDIENTE,
        ...(usuarioId ? { clienteId: { not: usuarioId } } : {}),
        ordenes: { none: {} },
      },
      include: {
        cliente: { select: { id: true, nombre: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      total: solicitudes.length,
      solicitudes,
    };
  }

  /**
   * ENDPOINT: Listar solicitudes creadas por un usuario
   * GET /api/v1/solicitudes/mias/:usuarioId
   */
  @Get('mias/:usuarioId')
  async listarMias(@Param('usuarioId') usuarioId: string) {
    const solicitudes = await this.prisma.solicitudServicio.findMany({
      where: { clienteId: usuarioId },
      include: {
        cliente: { select: { id: true, nombre: true, email: true } },
        ordenes: {
          select: {
            id: true,
            codigoOrden: true,
            estado: true,
            proveedorId: true,
          },
        },
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
   * ENDPOINT: Aceptar una solicitud y crear orden
   * POST /api/v1/solicitudes/:id/aceptar
   */
  @Post(':id/aceptar')
  async aceptarSolicitud(
    @Param('id') id: string,
    @Body()
    body: {
      proveedorId: string;
      montoTotal?: number;
      duracionEstimadaHoras?: number;
      descripcionDetalle?: string;
      fechaInicio?: string;
    },
  ) {
    if (!body.proveedorId) {
      throw new BadRequestException('proveedorId es requerido');
    }

    const [solicitud, proveedor] = await Promise.all([
      this.prisma.solicitudServicio.findUnique({
        where: { id },
        include: { ordenes: true },
      }),
      this.prisma.usuario.findUnique({ where: { id: body.proveedorId } }),
    ]);

    if (!solicitud) {
      throw new BadRequestException('Solicitud no encontrada');
    }

    if (!proveedor) {
      throw new BadRequestException('Proveedor no encontrado');
    }

    if (solicitud.clienteId === body.proveedorId) {
      throw new BadRequestException('No puedes tomar tu propia solicitud');
    }

    if (solicitud.ordenes.length > 0 || solicitud.estado !== EstadoSolicitud.PENDIENTE) {
      throw new BadRequestException('La solicitud ya fue tomada por otro usuario');
    }

    const montoTotal =
      body.montoTotal ?? solicitud.presupuestoEstimado ?? 100;

    const resultado = await this.prisma.$transaction(async (tx) => {
      const cotizacion = await tx.cotizacion.create({
        data: {
          solicitudId: solicitud.id,
          montoTotal,
          duracionEstimadaHoras: body.duracionEstimadaHoras,
          descripcionDetalle:
            body.descripcionDetalle ??
            `Cotizacion generada al aceptar solicitud ${solicitud.titulo}`,
        },
      });

      const orden = await tx.ordenServicio.create({
        data: {
          codigoOrden: `ORD-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 1000)}`,
          solicitudId: solicitud.id,
          cotizacionId: cotizacion.id,
          clienteId: solicitud.clienteId,
          proveedorId: body.proveedorId,
          tipoServicio: solicitud.tipoServicio,
          montoTotal,
          estado: EstadoOrden.ASIGNADA,
          fechaInicio: body.fechaInicio ? new Date(body.fechaInicio) : null,
        },
      });

      await tx.solicitudServicio.update({
        where: { id: solicitud.id },
        data: { estado: EstadoSolicitud.ACEPTADA },
      });

      await tx.historialEstado.create({
        data: {
          ordenId: orden.id,
          estadoAnterior: EstadoOrden.CREADA,
          estadoNuevo: EstadoOrden.ASIGNADA,
          motivo: `Solicitud aceptada por ${proveedor.nombre}`,
          cambiadoPor: body.proveedorId,
        },
      });

      return { cotizacion, orden };
    });

    return {
      mensaje: 'Solicitud tomada exitosamente',
      solicitudId: solicitud.id,
      cotizacion: resultado.cotizacion,
      orden: resultado.orden,
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
