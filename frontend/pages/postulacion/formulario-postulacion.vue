<template>
  <div
    class="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-8 font-sans select-none relative overflow-hidden"
  >
    <div
      class="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-200 z-10"
    >
      <div
        class="bg-[#12574c] px-8 py-6 text-white flex items-center justify-between"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-14 h-14 rounded-2xl bg-white/10 p-1.5 flex items-center justify-center border border-white/20 shadow-inner"
          >
            <img
              src="/tele_img.jpeg"
              alt="Logo"
              class="w-full h-full object-cover rounded-xl"
            />
          </div>

          <div>
            <span
              class="text-[11px] font-extrabold tracking-widest uppercase text-emerald-200"
            >
              Paso 2: Datos del Postulante
            </span>

            <h1
              class="text-xl sm:text-2xl font-black tracking-tight"
            >
              Formulario Oficial de Postulación
            </h1>

            <p
              class="text-xs text-emerald-100/80 font-light mt-0.5"
            >
              Convocatoria de Pasantías /
              Modalidades de Graduación
              {{ currentYear }}
            </p>
          </div>
        </div>

        <button
          type="button"
          @click="cerrarSesion"
          title="Cerrar sesión"
          class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold transition"
        >
          Salir
        </button>
      </div>

      <div
        v-if="cargandoDatos"
        class="p-12 text-center"
      >
        <p
          class="text-sm font-bold text-[#12574c]"
        >
          Cargando información del postulante...
        </p>
      </div>

      <form
        v-else
        @submit.prevent="guardarYContinuar"
        class="p-8 space-y-8 max-h-[75vh] overflow-y-auto"
      >
        <div
          v-if="errorMsg"
          class="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold"
        >
          {{ errorMsg }}
        </div>

        <!-- IDENTIDAD PERSONAL -->

        <div class="space-y-4">
          <div
            class="flex items-center justify-between border-b pb-2"
          >
            <h3
              class="text-xs font-black text-[#12574c] uppercase tracking-wider"
            >
              1. Identidad Personal
            </h3>

            <span
              class="text-[11px] text-slate-400 font-semibold"
            >
              Datos pre-registrados
            </span>
          </div>

          <div
            class="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <div>
              <label
                class="block text-xs font-bold text-slate-500 mb-1"
              >
                Apellido Paterno
              </label>

              <input
                v-model="form.apellido_paterno"
                type="text"
                class="input-bloqueado"
                readonly
              />
            </div>

            <div>
              <label
                class="block text-xs font-bold text-slate-500 mb-1"
              >
                Apellido Materno
              </label>

              <input
                v-model="form.apellido_materno"
                type="text"
                class="input-bloqueado"
                readonly
              />
            </div>

            <div>
              <label
                class="block text-xs font-bold text-slate-500 mb-1"
              >
                Nombres
              </label>

              <input
                v-model="form.nombres"
                type="text"
                class="input-bloqueado"
                readonly
              />
            </div>
          </div>

          <div
            class="grid grid-cols-1 sm:grid-cols-4 gap-4"
          >
            <div class="sm:col-span-2">
              <label
                class="block text-xs font-bold text-slate-500 mb-1"
              >
                Carnet de Identidad
              </label>

              <input
                :value="`${form.ci} ${form.expedido}`"
                type="text"
                class="input-bloqueado font-mono"
                readonly
              />
            </div>

            <div>
              <label
                class="block text-xs font-bold text-slate-700 mb-1"
              >
                Fecha de Nacimiento *
              </label>

              <input
                v-model="form.fecha_nacimiento"
                type="date"
                :max="fechaMaximaNacimiento"
                class="input-formulario"
                required
              />

              <p
                class="mt-1 text-[10px] text-slate-500"
              >
                Debe tener al menos 18 años cumplidos.
              </p>
            </div>

            <div>
              <label
                class="block text-xs font-bold text-slate-700 mb-1"
              >
                Sexo *
              </label>

              <select
                v-model="form.genero"
                class="input-formulario font-bold text-slate-700"
                required
              >
                <option
                  value=""
                  disabled
                >
                  Seleccione...
                </option>

                <option value="MASCULINO">
                  MASCULINO
                </option>

                <option value="FEMENINO">
                  FEMENINO
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- CONTACTO -->

        <div class="space-y-4">
          <h3
            class="text-xs font-black text-[#12574c] uppercase tracking-wider border-b pb-2"
          >
            2. Datos de Contacto y Residencia
          </h3>

          <div
            class="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <div>
              <label
                class="block text-xs font-bold text-slate-700 mb-1"
              >
                Número Celular *
              </label>

              <input
                v-model="form.numero_celular"
                type="text"
                inputmode="numeric"
                maxlength="20"
                placeholder="71234567"
                class="input-formulario"
                required
                @input="soloNumeros('numero_celular')"
              />
            </div>

            <div>
              <label
                class="block text-xs font-bold text-slate-700 mb-1"
              >
                Teléfono Fijo
              </label>

              <input
                v-model="form.telefono_fijo"
                type="text"
                inputmode="numeric"
                maxlength="20"
                placeholder="2281000"
                class="input-formulario"
                @input="soloNumeros('telefono_fijo')"
              />
            </div>

            <div>
              <label
                class="block text-xs font-bold text-slate-700 mb-1"
              >
                Ciudad / Municipio *
              </label>

              <select
                v-model="form.ciudad"
                class="input-formulario"
                required
              >
                <option
                  value=""
                  disabled
                >
                  Seleccione...
                </option>

                <option value="La Paz">
                  La Paz
                </option>

                <option value="El Alto">
                  El Alto
                </option>

                <option value="Viacha">
                  Viacha
                </option>

                <option value="Achocalla">
                  Achocalla
                </option>

                <option value="Cochabamba">
                  Cochabamba
                </option>

                <option value="Santa Cruz">
                  Santa Cruz
                </option>

                <option value="Oruro">
                  Oruro
                </option>

                <option value="Otra">
                  Otra
                </option>
              </select>
            </div>

            <div>
              <label
                class="block text-xs font-bold text-slate-700 mb-1"
              >
                Zona de Domicilio *
              </label>

              <input
                v-model="form.zona_domicilio"
                type="text"
                placeholder="Ej: Miraflores, Sopocachi"
                class="input-formulario"
                required
              />
            </div>
          </div>

          <div>
            <label
              class="block text-xs font-bold text-slate-700 mb-1"
            >
              Dirección Detallada *
            </label>

            <input
              v-model="form.direccion_detalle"
              type="text"
              placeholder="Av. Busch N° 1234, Edif. ..."
              class="input-formulario"
              required
            />
          </div>
        </div>

        <!-- FORMACIÓN -->

        <div class="space-y-4">
          <h3
            class="text-xs font-black text-[#12574c] uppercase tracking-wider border-b pb-2"
          >
            3. Formación Académica y Modalidad
          </h3>

          <div
            class="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div>
              <label
                class="block text-xs font-bold text-slate-700 mb-1"
              >
                Universidad o Instituto *
              </label>

              <select
                v-model="form.institucion_id"
                class="input-formulario"
                required
              >
                <option
                  value=""
                  disabled
                >
                  Seleccione institución...
                </option>

                <option
                  v-for="inst in listaInstituciones"
                  :key="inst.id"
                  :value="inst.id"
                >
                  {{ inst.nombre }}
                </option>

                <option value="OTRA">
                  OTRA INSTITUCIÓN
                </option>
              </select>
            </div>

            <div
              v-if="form.institucion_id === 'OTRA'"
            >
              <label
                class="block text-xs font-bold text-emerald-700 mb-1"
              >
                Nombre de la Institución *
              </label>

              <input
                v-model="form.otra_institucion_nombre"
                type="text"
                placeholder="Nombre completo"
                class="input-formulario border-emerald-400 bg-emerald-50/40"
                required
              />
            </div>

            <div>
              <label
                class="block text-xs font-bold text-slate-700 mb-1"
              >
                Modalidad de Postulación *
              </label>

              <select
                v-model="form.modalidad_postulacion"
                class="input-formulario"
                required
              >
                <option value="PASANTIA">
                  PASANTÍA
                </option>

                <option value="TRABAJO_DIRIGIDO">
                  TRABAJO DIRIGIDO
                </option>

                <option value="PROYECTO_DE_GRADO">
                  PROYECTO DE GRADO
                </option>

                <option value="EXCELENCIA_ACADEMICA">
                  EXCELENCIA ACADÉMICA / TESIS
                </option>

                <option value="OTRO">
                  OTRO
                </option>
              </select>
            </div>
          </div>

          <div
            class="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div>
              <label
                class="block text-xs font-bold text-slate-700 mb-1"
              >
                Carrera *
              </label>

              <select
                v-model="form.carrera_id"
                class="input-formulario"
                required
              >
                <option
                  value=""
                  disabled
                >
                  Seleccione su carrera...
                </option>

                <option
                  v-for="carr in listaCarreras"
                  :key="carr.id"
                  :value="carr.id"
                >
                  {{ carr.nombre }}
                </option>

                <option value="OTRA">
                  OTRA CARRERA
                </option>
              </select>
            </div>

            <div
              v-if="form.carrera_id === 'OTRA'"
            >
              <label
                class="block text-xs font-bold text-emerald-700 mb-1"
              >
                Nombre de la Carrera *
              </label>

              <input
                v-model="form.otra_carrera_nombre"
                type="text"
                placeholder="Ej: Electrotecnia..."
                class="input-formulario border-emerald-400 bg-emerald-50/40"
                required
              />
            </div>

            <div>
              <label
                class="block text-xs font-bold text-slate-700 mb-1"
              >
                Semestre que cursa *
              </label>

              <select
                v-model="form.semestre_o_nivel"
                class="input-formulario"
                required
              >
                <option
                  value=""
                  disabled
                >
                  Seleccione semestre...
                </option>

                <option value="1er Semestre">
                  1er Semestre
                </option>

                <option value="2do Semestre">
                  2do Semestre
                </option>

                <option value="3er Semestre">
                  3er Semestre
                </option>

                <option value="4to Semestre">
                  4to Semestre
                </option>

                <option value="5to Semestre">
                  5to Semestre
                </option>

                <option value="6to Semestre">
                  6to Semestre
                </option>

                <option value="7mo Semestre">
                  7mo Semestre
                </option>

                <option value="8vo Semestre">
                  8vo Semestre
                </option>

                <option value="9no Semestre">
                  9no Semestre
                </option>

                <option value="10mo Semestre">
                  10mo Semestre
                </option>

                <option value="11vo Semestre">
                  11vo Semestre
                </option>

                <option value="12vo Semestre">
                  12vo Semestre
                </option>

                <option
                  value="Egresado / En Proyecto de Grado"
                >
                  Egresado / En Proyecto de Grado
                </option>
              </select>
            </div>
          </div>

          <div>
            <label
              class="block text-xs font-bold text-slate-700 mb-2"
            >
              Disponibilidad de Tiempo *
            </label>

            <div
              class="grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
              <label
                class="flex items-center justify-center p-3 rounded-xl border cursor-pointer text-xs font-bold text-center transition"
                :class="
                  form.turno === 'MANANA'
                    ? 'border-[#12574c] bg-emerald-50 text-[#12574c]'
                    : 'border-slate-200 bg-slate-50 text-slate-600'
                "
              >
                <input
                  v-model="form.turno"
                  type="radio"
                  value="MANANA"
                  class="hidden"
                />

                <span>
                  Medio Tiempo (Mañana)
                </span>
              </label>

              <label
                class="flex items-center justify-center p-3 rounded-xl border cursor-pointer text-xs font-bold text-center transition"
                :class="
                  form.turno === 'TARDE'
                    ? 'border-[#12574c] bg-emerald-50 text-[#12574c]'
                    : 'border-slate-200 bg-slate-50 text-slate-600'
                "
              >
                <input
                  v-model="form.turno"
                  type="radio"
                  value="TARDE"
                  class="hidden"
                />

                <span>
                  Medio Tiempo (Tarde)
                </span>
              </label>

              <label
                class="flex items-center justify-center p-3 rounded-xl border cursor-pointer text-xs font-bold text-center transition"
                :class="
                  form.turno === 'TIEMPO_COMPLETO'
                    ? 'border-[#12574c] bg-emerald-50 text-[#12574c]'
                    : 'border-slate-200 bg-slate-50 text-slate-600'
                "
              >
                <input
                  v-model="form.turno"
                  type="radio"
                  value="TIEMPO_COMPLETO"
                  class="hidden"
                />

                <span>
                  Tiempo Completo
                </span>
              </label>
            </div>
          </div>
        </div>

        <div
          class="pt-6 border-t border-slate-100 flex items-center justify-end gap-4"
        >
          <button
            type="submit"
            :disabled="guardando"
            class="px-8 py-4 bg-[#12574c] hover:bg-[#0d433a] disabled:opacity-50 text-white font-black rounded-xl text-xs sm:text-sm uppercase tracking-wider shadow-lg active:scale-95 transition flex items-center gap-2"
          >
            <span>
              {{
                guardando
                  ? 'Guardando...'
                  : 'Confirmar Datos y Subir Documentos'
              }}
            </span>

            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>


