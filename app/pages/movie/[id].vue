<template>
  <div class="min-h-screen text-white bg-gray-900">
    <div
      v-if="movie"
      class="relative px-10 py-32 bg-center bg-cover"
      :style="{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
      }"
    >
      <div class="absolute inset-0 bg-black/70"></div>

      <div
        class="relative z-10 flex flex-col items-center max-w-6xl gap-10 mx-auto md:flex-row"
      >
        <img
          :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
          alt="poster"
          class="shadow-2xl rounded-2xl w-72"
        />

        <div class="max-w-2xl">
          <h1 class="mb-4 text-5xl font-bold">{{ movie.title }}</h1>
          <p class="mb-6 leading-relaxed text-gray-300">{{ movie.overview }}</p>
          <p class="mb-6 text-sm opacity-80">
            ⭐ {{ movie?.vote_average ? movie.vote_average.toFixed(1) : "N/A" }}
          </p>

          <div class="flex flex-wrap gap-4">
            <button
              class="px-8 py-3 font-semibold transition-all bg-red-600 hover:bg-red-700 rounded-xl"
            >
              <i class="fa-solid fa-play"></i> Watch Now
            </button>
            <button
              class="px-8 py-3 font-semibold transition-all bg-gray-700 hover:bg-gray-600 rounded-xl"
              @click="openTrailer"
            >
              <i class="fa-brands fa-youtube"></i> Watch Trailer
            </button>
           <FavoriteButton v-if="movie?.id && movie?.poster_path" :movie="movie" />
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showTrailer"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
    >
      <div class="relative w-full max-w-4xl px-4 aspect-video">
        <iframe
          v-if="trailerKey"
          :src="`https://www.youtube.com/embed/${trailerKey}`"
          frameborder="0"
          allowfullscreen
          class="w-full h-full shadow-lg rounded-xl"
        ></iframe>

        <button
          @click="closeTrailer"
          class="absolute p-2 text-white rounded-full top-2 right-2 bg-white/20 hover:bg-white/40"
        >
          ✖
        </button>
      </div>
    </div>

    <!-- الأفلام المشابهة -->
    <div v-if="similarMovies.length" class="px-10 py-16 bg-black">
      <h2 class="mb-8 text-3xl font-bold text-center">Similar Movies</h2>
      <div class="mx-auto" style="width: 90%">
        <div
          class="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        >
          <div
            v-for="similar in similarMovies"
            :key="similar.id"
            class="relative overflow-hidden shadow-lg cursor-pointer rounded-xl group"
          >
            <img
              :src="`https://image.tmdb.org/t/p/w500${similar.poster_path}`"
              alt="poster"
              class="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />

            <div
              class="absolute inset-0 flex flex-col justify-end p-4 text-white transition-opacity duration-300 opacity-0 bg-black/80 group-hover:opacity-100"
            >
              <h3 class="mb-1 font-semibold text-md">{{ similar.title }}</h3>
              <p class="mb-1 text-sm font-bold text-yellow-400">
                ⭐ {{ similar.vote_average }}
              </p>
              <p class="mb-3 text-xs text-gray-300 line-clamp-3">
                {{ similar.overview }}
              </p>

              <div class="flex gap-3">
                <button
                  @click.stop="goToMovie(similar.id)"
                  class="w-full py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                >
                  <i class="fa-solid fa-play"></i> Watch Now
                </button>

                <FavoriteButton
                  v-if="similar && similar.poster_path"
                  :movie="similar"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const movie = ref(null);
const similarMovies = ref([]);
const trailerKey = ref(null);
const showTrailer = ref(false);

const API_KEY = "34b375ac60c16f0529d57330d1a45460";

const fetchMovieDetails = async (id) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
  );
  movie.value = await res.json();
};

const goToMovie = (id) => {
  router.push(`/movie/${id}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const fetchSimilarMovies = async (id) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${API_KEY}`
  );
  const data = await res.json();
  similarMovies.value = data.results || [];
};

const fetchTrailer = async (id) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`
  );
  const data = await res.json();

  const results = Array.isArray(data.results) ? data.results : [];

  const trailer = results.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );

  trailerKey.value = trailer ? trailer.key : null;
};

const openTrailer = async () => {
  await fetchTrailer(route.params.id);
  showTrailer.value = true;
};

const closeTrailer = () => {
  showTrailer.value = false;
};

watch(
  () => route.params.id,
  async (id) => {
    if (id) {
      await fetchMovieDetails(id);
      await fetchSimilarMovies(id);
    }
  },
  { immediate: true }
);
</script>
