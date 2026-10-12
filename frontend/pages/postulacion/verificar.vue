<template>
  <div class="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans select-none">
    
    <div class="bg-white w-full max-w-md rounded-3xl shadow-xl border border-slate-200 overflow-hidden text-center">
      
      <!-- Cabecera -->
      <div class="bg-[#12574c] px-6 py-6 text-white">
        <div class="w-12 h-12 rounded-2xl bg-white/10 p-1.5 mx-auto mb-3 flex items-center justify-center border border-white/20">
          <img src="/tele_img.jpeg" alt="Logo" class="w-full h-full object-cover rounded-xl" />
        </div>
        <h1 class="text-lg font-black uppercase tracking-tight">Verificación de Cuenta</h1>
        <p class="text-xs text-emerald-100/80 mt-1 font-light">
          Código de Seguridad de Uso Único
        </p>
      </div>

      <div class="p-6 sm:p-8 space-y-6">
        
        <!-- Mensaje Informativo -->
        <div class="space-y-1">
          <p class="text-xs text-slate-600 leading-relaxed">
            Hemos generado un código de verificación para:
          </p>
          <p class="text-xs font-black text-[#12574c] font-mono break-all">
            {{ emailTemp || 'tu correo electrónico' }}
          </p>
          <p class="text-[11px] text-slate-400">
            Revisa tu bandeja de entrada o carpeta de spam.
          </p>
        </div>

        <!-- Indicador de Tiempo (40 minutos) -->
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold">
          <svg class="w-3.5 h-3.5 text-amber-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Válido durante: <strong>{{ tiempoRestanteFormato }}</strong></span>
        </div>

        <!-- Mensaje de Error -->
        <div v-if="errorMsg" class="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
          {{ errorMsg }}
        </div>

        <!-- 6 Casillas para el código OTP -->
        <div>
          <label class="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-3">
            Ingrese el código de 6 dígitos
          </label>
          <div class="flex justify-center gap-2 sm:gap-2.5" @paste="manejarPegado">
            <input 
              v-for="(digito, index) in 6" 
              :key="index"
              :ref="el => inputsRef[index] = el"
              v-model="codigoArray[index]"
              @input="alEscribir(index, $event)"
              @keydown.backspace="alBorrar(index, $event)"
              type="text" 
              maxlength="1"
              class="w-11 h-12 sm:w-12 sm:h-14 text-center font-mono text-lg font-black rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-[#12574c] focus:ring-2 focus:ring-[#12574c]/20 outline-none uppercase transition"
            />
          </div>
        </div>

        <!-- Botón Validar -->
        <button 
          @click="validarCodigo"
          :disabled="cargando || !codigoCompleto"
          class="w-full py-3.5 px-6 bg-[#12574c] hover:bg-[#0e433a] disabled:opacity-40 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-2"
        >
          <span>{{ cargando ? 'Comprobando...' : 'Verificar y Continuar' }}</span>
        </button>

        <!-- Volver -->
        <div class="pt-2 border-t border-slate-100">
          <NuxtLink 
            to="/postulacion/registro" 
            class="text-[11px] font-bold text-slate-400 hover:text-[#12574c] transition"
          >
            ← Volver al registro o corregir correo
          </NuxtLink>
        </div>

      </div>

    </div>

  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
} from 'vue'


const { $api } = useNuxtApp()


const emailTemp = ref('')

const errorMsg = ref('')

const cargando = ref(false)


const codigoArray =
  ref([
    '',
    '',
    '',
    '',
    '',
    '',
  ])


const inputsRef =
  ref([])

const tiempoRestante =
  ref(10 * 60)


let timer = null


const tiempoRestanteFormato =
  computed(() => {

    const minutos =
      Math.floor(
        tiempoRestante.value / 60,
      )


    const segundos =
      tiempoRestante.value % 60


    return `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')} min`
  })


const codigoCompleto =
  computed(() => {

    const codigo =
      codigoArray.value.join('')


    return /^\d{6}$/.test(
      codigo,
    )
  })


