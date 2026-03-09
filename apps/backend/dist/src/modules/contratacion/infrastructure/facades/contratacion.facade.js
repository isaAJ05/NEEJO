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
exports.ContratacionFacade = void 0;
const common_1 = require("@nestjs/common");
const tipo_servicio_enum_1 = require("../../domain/enums/tipo-servicio.enum");
const orden_servicio_factory_1 = require("../../domain/factories/orden-servicio.factory");
const proceso_contratacion_template_1 = require("../../domain/services/proceso-contratacion.template");
let ContratacionFacade = class ContratacionFacade {
    constructor(ordenFactory, contratacionPorHoras, contratacionPorTarea, contratacionPorPaquete) {
        this.ordenFactory = ordenFactory;
        this.contratacionPorHoras = contratacionPorHoras;
        this.contratacionPorTarea = contratacionPorTarea;
        this.contratacionPorPaquete = contratacionPorPaquete;
        this.procesosMap = new Map([
            [tipo_servicio_enum_1.TipoServicio.POR_HORAS, this.contratacionPorHoras],
            [tipo_servicio_enum_1.TipoServicio.POR_TAREA, this.contratacionPorTarea],
            [tipo_servicio_enum_1.TipoServicio.POR_PAQUETE, this.contratacionPorPaquete],
        ]);
    }
    async contratarServicio(datos) {
        const proceso = this.obtenerProceso(datos.tipoServicio);
        const resultado = await proceso.ejecutarProcesoCompleto(datos);
        const orden = this.ordenFactory.createOrden(datos.tipoServicio, datos.parametrosServicio);
        return { resultado, orden };
    }
    obtenerProceso(tipo) {
        const proceso = this.procesosMap.get(tipo);
        if (!proceso) {
            throw new Error(`No existe proceso de contratación para el tipo: ${tipo}`);
        }
        return proceso;
    }
};
exports.ContratacionFacade = ContratacionFacade;
exports.ContratacionFacade = ContratacionFacade = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [orden_servicio_factory_1.OrdenServicioFactory,
        proceso_contratacion_template_1.ContratacionPorHoras,
        proceso_contratacion_template_1.ContratacionPorTarea,
        proceso_contratacion_template_1.ContratacionPorPaquete])
], ContratacionFacade);
//# sourceMappingURL=contratacion.facade.js.map