import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { empleadoService } from '../services/api';
import { Layout } from '../components/Layout';
import { Card } from '../components/ui/Card';
import { SkeletonCard } from '../components/ui/Skeleton';
import { formatearFecha, getEstadoColor, getEstadoTexto } from '../utils/helpers';
import type { DataProgresoEmpleado } from '../types';
import { BarChart3, InfoIcon } from 'lucide-react';

export function Progress() {
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

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <BarChart3 size={32} className="text-gray-700" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mi Progreso</h1>
            <p className="text-gray-600">
              Historial de encuestas completadas y pendientes
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <div className="text-center">
              <p className="text-5xl font-bold text-blue-600">
                {progreso?.data.estadisticas.encuestas_completadas || 0}
              </p>
              <p className="text-gray-600 mt-2">Encuestas Completadas</p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <p className="text-5xl font-bold text-yellow-600">
                {progreso?.data.estadisticas.pendientes || 0}
              </p>
              <p className="text-gray-600 mt-2">Encuestas Pendientes</p>
            </div>
          </Card>
        </div>

        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Historial de Encuestas
          </h2>

          {progreso?.data.progreso && progreso.data.progreso.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Encuesta
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Estado
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Progreso
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {progreso.data.progreso.map((encuesta) => (
                    <tr
                      key={encuesta.id_encuesta}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <p className="font-medium text-gray-900">
                          {encuesta.encuesta_nombre}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(
                            encuesta.estado
                          )}`}
                        >
                          {getEstadoTexto(encuesta.estado)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[120px]">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${(progreso.data.estadisticas.encuestas_completadas)*100}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 min-w-[45px]">
                            {progreso.data.estadisticas.encuestas_completadas}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-gray-600">
                          {encuesta.fechaCompletado
                            ? formatearFecha(encuesta.fechaCompletado)
                            : encuesta.fechaInicio
                            ? formatearFecha(encuesta.fechaInicio)
                            : '-'}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No hay historial de encuestas disponible</p>
            </div>
          )}
        </Card>

        <Card className="bg-blue-50 border border-blue-200">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg"><InfoIcon/></span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                Confidencialidad de los Resultados
              </h3>
              <p className="text-sm text-blue-800">
                Por razones de confidencialidad, los puntajes individuales de las
                encuestas no se muestran. Todos los datos son agregados y analizados
                de forma anónima para mejorar el ambiente laboral.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
