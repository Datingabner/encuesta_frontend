import { api } from '../lib/axios';
import type { AuthResponse, Encuesta, DataProgresoEmpleado, EnviarEncuestaRequest, AdminResponse } from '../types';


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

  enviarRespuestas: async ( id: number, requestData: EnviarEncuestaRequest): Promise<any> => {
    await api.post(`/encuestas/${id}/submit`, requestData);
  },
};

export const empleadoService = {
  obtenerProgreso: async (): Promise<DataProgresoEmpleado> => {
    const response = await api.get<DataProgresoEmpleado>('/empleado/progress');
    return response.data;
  },
};


// Añadir a src/services/api.ts
export const adminService = {
  obtenerResultados: async (apiKey: string): Promise<AdminResponse> => {
    const { data } = await api.get<AdminResponse>('/admin/results', {
      headers: { 'x-api-key': apiKey }
    });
    return data;
  }
};