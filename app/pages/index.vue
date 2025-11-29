<template>
  <div>
    <Navbar />
    <HeroSection />
    <TrendingMovies />
    <TopRatedMovies />
    <UpcomingMovies />
    <Footer />
  </div>
</template>

<script setup>
import Navbar from "~/components/Navbar.vue";
import HeroSection from "~/components/HeroSection.vue";
import TrendingMovies from "~/components/TrendingMovies.vue";

definePageMeta({
  middleware: "auth",
});
</script>
