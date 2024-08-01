// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@nuxt/test-utils/module'
  ],
  css: ['@/assets/styles/global.css'],
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL,
    },
  },
})
