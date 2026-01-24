import { api } from '../lib/axios';
import type { AuthResponse, Encuesta, EncuestaRespuesta, DataProgresoEmpleado } from '../types';


export const authService = {
  validarEmpleado: async (numeroEmpleado: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/validar-empleado', {
      numero_empleado: numeroEmpleado,
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
  obtenerProgreso: async (): Promise<DataProgresoEmpleado> => {
    const response = await api.get<DataProgresoEmpleado>('/empleado/progress');
    return response.data;
  },
};
