import { TipoServicio } from "../enums/tipo-servicio.enum";
import { OrdenServicioBase } from "./orden-servicio.base";

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