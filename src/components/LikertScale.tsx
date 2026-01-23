interface LikertScaleProps {
  value: number | null;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const opciones = [
  { valor: 0, etiqueta: 'Nunca', emoji: '😊' },
  { valor: 1, etiqueta: 'Casi nunca', emoji: '🙂' },
  { valor: 2, etiqueta: 'Algunas veces', emoji: '😐' },
  { valor: 3, etiqueta: 'Siempre', emoji: '😟' },
];

export function LikertScale({ value, onChange, disabled = false }: LikertScaleProps) {
  return (
    <div className="space-y-3">
      {opciones.map((opcion) => (
        <button
          key={opcion.valor}
          type="button"
          onClick={() => onChange(opcion.valor)}
          disabled={disabled}
          className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
            value === opcion.valor
              ? 'border-blue-600 bg-blue-50 shadow-md'
              : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-gray-50'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{opcion.emoji}</span>
              <span className="font-medium text-gray-900">{opcion.etiqueta}</span>
            </div>
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                value === opcion.valor
                  ? 'border-blue-600 bg-blue-600'
                  : 'border-gray-300 bg-white'
              }`}
            >
              {value === opcion.valor && (
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
