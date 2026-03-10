import { TipoServicio } from "../enums/tipo-servicio.enum";
import { IOrdenServicio } from "../interfaces/orden-servicio.interface";

// Clase base abstracta (Producto BASE)
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
//Esto es el Product base del patrón Factory Method.