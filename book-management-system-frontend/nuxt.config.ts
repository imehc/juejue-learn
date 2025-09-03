// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxt/eslint', '@nuxt/image'],
  devtools: { enabled: true },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },
  css: ['~/assets/css/main.css'],
  ui: {
    fonts: false,
  },
  routeRules: {
    '/': { redirect: 'book' },
    '/**': { appMiddleware: 'auth' },
  },
  devServer: {
    port: 6021,
  },
  // https://nuxt.com/docs/getting-started/transitions#view-transitions-api-experimental
  experimental: {
    viewTransition: true,
  },
  compatibilityDate: '2024-08-06',
  eslint: {
    config: {
      stylistic: true,
    },
  } })
