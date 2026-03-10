import { useState, useEffect } from 'react';
import apiClient from '@shared/services/api';
import { OrdenServicio, EstadoOrden, EstadoSolicitudReprogramacion } from '../types';

function OrdenesPage() {
  const [ordenes, setOrdenes] = useState<OrdenServicio[]>([]);
  const [misContrataciones, setMisContrataciones] = useState<OrdenServicio[]>([]);
  const [misServiciosTomados, setMisServiciosTomados] = useState<OrdenServicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [usuarioId, setUsuarioId] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      const usuario = JSON.parse(usuarioGuardado);
      setUsuarioId(usuario.id);
      fetchOrdenes(usuario.id);
    }
  }, [filtroEstado]);

  const fetchOrdenes = async (id: string = usuarioId) => {
    if (!id) return;

    try {
      setLoading(true);
      const params = new URLSearchParams({ usuarioId: id });
      if (filtroEstado) {
        params.append('estado', filtroEstado);
      }

      const response = await apiClient.get(`/ordenes?${params.toString()}`);
      const data = response.data.ordenes || [];
      setOrdenes(data);
      setMisContrataciones(data.filter((orden: OrdenServicio) => orden.clienteId === id));
      setMisServiciosTomados(data.filter((orden: OrdenServicio) => orden.proveedorId === id));
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar órdenes');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async (ordenId: string) => {
    const motivo = prompt('Ingrese el motivo de cancelación:');
    if (!motivo) return;

    try {
      await apiClient.patch(`/ordenes/${ordenId}/cancelar`, { motivo });
      setMessage({ type: 'success', text: 'Orden cancelada exitosamente' });
      fetchOrdenes(usuarioId);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Error al cancelar orden' });
    }
  };

  const handleReprogramar = async (ordenId: string) => {
    const fecha = prompt('Ingrese nueva fecha y hora (YYYY-MM-DDTHH:mm):');
    const motivo = prompt('Ingrese el motivo de reprogramación:');
    if (!fecha || !motivo) return;

    try {
      await apiClient.patch(`/ordenes/${ordenId}/reprogramar`, {
        nuevaFechaInicio: new Date(fecha).toISOString(),
        motivo,
        usuarioId,
      });
      setMessage({ type: 'success', text: 'Solicitud de reprogramacion enviada. Esperando respuesta de la contraparte.' });
      fetchOrdenes(usuarioId);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Error al reprogramar orden' });
    }
  };

  const handleResponderReprogramacion = async (
    ordenId: string,
    aceptar: boolean,
  ) => {
    const motivoRechazo = aceptar
      ? undefined
      : prompt('Motivo del rechazo de la reprogramacion:') || undefined;

    if (!aceptar && !motivoRechazo) {
      return;
    }

    try {
      await apiClient.patch(`/ordenes/${ordenId}/reprogramar/responder`, {
        usuarioId,
        aceptar,
        motivoRechazo,
      });

      setMessage({
        type: 'success',
        text: aceptar
          ? 'Reprogramacion aceptada y aplicada.'
          : 'Reprogramacion rechazada.',
      });
      fetchOrdenes(usuarioId);
    } catch (err: any) {
      setMessage({
        type: 'error',
        text:
          err.response?.data?.message ||
          err.response?.data?.error ||
          'Error al responder reprogramacion',
      });
    }
  };

  const renderReprogramacionInfo = (orden: OrdenServicio) => {
    if (orden.estadoSolicitudReprogramacion !== EstadoSolicitudReprogramacion.PENDIENTE) {
      return null;
    }

    const fecha = orden.fechaInicioPropuesta
      ? new Date(orden.fechaInicioPropuesta).toLocaleString('es-ES')
      : 'Sin fecha';
    const yoPropuse = orden.propuestaReprogramacionPorId === usuarioId;

    return (
      <div className="card" style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#fff8e1' }}>
        <p><strong>Solicitud pendiente de reprogramacion</strong></p>
        <p>Nueva fecha propuesta: <strong>{fecha}</strong></p>
        <p>Motivo: {orden.motivoReprogramacion || 'Sin motivo'}</p>
        <p>{yoPropuse ? 'Estado: Esperando respuesta de la contraparte.' : 'Estado: Debes aceptar o rechazar la solicitud.'}</p>
      </div>
    );
  };

  const renderReprogramacionAcciones = (orden: OrdenServicio) => {
    const pendiente = orden.estadoSolicitudReprogramacion === EstadoSolicitudReprogramacion.PENDIENTE;

    if (!pendiente && orden.estado !== EstadoOrden.CANCELADA && orden.estado !== EstadoOrden.COMPLETADA) {
      return (
        <button
          className="btn btn-warning"
          onClick={() => handleReprogramar(orden.id)}
        >
          📅 Solicitar reprogramar
        </button>
      );
    }

    if (pendiente && orden.propuestaReprogramacionParaId === usuarioId) {
      return (
        <>
          <button
            className="btn btn-success"
            onClick={() => handleResponderReprogramacion(orden.id, true)}
          >
            ✅ Aceptar cambio
          </button>
          <button
            className="btn btn-danger"
            onClick={() => handleResponderReprogramacion(orden.id, false)}
          >
            ❌ Rechazar cambio
          </button>
        </>
      );
    }

    return null;
  };

  const handleIniciar = async (ordenId: string) => {
    try {
      await apiClient.patch(`/ordenes/${ordenId}/iniciar`, {
        usuarioId,
        comentarios: 'Inicio desde el front de demo',
      });
      setMessage({ type: 'success', text: 'Orden en ejecucion' });
      fetchOrdenes(usuarioId);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Error al iniciar orden' });
    }
  };

  const handleConfirmar = async (ordenId: string) => {
    const comentarios = prompt('Comentarios (opcional):');
    
    try {
      await apiClient.patch(`/ordenes/${ordenId}/confirmar`, { comentarios });
      setMessage({ type: 'success', text: 'Orden confirmada exitosamente' });
      fetchOrdenes(usuarioId);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Error al confirmar orden' });
    }
  };

  const getEstadoBadge = (estado: EstadoOrden) => {
    const badgeMap = {
      CREADA: 'badge-info',
      ASIGNADA: 'badge-info',
      EN_PROGRESO: 'badge-warning',
      COMPLETADA: 'badge-success',
      CANCELADA: 'badge-danger',
      REPROGRAMADA: 'badge-warning',
    };
    return `badge ${badgeMap[estado] || 'badge-info'}`;
  };

  if (loading) return <div className="loading">Cargando órdenes...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>📋 Órdenes de Servicio</h2>
        <div>
          <select 
            value={filtroEstado} 
            onChange={(e) => setFiltroEstado(e.target.value)}
            style={{ padding: '0.6rem', marginRight: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="">Todos los estados</option>
            <option value="CREADA">Creada</option>
            <option value="EN_PROGRESO">En Progreso</option>
            <option value="COMPLETADA">Completada</option>
            <option value="CANCELADA">Cancelada</option>
          </select>
          <button className="btn btn-primary" onClick={() => fetchOrdenes(usuarioId)}>
            🔄 Actualizar
          </button>
        </div>
      </div>

      {message && (
        <div className={message.type === 'success' ? 'success' : 'error'}>
          {message.text}
        </div>
      )}

      {error && <div className="error">Error: {error}</div>}

      {ordenes.length === 0 ? (
        <div className="card">
          <p>No tienes ordenes vinculadas.</p>
        </div>
      ) : (
        <>
        <div className="card">
          <h3>Como cliente: servicios que contrataste</h3>
          <p style={{ marginTop: '0.5rem' }}>Solo tu y quien ofrece el servicio ven estas ordenes.</p>
        </div>

        <div className="grid">
          {misContrataciones.map((orden) => (
            <div key={orden.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3>🔖 {orden.codigoOrden}</h3>
                  <span className={getEstadoBadge(orden.estado)}>
                    {orden.estado}
                  </span>
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '1.25rem', color: '#667eea' }}>
                  ${orden.montoTotal.toFixed(2)}
                </div>
              </div>
              
              <div style={{ marginTop: '1rem' }}>
                <p><strong>Tipo:</strong> {orden.tipoServicio.replace('_', ' ')}</p>
                {orden.cliente && <p><strong>Cliente:</strong> {orden.cliente.nombre}</p>}
                {orden.proveedor && <p><strong>Proveedor:</strong> {orden.proveedor.nombre}</p>}
                <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
                  Creada: {new Date(orden.createdAt).toLocaleDateString('es-ES')}
                </p>
              </div>

              {renderReprogramacionInfo(orden)}

              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {orden.estado !== EstadoOrden.CANCELADA && orden.estado !== EstadoOrden.COMPLETADA && (
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleCancelar(orden.id)}
                  >
                    ❌ Cancelar
                  </button>
                )}
                {(orden.estado === EstadoOrden.ASIGNADA || orden.estado === EstadoOrden.REPROGRAMADA) && (
                  <button
                    className="btn btn-primary"
                    onClick={() => handleIniciar(orden.id)}
                  >
                    ▶️ Iniciar
                  </button>
                )}
                {renderReprogramacionAcciones(orden)}
                {orden.estado === EstadoOrden.EN_PROGRESO && (
                  <button 
                    className="btn btn-success" 
                    onClick={() => handleConfirmar(orden.id)}
                  >
                    ✅ Confirmar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ marginTop: '2rem' }}>
          <h3>Como proveedor: servicios que tomaste</h3>
          <p style={{ marginTop: '0.5rem' }}>Aqui gestionas tus trabajos activos y finalizados.</p>
        </div>

        <div className="grid">
          {misServiciosTomados.map((orden) => (
            <div key={orden.id} className="card">
              <h3>🔖 {orden.codigoOrden}</h3>
              <span className={getEstadoBadge(orden.estado)}>{orden.estado}</span>
              <p style={{ marginTop: '0.5rem' }}>
                Cliente: <strong>{orden.cliente?.nombre || orden.clienteId}</strong>
              </p>
              <p>
                Monto: <strong>${orden.montoTotal.toFixed(2)}</strong>
              </p>

              {renderReprogramacionInfo(orden)}

              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {(orden.estado === EstadoOrden.ASIGNADA || orden.estado === EstadoOrden.REPROGRAMADA) && (
                  <button className="btn btn-primary" onClick={() => handleIniciar(orden.id)}>
                    ▶️ Iniciar
                  </button>
                )}
                {renderReprogramacionAcciones(orden)}
                {orden.estado === EstadoOrden.EN_PROGRESO && (
                  <button className="btn btn-success" onClick={() => handleConfirmar(orden.id)}>
                    ✅ Finalizar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        </>
      )}
    </div>
  );
}

export default OrdenesPage;