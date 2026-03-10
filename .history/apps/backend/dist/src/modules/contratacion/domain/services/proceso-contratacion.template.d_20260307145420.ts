import { Injectable } from '@nestjs/common';
import { TipoServicio } from '@prisma/client';

/**
 * PATRÓN: Template Method (Comportamiento)
 * 
 * Propósito: Define el esqueleto de un algoritmo en una operación,
 * delegando algunos pasos a las subclases.
 * 
 * Ventajas:
 * - Define un flujo fijo con pasos personalizables
 * - Reutiliza código común entre variaciones
 * - Garantiza que ciertos pasos se ejecuten en orden específico
 * 
 * En este caso: el proceso de contratación tiene pasos fijos,
 * pero cada tipo de servicio tiene validaciones y cálculos específicos.
 */

export interface DatosProcesoContratacion {
  clienteId: string;
  tipoServicio: TipoServicio;
  descripcion: string;
  parametrosServicio: any;
}

export interface ResultadoContratacion {
  solicitudId: string;
  cotizacionId: string;
  ordenId: string;
  montoFinal: number;
  duracionEstimada: number;
  pasosSeguidos: string[];
}

/**
 * Clase base abstracta que define el Template Method
 */
@Injectable()
export abstract class ProcesoContratacionTemplate {
  /**
   * TEMPLATE METHOD: define el flujo completo (esqueleto del algoritmo)
   * Este método NO debe ser sobrescrito por las subclases
   */
  async ejecutarProcesoCompleto(
    datos: DatosProcesoContratacion,
  ): Promise<ResultadoContratacion> {
    const pasos: string[] = [];

    // PASO 1: Validación inicial (común para todos)
    pasos.push('1. Validación inicial de datos');
    await this.validarDatosComunes(datos);

    // PASO 2: Validación específica (varía según tipo)
    pasos.push('2. Validación específica del tipo de servicio');
    await this.validarDatosEspecificos(datos);

    // PASO 3: Calcular presupuesto (varía según tipo)
    pasos.push('3. Cálculo de presupuesto');
    const presupuesto = await this.calcularPresupuesto(datos.parametrosServicio);

    // PASO 4: Crear solicitud (común)
    pasos.push('4. Creación de solicitud de servicio');
    const solicitudId = await this.crearSolicitud(datos, presupuesto);

    // PASO 5: Generar cotización (común)
    pasos.push('5. Generación de cotización');
    const cotizacionId = await this.generarCotizacion(solicitudId, presupuesto);

    // PASO 6: Aplicar descuentos/ajustes específicos (varía según tipo)
    pasos.push('6. Aplicación de ajustes específicos');
    const montoFinal = await this.aplicarAjustesEspecificos(presupuesto);

    // PASO 7: Crear orden (común)
    pasos.push('7. Creación de orden de servicio');
    const ordenId = await this.crearOrden(solicitudId, cotizacionId, datos, montoFinal);

    // PASO 8: Notificación (hook opcional, varía según tipo)
    pasos.push('8. Envío de notificaciones');
    await this.notificar(ordenId, datos.clienteId);

    return {
      solicitudId,
      cotizacionId,
      ordenId,
      montoFinal,
      duracionEstimada: await this.calcularDuracion(datos.parametrosServicio),
      pasosSeguidos: pasos,
    };
  }

  // ========================================
  // Métodos comunes (implementados aquí)
  // ========================================

  protected async validarDatosComunes(datos: DatosProcesoContratacion): Promise<void> {
    if (!datos.clienteId || !datos.tipoServicio || !datos.descripcion) {
      throw new Error('Faltan datos obligatorios');
    }
  }

  protected async crearSolicitud(
    datos: DatosProcesoContratacion,
    presupuesto: number,
  ): Promise<string> {
    // Simulación - en producción llamaría a PrismaService
    return `SOL-${Date.now()}`;
  }

  protected async generarCotizacion(solicitudId: string, monto: number): Promise<string> {
    // Simulación
    return `COT-${Date.now()}`;
  }

  protected async crearOrden(
    solicitudId: string,
    cotizacionId: string,
    datos: DatosProcesoContratacion,
    montoFinal: number,
  ): Promise<string> {
    // Simulación
    return `ORD-${Date.now()}`;
  }

  // ========================================
  // Métodos abstractos (deben ser implementados por subclases)
  // ========================================

