import { PrismaService } from '../infrastructure/persistence/prisma/prisma.service';
export declare class SolicitudController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    crearSolicitud(body: any): Promise<{
        mensaje: string;
        solicitud: {
            cliente: {
                id: string;
                nombre: string;
                email: string;
            };
        } & {
            id: string;
            titulo: string;
            descripcion: string;
            tipoServicio: import(".prisma/client").$Enums.TipoServicio;
            presupuestoEstimado: number | null;
            estado: import(".prisma/client").$Enums.EstadoSolicitud;
            createdAt: Date;
            updatedAt: Date;
            clienteId: string;
        };
    }>;
    listarSolicitudes(): Promise<{
        total: number;
        solicitudes: ({
            cliente: {
                id: string;
                nombre: string;
                email: string;
            };
            cotizaciones: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                solicitudId: string;
                montoTotal: number;
                duracionEstimadaHoras: number | null;
                descripcionDetalle: string | null;
            }[];
            _count: {
                ordenes: number;
            };
        } & {
            id: string;
            titulo: string;
            descripcion: string;
            tipoServicio: import(".prisma/client").$Enums.TipoServicio;
            presupuestoEstimado: number | null;
            estado: import(".prisma/client").$Enums.EstadoSolicitud;
            createdAt: Date;
            updatedAt: Date;
            clienteId: string;
        })[];
    }>;
    obtenerSolicitud(id: string): Promise<{
        cliente: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nombre: string;
            email: string;
            telefono: string | null;
            rol: import(".prisma/client").$Enums.RolUsuario;
        };
        cotizaciones: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            solicitudId: string;
            montoTotal: number;
            duracionEstimadaHoras: number | null;
            descripcionDetalle: string | null;
        }[];
        ordenes: {
            id: string;
            tipoServicio: import(".prisma/client").$Enums.TipoServicio;
            estado: import(".prisma/client").$Enums.EstadoOrden;
            createdAt: Date;
            updatedAt: Date;
            clienteId: string;
            solicitudId: string;
            montoTotal: number;
            codigoOrden: string;
            cotizacionId: string;
            proveedorId: string | null;
            fechaInicio: Date | null;
            fechaFinalizacion: Date | null;
            motivoCancelacion: string | null;
        }[];
    } & {
        id: string;
        titulo: string;
        descripcion: string;
        tipoServicio: import(".prisma/client").$Enums.TipoServicio;
        presupuestoEstimado: number | null;
        estado: import(".prisma/client").$Enums.EstadoSolicitud;
        createdAt: Date;
        updatedAt: Date;
        clienteId: string;
    }>;
}
