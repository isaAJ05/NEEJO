import { OrdenServicioBase } from "./orden-servicio.base";
export declare class OrdenPorTarea extends OrdenServicioBase {
    complejidad: 'BAJA' | 'MEDIA' | 'ALTA';
    constructor(montoBase: number, complejidad: 'BAJA' | 'MEDIA' | 'ALTA');
    calcularCostoFinal(): number;
    validarDatosEspecificos(): boolean;
}
