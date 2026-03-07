function HomePage() {
  return (
    <div>
      <div className="card">
        <h2>Bienvenido al Sistema de Contratación de Servicios</h2>
        <p style={{ marginTop: '1rem', lineHeight: '1.6' }}>
          Este módulo permite gestionar el ciclo completo de contratación de servicios cortos:
        </p>
        <ul style={{ marginTop: '1rem', lineHeight: '2' }}>
          <li>📝 Publicar solicitudes de servicio</li>
          <li>💰 Generar cotizaciones automáticas</li>
          <li>✅ Crear órdenes de trabajo</li>
          <li>🔄 Gestionar estados (cancelar, reprogramar, confirmar)</li>
          <li>📊 Consultar historial y reportes</li>
        </ul>
      </div>

      <div className="stats">
        <div className="stat-card">
          <h3>4</h3>
          <p>Patrones de Diseño</p>
        </div>
        <div className="stat-card">
          <h3>6+</h3>
          <p>Endpoints REST</p>
        </div>
        <div className="stat-card">
          <h3>5</h3>
          <p>Entidades de BD</p>
        </div>
      </div>

      <div className="card">
        <h3>Patrones de Diseño Implementados</h3>
        <div style={{ marginTop: '1rem' }}>
          <p><strong>🏭 Factory Method:</strong> Creación de órdenes según tipo (horas/tarea/paquete)</p>
          <p><strong>🎭 Facade:</strong> Proceso simplificado de contratación</p>
          <p><strong>⚡ Command:</strong> Acciones encapsuladas (cancelar, reprogramar, confirmar)</p>
          <p><strong>📋 Template Method:</strong> Flujo fijo con pasos variables por tipo</p>
        </div>
      </div>

      <div className="card">
        <h3>Comenzar a usar el sistema</h3>
        <p style={{ marginTop: '1rem' }}>
          Usa el menú superior para navegar entre las diferentes secciones:
        </p>
        <ul style={{ marginTop: '1rem', lineHeight: '2' }}>
          <li><strong>Solicitudes:</strong> Ver todas las solicitudes de servicio</li>
          <li><strong>Órdenes:</strong> Gestionar órdenes activas y completadas</li>
          <li><strong>Nueva Solicitud:</strong> Crear una nueva solicitud de servicio</li>
        </ul>
      </div>
    </div>
  );
}

export default HomePage;
