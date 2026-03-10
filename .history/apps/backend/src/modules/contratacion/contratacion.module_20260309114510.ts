import { Module } from '@nestjs/common';
import { ContratacionController } from './contratacion.controller';

// Domain Services
import { EjecutorComandosService } from './domain/services/ejecutor-comandos.service';
import { GestionOrdenesService } from './domain/services/gestion-ordenes';
import {
  ProcesoContratacionTemplate,
  ContratacionPorHoras,
  ContratacionPorTarea,
  ContratacionPorPaquete,
} from './domain/services/proceso-contratacion.template';

// Domain Commands
import { CancelarOrdenCommand } from './domain/commands/cancelar-orden.command';
import { ReprogramarOrdenCommand } from './domain/commands/reprogramar-orden.command';
import { ConfirmarEjecucionCommand } from './domain/commands/confirmar-ejecucion.command';

// Domain Factory
import { OrdenServicioFactory } from './domain/factories/orden-servicio.factory';

// Infrastructure
import { PrismaService } from './infrastructure/persistence/prisma/prisma.service';
import { ContratacionFacade } from './infrastructure/facades/contratacion.facade';

@Module({
  controllers: [ContratacionController],
  providers: [
    // Infrastructure
    PrismaService,
    ContratacionFacade,
    
    // Domain - Commands
    CancelarOrdenCommand,
    ReprogramarOrdenCommand,
    ConfirmarEjecucionCommand,
    
    // Domain - Services
    EjecutorComandosService,
    GestionOrdenesService,
    
    // Domain - Factory
    OrdenServicioFactory,
    
    // Domain - Template Method implementations
    ContratacionPorHoras,
    ContratacionPorTarea,
    ContratacionPorPaquete,
  ],
})
export class ContratacionModule {}