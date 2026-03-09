import { Module } from '@nestjs/common';
import { ContratacionController } from './contratacion.controller';
import { EjecutorComandosService } from './domain/services/ejecutor-comandos.service';
import { GestionOrdenesService } from './domain/services/gestion-ordenes';
import { PrismaService } from '../../../src/prisma.service';
import { CancelarOrdenCommand } from './domain/commands/cancelar-orden.command';
import { ReprogramarOrdenCommand } from './domain/commands/reprogramar-orden.command';
import { ConfirmarEjecucionCommand } from './domain/commands/confirmar-ejecucion.command';

@Module({
  controllers: [ContratacionController],
  providers: [
    PrismaService,
    CancelarOrdenCommand,
    ReprogramarOrdenCommand,
    ConfirmarEjecucionCommand,
    EjecutorComandosService,
    GestionOrdenesService,
  ],
})
export class ContratacionModule {}