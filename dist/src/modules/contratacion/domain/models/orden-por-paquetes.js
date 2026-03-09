"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdenPorPaquete = void 0;
const tipo_servicio_enum_1 = require("../enums/tipo-servicio.enum");
const orden_servicio_base_1 = require("./orden-servicio.base");
class OrdenPorPaquete extends orden_servicio_base_1.OrdenServicioBase {
    constructor(montoPorEntregable, cantidadEntregables) {
        super(tipo_servicio_enum_1.TipoServicio.POR_PAQUETE, montoPorEntregable * cantidadEntregables);
        this.cantidadEntregables = cantidadEntregables;
        this.duracionEstimadaHoras = cantidadEntregables * 8;
    }
    calcularCostoFinal() {
        const descuento = this.cantidadEntregables >= 5 ? 0.90 : 1.0;
        return this.montoTotal * descuento;
    }
    validarDatosEspecificos() {
        return this.cantidadEntregables > 0 && this.montoTotal > 0;
    }
}
exports.OrdenPorPaquete = OrdenPorPaquete;
//# sourceMappingURL=orden-por-paquetes.js.map