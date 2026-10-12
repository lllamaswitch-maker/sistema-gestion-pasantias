<template>
  <div
    class="min-h-screen psp-gradient flex items-center justify-center p-4 sm:p-8 font-sans select-none relative overflow-hidden"
  >
    <div
      class="absolute inset-0 pointer-events-none overflow-hidden opacity-25 z-0"
    >
      <svg
        class="absolute -bottom-10 left-0 w-[200%] h-[75%] psp-wave-1 text-sky-300 fill-current"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          d="M0,160L60,144C120,128,240,96,360,112C480,128,600,192,720,192C840,192,960,128,1080,117.3C1200,107,1320,149,1380,170.7L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
        />
      </svg>
    </div>

    <div
      class="modal-animate relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-100 z-10"
    >
      <!-- CABECERA -->

      <div
        class="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white"
      >
        <div class="flex items-center gap-5">
          <div
            class="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-white flex items-center justify-center p-1 border-2 border-slate-200/80 shadow-md flex-shrink-0"
          >
            <img
              src="/tele_img.jpeg"
              alt="Logo Mi Teleferico"
              class="w-full h-full object-cover rounded-xl"
            />
          </div>

          <div>
            <span
              class="text-xs font-extrabold uppercase tracking-widest text-[#004b93]"
            >
              Paso 3 de 3
            </span>

            <h1
              class="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight"
            >
              Carga de Documentos Oficiales
            </h1>

            <p
              class="text-xs sm:text-sm text-slate-500 font-normal mt-1"
            >
              Requisitos obligatorios para la postulación a pasantías
              {{ currentYear }}
            </p>
          </div>
        </div>

        <button
          type="button"
          @click="navigateTo('/')"
          class="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm font-bold transition"
          title="Cerrar y volver al inicio"
        >
          ✕
        </button>
      </div>

      <!-- CUERPO -->

      <div class="p-8 sm:p-10 space-y-6">
        <div
          v-if="errorMsg"
          class="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold"
        >
          {{ errorMsg }}
        </div>

        <!-- REQUISITOS -->

        <div>
          <label
            class="block text-xs sm:text-sm font-extrabold text-slate-700 mb-3 uppercase tracking-wider"
          >
            Seleccione el documento a adjuntar:
          </label>

          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
          >
            <button
              v-for="(req, index) in requisitos"
              :key="req.tipo"
              type="button"
              @click="requisitoActivo = index"
              class="flex items-start gap-3 p-3.5 rounded-2xl border text-left text-sm transition-all duration-200"
              :class="
                requisitoActivo === index
                  ? 'border-[#004b93] bg-[#004b93]/10 text-[#004b93] font-bold ring-2 ring-[#004b93]/20'
                  : archivos[req.tipo]
                    ? 'border-emerald-300 bg-emerald-50/60 text-slate-800'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
              "
            >
              <span
                class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5"
                :class="
                  archivos[req.tipo]
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 text-slate-700'
                "
              >
                {{ archivos[req.tipo] ? '✓' : index + 1 }}
              </span>

              <div class="flex flex-col min-w-0 flex-1">
                <span
                  class="font-bold truncate text-xs sm:text-sm"
                >
                  {{ req.titulo }}
                </span>

                <span
                  v-if="archivos[req.tipo]"
                  class="text-[11px] text-emerald-700 font-semibold truncate mt-0.5"
                >
                  Confirmado
                </span>

                <span
                  v-else
                  class="text-[10px] text-slate-400 font-normal"
                >
                  Pendiente
                </span>
              </div>
            </button>
          </div>
        </div>

        <!-- INFORMACIÓN DEL DOCUMENTO -->

        <div
          class="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 flex items-start gap-3"
        >
          <div
            class="w-8 h-8 rounded-xl bg-[#004b93] text-white flex items-center justify-center font-black text-xs flex-shrink-0 mt-0.5"
          >
            INF
          </div>

          <div>
            <h4
              class="text-sm font-bold text-slate-800"
            >
              {{ requisitoSeleccionado.titulo }}
            </h4>

            <p
              class="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed"
            >
              {{ requisitoSeleccionado.descripcion }}
            </p>

            <p
              class="text-[11px] text-[#004b93] font-bold mt-2"
            >
              Antes de confirmar, revise la vista previa y asegúrese
              de que el PDF corresponda exactamente a este requisito.
            </p>
          </div>
        </div>

        <!-- CARGA -->

        <div
          v-if="!archivos[requisitoSeleccionado.tipo]"
          class="relative border-2 border-dashed rounded-3xl p-10 sm:p-14 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer"
          :class="
            isDragging
              ? 'border-[#004b93] bg-blue-50/50 scale-[1.01]'
              : 'border-slate-300 bg-slate-50/40 hover:border-[#004b93] hover:bg-slate-50'
          "
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
          @click="fileInput?.click()"
        >
          <input
            ref="fileInput"
            type="file"
            accept="application/pdf,.pdf"
            class="hidden"
            @change="handleFileChange"
          />

          <div
            class="icon-bounce w-16 h-16 rounded-2xl bg-white shadow-md border border-slate-200 flex items-center justify-center mb-4 text-[#004b93]"
          >
            <svg
              class="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          <p
            class="text-base sm:text-lg font-bold text-slate-700"
          >
            Arrastra y suelta tu archivo o
            <span
              class="text-[#004b93] underline font-extrabold"
            >
              selecciona un documento
            </span>
            para revisar
          </p>

          <p
            class="text-xs sm:text-sm text-slate-400 mt-1.5 font-medium"
          >
            Formato requerido: PDF · Máximo 5 MB
          </p>
        </div>

        <!-- ARCHIVO CONFIRMADO -->

        <div
          v-else
          class="p-6 bg-white border border-emerald-200 rounded-3xl shadow-sm flex flex-col gap-4"
        >
          <div
            class="flex items-center justify-between"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-xs border border-emerald-100 shadow-sm"
              >
                PDF
              </div>

              <div>
                <p
                  class="text-sm sm:text-base font-bold text-slate-800 truncate max-w-xs sm:max-w-md"
                >
                  {{ archivos[requisitoSeleccionado.tipo].name }}
                </p>

                <p
                  class="text-xs text-emerald-600 font-semibold"
                >
                  Documento revisado y confirmado
                </p>

                <p
                  class="text-xs text-slate-400 font-medium mt-0.5"
                >
                  {{
                    formatSize(
                      archivos[requisitoSeleccionado.tipo].size,
                    )
                  }}
                </p>
              </div>
            </div>

            <button
              type="button"
              @click="
                eliminarArchivo(
                  requisitoSeleccionado.tipo,
                )
              "
              class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center text-xs font-bold transition"
              title="Quitar archivo"
            >
              ✕
            </button>
          </div>

          <div
            class="w-full bg-slate-100 h-2 rounded-full overflow-hidden"
          >
            <div
              class="bg-emerald-500 h-full rounded-full w-full"
            />
          </div>
        </div>
      </div>

      <!-- PIE -->

      <div
        class="px-8 py-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div
          class="flex items-center gap-2.5 text-sm text-slate-600 font-medium"
        >
          <span
            class="w-3 h-3 rounded-full"
            :class="
              totalSubidos === requisitos.length
                ? 'bg-emerald-500'
                : 'bg-amber-500'
            "
          />

          <span>
            Completados:
            <strong
              class="text-slate-800 font-bold"
            >
              {{ totalSubidos }} de {{ requisitos.length }}
            </strong>
            requisitos
          </span>
        </div>

        <div
          class="flex items-center gap-4 w-full sm:w-auto"
        >
          <button
            type="button"
            @click="
              navigateTo(
                '/postulacion/formulario-postulacion',
              )
            "
            class="w-1/2 sm:w-auto px-6 py-3.5 border-2 border-slate-200 hover:bg-slate-200/60 text-slate-600 font-bold rounded-2xl text-xs sm:text-sm uppercase tracking-wider transition active:scale-95"
          >
            ← Volver a Datos
          </button>

          <button
            type="button"
            :disabled="
              totalSubidos < requisitos.length ||
              enviando
            "
            @click="finalizarPostulacion"
            class="w-1/2 sm:w-auto px-8 py-3.5 bg-[#12574c] hover:bg-[#0e433a] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-2xl text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-emerald-900/20 active:scale-95 transition"
          >
            {{
              enviando
                ? 'Subiendo Documentos...'
                : 'Finalizar Postulación'
            }}
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL DE PREVISUALIZACIÓN -->

    <div
      v-if="modalPrevisualizacion"
      class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
      @click.self="cancelarPrevisualizacion"
    >
      <div
        class="bg-white w-full max-w-5xl max-h-[95vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        <!-- CABECERA MODAL -->

        <div
          class="px-6 py-5 border-b border-slate-200 flex items-start justify-between gap-4"
        >
          <div>
            <p
              class="text-[11px] font-black uppercase tracking-widest text-[#004b93]"
            >
              Verificación antes de cargar
            </p>

            <h2
              class="text-xl sm:text-2xl font-black text-slate-800 mt-1"
            >
              {{ requisitoPendiente?.titulo }}
            </h2>

            <p
              class="text-sm text-slate-500 mt-1"
            >
              Revise cuidadosamente el documento antes de confirmarlo.
            </p>
          </div>

          <button
            type="button"
            @click="cancelarPrevisualizacion"
            class="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-black"
          >
            ✕
          </button>
        </div>

        <!-- ADVERTENCIA -->

        <div
          class="mx-6 mt-5 p-4 rounded-2xl bg-amber-50 border border-amber-200"
        >
          <p
            class="text-sm font-black text-amber-900"
          >
            ¿Este archivo corresponde realmente a
            {{ requisitoPendiente?.titulo }}?
          </p>

          <p
            class="text-xs sm:text-sm text-amber-800 mt-1"
          >
            {{ requisitoPendiente?.descripcion }}
          </p>
        </div>

        <!-- DATOS DEL ARCHIVO -->

        <div
          class="mx-6 mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
        >
          <div>
            <p
              class="text-xs text-slate-400 font-semibold"
            >
              Archivo seleccionado
            </p>

            <p
              class="text-sm font-bold text-slate-700 break-all"
            >
              {{ archivoPendiente?.name }}
            </p>
          </div>

          <span
            class="text-xs font-bold text-slate-500"
          >
            {{
              archivoPendiente
                ? formatSize(archivoPendiente.size)
                : ''
            }}
          </span>
        </div>

        <!-- PDF -->

        <div
          class="m-6 mt-4 rounded-2xl border border-slate-200 overflow-hidden bg-slate-100 flex-1 min-h-0"
        >
          <iframe
            v-if="vistaPreviaUrl"
            :src="vistaPreviaUrl"
            title="Vista previa del documento PDF"
            class="w-full h-[50vh] sm:h-[55vh] bg-white"
          />
        </div>

        <!-- BOTONES -->

        <div
          class="px-6 py-5 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-end gap-3"
        >
          <button
            type="button"
            @click="cancelarPrevisualizacion"
            class="px-6 py-3.5 rounded-xl border-2 border-slate-200 bg-white hover:bg-slate-100 text-slate-600 font-bold text-xs sm:text-sm uppercase tracking-wide transition"
          >
            Elegir otro archivo
          </button>

          <button
            type="button"
            @click="confirmarArchivo"
            class="px-7 py-3.5 rounded-xl bg-[#12574c] hover:bg-[#0e433a] text-white font-black text-xs sm:text-sm uppercase tracking-wide shadow-md transition"
          >
            Sí, corresponde. Confirmar
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
  onBeforeUnmount,
} from 'vue'

