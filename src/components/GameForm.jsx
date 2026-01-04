import { useState, useEffect } from 'react'
import { searchGames } from '../services/gameSearch'

export default function GameForm({ onAdd }) {
  const [name, setName] = useState('')
  const [platform, setPlatform] = useState('Steam')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [manualMode, setManualMode] = useState(false)
  const [manualImageUrl, setManualImageUrl] = useState('')

  useEffect(() => {
    if (manualMode) return
    
    const timer = setTimeout(async () => {
      if (name.length >= 2) {
        setLoading(true)
        const results = await searchGames(name)
        setSuggestions(results)
        setShowSuggestions(true)
        setLoading(false)
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }, 150)

    return () => clearTimeout(timer)
  }, [name, manualMode])

  const handleSelectGame = (game) => {
    setName(game.name)
    setSelectedImage(game.image)
    setShowSuggestions(false)
    
    const platformMap = {
      'PC': 'Steam',
      'PlayStation 5': 'PlayStation',
      'PlayStation 4': 'PlayStation',
      'Xbox Series S/X': 'Xbox',
      'Xbox One': 'Xbox',
      'Nintendo Switch': 'Switch'
    }
    
    for (const p of game.platforms) {
      if (platformMap[p]) {
        setPlatform(platformMap[p])
        break
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    
    const image = manualMode ? (manualImageUrl || null) : selectedImage
    onAdd({ name, platform, image })
    
    setName('')
    setSelectedImage(null)
    setManualImageUrl('')
    setSuggestions([])
    setManualMode(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 p-4 sm:p-6 rounded-lg mb-4 sm:mb-6 shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4">
        <h3 className="text-base sm:text-lg font-semibold">Agregar nuevo juego</h3>
        <button
          type="button"
          onClick={() => setManualMode(!manualMode)}
          className="text-xs sm:text-sm text-blue-400 hover:text-blue-300 whitespace-nowrap"
        >
          {manualMode ? '🔍 Buscar en RAWG' : '✏️ Agregar manualmente'}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 relative">
        <div className="flex-1 relative">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => !manualMode && suggestions.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={manualMode ? "Nombre del juego..." : "Buscar juego..."}
            className="w-full px-3 sm:px-4 py-2 bg-slate-700 rounded border border-slate-600 focus:border-blue-500 outline-none text-white placeholder-slate-400 text-sm sm:text-base"
          />
          
          {!manualMode && showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg shadow-xl max-h-60 sm:max-h-80 overflow-y-auto">
              {loading && (
                <div className="p-3 sm:p-4 text-center text-slate-400 text-sm">Buscando...</div>
              )}
              {suggestions.map((game) => (
                <button
                  key={game.id}
                  type="button"
                  onClick={() => handleSelectGame(game)}
                  className="w-full p-2 sm:p-3 flex items-center gap-2 sm:gap-3 hover:bg-slate-600 transition text-left"
                >
                  {game.image && (
                    <img 
                      src={game.image} 
                      alt={game.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white text-sm sm:text-base truncate">{game.name}</div>
                    <div className="text-xs text-slate-400 truncate">
                      {game.platforms.slice(0, 3).join(', ')}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {manualMode && (
          <input
            type="text"
            value={manualImageUrl}
            onChange={(e) => setManualImageUrl(e.target.value)}
            placeholder="URL de imagen (opcional)"
            className="w-full sm:flex-1 px-3 sm:px-4 py-2 bg-slate-700 rounded border border-slate-600 focus:border-blue-500 outline-none text-white placeholder-slate-400 text-sm"
          />
        )}
        
        <select 
          value={platform} 
          onChange={(e) => setPlatform(e.target.value)}
          className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-slate-700 rounded border border-slate-600 outline-none text-white text-sm sm:text-base"
        >
          <option>Steam</option>
          <option>Epic</option>
          <option>GOG</option>
          <option>Xbox</option>
          <option>PlayStation</option>
          <option>Switch</option>
        </select>
        
        <button 
          type="submit"
          className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition text-sm sm:text-base"
        >
          Agregar
        </button>
      </div>
    </form>
  )
}
