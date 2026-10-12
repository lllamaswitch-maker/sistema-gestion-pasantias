<template>
  <div class="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans select-none">
    
    <div class="bg-white w-full max-w-4xl rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      
      <!-- Cabecera Institucional -->
      <div class="bg-[#12574c] px-8 py-6 text-white flex items-center justify-between">
        <div>
          <span class="text-[11px] font-extrabold tracking-widest uppercase text-emerald-200">
            Convocatoria de Pasantías
          </span>
          
          <h1 class="text-xl font-black mt-0.5">Pre-Registro de Postulante</h1>
          <p class="text-xs text-emerald-100/80 mt-1">
            Complete sus datos personales para generar su código de verificación temporal (10 min).
          </p>
        </div>
        <div class="flex items-center gap-3">
          <NuxtLink 
            to="/postulacion/login"
            class="px-4 py-2.5 bg-white/10 hover:bg-white hover:text-[#12574c] border border-white/30 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            <span>Iniciar Sesión</span>
          </NuxtLink>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-white/10 p-1.5 flex items-center justify-center border border-white/20">
          <img src="/tele_img.jpeg" alt="Logo" class="w-full h-full object-cover rounded-xl" />
        </div>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="enviarPreRegistro" class="p-8 space-y-6">
        
        <div v-if="errorMsg" class="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
          {{ errorMsg }}
        </div>

        <!-- Fila 1: Apellidos y Nombres (Estilo de la imagen de referencia) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label class="block text-xs font-black text-slate-700 mb-1.5">
              Apellido Paterno <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="formulario.apellido_paterno"
              @input="validarSoloTexto('apellido_paterno')"
              type="text"
              inputmode="numeric"
              placeholder="QUISPE"
              class="input-registro"
              required
            />
          </div>

          <div>
            <label class="block text-xs font-black text-slate-700 mb-1.5">
              Apellido Materno
            </label>
            <input 
              v-model="formulario.apellido_materno"
              @input="validarSoloTexto('apellido_materno')"
               type="text"
                inputmode="numeric"
              placeholder="CONDORI"
              class="input-registro"
            />
          </div>

          <div>
            <label class="block text-xs font-black text-slate-700 mb-1.5">
              Nombres <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="formulario.nombres"
              @input="validarSoloTexto('nombres')"
              type="text"
              inputmode="numeric"
              placeholder="BRAYAN EVER"
              class="input-registro"
              required
            />
          </div>
        </div>

        <!-- Fila 2: C.I., Expedición, Correo -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label class="block text-xs font-black text-slate-700 mb-1.5">
              Carnet de Identidad <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="formulario.ci"
              @input="validarSoloNumeros"
              type="text"
              inputmode="numeric" 
            
              placeholder="8440940"
              maxlength="10"
              class="input-registro font-mono"
              required
            />
          </div>

          <div>
            <label class="block text-xs font-black text-slate-700 mb-1.5">
              Expedido <span class="text-red-500">*</span>
            </label>
            <select v-model="formulario.expedido" class="input-registro font-bold text-slate-700" required>
              <option value="LP">LP - LA PAZ</option>
              <option value="CB">CB - COCHABAMBA</option>
              <option value="SC">SC - SANTA CRUZ</option>
              <option value="OR">OR - ORURO</option>
              <option value="PT">PT - POTOSÍ</option>
              <option value="TJ">TJ - TARIJA</option>
              <option value="CH">CH - CHUQUISACA</option>
              <option value="BN">BN - BENI</option>
              <option value="PA">PA - PANDO</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-black text-slate-700 mb-1.5">
              Correo Electrónico <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="formulario.email"
              type="email" 
              placeholder="ejemplo@correo.com"
              class="input-registro"
              required
            />
          </div>
        </div>

        <!-- Mensaje de aviso de credenciales -->
        <div class="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-start gap-3">
          <div class="p-1 rounded-lg bg-emerald-600 text-white mt-0.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="text-xs text-emerald-900 leading-relaxed">
            <strong class="font-bold">Nota sobre sus credenciales de acceso:</strong> 
            Su usuario será su <span class="underline font-semibold">Correo Electrónico</span> y su contraseña inicial será su <span class="underline font-semibold">Número de Carnet de Identidad</span>. Al continuar, recibirá un código de 6 dígitos que estará vigente durante 10 minutos.
          </div>
        </div>

        <!-- Acciones Inferiores -->
        <div class="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <NuxtLink 
            to="/"
            class="text-xs font-bold text-slate-500 hover:text-[#12574c] transition"
          >
            ← Volver al Inicio
          </NuxtLink>

          <button 
            type="submit"
            :disabled="guardando"
            class="w-full sm:w-auto px-8 py-3.5 bg-[#12574c] hover:bg-[#0e433a] disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-2"
          >
            <span>{{ guardando ? 'Generando Código...' : 'Continuar y Recibir Código' }}</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

      </form>

    </div>

  </div>