import {
  usePostulacionStore,
} from '@/stores/postulacion'

import {
  useAuthStore,
} from '@/stores/auth'


definePageMeta({
  middleware: 'postulante',
})


const store =
  usePostulacionStore()

const authStore =
  useAuthStore()

const { $api } =
  useNuxtApp()


const currentYear =
  computed(
    () =>
      new Date().getFullYear(),
  )


const isDragging =
  ref(false)

const requisitoActivo =
  ref(0)

const fileInput =
  ref(null)

const enviando =
  ref(false)

const errorMsg =
  ref('')


const modalPrevisualizacion =
  ref(false)

const archivoPendiente =
  ref(null)

const requisitoPendiente =
  ref(null)

const vistaPreviaUrl =
  ref('')


const requisitos = [
  {
    tipo:
      'CARTA_SOLICITUD',

    titulo:
      'Carta de Solicitud',

    descripcion:
      'Carta oficial de la universidad o instituto dirigida por una autoridad competente.',
  },

  {
    tipo:
      'RECORD_ACADEMICO',

    titulo:
      'Récord Académico',

    descripcion:
      'Certificado de notas firmado y sellado por Kardex o fotocopia verificada.',
  },

  {
    tipo:
      'HOJA_DE_VIDA',

    titulo:
      'Hoja de Vida',

    descripcion:
      'Currículum Vitae actualizado del postulante (no documentado).',
  },

  {
    tipo:
      'FOTOCOPIA_CI',

    titulo:
      'Fotocopia de C.I.',

    descripcion:
      'Fotocopia clara del Carnet de Identidad vigente (anverso y reverso).',
  },

  {
    tipo:
      'FACTURA_SERVICIO_BASICO',

    titulo:
      'Factura de Servicio',

    descripcion:
      'Factura reciente de servicio básico (luz, agua o gas) del domicilio actual.',
  },

  {
    tipo:
      'CROQUIS_DOMICILIO',

    titulo:
      'Croquis de Domicilio',

    descripcion:
      'Plano o croquis claro de la ubicación exacta de residencia.',
  },

  {
    tipo:
      'REFERENCIAS_PERSONALES',

    titulo:
      'Referencias Personales',

    descripcion:
      'Dos referencias con fotocopia de C.I., números de contacto y croquis.',
  },
]


