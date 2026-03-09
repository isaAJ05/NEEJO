import { Command } from '../interfaces/command.interface';

export class ReprogramarOrdenCommand implements Command {
  constructor(
    private ordenId: string,
    private nuevaFecha: Date,
  ) {}

  async execute(): Promise<void> {
    console.log(`Orden ${this.ordenId} reprogramada a ${this.nuevaFecha}`);
  }
}