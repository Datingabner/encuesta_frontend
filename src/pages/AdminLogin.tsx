import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Shield } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAdminAuth } from './../context/AdminAuthContext';
import toast from 'react-hot-toast';

//importacion de la API Key correcta desde un archivo de configuración o variable de entorno
const CORRECT_API_KEY = import.meta.env.VITE_ADMIN_API_KEY || '';

export function AdminLogin() {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAdminAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (apiKey === CORRECT_API_KEY) {
        login(apiKey);
        toast.success('Acceso concedido');
        navigate('/admin/dashboard');
      } else {
        toast.error('API Key inválida');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex justify-center mb-8">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Panel de RRHH
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Acceso restringido - Ingresa la API Key
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                API Key
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Ingresa la API Key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={!apiKey || isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
            >
              {isLoading ? 'Validando...' : 'Acceder'}
            </Button>
          </form>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-gray-600">
              <span className="font-semibold text-blue-600">Nota:</span> Este acceso es solo para personal de Recursos Humanos autorizado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
