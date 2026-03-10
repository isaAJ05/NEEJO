import { PrismaService } from '../infrastructure/persistence/prisma/prisma.service';
export declare class UsuariosController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listarUsuarios(): Promise<{
        total: number;
        usuarios: {
            id: string;
            email: string;
            nombre: string;
            telefono: string;
            rol: import(".prisma/client").$Enums.RolUsuario;
            createdAt: Date;
        }[];
    }>;
    listarClientes(): Promise<{
        total: number;
        clientes: {
            id: string;
            email: string;
            nombre: string;
            telefono: string;
            rol: import(".prisma/client").$Enums.RolUsuario;
        }[];
    }>;
    listarProveedores(): Promise<{
        total: number;
        proveedores: {
            id: string;
            email: string;
            nombre: string;
            telefono: string;
            rol: import(".prisma/client").$Enums.RolUsuario;
        }[];
    }>;
}
