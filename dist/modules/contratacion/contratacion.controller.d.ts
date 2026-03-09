import { GestionOrdenesService } from './domain/services/gestion-ordenes';
export declare class ContratacionController {
    private readonly gestionOrdenesService;
    constructor(gestionOrdenesService: GestionOrdenesService);
    cancelar(id: string): Promise<{
        mensaje: string;
    }>;
    reprogramar(id: string, nuevaFecha: string): Promise<{
        mensaje: string;
    }>;
    confirmar(id: string): Promise<{
        mensaje: string;
    }>;
}
