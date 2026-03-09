import { TipoServicio } from "../enums/tipo-servicio.enum";
import { IOrdenServicio } from "../interfaces/orden-servicio.interface";
export declare class OrdenServicioFactory {
    createOrden(tipo: TipoServicio, params: any): IOrdenServicio;
}
