import { Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import HomePage from '@modules/contratacion/pages/HomePage';
import SolicitudesPage from '@modules/contratacion/pages/SolicitudesPage';
import OrdenesPage from '@modules/contratacion/pages/OrdenesPage';
import CrearSolicitudPage from '@modules/contratacion/pages/CrearSolicitudPage';
import { LoginPage } from '@modules/contratacion/pages/LoginPage';

function App() {
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
  }, []);

  const manejarLogout = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    setUsuario(null);
    window.location.href = '/login';
  };

  // Si no está logueado, mostrar página de login
  if (!usuario) {
    return <LoginPage />;
  }

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1>⚙️ NEEJO </h1>
          <p>Contratación de Servicio</p>
        </div>
      </header>

      <nav className="nav">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Link to="/" className="nav-link">Inicio</Link>
            <Link to="/solicitudes" className="nav-link">Solicitudes</Link>
            <Link to="/ordenes" className="nav-link">Órdenes</Link>
            <Link to="/crear-solicitud" className="nav-link primary">+ Nueva Solicitud</Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '12px', color: '#666' }}>
              👤 {usuario?.nombre}
            </span>
            <button
              onClick={manejarLogout}
              style={{
                padding: '6px 12px',
                background: '#ff6b6b',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="main">
        <div className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/solicitudes" element={<SolicitudesPage />} />
            <Route path="/ordenes" element={<OrdenesPage />} />
            <Route path="/crear-solicitud" element={<CrearSolicitudPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>© 2026 NIPL </p>
        </div>
      </footer>
    </div>
  );
}

export default App;