const requisitoSeleccionado =
  computed(() =>
    requisitos[
      requisitoActivo.value
    ] || requisitos[0],
  )


const archivos =
  ref({
    ...(store.archivos || {}),
  })


const totalSubidos =
  computed(() =>
    requisitos.filter(
      requisito =>
        archivos.value[
          requisito.tipo
        ],
    ).length,
  )


onMounted(
  async () => {
    if (
      !authStore.token ||
      !authStore.usuario
    ) {
      await navigateTo(
        '/postulacion/login',
      )
    }
  },
)


onBeforeUnmount(
  () => {
    liberarVistaPrevia()
  },
)


const liberarVistaPrevia =
  () => {
    if (
      vistaPreviaUrl.value
    ) {
      URL.revokeObjectURL(
        vistaPreviaUrl.value,
      )

      vistaPreviaUrl.value =
        ''
    }
  }


const abrirPrevisualizacion =
  (
    file,
    requisito,
  ) => {
    liberarVistaPrevia()

    archivoPendiente.value =
      file

    requisitoPendiente.value =
      {
        ...requisito,
      }

    vistaPreviaUrl.value =
      URL.createObjectURL(
        file,
      )

    modalPrevisualizacion.value =
      true
  }


const cancelarPrevisualizacion =
  () => {
    modalPrevisualizacion.value =
      false

    archivoPendiente.value =
      null

    requisitoPendiente.value =
      null

    liberarVistaPrevia()
  }


