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
exports.SolicitarReprogramacionCommand = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../infrastructure/persistence/prisma/prisma.service");
let SolicitarReprogramacionCommand = class SolicitarReprogramacionCommand {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validate(params) {
        const orden = await this.prisma.ordenServicio.findUnique({
            where: { id: params.ordenId },
        });
        if (!orden) {
            throw new common_1.NotFoundException('Orden no encontrada');
        }
        if (orden.estado === client_1.EstadoOrden.CANCELADA || orden.estado === client_1.EstadoOrden.COMPLETADA) {
            throw new Error('No se puede reprogramar una orden cancelada o completada');
        }
        if (!params.usuarioId) {
            throw new Error('usuarioId es requerido');
        }
        const esCliente = orden.clienteId === params.usuarioId;
        const esProveedor = orden.proveedorId === params.usuarioId;
        if (!esCliente && !esProveedor) {
            throw new Error('Solo cliente o proveedor pueden solicitar reprogramacion');
        }
        if (!orden.proveedorId) {
            throw new Error('La orden aun no tiene proveedor asignado');
        }
        if (orden.estadoSolicitudReprogramacion === client_1.EstadoSolicitudReprogramacion.PENDIENTE) {
            throw new Error('Ya existe una solicitud de reprogramacion pendiente');
        }
        if (params.nuevaFechaInicio <= new Date()) {
            throw new Error('La nueva fecha debe ser futura');
        }
        return true;
    }
    async execute(params) {
        await this.validate(params);
        const orden = await this.prisma.ordenServicio.findUnique({
            where: { id: params.ordenId },
        });
        const proponeCliente = orden.clienteId === params.usuarioId;
        const usuarioDestino = proponeCliente ? orden.proveedorId : orden.clienteId;
        const ordenActualizada = await this.prisma.ordenServicio.update({
            where: { id: params.ordenId },
            data: {
                fechaInicioPropuesta: params.nuevaFechaInicio,
                motivoReprogramacion: params.motivo ?? 'Solicitud de reprogramacion',
                propuestaReprogramacionPorId: params.usuarioId,
                propuestaReprogramacionParaId: usuarioDestino,
                estadoSolicitudReprogramacion: client_1.EstadoSolicitudReprogramacion.PENDIENTE,
            },
        });
        await this.prisma.historialEstado.create({
            data: {
                ordenId: params.ordenId,
                estadoAnterior: orden.estado,
                estadoNuevo: orden.estado,
                motivo: `Solicitud de reprogramacion para ${params.nuevaFechaInicio.toISOString()}: ${params.motivo ?? 'Sin motivo'}`,
                cambiadoPor: params.usuarioId,
            },
        });
        return {
            mensaje: 'Solicitud de reprogramacion enviada. Pendiente de aprobacion de la contraparte.',
            orden: ordenActualizada,
        };
    }
    getDescription(params) {
        return `Solicitar reprogramacion de orden ${params.ordenId} para ${params.nuevaFechaInicio.toISOString()}`;
    }
};
exports.SolicitarReprogramacionCommand = SolicitarReprogramacionCommand;
exports.SolicitarReprogramacionCommand = SolicitarReprogramacionCommand = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SolicitarReprogramacionCommand);
//# sourceMappingURL=solicitar-reprogramacion.command.js.map