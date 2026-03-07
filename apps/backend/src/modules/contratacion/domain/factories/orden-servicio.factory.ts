import { Injectable } from '@nestjs/common';
import { TipoServicio } from '@prisma/client';

/**
 * PATRÓN: Factory Method (Creacional)
 * 
 * Propósito: Crear instancias de OrdenServicio según el tipo de contratación
 * sin exponer la lógica de creación al cliente.
 * 
 * Ventajas:
 * - Desacopla la creación de objetos de su uso
 * - Facilita agregar nuevos tipos de orden sin modificar código existente
 * - Centraliza la lógica de inicialización
 */

export interface IOrdenServicio {
  id?: string;
  tipoServicio: TipoServicio;
  montoTotal: number;
  duracionEstimadaHoras?: number;
  calcularCostoFinal(): number;
  validarDatosEspecificos(): boolean;
}

// Clase base abstracta
export abstract class OrdenServicioBase implements IOrdenServicio {
  id?: string;
  tipoServicio: TipoServicio;
  montoTotal: number;
  duracionEstimadaHoras?: number;

  constructor(tipoServicio: TipoServicio, montoTotal: number) {
    this.tipoServicio = tipoServicio;
    this.montoTotal = montoTotal;
  }

  abstract calcularCostoFinal(): number;
  abstract validarDatosEspecificos(): boolean;
}

// Implementación concreta: Orden por Horas
export class OrdenPorHoras extends OrdenServicioBase {
  tarifaPorHora: number;
  horasEstimadas: number;

  constructor(tarifaPorHora: number, horasEstimadas: number) {
    super(TipoServicio.POR_HORAS, tarifaPorHora * horasEstimadas);
    this.tarifaPorHora = tarifaPorHora;
    this.horasEstimadas = horasEstimadas;
    this.duracionEstimadaHoras = horasEstimadas;
  }

  calcularCostoFinal(): number {
    // Incluye un 10% de margen para imprevistos
    return this.montoTotal * 1.10;
  }

  validarDatosEspecificos(): boolean {
    return this.tarifaPorHora > 0 && this.horasEstimadas > 0;
  }
}

// Implementación concreta: Orden por Tarea
export class OrdenPorTarea extends OrdenServicioBase {
  complejidad: 'BAJA' | 'MEDIA' | 'ALTA';

  constructor(montoBase: number, complejidad: 'BAJA' | 'MEDIA' | 'ALTA') {
    super(TipoServicio.POR_TAREA, montoBase);
    this.complejidad = complejidad;
    this.duracionEstimadaHoras = complejidad === 'BAJA' ? 8 : complejidad === 'MEDIA' ? 16 : 40;
  }

  calcularCostoFinal(): number {
    const multiplicadores = { BAJA: 1.0, MEDIA: 1.15, ALTA: 1.30 };
    return this.montoTotal * multiplicadores[this.complejidad];
  }

  validarDatosEspecificos(): boolean {
    return this.montoTotal > 0 && ['BAJA', 'MEDIA', 'ALTA'].includes(this.complejidad);
  }
}

// Implementación concreta: Orden por Paquete
export class OrdenPorPaquete extends OrdenServicioBase {
  cantidadEntregables: number;

  constructor(montoPorEntregable: number, cantidadEntregables: number) {
    super(TipoServicio.POR_PAQUETE, montoPorEntregable * cantidadEntregables);
    this.cantidadEntregables = cantidadEntregables;
    this.duracionEstimadaHoras = cantidadEntregables * 8; // 8 horas por entregable
  }

  calcularCostoFinal(): number {
    // Descuento por volumen
    const descuento = this.cantidadEntregables >= 5 ? 0.90 : 1.0;
    return this.montoTotal * descuento;
  }

  validarDatosEspecificos(): boolean {
    return this.cantidadEntregables > 0 && this.montoTotal > 0;
  }
}

/**
 * Factory: Responsable de crear instancias según el tipo
 */
@Injectable()
export class OrdenServicioFactory {
  createOrden(
    tipo: TipoServicio,
    params: any,
  ): IOrdenServicio {
    switch (tipo) {
      case TipoServicio.POR_HORAS:
        return new OrdenPorHoras(params.tarifaPorHora, params.horasEstimadas);
      
      case TipoServicio.POR_TAREA:
        return new OrdenPorTarea(params.montoBase, params.complejidad);
      
      case TipoServicio.POR_PAQUETE:
        return new OrdenPorPaquete(params.montoPorEntregable, params.cantidadEntregables);
      
      default:
        throw new Error(`Tipo de servicio no soportado: ${tipo}`);
    }
  }
}
