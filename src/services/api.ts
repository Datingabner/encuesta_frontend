import { api } from '../lib/axios';
import { adminApi } from '../lib/adminAxios';
import type { AuthResponse, Encuesta, DataProgresoEmpleado, EnviarEncuestaRequest, AdminResponse, EmpleadoCRUD, EmpleadoCreateResponse, EmpleadoUpdateResponse, EmpleadoDeleteResponse, CreateEmpleadoRequest, UpdateEmpleadoRequest } from '../types';


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
  obtenerEmpleados: async (params?: { activo?: boolean; departamento?: number }): Promise<EmpleadoCRUD[]> => {
    const response = await adminApi.get<EmpleadoCRUD[]>('/empleados/', { params });
    console.log("Retornas esto: ", response.data)
    return response.data;
  },

  // Obtener empleado por ID
  obtenerEmpleado: async (id: number): Promise<EmpleadoCRUD> => {
    const response = await adminApi.get<EmpleadoCRUD>(`/empleados/${id}/`);
    return response.data;
  },

  // Crear nuevo empleado
  crearEmpleado: async (data: CreateEmpleadoRequest): Promise<EmpleadoCreateResponse> => {
    const response = await adminApi.post<EmpleadoCreateResponse>('/empleados/', data);
    return response.data;
  },

  // Actualizar empleado completo (PUT)
  actualizarEmpleado: async (id: number, data: UpdateEmpleadoRequest): Promise<EmpleadoUpdateResponse> => {
    const response = await adminApi.put<EmpleadoUpdateResponse>(`/empleados/${id}/`, data);
    return response.data;
  },

  // Actualizar empleado parcialmente (PATCH)
  actualizarParcialEmpleado: async (id: number, data: UpdateEmpleadoRequest): Promise<EmpleadoUpdateResponse> => {
    const response = await adminApi.patch<EmpleadoUpdateResponse>(`/empleados/${id}/`, data);
    return response.data;
  },

  // Eliminar empleado (soft delete)
  eliminarEmpleado: async (id: number): Promise<EmpleadoDeleteResponse> => {
    const response = await adminApi.delete<EmpleadoDeleteResponse>(`/empleados/${id}/`);
    return response.data;
  },
};