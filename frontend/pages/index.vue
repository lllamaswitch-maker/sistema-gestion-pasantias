<template>
  <div class="min-h-screen psp-gradient flex items-center justify-center p-4 relative overflow-hidden font-sans select-none">
    
    <div class="absolute inset-0 pointer-events-none overflow-hidden opacity-40 z-0">
      <svg 
        class="absolute -bottom-10 left-0 w-[300%] min-w-[2400px] h-[75%] psp-wave-1 fill-current text-[#2dd4bf]/40 pointer-events-none" 
        viewBox="0 0 2400 320" 
        preserveAspectRatio="none"
      >
        <path d="M0,160 C300,240 600,80 900,160 C1200,240 1500,80 1800,160 C2100,240 2400,80 2700,160 L2700,320 L0,320 Z"></path>
      </svg>
      <svg 
        class="absolute -bottom-4 left-0 w-[300%] min-w-[2400px] h-[60%] psp-wave-2 fill-current text-[#10b981]/30 pointer-events-none" 
        viewBox="0 0 2400 320" 
        preserveAspectRatio="none"
      >
        <path d="M0,200 C300,120 600,260 900,200 C1200,120 1500,260 1800,200 C2100,120 2400,260 2700,200 L2700,320 L0,320 Z"></path>
      </svg>
    </div>

    <div class="relative bg-[#12574c]/95 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-5xl min-h-[620px] flex items-center overflow-hidden border border-white/20 z-10">
      
      <div class="w-1/2 p-10 sm:p-14 text-white flex flex-col justify-between h-full z-0 text-center">
        <div>
          <div class="flex justify-center mb-6">
            <div class="w-48 h-48 sm:w-52 sm:h-52 rounded-3xl bg-white/10 flex items-center justify-center p-2 border-2 border-white/20 shadow-xl overflow-hidden">
              <img src="/tele_img.jpeg" alt="Mi Teleférico" class="w-full h-full object-cover rounded-2xl" />
            </div>
          </div>

          <h2 class="text-2xl sm:text-3xl font-black tracking-tight mb-3 uppercase leading-tight">
            Panel Administrativo
          </h2>
          <p class="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-light">
            Módulo de autenticación exclusivo para el personal de recursos humanos y evaluadores de convocatorias.
          </p>
        </div>

        <div class="pt-6">
          <button 
            @click="isAdminMode = false"
            class="w-full py-3.5 px-8 border-2 border-white text-white font-bold rounded-2xl text-xs uppercase tracking-wider hover:bg-white hover:text-[#12574c] active:scale-95 transition-all duration-300 shadow-lg"
          >
            Ver Convocatoria
          </button>
        </div>
      </div>

      <!-- LADO DERECHO: Convocatoria Institucional -->
      <div class="w-1/2 p-10 sm:p-14 text-white flex flex-col justify-between h-full z-0 text-center">
        <div>
          <div class="flex justify-center mb-6">
            <div class="w-48 h-48 sm:w-52 sm:h-52 rounded-3xl bg-white/10 flex items-center justify-center p-2 border-2 border-white/20 shadow-xl overflow-hidden">
              <img src="/tele_img.jpeg" alt="Mi Teleférico" class="w-full h-full object-cover rounded-2xl" />
            </div>
          </div>

          <div class="flex items-baseline justify-center gap-2 mb-3">
            <h2 class="text-3xl sm:text-4xl font-black tracking-wider uppercase drop-shadow-md">
              PASANTÍAS
            </h2>
            <span class="text-xl sm:text-2xl font-extrabold text-emerald-300">
              - {{ currentYear }}
            </span>
          </div>

          <p class="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-light">
            Realiza tus prácticas pre-profesionales en una de las empresas más grandes e importantes del país, formando parte de la gran familia de <strong class="font-bold text-white">Mi Teleférico</strong>.
          </p>
        </div>

        <div class="pt-6">
          <button 
            @click="isAdminMode = true"
            class="w-full py-3.5 px-8 border-2 border-white text-white font-bold rounded-2xl text-xs uppercase tracking-wider hover:bg-white hover:text-[#12574c] active:scale-95 transition-all duration-300 shadow-xl"
          >
            Ingreso Administrativo
          </button>
        </div>
      </div>

      <!-- TARJETA BLANCA FLOTANTE DESLIZABLE -->
      <div 
        class="absolute top-0 left-0 w-1/2 h-full bg-white rounded-3xl shadow-2xl p-8 sm:p-12 flex flex-col justify-between transition-transform duration-700 ease-in-out z-10"
        :class="{ 'translate-x-full': isAdminMode }"
      >

        <div v-if="!isAdminMode" class="h-full flex flex-col justify-between animate-fadeIn">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span class="text-xs font-bold tracking-wider text-emerald-600 uppercase">Proceso Abierto</span>
            </div>
            
            <h2 class="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight leading-tight">
              ¡Convocatoria Abierta!
            </h2>
            
            <p class="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Postúlate ahora ingresando tus datos personales y completando los formularios correspondientes a tu área de estudio.
            </p>
            <p class="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Si ya te registraste, ingresa nuevamente a <strong>“POSTULARME EN MI TELEFERICO”</strong> y haz clic en <strong>“Iniciar sesión”</strong>, ubicado en la parte superior derecha.
            </p>

          </div>

          <!-- Caja de QR -->
          <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-center justify-center gap-4 my-2">
            <div class="w-40 h-40 sm:w-44 sm:h-44 bg-white border border-slate-300 rounded-xl flex items-center justify-center p-2 shadow-sm flex-shrink-0">
              <img 
                src="/qr-code.png" 
                alt="Código QR de Requisitos" 
                class="w-full h-full object-contain"
              />
            </div>
            <p class="text-xs text-slate-600 leading-relaxed text-left">
              Para los requisitos de participación <strong class="text-slate-800">escanee el QR</strong> y descargue los documentos oficiales de la gestión <span class="font-bold text-[#12574c]">{{ currentYear }}</span>.
            </p>
          </div>

          <button 
            @click="irAPostulacion"
            class="w-full py-4 px-6 bg-[#12574c] hover:bg-[#0d4239] text-white font-bold rounded-2xl shadow-lg shadow-emerald-950/25 active:scale-95 transition duration-200 uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2"
          >
            <span>Postularme en Mi Teleférico</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

        <!-- CARA 2: FORMULARIO DE LOGIN -->
        <div v-else class="h-full flex flex-col justify-center animate-fadeIn">
          <div class="text-center mb-6">
            <h2 class="text-3xl font-black text-[#12574c] tracking-tight">Iniciar Sesión</h2>
            <p class="text-xs text-slate-400 mt-1">Ingrese sus credenciales autorizadas</p>
          </div>

          <!-- ALERTA DE ERROR -->
          <div v-if="errorMsg" class="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold text-center">
            {{ errorMsg }}
          </div>

          <form @submit.prevent="iniciarSesion" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1">Correo Electrónico</label>
              <input 
                v-model="loginForm.email"
                type="email" 
                placeholder="admin@miteleferico.bo" 
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#12574c] transition"
                required
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1">Contraseña</label>
              <input 
                v-model="loginForm.password"
                type="password" 
                placeholder="••••••••" 
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#12574c] transition"
                required
              />
            </div>

            <div class="text-right">
              <span class="text-xs text-slate-400 cursor-pointer hover:text-[#12574c] transition">
                Acceso restringido RRHH
              </span>
            </div>

            <button 
              type="submit" 
              :disabled="cargando"
              class="w-full py-3.5 px-4 bg-[#12574c] hover:bg-[#0d4239] disabled:bg-slate-300 text-white font-bold rounded-xl shadow-md active:scale-95 transition duration-200 uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2"
            >
              <span>{{ cargando ? 'Verificando...' : 'Entrar al Panel' }}</span>
            </button>
          </form>
        </div>

      </div>

    </div>

  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  computed,
} from 'vue'

