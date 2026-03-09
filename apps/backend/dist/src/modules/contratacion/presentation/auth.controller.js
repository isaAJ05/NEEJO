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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../infrastructure/persistence/prisma/prisma.service");
let AuthController = class AuthController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async login(body) {
        if (!body.email) {
            throw new common_1.BadRequestException('El email es requerido');
        }
        const usuario = await this.prisma.usuario.findUnique({
            where: { email: body.email },
            select: {
                id: true,
                nombre: true,
                email: true,
                rol: true,
            },
        });
        if (!usuario) {
            throw new common_1.BadRequestException(`Usuario con email "${body.email}" no encontrado. Usuarios disponibles: juan@example.com, maria@example.com, carlos@provider.com`);
        }
        return {
            mensaje: 'Login exitoso',
            usuario,
            token: Buffer.from(JSON.stringify(usuario)).toString('base64'),
        };
    }
    async logout() {
        return {
            mensaje: 'Logout exitoso. Borra el token de localStorage',
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('logout'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map