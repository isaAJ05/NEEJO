import { TipoServicio } from "../enums/tipo-servicio.enum";
import { OrdenServicioBase } from "./orden-servicio.base";

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