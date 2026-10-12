import { useAuthStore } from '@/stores/auth'

export default defineNuxtRouteMiddleware(() => {
  // localStorage solo existe en navegador
  if (import.meta.server) {
    return
  }

  const authStore = useAuthStore()

  // Recuperar sesión
  if (
    !authStore.token ||
    !authStore.usuario
  ) {
    authStore.cargarSesion()
  }

  // Sin sesión
  if (
    !authStore.estaAutenticado ||
    !authStore.usuario
  ) {
    return navigateTo('/')
  }

  const rol =
    authStore.usuario.rol

  // SUPERADMIN y RRHH pueden ingresar
  // al módulo administrativo
  if (
    rol === 'SUPERADMIN' ||
    rol === 'ADMIN_RRHH'
  ) {
    return
  }

  // Un supervisor no debe entrar
  // a las páginas de RRHH
  if (rol === 'SUPERVISOR') {
    return navigateTo(
      '/supervisor/dashboard',
    )
  }

  // Cualquier otro rol
  authStore.logout()

  return navigateTo('/')
})