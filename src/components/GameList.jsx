export default function GameList({ games, onUpdateStatus, onDelete }) {
  const pending = games.filter(g => g.status === 'pending')
  const playing = games.filter(g => g.status === 'playing')
  const completed = games.filter(g => g.status === 'completed')

  if (games.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <p className="text-xl">No hay juegos en el backlog</p>
        <p className="text-sm mt-2">Agregá tu primer juego arriba</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {pending.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Por jugar ({pending.length})</h2>
          <div className="space-y-2">
            {pending.map(game => (
              <GameCard key={game.id} game={game} onUpdateStatus={onUpdateStatus} onDelete={onDelete} />
            ))}
          </div>
        </section>
      )}

      {playing.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Jugando ({playing.length}) 🎮</h2>
          <div className="space-y-2">
            {playing.map(game => (
              <GameCard key={game.id} game={game} onUpdateStatus={onUpdateStatus} onDelete={onDelete} />
            ))}
          </div>
        </section>
      )}

      {completed.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Completados ({completed.length}) ✓</h2>
          <div className="space-y-2 opacity-60">
            {completed.map(game => (
              <GameCard key={game.id} game={game} onUpdateStatus={onUpdateStatus} onDelete={onDelete} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function GameCard({ game, onUpdateStatus, onDelete }) {
  const getNextStatus = () => {
    if (game.status === 'pending') return 'playing'
    if (game.status === 'playing') return 'completed'
    return 'pending'
  }

  const getStatusLabel = () => {
    if (game.status === 'pending') return 'Por jugar'
    if (game.status === 'playing') return 'Jugando'
    return 'Completado'
  }

  const getStatusIcon = () => {
    if (game.status === 'pending') return '○'
    if (game.status === 'playing') return '▶'
    return '✓'
  }

  return (
    <div className="bg-slate-800 p-4 rounded-lg flex items-center gap-4 hover:bg-slate-750 transition group">
      {game.image ? (
        <div className="w-52 h-28 rounded-lg overflow-hidden flex-shrink-0 shadow-lg bg-slate-700 relative">
          <img 
            src={game.image} 
            alt={game.name}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="w-52 h-28 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
          <span className="text-4xl">🎮</span>
        </div>
      )}
      
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={() => onUpdateStatus(game.id, getNextStatus())}
          className="w-10 h-10 flex items-center justify-center rounded border-2 border-slate-600 hover:border-blue-500 transition flex-shrink-0 text-lg"
          title={`Cambiar a: ${getNextStatus() === 'playing' ? 'Jugando' : getNextStatus() === 'completed' ? 'Completado' : 'Por jugar'}`}
        >
          {getStatusIcon()}
        </button>
        
        <div className="flex-1">
          <h3 className={`font-semibold text-lg ${game.status === 'completed' ? 'line-through opacity-60' : ''}`}>
            {game.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">{game.platform}</span>
            <span className="text-xs text-slate-500">• {getStatusLabel()}</span>
          </div>
        </div>
      </div>
      
      <button
        onClick={() => onDelete(game.id)}
        className="text-red-400 hover:text-red-300 px-3 py-1 opacity-0 group-hover:opacity-100 transition flex-shrink-0"
      >
        ✕
      </button>
    </div>
  )
}

