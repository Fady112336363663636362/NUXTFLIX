// stores/favoritesStore.js
import { defineStore } from 'pinia'

export const useFavoritesStore = defineStore('favoritesStore', {
  id: 'favorites',
  state: () => ({
    favorites: []
  }),
  actions: {
    add(movie) {
      if (!this.favorites.find(m => m.id === movie.id)) {
        this.favorites.push({
          id: movie.id,
          title: movie.title,
          poster: movie.poster || (movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : ''),
          rating: movie.rating || movie.vote_average,
          overview: movie.overview
        })
      }
    },
    remove(id) {
      const index = this.favorites.findIndex(m => m.id === id)
      if (index > -1) this.favorites.splice(index, 1)
    },
    toggle(movie) {
      if (this.favorites.find(m => m.id === movie.id)) {
        this.remove(movie.id)
      } else {
        this.add(movie)
      }
    },
    isFavorite(id) {
      return this.favorites.some(m => m.id === id)
    }
  },
  persist: true
})
