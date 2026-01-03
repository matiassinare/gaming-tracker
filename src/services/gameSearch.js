const RAWG_KEY = import.meta.env.VITE_RAWG_API_KEY
const STEAMGRIDDB_KEY = import.meta.env.VITE_STEAMGRIDDB_API_KEY
const RAWG_URL = 'https://api.rawg.io/api'
const STEAMGRIDDB_URL = 'https://www.steamgriddb.com/api/v2'

async function getHighQualityImage(gameName) {
  if (!STEAMGRIDDB_KEY) return null
  
  try {
    const searchRes = await fetch(
      `${STEAMGRIDDB_URL}/search/autocomplete/${encodeURIComponent(gameName)}`,
      { headers: { 'Authorization': `Bearer ${STEAMGRIDDB_KEY}` } }
    )
    const searchData = await searchRes.json()
    
    if (!searchData.data || searchData.data.length === 0) return null
    
    const gameId = searchData.data[0].id
    
    const gridRes = await fetch(
      `${STEAMGRIDDB_URL}/grids/game/${gameId}?dimensions=600x900`,
      { headers: { 'Authorization': `Bearer ${STEAMGRIDDB_KEY}` } }
    )
    const gridData = await gridRes.json()
    
    return gridData.data?.[0]?.url || null
  } catch (error) {
    console.error('SteamGridDB error:', error)
    return null
  }
}

export async function searchGames(query) {
  if (!query.trim()) return []
  
  try {
    const response = await fetch(
      `${RAWG_URL}/games?key=${RAWG_KEY}&search=${encodeURIComponent(query)}&page_size=5`
    )
    
    const data = await response.json()
    
    const gamesWithImages = await Promise.all(
      data.results.map(async (game) => {
        const hdImage = await getHighQualityImage(game.name)
        
        return {
          id: game.id,
          name: game.name,
          image: hdImage || game.background_image,
          platforms: game.platforms?.map(p => p.platform.name) || []
        }
      })
    )
    
    return gamesWithImages
  } catch (error) {
    console.error('Error searching games:', error)
    return []
  }
}
