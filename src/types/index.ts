export interface Empleado {
  id: string;
  numeroEmpleado: string;
  nombre: string;
  departamento: string;
}

export interface AuthResponse {
  data: { empleado: Empleado, token: string };

}

export interface Pregunta {
  id_pregunta: number;
  pregunta: string;
  estado?: 'inhabilitada' | 'activo';
  tipo?: 'likert' | 'abierta' | 'opcion_multiple';
  respuestas: string[];
  requerido: boolean;
}

export interface Encuesta {
  data: {
    id: number;
    tipo: string;
    descripcion: string;
    preguntas: Pregunta[];
  }
}

export interface Respuesta {
  preguntaId: string;
  valor: number;
}

export interface EncuestaRespuesta {
  respuestas: Respuesta[];
}

export interface EncuestaProgreso {
  id_encuesta: string;
  encuesta_nombre: string;
  encuesta_tipo: string;
  encuesta_descripcion: string;
  estado: 'pendiente' | 'en_progreso' | 'completada';
  tiene_puntaje: boolean;
  puede_tomar: boolean;
  fechaInicio?: string;
  fechaCompletado?: string;
}

export interface DataProgresoEmpleado {
  data: {
    estadisticas: {
      total_encuestas: number;
      en_progreso: number;
      pendientes: number;
      enviadas: number;
      encuestas_completadas: number;
    };
    progreso: EncuestaProgreso[];
  }
}

export interface RespuestaBackend {
  id_encuesta: string[]; // Array con el ID
  preguntas: string[];   // Array de textos de preguntas
  respuestas: string[];  // Array de respuestas como strings
}

export interface EnviarEncuestaRequest {
  responses: RespuestaBackend[];
}

export interface AdminResult {
  empleado: { id: number; nombre: string };
  encuesta: { tipo: string; descripcion: string };
  detalle_clinico: { preguntas: string[]; respuestas: string[] };
  puntaje_total: number;
  interpretacion: string;
  nivel_riesgo: 'bajo' | 'medio' | 'alto' | 'desconocido';
  fecha_completado: string;
}

export interface AdminStats {
  total_completed: number;
  average_score: number;
  distribucion_riesgo: {
    bajo: number;
    medio: number;
    alto: number;
    desconocido: number;
  };
}

export interface AdminResponse {
  success: boolean;
  data: {
    results: AdminResult[];
    statistics: AdminStats;
  };
}


export interface AdminResultado {
  empleado: {
    id: number;
    nombre: string;
  };
  encuesta: {
    tipo: string;
    descripcion: string;
  };
  detalle_clinico: {
    preguntas: string[];
    respuestas: string[];
  };
  puntaje_total: number;
  interpretacion: string;
  nivel_riesgo: 'bajo' | 'medio' | 'alto' | 'desconocido';
  fecha_completado: string;
}

export interface AdminStatistics {
  total_completed: number;
  average_score: number;
  distribucion_riesgo: {
    bajo: number;
    medio: number;
    alto: number;
    desconocido: number;
  };
}

export interface AdminResultsResponse {
  success: boolean;
  data: {
    results: AdminResultado[];
    statistics: AdminStatistics;
  };
}
/*
export interface ProgresoEmpleado {
  progreso: EncuestaProgreso[];
  estadisticas: {
    total_encuestas: number,
    en_progreso: number,
    pendientes: number,
    enviadas: number,
    encuestas_completadas: number
  };
}*/

// === TIPOS PARA CRUD DE EMPLEADOS (ADMIN) ===

export interface EmpleadoCRUD {
  id: number;
  numero_empleado: string;
  nombre_completo: string;
  email: string;
  id_departamento: number;
  activo: boolean;
}

export interface CreateEmpleadoRequest {
  numero_empleado: string;
  nombre_completo: string;
  email: string;
  id_departamento: number;
  password?: string;
  activo?: boolean;
}

export interface UpdateEmpleadoRequest {
  numero_empleado?: string;
  nombre_completo?: string;
  email?: string;
  id_departamento?: number;
  password?: string;
  activo?: boolean;
}

export interface EmpleadoCreateResponse {
  success: boolean;
  message: string;
  data: EmpleadoCRUD;
}

export interface EmpleadoUpdateResponse {
  success: boolean;
  message: string;
  data: EmpleadoCRUD;
}

export interface EmpleadoDeleteResponse {
  success: boolean;
  message: string;
}