<script setup>
import {
  ref,
  reactive,
  computed,
  onMounted,
} from 'vue'

import { useAuthStore } from '@/stores/auth'


definePageMeta({
  middleware: 'postulante',
})


const authStore = useAuthStore()

const { $api } = useNuxtApp()


const currentYear =
  computed(
    () => new Date().getFullYear(),
  )


const fechaMaximaNacimiento =
  computed(() => {
    const hoy =
      new Date()

    const anio =
      hoy.getFullYear() - 18

    const mes =
      hoy.getMonth()

    const ultimoDiaMes =
      new Date(
        anio,
        mes + 1,
        0,
      ).getDate()

    const dia =
      Math.min(
        hoy.getDate(),
        ultimoDiaMes,
      )

    return [
      anio,
      String(
        mes + 1,
      ).padStart(2, '0'),
      String(
        dia,
      ).padStart(2, '0'),
    ].join('-')
  })


const cargandoDatos = ref(true)

const guardando = ref(false)

const errorMsg = ref('')

const listaInstituciones = ref([])

const listaCarreras = ref([])


const form = reactive({
  apellido_paterno: '',
  apellido_materno: '',
  nombres: '',
  ci: '',
  expedido: '',

  fecha_nacimiento: '',
  genero: '',

  numero_celular: '',
  telefono_fijo: '',
  ciudad: '',
  zona_domicilio: '',
  direccion_detalle: '',

  institucion_id: '',
  otra_institucion_nombre: '',

  modalidad_postulacion: 'PASANTIA',

  carrera_id: '',
  otra_carrera_nombre: '',

  semestre_o_nivel: '',

  turno: 'MANANA',
})


