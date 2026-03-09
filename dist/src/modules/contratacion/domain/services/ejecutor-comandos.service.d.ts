import { ICommand } from '../interfaces/command.interface';
export declare class EjecutorComandosService {
    ejecutar<TParams, TResult>(comando: ICommand<TParams, TResult>, params: TParams): Promise<TResult>;
}