const confirmarArchivo =
  () => {
    if (
      !archivoPendiente.value ||
      !requisitoPendiente.value
    ) {
      errorMsg.value =
        'No se pudo confirmar el documento seleccionado.'

      cancelarPrevisualizacion()

      return
    }


    const tipo =
      requisitoPendiente.value.tipo


    archivos.value[tipo] =
      archivoPendiente.value


    store.archivos = {
      ...archivos.value,
    }


    modalPrevisualizacion.value =
      false

    archivoPendiente.value =
      null

    requisitoPendiente.value =
      null

    liberarVistaPrevia()


    const siguiente =
      requisitos.findIndex(
        item =>
          !archivos.value[
            item.tipo
          ],
      )


    if (
      siguiente !== -1
    ) {
      requisitoActivo.value =
        siguiente
    }


    errorMsg.value =
      ''
  }


const procesarArchivo =
  file => {
    errorMsg.value =
      ''


    if (!file) {
      return
    }


    const nombre =
      file.name
        ?.toLowerCase() ||
      ''


    const esPdfPorNombre =
      nombre.endsWith(
        '.pdf',
      )


    const mimePermitido =
      !file.type ||
      file.type ===
        'application/pdf'


    if (
      !esPdfPorNombre ||
      !mimePermitido
    ) {
      errorMsg.value =
        'Solo se admiten documentos en formato PDF.'

      return
    }


    const maximo =
      5 * 1024 * 1024


    if (
      file.size >
      maximo
    ) {
      errorMsg.value =
        'El archivo supera el límite permitido de 5 MB.'

      return
    }


    if (
      file.size <= 0
    ) {
      errorMsg.value =
        'El archivo seleccionado está vacío.'

      return
    }


    const requisito =
      requisitoSeleccionado.value


    if (!requisito) {
      errorMsg.value =
        'No se pudo identificar el tipo de documento.'

      return
    }


    abrirPrevisualizacion(
      file,
      requisito,
    )
  }


