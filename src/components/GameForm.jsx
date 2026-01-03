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
    <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-lg mb-6 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Agregar nuevo juego</h3>
        <button
          type="button"
          onClick={() => setManualMode(!manualMode)}
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          {manualMode ? '🔍 Buscar en RAWG' : '✏️ Agregar manualmente'}
        </button>
      </div>

      <div className="flex gap-4 flex-wrap relative">
        <div className="flex-1 min-w-[200px] relative">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => !manualMode && suggestions.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={manualMode ? "Nombre del juego..." : "Buscar juego..."}
            className="w-full px-4 py-2 bg-slate-700 rounded border border-slate-600 focus:border-blue-500 outline-none text-white placeholder-slate-400"
          />
          
          {!manualMode && showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg shadow-xl max-h-80 overflow-y-auto">
              {loading && (
                <div className="p-4 text-center text-slate-400">Buscando...</div>
              )}
              {suggestions.map((game) => (
                <button
                  key={game.id}
                  type="button"
                  onClick={() => handleSelectGame(game)}
                  className="w-full p-3 flex items-center gap-3 hover:bg-slate-600 transition text-left"
                >
                  {game.image && (
                    <img 
                      src={game.image} 
                      alt={game.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-semibold text-white">{game.name}</div>
                    <div className="text-xs text-slate-400">
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
            className="flex-1 min-w-[200px] px-4 py-2 bg-slate-700 rounded border border-slate-600 focus:border-blue-500 outline-none text-white placeholder-slate-400 text-sm"
          />
        )}
        
        <select 
          value={platform} 
          onChange={(e) => setPlatform(e.target.value)}
          className="px-4 py-2 bg-slate-700 rounded border border-slate-600 outline-none text-white"
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
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition"
        >
          Agregar
        </button>
      </div>
    </form>
  )
}
