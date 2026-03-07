import { TipoServicio } from '@prisma/client';


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
