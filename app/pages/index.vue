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
import TopRatedMovies from "~/components/TopRatedMovies.vue";
import UpcomingMovies from "~/components/UpcomingMovies.vue";
import Footer from "~/components/Footer.vue";

definePageMeta({
  middleware: "auth",
})
</script>
