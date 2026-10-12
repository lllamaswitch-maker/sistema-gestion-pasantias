<template>
  <div
    class="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-8 font-sans relative"
  >
    <div
      class="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-200"
    >
      <!-- =================================================== -->
      <!-- CABECERA -->
      <!-- =================================================== -->

      <div
        class="bg-[#12574c] px-6 sm:px-8 py-6 text-white flex items-center justify-between gap-4"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-12 h-12 rounded-xl bg-white/10 p-1 flex items-center justify-center border border-white/20"
          >
            <img
              src="/tele_img.jpeg"
              alt="Logo Mi Teleférico"
              class="w-full h-full object-cover rounded-lg"
            />
          </div>

          <div>
            <h1
              class="text-lg font-black tracking-tight"
            >
              Mi Teleférico
            </h1>

            <p
              class="text-xs text-emerald-100/80"
            >
              Estado de Postulación
            </p>
          </div>
        </div>

        <button
          type="button"
          @click="salir"
          class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold transition"
        >
          Cerrar Sesión
        </button>
      </div>


      <!-- =================================================== -->
      <!-- CARGANDO -->
      <!-- =================================================== -->

      <div
        v-if="cargando"
        class="p-12 text-center"
      >
        <div
          class="w-12 h-12 border-4 border-slate-200 border-t-[#12574c] rounded-full animate-spin mx-auto"
        ></div>

        <p
          class="mt-4 text-sm font-bold text-slate-500"
        >
          Consultando el estado de tu postulación...
        </p>
      </div>


      <div
        v-else-if="errorMsg"
        class="p-8 sm:p-12 text-center"
      >
        <div
          class="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto text-2xl font-black"
        >
          !
        </div>

        <h2
          class="mt-4 text-xl font-black text-slate-800"
        >
          No pudimos consultar tu postulación
        </h2>

        <p
          class="mt-2 text-sm text-red-600"
        >
          {{ errorMsg }}
        </p>

        <button
          type="button"
          @click="cargarEstado"
          class="mt-6 px-6 py-3 bg-[#12574c] text-white rounded-xl text-xs font-bold uppercase"
        >
          Intentar nuevamente
        </button>
      </div>


      <div
        v-else
        class="p-6 sm:p-10 space-y-7"
      >
        <!-- DATOS DEL POSTULANTE -->

        <div class="text-center">
          <p
            class="text-xs font-black uppercase tracking-widest text-[#12574c]"
          >
            Seguimiento de Postulación
          </p>

          <h2
            class="mt-2 text-2xl sm:text-3xl font-black text-slate-800"
          >
            Hola, {{ nombrePostulante }}
          </h2>

          <p
            class="mt-2 text-sm text-slate-500"
          >
            Aquí puedes consultar el estado actualizado
            de tu proceso de postulación.
          </p>
        </div>


        <div
          class="rounded-3xl border p-6 sm:p-8 text-center"
          :class="configEstado.contenedor"
        >
          <div
            class="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-3xl shadow-inner"
            :class="configEstado.icono"
          >
            {{ configEstado.simbolo }}
          </div>

          <p
            class="mt-5 text-[11px] font-black uppercase tracking-[0.18em]"
            :class="configEstado.texto"
          >
            Estado actual
          </p>

          <h3
            class="mt-1 text-xl sm:text-2xl font-black"
            :class="configEstado.texto"
          >
            {{ configEstado.titulo }}
          </h3>

          <p
            class="mt-3 text-sm leading-relaxed max-w-xl mx-auto"
            :class="configEstado.descripcion"
          >
            {{ configEstado.mensaje }}
          </p>
        </div>


        <div
          class="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div
            class="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left"
          >
            <p
              class="text-[10px] font-black text-slate-400 uppercase tracking-wider"
            >
              Cédula de Identidad
            </p>

            <p
              class="mt-1 text-sm font-black text-slate-800 font-mono"
            >
              {{ postulacion.ci }}
              {{ postulacion.expedido }}
            </p>
          </div>

          <div
            class="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left"
          >
            <p
              class="text-[10px] font-black text-slate-400 uppercase tracking-wider"
            >
              Última actualización
            </p>

            <p
              class="mt-1 text-sm font-black text-slate-800"
            >
              {{ fechaUltimoCambio }}
            </p>
          </div>
        </div>

        <div
          v-if="observacionGeneral"
          class="rounded-2xl border p-5 text-left"
          :class="
            estadoActual === 'OBSERVADO'
              ? 'bg-amber-50 border-amber-200'
              : 'bg-blue-50 border-blue-200'
          "
        >
          <div
            class="flex items-start gap-3"
          >
            <div
              class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-black"
              :class="
                estadoActual === 'OBSERVADO'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-blue-100 text-blue-700'
              "
            >
              i
            </div>

            <div>
              <h4
                class="text-xs font-black text-slate-800 uppercase tracking-wider"
              >
                Observación de Talento Humano
              </h4>

              <p
                class="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed"
              >
                {{ observacionGeneral }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="bg-slate-50 border border-slate-200 rounded-2xl p-5"
        >
          <div
            class="flex items-center justify-between gap-4"
          >
            <div class="text-left">
              <h4
                class="text-xs font-black text-slate-800 uppercase tracking-wider"
              >
                Documentación
              </h4>

              <p
                class="mt-1 text-xs text-slate-500"
              >
                Documentos registrados en el sistema
              </p>
            </div>

            <span
              class="px-3 py-1 rounded-full text-xs font-black"
              :class="
                totalDocumentos >= 7
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              "
            >
              {{ totalDocumentos }}/7
            </span>
          </div>
        </div>



        <div
          v-if="
            estadoActual === 'OBSERVADO' &&
            documentosObservados.length > 0
          "
          class="space-y-3"
        >
          <div>
            <h3
              class="text-sm font-black text-red-700 uppercase tracking-wider"
            >
              Documentos que debes corregir
            </h3>

            <p
              class="mt-1 text-xs text-slate-500"
            >
              Revisa las observaciones indicadas por
              Talento Humano.
            </p>
          </div>

          <div
            v-for="documento in documentosObservados"
            :key="documento.id"
            class="border border-red-200 bg-red-50 rounded-2xl p-4 text-left"
          >
            <div
              class="flex items-start gap-3"
            >
              <div
                class="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-black text-[10px] flex-shrink-0"
              >
                PDF
              </div>

              <div class="min-w-0">
                <p
                  class="text-xs font-black text-slate-800"
                >
                  {{
                    formatearTipoDocumento(
                      documento.tipo_documento,
                    )
                  }}
                </p>

                <p
                  class="mt-1 text-xs text-red-700 leading-relaxed"
                >
                  {{
                    documento.observacion ||
                    'Documento observado por Talento Humano.'
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="totalDocumentos > 0"
          class="grid grid-cols-2 gap-3"
        >
          <div
            class="border border-emerald-200 bg-emerald-50 rounded-2xl p-4"
          >
            <p
              class="text-2xl font-black text-emerald-700"
            >
              {{ totalDocumentosAprobados }}
            </p>

            <p
              class="text-[10px] font-black uppercase tracking-wider text-emerald-700"
            >
              Verificados
            </p>
          </div>

          <div
            class="border border-amber-200 bg-amber-50 rounded-2xl p-4"
          >
            <p
              class="text-2xl font-black text-amber-700"
            >
              {{ totalDocumentosObservados }}
            </p>

            <p
              class="text-[10px] font-black uppercase tracking-wider text-amber-700"
            >
              Observados
            </p>
          </div>
        </div>

        <div
          v-if="estadoActual === 'OBSERVADO'"
          class="bg-amber-50 border border-amber-200 rounded-2xl p-5"
        >
          <h4
            class="text-sm font-black text-amber-800"
          >
            Tu postulación necesita correcciones
          </h4>

          <p
            class="mt-1 text-xs text-amber-700 leading-relaxed"
          >
            Puedes corregir tus datos o reemplazar los
            documentos observados. Después deberás volver
            a finalizar tu postulación para enviarla
            nuevamente a revisión.
          </p>

          <div
            class="mt-4 flex flex-col sm:flex-row gap-3"
          >
            <button
              type="button"
              @click="irFormulario"
              class="flex-1 px-5 py-3 border border-amber-300 bg-white hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-black uppercase transition"
            >
              Revisar mis datos
            </button>

            <button
              type="button"
              @click="irDocumentos"
              class="flex-1 px-5 py-3 bg-[#12574c] hover:bg-[#0d433a] text-white rounded-xl text-xs font-black uppercase transition"
            >
              Corregir documentos
            </button>
          </div>
        </div>

        <div
          v-else
          class="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 text-left flex items-start gap-4"
        >
          <div
            class="w-9 h-9 rounded-xl bg-[#004b93] text-white flex items-center justify-center font-black text-xs flex-shrink-0"
          >
            i
          </div>

          <div>
            <h3
              class="text-xs font-bold text-slate-800 uppercase tracking-wide"
            >
              Próximos pasos
            </h3>

            <p
              class="mt-1 text-xs text-slate-600 leading-relaxed"
            >
              {{ mensajeProximoPaso }}
            </p>
          </div>
        </div>
 

        <div
          class="pt-2 flex flex-col sm:flex-row justify-center gap-3"
        >
          <button
            type="button"
            @click="cargarEstado"
            class="px-6 py-3 border-2 border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl text-xs uppercase tracking-wider transition"
          >
            Actualizar Estado
          </button>

          <button
            type="button"
            @click="salir"
            class="px-8 py-3 bg-[#12574c] hover:bg-[#0d433a] text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg transition"
          >
            Cerrar Sesión
          </button>
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
} from 'vue'

import { useAuthStore } from '@/stores/auth'


definePageMeta({
  middleware: 'postulante',
})


const authStore = useAuthStore()

const { $api } = useNuxtApp()


const postulacion = ref({})

const cargando = ref(true)

const errorMsg = ref('')


const estadoActual = computed(() => {
  return (
    postulacion.value
      ?.estados_postulacion
      ?.estado_actual ||
    'REGISTRADO'
  )
})


const nombrePostulante =
  computed(() => {
    const nombres =
      postulacion.value
        ?.nombres ||
      authStore.usuario
        ?.nombres ||
      'Postulante'

    return nombres
  })


const observacionGeneral =
  computed(() => {
    return (
      postulacion.value
        ?.estados_postulacion
        ?.observaciones_rrhh ||
      ''
    )
  })


const fechaUltimoCambio =
  computed(() => {
    const fecha =
      postulacion.value
        ?.estados_postulacion
        ?.fecha_ultimo_cambio

    if (!fecha) {
      return 'Sin actualización'
    }

    return new Date(
      fecha,
    ).toLocaleString(
      'es-BO',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      },
    )
  })



const documentos =
  computed(() => {
    const lista =
      postulacion.value
        ?.documentos_postulante

    return Array.isArray(lista)
      ? lista
      : []
  })


const totalDocumentos =
  computed(
    () =>
      documentos.value.length,
  )


const totalDocumentosAprobados =
  computed(() => {
    return documentos.value.filter(
      documento =>
        documento.verificado ===
        true,
    ).length
  })


const documentosObservados =
  computed(() => {
    return documentos.value.filter(
      documento =>
        documento.verificado ===
          false &&
        Boolean(
          documento.observacion,
        ),
    )
  })


const totalDocumentosObservados =
  computed(() => {
    return documentos.value.filter(
      documento =>
        documento.verificado ===
        false &&
        Boolean(
          documento.observacion,
        ),
    ).length
  })


const estadosVisuales = {
  REGISTRADO: {
    titulo:
      'Postulación Registrada',

    mensaje:
      'Tu información fue registrada. Completa todos los pasos requeridos para enviar tu postulación a Talento Humano.',

    simbolo: '✓',

    contenedor:
      'bg-slate-50 border-slate-200',

    icono:
      'bg-slate-200 text-slate-600',

    texto:
      'text-slate-700',

    descripcion:
      'text-slate-600',
  },


  EN_EVALUACION_RRHH: {
    titulo:
      'En Evaluación por Talento Humano',

    mensaje:
      'Tu formulario y documentación fueron recibidos correctamente. Talento Humano está revisando tu postulación.',

    simbolo: '⌛',

    contenedor:
      'bg-blue-50 border-blue-200',

    icono:
      'bg-blue-100 text-blue-700',

    texto:
      'text-blue-800',

    descripcion:
      'text-blue-700',
  },


  OBSERVADO: {
    titulo:
      'Postulación Observada',

    mensaje:
      'Talento Humano encontró información o documentos que necesitan ser corregidos antes de continuar.',

    simbolo: '!',

    contenedor:
      'bg-amber-50 border-amber-200',

    icono:
      'bg-amber-100 text-amber-700',

    texto:
      'text-amber-800',

    descripcion:
      'text-amber-700',
  },


  APROBADO: {
    titulo:
      'Documentación Aprobada',

    mensaje:
      'Talento Humano verificó satisfactoriamente tu documentación. Tu postulación continúa en el proceso de selección.',

    simbolo: '✓',

    contenedor:
      'bg-emerald-50 border-emerald-200',

    icono:
      'bg-emerald-100 text-emerald-700',

    texto:
      'text-emerald-800',

    descripcion:
      'text-emerald-700',
  },


  SELECCIONADO_POR_AREA: {
    titulo:
      'Seleccionado por el Área',

    mensaje:
      'Tu perfil fue seleccionado por un área solicitante. Mantente atento a las próximas instrucciones.',

    simbolo: '✓',

    contenedor:
      'bg-emerald-50 border-emerald-200',

    icono:
      'bg-emerald-100 text-emerald-700',

    texto:
      'text-emerald-800',

    descripcion:
      'text-emerald-700',
  },


  HABILITADO: {
    titulo:
      'Postulación Habilitada',

    mensaje:
      'Tu postulación se encuentra habilitada para continuar con las siguientes etapas del proceso.',

    simbolo: '✓',

    contenedor:
      'bg-emerald-50 border-emerald-200',

    icono:
      'bg-emerald-100 text-emerald-700',

    texto:
      'text-emerald-800',

    descripcion:
      'text-emerald-700',
  },


  APROBADO_PARA_ENTREVISTA: {
    titulo:
      'Aprobado para Entrevista',

    mensaje:
      'Has avanzado a la etapa de entrevista. Talento Humano se comunicará contigo para coordinar fecha y horario.',

    simbolo: '★',

    contenedor:
      'bg-violet-50 border-violet-200',

    icono:
      'bg-violet-100 text-violet-700',

    texto:
      'text-violet-800',

    descripcion:
      'text-violet-700',
  },


  ACEPTADO: {
    titulo:
      'Postulación Aceptada',

    mensaje:
      'Tu postulación fue aceptada. Talento Humano te proporcionará las indicaciones correspondientes para tu incorporación.',

    simbolo: '✓',

    contenedor:
      'bg-emerald-50 border-emerald-300',

    icono:
      'bg-emerald-600 text-white',

    texto:
      'text-emerald-800',

    descripcion:
      'text-emerald-700',
  },


  RECHAZADO: {
    titulo:
      'Postulación No Seleccionada',

    mensaje:
      'El proceso de evaluación de tu postulación ha concluido. Revisa la información proporcionada por Talento Humano.',

    simbolo: '×',

    contenedor:
      'bg-red-50 border-red-200',

    icono:
      'bg-red-100 text-red-700',

    texto:
      'text-red-800',

    descripcion:
      'text-red-700',
  },
}


const configEstado =
  computed(() => {
    return (
      estadosVisuales[
        estadoActual.value
      ] ||
      estadosVisuales.REGISTRADO
    )
  })



const mensajeProximoPaso =
  computed(() => {

    switch (
      estadoActual.value
    ) {
      case 'EN_EVALUACION_RRHH':
        return 'No necesitas realizar ninguna acción por el momento. Talento Humano revisará tu documentación y actualizará el estado de tu postulación.'

      case 'APROBADO':
        return 'Tu documentación fue aprobada. Mantente atento a tu correo electrónico y número celular para conocer las siguientes etapas.'

      case 'APROBADO_PARA_ENTREVISTA':
        return 'Talento Humano se comunicará contigo para coordinar la entrevista correspondiente.'

      case 'ACEPTADO':
        return 'Tu postulación fue aceptada. Mantente atento a las instrucciones de incorporación que recibirás de Talento Humano.'

      case 'RECHAZADO':
        return 'El proceso de esta postulación ha finalizado. Puedes consultar la observación de Talento Humano mostrada en esta pantalla.'

      default:
        return 'Mantente atento a esta página, a tu correo electrónico y a tu número de contacto para conocer cualquier actualización.'
    }
  })



const formatearTipoDocumento = (
  tipo,
) => {

  const nombres = {
    CARTA_SOLICITUD:
      'Carta de Solicitud',

    RECORD_ACADEMICO:
      'Récord Académico',

    HOJA_DE_VIDA:
      'Hoja de Vida',

    FOTOCOPIA_CI:
      'Fotocopia de C.I.',

    FACTURA_SERVICIO_BASICO:
      'Factura de Servicio Básico',

    CROQUIS_DOMICILIO:
      'Croquis de Domicilio',

    REFERENCIAS_PERSONALES:
      'Referencias Personales',
  }


  return (
    nombres[tipo] ||
    tipo
  )
}


const cargarEstado =
  async () => {

    errorMsg.value = ''
    cargando.value = true

    try {
      /*
       * El JWT se envía automáticamente
       * mediante nuestro plugin $api.
       *
       * NO mandamos postulante_id.
       */
      const data =
        await $api(
          '/postulaciones/mi-postulacion',
        )


      if (!data?.id) {
        throw new Error(
          'La información de la postulación no es válida.',
        )
      }


      postulacion.value =
        data

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
        'No se pudo consultar el estado de la postulación.'

    } finally {
      cargando.value = false
    }
  }


const irFormulario =
  async () => {

    await navigateTo(
      '/postulacion/formulario-postulacion',
    )
  }


const irDocumentos =
  async () => {

    await navigateTo(
      '/postulacion/pdf_archivos',
    )
  }


const salir =
  async () => {

    await authStore.logout()
  }

onMounted(async () => {
  await cargarEstado()
})
</script>