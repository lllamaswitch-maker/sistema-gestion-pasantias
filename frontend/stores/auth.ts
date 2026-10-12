import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface UsuarioAuth {
  id: string
  email: string
  rol: string
  postulante_id?: string
  ci?: string
  expedido?: string
  nombres?: string
  apellido_paterno?: string
  apellido_materno?: string
  cargo?: string
  apellidos?: string
  departamento_unidad?: string
  esPasanteActivo?: boolean
  tieneFormularioCompleto?: boolean
  tieneDocumentosCompletos?: boolean
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const usuario = ref<UsuarioAuth | null>(null)

  const estaAutenticado = computed(() => Boolean(token.value))

  const setLogin = (
    jwtToken: string,
    userPerfil: UsuarioAuth,
  ) => {
    token.value = jwtToken
    usuario.value = userPerfil

    if (import.meta.client) {
      localStorage.setItem('auth_token', jwtToken)
      localStorage.setItem(
        'auth_user',
        JSON.stringify(userPerfil),
      )
    }
  }

  const cargarSesion = () => {
    if (!import.meta.client) {
      return
    }

    try {
      const storedToken = localStorage.getItem('auth_token')
      const storedUser = localStorage.getItem('auth_user')

      if (!storedToken || !storedUser) {
        return
      }

      const parsedUser = JSON.parse(storedUser)

      token.value = storedToken
      usuario.value = parsedUser
    } catch (error) {
      console.error('Error al cargar la sesión:', error)

      token.value = null
      usuario.value = null

      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    }
  }

  const logout = async () => {
    token.value = null
    usuario.value = null

    if (import.meta.client) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    }

    await navigateTo('/')
  }

  return {
    token,
    usuario,
    estaAutenticado,
    setLogin,
    cargarSesion,
    logout,
  }
})