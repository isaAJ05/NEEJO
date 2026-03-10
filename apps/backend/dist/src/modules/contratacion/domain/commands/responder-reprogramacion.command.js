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
exports.ResponderReprogramacionCommand = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../infrastructure/persistence/prisma/prisma.service");
const reprogramar_orden_command_1 = require("./reprogramar-orden.command");
let ResponderReprogramacionCommand = class ResponderReprogramacionCommand {
    constructor(prisma, reprogramarOrdenCommand) {
        this.prisma = prisma;
        this.reprogramarOrdenCommand = reprogramarOrdenCommand;
    }
    async validate(params) {
        const orden = await this.prisma.ordenServicio.findUnique({
            where: { id: params.ordenId },
        });
        if (!orden) {
            throw new common_1.NotFoundException('Orden no encontrada');
        }
        if (orden.estadoSolicitudReprogramacion !== client_1.EstadoSolicitudReprogramacion.PENDIENTE) {
            throw new Error('No hay una solicitud de reprogramacion pendiente');
        }
        if (!params.usuarioId) {
            throw new Error('usuarioId es requerido');
        }
        if (orden.propuestaReprogramacionParaId !== params.usuarioId) {
            throw new Error('Solo la contraparte puede responder la solicitud de reprogramacion');
        }
        if (!params.aceptar && !params.motivoRechazo) {
            throw new Error('Debes indicar un motivo de rechazo');
        }
        return true;
    }
    async execute(params) {
        await this.validate(params);
        const orden = await this.prisma.ordenServicio.findUnique({
            where: { id: params.ordenId },
        });
        if (params.aceptar) {
            const resultadoReprogramacion = await this.reprogramarOrdenCommand.execute({
                ordenId: params.ordenId,
                nuevaFechaInicio: orden.fechaInicioPropuesta,
                motivo: `Aprobada por contraparte. Motivo original: ${orden.motivoReprogramacion ?? 'Sin motivo'}`,
                usuarioId: params.usuarioId,
            });
            await this.prisma.ordenServicio.update({
                where: { id: params.ordenId },
                data: {
                    fechaInicioPropuesta: null,
                    motivoReprogramacion: null,
                    propuestaReprogramacionPorId: null,
                    propuestaReprogramacionParaId: null,
                    estadoSolicitudReprogramacion: client_1.EstadoSolicitudReprogramacion.ACEPTADA,
                },
            });
            return {
                mensaje: 'Solicitud de reprogramacion aceptada',
                ...resultadoReprogramacion,
            };
        }
        const ordenActualizada = await this.prisma.ordenServicio.update({
            where: { id: params.ordenId },
            data: {
                fechaInicioPropuesta: null,
                motivoReprogramacion: null,
                propuestaReprogramacionPorId: null,
                propuestaReprogramacionParaId: null,
                estadoSolicitudReprogramacion: client_1.EstadoSolicitudReprogramacion.RECHAZADA,
            },
        });
        await this.prisma.historialEstado.create({
            data: {
                ordenId: params.ordenId,
                estadoAnterior: orden.estado,
                estadoNuevo: orden.estado,
                motivo: `Solicitud de reprogramacion rechazada: ${params.motivoRechazo}`,
                cambiadoPor: params.usuarioId,
            },
        });
        return {
            mensaje: 'Solicitud de reprogramacion rechazada',
            orden: ordenActualizada,
        };
    }
    getDescription(params) {
        return `${params.aceptar ? 'Aceptar' : 'Rechazar'} reprogramacion de orden ${params.ordenId}`;
    }
};
exports.ResponderReprogramacionCommand = ResponderReprogramacionCommand;
exports.ResponderReprogramacionCommand = ResponderReprogramacionCommand = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        reprogramar_orden_command_1.ReprogramarOrdenCommand])
], ResponderReprogramacionCommand);
//# sourceMappingURL=responder-reprogramacion.command.js.map