import { Module } from '@nestjs/common';
import { ContratacionController } from './presentation/contratacion.controller';
import { AuthController } from './presentation/auth.controller';
import { OrdenController } from './presentation/orden.controller';
import { SolicitudController } from './presentation/solicitud.controller';
import { UsuariosController } from './presentation/usuarios.controller';
import { EjecutorComandosService } from './domain/services/ejecutor-comandos.service';
import { GestionOrdenesService } from './domain/services/gestion-ordenes';
import { PrismaService } from './infrastructure/persistence/prisma/prisma.service';
import { CancelarOrdenCommand } from './domain/commands/cancelar-orden.command';
import { ReprogramarOrdenCommand } from './domain/commands/reprogramar-orden.command';
import { ConfirmarEjecucionCommand } from './domain/commands/confirmar-ejecucion.command';
import { ContratacionFacade } from './infrastructure/facades/contratacion.facade';
import { OrdenServicioFactory } from './domain/factories/orden-servicio.factory';
import {
  ContratacionPorHoras,
  ContratacionPorPaquete,
  ContratacionPorTarea,
} from './domain/services/proceso-contratacion.template';

@Module({
  controllers: [
    ContratacionController,
    AuthController,
    OrdenController,
    SolicitudController,
    UsuariosController,
  ],
  providers: [
    PrismaService,
    ContratacionFacade,
    OrdenServicioFactory,
    ContratacionPorHoras,
    ContratacionPorTarea,
    ContratacionPorPaquete,
    CancelarOrdenCommand,
    ReprogramarOrdenCommand,
    ConfirmarEjecucionCommand,
    EjecutorComandosService,
    GestionOrdenesService,
  ],
})
export class ContratacionModule {}