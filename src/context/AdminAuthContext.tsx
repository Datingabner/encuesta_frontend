import { createContext, useContext, useState} from 'react';

interface AdminAuthContextType {
  apiKey: string | null;
  isAuthenticated: boolean;
  login: (apiKey: string) => void;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [apiKey, setApiKey] = useState<string | null>(() => {
    return localStorage.getItem('adminApiKey');
  });

  const login = (newApiKey: string) => {
    localStorage.setItem('adminApiKey', newApiKey);
    setApiKey(newApiKey);
  };

  const logout = () => {
    localStorage.removeItem('adminApiKey');
    setApiKey(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        apiKey,
        isAuthenticated: !!apiKey,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth debe ser usado dentro de un AdminAuthProvider');
  }
  return context;
}
