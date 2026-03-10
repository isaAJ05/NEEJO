import { PrismaService } from '../infrastructure/persistence/prisma/prisma.service';
import { CancelarOrdenCommand } from '../domain/commands/cancelar-orden.command';
import { ReprogramarOrdenCommand } from '../domain/commands/reprogramar-orden.command';
import { ConfirmarEjecucionCommand } from '../domain/commands/confirmar-ejecucion.command';
import { SolicitarReprogramacionCommand } from '../domain/commands/solicitar-reprogramacion.command';
import { ResponderReprogramacionCommand } from '../domain/commands/responder-reprogramacion.command';
export declare class OrdenController {
    private readonly prisma;
    private readonly cancelarCommand;
    private readonly reprogramarCommand;
    private readonly solicitarReprogramacionCommand;
    private readonly responderReprogramacionCommand;
    private readonly confirmarCommand;
    constructor(prisma: PrismaService, cancelarCommand: CancelarOrdenCommand, reprogramarCommand: ReprogramarOrdenCommand, solicitarReprogramacionCommand: SolicitarReprogramacionCommand, responderReprogramacionCommand: ResponderReprogramacionCommand, confirmarCommand: ConfirmarEjecucionCommand);
    listarOrdenes(estado?: string, desde?: string, hasta?: string, clienteId?: string, proveedorId?: string, usuarioId?: string): Promise<{
        total: number;
        ordenes: ({
            cotizacion: {
                solicitudId: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                montoTotal: number;
                duracionEstimadaHoras: number | null;
                descripcionDetalle: string | null;
            };
            solicitud: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                clienteId: string;
                tipoServicio: import(".prisma/client").$Enums.TipoServicio;
                estado: import(".prisma/client").$Enums.EstadoSolicitud;
                titulo: string;
                descripcion: string;
                presupuestoEstimado: number | null;
            };
            cliente: {
                id: string;
                email: string;
                nombre: string;
            };
            proveedor: {
                id: string;
                email: string;
                nombre: string;
            };
        } & {
            solicitudId: string;
            cotizacionId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            codigoOrden: string;
            clienteId: string;
            proveedorId: string | null;
            tipoServicio: import(".prisma/client").$Enums.TipoServicio;
            montoTotal: number;
            estado: import(".prisma/client").$Enums.EstadoOrden;
            fechaInicio: Date | null;
            fechaFinalizacion: Date | null;
            motivoCancelacion: string | null;
            fechaInicioPropuesta: Date | null;
            motivoReprogramacion: string | null;
            propuestaReprogramacionPorId: string | null;
            propuestaReprogramacionParaId: string | null;
            estadoSolicitudReprogramacion: import(".prisma/client").$Enums.EstadoSolicitudReprogramacion | null;
        })[];
    }>;
    obtenerOrden(id: string): Promise<({
        cotizacion: {
            solicitudId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            montoTotal: number;
            duracionEstimadaHoras: number | null;
            descripcionDetalle: string | null;
        };
        solicitud: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            clienteId: string;
            tipoServicio: import(".prisma/client").$Enums.TipoServicio;
            estado: import(".prisma/client").$Enums.EstadoSolicitud;
            titulo: string;
            descripcion: string;
            presupuestoEstimado: number | null;
        };
        cliente: {
            id: string;
            email: string;
            nombre: string;
            telefono: string | null;
            rol: import(".prisma/client").$Enums.RolUsuario;
            createdAt: Date;
            updatedAt: Date;
        };
        proveedor: {
            id: string;
            email: string;
            nombre: string;
            telefono: string | null;
            rol: import(".prisma/client").$Enums.RolUsuario;
            createdAt: Date;
            updatedAt: Date;
        };
        historialEstados: {
            ordenId: string;
            id: string;
            createdAt: Date;
            estadoAnterior: import(".prisma/client").$Enums.EstadoOrden | null;
            estadoNuevo: import(".prisma/client").$Enums.EstadoOrden;
            motivo: string | null;
            cambiadoPor: string | null;
        }[];
    } & {
        solicitudId: string;
        cotizacionId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        codigoOrden: string;
        clienteId: string;
        proveedorId: string | null;
        tipoServicio: import(".prisma/client").$Enums.TipoServicio;
        montoTotal: number;
        estado: import(".prisma/client").$Enums.EstadoOrden;
        fechaInicio: Date | null;
        fechaFinalizacion: Date | null;
        motivoCancelacion: string | null;
        fechaInicioPropuesta: Date | null;
        motivoReprogramacion: string | null;
        propuestaReprogramacionPorId: string | null;
        propuestaReprogramacionParaId: string | null;
        estadoSolicitudReprogramacion: import(".prisma/client").$Enums.EstadoSolicitudReprogramacion | null;
    }) | {
        error: string;
    }>;
    cancelarOrden(id: string, body: {
        motivo: string;
        usuarioId?: string;
    }): Promise<any>;
    reprogramarOrden(id: string, body: {
        nuevaFechaInicio: string;
        motivo?: string;
        usuarioId: string;
    }): Promise<any>;
    responderReprogramacion(id: string, body: {
        usuarioId: string;
        aceptar: boolean;
        motivoRechazo?: string;
    }): Promise<any>;
    confirmarEjecucion(id: string, body: {
        usuarioId?: string;
        comentarios?: string;
    }): Promise<any>;
    iniciarEjecucion(id: string, body: {
        usuarioId?: string;
        comentarios?: string;
    }): Promise<{
        error: string;
        mensaje?: undefined;
        orden?: undefined;
    } | {
        mensaje: string;
        orden: {
            solicitudId: string;
            cotizacionId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            codigoOrden: string;
            clienteId: string;
            proveedorId: string | null;
            tipoServicio: import(".prisma/client").$Enums.TipoServicio;
            montoTotal: number;
            estado: import(".prisma/client").$Enums.EstadoOrden;
            fechaInicio: Date | null;
            fechaFinalizacion: Date | null;
            motivoCancelacion: string | null;
            fechaInicioPropuesta: Date | null;
            motivoReprogramacion: string | null;
            propuestaReprogramacionPorId: string | null;
            propuestaReprogramacionParaId: string | null;
            estadoSolicitudReprogramacion: import(".prisma/client").$Enums.EstadoSolicitudReprogramacion | null;
        };
        error?: undefined;
    }>;
}
