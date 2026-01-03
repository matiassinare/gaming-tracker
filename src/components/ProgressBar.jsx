export default function ProgressBar({ completed, total }) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
  
  // Determinar el color según el progreso
  const getProgressColor = () => {
    if (percentage === 0) return 'bg-slate-500'
    if (percentage < 25) return 'bg-gradient-to-r from-red-500 to-orange-500'
    if (percentage < 50) return 'bg-gradient-to-r from-orange-500 to-yellow-500'
    if (percentage < 75) return 'bg-gradient-to-r from-yellow-500 to-green-500'
    return 'bg-gradient-to-r from-green-500 to-emerald-600'
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-slate-300">Progreso del Backlog</span>
        <span className={`text-sm font-bold ${
          percentage >= 75 ? 'text-green-400' : 
          percentage >= 50 ? 'text-yellow-400' : 
          percentage >= 25 ? 'text-orange-400' : 
          'text-red-400'
        }`}>
          {percentage}%
        </span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden shadow-inner">
        <div
          className={`h-full ${getProgressColor()} transition-all duration-500 ease-out rounded-full flex items-center justify-center`}
          style={{ width: `${percentage}%` }}
        >
          {percentage > 10 && (
            <span className="text-xs font-semibold text-white drop-shadow-md">{percentage}%</span>
          )}
        </div>
      </div>
      <div className="flex justify-between mt-2 text-xs text-slate-400">
        <span>{completed} completados</span>
        <span>{total - completed} pendientes</span>
      </div>
    </div>
  )
}

