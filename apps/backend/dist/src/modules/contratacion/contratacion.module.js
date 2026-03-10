"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContratacionModule = void 0;
const common_1 = require("@nestjs/common");
const contratacion_controller_1 = require("./presentation/contratacion.controller");
const auth_controller_1 = require("./presentation/auth.controller");
const orden_controller_1 = require("./presentation/orden.controller");
const solicitud_controller_1 = require("./presentation/solicitud.controller");
const usuarios_controller_1 = require("./presentation/usuarios.controller");
const ejecutor_comandos_service_1 = require("./domain/services/ejecutor-comandos.service");
const gestion_ordenes_1 = require("./domain/services/gestion-ordenes");
const prisma_service_1 = require("./infrastructure/persistence/prisma/prisma.service");
const cancelar_orden_command_1 = require("./domain/commands/cancelar-orden.command");
const reprogramar_orden_command_1 = require("./domain/commands/reprogramar-orden.command");
const confirmar_ejecucion_command_1 = require("./domain/commands/confirmar-ejecucion.command");
const solicitar_reprogramacion_command_1 = require("./domain/commands/solicitar-reprogramacion.command");
const responder_reprogramacion_command_1 = require("./domain/commands/responder-reprogramacion.command");
const contratacion_facade_1 = require("./infrastructure/facades/contratacion.facade");
const orden_servicio_factory_1 = require("./domain/factories/orden-servicio.factory");
const proceso_contratacion_template_1 = require("./domain/services/proceso-contratacion.template");
let ContratacionModule = class ContratacionModule {
};
exports.ContratacionModule = ContratacionModule;
exports.ContratacionModule = ContratacionModule = __decorate([
    (0, common_1.Module)({
        controllers: [
            contratacion_controller_1.ContratacionController,
            auth_controller_1.AuthController,
            orden_controller_1.OrdenController,
            solicitud_controller_1.SolicitudController,
            usuarios_controller_1.UsuariosController,
        ],
        providers: [
            prisma_service_1.PrismaService,
            contratacion_facade_1.ContratacionFacade,
            orden_servicio_factory_1.OrdenServicioFactory,
            proceso_contratacion_template_1.ContratacionPorHoras,
            proceso_contratacion_template_1.ContratacionPorTarea,
            proceso_contratacion_template_1.ContratacionPorPaquete,
            cancelar_orden_command_1.CancelarOrdenCommand,
            reprogramar_orden_command_1.ReprogramarOrdenCommand,
            solicitar_reprogramacion_command_1.SolicitarReprogramacionCommand,
            responder_reprogramacion_command_1.ResponderReprogramacionCommand,
            confirmar_ejecucion_command_1.ConfirmarEjecucionCommand,
            ejecutor_comandos_service_1.EjecutorComandosService,
            gestion_ordenes_1.GestionOrdenesService,
        ],
    })
], ContratacionModule);
//# sourceMappingURL=contratacion.module.js.map