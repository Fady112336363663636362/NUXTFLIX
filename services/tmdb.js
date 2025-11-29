import axios from 'axios'

const API_BASE = 'https://api.themoviedb.org/3'
const API_KEY = useRuntimeConfig().public.TMDB_API_KEY

export const getTrendingMovies = async () => {
  try {
    const response = await axios.get(`${API_BASE}/trending/movie/week?api_key=${API_KEY}`)
    return response.data.results
  } catch (error) {
    console.error('Error fetching movies:', error)
    return []
  }
}
