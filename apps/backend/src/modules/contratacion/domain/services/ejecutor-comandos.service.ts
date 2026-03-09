import { Injectable } from '@nestjs/common';
import { ICommand } from '../interfaces/command.interface';

@Injectable()
export class EjecutorComandosService {
  async ejecutar<TParams, TResult>(
    comando: ICommand<TParams, TResult>,
    params: TParams,
  ): Promise<TResult> {
    return comando.execute(params);
  }
}