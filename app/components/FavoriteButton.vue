<template>
  <button
    @click.stop="toggleFav"
    class="p-2 transition rounded-full"
    :class="isFav ? 'bg-red-600 text-white' : 'bg-white/20 text-white hover:bg-white/30'"
  >
    <i :class="isFav ? 'fas fa-heart' : 'far fa-heart'"></i>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useFavoritesStore } from '@/stores/favoritesStore'

const props = defineProps({
  movie: { type: Object, required: true }
})

const favStore = useFavoritesStore()

const isFav = computed(() => favStore.isFavorite(props.movie.id))

const toggleFav = () => {
  // إنشاء كائن موحد لكل الأفلام
  const movieToStore = {
    id: props.movie.id,
    title: props.movie.title,
    poster: props.movie.poster || (props.movie.poster_path ? `https://image.tmdb.org/t/p/w500${props.movie.poster_path}` : ''),
    rating: props.movie.rating || props.movie.vote_average,
    overview: props.movie.overview
  }

  favStore.toggle(movieToStore)
}
</script>
