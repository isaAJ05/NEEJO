import { Controller, Post, Body } from '@nestjs/common';
import { ContratacionFacade } from '../infrastructure/facades/contratacion.facade';

/**
 * CONTROLADOR: Proceso de Contratación (usando Facade)
 */

@Controller('contratacion')
export class ContratacionController {
  constructor(private readonly contratarFacade: ContratacionFacade) {}

  /**
   * ENDPOINT PRINCIPAL: Contratar servicio (usa Facade)
   * POST /api/v1/contratacion/contratar
   * 
   * Este endpoint orquesta todo el proceso:
   * - Valida la solicitud
   * - Genera cotización
   * - Crea la orden
   */
  @Post('contratar')
  async contratarServicio(@Body() body: any) {
    return await this.contratarFacade.contratarServicio({
      clienteId: body.clienteId,
      tipoServicio: body.tipoServicio,
      descripcion: body.descripcion,
      parametrosServicio: body.parametrosServicio,
    });
  }
}
