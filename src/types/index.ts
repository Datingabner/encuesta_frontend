export interface Empleado {
  id: string;
  numeroEmpleado: string;
  nombre: string;
  departamento: string;
}

export interface AuthResponse {
  token: string;
  empleado: Empleado;
}

export interface Pregunta {
  id: string;
  texto: string;
  orden: number;
}

export interface Encuesta {
  id: string;
  titulo: string;
  descripcion: string;
  preguntas: Pregunta[];
  estado?: 'pendiente' | 'en_progreso' | 'completada';
  progreso?: number;
}

export interface Respuesta {
  preguntaId: string;
  valor: number;
}

export interface EncuestaRespuesta {
  respuestas: Respuesta[];
}

export interface EncuestaProgreso {
  id: string;
  titulo: string;
  estado: 'pendiente' | 'en_progreso' | 'completada';
  fechaInicio?: string;
  fechaCompletado?: string;
  progreso: number;
}

export interface ProgresoEmpleado {
  encuestas: EncuestaProgreso[];
  totalCompletadas: number;
  totalPendientes: number;
}
