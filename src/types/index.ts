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
    total_encuestas: number,
    en_progreso: number,
    pendientes: number,
    enviadas: number,
    encuestas_completadas: number
    progreso: EncuestaProgreso[];
  }
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
