"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReprogramarOrdenCommand = void 0;
class ReprogramarOrdenCommand {
    constructor(ordenId, nuevaFecha) {
        this.ordenId = ordenId;
        this.nuevaFecha = nuevaFecha;
    }
    async execute() {
        console.log(`Orden ${this.ordenId} reprogramada a ${this.nuevaFecha}`);
    }
}
exports.ReprogramarOrdenCommand = ReprogramarOrdenCommand;
//# sourceMappingURL=reprogramar-orden.command.js.map