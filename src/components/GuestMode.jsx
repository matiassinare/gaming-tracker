export default function GuestMode({ onCreateAccount, onSignIn, gameCount }) {
  return (
    <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <span className="text-2xl">💡</span>
        <div className="flex-1">
          <h3 className="font-semibold mb-1">Estás usando la app en modo invitado</h3>
          <p className="text-sm text-slate-300 mb-3">
            Tus {gameCount} juego{gameCount !== 1 ? 's' : ''} están guardados localmente. 
            Creá una cuenta gratis para sincronizarlos en la nube y acceder desde cualquier dispositivo.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onCreateAccount}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition text-sm"
            >
              Crear cuenta gratis
            </button>
            <button
              onClick={onSignIn}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded transition text-sm"
            >
              Ya tengo cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

