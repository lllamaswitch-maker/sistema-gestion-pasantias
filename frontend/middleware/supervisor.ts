import { useAuthStore } from '@/stores/auth'

export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) {
    return
  }

  const authStore = useAuthStore()

  if (
    !authStore.token ||
    !authStore.usuario
  ) {
    authStore.cargarSesion()
  }

  if (
    !authStore.estaAutenticado ||
    !authStore.usuario
  ) {
    return navigateTo('/')
  }

  const rol =
    authStore.usuario.rol

  // Solo supervisor
  if (rol === 'SUPERVISOR') {
    return
  }

  // Administradores vuelven a RRHH
  if (
    rol === 'SUPERADMIN' ||
    rol === 'ADMIN_RRHH'
  ) {

    return navigateTo(
      '/admin/rrhh/dashboard',
    )
  }

  authStore.logout()

  return navigateTo('/')
})