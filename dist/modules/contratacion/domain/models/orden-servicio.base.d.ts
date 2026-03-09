import { TipoServicio } from "../enums/tipo-servicio.enum";
import { IOrdenServicio } from "../interfaces/orden-servicio.interface";
export declare abstract class OrdenServicioBase implements IOrdenServicio {
    id?: string;
    tipoServicio: TipoServicio;
    montoTotal: number;
    duracionEstimadaHoras?: number;
    constructor(tipoServicio: TipoServicio, montoTotal: number);
    abstract calcularCostoFinal(): number;
    abstract validarDatosEspecificos(): boolean;
}
