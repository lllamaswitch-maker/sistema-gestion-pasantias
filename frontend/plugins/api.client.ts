import { useAuthStore } from '@/stores/auth'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const api = $fetch.create({
    baseURL: config.public.apiBase,

    onRequest({ options }) {
      // Si existe sesión, enviar automáticamente el JWT
      if (authStore.token) {
        const headers = new Headers(options.headers)

        headers.set(
          'Authorization',
          `Bearer ${authStore.token}`,
        )

        options.headers = headers
      }
    },

    async onResponseError({ request, response }) {
      const url = String(request)

      // Si una ruta protegida devuelve 401,
      // significa que la sesión ya no es válida.
      //
      // No hacemos logout automático en /auth/
      // porque un login incorrecto también devuelve 401.
      if (
        response.status === 401 &&
        !url.includes('/auth/')
      ) {
        await authStore.logout()
      }
    },
  })

  return {
    provide: {
      api,
    },
  }
})