  protected abstract validarDatosEspecificos(datos: DatosProcesoContratacion): Promise<void>;
  protected abstract calcularPresupuesto(parametros: any): Promise<number>;
  protected abstract aplicarAjustesEspecificos(presupuestoBase: number): Promise<number>;
  protected abstract calcularDuracion(parametros: any): Promise<number>;

  // ========================================
  // Hook opcional (puede ser sobrescrito)
  // ========================================

  protected async notificar(ordenId: string, clienteId: string): Promise<void> {
    // Implementación base: no hace nada
    // Las subclases pueden sobrescribirlo si necesitan notificaciones específicas
  }
}

/**
 * IMPLEMENTACIÓN CONCRETA 1: Contratación por Horas
 */
@Injectable()
export class ContratacionPorHoras extends ProcesoContratacionTemplate {
  protected async validarDatosEspecificos(datos: DatosProcesoContratacion): Promise<void> {
    const { tarifaPorHora, horasEstimadas } = datos.parametrosServicio;
    if (!tarifaPorHora || !horasEstimadas) {
      throw new Error('Faltan tarifaPorHora u horasEstimadas');
    }
    if (tarifaPorHora <= 0 || horasEstimadas <= 0) {
      throw new Error('Tarifa y horas deben ser positivas');
    }
  }

  protected async calcularPresupuesto(parametros: any): Promise<number> {
    return parametros.tarifaPorHora * parametros.horasEstimadas;
  }

  protected async aplicarAjustesEspecificos(presupuestoBase: number): Promise<number> {
    // 10% de margen por imprevistos en servicios por hora
    return presupuestoBase * 1.10;
  }

  protected async calcularDuracion(parametros: any): Promise<number> {
    return parametros.horasEstimadas;
  }

  protected async notificar(ordenId: string, clienteId: string): Promise<void> {
    console.log(`📧 Notificación: Orden ${ordenId} por horas creada para cliente ${clienteId}`);
  }
}

/**
 * IMPLEMENTACIÓN CONCRETA 2: Contratación por Tarea
 */
@Injectable()
export class ContratacionPorTarea extends ProcesoContratacionTemplate {
  protected async validarDatosEspecificos(datos: DatosProcesoContratacion): Promise<void> {
    const { montoBase, complejidad } = datos.parametrosServicio;
    if (!montoBase || !complejidad) {
      throw new Error('Faltan montoBase o complejidad');
    }
    if (!['BAJA', 'MEDIA', 'ALTA'].includes(complejidad)) {
      throw new Error('Complejidad inválida');
    }
  }

  protected async calcularPresupuesto(parametros: any): Promise<number> {
    return parametros.montoBase;
  }

  protected async aplicarAjustesEspecificos(presupuestoBase: number): Promise<number> {
    // Las tareas tienen multiplicador según complejidad (ya aplicado en Factory)
    return presupuestoBase;
  }

  protected async calcularDuracion(parametros: any): Promise<number> {
    const duraciones = { BAJA: 8, MEDIA: 16, ALTA: 40 };
    return duraciones[parametros.complejidad];
  }
}

/**
 * IMPLEMENTACIÓN CONCRETA 3: Contratación por Paquete
 */
@Injectable()
export class ContratacionPorPaquete extends ProcesoContratacionTemplate {
  protected async validarDatosEspecificos(datos: DatosProcesoContratacion): Promise<void> {
    const { montoPorEntregable, cantidadEntregables } = datos.parametrosServicio;
    if (!montoPorEntregable || !cantidadEntregables) {
      throw new Error('Faltan montoPorEntregable o cantidadEntregables');
    }
    if (cantidadEntregables < 1) {
      throw new Error('Debe haber al menos 1 entregable');
    }
  }

  protected async calcularPresupuesto(parametros: any): Promise<number> {
    return parametros.montoPorEntregable * parametros.cantidadEntregables;
  }

  protected async aplicarAjustesEspecificos(presupuestoBase: number): Promise<number> {
    // Descuento por volumen en paquetes
    return presupuestoBase * 0.90; // 10% descuento
  }

  protected async calcularDuracion(parametros: any): Promise<number> {
    return parametros.cantidadEntregables * 8; // 8 horas por entregable
  }

  protected async notificar(ordenId: string, clienteId: string): Promise<void> {
    console.log(`📦 Notificación: Paquete ${ordenId} creado para cliente ${clienteId}`);
  }
}