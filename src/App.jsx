import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import GameList from './components/GameList'
import GameForm from './components/GameForm'
import ProgressBar from './components/ProgressBar'
import Auth from './components/Auth'

function App() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (user) {
      loadGames()
    } else {
      setGames([])
    }
  }, [user])

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
      completed: false,
      user_id: user.id
    }
    
    const { data, error } = await supabase
      .from('games')
      .insert([newGame])
      .select()
    
    if (error) {
      console.error('Error adding game:', error)
    } else if (data && data.length > 0) {
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

  const editGame = async (id, updates) => {
    const { error } = await supabase
      .from('games')
      .update(updates)
      .eq('id', id)
    
    if (error) {
      console.error('Error updating game:', error)
    } else {
      setGames(games.map(g => 
        g.id === id ? { ...g, ...updates } : g
      ))
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    )
  }

  if (!user) {
    return <Auth />
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
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-slate-400">{user.email}</div>
            <button
              onClick={handleSignOut}
              className="text-sm text-slate-400 hover:text-white transition"
            >
              Cerrar sesión
            </button>
          </div>
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
          onEdit={editGame}
        />
      </div>
    </div>
  )
}

export default App
