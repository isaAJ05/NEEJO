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
  ) {}

  // 🔹 Usar Template Method para contratar
  async contratar(
    proceso: ProcesoContratacionTemplate,
    datos: DatosProcesoContratacion,
  ) {
    return await proceso.ejecutarProcesoCompleto(datos);
  }

  // 🔹 Acciones operativas con Command
  async cancelarOrden(ordenId: string) {
    const comando = new CancelarOrdenCommand(ordenId);
    await this.ejecutor.ejecutar(comando);
  }

  async reprogramarOrden(ordenId: string, nuevaFecha: Date) {
    const comando = new ReprogramarOrdenCommand(ordenId, nuevaFecha);
    await this.ejecutor.ejecutar(comando);
  }

  async confirmarEjecucion(ordenId: string) {
    const comando = new ConfirmarEjecucionCommand(ordenId);
    await this.ejecutor.ejecutar(comando);
  }
}