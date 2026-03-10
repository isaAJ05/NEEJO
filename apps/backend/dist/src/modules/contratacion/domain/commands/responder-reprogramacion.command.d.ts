import { PrismaService } from '../../infrastructure/persistence/prisma/prisma.service';
import { ICommand } from '../interfaces/command.interface';
import { ReprogramarOrdenCommand } from './reprogramar-orden.command';
export interface ResponderReprogramacionParams {
    ordenId: string;
    usuarioId: string;
    aceptar: boolean;
    motivoRechazo?: string;
}
export declare class ResponderReprogramacionCommand implements ICommand<ResponderReprogramacionParams> {
    private readonly prisma;
    private readonly reprogramarOrdenCommand;
    constructor(prisma: PrismaService, reprogramarOrdenCommand: ReprogramarOrdenCommand);
    validate(params: ResponderReprogramacionParams): Promise<boolean>;
    execute(params: ResponderReprogramacionParams): Promise<any>;
    getDescription(params: ResponderReprogramacionParams): string;
}
