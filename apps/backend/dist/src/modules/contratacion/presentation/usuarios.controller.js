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
exports.UsuariosController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../infrastructure/persistence/prisma/prisma.service");
let UsuariosController = class UsuariosController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listarUsuarios() {
        const usuarios = await this.prisma.usuario.findMany({
            select: {
                id: true,
                nombre: true,
                email: true,
                telefono: true,
                rol: true,
                createdAt: true,
            },
            orderBy: { nombre: 'asc' },
        });
        return {
            total: usuarios.length,
            usuarios,
        };
    }
    async listarClientes() {
        const clientes = await this.prisma.usuario.findMany({
            where: {
                rol: { in: ['CLIENTE', 'AMBOS'] },
            },
            select: {
                id: true,
                nombre: true,
                email: true,
                telefono: true,
                rol: true,
            },
            orderBy: { nombre: 'asc' },
        });
        return {
            total: clientes.length,
            clientes,
        };
    }
    async listarProveedores() {
        const proveedores = await this.prisma.usuario.findMany({
            where: {
                rol: { in: ['PROVEEDOR', 'AMBOS'] },
            },
            select: {
                id: true,
                nombre: true,
                email: true,
                telefono: true,
                rol: true,
            },
            orderBy: { nombre: 'asc' },
        });
        return {
            total: proveedores.length,
            proveedores,
        };
    }
};
exports.UsuariosController = UsuariosController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "listarUsuarios", null);
__decorate([
    (0, common_1.Get)('clientes'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "listarClientes", null);
__decorate([
    (0, common_1.Get)('proveedores'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "listarProveedores", null);
exports.UsuariosController = UsuariosController = __decorate([
    (0, common_1.Controller)('usuarios'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsuariosController);
//# sourceMappingURL=usuarios.controller.js.map