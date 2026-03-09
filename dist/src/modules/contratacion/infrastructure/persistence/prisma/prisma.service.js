"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let PrismaService = class PrismaService extends client_1.PrismaClient {
    constructor() {
        super(...arguments);
        this.dbDisponible = false;
    }
    async onModuleInit() {
        try {
            if (!process.env.DATABASE_URL) {
                console.warn('⚠️  DATABASE_URL no está configurada.');
                console.warn('   Crea un archivo .env en la raiz del proyecto con DATABASE_URL.');
                this.dbDisponible = false;
                return;
            }
            await this.$connect();
            this.dbDisponible = true;
            console.log('✅ Prisma conectado a la base de datos');
        }
        catch (error) {
            this.dbDisponible = false;
            console.warn('⚠️  No se pudo conectar a la base de datos PostgreSQL.');
            console.warn('   Si necesitas la BD, asegúrate de que PostgreSQL esté corriendo en localhost:5432');
            console.warn('   La aplicación funcionará en modo SIN BASE DE DATOS (solo demostración)');
        }
    }
    ensureDbDisponible() {
        if (!this.dbDisponible) {
            throw new common_1.ServiceUnavailableException('Base de datos no disponible. Revisa DATABASE_URL y que PostgreSQL esté activo.');
        }
    }
    isDbDisponible() {
        return this.dbDisponible;
    }
    async onModuleDestroy() {
        await this.$disconnect().catch(() => { });
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)()
], PrismaService);
//# sourceMappingURL=prisma.service.js.map