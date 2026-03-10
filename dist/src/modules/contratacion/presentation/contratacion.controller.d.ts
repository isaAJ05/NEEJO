import { ContratacionFacade } from '../infrastructure/facades/contratacion.facade';
export declare class ContratacionController {
    private readonly contratarFacade;
    constructor(contratarFacade: ContratacionFacade);
    contratarServicio(body: any): Promise<{
        resultado: import("../domain/services/proceso-contratacion.template").ResultadoContratacion;
        orden: import("../domain/interfaces/orden-servicio.interface").IOrdenServicio;
    }>;
}
