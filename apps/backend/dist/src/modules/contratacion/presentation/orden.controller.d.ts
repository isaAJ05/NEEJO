import { PrismaService } from '../infrastructure/persistence/prisma/prisma.service';
import { CancelarOrdenCommand } from '../domain/commands/cancelar-orden.command';
import { ReprogramarOrdenCommand } from '../domain/commands/reprogramar-orden.command';
import { ConfirmarEjecucionCommand } from '../domain/commands/confirmar-ejecucion.command';
export declare class OrdenController {
    private readonly prisma;
    private readonly cancelarCommand;
    private readonly reprogramarCommand;
    private readonly confirmarCommand;
    constructor(prisma: PrismaService, cancelarCommand: CancelarOrdenCommand, reprogramarCommand: ReprogramarOrdenCommand, confirmarCommand: ConfirmarEjecucionCommand);
    listarOrdenes(estado?: string, desde?: string, hasta?: string, clienteId?: string): Promise<{
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
    }) | {
        error: string;
    }>;
    cancelarOrden(id: string, body: {
        motivo: string;
        usuarioId?: string;
    }): Promise<any>;
    reprogramarOrden(id: string, body: {
        nuevaFechaInicio: string;
        motivo: string;
        usuarioId?: string;
    }): Promise<any>;
    confirmarEjecucion(id: string, body: {
        usuarioId?: string;
        comentarios?: string;
    }): Promise<any>;
}
