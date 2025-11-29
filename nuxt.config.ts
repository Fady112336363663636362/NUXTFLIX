import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  target: 'static',
  ssr: false,
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  app: {
    baseURL: '/NUXTFLIX/',  
    buildAssetsDir: 'assets'
  },

  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],

  css: ["@fortawesome/fontawesome-free/css/all.min.css"],

  runtimeConfig: {
    public: {
      TMDB_API_KEY: process.env.TMDB_API_KEY,
    },
  },

  devServer: {
    websocket: {
      port: 24679,
    },
  },
});