</template>

<script setup>
import {
  reactive,
  ref,
} from 'vue'


const { $api } = useNuxtApp()


const guardando = ref(false)

const errorMsg = ref('')


const formulario = reactive({
  apellido_paterno: '',
  apellido_materno: '',
  nombres: '',
  ci: '',
  expedido: 'LP',
  email: '',
})


/*
 * ============================================================
 * SOLO LETRAS
 * ============================================================
 */
const validarSoloTexto = (
  campo,
) => {

  const valor =
    formulario[campo] || ''


  formulario[campo] =
    valor
      .replace(
        /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g,
        '',
      )
      .toUpperCase()
}


/*
 * ============================================================
 * SOLO NÚMEROS PARA C.I.
 * ============================================================
 */
const validarSoloNumeros = (
  event,
) => {

  formulario.ci =
    event.target.value
      .replace(/\D/g, '')
}


/*
 * ============================================================
 * ENVIAR PRE-REGISTRO
 * ============================================================
 */
const enviarPreRegistro =
  async () => {

    errorMsg.value = ''


    /*
     * Validar apellido paterno.
     */
    if (
      !formulario
        .apellido_paterno
        .trim()
    ) {

      errorMsg.value =
        'Ingrese su apellido paterno.'

      return
    }


    /*
     * Validar nombres.
     */
    if (
      !formulario
        .nombres
        .trim()
    ) {

      errorMsg.value =
        'Ingrese sus nombres.'

      return
    }


    /*
     * Validar C.I.
     */
    if (
      formulario.ci
        .trim()
        .length < 5
    ) {

      errorMsg.value =
        'Ingrese un número de Carnet de Identidad válido.'

      return
    }


    /*
     * Validar correo.
     */
    if (
      !formulario.email
        .trim()
    ) {

      errorMsg.value =
        'Ingrese su correo electrónico.'

      return
    }


    guardando.value = true


    try {

      /*
       * NO enviamos password.
       *
       * El backend establece el C.I.
       * como contraseña inicial.
       */
      const data =
        await $api(
          '/auth/pre-registro',
          {
            method: 'POST',

            body: {

              nombres:
                formulario
                  .nombres
                  .trim(),

              apellido_paterno:
                formulario
                  .apellido_paterno
                  .trim(),

              apellido_materno:
                formulario
                  .apellido_materno
                  .trim() ||
                undefined,

              ci:
                formulario
                  .ci
                  .trim(),

              expedido:
                formulario
                  .expedido,

              email:
                formulario
                  .email
                  .trim()
                  .toLowerCase(),
            },
          },
        )


      /*
       * Guardar correo temporalmente
       * para verificar el OTP.
       */
      const email =
        data?.email ||
        formulario
          .email
          .trim()
          .toLowerCase()


      sessionStorage.setItem(
        'temp_postulante_email',
        email,
      )


      /*
       * Si el backend devuelve fecha
       * de expiración, también la guardamos.
       */
      if (
        data?.expiraEn
      ) {

        sessionStorage.setItem(
          'temp_postulante_expira',
          String(
            data.expiraEn,
          ),
        )
      } else {

        /*
         * Respaldo:
         * 10 minutos desde ahora.
         */
        const fechaExpiracion =
          new Date(
            Date.now() +
            10 * 60 * 1000,
          )

        sessionStorage.setItem(
          'temp_postulante_expira',
          fechaExpiracion
            .toISOString(),
        )
      }


      /*
       * Ir a pantalla OTP.
       */
      await navigateTo(
        '/postulacion/verificar',
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
        'No se pudo completar el pre-registro.'

    } finally {

      guardando.value = false
    }
  }
</script>

<style scoped>
.input-registro {
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

.input-registro:focus {
  background-color: #ffffff;
  border-color: #12574c;
  box-shadow: 0 0 0 3px rgba(18, 87, 76, 0.15);
}

.input-registro::placeholder {
  color: #94a3b8;
}
</style>