import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import GameList from './components/GameList'
import GameForm from './components/GameForm'
import ProgressBar from './components/ProgressBar'

function App() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGames()
  }, [])

  const loadGames = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error loading games:', error)
    } else {
      setGames(data || [])
    }
    setLoading(false)
  }

  const addGame = async (game) => {
    const newGame = { 
      name: game.name, 
      platform: game.platform, 
      image: game.image || null,
      completed: false 
    }
    
    console.log('Agregando juego:', newGame)
    
    const { data, error } = await supabase
      .from('games')
      .insert([newGame])
      .select()
    
    if (error) {
      console.error('Error adding game:', error)
      alert(`Error al agregar el juego: ${error.message}\n\nAsegúrate de haber ejecutado el script SQL en Supabase para agregar la columna 'image'.`)
    } else if (data && data.length > 0) {
      console.log('Juego agregado exitosamente:', data[0])
      setGames([data[0], ...games])
    }
  }

  const toggleComplete = async (id) => {
    const game = games.find(g => g.id === id)
    
    const { error } = await supabase
      .from('games')
      .update({ completed: !game.completed })
      .eq('id', id)
    
    if (error) {
      console.error('Error updating game:', error)
    } else {
      setGames(games.map(g => 
        g.id === id ? { ...g, completed: !g.completed } : g
      ))
    }
  }

  const deleteGame = async (id) => {
    const { error } = await supabase
      .from('games')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting game:', error)
    } else {
      setGames(games.filter(g => g.id !== id))
    }
  }

  const completedCount = games.filter(g => g.completed).length

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">🎮 Backlog 2026</h1>
          <p className="text-slate-400 mb-4">
            {completedCount} / {games.length} completados
          </p>
          {games.length > 0 && (
            <ProgressBar completed={completedCount} total={games.length} />
          )}
        </header>
        
        <GameForm onAdd={addGame} />
        <GameList 
          games={games} 
          onToggle={toggleComplete} 
          onDelete={deleteGame} 
        />
      </div>
    </div>
  )
}

export default App

