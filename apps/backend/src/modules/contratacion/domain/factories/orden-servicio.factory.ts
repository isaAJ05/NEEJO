import { TipoServicio } from '@prisma/client';


export interface IOrdenServicio {
  id?: string;
  tipoServicio: TipoServicio;
  montoTotal: number;
  duracionEstimadaHoras?: number;
  
}

// Clase base abstracta
export abstract class OrdenServicioBase implements IOrdenServicio {
  id?: string;
  tipoServicio: TipoServicio;
  montoTotal: number;
  duracionEstimadaHoras?: number;

  constructor(tipoServicio: TipoServicio, montoTotal: number) {
    this.tipoServicio = tipoServicio;
    this.montoTotal = montoTotal;
  }

  
}

