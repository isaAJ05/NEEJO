"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmarEjecucionCommand = void 0;
class ConfirmarEjecucionCommand {
    constructor(ordenId) {
        this.ordenId = ordenId;
    }
    async execute() {
        console.log(`Orden ${this.ordenId} marcada como ejecutada`);
    }
}
exports.ConfirmarEjecucionCommand = ConfirmarEjecucionCommand;
//# sourceMappingURL=confirmar-ejecucion.command.js.map