import { X, User, FileText } from 'lucide-react';
import type { AdminResultado } from '../types';
import { RiskBadge } from './RiskBadge';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  resultado: AdminResultado | null;
}

// Función para calcular nivel de riesgo basado en puntaje (0-21)
const calcularNivelRiesgo = (puntaje: number): 'bajo' | 'medio' | 'alto' => {
  if (puntaje <= 7) return 'bajo';
  if (puntaje <= 14) return 'medio';
  return 'alto';
};

const responseMap: Record<string, string> = {
  '0': 'Nunca',
  '1': 'Casi nunca',
  '2': 'Algunas veces',
  '3': 'Siempre',
};

export function DetailModal({ isOpen, onClose, resultado }: DetailModalProps) {
  if (!isOpen || !resultado) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-br from-blue-600 to-indigo-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Detalles de Evaluación</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Información del Empleado</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold text-gray-700">Nombre:</span> {resultado.empleado.nombre}</p>
              <p><span className="font-semibold text-gray-700">ID Empleado:</span> {resultado.empleado.id}</p>
            </div>
          </div>

          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-5 h-5 text-indigo-600" />
              <h3 className="font-semibold text-gray-900">Información de la Encuesta</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold text-gray-700">Tipo:</span> <span className="capitalize">{resultado.encuesta.tipo}</span></p>
              <p><span className="font-semibold text-gray-700">Descripción:</span> {resultado.encuesta.descripcion}</p>
              <p><span className="font-semibold text-gray-700">Puntaje Total:</span> <span className="font-bold text-lg text-blue-600">{resultado.puntaje_total}</span></p>
              <div><span className="font-semibold text-gray-700">Nivel de Riesgo:</span> <RiskBadge nivel={calcularNivelRiesgo(resultado.puntaje_total)} /></div>
              <p><span className="font-semibold text-gray-700">Fecha:</span> {new Date(resultado.fecha_completado).toLocaleDateString('es-ES', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Desglose de Respuestas</h3>
            <div className="space-y-4">
              {resultado.detalle_clinico.preguntas.map((pregunta, index) => {
                const respuestaValor = resultado.detalle_clinico.respuestas[index];
                const respuestaTexto = responseMap[respuestaValor] || respuestaValor;

                return (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex gap-3">
                      <div className="shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 font-medium">{pregunta}</p>
                        <p className="mt-2 text-sm">
                          <span className="text-gray-600">Respuesta: </span>
                          <span className="font-semibold text-blue-600">{respuestaTexto}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {resultado.interpretacion && resultado.interpretacion !== 'Sin interpretación disponible' && (
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <h3 className="font-semibold text-gray-900 mb-2">Interpretación Clínica</h3>
              <p className="text-sm text-gray-700">{resultado.interpretacion}</p>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
