import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../persistence/prisma/prisma.service';
import { OrdenServicioFactory } from '../../domain/factories/orden-servicio.factory';
import { TipoServicio, EstadoSolicitud, EstadoOrden } from '@prisma/client';

/**
 * PATRÓN: Facade (Estructural)
 * 
 * Propósito: Proporcionar una interfaz simplificada para un subsistema complejo
 * de contratación que involucra validación, cotización y creación de orden.
 * 
 * Ventajas:
 * - Simplifica la interacción con múltiples componentes
 * - Oculta la complejidad del proceso de contratación
 * - Reduce dependencias entre el cliente y los subsistemas
 */

export interface DatosContratacionDTO {
  solicitudId: string;
  clienteId: string;
  tipoServicio: TipoServicio;
  parametrosServicio: any; // Parámetros específicos según tipo
}

@Injectable()
export class ContratarServicioFacade {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ordenFactory: OrdenServicioFactory,
  ) {}

  /**
   * Método principal del Facade: orquesta todo el proceso de contratación
   * 
   * Flujo interno:
   * 1. Validar disponibilidad y datos
   * 2. Generar cotización
   * 3. Crear orden de servicio
   * 4. Actualizar estado de la solicitud
   * 5. Registrar en historial
   */
  async contratarServicio(datos: DatosContratacionDTO) {
    // PASO 1: Validar
    await this.validarDisponibilidad(datos.solicitudId, datos.clienteId);

    // PASO 2: Generar cotización
    const cotizacion = await this.generarCotizacion(datos);

    // PASO 3: Crear orden usando Factory
    const orden = await this.crearOrden(datos, cotizacion.id);

    // PASO 4: Actualizar solicitud
    await this.actualizarEstadoSolicitud(datos.solicitudId, EstadoSolicitud.ACEPTADA);

    // PASO 5: Registrar historial
    await this.registrarEnHistorial(orden.id, null, EstadoOrden.CREADA, 'Orden creada mediante contratación');

    return {
      orden,
      cotizacion,
      mensaje: 'Servicio contratado exitosamente',
    };
  }

  // ========================================
  // Métodos privados del subsistema
  // ========================================

  private async validarDisponibilidad(solicitudId: string, clienteId: string): Promise<void> {
    const solicitud = await this.prisma.solicitudServicio.findUnique({
      where: { id: solicitudId },
    });

    if (!solicitud) {
      throw new BadRequestException('La solicitud no existe');
    }

    if (solicitud.clienteId !== clienteId) {
      throw new BadRequestException('No tienes permisos para esta solicitud');
    }

    if (solicitud.estado === EstadoSolicitud.ACEPTADA) {
      throw new BadRequestException('La solicitud ya fue aceptada');
    }

    if (solicitud.estado === EstadoSolicitud.CANCELADA) {
      throw new BadRequestException('La solicitud está cancelada');
    }
  }

  private async generarCotizacion(datos: DatosContratacionDTO) {
    // Usar Factory para calcular monto correcto
    const ordenTemporal = this.ordenFactory.createOrden(
      datos.tipoServicio,
      datos.parametrosServicio,
    );

    if (!ordenTemporal.validarDatosEspecificos()) {
      throw new BadRequestException('Datos de servicio inválidos');
    }

    const montoFinal = ordenTemporal.calcularCostoFinal();

    return await this.prisma.cotizacion.create({
      data: {
        solicitudId: datos.solicitudId,
        montoTotal: montoFinal,
        duracionEstimadaHoras: ordenTemporal.duracionEstimadaHoras,
        descripcionDetalle: `Cotización para servicio ${datos.tipoServicio}`,
      },
    });
  }

  private async crearOrden(datos: DatosContratacionDTO, cotizacionId: string) {
    const codigoOrden = this.generarCodigoOrden();
    
    const ordenData = this.ordenFactory.createOrden(
      datos.tipoServicio,
      datos.parametrosServicio,
    );

    return await this.prisma.ordenServicio.create({
      data: {
        codigoOrden,
        solicitudId: datos.solicitudId,
        cotizacionId,
        clienteId: datos.clienteId,
        tipoServicio: datos.tipoServicio,
        montoTotal: ordenData.calcularCostoFinal(),
        estado: EstadoOrden.CREADA,
      },
      include: {
        solicitud: true,
        cotizacion: true,
        cliente: true,
      },
    });
  }

  private async actualizarEstadoSolicitud(solicitudId: string, nuevoEstado: EstadoSolicitud) {
    return await this.prisma.solicitudServicio.update({
      where: { id: solicitudId },
      data: { estado: nuevoEstado },
    });
  }

  private async registrarEnHistorial(
    ordenId: string,
    estadoAnterior: EstadoOrden | null,
    estadoNuevo: EstadoOrden,
    motivo: string,
  ) {
    return await this.prisma.historialEstado.create({
      data: {
        ordenId,
        estadoAnterior,
        estadoNuevo,
        motivo,
        cambiadoPor: 'SISTEMA',
      },
    });
  }

  private generarCodigoOrden(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  }
}
