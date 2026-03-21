import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Eye, TrendingUp, Users, AlertCircle, BarChart3 } from 'lucide-react';
import { adminApi } from './../lib/adminAxios';
import { useAdminAuth } from './../context/AdminAuthContext';
import { RiskBadge } from './../components/RiskBadge';
import { DetailModal } from './../components/DetailModal';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';
import type { AdminResultsResponse, AdminResultado } from './../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Skeleton } from '../components/ui/Skeleton';

export function AdminDashboard() {
  const [data, setData] = useState<AdminResultsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState<AdminResultado | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAdminAuth();

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await adminApi.get<AdminResultsResponse>('/admin/results');
      setData(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al cargar resultados');
      if (error.response?.status === 401) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
    toast.success('Sesión cerrada');
  };

  const openDetail = (resultado: AdminResultado) => {
    setSelectedResult(resultado);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex justify-between items-center mb-8">
            <Skeleton className="w-48 h-10" />
            <Skeleton className="w-32 h-10" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Skeleton className="lg:col-span-2 h-96" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-700 mb-4">No se pudieron cargar los datos</p>
          <Button onClick={fetchResults}>Reintentar</Button>
        </div>
      </div>
    );
  }

  const statistics = data.data.statistics;
  const results = data.data.results;

  const chartData = [
    { name: 'Bajo', value: statistics.distribucion_riesgo.bajo, fill: '#10b981' },
    { name: 'Medio', value: statistics.distribucion_riesgo.medio, fill: '#f59e0b' },
    { name: 'Alto', value: statistics.distribucion_riesgo.alto, fill: '#ef4444' },
  ].filter(item => item.value > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard de Salud Mental</h1>
            <p className="text-gray-600 mt-1">Monitoreo de encuestas y riesgos RRHH</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">ENCUESTAS COMPLETADAS</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{statistics.total_completed}</p>
              </div>
              <Users className="w-12 h-12 text-blue-100" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">PUNTAJE PROMEDIO</p>
                <p className="text-3xl font-bold text-indigo-600 mt-2">
                  {statistics.average_score.toFixed(1)}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-indigo-100" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">RIESGOS ALTOS</p>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  {statistics.distribucion_riesgo.alto}
                </p>
              </div>
              <AlertCircle className="w-12 h-12 text-red-100" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Resultados de Evaluaciones
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Empleado</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Tipo</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Puntaje</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Riesgo</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((resultado, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-blue-50 transition">
                      <td className="py-3 px-4 text-gray-900 font-medium">{resultado.empleado.nombre}</td>
                      <td className="py-3 px-4">
                        <span className="capitalize text-gray-700">{resultado.encuesta.tipo}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-blue-600">{resultado.puntaje_total}</span>
                      </td>
                      <td className="py-3 px-4">
                        <RiskBadge nivel={resultado.nivel_riesgo} />
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(resultado.fecha_completado).toLocaleDateString('es-ES')}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => openDetail(resultado)}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold rounded-lg transition"
                        >
                          <Eye className="w-4 h-4" />
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Distribución de Riesgos</h2>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} casos`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                Sin datos para mostrar
              </div>
            )}
          </div>
        </div>
      </div>

      <DetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedResult(null);
        }}
        resultado={selectedResult}
      />
    </div>
  );
}
