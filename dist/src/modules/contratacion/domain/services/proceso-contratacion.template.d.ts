import { TipoServicio } from '../enums/tipo-servicio.enum';
export interface DatosProcesoContratacion {
    clienteId: string;
    tipoServicio: TipoServicio;
    descripcion: string;
    parametrosServicio: any;
}
export interface ResultadoContratacion {
    solicitudId: string;
    cotizacionId: string;
    ordenId: string;
    montoFinal: number;
    duracionEstimada: number;
    pasosSeguidos: string[];
}
export declare abstract class ProcesoContratacionTemplate {
    ejecutarProcesoCompleto(datos: DatosProcesoContratacion): Promise<ResultadoContratacion>;
    protected validarDatosComunes(datos: DatosProcesoContratacion): Promise<void>;
    protected crearSolicitud(datos: DatosProcesoContratacion, presupuesto: number): Promise<string>;
    protected generarCotizacion(solicitudId: string, monto: number): Promise<string>;
    protected crearOrden(solicitudId: string, cotizacionId: string, datos: DatosProcesoContratacion, montoFinal: number): Promise<string>;
    protected abstract validarDatosEspecificos(datos: DatosProcesoContratacion): Promise<void>;
    protected abstract calcularPresupuesto(parametros: any): Promise<number>;
    protected abstract aplicarAjustesEspecificos(presupuestoBase: number): Promise<number>;
    protected abstract calcularDuracion(parametros: any): Promise<number>;
    protected notificar(ordenId: string, clienteId: string): Promise<void>;
}
export declare class ContratacionPorHoras extends ProcesoContratacionTemplate {
    protected validarDatosEspecificos(datos: DatosProcesoContratacion): Promise<void>;
    protected calcularPresupuesto(parametros: any): Promise<number>;
    protected aplicarAjustesEspecificos(presupuestoBase: number): Promise<number>;
    protected calcularDuracion(parametros: any): Promise<number>;
    protected notificar(ordenId: string, clienteId: string): Promise<void>;
}
export declare class ContratacionPorTarea extends ProcesoContratacionTemplate {
    protected validarDatosEspecificos(datos: DatosProcesoContratacion): Promise<void>;
    protected calcularPresupuesto(parametros: any): Promise<number>;
    protected aplicarAjustesEspecificos(presupuestoBase: number): Promise<number>;
    protected calcularDuracion(parametros: any): Promise<number>;
}
export declare class ContratacionPorPaquete extends ProcesoContratacionTemplate {
    protected validarDatosEspecificos(datos: DatosProcesoContratacion): Promise<void>;
    protected calcularPresupuesto(parametros: any): Promise<number>;
    protected aplicarAjustesEspecificos(presupuestoBase: number): Promise<number>;
    protected calcularDuracion(parametros: any): Promise<number>;
    protected notificar(ordenId: string, clienteId: string): Promise<void>;
}
