import { PrismaService } from '../infrastructure/persistence/prisma/prisma.service';
export declare class UsuariosController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listarUsuarios(): Promise<{
        total: number;
        usuarios: {
            id: string;
            createdAt: Date;
            nombre: string;
            email: string;
            telefono: string;
            rol: import(".prisma/client").$Enums.RolUsuario;
        }[];
    }>;
    listarClientes(): Promise<{
        total: number;
        clientes: {
            id: string;
            nombre: string;
            email: string;
            telefono: string;
            rol: import(".prisma/client").$Enums.RolUsuario;
        }[];
    }>;
    listarProveedores(): Promise<{
        total: number;
        proveedores: {
            id: string;
            nombre: string;
            email: string;
            telefono: string;
            rol: import(".prisma/client").$Enums.RolUsuario;
        }[];
    }>;
}
