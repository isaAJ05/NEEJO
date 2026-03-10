import { TipoServicio } from "../enums/tipo-servicio.enum";

export interface IOrdenServicio {
  id?: string;
  tipoServicio: TipoServicio;
  montoTotal: number;
  duracionEstimadaHoras?: number;
  calcularCostoFinal(): number;
  validarDatosEspecificos(): boolean;
}
//Esto define qué debe tener cualquier tipo de orden.