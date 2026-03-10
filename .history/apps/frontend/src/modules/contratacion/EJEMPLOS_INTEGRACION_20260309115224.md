/\*\*

- EJEMPLOS DE INTEGRACIÓN DEL SERVICIO DE CONTRATACIÓN
-
- Este archivo muestra cómo integrar ContratacionService y useContratacion
- en las páginas existentes del frontend.
  \*/

// ============================================
// EJEMPLO 1: Usar el hook en un componente
// ============================================

import useContratacion from '../hooks/useContratacion';
import { TipoServicioEnum } from '../services/contratacionService';

function MiComponente() {
const { contratar, cargando, error, exito } = useContratacion();

const handleContratar = async () => {
await contratar({
clienteId: 'usuario-123',
tipoServicio: TipoServicioEnum.POR_HORAS,
descripcion: 'Desarrollo web full-stack',
parametrosServicio: {
tarifaPorHora: 50,
horasEstimadas: 40,
},
});
};

return (
<div>
<button onClick={handleContratar} disabled={cargando}>
{cargando ? 'Procesando...' : 'Contratar'}
</button>

      {error && <p className="error">{error}</p>}
      {exito && <p className="success">✅ Contratado exitosamente</p>}
    </div>

);
}

// ============================================
// EJEMPLO 2: Usar el servicio directamente
// ============================================

import contratacionService from '../services/contratacionService';

async function funcionAsincrona() {
try {
// Contratar un servicio
const resultado = await contratacionService.contratarServicio({
clienteId: 'usuario-456',
tipoServicio: TipoServicioEnum.POR_TAREA,
descripcion: 'Diseño de interfaz gráfica',
parametrosServicio: {
montoBase: 500,
complejidad: 'MEDIA',
},
});

    console.log('Orden creada:', resultado.resultado.ordenId);
    console.log('Monto final:', resultado.resultado.montoFinal);

    // Cancelar la orden
    const cancelado = await contratacionService.cancelarOrden(
      resultado.resultado.ordenId,
      'Cliente cambió de idea',
      'usuario-456'
    );
    console.log('Orden cancelada:', cancelado.mensaje);

    // Reprogramar una orden
    await contratacionService.reprogramarOrden(
      resultado.resultado.ordenId,
      new Date('2026-04-15'),
      'Cambio de fecha solicitado',
      'usuario-456'
    );

    // Confirmar ejecución
    await contratacionService.confirmarEjecucion(
      resultado.resultado.ordenId,
      'usuario-456',
      'Trabajo completado satisfactoriamente'
    );

    // Obtener mis órdenes
    const misOrdenes = await contratacionService.obtenerMisOrdenes('usuario-456');
    console.log('Mis órdenes:', misOrdenes);

} catch (error) {
console.error('Error:', error);
}
}

// ============================================
// EJEMPLO 3: Integración en OrdenesPage
// ============================================

import { useState, useEffect } from 'react';
import useContratacion from '../hooks/useContratacion';
import { OrdenServicio } from '../services/contratacionService';

function OrdenesPageMejorada() {
const { cancelar, reprogramar, confirmar, cargando, error } = useContratacion();
const [ordenes, setOrdenes] = useState<OrdenServicio[]>([]);
const [clienteId, setClienteId] = useState('');

useEffect(() => {
// Obtener cliente del localStorage
const usuarioGuardado = localStorage.getItem('usuario');
if (usuarioGuardado) {
const usuario = JSON.parse(usuarioGuardado);
setClienteId(usuario.id);
cargarOrdenes(usuario.id);
}
}, []);

const cargarOrdenes = async (id: string) => {
try {
// Aquí necesitarías un endpoint GET /ordenes o similiar
// const response = await apiClient.get(`/contratacion/cliente/${id}`);
// setOrdenes(response.data.ordenes);
} catch (error) {
console.error('Error al cargar órdenes:', error);
}
};

const handleCancelar = async (ordenId: string) => {
const motivo = prompt('Motivo de cancelación:');
if (motivo) {
await cancelar(ordenId, motivo, clienteId);
cargarOrdenes(clienteId); // Recargar lista
}
};

const handleReprogramar = async (ordenId: string) => {
const fecha = prompt('Nueva fecha (YYYY-MM-DD):');
if (fecha) {
await reprogramar(ordenId, new Date(fecha), '', clienteId);
cargarOrdenes(clienteId); // Recargar lista
}
};

const handleConfirmar = async (ordenId: string) => {
const comentarios = prompt('Comentarios sobre la ejecución:');
if (comentarios !== null) {
await confirmar(ordenId, clienteId, comentarios);
cargarOrdenes(clienteId); // Recargar lista
}
};

return (
<div>
<h1>Mis Órdenes</h1>

      {error && <div className="alert alert-error">{error}</div>}

      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Monto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ordenes.map((orden) => (
            <tr key={orden.id}>
              <td>{orden.codigoOrden}</td>
              <td>{orden.tipoServicio}</td>
              <td>{orden.estado}</td>
              <td>${orden.montoTotal.toFixed(2)}</td>
              <td>
                {orden.estado === 'CREADA' && (
                  <>
                    <button onClick={() => handleCancelar(orden.id)} disabled={cargando}>
                      Cancelar
                    </button>
                    <button onClick={() => handleReprogramar(orden.id)} disabled={cargando}>
                      Reprogramar
                    </button>
                  </>
                )}

                {orden.estado === 'EN_PROGRESO' && (
                  <button onClick={() => handleConfirmar(orden.id)} disabled={cargando}>
                    Confirmar Ejecución
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

);
}

// ============================================
// EJEMPLO 4: Usando el hook con estado
// ============================================

function ComponenteConDescarga() {
const { cargando, exito, resultado } = useContratacion();

if (cargando) {
return <div>⏳ Descargando información...</div>;
}

if (exito && resultado) {
return (
<div className="success-card">
<h2>✅ Servicio Contratado</h2>
<p>Orden: {resultado.ordenId}</p>
<p>Monto: ${resultado.montoFinal}</p>
<p>Duración: {resultado.duracionEstimada} horas</p>
<h3>Pasos ejecutados:</h3>
<ul>
{resultado.pasosSeguidos.map((paso, i) => (
<li key={i}>{paso}</li>
))}
</ul>
</div>
);
}

return <div>Completa el formulario para contratar</div>;
}

export { MiComponente, OrdenesPageMejorada, ComponenteConDescarga };
