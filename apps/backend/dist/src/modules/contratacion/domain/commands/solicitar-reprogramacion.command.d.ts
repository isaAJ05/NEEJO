import { PrismaService } from '../../infrastructure/persistence/prisma/prisma.service';
import { ICommand } from '../interfaces/command.interface';
export interface SolicitarReprogramacionParams {
    ordenId: string;
    nuevaFechaInicio: Date;
    motivo?: string;
    usuarioId: string;
}
export declare class SolicitarReprogramacionCommand implements ICommand<SolicitarReprogramacionParams> {
    private readonly prisma;
    constructor(prisma: PrismaService);
    validate(params: SolicitarReprogramacionParams): Promise<boolean>;
    execute(params: SolicitarReprogramacionParams): Promise<any>;
    getDescription(params: SolicitarReprogramacionParams): string;
}
