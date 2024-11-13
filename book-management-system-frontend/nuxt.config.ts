// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxt/eslint', '@nuxt/image'],
  devtools: { enabled: true },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },
  routeRules: {
    '/': { redirect: 'book' },
    '/**': { appMiddleware: 'auth' },
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
  },
})