const convertirFechaInput = (
  valor,
) => {
  if (!valor) {
    return ''
  }

  return String(valor).slice(0, 10)
}


const cumpleEdadMinima = (
  fechaNacimiento,
) => {
  if (!fechaNacimiento) {
    return false
  }

  return (
    fechaNacimiento <=
    fechaMaximaNacimiento.value
  )
}


const soloNumeros = (
  campo,
) => {
  form[campo] =
    String(form[campo] || '')
      .replace(/\D/g, '')
}


const cargarFormulario = async () => {
  cargandoDatos.value = true
  errorMsg.value = ''

  try {
    const [
      postulante,
      instituciones,
      carreras,
    ] = await Promise.all([
      $api(
        '/postulaciones/mi-postulacion',
      ),

      $api(
        '/instituciones',
      ),

      $api(
        '/carreras',
      ),
    ])


    listaInstituciones.value =
      Array.isArray(instituciones)
        ? instituciones
        : []


    listaCarreras.value =
      Array.isArray(carreras)
        ? carreras
        : []


    form.nombres =
      postulante?.nombres || ''

    form.apellido_paterno =
      postulante?.apellido_paterno || ''

    form.apellido_materno =
      postulante?.apellido_materno || ''

    form.ci =
      postulante?.ci || ''

    form.expedido =
      postulante?.expedido || ''


    form.fecha_nacimiento =
      convertirFechaInput(
        postulante?.fecha_nacimiento,
      )

    form.genero =
      postulante?.genero || ''


    const contacto =
      postulante
        ?.datos_contacto_postulante


    form.numero_celular =
      contacto?.numero_celular || ''

    form.telefono_fijo =
      contacto?.telefono_fijo || ''

    form.ciudad =
      contacto?.ciudad || ''

    form.zona_domicilio =
      contacto?.zona_domicilio || ''

    form.direccion_detalle =
      contacto?.direccion_detalle || ''


    const formacion =
      postulante
        ?.formacion_academica_postulante
        ?.[0]


    if (formacion) {
      form.modalidad_postulacion =
        formacion.modalidad_postulacion ||
        'PASANTIA'

      form.semestre_o_nivel =
        formacion.semestre_o_nivel || ''


      if (
        formacion.institucion_id
      ) {
        form.institucion_id =
          formacion.institucion_id

        form.otra_institucion_nombre =
          ''
      } else if (
        formacion.institucion_nombre
      ) {
        form.institucion_id =
          'OTRA'

        form.otra_institucion_nombre =
          formacion.institucion_nombre
      }


      if (
        formacion.carrera_id
      ) {
        form.carrera_id =
          formacion.carrera_id

        form.otra_carrera_nombre =
          ''
      } else if (
        formacion.carrera
      ) {
        form.carrera_id =
          'OTRA'

        form.otra_carrera_nombre =
          formacion.carrera
      }
    }


    const disponibilidad =
      postulante
        ?.disponibilidad_horaria_postulante


    form.turno =
      disponibilidad?.turno ||
      'MANANA'

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
      'No se pudieron cargar los datos del postulante.'

  } finally {
    cargandoDatos.value = false
  }
}


