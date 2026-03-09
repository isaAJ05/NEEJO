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
const contratacion_controller_1 = require("./contratacion.controller");
const ejecutor_comandos_service_1 = require("./domain/services/ejecutor-comandos.service");
const gestion_ordenes_1 = require("./domain/services/gestion-ordenes");
let ContratacionModule = class ContratacionModule {
};
exports.ContratacionModule = ContratacionModule;
exports.ContratacionModule = ContratacionModule = __decorate([
    (0, common_1.Module)({
        controllers: [contratacion_controller_1.ContratacionController],
        providers: [
            ejecutor_comandos_service_1.EjecutorComandosService,
            gestion_ordenes_1.GestionOrdenesService,
        ],
    })
], ContratacionModule);
//# sourceMappingURL=contratacion.module.js.map