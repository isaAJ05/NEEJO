"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdenServicioFactory = void 0;
const common_1 = require("@nestjs/common");
const tipo_servicio_enum_1 = require("../enums/tipo-servicio.enum");
const orden_por_horas_1 = require("../models/orden-por-horas");
const orden_por_tarea_1 = require("../models/orden-por-tarea");
const orden_por_paquetes_1 = require("../models/orden-por-paquetes");
let OrdenServicioFactory = class OrdenServicioFactory {
    createOrden(tipo, params) {
        switch (tipo) {
            case tipo_servicio_enum_1.TipoServicio.POR_HORAS:
                return new orden_por_horas_1.OrdenPorHoras(params.tarifaPorHora, params.horasEstimadas);
            case tipo_servicio_enum_1.TipoServicio.POR_TAREA:
                return new orden_por_tarea_1.OrdenPorTarea(params.montoBase, params.complejidad);
            case tipo_servicio_enum_1.TipoServicio.POR_PAQUETE:
                return new orden_por_paquetes_1.OrdenPorPaquete(params.montoPorEntregable, params.cantidadEntregables);
            default:
                throw new Error(`Tipo de servicio no soportado: ${tipo}`);
        }
    }
};
exports.OrdenServicioFactory = OrdenServicioFactory;
exports.OrdenServicioFactory = OrdenServicioFactory = __decorate([
    (0, common_1.Injectable)()
], OrdenServicioFactory);
//# sourceMappingURL=orden-servicio.factory.js.map