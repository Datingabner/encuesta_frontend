interface ProgressBarProps {
  progress: number;
  className?: string;
  showPercentage?: boolean;
}

export function ProgressBar({ progress, className = '', showPercentage = true }: ProgressBarProps) {
  const percentage = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Progreso</span>
        {showPercentage && (
          <span className="text-sm font-medium text-gray-700">{percentage}%</span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-blue-600 h-full transition-all duration-500 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
}

export function CircularProgress({
  progress,
  size = 120,
  strokeWidth = 8
}: CircularProgressProps) {
  const percentage = Math.min(Math.max(progress, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-blue-600 transition-all duration-500"
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-2xl font-bold text-gray-700">
        {percentage}%
      </span>
    </div>
  );
}
