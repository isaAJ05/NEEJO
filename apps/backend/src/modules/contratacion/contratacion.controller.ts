import { Body, Controller, Param, Post } from '@nestjs/common';
import { GestionOrdenesService } from './domain/services/gestion-ordenes';

@Controller('contratacion')
export class ContratacionController {
  constructor(
    private readonly gestionOrdenesService: GestionOrdenesService,
  ) {}

  @Post(':id/cancelar')
  async cancelar(@Param('id') id: string) {
    await this.gestionOrdenesService.cancelarOrden(id);
    return { mensaje: `Orden ${id} cancelada` };
  }

  @Post(':id/reprogramar')
  async reprogramar(
    @Param('id') id: string,
    @Body('nuevaFecha') nuevaFecha: string,
  ) {
    await this.gestionOrdenesService.reprogramarOrden(id, new Date(nuevaFecha));
    return { mensaje: `Orden ${id} reprogramada` };
  }

  @Post(':id/confirmar')
  async confirmar(@Param('id') id: string) {
    await this.gestionOrdenesService.confirmarEjecucion(id);
    return { mensaje: `Orden ${id} confirmada` };
  }
}