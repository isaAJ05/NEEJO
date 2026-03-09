import { Command } from '../interfaces/command.interface';
export declare class ConfirmarEjecucionCommand implements Command {
    private ordenId;
    constructor(ordenId: string);
    execute(): Promise<void>;
}
