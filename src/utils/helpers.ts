export const formatearFecha = (fecha: string): string => {
  const date = new Date(fecha);
  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getEstadoColor = (estado: 'pendiente' | 'en_progreso' | 'completada'): string => {
  const colores = {
    pendiente: 'bg-yellow-100 text-yellow-800',
    en_progreso: 'bg-blue-100 text-blue-800',
    completada: 'bg-green-100 text-green-800',
  };
  return colores[estado];
};

export const getEstadoTexto = (estado: 'pendiente' | 'en_progreso' | 'completada'): string => {
  const textos = {
    pendiente: 'Pendiente',
    en_progreso: 'En Progreso',
    completada: 'Completada',
  };
  return textos[estado];
};
