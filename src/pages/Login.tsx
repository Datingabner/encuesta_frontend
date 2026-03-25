import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { UserCircle } from 'lucide-react';

const loginSchema = z.object({
  Empleado: z
    .string()
    .min(1, 'El número de empleado es requerido')
    .transform(val => val.trim()),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await authService.validarEmpleado(data.Empleado);
      login(response.data.token, response.data.empleado);
      toast.success(`¡Bienvenido, ${response.data.empleado.nombre}!`);
      navigate('/dashboard');
    } catch (error) {
      toast.error('Número de empleado no válido. Por favor, intenta de nuevo.');
      // Error de autenticación manejado por el toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <UserCircle size={32} className="text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sistema de Encuestas
          </h1>
          <p className="text-gray-600">
            Ingresa tu número de empleado para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Número de Empleado"
            type="text"
            placeholder="Ej: EMP001 o 12345"
            error={errors.Empleado?.message}
            {...register('Empleado')}
            autoFocus
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isLoading}
          >
            Ingresar
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Tu información es confidencial y se maneja de acuerdo con las
            políticas de privacidad de la empresa.
          </p>
        </div>
      </Card>
    </div>
  );
}
