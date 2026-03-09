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
    listarSolicitudes(): Promise<{
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
