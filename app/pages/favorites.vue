<template>
  <section class="min-h-screen px-10 py-8 text-white bg-black">
    <h2 class="mb-5 text-3xl font-bold text-center">
      My <span class="text-red-600">Favorites</span>
    </h2>

    <div
      v-if="favStore.favorites.length"
      class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
    >
      <div
        v-for="movie in favStore.favorites"
        :key="movie.id"
        class="relative overflow-hidden rounded-lg group bg-zinc-900"
      >
        <router-link :to="`/movie/${movie.id}`">
          <img
            :src="movie.poster"
            :alt="movie.title"
            class="object-cover w-full transition-transform duration-300 h-72 group-hover:scale-105"
          />
        </router-link>

        <div
          class="absolute inset-0 flex flex-col justify-end p-4 transition-opacity duration-300 opacity-0 bg-black/80 group-hover:opacity-100"
        >
          <h3 class="mb-1 text-lg font-semibold text-white truncate">
            {{ movie.title }}
          </h3>
          <p class="mb-1 text-sm font-bold text-yellow-400">
            ⭐ {{ movie.rating }}
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
            <button
              @click="removeFromFavorites(movie.id)"
              class="p-2 rounded-full bg-white/20"
            >
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <p v-else class="mt-10 text-lg text-center text-gray-400">
      You have no favorite movies yet
    </p>
  </section>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useFavoritesStore } from "@/stores/favoritesStore";

const router = useRouter();
const favStore = useFavoritesStore();

const goToMovie = (id) => {
  router.push(`/movie/${id}`);
};

const removeFromFavorites = (id) => {
  favStore.remove(id);
};
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.group:hover img {
  transform: scale(1.05);
}
</style>
