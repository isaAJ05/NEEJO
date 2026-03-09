import { PrismaService } from '../../infrastructure/persistence/prisma/prisma.service';
import { ICommand } from '../interfaces/command.interface';
export interface CancelarOrdenParams {
    ordenId: string;
    motivo?: string;
    usuarioId?: string;
}
export declare class CancelarOrdenCommand implements ICommand<CancelarOrdenParams> {
    private readonly prisma;
    constructor(prisma: PrismaService);
    validate(params: CancelarOrdenParams): Promise<boolean>;
    execute(params: CancelarOrdenParams): Promise<any>;
    getDescription(params: CancelarOrdenParams): string;
}