const guardarYContinuar = async () => {
  errorMsg.value = ''


  if (
    !form.fecha_nacimiento
  ) {
    errorMsg.value =
      'Debe ingresar su fecha de nacimiento.'

    return
  }


  if (
    !cumpleEdadMinima(
      form.fecha_nacimiento,
    )
  ) {
    errorMsg.value =
      'Debe tener al menos 18 años cumplidos para postular.'

    return
  }


  if (
    form.institucion_id === 'OTRA' &&
    !form.otra_institucion_nombre.trim()
  ) {
    errorMsg.value =
      'Debe escribir el nombre de la institución.'

    return
  }


  if (
    form.carrera_id === 'OTRA' &&
    !form.otra_carrera_nombre.trim()
  ) {
    errorMsg.value =
      'Debe escribir el nombre de la carrera.'

    return
  }


  if (
    form.numero_celular.trim().length < 7
  ) {
    errorMsg.value =
      'Ingrese un número de celular válido.'

    return
  }


  guardando.value = true


  try {
    const payload = {
      fecha_nacimiento:
        form.fecha_nacimiento,

      genero:
        form.genero,

      numero_celular:
        form.numero_celular.trim(),

      telefono_fijo:
        form.telefono_fijo.trim() ||
        undefined,

      ciudad:
        form.ciudad.trim(),

      zona_domicilio:
        form.zona_domicilio.trim(),

      direccion_detalle:
        form.direccion_detalle.trim(),

      institucion_id:
        form.institucion_id,

      otra_institucion_nombre:
        form.institucion_id === 'OTRA'
          ? form.otra_institucion_nombre.trim()
          : undefined,

      carrera_id:
        form.carrera_id,

      otra_carrera_nombre:
        form.carrera_id === 'OTRA'
          ? form.otra_carrera_nombre.trim()
          : undefined,

      modalidad_postulacion:
        form.modalidad_postulacion,

      semestre_o_nivel:
        form.semestre_o_nivel,

      turno:
        form.turno,
    }


    await $api(
      '/postulaciones/completar-formulario',
      {
        method: 'POST',
        body: payload,
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

          tieneFormularioCompleto:
            true,
        },
      )
    }


    await navigateTo(
      '/postulacion/pdf_archivos',
    )

  } catch (error) {
    console.error(
      'ERROR COMPLETO DEL BACKEND:',
      error?.data || error,
    )


    const mensajeServidor =
      Array.isArray(
        error?.data?.message,
      )
        ? error.data.message.join(', ')
        : error?.data?.message


    errorMsg.value =
      mensajeServidor ||
      error?.message ||
      'No se pudo guardar el formulario.'


    alert(
      errorMsg.value,
    )

  } finally {
    guardando.value = false
  }
}


const cerrarSesion = async () => {
  await authStore.logout()
}


onMounted(async () => {
  await cargarFormulario()
})
</script>


<style scoped>
.input-formulario {
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
  font-size: 0.8125rem;
  color: #1e293b;
  outline: none;
  transition: all 0.2s ease;
}

.input-formulario:focus {
  background-color: #ffffff;
  border-color: #12574c;
  box-shadow:
    0 0 0 3px
    rgba(18, 87, 76, 0.15);
}

.input-bloqueado {
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 0.8125rem;
  color: #64748b;
  font-weight: 700;
  cursor: not-allowed;
  outline: none;
}
</style>