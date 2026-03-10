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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdenController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../infrastructure/persistence/prisma/prisma.service");
const cancelar_orden_command_1 = require("../domain/commands/cancelar-orden.command");
const reprogramar_orden_command_1 = require("../domain/commands/reprogramar-orden.command");
const confirmar_ejecucion_command_1 = require("../domain/commands/confirmar-ejecucion.command");
const client_1 = require("@prisma/client");
let OrdenController = class OrdenController {
    constructor(prisma, cancelarCommand, reprogramarCommand, confirmarCommand) {
        this.prisma = prisma;
        this.cancelarCommand = cancelarCommand;
        this.reprogramarCommand = reprogramarCommand;
        this.confirmarCommand = confirmarCommand;
    }
    async listarOrdenes(estado, desde, hasta, clienteId, proveedorId, usuarioId) {
        const where = {};
        if (estado) {
            where.estado = estado;
        }
        if (clienteId) {
            where.clienteId = clienteId;
        }
        if (proveedorId) {
            where.proveedorId = proveedorId;
        }
        if (usuarioId) {
            where.OR = [{ clienteId: usuarioId }, { proveedorId: usuarioId }];
        }
        if (desde || hasta) {
            where.createdAt = {};
            if (desde)
                where.createdAt.gte = new Date(desde);
            if (hasta)
                where.createdAt.lte = new Date(hasta);
        }
        const ordenes = await this.prisma.ordenServicio.findMany({
            where,
            include: {
                cliente: { select: { id: true, nombre: true, email: true } },
                proveedor: { select: { id: true, nombre: true, email: true } },
                solicitud: true,
                cotizacion: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return {
            total: ordenes.length,
            ordenes,
        };
    }
    async obtenerOrden(id) {
        const orden = await this.prisma.ordenServicio.findUnique({
            where: { id },
            include: {
                cliente: true,
                proveedor: true,
                solicitud: true,
                cotizacion: true,
                historialEstados: {
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!orden) {
            return { error: 'Orden no encontrada' };
        }
        return orden;
    }
    async cancelarOrden(id, body) {
        return await this.cancelarCommand.execute({
            ordenId: id,
            motivo: body.motivo,
            usuarioId: body.usuarioId,
        });
    }
    async reprogramarOrden(id, body) {
        return await this.reprogramarCommand.execute({
            ordenId: id,
            nuevaFechaInicio: new Date(body.nuevaFechaInicio),
            motivo: body.motivo,
            usuarioId: body.usuarioId,
        });
    }
    async confirmarEjecucion(id, body) {
        return await this.confirmarCommand.execute({
            ordenId: id,
            usuarioId: body.usuarioId,
            comentarios: body.comentarios,
        });
    }
    async iniciarEjecucion(id, body) {
        const orden = await this.prisma.ordenServicio.findUnique({ where: { id } });
        if (!orden) {
            return { error: 'Orden no encontrada' };
        }
        if (orden.estado !== client_1.EstadoOrden.ASIGNADA && orden.estado !== client_1.EstadoOrden.REPROGRAMADA) {
            return {
                error: `Solo se puede iniciar una orden ASIGNADA o REPROGRAMADA. Estado actual: ${orden.estado}`,
            };
        }
        const ordenActualizada = await this.prisma.ordenServicio.update({
            where: { id },
            data: { estado: client_1.EstadoOrden.EN_PROGRESO },
        });
        await this.prisma.historialEstado.create({
            data: {
                ordenId: id,
                estadoAnterior: orden.estado,
                estadoNuevo: client_1.EstadoOrden.EN_PROGRESO,
                motivo: body.comentarios ?? 'Ejecucion iniciada',
                cambiadoPor: body.usuarioId ?? 'SISTEMA',
            },
        });
        return {
            mensaje: 'Orden iniciada correctamente',
            orden: ordenActualizada,
        };
    }
};
exports.OrdenController = OrdenController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('estado')),
    __param(1, (0, common_1.Query)('desde')),
    __param(2, (0, common_1.Query)('hasta')),
    __param(3, (0, common_1.Query)('clienteId')),
    __param(4, (0, common_1.Query)('proveedorId')),
    __param(5, (0, common_1.Query)('usuarioId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], OrdenController.prototype, "listarOrdenes", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdenController.prototype, "obtenerOrden", null);
__decorate([
    (0, common_1.Patch)(':id/cancelar'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdenController.prototype, "cancelarOrden", null);
__decorate([
    (0, common_1.Patch)(':id/reprogramar'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdenController.prototype, "reprogramarOrden", null);
__decorate([
    (0, common_1.Patch)(':id/confirmar'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdenController.prototype, "confirmarEjecucion", null);
__decorate([
    (0, common_1.Patch)(':id/iniciar'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdenController.prototype, "iniciarEjecucion", null);
exports.OrdenController = OrdenController = __decorate([
    (0, common_1.Controller)('ordenes'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cancelar_orden_command_1.CancelarOrdenCommand,
        reprogramar_orden_command_1.ReprogramarOrdenCommand,
        confirmar_ejecucion_command_1.ConfirmarEjecucionCommand])
], OrdenController);
//# sourceMappingURL=orden.controller.js.map