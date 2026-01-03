export default function GameList({ games, onToggle, onDelete }) {
  const pending = games.filter(g => !g.completed)
  const completed = games.filter(g => g.completed)

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
              <GameCard key={game.id} game={game} onToggle={onToggle} onDelete={onDelete} />
            ))}
          </div>
        </section>
      )}

      {completed.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Completados ({completed.length}) ✓</h2>
          <div className="space-y-2 opacity-60">
            {completed.map(game => (
              <GameCard key={game.id} game={game} onToggle={onToggle} onDelete={onDelete} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function GameCard({ game, onToggle, onDelete }) {
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
        <input
          type="checkbox"
          checked={game.completed}
          onChange={() => onToggle(game.id)}
          className="w-5 h-5 cursor-pointer accent-green-500 flex-shrink-0"
        />
        
        <div className="flex-1">
          <h3 className={`font-semibold text-lg ${game.completed ? 'line-through opacity-60' : ''}`}>
            {game.name}
          </h3>
          <span className="text-sm text-slate-400">{game.platform}</span>
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

