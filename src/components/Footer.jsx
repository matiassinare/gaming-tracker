export default function Footer() {
  return (
    <footer className="mt-8 sm:mt-12 py-4 sm:py-6 border-t border-slate-700">
      <div className="text-center text-slate-400 text-xs sm:text-sm space-y-2">
        <p>Hecho por Matias Sinare</p>
        <div className="flex justify-center gap-3 sm:gap-4 flex-wrap">
          <a 
            href="https://github.com/matiassinare" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            GitHub
          </a>
          <span className="hidden sm:inline">•</span>
          <a 
            href="https://x.com/MatiasSinare" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            Twitter/X
          </a>
        </div>
        <p className="text-xs text-slate-500 mt-2 px-2">
          Stack: React + Supabase + RAWG + SteamGridDB
        </p>
      </div>
    </footer>
  )
}

