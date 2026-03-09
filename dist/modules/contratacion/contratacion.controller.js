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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContratacionController = void 0;
const common_1 = require("@nestjs/common");
const gestion_ordenes_1 = require("./domain/services/gestion-ordenes");
let ContratacionController = class ContratacionController {
    constructor(gestionOrdenesService) {
        this.gestionOrdenesService = gestionOrdenesService;
    }
    async cancelar(id) {
        await this.gestionOrdenesService.cancelarOrden(id);
        return { mensaje: `Orden ${id} cancelada` };
    }
    async reprogramar(id, nuevaFecha) {
        await this.gestionOrdenesService.reprogramarOrden(id, new Date(nuevaFecha));
        return { mensaje: `Orden ${id} reprogramada` };
    }
    async confirmar(id) {
        await this.gestionOrdenesService.confirmarEjecucion(id);
        return { mensaje: `Orden ${id} confirmada` };
    }
};
exports.ContratacionController = ContratacionController;
__decorate([
    (0, common_1.Post)(':id/cancelar'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContratacionController.prototype, "cancelar", null);
__decorate([
    (0, common_1.Post)(':id/reprogramar'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('nuevaFecha')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ContratacionController.prototype, "reprogramar", null);
__decorate([
    (0, common_1.Post)(':id/confirmar'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContratacionController.prototype, "confirmar", null);
exports.ContratacionController = ContratacionController = __decorate([
    (0, common_1.Controller)('contratacion'),
    __metadata("design:paramtypes", [gestion_ordenes_1.GestionOrdenesService])
], ContratacionController);
//# sourceMappingURL=contratacion.controller.js.map