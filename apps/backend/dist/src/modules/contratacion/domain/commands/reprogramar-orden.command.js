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
exports.ReprogramarOrdenCommand = void 0;
const common_1 = require("@nestjs/common");
const estado_orden_enum_1 = require("../enums/estado-orden.enum");
const prisma_service_1 = require("../../infrastructure/persistence/prisma/prisma.service");
let ReprogramarOrdenCommand = class ReprogramarOrdenCommand {
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
        if (orden.estado === estado_orden_enum_1.EstadoOrden.COMPLETADA || orden.estado === estado_orden_enum_1.EstadoOrden.CANCELADA) {
            throw new Error('No se puede reprogramar una orden completada o cancelada');
        }
        if (params.nuevaFechaInicio <= new Date()) {
            throw new Error('La nueva fecha debe ser futura');
        }
        return true;
    }
    async execute(params) {
        await this.validate(params);
        const motivo = params.motivo ?? 'Reprogramacion solicitada';
        const ordenActual = await this.prisma.ordenServicio.findUnique({
            where: { id: params.ordenId },
        });
        const ordenActualizada = await this.prisma.ordenServicio.update({
            where: { id: params.ordenId },
            data: {
                fechaInicio: params.nuevaFechaInicio,
                estado: estado_orden_enum_1.EstadoOrden.REPROGRAMADA,
            },
        });
        await this.prisma.historialEstado.create({
            data: {
                ordenId: params.ordenId,
                estadoAnterior: ordenActual.estado,
                estadoNuevo: estado_orden_enum_1.EstadoOrden.REPROGRAMADA,
                motivo: `Reprogramada para ${params.nuevaFechaInicio.toISOString()}: ${motivo}`,
                cambiadoPor: params.usuarioId || 'SISTEMA',
            },
        });
        return {
            orden: ordenActualizada,
            mensaje: 'Orden reprogramada exitosamente',
        };
    }
    getDescription(params) {
        return `Reprogramar orden ${params.ordenId} para ${params.nuevaFechaInicio.toISOString()}`;
    }
};
exports.ReprogramarOrdenCommand = ReprogramarOrdenCommand;
exports.ReprogramarOrdenCommand = ReprogramarOrdenCommand = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReprogramarOrdenCommand);
//# sourceMappingURL=reprogramar-orden.command.js.map