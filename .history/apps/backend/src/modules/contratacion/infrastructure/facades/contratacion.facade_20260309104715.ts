import { Injectable } from '@nestjs/common';
import { TipoServicio } from '../../enums/tipo-servicio.enum';
import { OrdenServicioFactory } from '../../factories/orden-servicio.factory';
import { IOrdenServicio } from '../../interfaces/orden-servicio.interface';
import {
  ContratacionPorHoras,
  ContratacionPorPaquete,
  ContratacionPorTarea,
  ProcesoContratacionTemplate,
  DatosProcesoContratacion,
  ResultadoContratacion,
} from '../../domain/services/proceso-contratacion.template';

/**
 * FACADE: Simplifica el proceso de contratación
 * Orquesta el Factory (crear órdenes) y el Template Method (ejecutar proceso)
 * para exponer una interfaz unificada y sencilla al cliente.
 */
@Injectable()
export class ContratacionFacade {
  private readonly procesosMap: Map<TipoServicio, ProcesoContratacionTemplate>;

  constructor(
    private readonly ordenFactory: OrdenServicioFactory,
    private readonly contratacionPorHoras: ContratacionPorHoras,
    private readonly contratacionPorTarea: ContratacionPorTarea,
    private readonly contratacionPorPaquete: ContratacionPorPaquete,
  ) {
    this.procesosMap = new Map<TipoServicio, ProcesoContratacionTemplate>([
      [TipoServicio.POR_HORAS, this.contratacionPorHoras],
      [TipoServicio.POR_TAREA, this.contratacionPorTarea],
      [TipoServicio.POR_PAQUETE, this.contratacionPorPaquete],
    ]);
  }

  /**
   * Método principal de la fachada: contrata un servicio completo.
   * Flujo: validar → cotizar → crear orden
   */
  async contratarServicio(datos: DatosProcesoContratacion): Promise<{
    resultado: ResultadoContratacion;
    orden: IOrdenServicio;
  }> {
    // 1. Seleccionar el proceso adecuado según el tipo de servicio
    const proceso = this.obtenerProceso(datos.tipoServicio);

    // 2. Ejecutar el proceso completo (validar → cotizar → crear orden)
    //    El Template Method se encarga de orquestar los pasos internos
    const resultado = await proceso.ejecutarProcesoCompleto(datos);

    // 3. Crear la orden de servicio usando el Factory
    const orden = this.ordenFactory.createOrden(
      datos.tipoServicio,
      datos.parametrosServicio,
    );

    return { resultado, orden };
  }

  private obtenerProceso(tipo: TipoServicio): ProcesoContratacionTemplate {
    const proceso = this.procesosMap.get(tipo);
    if (!proceso) {
      throw new Error(`No existe proceso de contratación para el tipo: ${tipo}`);
    }
    return proceso;
  }
}
