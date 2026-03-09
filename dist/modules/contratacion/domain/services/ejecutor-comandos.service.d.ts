import { Command } from '../interfaces/command.interface';
export declare class EjecutorComandosService {
    ejecutar(comando: Command): Promise<void>;
}
