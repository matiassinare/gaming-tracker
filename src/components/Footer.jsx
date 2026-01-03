export default function Footer() {
  return (
    <footer className="mt-12 py-6 border-t border-slate-700">
      <div className="text-center text-slate-400 text-sm space-y-2">
        <p>Hecho por Matias Sinare</p>
        <div className="flex justify-center gap-4">
          <a 
            href="https://github.com/matiassinare" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            GitHub
          </a>
          <span>•</span>
          <a 
            href="https://x.com/MatiasSinare" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            Twitter/X
          </a>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Stack: React + Supabase + RAWG + SteamGridDB
        </p>
      </div>
    </footer>
  )
}

