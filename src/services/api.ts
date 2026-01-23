import { api } from '../lib/axios';
import type { AuthResponse, Encuesta, EncuestaRespuesta, ProgresoEmpleado } from '../types';

export const authService = {
  validarEmpleado: async (numeroEmpleado: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/validar-empleado', {
      numeroEmpleado,
    });
    return response.data;
  },
};

export const encuestaService = {
  obtenerEncuesta: async (id: string): Promise<Encuesta> => {
    const response = await api.get<Encuesta>(`/encuestas/${id}`);
    return response.data;
  },

  enviarRespuestas: async (id: string, respuestas: EncuestaRespuesta): Promise<void> => {
    await api.post(`/encuestas/${id}/enviar`, respuestas);
  },
};

export const empleadoService = {
  obtenerProgreso: async (): Promise<ProgresoEmpleado> => {
    const response = await api.get<ProgresoEmpleado>('/empleado/progreso');
    return response.data;
  },
};
