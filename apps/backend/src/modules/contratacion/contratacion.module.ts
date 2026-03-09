import { Module } from '@nestjs/common';
import { ContratacionController } from './contratacion.controller';
import { EjecutorComandosService } from './domain/services/ejecutor-comandos.service';
import { GestionOrdenesService } from './domain/services/gestion-ordenes';

@Module({
  controllers: [ContratacionController],
  providers: [
    EjecutorComandosService,
    GestionOrdenesService,
  ],
})
export class ContratacionModule {}