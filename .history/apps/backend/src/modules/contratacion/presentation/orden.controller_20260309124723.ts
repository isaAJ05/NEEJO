import { Controller, Post, Get, Patch, Param, Body, Query } from '@nestjs/common';
import { PrismaService } from '../infrastructure/persistence/prisma/prisma.service';
import { CancelarOrdenCommand } from '../domain/commands/cancelar-orden.command';
import { ReprogramarOrdenCommand } from '../domain/commands/reprogramar-orden.command';
import { ConfirmarEjecucionCommand } from '../domain/commands/confirmar-ejecucion.command';

/**
 * CONTROLADOR PRINCIPAL: Órdenes de Servicio
 * 
 * Endpoints mínimos requeridos:
 * 1-2. CRUD básico de órdenes (GET, CREATE implícito en Facade)
 * 3. Consultar orden específica
 * 4. Cancelar orden (usando Command)
 * 5. Filtrar por estado
 * 6. Filtrar por rango de fechas
 */

@Controller('ordenes')
export class OrdenController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cancelarCommand: CancelarOrdenCommand,
    private readonly reprogramarCommand: ReprogramarOrdenCommand,
    private readonly confirmarCommand: ConfirmarEjecucionCommand,
  ) {}

  /**
   * ENDPOINT 1: Listar órdenes (con filtros opcionales)
   * GET /api/v1/ordenes
   * GET /api/v1/ordenes?estado=EN_PROGRESO
   * GET /api/v1/ordenes?desde=2026-01-01&hasta=2026-03-31
   */
  @Get()
  async listarOrdenes(
    @Query('estado') estado?: string,
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
    @Query('clienteId') clienteId?: string,
  ) {
    const where: any = {};

    if (estado) {
      where.estado = estado;
    }

    if (clienteId) {
      where.clienteId = clienteId;
    }

    if (desde || hasta) {
      where.createdAt = {};
      if (desde) where.createdAt.gte = new Date(desde);
      if (hasta) where.createdAt.lte = new Date(hasta);
    }

    const ordenes = await this.prisma.ordenServicio.findMany({
      where,
      include: {
        cliente: { select: { id: true, nombre: true, email: true } },
        proveedor: { select: { id: true, nombre: true, email: true } },
        solicitud: true,
        cotizacion: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      total: ordenes.length,
      ordenes,
    };
  }

  /**
   * ENDPOINT 2: Consultar orden específica
   * GET /api/v1/ordenes/:id
   */
  @Get(':id')
  async obtenerOrden(@Param('id') id: string) {
    const orden = await this.prisma.ordenServicio.findUnique({
      where: { id },
      include: {
        cliente: true,
        proveedor: true,
        solicitud: true,
        cotizacion: true,
        historialEstados: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!orden) {
      return { error: 'Orden no encontrada' };
    }

    return orden;
  }

  /**
   * ENDPOINT 3: Cancelar orden (usando patrón Command)
   * PATCH /api/v1/ordenes/:id/cancelar
   */
  @Patch(':id/cancelar')
  async cancelarOrden(
    @Param('id') id: string,
    @Body() body: { motivo: string; usuarioId?: string },
  ) {
    return await this.cancelarCommand.execute({
      ordenId: id,
      motivo: body.motivo,
      usuarioId: body.usuarioId,
    });
  }

  /**
   * ENDPOINT 4: Reprogramar orden (usando patrón Command)
   * PATCH /api/v1/ordenes/:id/reprogramar
   */
  @Patch(':id/reprogramar')
  async reprogramarOrden(
    @Param('id') id: string,
    @Body() body: { nuevaFechaInicio: string; motivo: string; usuarioId?: string },
  ) {
    return await this.reprogramarCommand.execute({
      ordenId: id,
      nuevaFechaInicio: new Date(body.nuevaFechaInicio),
      motivo: body.motivo,
      usuarioId: body.usuarioId,
    });
  }

  /**
   * ENDPOINT 5: Confirmar ejecución (usando patrón Command)
   * PATCH /api/v1/ordenes/:id/confirmar
   */
  @Patch(':id/confirmar')
  async confirmarEjecucion(
    @Param('id') id: string,
    @Body() body: { usuarioId?: string; comentarios?: string },
  ) {
    return await this.confirmarCommand.execute({
      ordenId: id,
      usuarioId: body.usuarioId,
      comentarios: body.comentarios,
    });
  }
}
