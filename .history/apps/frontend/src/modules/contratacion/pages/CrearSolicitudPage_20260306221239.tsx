import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '@shared/services/api';
import { TipoServicio } from '../types';

function CrearSolicitudPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    clienteId: '', // Se llena desde el usuario logueado
    tipoServicio: TipoServicio.POR_HORAS,
    presupuestoEstimado: '',
  });

  // Obtener el usuario logueado del localStorage
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      const usuario = JSON.parse(usuarioGuardado);
      setFormData(prev => ({ ...prev, clienteId: usuario.id }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo || !formData.descripcion) {
      setMessage({ type: 'error', text: 'Complete todos los campos obligatorios' });
      return;
    }

    try {
      setLoading(true);
      await apiClient.post('/solicitudes', {
        ...formData,
        presupuestoEstimado: formData.presupuestoEstimado 
          ? parseFloat(formData.presupuestoEstimado) 
          : undefined,
      });
      
      setMessage({ type: 'success', text: 'Solicitud creada exitosamente' });
      
      setTimeout(() => {
        navigate('/solicitudes');
      }, 1500);
    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Error al crear solicitud' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>➕ Nueva Solicitud de Servicio</h2>
      
      {message && (
        <div className={message.type === 'success' ? 'success' : 'error'} style={{ marginTop: '1rem' }}>
          {message.text}
        </div>
      )}

      <div className="card" style={{ marginTop: '1rem' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="titulo">Título de la solicitud *</label>
            <input
              type="text"
              id="titulo"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              placeholder="Ej: Desarrollo de sitio web corporativo"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción *</label>
            <textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              placeholder="Describe el servicio que necesitas..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tipoServicio">Tipo de Servicio *</label>
            <select
              id="tipoServicio"
              value={formData.tipoServicio}
              onChange={(e) => setFormData({ ...formData, tipoServicio: e.target.value as TipoServicio })}
              required
            >
              <option value={TipoServicio.POR_HORAS}>Por Horas</option>
              <option value={TipoServicio.POR_TAREA}>Por Tarea</option>
              <option value={TipoServicio.POR_PAQUETE}>Por Paquete</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="presupuesto">Presupuesto Estimado (opcional)</label>
            <input
              type="number"
              id="presupuesto"
              step="0.01"
              min="0"
              value={formData.presupuestoEstimado}
              onChange={(e) => setFormData({ ...formData, presupuestoEstimado: e.target.value })}
              placeholder="0.00"
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading || !formData.clienteId}
            >
              {loading ? 'Creando...' : '✅ Crear Solicitud'}
            </button>
            <button 
              type="button" 
              className="btn" 
              style={{ background: '#ddd' }}
              onClick={() => navigate('/solicitudes')}
              disabled={loading}
            >
              ❌ Cancelar
            </button>
          </div>
        </form>
      </div>

      <div className="card" style={{ marginTop: '2rem', background: '#f0f9ff' }}>
        <h3>ℹ️ Información</h3>
        <p style={{ marginTop: '1rem', lineHeight: '1.6' }}>
          Al crear una solicitud, se registrará en el sistema y podrá ser procesada 
          para generar una cotización y orden de servicio. El tipo de servicio determina 
          cómo se calculará el costo final:
        </p>
        <ul style={{ marginTop: '1rem', lineHeight: '1.8' }}>
          <li><strong>Por Horas:</strong> Se calcula según tarifa por hora × horas estimadas</li>
          <li><strong>Por Tarea:</strong> Se ajusta según complejidad (baja, media, alta)</li>
          <li><strong>Por Paquete:</strong> Se basa en cantidad de entregables</li>
        </ul>
      </div>
    </div>
  );
}

export default CrearSolicitudPage;
export default CrearSolicitudPage;
