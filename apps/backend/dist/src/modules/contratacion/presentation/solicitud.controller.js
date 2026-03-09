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
    async listarSolicitudes() {
        const solicitudes = await this.prisma.solicitudServicio.findMany({
            include: {
                cliente: { select: { id: true, nombre: true, email: true } },
                cotizaciones: true,
                _count: { select: { ordenes: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return {
            total: solicitudes.length,
            solicitudes,
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SolicitudController.prototype, "listarSolicitudes", null);
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