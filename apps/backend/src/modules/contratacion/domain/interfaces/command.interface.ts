/**
 * PATRÓN: Command (Comportamiento)
 * 
 * Propósito: Encapsular una acción como un objeto, permitiendo parametrizar,
 * encolar, registrar y deshacer operaciones.
 * 
 * Ventajas:
 * - Desacopla el objeto que invoca la operación del que la ejecuta
 * - Permite implementar deshacer/rehacer
 * - Facilita el registro de operaciones (auditoría)
 * - Permite encolar y ejecutar comandos de forma asíncrona
 */

// Interfaz base del Command
export interface ICommand<TParams = void, TResult = any> {
  execute(params: TParams): Promise<TResult>;
  validate(params: TParams): Promise<boolean>;
  getDescription(params: TParams): string;
}