const handleFileChange =
  event => {
    const file =
      event.target.files?.[0]


    procesarArchivo(
      file,
    )


    event.target.value =
      ''
  }


const handleDrop =
  event => {
    isDragging.value =
      false


    const file =
      event.dataTransfer
        ?.files?.[0]


    procesarArchivo(
      file,
    )
  }


const eliminarArchivo =
  tipo => {
    delete archivos.value[
      tipo
    ]


    store.archivos = {
      ...archivos.value,
    }


    errorMsg.value =
      ''
  }


const formatSize =
  bytes => {
    if (!bytes) {
      return '0 KB'
    }


    const kb =
      bytes / 1024


    if (
      kb < 1024
    ) {
      return `${kb.toFixed(1)} KB`
    }


    return `${(
      kb / 1024
    ).toFixed(2)} MB`
  }


const obtenerMensajeError =
  (
    error,
    mensajeDefault,
  ) => {
    const mensaje =
      error?.data?.message


    if (
      Array.isArray(
        mensaje,
      )
    ) {
      return mensaje.join(
        ', ',
      )
    }


    if (
      typeof mensaje ===
        'string' &&
      mensaje.trim()
    ) {
      return mensaje
    }


    return (
      error?.message ||
      mensajeDefault
    )
  }


const finalizarPostulacion =
  async () => {
    errorMsg.value =
      ''


    if (
      totalSubidos.value !==
      requisitos.length
    ) {
      errorMsg.value =
        'Debe cargar los 7 documentos requeridos antes de finalizar.'

      return
    }


    if (
      !authStore.token ||
      !authStore.usuario
    ) {
      errorMsg.value =
        'La sesión no es válida. Inicie sesión nuevamente.'


      await navigateTo(
        '/postulacion/login',
      )


      return
    }


    enviando.value =
      true


    try {
      for (
        const requisito
        of requisitos
      ) {
        const file =
          archivos.value[
            requisito.tipo
          ]


        if (!file) {
          throw new Error(
            `Falta el documento: ${requisito.titulo}.`,
          )
        }


        const formData =
          new FormData()


        formData.append(
          'file',
          file,
        )


        formData.append(
          'tipo_documento',
          requisito.tipo,
        )


        await $api(
          '/documentos/upload',
          {
            method:
              'POST',

            body:
              formData,
          },
        )
      }


      await $api(
        '/documentos/finalizar',
        {
          method:
            'POST',
        },
      )


      if (
        authStore.token &&
        authStore.usuario
      ) {
        authStore.setLogin(
          authStore.token,
          {
            ...authStore.usuario,

            tieneDocumentosCompletos:
              true,
          },
        )
      }


      archivos.value =
        {}


      if (
        typeof store.reset ===
        'function'
      ) {
        store.reset()
      } else {
        store.archivos =
          {}
      }


      await navigateTo(
        '/postulacion/estado',
      )

    } catch (error) {
      errorMsg.value =
        obtenerMensajeError(
          error,
          'Ocurrió un error al subir los documentos.',
        )

    } finally {
      enviando.value =
        false
    }
  }
</script>