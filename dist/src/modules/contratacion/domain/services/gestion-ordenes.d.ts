import { EjecutorComandosService } from './ejecutor-comandos.service';
import { CancelarOrdenCommand } from '../commands/cancelar-orden.command';
import { ReprogramarOrdenCommand } from '../commands/reprogramar-orden.command';
import { ConfirmarEjecucionCommand } from '../commands/confirmar-ejecucion.command';
import { ProcesoContratacionTemplate, DatosProcesoContratacion } from './proceso-contratacion.template';
export declare class GestionOrdenesService {
    private readonly ejecutor;
    private readonly cancelarOrdenCommand;
    private readonly reprogramarOrdenCommand;
    private readonly confirmarEjecucionCommand;
    constructor(ejecutor: EjecutorComandosService, cancelarOrdenCommand: CancelarOrdenCommand, reprogramarOrdenCommand: ReprogramarOrdenCommand, confirmarEjecucionCommand: ConfirmarEjecucionCommand);
    contratar(proceso: ProcesoContratacionTemplate, datos: DatosProcesoContratacion): Promise<import("./proceso-contratacion.template").ResultadoContratacion>;
    cancelarOrden(ordenId: string, motivo?: string, usuarioId?: string): Promise<void>;
    reprogramarOrden(ordenId: string, nuevaFecha: Date, motivo?: string, usuarioId?: string): Promise<void>;
    confirmarEjecucion(ordenId: string, usuarioId?: string, comentarios?: string): Promise<void>;
}
