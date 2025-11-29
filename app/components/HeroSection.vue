<template>
  <section
    v-if="movie"
    class="relative h-[85vh] flex items-end text-white bg-black overflow-hidden"
  >
  
    <img
      :src="`https://image.tmdb.org/t/p/original${movie.backdrop_path}`"
      :alt="movie.title"
      class="absolute inset-0 object-cover w-full h-full opacity-60"
    />

    
    <div
      class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"
    ></div>

    
    <div class="relative z-10 max-w-2xl p-10">
      <h1 class="mb-4 text-4xl font-extrabold text-red-600">{{ movie.title }}</h1>
      <p class="mb-6 text-lg text-gray-200 line-clamp-3">
        {{ movie.overview }}
      </p>

      <div class="flex gap-4">
       
        <button
          @click.stop="goToMovie(movie.id)"
          class="flex items-center gap-2 px-6 py-3 font-semibold text-black transition bg-white rounded-md hover:bg-gray-200"
        >
          <i class="fas fa-play"></i> Play
        </button>
        <button
          class="flex items-center gap-2 px-6 py-3 font-semibold transition rounded-md bg-gray-600/70 hover:bg-gray-700"
        >
          <i class="fas fa-info-circle"></i> More Info
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const movie = ref(null);

onMounted(async () => {
  const config = useRuntimeConfig();
  const apiKey = config.public.TMDB_API_KEY;

  try {
    const res = await axios.get(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`
    );

    // نختار فيلم عشوائي
    const results = res.data.results;
    movie.value = results[Math.floor(Math.random() * results.length)];
  } catch (error) {
    console.error("Error fetching hero movie:", error);
  }
});

const goToMovie = (id) => {
  navigateTo(`/movie/${id}`);
};
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
