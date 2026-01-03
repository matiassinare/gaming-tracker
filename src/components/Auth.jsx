import { useState } from 'react'
import { supabase } from '../supabase'

export default function Auth({ onAuthSuccess, initialMode = 'signin' }) {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup')
  const [message, setMessage] = useState('')

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        setMessage('¡Cuenta creada! Revisá tu email para confirmar.')
        // Si hay callback, ejecutarlo después de crear cuenta
        if (onAuthSuccess) {
          setTimeout(() => {
            onAuthSuccess()
          }, 1000)
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        // Si hay callback, ejecutarlo después de iniciar sesión
        if (onAuthSuccess) {
          onAuthSuccess()
        }
      }
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center px-4">
      <div className="bg-slate-800 p-8 rounded-lg shadow-xl max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">🎮 Backlog 2026</h1>
          <p className="text-slate-400">
            {isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-slate-700 rounded border border-slate-600 focus:border-blue-500 outline-none text-white placeholder-slate-400"
          />
          <input
            type="password"
            placeholder="Contraseña (mínimo 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 bg-slate-700 rounded border border-slate-600 focus:border-blue-500 outline-none text-white placeholder-slate-400"
          />

          {message && (
            <div className={`text-sm p-3 rounded ${message.includes('creada') ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded font-semibold transition"
          >
            {loading ? 'Cargando...' : (isSignUp ? 'Crear cuenta' : 'Iniciar sesión')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp)
              setMessage('')
            }}
            className="text-blue-400 hover:text-blue-300"
          >
            {isSignUp ? '¿Ya tenés cuenta? Iniciá sesión' : '¿No tenés cuenta? Registrate'}
          </button>
        </div>
      </div>
    </div>
  )
}

