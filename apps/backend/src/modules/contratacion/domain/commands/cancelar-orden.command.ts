import { Command } from '../interfaces/command.interface';

export class CancelarOrdenCommand implements Command {
  constructor(private ordenId: string) {}

  async execute(): Promise<void> {
    console.log(`Orden ${this.ordenId} cancelada`);

  }
}