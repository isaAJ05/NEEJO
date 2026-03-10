"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContratacionPorPaquete = exports.ContratacionPorTarea = exports.ContratacionPorHoras = exports.ProcesoContratacionTemplate = void 0;
const common_1 = require("@nestjs/common");
let ProcesoContratacionTemplate = class ProcesoContratacionTemplate {
    async ejecutarProcesoCompleto(datos) {
        const pasos = [];
        pasos.push('1. Validación inicial de datos');
        await this.validarDatosComunes(datos);
        pasos.push('2. Validación específica del tipo de servicio');
        await this.validarDatosEspecificos(datos);
        pasos.push('3. Cálculo de presupuesto');
        const presupuesto = await this.calcularPresupuesto(datos.parametrosServicio);
        pasos.push('4. Creación de solicitud de servicio');
        const solicitudId = await this.crearSolicitud(datos, presupuesto);
        pasos.push('5. Generación de cotización');
        const cotizacionId = await this.generarCotizacion(solicitudId, presupuesto);
        pasos.push('6. Aplicación de ajustes específicos');
        const montoFinal = await this.aplicarAjustesEspecificos(presupuesto);
        pasos.push('7. Creación de orden de servicio');
        const ordenId = await this.crearOrden(solicitudId, cotizacionId, datos, montoFinal);
        pasos.push('8. Envío de notificaciones');
        await this.notificar(ordenId, datos.clienteId);
        return {
            solicitudId,
            cotizacionId,
            ordenId,
            montoFinal,
            duracionEstimada: await this.calcularDuracion(datos.parametrosServicio),
            pasosSeguidos: pasos,
        };
    }
    async validarDatosComunes(datos) {
        if (!datos.clienteId || !datos.tipoServicio || !datos.descripcion) {
            throw new Error('Faltan datos obligatorios');
        }
    }
    async crearSolicitud(datos, presupuesto) {
        return `SOL-${Date.now()}`;
    }
    async generarCotizacion(solicitudId, monto) {
        return `COT-${Date.now()}`;
    }
    async crearOrden(solicitudId, cotizacionId, datos, montoFinal) {
        return `ORD-${Date.now()}`;
    }
    async notificar(ordenId, clienteId) {
    }
};
exports.ProcesoContratacionTemplate = ProcesoContratacionTemplate;
exports.ProcesoContratacionTemplate = ProcesoContratacionTemplate = __decorate([
    (0, common_1.Injectable)()
], ProcesoContratacionTemplate);
let ContratacionPorHoras = class ContratacionPorHoras extends ProcesoContratacionTemplate {
    async validarDatosEspecificos(datos) {
        const { tarifaPorHora, horasEstimadas } = datos.parametrosServicio;
        if (!tarifaPorHora || !horasEstimadas) {
            throw new Error('Faltan tarifaPorHora u horasEstimadas');
        }
        if (tarifaPorHora <= 0 || horasEstimadas <= 0) {
            throw new Error('Tarifa y horas deben ser positivas');
        }
    }
    async calcularPresupuesto(parametros) {
        return parametros.tarifaPorHora * parametros.horasEstimadas;
    }
    async aplicarAjustesEspecificos(presupuestoBase) {
        return presupuestoBase * 1.10;
    }
    async calcularDuracion(parametros) {
        return parametros.horasEstimadas;
    }
    async notificar(ordenId, clienteId) {
        console.log(`📧 Notificación: Orden ${ordenId} por horas creada para cliente ${clienteId}`);
    }
};
exports.ContratacionPorHoras = ContratacionPorHoras;
exports.ContratacionPorHoras = ContratacionPorHoras = __decorate([
    (0, common_1.Injectable)()
], ContratacionPorHoras);
let ContratacionPorTarea = class ContratacionPorTarea extends ProcesoContratacionTemplate {
    async validarDatosEspecificos(datos) {
        const { montoBase, complejidad } = datos.parametrosServicio;
        if (!montoBase || !complejidad) {
            throw new Error('Faltan montoBase o complejidad');
        }
        if (!['BAJA', 'MEDIA', 'ALTA'].includes(complejidad)) {
            throw new Error('Complejidad inválida');
        }
    }
    async calcularPresupuesto(parametros) {
        return parametros.montoBase;
    }
    async aplicarAjustesEspecificos(presupuestoBase) {
        return presupuestoBase;
    }
    async calcularDuracion(parametros) {
        const duraciones = { BAJA: 8, MEDIA: 16, ALTA: 40 };
        return duraciones[parametros.complejidad];
    }
};
exports.ContratacionPorTarea = ContratacionPorTarea;
exports.ContratacionPorTarea = ContratacionPorTarea = __decorate([
    (0, common_1.Injectable)()
], ContratacionPorTarea);
let ContratacionPorPaquete = class ContratacionPorPaquete extends ProcesoContratacionTemplate {
    async validarDatosEspecificos(datos) {
        const { montoPorEntregable, cantidadEntregables } = datos.parametrosServicio;
        if (!montoPorEntregable || !cantidadEntregables) {
            throw new Error('Faltan montoPorEntregable o cantidadEntregables');
        }
        if (cantidadEntregables < 1) {
            throw new Error('Debe haber al menos 1 entregable');
        }
    }
    async calcularPresupuesto(parametros) {
        return parametros.montoPorEntregable * parametros.cantidadEntregables;
    }
    async aplicarAjustesEspecificos(presupuestoBase) {
        return presupuestoBase * 0.90;
    }
    async calcularDuracion(parametros) {
        return parametros.cantidadEntregables * 8;
    }
    async notificar(ordenId, clienteId) {
        console.log(`📦 Notificación: Paquete ${ordenId} creado para cliente ${clienteId}`);
    }
};
exports.ContratacionPorPaquete = ContratacionPorPaquete;
exports.ContratacionPorPaquete = ContratacionPorPaquete = __decorate([
    (0, common_1.Injectable)()
], ContratacionPorPaquete);
//# sourceMappingURL=proceso-contratacion.template.js.map