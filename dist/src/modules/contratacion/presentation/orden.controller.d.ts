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
            solicitud: {
                id: string;
                clienteId: string;
                tipoServicio: import(".prisma/client").$Enums.TipoServicio;
                estado: import(".prisma/client").$Enums.EstadoSolicitud;
                createdAt: Date;
                updatedAt: Date;
                titulo: string;
                descripcion: string;
                presupuestoEstimado: number | null;
            };
            cotizacion: {
                id: string;
                solicitudId: string;
                montoTotal: number;
                createdAt: Date;
                updatedAt: Date;
                duracionEstimadaHoras: number | null;
                descripcionDetalle: string | null;
            };
            cliente: {
                id: string;
                nombre: string;
                email: string;
            };
            proveedor: {
                id: string;
                nombre: string;
                email: string;
            };
        } & {
            id: string;
            codigoOrden: string;
            solicitudId: string;
            cotizacionId: string;
            clienteId: string;
            proveedorId: string | null;
            tipoServicio: import(".prisma/client").$Enums.TipoServicio;
            montoTotal: number;
            estado: import(".prisma/client").$Enums.EstadoOrden;
            fechaInicio: Date | null;
            fechaFinalizacion: Date | null;
            motivoCancelacion: string | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
    }>;
    obtenerOrden(id: string): Promise<({
        solicitud: {
            id: string;
            clienteId: string;
            tipoServicio: import(".prisma/client").$Enums.TipoServicio;
            estado: import(".prisma/client").$Enums.EstadoSolicitud;
            createdAt: Date;
            updatedAt: Date;
            titulo: string;
            descripcion: string;
            presupuestoEstimado: number | null;
        };
        cotizacion: {
            id: string;
            solicitudId: string;
            montoTotal: number;
            createdAt: Date;
            updatedAt: Date;
            duracionEstimadaHoras: number | null;
            descripcionDetalle: string | null;
        };
        cliente: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nombre: string;
            email: string;
            telefono: string | null;
            rol: import(".prisma/client").$Enums.RolUsuario;
        };
        proveedor: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nombre: string;
            email: string;
            telefono: string | null;
            rol: import(".prisma/client").$Enums.RolUsuario;
        };
        historialEstados: {
            id: string;
            createdAt: Date;
            ordenId: string;
            estadoAnterior: import(".prisma/client").$Enums.EstadoOrden | null;
            estadoNuevo: import(".prisma/client").$Enums.EstadoOrden;
            motivo: string | null;
            cambiadoPor: string | null;
        }[];
    } & {
        id: string;
        codigoOrden: string;
        solicitudId: string;
        cotizacionId: string;
        clienteId: string;
        proveedorId: string | null;
        tipoServicio: import(".prisma/client").$Enums.TipoServicio;
        montoTotal: number;
        estado: import(".prisma/client").$Enums.EstadoOrden;
        fechaInicio: Date | null;
        fechaFinalizacion: Date | null;
        motivoCancelacion: string | null;
        createdAt: Date;
        updatedAt: Date;
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
