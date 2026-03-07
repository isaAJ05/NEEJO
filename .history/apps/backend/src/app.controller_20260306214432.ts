import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getApiRoot() {
    return {
      name: 'Contratacion de Servicio API',
      status: 'ok',
      version: 'v1',
      endpoints: {
        contratacion: '/api/v1/contratacion/contratar',
        solicitudes: '/api/v1/solicitudes',
        ordenes: '/api/v1/ordenes',
      },
    };
  }
}
