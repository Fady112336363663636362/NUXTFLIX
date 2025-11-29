<template>
  <section class="px-10 py-10 text-white bg-black">

    <h2 class="px-6 mb-5 text-3xl font-bold text-center">
      Upcoming <span class="text-red-600">Movies</span>
    </h2>


    <div
      class="grid grid-cols-2 gap-4 transition-all duration-500 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
    >
      <div
        v-for="movie in displayedMovies"
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

            <FavoriteButton :movie="movie" />
          </div>
        </div>
      </div>
    </div>

    <!-- Show More / Show Less -->
    <div class="mt-8 text-center">
      <button
        @click="toggleShowAll"
        class="px-4 py-2 text-sm font-semibold transition bg-red-600 rounded hover:bg-red-700"
      >
        {{ showAll ? "Show Less" : "Show More" }}
      </button>
    </div>
  </section>
</template>

<script setup>
// import FavoriteButton from "./FavoriteButton.vue";
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const movies = ref([]);
const showAll = ref(false);

// عرض عدد معين فقط في البداية (مثلاً 12 فيلم)
const displayedMovies = computed(() =>
  showAll.value ? movies.value : movies.value.slice(0, 12)
);

// تبديل بين العرض الكامل والمحدود
const toggleShowAll = () => {
  showAll.value = !showAll.value;
};

// الذهاب لصفحة الفيلم
const goToMovie = (id) => {
  router.push(`/movie/${id}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// دوال مساعدة
const posterUrl = (path) =>
  path ? `https://image.tmdb.org/t/p/w500${path}` : "/placeholder-poster.png";

const formatVote = (v) => (v ? v.toFixed(1) : "N/A");

const shortOverview = (ov) => {
  if (!ov) return "No description available.";
  const limit = 120;
  return ov.length > limit ? ov.slice(0, limit).trim() + "..." : ov;
};

// جلب بيانات الأفلام
onMounted(async () => {
  try {
    const config = useRuntimeConfig();
    const apiKey = config.public.TMDB_API_KEY;

    const res = await axios.get(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`
    );
    movies.value = res.data.results || [];
  } catch (e) {
    console.error("Error fetching upcoming movies:", e);
  }
});
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
