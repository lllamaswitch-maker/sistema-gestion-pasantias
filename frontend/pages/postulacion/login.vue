<template>
  <div class="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans select-none">
    <div class="bg-white w-full max-w-md rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      
      <!-- Cabecera -->
      <div class="bg-[#12574c] px-6 py-7 text-white text-center">
        <div class="w-14 h-14 rounded-2xl bg-white/10 p-1.5 mx-auto mb-3 flex items-center justify-center border border-white/20 shadow-inner">
          <img src="/tele_img.jpeg" alt="Logo" class="w-full h-full object-cover rounded-xl" />
        </div>
        <h1 class="text-xl font-black uppercase tracking-tight">Acceso de Postulantes</h1>
        <p class="text-xs text-emerald-100/80 mt-1">Convocatoria de Pasantías</p>
      </div>

      <!-- Formulario de Acceso -->
      <form @submit.prevent="iniciarSesionPostulante" class="p-8 space-y-5">
        
        <div v-if="errorMsg" class="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold text-center">
          {{ errorMsg }}
        </div>

        <div>
          <label class="block text-xs font-black text-slate-700 mb-1.5">Correo Electrónico</label>
          <input 
            v-model="loginData.email"
            type="email" 
            placeholder="ejemplo@correo.com"
            class="input-campo"
            required
          />
        </div>

        <div>
          <label class="block text-xs font-black text-slate-700 mb-1.5">Contraseña (Carnet de Identidad)</label>
          <input 
            v-model="loginData.password"
            type="password" 
            placeholder="Ingrese su número de CI"
            class="input-campo font-mono"
            required
          />
          <p class="text-[11px] text-slate-400 mt-1">
            Recuerde que su contraseña inicial es su número de C.I.
          </p>
        </div>

        <button 
          type="submit" 
          :disabled="cargando"
          class="w-full py-3.5 px-6 bg-[#12574c] hover:bg-[#0e433a] disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-2"
        >
          <span>{{ cargando ? 'Iniciando sesión...' : 'Ingresar al Sistema' }}</span>
        </button>

        <div class="pt-4 border-t border-slate-100 text-center space-y-2">
          <p class="text-xs text-slate-600">
            ¿Aún no te has registrado?
            <NuxtLink to="/postulacion/registro" class="text-[#12574c] font-black hover:underline">
              Regístrate aquí
            </NuxtLink>
          </p>
          <div>
            <NuxtLink to="/" class="text-[11px] text-slate-400 hover:text-slate-600">
              ← Volver a la portada principal
            </NuxtLink>
          </div>
        </div>

      </form>

    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const { $api } = useNuxtApp()

const cargando = ref(false)
const errorMsg = ref('')

const loginData = reactive({
  email: '',
  password: '',
})

const iniciarSesionPostulante = async () => {
  errorMsg.value = ''
  cargando.value = true

  try {
    const data = await $api('/auth/login-postulante', {
      method: 'POST',

      body: {
        email: loginData.email
          .trim()
          .toLowerCase(),

        password: loginData.password.trim(),
      },
    })

    if (
      !data?.access_token ||
      !data?.usuario
    ) {
      throw new Error(
        'La respuesta del servidor no es válida.',
      )
    }

    // Guardamos JWT + perfil recibido
    authStore.setLogin(
      data.access_token,
      data.usuario,
    )

    // El backend decide a qué parte
    // del proceso debe continuar
    const destino =
      data.rutaDestino ||
      '/postulacion/formulario-postulacion'

    await navigateTo(destino)

  } catch (error) {
    const mensajeServidor =
      Array.isArray(error?.data?.message)
        ? error.data.message.join(', ')
        : error?.data?.message

    errorMsg.value =
      mensajeServidor ||
      error?.message ||
      'No se pudo iniciar sesión.'
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
.input-campo {
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 0.875rem;
  font-size: 0.8125rem;
  color: #1e293b;
  outline: none;
  transition: all 0.2s ease;
}

.input-campo:focus {
  background-color: #ffffff;
  border-color: #12574c;
  box-shadow: 0 0 0 3px rgba(18, 87, 76, 0.15);
}
</style>