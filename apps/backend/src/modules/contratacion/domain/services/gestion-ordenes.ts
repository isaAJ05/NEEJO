import { Injectable } from '@nestjs/common';
import { EjecutorComandosService } from './ejecutor-comandos.service';
import { CancelarOrdenCommand } from '../commands/cancelar-orden.command';
import { ReprogramarOrdenCommand } from '../commands/reprogramar-orden.command';
import { ConfirmarEjecucionCommand } from '../commands/confirmar-ejecucion.command';
import {
  ProcesoContratacionTemplate,
  DatosProcesoContratacion,
} from './proceso-contratacion.template';

@Injectable()
export class GestionOrdenesService {
  constructor(
    private readonly ejecutor: EjecutorComandosService,
    private readonly cancelarOrdenCommand: CancelarOrdenCommand,
    private readonly reprogramarOrdenCommand: ReprogramarOrdenCommand,
    private readonly confirmarEjecucionCommand: ConfirmarEjecucionCommand,
  ) {}

  // 🔹 Usar Template Method para contratar
  async contratar(
    proceso: ProcesoContratacionTemplate,
    datos: DatosProcesoContratacion,
  ) {
    return await proceso.ejecutarProcesoCompleto(datos);
  }

  // 🔹 Acciones operativas con Command
  async cancelarOrden(ordenId: string, motivo?: string, usuarioId?: string) {
    await this.ejecutor.ejecutar(this.cancelarOrdenCommand, {
      ordenId,
      motivo,
      usuarioId,
    });
  }

  async reprogramarOrden(
    ordenId: string,
    nuevaFecha: Date,
    motivo?: string,
    usuarioId?: string,
  ) {
    await this.ejecutor.ejecutar(this.reprogramarOrdenCommand, {
      ordenId,
      nuevaFechaInicio: nuevaFecha,
      motivo,
      usuarioId,
    });
  }

  async confirmarEjecucion(ordenId: string, usuarioId?: string, comentarios?: string) {
    await this.ejecutor.ejecutar(this.confirmarEjecucionCommand, {
      ordenId,
      usuarioId,
      comentarios,
    });
  }
}