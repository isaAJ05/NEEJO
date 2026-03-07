import { useState, useEffect } from 'react';
import apiClient from '@shared/services/api';
import { OrdenServicio, EstadoOrden } from '../types';

function OrdenesPage() {
  const [ordenes, setOrdenes] = useState<OrdenServicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchOrdenes();
  }, [filtroEstado]);

  const fetchOrdenes = async () => {
    try {
      setLoading(true);
      const params = filtroEstado ? `?estado=${filtroEstado}` : '';
      const response = await apiClient.get(`/ordenes${params}`);
      setOrdenes(response.data.ordenes || []);
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
      fetchOrdenes();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Error al cancelar orden' });
    }
  };

  const handleReprogramar = async (ordenId: string) => {
    const fecha = prompt('Ingrese nueva fecha (YYYY-MM-DD):');
    const motivo = prompt('Ingrese el motivo de reprogramación:');
    if (!fecha || !motivo) return;

    try {
      await apiClient.patch(`/ordenes/${ordenId}/reprogramar`, {
        nuevaFechaInicio: fecha,
        motivo,
      });
      setMessage({ type: 'success', text: 'Orden reprogramada exitosamente' });
      fetchOrdenes();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Error al reprogramar orden' });
    }
  };

  const handleConfirmar = async (ordenId: string) => {
    const comentarios = prompt('Comentarios (opcional):');
    
    try {
      await apiClient.patch(`/ordenes/${ordenId}/confirmar`, { comentarios });
      setMessage({ type: 'success', text: 'Orden confirmada exitosamente' });
      fetchOrdenes();
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
          <button className="btn btn-primary" onClick={fetchOrdenes}>
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
          <p>No hay órdenes registradas aún.</p>
        </div>
      ) : (
        <div className="grid">
          {ordenes.map((orden) => (
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

              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {orden.estado !== EstadoOrden.CANCELADA && orden.estado !== EstadoOrden.COMPLETADA && (
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleCancelar(orden.id)}
                  >
                    ❌ Cancelar
                  </button>
                )}
                {orden.estado === EstadoOrden.CREADA && (
                  <button 
                    className="btn btn-warning" 
                    onClick={() => handleReprogramar(orden.id)}
                  >
                    📅 Reprogramar
                  </button>
                )}
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
      )}
    </div>
  );
}

export default OrdenesPage;
