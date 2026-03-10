import { useAuth } from '../hooks/useAuth';
import '../styles/LoginPage.css';

/**
 * Página de Login Simple
 * Permite al usuario seleccionar su email para "entrar"
 */

const usuarios = [
  { email: 'ana@demo.com', nombre: 'Ana Torres', rol: 'AMBOS' },
  { email: 'bruno@demo.com', nombre: 'Bruno Rojas', rol: 'AMBOS' },
  { email: 'carla@demo.com', nombre: 'Carla Mendez', rol: 'AMBOS' },
  { email: 'diego@demo.com', nombre: 'Diego Pardo', rol: 'AMBOS' },
];

export function LoginPage() {
  const { login, logout, cargando, error, usuario } = useAuth();

  const manejarLogin = async (email: string) => {
    try {
      await login(email);
      window.location.href = '/';
    } catch (err) {
      console.error('Error en login:', err);
    }
  };

  // Si ya está logueado, muestra panel de usuario
  if (usuario) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1>Bienvenido</h1>
          <div className="usuario-info">
            <p>
              <strong>Usuario:</strong> {usuario.nombre}
            </p>
            <p>
              <strong>Email:</strong> {usuario.email}
            </p>
            <p>
              <strong>Rol:</strong> {usuario.rol}
            </p>
          </div>
          <button
            className="btn-logout"
            onClick={() => {
              logout();
              window.location.href = '/login';
            }}
          >
            Cambiar usuario
          </button>
          <a href="/" className="btn btn-primary" style={{ marginTop: '10px', display: 'block' }}>
            Ir al inicio
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Sistema de Contratación</h1>
        <p className="subtitle">Selecciona tu usuario para continuar</p>

        {error && <div className="error-message">{error}</div>}

        <div className="usuarios-list">
          {usuarios.map((u) => (
            <button
              key={u.email}
              className="usuario-btn"
              onClick={() => manejarLogin(u.email)}
              disabled={cargando}
            >
              <div className="usuario-name">{u.nombre}</div>
              <div className="usuario-email">{u.email}</div>
              <div className="usuario-rol">{u.rol}</div>
            </button>
          ))}
        </div>

        <p className="info-text">
          💡 En producción, aquí iría un form de email/contraseña real
        </p>
      </div>
    </div>
  );
}