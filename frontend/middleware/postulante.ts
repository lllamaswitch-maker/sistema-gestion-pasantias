import { useAuthStore } from '@/stores/auth'

export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) {
    return
  }

  const authStore = useAuthStore()

  if (!authStore.token || !authStore.usuario) {
    authStore.cargarSesion()
  }

  if (
    !authStore.estaAutenticado ||
    !authStore.usuario
  ) {
    return navigateTo('/postulacion/login')
  }

  const rolesPermitidos = [
    'POSTULANTE',
    'PASANTE',
  ]

  if (
    !rolesPermitidos.includes(
      authStore.usuario.rol,
    )
  ) {
    return navigateTo('/')
  }
})