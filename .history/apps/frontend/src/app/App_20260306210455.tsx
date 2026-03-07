import { Routes, Route, Link } from 'react-router-dom';
import HomePage from '@modules/contratacion/pages/HomePage';
import SolicitudesPage from '@modules/contratacion/pages/SolicitudesPage';
import OrdenesPage from '@modules/contratacion/pages/OrdenesPage';
import CrearSolicitudPage from '@modules/contratacion/pages/CrearSolicitudPage';

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1>⚙️ Contratación de Servicio</h1>
          <p>Marketplace de trabajos cortos - Grupo 5</p>
        </div>
      </header>

      <nav className="nav">
        <div className="container">
          <Link to="/" className="nav-link">Inicio</Link>
          <Link to="/solicitudes" className="nav-link">Solicitudes</Link>
          <Link to="/ordenes" className="nav-link">Órdenes</Link>
          <Link to="/crear-solicitud" className="nav-link primary">+ Nueva Solicitud</Link>
        </div>
      </nav>

      <main className="main">
        <div className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/solicitudes" element={<SolicitudesPage />} />
            <Route path="/ordenes" element={<OrdenesPage />} />
            <Route path="/crear-solicitud" element={<CrearSolicitudPage />} />
          </Routes>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>© 2026 Grupo 5 - Taller de Patrones de Diseño</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