const actualizarTiempoRestante =
  () => {

    const expiraGuardado =
      sessionStorage.getItem(
        'temp_postulante_expira',
      )


    if (!expiraGuardado) {

      tiempoRestante.value =
        10 * 60

      return
    }


    const fechaExpiracion =
      new Date(
        expiraGuardado,
      ).getTime()


    if (
      Number.isNaN(
        fechaExpiracion,
      )
    ) {

      tiempoRestante.value =
        10 * 60

      return
    }


    const segundos =
      Math.floor(
        (
          fechaExpiracion -
          Date.now()
        ) / 1000,
      )


    tiempoRestante.value =
      Math.max(
        segundos,
        0,
      )
  }


const alEscribir =
  (
    index,
    event,
  ) => {

    /*
     * Solo un número.
     */
    const valor =
      event.target.value
        .replace(/\D/g, '')
        .slice(0, 1)


    codigoArray.value[
      index
    ] = valor


    if (
      valor &&
      index < 5 &&
      inputsRef.value[
        index + 1
      ]
    ) {

      inputsRef.value[
        index + 1
      ].focus()
    }
  }


const alBorrar =
  (
    index,
  ) => {

    if (
      !codigoArray.value[
        index
      ] &&
      index > 0 &&
      inputsRef.value[
        index - 1
      ]
    ) {

      inputsRef.value[
        index - 1
      ].focus()
    }
  }


const manejarPegado =
  (
    event,
  ) => {

    event.preventDefault()


    const textoPegado =
      (
        event.clipboardData ||
        window.clipboardData
      )
        .getData('text')
        .replace(/\D/g, '')
        .slice(0, 6)


    for (
      let i = 0;
      i < 6;
      i++
    ) {

      codigoArray.value[i] =
        textoPegado[i] || ''
    }


    const posicion =
      Math.min(
        textoPegado.length,
        5,
      )


    if (
      inputsRef.value[
        posicion
      ]
    ) {

      inputsRef.value[
        posicion
      ].focus()
    }
  }
const validarCodigo =
  async () => {

    errorMsg.value = ''


    if (
      tiempoRestante.value <= 0
    ) {

      errorMsg.value =
        'El código ha expirado. Debe solicitar uno nuevo.'

      return
    }


    const codigo =
      codigoArray.value.join('')


    if (
      !/^\d{6}$/.test(
        codigo,
      )
    ) {

      errorMsg.value =
        'Ingrese los 6 números del código de verificación.'

      return
    }


    if (
      !emailTemp.value
    ) {

      errorMsg.value =
        'No se encontró el correo del registro. Debe registrarse nuevamente.'

      return
    }


    cargando.value = true


    try {


      await $api(
        '/auth/verificar-codigo',
        {
          method: 'POST',

          body: {

            email:
              emailTemp.value
                .trim()
                .toLowerCase(),

            codigo,
          },
        },
      )


      sessionStorage.removeItem(
        'temp_postulante_email',
      )

      sessionStorage.removeItem(
        'temp_postulante_expira',
      )

      
      sessionStorage.removeItem(
        'temp_postulante_ci',
      )


      await navigateTo(
        '/postulacion/login',
      )

    } catch (error) {

      const mensajeServidor =
        Array.isArray(
          error?.data?.message,
        )
          ? error.data.message.join(', ')
          : error?.data?.message


      errorMsg.value =
        mensajeServidor ||
        error?.message ||
        'Código incorrecto o expirado.'

    } finally {

      cargando.value = false
    }
  }


onMounted(async () => {

  emailTemp.value =
    sessionStorage.getItem(
      'temp_postulante_email',
    ) || ''


  /*
   * Ya no utilizamos CI
   * durante la verificación.
   */
  sessionStorage.removeItem(
    'temp_postulante_ci',
  )


  if (
    !emailTemp.value
  ) {

    await navigateTo(
      '/postulacion/registro',
    )

    return
  }


  actualizarTiempoRestante()


  timer =
    setInterval(
      () => {

        actualizarTiempoRestante()


        if (
          tiempoRestante.value <= 0
        ) {

          clearInterval(
            timer,
          )

          timer = null


          errorMsg.value =
            'El código de verificación ha expirado. Debe solicitar uno nuevo.'
        }

      },
      1000,
    )


  setTimeout(
    () => {

      if (
        inputsRef.value[0]
      ) {

        inputsRef.value[
          0
        ].focus()
      }

    },
    50,
  )
})

onUnmounted(() => {

  if (timer) {

    clearInterval(
      timer,
    )
  }
})
</script>