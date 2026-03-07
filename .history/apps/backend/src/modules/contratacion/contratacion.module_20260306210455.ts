import { Module } from '@nestjs/common';
import { PrismaService } from './infrastructure/persistence/prisma/prisma.service';
import { ContratacionController } from './presentation/controllers/contratacion.controller';
import { SolicitudController } from './presentation/controllers/solicitud.controller';
import { OrdenController } from './presentation/controllers/orden.controller';

// Use Cases - Facade
import { ContratarServicioFacade } from './infrastructure/facades/contratar-servicio.facade';

// Factories
import { OrdenServicioFactory } from './domain/factories/orden-servicio.factory';

// Commands
import { CancelarOrdenCommand } from './application/commands/cancelar-orden.command';
import { ReprogramarOrdenCommand } from './application/commands/reprogramar-orden.command';
import { ConfirmarEjecucionCommand } from './application/commands/confirmar-ejecucion.command';

// Services
import { ProcesoContratacionTemplate } from './domain/services/proceso-contratacion.template';

@Module({
  controllers: [
    ContratacionController,
    SolicitudController,
    OrdenController,
  ],
  providers: [
    PrismaService,
    // Facade
    ContratarServicioFacade,
    // Factory
    OrdenServicioFactory,
    // Commands
    CancelarOrdenCommand,
    ReprogramarOrdenCommand,
    ConfirmarEjecucionCommand,
    // Template Method
    ProcesoContratacionTemplate,
  ],
  exports: [PrismaService],
})
export class ContratacionModule {}
