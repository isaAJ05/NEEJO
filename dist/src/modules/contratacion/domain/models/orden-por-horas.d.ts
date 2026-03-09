import { OrdenServicioBase } from "./orden-servicio.base";
export declare class OrdenPorHoras extends OrdenServicioBase {
    tarifaPorHora: number;
    horasEstimadas: number;
    constructor(tarifaPorHora: number, horasEstimadas: number);
    calcularCostoFinal(): number;
    validarDatosEspecificos(): boolean;
}
