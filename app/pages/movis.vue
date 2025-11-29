<template>
  <section class="px-10 py-10 text-white bg-black">
    <h2 class="px-6 text-4xl font-bold text-center mt-7 mb-7">
      All <span class="text-red-600">Movies</span>
    </h2>
    <div class="flex flex-wrap items-center gap-3 mb-6">
      <button
        @click="filterByGenre(null)"
        :class="[
          'px-4 py-2 text-sm font-semibold rounded transition',
          activeGenre === null
            ? 'bg-red-600 text-white'
            : 'bg-zinc-800 hover:bg-zinc-700 text-gray-200',
        ]"
      >
        All
      </button>

      <button
        v-for="g in genres"
        :key="g.id"
        @click="filterByGenre(g.id)"
        :class="[
          'px-4 py-2 text-sm font-semibold rounded transition',
          activeGenre === g.id
            ? 'bg-red-600 text-white'
            : 'bg-zinc-800 hover:bg-zinc-700 text-gray-200',
        ]"
      >
        {{ g.name }}
      </button>
    </div>
    <div
      class="grid grid-cols-2 gap-4 transition-all duration-500 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
    >
      <div
        v-for="movie in movies"
        :key="movie.id"
        class="relative overflow-hidden rounded-lg group bg-zinc-900"
      >
        <router-link :to="`/movie/${movie.id}`" class="block">
          <img
            :src="posterUrl(movie.poster_path)"
            :alt="movie.title"
            class="object-cover w-full transition-transform duration-300 h-72 group-hover:scale-110"
          />
        </router-link>

        <div
          class="absolute inset-0 flex flex-col justify-end p-4 transition-opacity duration-300 opacity-0 bg-black/80 group-hover:opacity-100"
        >
          <h3 class="mb-1 font-semibold text-md">{{ movie.title }}</h3>
          <p class="mb-1 text-sm font-bold text-yellow-400">
            ⭐ {{ formatVote(movie.vote_average) }}
          </p>
          <p class="mb-3 text-xs text-gray-300 line-clamp-3">
            {{ shortOverview(movie.overview) }}
          </p>
          <div class="flex gap-3">
            <button
              @click.stop="goToMovie(movie.id)"
              class="w-full py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
            >
              <i class="fa-solid fa-play"></i> Watch Now
            </button>

       <FavoriteButton v-if="movie?.id" :movie="movie" />
          </div>
        </div>
      </div>
    </div>

    <!-- زرار تحميل المزيد -->
    <div class="mt-8 text-center">
      <button
        @click="loadMore"
        :disabled="isLoading || currentPage >= totalPages"
        class="px-4 py-2 text-sm font-semibold transition bg-red-600 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{
          isLoading
            ? "Loading..."
            : currentPage < totalPages
              ? "Load More"
              : "No More Movies"
        }}
      </button>
    </div>
    <Footer />
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

definePageMeta({
  middleware: "auth",
});

const router = useRouter();
const movies = ref([]);
const currentPage = ref(1);
const totalPages = ref(0);
const isLoading = ref(false);
const genres = ref([]);
const selectedGenre = ref(null);

const activeGenre = ref(null);

const activeFilter = ref(null);

const chooseFilter = (filter) => {
  activeFilter.value = filter;
};

const posterUrl = (path) =>
  path ? `https://image.tmdb.org/t/p/w500${path}` : "/placeholder-poster.png";

const formatVote = (v) => (v ? v.toFixed(1) : "N/A");

const shortOverview = (ov) => {
  if (!ov) return "No description available.";
  const limit = 120;
  return ov.length > limit ? ov.slice(0, limit).trim() + "..." : ov;
};

const goToMovie = (id) => {
  router.push(`/movie/${id}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const fetchGenres = async () => {
  try {
    const config = useRuntimeConfig();
    const apiKey = config.public.TMDB_API_KEY;

    const res = await axios.get(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`
    );

    genres.value = res.data.genres;
  } catch (err) {
    console.error("Error loading genres:", err);
  }
};


const fetchMovies = async () => {
  try {
    isLoading.value = true;
    const config = useRuntimeConfig();
    const apiKey = config.public.TMDB_API_KEY;

    let url = "";

    if (selectedGenre.value) {
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&page=${currentPage.value}&with_genres=${selectedGenre.value}`;
    } else {
      url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${currentPage.value}`;
    }

    const res = await axios.get(url);


    movies.value.push(...res.data.results);
    totalPages.value = res.data.total_pages;
  } catch (err) {
    console.error("Error fetching movies:", err);
  } finally {
    isLoading.value = false;
  }
};

const filterByGenre = (genreId) => {
  activeGenre.value = genreId; 
  selectedGenre.value = genreId; 
  currentPage.value = 1;
  movies.value = [];
  fetchMovies();
};

onMounted(() => {
  fetchGenres();
  fetchMovies();
});

const loadMore = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchMovies();
  }
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