import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const { $api } = useNuxtApp()

const isAdminMode = ref(false)

const currentYear = computed(
  () => new Date().getFullYear(),
)

const cargando = ref(false)
const errorMsg = ref('')

const loginForm = reactive({
  email: 'admin@miteleferico.bo',
  password: '',
})

const irAPostulacion = async () => {
  await navigateTo(
    '/postulacion/registro',
  )
}

const iniciarSesion = async () => {
  errorMsg.value = ''
  cargando.value = true

  try {
    const data = await $api('/auth/login', {
      method: 'POST',

      body: {
        email: loginForm.email
          .trim()
          .toLowerCase(),

        password:
          loginForm.password,
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

    authStore.setLogin(
      data.access_token,
      data.usuario,
    )

    const rol =
      data.usuario.rol

    if (
      rol === 'SUPERADMIN' ||
      rol === 'ADMIN_RRHH'
    ) {

      await navigateTo(
        '/admin/rrhh/dashboard',
      )

      return
    }

    if (
      rol === 'SUPERVISOR'
    ) {

      await navigateTo(
        '/supervisor/dashboard',
      )

      return
    }


    // Rol administrativo no reconocido
    authStore.logout()

    throw new Error(
      'El usuario no tiene un rol autorizado para ingresar al sistema.',
    )

  } catch (error) {
    const mensajeServidor =
      Array.isArray(error?.data?.message)
        ? error.data.message.join(', ')
        : error?.data?.message

    errorMsg.value =
      mensajeServidor ||
      error?.message ||
      'Credenciales inválidas.'
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.40); }
  to { opacity: 1; transform: scale(1); }
}

.animate-fadeIn {
  animation: fadeIn 0.35s ease-out forwards;
}
</style>