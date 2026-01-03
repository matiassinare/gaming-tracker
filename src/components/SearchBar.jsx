import { useState } from 'react'

export default function SearchBar({ onSearch, searching }) {
  const [searchTerm, setSearchTerm] = useState('')

  const handleChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch(value)
  }

  const handleClear = () => {
    setSearchTerm('')
    onSearch('')
  }

  return (
    <div className="relative mb-6">
      <h3 className="text-sm font-semibold text-slate-300 mb-3">Buscar en tu backlog</h3>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder="🔍 Buscar en tu backlog..."
          className="w-full px-4 py-3 pl-12 bg-slate-700 rounded-lg border border-slate-600 focus:border-blue-500 outline-none text-white placeholder-slate-400"
          disabled={searching}
        />
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
          🔍
        </span>
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition"
            type="button"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

