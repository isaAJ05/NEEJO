import { Command } from '../interfaces/command.interface';
export declare class CancelarOrdenCommand implements Command {
    private ordenId;
    constructor(ordenId: string);
    execute(): Promise<void>;
}
