import { PrismaService } from '../../infrastructure/persistence/prisma/prisma.service';
import { ICommand } from '../interfaces/command.interface';
export interface ReprogramarOrdenParams {
    ordenId: string;
    nuevaFechaInicio: Date;
    motivo?: string;
    usuarioId?: string;
}
export declare class ReprogramarOrdenCommand implements ICommand<ReprogramarOrdenParams> {
    private readonly prisma;
    constructor(prisma: PrismaService);
    validate(params: ReprogramarOrdenParams): Promise<boolean>;
    execute(params: ReprogramarOrdenParams): Promise<any>;
    getDescription(params: ReprogramarOrdenParams): string;
}
