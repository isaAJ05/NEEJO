"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelarOrdenCommand = void 0;
class CancelarOrdenCommand {
    constructor(ordenId) {
        this.ordenId = ordenId;
    }
    async execute() {
        console.log(`Orden ${this.ordenId} cancelada`);
    }
}
exports.CancelarOrdenCommand = CancelarOrdenCommand;
//# sourceMappingURL=cancelar-orden.command.js.map