import { Command } from '../interfaces/command.interface';
export declare class ReprogramarOrdenCommand implements Command {
    private ordenId;
    private nuevaFecha;
    constructor(ordenId: string, nuevaFecha: Date);
    execute(): Promise<void>;
}
