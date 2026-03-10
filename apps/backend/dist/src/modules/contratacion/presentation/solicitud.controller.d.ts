import { PrismaService } from '../infrastructure/persistence/prisma/prisma.service';
export declare class SolicitudController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    crearSolicitud(body: any): Promise<{
        mensaje: string;
        solicitud: {
            cliente: {
                id: string;
                email: string;
                nombre: string;
            };
        } & {
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
    }>;
    listarSolicitudes(usuarioId?: string): Promise<{
        total: number;
        solicitudes: ({
            _count: {
                ordenes: number;
            };
            cliente: {
                id: string;
                email: string;
                nombre: string;
            };
            ordenes: {
                id: string;
                clienteId: string;
                proveedorId: string;
                estado: import(".prisma/client").$Enums.EstadoOrden;
            }[];
            cotizaciones: {
                solicitudId: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                montoTotal: number;
                duracionEstimadaHoras: number | null;
                descripcionDetalle: string | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            clienteId: string;
            tipoServicio: import(".prisma/client").$Enums.TipoServicio;
            estado: import(".prisma/client").$Enums.EstadoSolicitud;
            titulo: string;
            descripcion: string;
            presupuestoEstimado: number | null;
        })[];
    }>;
    listarDisponibles(usuarioId?: string): Promise<{
        total: number;
        solicitudes: ({
            cliente: {
                id: string;
                email: string;
                nombre: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            clienteId: string;
            tipoServicio: import(".prisma/client").$Enums.TipoServicio;
            estado: import(".prisma/client").$Enums.EstadoSolicitud;
            titulo: string;
            descripcion: string;
            presupuestoEstimado: number | null;
        })[];
    }>;
    listarMias(usuarioId: string): Promise<{
        total: number;
        solicitudes: ({
            _count: {
                ordenes: number;
            };
            cliente: {
                id: string;
                email: string;
                nombre: string;
            };
            ordenes: {
                id: string;
                codigoOrden: string;
                proveedorId: string;
                estado: import(".prisma/client").$Enums.EstadoOrden;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            clienteId: string;
            tipoServicio: import(".prisma/client").$Enums.TipoServicio;
            estado: import(".prisma/client").$Enums.EstadoSolicitud;
            titulo: string;
            descripcion: string;
            presupuestoEstimado: number | null;
        })[];
    }>;
    aceptarSolicitud(id: string, body: {
        proveedorId: string;
        montoTotal?: number;
        duracionEstimadaHoras?: number;
        descripcionDetalle?: string;
        fechaInicio?: string;
    }): Promise<{
        mensaje: string;
        solicitudId: string;
        cotizacion: {
            solicitudId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            montoTotal: number;
            duracionEstimadaHoras: number | null;
            descripcionDetalle: string | null;
        };
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
        };
    }>;
    obtenerSolicitud(id: string): Promise<{
        cliente: {
            id: string;
            email: string;
            nombre: string;
            telefono: string | null;
            rol: import(".prisma/client").$Enums.RolUsuario;
            createdAt: Date;
            updatedAt: Date;
        };
        ordenes: {
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
        }[];
        cotizaciones: {
            solicitudId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            montoTotal: number;
            duracionEstimadaHoras: number | null;
            descripcionDetalle: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        clienteId: string;
        tipoServicio: import(".prisma/client").$Enums.TipoServicio;
        estado: import(".prisma/client").$Enums.EstadoSolicitud;
        titulo: string;
        descripcion: string;
        presupuestoEstimado: number | null;
    }>;
}
