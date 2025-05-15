// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devServer: {
    port: 3001,
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: false,
  modules: [
    '@nuxtjs/leaflet',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxtjs/google-fonts',
    'nuxt-tiptap-editor'
  ],
  css: ['~/assets/css/main.css'],
  googleFonts: {
    families: {
      Galada: true
    }
  },
  tiptap: {
    prefix: 'Tiptap',
  }
})