import { TipoServicio } from "../enums/tipo-servicio.enum";
import { OrdenServicioBase } from "./orden-servicio.base";

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
