import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { empleadoService } from '../services/api';
import { Layout } from '../components/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CircularProgress } from '../components/ui/ProgressBar';
import { SkeletonCard } from '../components/ui/Skeleton';
import { getEstadoColor, getEstadoTexto } from '../utils/helpers';
import type { DataProgresoEmpleado } from '../types';
import { ClipboardList, CheckCircle, Clock } from 'lucide-react';

export function Dashboard() {
  const { empleado } = useAuth();
  const navigate = useNavigate();
  const [progreso, setProgreso] = useState<DataProgresoEmpleado | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    cargarProgreso();
  }, []);

  
  const cargarProgreso = async () => {
    try {
      const data = await empleadoService.obtenerProgreso();
      setProgreso(data);
    } catch (error) {
      toast.error('Error al cargar el progreso');
    } finally {
      setIsLoading(false);
    }
  };
  
  
  
  const handleEncuestaClick = (encuestaId: number, estado: string) => {
    if (estado === 'completada') {
      toast.success('Esta encuesta ya ha sido completada');
      return;
    }
    navigate(`/encuesta/${encuestaId}`);
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </Layout>
    );
  }
  const calcularProgresoTotal = () => {
      if (!progreso || progreso.data.estadisticas.total_encuestas === 0) return 0;
      const total = progreso.data.estadisticas.total_encuestas;
      const completadas = progreso.data.estadisticas.encuestas_completadas;
      return Math.round((completadas / total) * 100);
    };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Hola, {empleado?.nombre}! 👋
          </h1>
          <p className="text-gray-600">
            Bienvenido a tu panel de encuestas de salud mental
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <div className="flex flex-col items-center">
              <CircularProgress progress={calcularProgresoTotal()} />
              <h3 className="text-lg font-semibold text-gray-900 mt-4">
                Progreso Total
              </h3>
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {progreso?.data.estadisticas.encuestas_completadas || 0}
                </p>
                <p className="text-sm text-gray-600">Encuestas Completadas</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock size={24} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {progreso?.data.estadisticas.pendientes || 0}
                </p>
                <p className="text-sm text-gray-600">Encuestas Pendientes</p>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList size={24} className="text-gray-700" />
            <h2 className="text-2xl font-bold text-gray-900">
              Mis Encuestas
            </h2>
          </div>

          {progreso?.data.progreso && progreso.data.progreso.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {progreso.data.progreso.map((encuesta) => (
                <Card key={encuesta.id_encuesta} className="hover:shadow-lg transition-shadow">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {encuesta.encuesta_tipo}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(
                          encuesta.estado
                        )}`}
                      >
                        {getEstadoTexto(encuesta.estado)}
                      </span>
                    </div>

                    {encuesta.estado !== 'pendiente' && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${encuesta.estado === 'en_progreso' ? 0 : 100}%` }}
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm text-gray-600">
                        {encuesta.estado === 'completada' && encuesta.fechaCompletado
                          ? `Completada`
                          : encuesta.estado === 'en_progreso'
                          ? `0% completado`
                          : 'Completada'}
                      </span>
                      <Button
                        variant={encuesta.estado === 'completada' ? 'outline' : 'primary'}
                        className="text-sm py-2 px-4"
                        onClick={() => handleEncuestaClick((Number (encuesta.id_encuesta)), encuesta.estado)}
                        disabled={encuesta.estado === 'completada'}
                      >
                        {encuesta.estado === 'completada'
                          ? 'Completada'
                          : encuesta.estado === 'en_progreso'
                          ? 'Continuar'
                          : 'Comenzar'}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <div className="text-center py-8">
                <ClipboardList size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">
                  No hay encuestas disponibles en este momento
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
