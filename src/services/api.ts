import { api } from '../lib/axios';
import { adminApi } from '../lib/adminAxios';
import type { AuthResponse, Encuesta, DataProgresoEmpleado, EnviarEncuestaRequest, AdminResponse, EmpleadosResponse, EmpleadoResponse, CreateEmpleadoRequest, UpdateEmpleadoRequest } from '../types';


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
  // Validar API Key contra el backend
  validarApiKey: async (apiKey: string): Promise<{ valid: boolean; message?: string }> => {
    try {
      const response = await api.post('rh/validate-key', { apiKey });
      return response.data;
    } catch (error: any) {
      return { 
        valid: false, 
        message: error.response?.data?.message || 'Error al validar credentials' 
      };
    }
  },
  obtenerResultados: async (apiKey: string): Promise<AdminResponse> => {
    const { data } = await api.get<AdminResponse>('/rh/results', {
      headers: { 'x-api-key': apiKey }
    });
    return data;
  }
};

// === SERVICIOS CRUD DE EMPLEADOS ===

export const empleadoAdminService = {
  // Obtener todos los empleados (con filtros opcionales)
  obtenerEmpleados: async (params?: { activo?: boolean; departamento?: string }): Promise<EmpleadosResponse[]> => {
    const response = await adminApi.get<EmpleadosResponse[]>('/rh/empleados/', { params });
    console.log("Retornas esto: ", response.data)
    return response.data;
  },

  // Obtener empleado por ID
  obtenerEmpleado: async (id: number): Promise<EmpleadoResponse> => {
    const response = await adminApi.get<EmpleadoResponse>(`/rh/empleados/${id}`);
    return response.data;
  },

  // Crear nuevo empleado
  crearEmpleado: async (data: CreateEmpleadoRequest): Promise<EmpleadoResponse> => {
    const response = await adminApi.post<EmpleadoResponse>('/rh/empleados/', data);
    return response.data;
  },

  // Actualizar empleado completo (PUT)
  actualizarEmpleado: async (id: number, data: UpdateEmpleadoRequest): Promise<EmpleadoResponse> => {
    const response = await adminApi.put<EmpleadoResponse>(`/rh/empleados/${id}`, data);
    return response.data;
  },

  // Actualizar empleado parcialmente (PATCH)
  actualizarParcialEmpleado: async (id: number, data: UpdateEmpleadoRequest): Promise<EmpleadoResponse> => {
    const response = await adminApi.patch<EmpleadoResponse>(`/rh/empleados/${id}`, data);
    return response.data;
  },

  // Eliminar empleado (soft delete)
  eliminarEmpleado: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await adminApi.delete<{ success: boolean; message: string }>(`/rh/empleados/${id}`);
    return response.data;
  },
};