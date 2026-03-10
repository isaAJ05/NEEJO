import { useState, useEffect } from 'react';
import apiClient from '@shared/services/api';
import { SolicitudServicio, EstadoSolicitud } from '../types';

function SolicitudesPage() {
  const [disponibles, setDisponibles] = useState<SolicitudServicio[]>([]);
  const [mias, setMias] = useState<SolicitudServicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [usuarioId, setUsuarioId] = useState<string>('');

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      const usuario = JSON.parse(usuarioGuardado);
      setUsuarioId(usuario.id);
      fetchSolicitudes(usuario.id);
    }
  }, []);

  const fetchSolicitudes = async (id: string = usuarioId) => {
    if (!id) return;

    try {
      setLoading(true);
      const [resDisponibles, resMias] = await Promise.all([
        apiClient.get(`/solicitudes/disponibles?usuarioId=${id}`),
        apiClient.get(`/solicitudes/mias/${id}`),
      ]);

      setDisponibles(resDisponibles.data.solicitudes || []);
      setMias(resMias.data.solicitudes || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar solicitudes');
    } finally {
      setLoading(false);
    }
  };

  const tomarSolicitud = async (solicitud: SolicitudServicio) => {
    if (!usuarioId) return;

    const monto = window.prompt(
      `Monto para "${solicitud.titulo}" (deja vacio para usar presupuesto estimado):`,
      String(solicitud.presupuestoEstimado ?? ''),
    );

    try {
      await apiClient.post(`/solicitudes/${solicitud.id}/aceptar`, {
        proveedorId: usuarioId,
        montoTotal: monto ? Number(monto) : undefined,
        descripcionDetalle: 'Tomada desde el marketplace',
      });

      setMensaje('Solicitud tomada. Ya aparece en la vista de Ordenes entre cliente y proveedor.');
      await fetchSolicitudes(usuarioId);
    } catch (err: any) {
      setMensaje(err.response?.data?.message || 'No se pudo tomar la solicitud');
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Solicitudes de Servicio</h2>
        <button className="btn btn-primary" onClick={() => fetchSolicitudes(usuarioId)}>
          🔄 Actualizar
        </button>
      </div>

      {mensaje && <div className="success">{mensaje}</div>}

      <div className="card">
        <h3>Marketplace publico (sin tomar)</h3>
        <p style={{ marginTop: '0.5rem', color: '#666' }}>
          Estas solicitudes aparecen para todos los usuarios. Cuando alguien las toma, desaparecen de esta lista.
        </p>
      </div>

      {disponibles.length === 0 ? (
        <div className="card">
          <p>No hay solicitudes publicas disponibles ahora.</p>
        </div>
      ) : (
        <div className="grid">
          {disponibles.map((solicitud) => (
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
              {solicitud.cliente && (
                <p style={{ marginTop: '0.25rem', fontSize: '0.875rem' }}>
                  Publicada por: <strong>{solicitud.cliente.nombre}</strong>
                </p>
              )}
              <button
                className="btn btn-success"
                style={{ marginTop: '1rem' }}
                onClick={() => tomarSolicitud(solicitud)}
              >
                Tomar servicio
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>Mis publicaciones</h3>
        <p style={{ marginTop: '0.5rem', color: '#666' }}>
          Aqui ves las solicitudes que publicaste, incluyendo si ya fueron tomadas.
        </p>
      </div>

      {mias.length === 0 ? (
        <div className="card">
          <p>No has publicado solicitudes todavia.</p>
        </div>
      ) : (
        <div className="grid">
          {mias.map((solicitud: any) => (
            <div key={solicitud.id} className="card">
              <h3>{solicitud.titulo}</h3>
              <p style={{ margin: '0.5rem 0', color: '#666' }}>{solicitud.descripcion}</p>
              <span className={getEstadoBadge(solicitud.estado)}>{solicitud.estado}</span>
              <p style={{ marginTop: '0.5rem' }}>
                Ordenes vinculadas: <strong>{solicitud._count?.ordenes ?? 0}</strong>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SolicitudesPage;