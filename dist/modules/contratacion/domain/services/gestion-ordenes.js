"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GestionOrdenesService = void 0;
const common_1 = require("@nestjs/common");
const ejecutor_comandos_service_1 = require("./ejecutor-comandos.service");
const cancelar_orden_command_1 = require("../commands/cancelar-orden.command");
const reprogramar_orden_command_1 = require("../commands/reprogramar-orden.command");
const confirmar_ejecucion_command_1 = require("../commands/confirmar-ejecucion.command");
let GestionOrdenesService = class GestionOrdenesService {
    constructor(ejecutor) {
        this.ejecutor = ejecutor;
    }
    async contratar(proceso, datos) {
        return await proceso.ejecutarProcesoCompleto(datos);
    }
    async cancelarOrden(ordenId) {
        const comando = new cancelar_orden_command_1.CancelarOrdenCommand(ordenId);
        await this.ejecutor.ejecutar(comando);
    }
    async reprogramarOrden(ordenId, nuevaFecha) {
        const comando = new reprogramar_orden_command_1.ReprogramarOrdenCommand(ordenId, nuevaFecha);
        await this.ejecutor.ejecutar(comando);
    }
    async confirmarEjecucion(ordenId) {
        const comando = new confirmar_ejecucion_command_1.ConfirmarEjecucionCommand(ordenId);
        await this.ejecutor.ejecutar(comando);
    }
};
exports.GestionOrdenesService = GestionOrdenesService;
exports.GestionOrdenesService = GestionOrdenesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ejecutor_comandos_service_1.EjecutorComandosService])
], GestionOrdenesService);
//# sourceMappingURL=gestion-ordenes.js.map