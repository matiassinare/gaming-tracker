import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import GameList from './components/GameList'
import GameForm from './components/GameForm'
import ProgressBar from './components/ProgressBar'
import Auth from './components/Auth'
import Footer from './components/Footer'
import GuestMode from './components/GuestMode'

const STORAGE_KEY = 'gamingTracker_games'

function App() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState('signin')

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
      // Cargar juegos y verificar si hay que migrar
      const localGames = localStorage.getItem(STORAGE_KEY)
      loadGames(!!localGames) // Pasar true si hay juegos locales para migrar
    } else {
      // Cargar juegos de LocalStorage cuando no hay usuario
      loadGamesFromLocalStorage()
    }
  }, [user])

  const loadGamesFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsedGames = JSON.parse(stored)
        setGames(parsedGames)
      } else {
        setGames([])
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error)
      setGames([])
    }
    setLoading(false)
  }

  const saveGamesToLocalStorage = (gamesToSave) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gamesToSave))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  const loadGames = async (shouldMigrate = false) => {
    setLoading(true)
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error loading games:', error)
      setLoading(false)
      return
    }
    
    const supabaseGames = data || []
    
    // Si hay juegos en LocalStorage y se debe migrar, hacerlo
    if (shouldMigrate) {
      const localGames = localStorage.getItem(STORAGE_KEY)
      if (localGames) {
        try {
          const parsedLocalGames = JSON.parse(localGames)
          // Migrar solo si hay juegos locales
          if (parsedLocalGames.length > 0) {
            await migrateGamesToSupabase(parsedLocalGames)
            // Recargar después de migrar
            const { data: newData } = await supabase
              .from('games')
              .select('*')
              .order('created_at', { ascending: false })
            setGames(newData || [])
            setLoading(false)
            return
          }
        } catch (error) {
          console.error('Error parsing local games:', error)
        }
      }
    }
    
    setGames(supabaseGames)
    setLoading(false)
  }

  const addGame = async (game) => {
    // Verificar límite de 100 juegos
    if (games.length >= 100) {
      alert('Llegaste al límite de 100 juegos en tu backlog. Eliminá algunos juegos completados para agregar más.')
      return
    }

    if (user) {
      // Usuario autenticado: guardar en Supabase
      const newGame = { 
        name: game.name, 
        platform: game.platform, 
        image: game.image || null,
        status: 'pending',
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
    } else {
      // Modo invitado: guardar en LocalStorage
      const newGame = {
        id: Date.now().toString(), // ID temporal
        name: game.name,
        platform: game.platform,
        image: game.image || null,
        status: 'pending',
        created_at: new Date().toISOString()
      }
      const updatedGames = [newGame, ...games]
      setGames(updatedGames)
      saveGamesToLocalStorage(updatedGames)
    }
  }

  const updateStatus = async (id, newStatus) => {
    if (user) {
      // Usuario autenticado: actualizar en Supabase
      const { error } = await supabase
        .from('games')
        .update({ status: newStatus })
        .eq('id', id)
      
      if (error) {
        console.error('Error updating game:', error)
      } else {
        setGames(games.map(g => 
          g.id === id ? { ...g, status: newStatus } : g
        ))
      }
    } else {
      // Modo invitado: actualizar en LocalStorage
      const updatedGames = games.map(g => 
        g.id === id ? { ...g, status: newStatus } : g
      )
      setGames(updatedGames)
      saveGamesToLocalStorage(updatedGames)
    }
  }

  const deleteGame = async (id) => {
    if (user) {
      // Usuario autenticado: eliminar de Supabase
      const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('Error deleting game:', error)
      } else {
        setGames(games.filter(g => g.id !== id))
      }
    } else {
      // Modo invitado: eliminar de LocalStorage
      const updatedGames = games.filter(g => g.id !== id)
      setGames(updatedGames)
      saveGamesToLocalStorage(updatedGames)
    }
  }

  const editGame = async (id, updates) => {
    if (user) {
      // Usuario autenticado: actualizar en Supabase
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
    } else {
      // Modo invitado: actualizar en LocalStorage
      const updatedGames = games.map(g => 
        g.id === id ? { ...g, ...updates } : g
      )
      setGames(updatedGames)
      saveGamesToLocalStorage(updatedGames)
    }
  }

  const migrateGamesToSupabase = async (localGames) => {
    if (!user || !localGames || localGames.length === 0) return

    try {
      // Preparar juegos para migración (sin id temporal)
      const gamesToMigrate = localGames.map(({ id, ...game }) => ({
        ...game,
        user_id: user.id
      }))

      const { data, error } = await supabase
        .from('games')
        .insert(gamesToMigrate)
        .select()

      if (error) {
        console.error('Error migrating games:', error)
        alert('Error al migrar juegos. Intentá de nuevo.')
      } else {
        // Limpiar LocalStorage después de migración exitosa
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch (error) {
      console.error('Error migrating games:', error)
      alert('Error al migrar juegos. Intentá de nuevo.')
    }
  }

  const handleAuthSuccess = async () => {
    // Cerrar el modal de Auth
    setShowAuth(false)
    
    // El useEffect detectará el cambio de usuario y cargará/migrará automáticamente
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  if (loading && !user && !localStorage.getItem(STORAGE_KEY)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    )
  }

  if (showAuth) {
    return <Auth onAuthSuccess={handleAuthSuccess} initialMode={authMode} />
  }

  const completedCount = games.filter(g => g.status === 'completed').length

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
            {user ? (
              <>
                <div className="text-sm text-slate-400">{user.email}</div>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-slate-400 hover:text-white transition"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <div className="text-sm text-slate-400">Modo invitado</div>
                <button
                  onClick={() => {
                    setAuthMode('signin')
                    setShowAuth(true)
                  }}
                  className="text-sm text-slate-400 hover:text-white transition"
                >
                  Iniciar sesión
                </button>
              </>
            )}
          </div>
          <h1 className="text-4xl font-bold mb-2">🎮 Backlog 2026</h1>
          <p className="text-slate-400 mb-4">
            {completedCount} / {games.length} completados
          </p>
          {games.length > 0 && (
            <ProgressBar completed={completedCount} total={games.length} />
          )}
          {games.length >= 80 && (
            <p className="text-yellow-400 text-sm mt-2">
              ⚠️ Límite: {games.length}/100 juegos
            </p>
          )}
        </header>

        {!user && games.length > 0 && (
          <GuestMode 
            gameCount={games.length}
            onCreateAccount={() => {
              setAuthMode('signup')
              setShowAuth(true)
            }}
            onSignIn={() => {
              setAuthMode('signin')
              setShowAuth(true)
            }}
          />
        )}
        
        <GameForm onAdd={addGame} />
        <GameList 
          games={games}
          onUpdateStatus={updateStatus} 
          onDelete={deleteGame}
          onEdit={editGame}
        />
        
        <Footer />
      </div>
    </div>
  )
}

export default App
