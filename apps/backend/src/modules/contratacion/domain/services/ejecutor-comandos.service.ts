import { Injectable } from '@nestjs/common';
import { Command } from '../interfaces/command.interface';

@Injectable()
export class EjecutorComandosService {
  async ejecutar(comando: Command): Promise<void> {
    await comando.execute();
  }
}