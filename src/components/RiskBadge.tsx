import { AlertCircle } from 'lucide-react';

interface RiskBadgeProps {
  nivel: 'bajo' | 'medio' | 'alto' | 'desconocido';
}

export function RiskBadge({ nivel }: RiskBadgeProps) {
  const styles = {
    bajo: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-300',
    },
    medio: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-300',
    },
    alto: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-300',
    },
    desconocido: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      border: 'border-gray-300',
    },
  };

  const style = styles[nivel];
  const labels = {
    bajo: 'Bajo',
    medio: 'Medio',
    alto: 'Alto',
    desconocido: 'Desconocido',
  };

  return (
    <div
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold border ${style.bg} ${style.text} ${style.border}`}
    >
      {nivel === 'alto' && <AlertCircle className="w-4 h-4" />}
      {labels[nivel]}
    </div>
  );
}
