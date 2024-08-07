// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/eslint', '@nuxt/image'],
  compatibilityDate: '2024-08-06',
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },
  // https://nuxt.com/docs/getting-started/transitions#view-transitions-api-experimental
  experimental: {
    viewTransition: true,
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
  routeRules: {
    '/': { redirect: 'book' },
    '/**': { appMiddleware: 'auth' },
  },
})
