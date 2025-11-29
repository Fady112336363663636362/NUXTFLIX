<template>
  <footer class="px-6 py-10 text-gray-400 bg-slate-950">
    <div class="grid max-w-6xl grid-cols-2 gap-6 mx-auto mb-10 sm:grid-cols-3 md:grid-cols-4">
      <div v-for="(links, title) in footerLinks" :key="title">
        <h3 class="mb-3 text-sm font-semibold text-gray-300 uppercase">{{ title }}</h3>
        <ul class="space-y-2">
          <li v-for="link in links" :key="link">
            <a href="#" class="transition hover:text-white">{{ link }}</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="flex flex-col items-center justify-between pt-6 border-t border-gray-700 sm:flex-row">
      <div class="flex items-center gap-4 mb-4 sm:mb-0">
        <a href="#" class="hover:text-white"><i class="fab fa-facebook-f"></i></a>
        <a href="#" class="hover:text-white"><i class="fab fa-twitter"></i></a>
        <a href="#" class="hover:text-white"><i class="fab fa-instagram"></i></a>
        <a href="#" class="hover:text-white"><i class="fab fa-youtube"></i></a>
      </div>

      <p class="text-xs text-gray-500">&copy; {{ new Date().getFullYear() }} Netflix Clone. All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup>
const footerLinks = {
  "Company": ["About", "Careers", "Press", "Investors"],
  "Support": ["FAQ", "Contact Us", "Account", "Speed Test"],
  "Legal": ["Privacy Policy", "Terms of Use", "Cookie Preferences"],
  "More": ["Media Center", "Ways to Watch", "Corporate Information"],
};
</script>
