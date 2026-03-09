import { GestionOrdenesService } from './domain/services/gestion-ordenes';
export declare class ContratacionController {
    private readonly gestionOrdenesService;
    constructor(gestionOrdenesService: GestionOrdenesService);
    cancelar(id: string, motivo?: string, usuarioId?: string): Promise<{
        mensaje: string;
    }>;
    reprogramar(id: string, nuevaFecha: string, motivo?: string, usuarioId?: string): Promise<{
        mensaje: string;
    }>;
    confirmar(id: string, usuarioId?: string, comentarios?: string): Promise<{
        mensaje: string;
    }>;
}
