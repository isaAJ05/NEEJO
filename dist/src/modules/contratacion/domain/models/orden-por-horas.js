"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdenPorHoras = void 0;
const tipo_servicio_enum_1 = require("../enums/tipo-servicio.enum");
const orden_servicio_base_1 = require("./orden-servicio.base");
class OrdenPorHoras extends orden_servicio_base_1.OrdenServicioBase {
    constructor(tarifaPorHora, horasEstimadas) {
        super(tipo_servicio_enum_1.TipoServicio.POR_HORAS, tarifaPorHora * horasEstimadas);
        this.tarifaPorHora = tarifaPorHora;
        this.horasEstimadas = horasEstimadas;
        this.duracionEstimadaHoras = horasEstimadas;
    }
    calcularCostoFinal() {
        return this.montoTotal * 1.10;
    }
    validarDatosEspecificos() {
        return this.tarifaPorHora > 0 && this.horasEstimadas > 0;
    }
}
exports.OrdenPorHoras = OrdenPorHoras;
//# sourceMappingURL=orden-por-horas.js.map