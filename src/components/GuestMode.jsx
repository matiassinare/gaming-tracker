export default function GuestMode({ onCreateAccount, onSignIn, gameCount }) {
  return (
    <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
      <div className="flex items-start gap-2 sm:gap-3">
        <span className="text-xl sm:text-2xl flex-shrink-0">💡</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold mb-1 text-sm sm:text-base">Estás usando la app en modo invitado</h3>
          <p className="text-xs sm:text-sm text-slate-300 mb-3">
            Tus {gameCount} juego{gameCount !== 1 ? 's' : ''} están guardados localmente. 
            Creá una cuenta gratis para sincronizarlos en la nube y acceder desde cualquier dispositivo.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={onCreateAccount}
              className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition text-xs sm:text-sm"
            >
              Crear cuenta gratis
            </button>
            <button
              onClick={onSignIn}
              className="px-3 sm:px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded transition text-xs sm:text-sm"
            >
              Ya tengo cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

