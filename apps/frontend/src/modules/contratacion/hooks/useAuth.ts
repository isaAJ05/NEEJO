import { useState, useEffect } from 'react';
import api from '@shared/services/api';


interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: 'CLIENTE' | 'PROVEEDOR' | 'AMBOS';
}

interface UseAuthReturn {
  usuario: Usuario | null;
  cargando: boolean;
  error: string | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
}

export function useAuth(): UseAuthReturn {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cuando carga el componente, intenta recuperar usuario de localStorage
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
      } catch (e) {
        console.error('Error al parsear usuario guardado:', e);
        localStorage.removeItem('usuario');
      }
    }
  }, []);

  const login = async (email: string) => {
    setCargando(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', { email });
      const nuevoUsuario = response.data.usuario;
      
      // Guardar en localStorage
      localStorage.setItem('usuario', JSON.stringify(nuevoUsuario));
      localStorage.setItem('token', response.data.token);
      
      setUsuario(nuevoUsuario);
    } catch (err: any) {
      const mensajeError = err.response?.data?.message || 'Error al hacer login';
      setError(mensajeError);
      throw err;
    } finally {
      setCargando(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    setUsuario(null);
    setError(null);
  };

  return {
    usuario,
    cargando,
    error,
    login,
    logout,
  };
}