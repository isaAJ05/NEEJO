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
exports.CancelarOrdenCommand = void 0;
const common_1 = require("@nestjs/common");
const estado_orden_enum_1 = require("../enums/estado-orden.enum");
const prisma_service_1 = require("../../infrastructure/persistence/prisma/prisma.service");
let CancelarOrdenCommand = class CancelarOrdenCommand {
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
        const estadosPermitidos = [estado_orden_enum_1.EstadoOrden.CREADA, estado_orden_enum_1.EstadoOrden.ASIGNADA, estado_orden_enum_1.EstadoOrden.EN_PROGRESO];
        if (!estadosPermitidos.includes(orden.estado)) {
            throw new Error(`No se puede cancelar una orden en estado ${orden.estado}`);
        }
        return true;
    }
    async execute(params) {
        await this.validate(params);
        const motivo = params.motivo ?? 'Cancelada por solicitud del cliente';
        const ordenActual = await this.prisma.ordenServicio.findUnique({
            where: { id: params.ordenId },
        });
        const ordenActualizada = await this.prisma.ordenServicio.update({
            where: { id: params.ordenId },
            data: {
                estado: estado_orden_enum_1.EstadoOrden.CANCELADA,
                motivoCancelacion: motivo,
            },
        });
        await this.prisma.historialEstado.create({
            data: {
                ordenId: params.ordenId,
                estadoAnterior: ordenActual.estado,
                estadoNuevo: estado_orden_enum_1.EstadoOrden.CANCELADA,
                motivo,
                cambiadoPor: params.usuarioId || 'SISTEMA',
            },
        });
        return {
            orden: ordenActualizada,
            mensaje: 'Orden cancelada exitosamente',
        };
    }
    getDescription(params) {
        return `Cancelar orden ${params.ordenId} por: ${params.motivo ?? 'sin motivo'}`;
    }
};
exports.CancelarOrdenCommand = CancelarOrdenCommand;
exports.CancelarOrdenCommand = CancelarOrdenCommand = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CancelarOrdenCommand);
//# sourceMappingURL=cancelar-orden.command.js.map