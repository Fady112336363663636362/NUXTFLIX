<template>
  <section class="relative py-10 text-white bg-black">
    <div class="flex items-center justify-between px-6 mb-4">
      <h2 class="text-2xl font-bold">
        Trending <span class="text-red-600">Movies</span>
      </h2>
      <div class="flex gap-2">
        <button
          @click="scrollLeft"
          class="p-2 rounded-full bg-white/10 hover:bg-white/20"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        <button
          @click="scrollRight"
          class="p-2 rounded-full bg-white/10 hover:bg-white/20"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>

    <div
      ref="slider"
      class="flex gap-4 px-6 pb-6 overflow-x-auto scrollbar-hide scroll-smooth"
    >
      <div
        v-for="movie in movies"
        :key="movie.id"
        :to="`/movie/${movie.id}`"
        class="group relative min-w-[180px] bg-zinc-900 rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer"
      >
        <img
          :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
          :alt="movie.title"
          class="object-cover w-full h-72"
        />

        <div
          class="absolute inset-0 flex flex-col justify-end p-4 transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-black/80"
        >
          <h3 class="mb-1 font-semibold text-md">{{ movie.title }}</h3>
          <p class="mb-1 text-sm font-bold text-yellow-400">
            ⭐ {{ movie.vote_average }}
          </p>
          <p class="mb-3 text-xs text-gray-300 line-clamp-3">
            {{ movie.overview }}
          </p>

          <div class="flex gap-3">
            <button
              @click.stop="goToMovie(movie.id)"
              class="w-full py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
            >
              <i class="fa-solid fa-play"></i> Watch Now
            </button>

            <FavoriteButton :movie="movie" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const slider = ref(null);
const movies = ref([]);

const scrollLeft = () => {
  slider.value.scrollBy({ left: -500, behavior: "smooth" });
};
const scrollRight = () => {
  slider.value.scrollBy({ left: 500, behavior: "smooth" });
};

const goToMovie = (id) => {
  navigateTo(`/movie/${id}`);
};

onMounted(async () => {
  const config = useRuntimeConfig();
  const apiKey = config.public.TMDB_API_KEY;

  const res = await axios.get(
    `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`
  );

  movies.value = res.data.results;
});
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
