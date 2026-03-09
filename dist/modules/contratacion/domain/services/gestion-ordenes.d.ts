import { EjecutorComandosService } from './ejecutor-comandos.service';
import { ProcesoContratacionTemplate, DatosProcesoContratacion } from './proceso-contratacion.template';
export declare class GestionOrdenesService {
    private readonly ejecutor;
    constructor(ejecutor: EjecutorComandosService);
    contratar(proceso: ProcesoContratacionTemplate, datos: DatosProcesoContratacion): Promise<import("./proceso-contratacion.template").ResultadoContratacion>;
    cancelarOrden(ordenId: string): Promise<void>;
    reprogramarOrden(ordenId: string, nuevaFecha: Date): Promise<void>;
    confirmarEjecucion(ordenId: string): Promise<void>;
}
