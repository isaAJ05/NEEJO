"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdenPorTarea = void 0;
const tipo_servicio_enum_1 = require("../enums/tipo-servicio.enum");
const orden_servicio_base_1 = require("./orden-servicio.base");
class OrdenPorTarea extends orden_servicio_base_1.OrdenServicioBase {
    constructor(montoBase, complejidad) {
        super(tipo_servicio_enum_1.TipoServicio.POR_TAREA, montoBase);
        this.complejidad = complejidad;
        this.duracionEstimadaHoras = complejidad === 'BAJA' ? 8 : complejidad === 'MEDIA' ? 16 : 40;
    }
    calcularCostoFinal() {
        const multiplicadores = { BAJA: 1.0, MEDIA: 1.15, ALTA: 1.30 };
        return this.montoTotal * multiplicadores[this.complejidad];
    }
    validarDatosEspecificos() {
        return this.montoTotal > 0 && ['BAJA', 'MEDIA', 'ALTA'].includes(this.complejidad);
    }
}
exports.OrdenPorTarea = OrdenPorTarea;
//# sourceMappingURL=orden-por-tarea.js.map