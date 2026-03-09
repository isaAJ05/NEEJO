import { OrdenServicioBase } from "./orden-servicio.base";
export declare class OrdenPorPaquete extends OrdenServicioBase {
    cantidadEntregables: number;
    constructor(montoPorEntregable: number, cantidadEntregables: number);
    calcularCostoFinal(): number;
    validarDatosEspecificos(): boolean;
}
