import { PrismaService } from '../../infrastructure/persistence/prisma/prisma.service';
import { ICommand } from '../interfaces/command.interface';
export interface ConfirmarEjecucionParams {
    ordenId: string;
    usuarioId?: string;
    comentarios?: string;
}
export declare class ConfirmarEjecucionCommand implements ICommand<ConfirmarEjecucionParams> {
    private readonly prisma;
    constructor(prisma: PrismaService);
    validate(params: ConfirmarEjecucionParams): Promise<boolean>;
    execute(params: ConfirmarEjecucionParams): Promise<any>;
    getDescription(params: ConfirmarEjecucionParams): string;
}
