import { Injectable } from "@nestjs/common";
import { TipoServicio } from "../enums/tipo-servicio.enum";

import { IOrdenServicio } from "../interfaces/orden-servicio.interface";

import { OrdenPorHoras } from "../models/orden-por-horas";
import { OrdenPorTarea } from "../models/orden-por-tarea";
import { OrdenPorPaquete } from "../models/orden-por-paquetes";


//Fabrica
@Injectable()
export class OrdenServicioFactory {
  createOrden(
    tipo: TipoServicio,
    params: any,
  ): IOrdenServicio {
    switch (tipo) {
      case TipoServicio.POR_HORAS:
        return new OrdenPorHoras(params.tarifaPorHora, params.horasEstimadas);
      
      case TipoServicio.POR_TAREA:
        return new OrdenPorTarea(params.montoBase, params.complejidad);
      
      case TipoServicio.POR_PAQUETE:
        return new OrdenPorPaquete(params.montoPorEntregable, params.cantidadEntregables);
      
      default:
        throw new Error(`Tipo de servicio no soportado: ${tipo}`);
    }
  }
}