// Controllers
import { ContratacionController } from './presentation/controllers/contratacion.controller';
import { SolicitudController } from './presentation/controllers/solicitud.controller';
import { OrdenController } from './presentation/controllers/orden.controller';
import { UsuariosController } from './presentation/controllers/usuarios.controller';

@Module({
  controllers: [
    ContratacionController,
    SolicitudController,
    OrdenController,
    UsuariosController,
  ],
import { ContratarServicioFacade } from './infrastructure/facades/contratar-servicio.facade';

// Factories
import { OrdenServicioFactory } from './domain/factories/orden-servicio.factory';

// Commands (todos están en el mismo archivo)
import { 
  CancelarOrdenCommand,
  ReprogramarOrdenCommand,
  ConfirmarEjecucionCommand,
} from './application/commands/cancelar-orden.command';

// Services - Template Method implementations
import { 
  ContratacionPorHoras,
  ContratacionPorTarea,
  ContratacionPorPaquete,
} from './domain/services/proceso-contratacion.template';

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
    // Template Method - Implementaciones concretas
    ContratacionPorHoras,
    ContratacionPorTarea,
    ContratacionPorPaquete,
  ],
  exports: [PrismaService],
})
export class ContratacionModule {}
