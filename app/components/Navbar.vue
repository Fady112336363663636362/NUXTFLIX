<template>
  <nav
    class="fixed top-0 left-0 z-50 flex items-center justify-between w-full px-6 py-3 text-white bg-black/40 backdrop-blur-md"
  >
    <NuxtLink to="/">
      <div class="text-3xl font-bold text-red-600">NUXTFLIX</div>
    </NuxtLink>

    <div class="relative w-1/4">
      <div class="flex items-center">
        <input
          v-model="searchQuery"
          @input="onInput"
          type="text"
          placeholder="Search for a movie..."
          class="w-full p-3 text-white placeholder-gray-400 rounded-lg outline-none bg-zinc-800"
        />

        <button
          @click="goToSearch"
          class="px-3 py-2 ml-2 text-sm text-white transition bg-red-600 rounded hover:bg-red-700"
        >
          Search
        </button>
      </div>

      <ul
        v-if="showSuggestions && suggestions.length"
        class="absolute left-0 z-50 w-full mt-2 overflow-y-auto rounded-lg shadow-lg bg-zinc-900/80 backdrop-blur-md max-h-64"
        style="top: 100%"
      >
        <li
          v-for="movie in suggestions"
          :key="movie.id"
          @click="selectMovie(movie)"
          class="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-200"
        >
          <img
            :src="getPoster(movie.poster_path)"
            :alt="movie.title"
            class="object-cover w-10 rounded h-14"
          />
          <div class="truncate">
            <div class="text-sm font-medium text-white">{{ movie.title }}</div>
            <div class="text-xs text-gray-400">
              ⭐ {{ movie.vote_average ?? "N/A" }}
            </div>
          </div>
        </li>
      </ul>
    </div>

    <ul class="hidden gap-6 md:flex">
      <NuxtLink to="/" class="transition cursor-pointer hover:text-red-500">
        Home
      </NuxtLink>
      <NuxtLink to="/movis" class="hover:text-red-500"> Movies </NuxtLink>
      <NuxtLink
        to="favorites"
        class="font-medium text-white transition hover:text-red-500"
      >
        Favorites
      </NuxtLink>
      <NuxtLink to="/login" class="font-medium text-red-600 hover:underline">
        Login
      </NuxtLink>
    </ul>

    <div class="cursor-pointer md:hidden" @click="toggleMenu">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="white"
        class="w-7 h-7"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M4 6h16M4 12h16m-7 6h7"
        />
      </svg>
    </div>

    <transition name="fade">
      <div
        v-if="menuOpen"
        class="absolute left-0 flex flex-col items-center w-full gap-4 py-4 bg-black border-t border-gray-800 top-14 md:hidden"
      >
        <NuxtLink to="/" class="transition cursor-pointer hover:text-red-500">
          Home
        </NuxtLink>

        <NuxtLink
          to="/movies"
          class="font-medium text-white transition hover:text-red-500"
        >
          Movies
        </NuxtLink>

        <NuxtLink
          to="favorites"
          class="font-medium text-white transition hover:text-red-500"
        >
          Favorites
        </NuxtLink>

        <NuxtLink to="/login" class="font-medium text-red-600 hover:underline">
          Login
        </NuxtLink>
        <div class="flex items-center w-4/5 px-3 py-1 bg-gray-800 rounded-lg">
          <input
            type="text"
            placeholder="Search..."
            class="w-full text-white placeholder-gray-400 bg-transparent outline-none"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="white"
            class="w-5 h-5 ml-2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
            />
          </svg>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
// لا نحتاج لـ useRouter/useRoute إذا كنا نستخدم Nuxt 3 بشكل كامل،
// لكن للحفاظ على الكود كما أرسلته، سنبقيها.
const router = useRouter();

const menuOpen = ref(false);

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

// المتغير اللي مربوط بالإنبت
const searchQuery = ref("");

// مصفوفة الاقتراحات المعروضة
const suggestions = ref([]);

// هل نظهر الاقتراحات
const showSuggestions = ref(false);

// مؤقت debounce
let debounceTimer = null;

// ======= تعليق فوق الدالة: onInput() =======
// تُستدعى عند كل حدث @input على الحقل.
const onInput = () => {
  const q = searchQuery.value.trim();
  if (q.length < 1) {
    suggestions.value = [];
    showSuggestions.value = false;
    clearTimeout(debounceTimer);
    return;
  }

  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    fetchSuggestions(q);
  }, 250); // 250ms انتظار قبل الطلب
};

// ======= تعليق فوق الدالة: fetchSuggestions(query) =======
// تجلب نتائج من TMDB search API.
const fetchSuggestions = async (query) => {
  if (!process.client) return; // نتجنب التنفيذ على السيرفر

  try {
    // يجب التأكد من تهيئة config.public.TMDB_API_KEY في ملف nuxt.config.ts
    const config = useRuntimeConfig();
    const apiKey = config.public.TMDB_API_KEY || "";

    if (!apiKey) {
      console.error("[Search] TMDB_API_KEY missing in runtime config");
      suggestions.value = [];
      showSuggestions.value = false;
      return;
    }

    // طلب البحث من TMDB
    const res = await axios.get("https://api.themoviedb.org/3/search/movie", {
      params: { api_key: apiKey, language: "en-US", query },
    });

    const results = Array.isArray(res.data?.results) ? res.data.results : [];

    // فلترة "startsWith" على العنوان (الحروف الأولى)
    const qLower = query.toLowerCase();
    const starts = results.filter((r) => {
      if (!r.title) return false;
      return r.title.toLowerCase().startsWith(qLower);
    });

    suggestions.value = starts.slice(0, 8);

    // خيار بديل: لو مفيش startsWith، خذ بعض النتائج العامة
    if (suggestions.value.length === 0) {
      suggestions.value = results.slice(0, 6);
    }

    showSuggestions.value = suggestions.value.length > 0;
  } catch (err) {
    console.error("[Search] fetch error", err);
    suggestions.value = [];
    showSuggestions.value = false;
  }
};

// ======= تعليق فوق الدالة: getPoster(path) =======
// إرجاع رابط البوستر
const getPoster = (path) => {
  return path
    ? `https://image.tmdb.org/t/p/w200${path}`
    : "/placeholder-poster.png";
};

// ======= تعليق فوق الدالة: selectMovie(movie) =======
// لما المستخدم يضغط على اقتراح فيلم
const selectMovie = (movie) => {
  router.push(`/movie/${movie.id}`);
  resetSearch();
};

// ======= تعليق فوق الدالة: goToSearch() =======
// يعمل لو المستخدم ضغط زر Search
const goToSearch = () => {
  if (!searchQuery.value.trim()) return;
  router.push({ path: "/movies", query: { query: searchQuery.value.trim() } }); // 💡 تصحيح المسار إلى /movies
  resetSearch();
};

// ======= تعليق فوق الدالة: resetSearch() =======
// تنظيف حالة البحث بعد اختيار أو تنفيذ البحث
const resetSearch = () => {
  searchQuery.value = "";
  suggestions.value = [];
  showSuggestions.value = false;
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
