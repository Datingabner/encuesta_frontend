import { createContext, useContext, useState, useEffect } from 'react';
import type { Empleado } from '../types';

interface AuthContextType {
  empleado: Empleado | null;
  token: string | null;
  login: (token: string, empleado: Empleado) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [empleado, setEmpleado] = useState<Empleado | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedEmpleado = localStorage.getItem('numero_empleado');

    if (storedToken && storedEmpleado) {
      setToken(storedToken);
      setEmpleado(JSON.parse(storedEmpleado));
    }
  }, []);

  const login = (newToken: string, newEmpleado: Empleado) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('empleado', JSON.stringify(newEmpleado));
    setToken(newToken);
    setEmpleado(newEmpleado);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('empleado');
    setToken(null);
    setEmpleado(null);
  };

  return (
    <AuthContext.Provider
      value={{
        empleado,
        token,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
