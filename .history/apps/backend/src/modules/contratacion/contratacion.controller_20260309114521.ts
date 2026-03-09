import { Body, Controller, Param, Post } from '@nestjs/common';
import { GestionOrdenesService } from './domain/services/gestion-ordenes';
import { ContratacionFacade } from './infrastructure/facades/contratacion.facade';
import { TipoServicio } from './domain/enums/tipo-servicio.enum';
import { DatosProcesoContratacion } from './domain/services/proceso-contratacion.template';

@Controller('contratacion')
export class ContratacionController {
  constructor(
    private readonly gestionOrdenesService: GestionOrdenesService,
    private readonly contratacionFacade: ContratacionFacade,
  ) {}

  /**
   * POST /contratacion/contratar
   * Ejecuta el flujo completo de contratación (validar → cotizar → crear orden)
   */
  @Post('contratar')
  async contratar(@Body() datos: DatosProcesoContratacion) {
    const { resultado, orden } = await this.contratacionFacade.contratarServicio(datos);
    return {
      mensaje: 'Servicio contratado exitosamente',
      resultado,
      orden,
    };
  }

  @Post(':id/cancelar')
  async cancelar(
    @Param('id') id: string,
    @Body('motivo') motivo?: string,
    @Body('usuarioId') usuarioId?: string,
  ) {
    await this.gestionOrdenesService.cancelarOrden(id, motivo, usuarioId);
    return { mensaje: `Orden ${id} cancelada` };
  }

  @Post(':id/reprogramar')
  async reprogramar(
    @Param('id') id: string,
    @Body('nuevaFecha') nuevaFecha: string,
    @Body('motivo') motivo?: string,
    @Body('usuarioId') usuarioId?: string,
  ) {
    await this.gestionOrdenesService.reprogramarOrden(
      id,
      new Date(nuevaFecha),
      motivo,
      usuarioId,
    );
    return { mensaje: `Orden ${id} reprogramada` };
  }

  @Post(':id/confirmar')
  async confirmar(
    @Param('id') id: string,
    @Body('usuarioId') usuarioId?: string,
    @Body('comentarios') comentarios?: string,
  ) {
    await this.gestionOrdenesService.confirmarEjecucion(id, usuarioId, comentarios);
    return { mensaje: `Orden ${id} confirmada` };
  }
}