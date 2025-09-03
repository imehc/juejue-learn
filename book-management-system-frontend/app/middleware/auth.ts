export default defineNuxtRouteMiddleware((to) => {
  const cookie = useCookie(USERNAME)
  if (!['/login', '/register'].includes(to.path) && !cookie.value) {
    return navigateTo('login')
  }
})
