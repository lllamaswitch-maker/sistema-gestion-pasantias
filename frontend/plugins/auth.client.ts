import { useAuthStore } from '@/stores/auth'

export default defineNuxtPlugin((nuxtApp) => {
  const authStore = useAuthStore()

  nuxtApp.hook('app:mounted', () => {
    authStore.cargarSesion()
  })
})