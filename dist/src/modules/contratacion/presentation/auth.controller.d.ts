import { PrismaService } from '../infrastructure/persistence/prisma/prisma.service';
export declare class AuthController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    login(body: {
        email: string;
    }): Promise<{
        mensaje: string;
        usuario: {
            id: string;
            email: string;
            nombre: string;
            rol: import(".prisma/client").$Enums.RolUsuario;
        };
        token: string;
    }>;
    logout(): Promise<{
        mensaje: string;
    }>;
}
