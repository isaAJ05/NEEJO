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
exports.SolicitudController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../infrastructure/persistence/prisma/prisma.service");
const client_1 = require("@prisma/client");
let SolicitudController = class SolicitudController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async crearSolicitud(body) {
        if (!body.clienteId) {
            throw new common_1.BadRequestException('clienteId es requerido');
        }
        const clienteExiste = await this.prisma.usuario.findUnique({
            where: { id: body.clienteId },
        });
        if (!clienteExiste) {
            throw new common_1.BadRequestException(`Cliente con ID "${body.clienteId}" no existe. Usa GET /api/v1/usuarios para ver clientes disponibles.`);
        }
        const solicitud = await this.prisma.solicitudServicio.create({
            data: {
                titulo: body.titulo,
                descripcion: body.descripcion,
                clienteId: body.clienteId,
                tipoServicio: body.tipoServicio,
                presupuestoEstimado: body.presupuestoEstimado,
                estado: client_1.EstadoSolicitud.PENDIENTE,
            },
            include: {
                cliente: { select: { id: true, nombre: true, email: true } },
            },
        });
        return {
            mensaje: 'Solicitud creada exitosamente',
            solicitud,
        };
    }
    async listarSolicitudes(usuarioId) {
        const where = {};
        if (usuarioId) {
            where.OR = [
                {
                    estado: client_1.EstadoSolicitud.PENDIENTE,
                    clienteId: { not: usuarioId },
                    ordenes: { none: {} },
                },
                { clienteId: usuarioId },
                {
                    ordenes: {
                        some: {
                            OR: [{ clienteId: usuarioId }, { proveedorId: usuarioId }],
                        },
                    },
                },
            ];
        }
        const solicitudes = await this.prisma.solicitudServicio.findMany({
            where,
            include: {
                cliente: { select: { id: true, nombre: true, email: true } },
                cotizaciones: true,
                ordenes: {
                    select: {
                        id: true,
                        clienteId: true,
                        proveedorId: true,
                        estado: true,
                    },
                },
                _count: { select: { ordenes: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return {
            total: solicitudes.length,
            solicitudes,
        };
    }
    async listarDisponibles(usuarioId) {
        const solicitudes = await this.prisma.solicitudServicio.findMany({
            where: {
                estado: client_1.EstadoSolicitud.PENDIENTE,
                ...(usuarioId ? { clienteId: { not: usuarioId } } : {}),
                ordenes: { none: {} },
            },
            include: {
                cliente: { select: { id: true, nombre: true, email: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return {
            total: solicitudes.length,
            solicitudes,
        };
    }
    async listarMias(usuarioId) {
        const solicitudes = await this.prisma.solicitudServicio.findMany({
            where: { clienteId: usuarioId },
            include: {
                cliente: { select: { id: true, nombre: true, email: true } },
                ordenes: {
                    select: {
                        id: true,
                        codigoOrden: true,
                        estado: true,
                        proveedorId: true,
                    },
                },
                _count: { select: { ordenes: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return {
            total: solicitudes.length,
            solicitudes,
        };
    }
    async aceptarSolicitud(id, body) {
        if (!body.proveedorId) {
            throw new common_1.BadRequestException('proveedorId es requerido');
        }
        const [solicitud, proveedor] = await Promise.all([
            this.prisma.solicitudServicio.findUnique({
                where: { id },
                include: { ordenes: true },
            }),
            this.prisma.usuario.findUnique({ where: { id: body.proveedorId } }),
        ]);
        if (!solicitud) {
            throw new common_1.BadRequestException('Solicitud no encontrada');
        }
        if (!proveedor) {
            throw new common_1.BadRequestException('Proveedor no encontrado');
        }
        if (solicitud.clienteId === body.proveedorId) {
            throw new common_1.BadRequestException('No puedes tomar tu propia solicitud');
        }
        if (solicitud.ordenes.length > 0 || solicitud.estado !== client_1.EstadoSolicitud.PENDIENTE) {
            throw new common_1.BadRequestException('La solicitud ya fue tomada por otro usuario');
        }
        const montoTotal = body.montoTotal ?? solicitud.presupuestoEstimado ?? 100;
        const resultado = await this.prisma.$transaction(async (tx) => {
            const cotizacion = await tx.cotizacion.create({
                data: {
                    solicitudId: solicitud.id,
                    montoTotal,
                    duracionEstimadaHoras: body.duracionEstimadaHoras,
                    descripcionDetalle: body.descripcionDetalle ??
                        `Cotizacion generada al aceptar solicitud ${solicitud.titulo}`,
                },
            });
            const orden = await tx.ordenServicio.create({
                data: {
                    codigoOrden: `ORD-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 1000)}`,
                    solicitudId: solicitud.id,
                    cotizacionId: cotizacion.id,
                    clienteId: solicitud.clienteId,
                    proveedorId: body.proveedorId,
                    tipoServicio: solicitud.tipoServicio,
                    montoTotal,
                    estado: client_1.EstadoOrden.ASIGNADA,
                    fechaInicio: body.fechaInicio ? new Date(body.fechaInicio) : null,
                },
            });
            await tx.solicitudServicio.update({
                where: { id: solicitud.id },
                data: { estado: client_1.EstadoSolicitud.ACEPTADA },
            });
            await tx.historialEstado.create({
                data: {
                    ordenId: orden.id,
                    estadoAnterior: client_1.EstadoOrden.CREADA,
                    estadoNuevo: client_1.EstadoOrden.ASIGNADA,
                    motivo: `Solicitud aceptada por ${proveedor.nombre}`,
                    cambiadoPor: body.proveedorId,
                },
            });
            return { cotizacion, orden };
        });
        return {
            mensaje: 'Solicitud tomada exitosamente',
            solicitudId: solicitud.id,
            cotizacion: resultado.cotizacion,
            orden: resultado.orden,
        };
    }
    async obtenerSolicitud(id) {
        return await this.prisma.solicitudServicio.findUnique({
            where: { id },
            include: {
                cliente: true,
                cotizaciones: true,
                ordenes: true,
            },
        });
    }
};
exports.SolicitudController = SolicitudController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SolicitudController.prototype, "crearSolicitud", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('usuarioId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SolicitudController.prototype, "listarSolicitudes", null);
__decorate([
    (0, common_1.Get)('disponibles'),
    __param(0, (0, common_1.Query)('usuarioId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SolicitudController.prototype, "listarDisponibles", null);
__decorate([
    (0, common_1.Get)('mias/:usuarioId'),
    __param(0, (0, common_1.Param)('usuarioId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SolicitudController.prototype, "listarMias", null);
__decorate([
    (0, common_1.Post)(':id/aceptar'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SolicitudController.prototype, "aceptarSolicitud", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SolicitudController.prototype, "obtenerSolicitud", null);
exports.SolicitudController = SolicitudController = __decorate([
    (0, common_1.Controller)('solicitudes'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SolicitudController);
//# sourceMappingURL=solicitud.controller.js.map