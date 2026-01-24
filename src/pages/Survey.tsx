import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { encuestaService } from '../services/api';
import { Layout } from '../components/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Modal } from '../components/ui/Modal';
import { LikertScale } from '../components/LikertScale';
import { Skeleton } from '../components/ui/Skeleton';
import type { Encuesta, Pregunta } from '../types';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';

export function Survey() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [encuesta, setEncuesta] = useState<Encuesta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [respuestas, setRespuestas] = useState<Map<string, number>>(new Map());
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      cargarEncuesta();
    }
  }, [id]);

  const cargarEncuesta = async () => {
    if (!id) return;
    try {
      const data = await encuestaService.obtenerEncuesta(id.toString());
      setEncuesta(data);
    } catch (error) {
      toast.error('Error al cargar la encuesta');
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRespuesta = (preguntaId: string, valor: number) => {
    const nuevasRespuestas = new Map(respuestas);
    nuevasRespuestas.set(preguntaId, valor);
    setRespuestas(nuevasRespuestas);
  };

  const calcularProgreso = () => {
    if (!encuesta) return 0;
    return Math.round((respuestas.size / encuesta.data.preguntas.length) * 100);
  };

  const puedeAvanzar = () => {
    if (!encuesta) return false;
    const preguntaId = encuesta.data.preguntas[preguntaActual]?.id_pregunta;
    return respuestas.has(preguntaId.toString());
  };

  const handleSiguiente = () => {
    if (!encuesta || preguntaActual >= encuesta.data.preguntas.length - 1) return;
    setPreguntaActual(preguntaActual + 1);
  };

  const handleAnterior = () => {
    if (preguntaActual <= 0) return;
    setPreguntaActual(preguntaActual - 1);
  };

  const handleSubmit = async () => {
    if (!encuesta || !id) return;

    if (respuestas.size !== encuesta.data.preguntas.length) {
      toast.error('Por favor, responde todas las preguntas antes de enviar');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Preparar arrays de preguntas y respuestas
      const preguntasArray: string[] = [];
      const respuestasArray: string[] = [];

      // 2. Recorrer las respuestas en el mismo orden que las preguntas
      encuesta.data.preguntas.forEach((pregunta: Pregunta) => {
        const valor = respuestas.get(pregunta.id_pregunta.toString());
        if (valor !== undefined) {
          preguntasArray.push(pregunta.pregunta);
          respuestasArray.push(valor.toString());
        }
      });

      // 3. Validar que tenemos el mismo número de preguntas y respuestas
      if (preguntasArray.length !== respuestasArray.length) {
        throw new Error('Error al procesar las respuestas');
      }

      // 4. Crear el objeto en el formato que espera el backend
      const requestData = {
        responses: [
          {
            id_encuesta: [id.toString()], // El backend espera un array
            preguntas: preguntasArray,
            respuestas: respuestasArray
          }
        ]
      };

      console.log('Enviando al backend:', requestData); // Para debug

      await encuestaService.enviarRespuestas(Number(id), requestData);
      toast.success('¡Encuesta enviada exitosamente!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Error al enviar la encuesta');
    } finally {
      setIsSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-full" />
          <Card>
            <Skeleton className="h-48 w-full" />
          </Card>
        </div>
      </Layout>
    );
  }

  if (!encuesta) {
    return (
      <Layout>
        <Card>
          <p className="text-center text-gray-600">Encuesta no encontrada</p>
        </Card>
      </Layout>
    );
  }

  const pregunta = encuesta.data.preguntas[preguntaActual];
  const esUltimaPregunta = preguntaActual === encuesta.data.preguntas.length - 1;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {encuesta.data.tipo}
          </h1>
          <p className="text-gray-600">{encuesta.data.descripcion}</p>
        </div>

        <ProgressBar progress={calcularProgreso()} />

        <Card>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500">
                  Pregunta {preguntaActual + 1} de {encuesta.data.preguntas.length}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {pregunta.pregunta}
              </h2>
            </div>

            <LikertScale
              value={respuestas.get(pregunta.id_pregunta.toString()) ?? null}
              onChange={(valor) => handleRespuesta(pregunta.id_pregunta.toString(), valor)}
            />

            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={handleAnterior}
                disabled={preguntaActual === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft size={20} />
                Anterior
              </Button>

              {esUltimaPregunta ? (
                <Button
                  variant="primary"
                  onClick={() => setShowConfirmModal(true)}
                  disabled={!puedeAvanzar() || respuestas.size !== encuesta.data.preguntas.length}
                  className="flex items-center gap-2"
                >
                  <Send size={20} />
                  Enviar Encuesta
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleSiguiente}
                  disabled={!puedeAvanzar()}
                  className="flex items-center gap-2"
                >
                  Siguiente
                  <ChevronRight size={20} />
                </Button>
              )}
            </div>
          </div>
        </Card>

        <Card className="bg-blue-50 border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Recordatorio:</strong> Tus respuestas son completamente confidenciales
            y se utilizan únicamente para mejorar el bienestar en el lugar de trabajo.
          </p>
        </Card>
      </div>

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirmar envío"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
              Revisar
            </Button>
            <Button variant="primary" onClick={handleSubmit} isLoading={isSubmitting}>
              Confirmar y Enviar
            </Button>
          </>
        }
      >
        <p className="text-gray-700">
          ¿Estás seguro de que deseas enviar la encuesta? Una vez enviada, no podrás
          modificar tus respuestas.
        </p>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Has respondido <strong>{respuestas.size}</strong> de{' '}
            <strong>{encuesta.data.preguntas.length}</strong> preguntas.
          </p>
        </div>
      </Modal>
    </Layout>
  );
}
