<template>
  <div>
    <Navbar />
    <NuxtPage /> <!-- هنا Nuxt هيعرض الصفحة الحالية حسب الـ route -->
  </div>
</template>

<script setup>
import Navbar from "~/components/Navbar.vue";
</script>
