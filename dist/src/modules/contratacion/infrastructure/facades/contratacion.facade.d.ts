import { OrdenServicioFactory } from '../../domain/factories/orden-servicio.factory';
import { IOrdenServicio } from '../../domain/interfaces/orden-servicio.interface';
import { ContratacionPorHoras, ContratacionPorPaquete, ContratacionPorTarea, DatosProcesoContratacion, ResultadoContratacion } from '../../domain/services/proceso-contratacion.template';
export declare class ContratacionFacade {
    private readonly ordenFactory;
    private readonly contratacionPorHoras;
    private readonly contratacionPorTarea;
    private readonly contratacionPorPaquete;
    private readonly procesosMap;
    constructor(ordenFactory: OrdenServicioFactory, contratacionPorHoras: ContratacionPorHoras, contratacionPorTarea: ContratacionPorTarea, contratacionPorPaquete: ContratacionPorPaquete);
    contratarServicio(datos: DatosProcesoContratacion): Promise<{
        resultado: ResultadoContratacion;
        orden: IOrdenServicio;
    }>;
    private obtenerProceso;
}
