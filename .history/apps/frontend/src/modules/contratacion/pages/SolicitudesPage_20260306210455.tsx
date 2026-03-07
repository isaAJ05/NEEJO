import { useState, useEffect } from 'react';
import apiClient from '@shared/services/api';
import { SolicitudServicio, EstadoSolicitud } from '../types';

function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState<SolicitudServicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/solicitudes');
      setSolicitudes(response.data.solicitudes || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar solicitudes');
    } finally {
      setLoading(false);
    }
  };

  const getEstadoBadge = (estado: EstadoSolicitud) => {
    const badgeMap = {
      PENDIENTE: 'badge-warning',
      EN_COTIZACION: 'badge-info',
      COTIZADA: 'badge-info',
      ACEPTADA: 'badge-success',
      RECHAZADA: 'badge-danger',
      CANCELADA: 'badge-danger',
    };
    return `badge ${badgeMap[estado] || 'badge-info'}`;
  };

  if (loading) return <div className="loading">Cargando solicitudes...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>📝 Solicitudes de Servicio</h2>
        <button className="btn btn-primary" onClick={fetchSolicitudes}>
          🔄 Actualizar
        </button>
      </div>

      {solicitudes.length === 0 ? (
        <div className="card">
          <p>No hay solicitudes registradas aún.</p>
        </div>
      ) : (
        <div className="grid">
          {solicitudes.map((solicitud) => (
            <div key={solicitud.id} className="card">
              <h3>{solicitud.titulo}</h3>
              <p style={{ margin: '0.5rem 0', color: '#666' }}>
                {solicitud.descripcion}
              </p>
              <div style={{ marginTop: '1rem' }}>
                <span className={getEstadoBadge(solicitud.estado)}>
                  {solicitud.estado}
                </span>
                <span className="badge badge-info" style={{ marginLeft: '0.5rem' }}>
                  {solicitud.tipoServicio.replace('_', ' ')}
                </span>
              </div>
              {solicitud.presupuestoEstimado && (
                <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>
                  Presupuesto estimado: ${solicitud.presupuestoEstimado.toFixed(2)}
                </p>
              )}
              <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
                Creada: {new Date(solicitud.createdAt).toLocaleDateString('es-ES')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SolicitudesPage;
