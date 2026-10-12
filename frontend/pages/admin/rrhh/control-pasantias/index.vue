
<template>
  <div class="postulantes-wrapper font-sans text-slate-700">
    <!-- MENÚ LATERAL -->
    <aside class="sidebar-corporate hidden md:flex">
      <div>
        <div class="flex items-center gap-3 pb-6 border-b border-white/10">
          <div class="avatar-mini">
            <img
              src="/tele_img.jpeg"
              alt="Mi Teleférico"
              class="w-full h-full object-cover rounded-lg"
            >
          </div>
          <div>
            <h2 class="text-xs font-black tracking-wider uppercase text-white">
              Mi Teleférico
            </h2>
            <p class="text-[10px] text-emerald-200">
              Talento Humano
            </p>
          </div>
        </div>

        <nav class="space-y-1.5 mt-6">
          <NuxtLink to="/admin/rrhh/dashboard" class="nav-link">
            Dashboard
          </NuxtLink>

          <NuxtLink
            to="/admin/rrhh/postulantes_registrados/inf_postulante"
            class="nav-link"
          >
            Postulantes Registrados
          </NuxtLink>

          <NuxtLink to="/admin/rrhh/peticiones" class="nav-link">
            Peticiones Áreas
          </NuxtLink>

          <NuxtLink to="/admin/rrhh/pasantes" class="nav-link">
            Pasantes Activos
          </NuxtLink>

          <NuxtLink
            to="/admin/rrhh/control-pasantias"
            class="nav-link active"
          >
            Control de Pasantías
          </NuxtLink>
        </nav>
      </div>

      <div class="pt-4 border-t border-white/10">
        <button
          type="button"
          class="w-full py-2.5 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-300 font-bold rounded-xl text-xs transition"
          @click="cerrarSesion"
        >
          Cerrar Sesión
        </button>
      </div>
    </aside>

    <!-- CONTENIDO -->
    <div class="flex-1 flex flex-col min-w-0">
      <header class="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div>
          <h1 class="text-base font-black text-slate-800">
            Control de Pasantías
          </h1>
          <p class="text-xs text-slate-400 font-medium">
            Seguimiento y control administrativo
          </p>
        </div>

        <div class="text-right hidden sm:block">
          <p class="text-xs font-bold text-slate-800">
            {{ authStore.usuario?.nombres }}
            {{ authStore.usuario?.apellidos }}
          </p>
          <span class="text-xs text-emerald-700">
            {{ authStore.usuario?.cargo || 'RRHH' }}
          </span>
        </div>
      </header>

      <main class="p-6 flex-1 overflow-y-auto">
        <div class="pasantes-page">
          <div class="pasantes-header">
            <div>
              <p class="pasantes-label">Gestión administrativa</p>
              <h1>Control y seguimiento de pasantías</h1>
              <p>
                Administre documentación, materiales y estados
                de los pasantes registrados.
              </p>
            </div>

            <button
              type="button"
              class="pasantes-refresh"
              :disabled="cargando"
              @click="cargarDatos"
            >
              {{ cargando ? 'Actualizando...' : 'Actualizar' }}
            </button>
          </div>

          <div v-if="errorGeneral" class="pasantes-error" role="alert">
            {{ errorGeneral }}
          </div>

          <!-- INDICADORES -->
          <section class="pasantes-kpis">
            <article class="pasante-kpi">
              <span>Total</span>
              <strong>{{ resumen.total }}</strong>
            </article>
            <article class="pasante-kpi active">
              <span>Activos</span>
              <strong>{{ resumen.activos }}</strong>
            </article>
            <article class="pasante-kpi suspended">
              <span>Suspendidos</span>
              <strong>{{ resumen.suspendidos }}</strong>
            </article>
            <article class="pasante-kpi finished">
              <span>Finalizados</span>
              <strong>{{ resumen.finalizados }}</strong>
            </article>
            <article class="pasante-kpi abandoned">
              <span>Abandonos</span>
              <strong>{{ resumen.abandonos }}</strong>
            </article>
          </section>

          <!-- FILTROS -->
          <div class="pasantes-toolbar">
            <input
              v-model="busqueda"
              type="search"
              class="pasantes-search"
              placeholder="Buscar por nombre, CI, carrera o departamento..."
            >

            <select v-model="filtroEstado" class="pasantes-select">
              <option value="TODOS">Todos los estados</option>
              <option value="ACTIVO">Activos</option>
              <option value="SUSPENDIDO">Suspendidos</option>
              <option value="FINALIZADO">Finalizados</option>
              <option value="ABANDONO">Abandonos</option>
            </select>

            <select v-model="filtroDepartamento" class="pasantes-select">
              <option value="">Todos los departamentos</option>
              <option
                v-for="nombre in departamentos"
                :key="nombre"
                :value="nombre"
              >
                {{ nombre }}
              </option>
            </select>
          </div>

          <!-- TABLA -->
          <section class="pasantes-table-card">
            <div v-if="cargando" class="pasantes-loading">
              <strong>Cargando información</strong>
              <p>Consultando el registro de pasantes...</p>
            </div>

            <div
              v-else-if="pasantesFiltrados.length === 0"
              class="pasantes-empty"
            >
              <strong>No se encontraron pasantes</strong>
              <p>Pruebe con otros filtros de búsqueda.</p>
            </div>

            <div v-else class="pasantes-table-scroll">
              <table class="pasantes-table">
                <thead>
                  <tr>
                    <th>Pasante</th>
                    <th>Institución / Carrera</th>
                    <th>Departamento</th>
                    <th>Supervisor</th>
                    <th>Estado</th>
                    <th>Control</th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="pasante in pasantesFiltrados"
                    :key="pasante.id"
                  >
                    <td>
                      <div class="pasante-person">
                        <strong>
                          {{ pasante.postulante?.nombre_completo }}
                        </strong>
                        <span>CI: {{ pasante.postulante?.ci }}</span>
                      </div>
                    </td>

                    <td>
                      <div class="pasante-person">
                        <strong>
                          {{ pasante.formacion?.carrera || 'Sin registro' }}
                        </strong>
                        <span>
                          {{ pasante.formacion?.institucion || 'Sin institución' }}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div class="pasante-area">
                        <strong>
                          {{ pasante.departamento?.nombre || 'Sin departamento' }}
                        </strong>
                        <span>{{ pasante.gerencia?.nombre }}</span>
                      </div>
                    </td>

                    <td>
                      {{ pasante.supervisor?.nombre_completo || 'Sin supervisor' }}
                    </td>

                    <td>
                      <span
                        class="pasante-status"
                        :class="claseEstado(pasante.estado)"
                      >
                        {{ etiquetaEstado(pasante.estado) }}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        class="pasante-btn-detail"
                        @click="abrirControl(pasante)"
                      >
                        Gestionar
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>

    <!-- MODAL CONTROL ADMINISTRATIVO -->
    <div
      v-if="pasanteSeleccionado"
      class="pasante-modal-overlay"
      @click.self="cerrarControl"
    >
      <div
        class="pasante-modal control-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-control"
      >
        <div class="pasante-modal-header">
          <div>
            <p class="pasantes-label">Expediente administrativo</p>
            <h2 id="titulo-control">
              {{ pasanteSeleccionado.postulante?.nombre_completo }}
            </h2>
            <p class="control-subtitulo">
              {{ pasanteSeleccionado.departamento?.nombre }}
              · {{ etiquetaEstado(pasanteSeleccionado.estado) }}
            </p>
          </div>

          <button
            type="button"
            class="pasante-modal-close"
            :disabled="guardando || procesandoEstado"
            @click="cerrarControl"
          >
            ×
          </button>
        </div>

        <div class="pasante-modal-body">
          <div v-if="cargandoControl" class="pasantes-loading">
            <strong>Cargando ficha administrativa...</strong>
          </div>

          <template v-else>
            <div
              v-if="errorControl"
              class="pasantes-error"
              role="alert"
            >
              {{ errorControl }}
            </div>

            <template v-if="controlCargado">
              <h3 class="pasante-section-title">
                Información académica y horas
              </h3>

              <div class="pasante-followup-grid">
                <div class="pasante-followup-card">
                  <span>Fecha de inicio</span>
                  <strong>
                    {{ formatearFecha(pasanteSeleccionado.seguimiento?.fecha_inicio) }}
                  </strong>
                </div>
                <div class="pasante-followup-card">
                  <span>Fecha de conclusión</span>
                  <strong>
                    {{ formatearFecha(pasanteSeleccionado.seguimiento?.fecha_conclusion) }}
                  </strong>
                </div>
                <div class="pasante-followup-card">
                  <span>Horas requeridas</span>
                  <strong>
                    {{ pasanteSeleccionado.seguimiento?.horas_requeridas ?? 'No definidas' }}
                  </strong>
                </div>
              </div>

              <div class="control-aviso">
                El registro de horas realizadas se incorporará
                posteriormente mediante la base de datos biométrica.
              </div>

              <h3 class="pasante-section-title">
                Documentación administrativa
              </h3>

              <div class="control-grid">
                <label class="control-check">
                  <input
                    v-model="formulario.induccion"
                    type="checkbox"
                  >
                  Inducción realizada
                </label>

                <label class="control-check">
                  <input
                    v-model="formulario.compromiso"
                    type="checkbox"
                  >
                  Compromiso registrado
                </label>

                <label class="control-field">
                  Carta T3
                  <input
                    v-model="formulario.carta_t3"
                    maxlength="50"
                    placeholder="Ej.: ENTREGADO / PENDIENTE"
                  >
                </label>

                <label class="control-field">
                  Seguro contra accidentes
                  <input
                    v-model="formulario.seguro_contra_accidente"
                    maxlength="50"
                    placeholder="Ej.: VIGENTE / PENDIENTE"
                  >
                </label>
              </div>

              <h3 class="pasante-section-title">
                Credencial y chamarra
              </h3>

              <div class="control-grid">
                <label class="control-field">
                  Talla de chamarra
                  <select v-model="formulario.talla_chamarra">
                    <option value="NO_ENTREGADO">No entregada</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </select>
                </label>

                <label class="control-field">
                  Código de credencial
                  <input
                    v-model="formulario.credencial_codigo"
                    maxlength="100"
                    placeholder="Código de credencial"
                  >
                </label>

                <label class="control-field">
                  Devolución de tarjeta
                  <input
                    v-model="formulario.fecha_devolucion_tarjeta"
                    type="date"
                  >
                </label>

                <label class="control-field">
                  Devolución de chamarra
                  <input
                    v-model="formulario.fecha_devolucion_chamarra"
                    type="date"
                  >
                </label>

                <label class="control-field">
                  Reposición de tarjeta
                  <input
                    v-model="formulario.reposicion_tarjeta"
                    maxlength="100"
                    placeholder="Detalle de reposición"
                  >
                </label>
              </div>

              <h3 class="pasante-section-title">
                Certificación
              </h3>

              <label class="control-check">
                <input
                  v-model="formulario.certificado_emitido"
                  type="checkbox"
                >
                Certificado emitido
              </label>

              <div class="control-actions">
                <button
                  type="button"
                  class="pasante-btn-config"
                  :disabled="guardando || procesandoEstado || !hayCambios"
                  @click="guardarControl"
                >
                  {{ guardando ? 'Guardando...' : 'Guardar control administrativo' }}
                </button>
              </div>

              <h3 class="pasante-section-title">
                Estado de la pasantía
              </h3>

              <p class="control-help">
                Estas acciones modifican el estado del pasante.
                Requieren confirmación y quedan registradas en auditoría.
              </p>

              <div class="pasante-action-buttons control-state-actions">
                <template v-if="pasanteSeleccionado.estado === 'ACTIVO'">
                  <button
                    type="button"
                    class="pasante-btn-suspend"
                    :disabled="guardando"
                    @click="abrirAccion('SUSPENDER')"
                  >
                    Suspender
                  </button>

                  <button
                    type="button"
                    class="pasante-btn-abandon"
                    :disabled="guardando"
                    @click="abrirAccion('ABANDONO')"
                  >
                    Registrar abandono
                  </button>

                  <button
                    type="button"
                    class="pasante-btn-finish"
                    :disabled="guardando"
                    @click="abrirAccion('FINALIZAR')"
                  >
                    Finalizar
                  </button>
                </template>

                <template v-else-if="pasanteSeleccionado.estado === 'SUSPENDIDO'">
                  <button
                    type="button"
                    class="pasante-btn-reactivate"
                    :disabled="guardando"
                    @click="abrirAccion('REACTIVAR')"
                  >
                    Reactivar
                  </button>

                  <button
                    type="button"
                    class="pasante-btn-abandon"
                    :disabled="guardando"
                    @click="abrirAccion('ABANDONO')"
                  >
                    Registrar abandono
                  </button>
                </template>

                <p v-else class="control-help">
                  La pasantía se encuentra en un estado definitivo.
                </p>
              </div>
            </template>
          </template>
        </div>

        <div class="pasante-modal-actions">
          <button
            type="button"
            class="pasante-btn-close"
            :disabled="guardando || procesandoEstado"
            @click="cerrarControl"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL CONFIRMAR ESTADO -->
    <div
      v-if="modalEstado && pasanteSeleccionado"
      class="pasante-modal-overlay control-confirm-overlay"
    >
      <div
        class="pasante-state-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-estado"
      >
        <div class="pasante-modal-header">
          <div>
            <p class="pasantes-label">Confirmación administrativa</p>
            <h2 id="titulo-estado">{{ accionActual?.titulo }}</h2>
          </div>
          <button
            type="button"
            class="pasante-modal-close"
            :disabled="procesandoEstado"
            @click="cerrarAccion"
          >
            ×
          </button>
        </div>

        <div class="pasante-modal-body">
          <div class="pasante-state-info">
            <span>Pasante</span>
            <strong>
              {{ pasanteSeleccionado.postulante?.nombre_completo }}
            </strong>
          </div>

          <div
            v-if="accionEstado === 'FINALIZAR'"
            class="pasante-state-warning"
          >
            La validación biométrica de las horas todavía no
            está integrada. El sistema actual permite finalizar
            con una planificación registrada, sin verificar
            automáticamente el cumplimiento de las horas.
          </div>

          <div v-if="errorEstado" class="pasante-state-error">
            {{ errorEstado }}
          </div>

          <div class="pasante-form-group">
            <label>
              {{ accionActual?.etiqueta }}
              {{ accionEstado !== 'FINALIZAR' ? '*' : '' }}
            </label>

            <textarea
              v-model="motivoEstado"
              class="pasante-state-textarea"
              maxlength="1000"
              rows="5"
              :disabled="procesandoEstado"
              :placeholder="accionActual?.placeholder"
            />

            <span class="pasante-state-count">
              {{ motivoEstado.length }}/1000
            </span>
          </div>
        </div>

        <div class="pasante-modal-actions control-confirm-actions">
          <button
            type="button"
            class="pasante-btn-close"
            :disabled="procesandoEstado"
            @click="cerrarAccion"
          >
            Cancelar
          </button>

          <button
            type="button"
            :class="accionActual?.clase"
            :disabled="procesandoEstado || (accionEstado !== 'FINALIZAR' && !motivoEstado.trim())"
            @click="confirmarAccion"
          >
            {{ procesandoEstado ? 'Procesando...' : accionActual?.titulo }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

definePageMeta({
  middleware: 'admin',
})

type EstadoPasante =
  | 'ACTIVO'
  | 'SUSPENDIDO'
  | 'FINALIZADO'
  | 'ABANDONO'

type TallaChamarra =
  | 'NO_ENTREGADO'
  | 'S'
  | 'M'
  | 'L'
  | 'XL'
  | 'XXL'

type AccionEstado =
  | 'SUSPENDER'
  | 'REACTIVAR'
  | 'ABANDONO'
  | 'FINALIZAR'

interface Pasante {
  id: string
  estado: EstadoPasante
  postulante?: {
    nombre_completo: string
    ci: string
  }
  formacion?: {
    carrera: string
    institucion: string
  } | null
  departamento?: {
    nombre: string
  } | null
  gerencia?: {
    nombre: string
  } | null
  supervisor?: {
    nombre_completo: string
  } | null
  seguimiento?: {
    fecha_inicio: string
    fecha_conclusion: string
    horas_requeridas: number | null
    horas_realizadas: number
    horas_faltantes: number | null
  } | null
}

interface Resumen {
  total: number
  activos: number
  suspendidos: number
  finalizados: number
  abandonos: number
}

interface RespuestaPasantes {
  resumen: Resumen
  pasantes: Pasante[]
}

interface ControlAdministrativo {
  talla_chamarra: TallaChamarra
  credencial_codigo: string | null
  induccion: boolean
  compromiso: boolean
  carta_t3: string | null
  seguro_contra_accidente: string | null
  fecha_devolucion_tarjeta: string | null
  fecha_devolucion_chamarra: string | null
  reposicion_tarjeta: string | null
  certificado_emitido: boolean
}

interface RespuestaControl {
  control: ControlAdministrativo | null
}

interface RespuestaOperacion {
  message?: string
}

interface ErrorApi {
  data?: {
    message?: string | string[]
  }
  message?: string
}

const authStore = useAuthStore()
const { $api } = useNuxtApp()

const cargando = ref(false)
const errorGeneral = ref('')
const busqueda = ref('')
const filtroEstado = ref('TODOS')
const filtroDepartamento = ref('')

const pasantes = ref<Pasante[]>([])

const resumen = ref<Resumen>({
  total: 0,
  activos: 0,
  suspendidos: 0,
  finalizados: 0,
  abandonos: 0,
})

const pasanteSeleccionado = ref<Pasante | null>(null)
const cargandoControl = ref(false)
const controlCargado = ref(false)
const guardando = ref(false)
const errorControl = ref('')

const crearFormulario = (): ControlAdministrativo => ({
  talla_chamarra: 'NO_ENTREGADO',
  credencial_codigo: '',
  induccion: false,
  compromiso: false,
  carta_t3: 'NO CORRESPONDE',
  seguro_contra_accidente: 'NO CORRESPONDE',
  fecha_devolucion_tarjeta: null,
  fecha_devolucion_chamarra: null,
  reposicion_tarjeta: '',
  certificado_emitido: false,
})

const formulario = ref<ControlAdministrativo>(crearFormulario())
const valoresOriginales = ref<ControlAdministrativo>(crearFormulario())

const hayCambios = computed(
  () => JSON.stringify(formulario.value) !==
    JSON.stringify(valoresOriginales.value),
)

const modalEstado = ref(false)
const accionEstado = ref<AccionEstado | null>(null)
const motivoEstado = ref('')
const errorEstado = ref('')
const procesandoEstado = ref(false)

const departamentos = computed(() => {
  return [...new Set(
    pasantes.value
      .map((pasante) => pasante.departamento?.nombre)
      .filter((valor): valor is string => Boolean(valor)),
  )].sort((a, b) => a.localeCompare(b, 'es'))
})

const pasantesFiltrados = computed(() => {
  const termino = busqueda.value.trim().toLowerCase()

  return pasantes.value.filter((pasante) => {
    if (
      filtroEstado.value !== 'TODOS' &&
      pasante.estado !== filtroEstado.value
    ) {
      return false
    }

    if (
      filtroDepartamento.value &&
      pasante.departamento?.nombre !== filtroDepartamento.value
    ) {
      return false
    }

    const texto = [
      pasante.postulante?.nombre_completo,
      pasante.postulante?.ci,
      pasante.formacion?.carrera,
      pasante.departamento?.nombre,
      pasante.supervisor?.nombre_completo,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return texto.includes(termino)
  })
})

const configuraciones: Record<AccionEstado, {
  titulo: string
  etiqueta: string
  placeholder: string
  clase: string
  endpoint: string
}> = {
  SUSPENDER: {
    titulo: 'Suspender pasantía',
    etiqueta: 'Motivo de suspensión',
    placeholder: 'Explique el motivo de suspensión...',
    clase: 'pasante-btn-suspend',
    endpoint: 'suspender',
  },
  REACTIVAR: {
    titulo: 'Reactivar pasantía',
    etiqueta: 'Motivo de reactivación',
    placeholder: 'Explique por qué se reactiva...',
    clase: 'pasante-btn-reactivate',
    endpoint: 'reactivar',
  },
  ABANDONO: {
    titulo: 'Registrar abandono',
    etiqueta: 'Motivo de abandono',
    placeholder: 'Describa el motivo de abandono...',
    clase: 'pasante-btn-abandon',
    endpoint: 'abandono',
  },
  FINALIZAR: {
    titulo: 'Finalizar pasantía',
    etiqueta: 'Observación',
    placeholder: 'Observación de finalización (opcional)...',
    clase: 'pasante-btn-finish',
    endpoint: 'finalizar',
  },
}

const accionActual = computed(() =>
  accionEstado.value
    ? configuraciones[accionEstado.value]
    : null,
)

function obtenerError(error: unknown): string {
  if (typeof error !== 'object' || error === null) {
    return 'Ocurrió un error inesperado.'
  }

  const e = error as ErrorApi
  const mensaje = e.data?.message

  if (Array.isArray(mensaje)) return mensaje.join(', ')
  return mensaje || e.message || 'Ocurrió un error inesperado.'
}

function claseEstado(estado: EstadoPasante): string {
  const clases: Record<EstadoPasante, string> = {
    ACTIVO: 'active',
    SUSPENDIDO: 'suspended',
    FINALIZADO: 'finished',
    ABANDONO: 'abandoned',
  }
  return clases[estado]
}

function etiquetaEstado(estado: EstadoPasante): string {
  const etiquetas: Record<EstadoPasante, string> = {
    ACTIVO: 'Activo',
    SUSPENDIDO: 'Suspendido',
    FINALIZADO: 'Finalizado',
    ABANDONO: 'Abandono',
  }
  return etiquetas[estado]
}

function fechaInput(valor: string | null | undefined): string {
  return valor ? valor.slice(0, 10) : ''
}

function formatearFecha(valor: string | null | undefined): string {
  const fecha = fechaInput(valor)
  if (!fecha) return 'Sin registro'
  const [anio, mes, dia] = fecha.split('-')
  return `${dia}/${mes}/${anio}`
}

async function cargarDatos(): Promise<void> {
  cargando.value = true
  errorGeneral.value = ''

  try {
    const respuesta = await $api<RespuestaPasantes>('/rrhh/pasantes')
    pasantes.value = respuesta.pasantes ?? []
    resumen.value = respuesta.resumen
  } catch (error: unknown) {
    errorGeneral.value = obtenerError(error)
  } finally {
    cargando.value = false
  }
}

async function abrirControl(pasante: Pasante): Promise<void> {
  pasanteSeleccionado.value = pasante
  cargandoControl.value = true
  controlCargado.value = false
  errorControl.value = ''

  try {
    const respuesta = await $api<RespuestaControl>(
      `/rrhh/pasantes/${pasante.id}/control-administrativo`,
    )

    formulario.value = {
      ...crearFormulario(),
      ...respuesta.control,
      fecha_devolucion_tarjeta: fechaInput(
        respuesta.control?.fecha_devolucion_tarjeta,
      ) || null,
      fecha_devolucion_chamarra: fechaInput(
        respuesta.control?.fecha_devolucion_chamarra,
      ) || null,
    }

    valoresOriginales.value = { ...formulario.value }
    controlCargado.value = true
  } catch (error: unknown) {
    errorControl.value = obtenerError(error)
  } finally {
    cargandoControl.value = false
  }
}

function cerrarControl(): void {
  if (guardando.value || procesandoEstado.value || modalEstado.value) {
    return
  }

  pasanteSeleccionado.value = null
  controlCargado.value = false
  errorControl.value = ''
}

async function guardarControl(): Promise<void> {
  if (!pasanteSeleccionado.value || !hayCambios.value || guardando.value) {
    return
  }

  guardando.value = true
  errorControl.value = ''

  const anterior = { ...valoresOriginales.value }
  const actual = { ...formulario.value }

  // PATCH parcial: enviar únicamente los campos modificados.
  // Las fechas vacías no se envían: el backend actual no
  // admite establecerlas en null.
  const cambios: Partial<ControlAdministrativo> = {}

  for (const clave of Object.keys(actual) as (keyof ControlAdministrativo)[]) {
    if (actual[clave] !== anterior[clave]) {
      if (
        (clave === 'fecha_devolucion_tarjeta' ||
          clave === 'fecha_devolucion_chamarra') &&
        !actual[clave]
      ) {
        errorControl.value =
          'El backend actual no permite borrar una fecha registrada. ' +
          'Debe implementarse esa operación antes de quitarla.'
        guardando.value = false
        return
      }

      Object.assign(cambios, { [clave]: actual[clave] })
    }
  }

  try {
    await $api<RespuestaOperacion>(
      `/rrhh/pasantes/${pasanteSeleccionado.value.id}/control-administrativo`,
      {
        method: 'PATCH',
        body: cambios,
      },
    )

    valoresOriginales.value = { ...formulario.value }
    alert('Control administrativo guardado correctamente.')
  } catch (error: unknown) {
    errorControl.value = obtenerError(error)
  } finally {
    guardando.value = false
  }
}

function abrirAccion(accion: AccionEstado): void {
  if (!pasanteSeleccionado.value || hayCambios.value) {
    errorControl.value = hayCambios.value
      ? 'Guarde primero los cambios administrativos pendientes.'
      : 'Seleccione un pasante.'
    return
  }

  accionEstado.value = accion
  motivoEstado.value = ''
  errorEstado.value = ''
  modalEstado.value = true
}

function cerrarAccion(): void {
  if (procesandoEstado.value) return
  modalEstado.value = false
  accionEstado.value = null
}

async function confirmarAccion(): Promise<void> {
  const pasante = pasanteSeleccionado.value
  const accion = accionEstado.value

  if (!pasante || !accion || procesandoEstado.value) return

  if (accion !== 'FINALIZAR' && !motivoEstado.value.trim()) {
    errorEstado.value = 'Debe registrar el motivo.'
    return
  }

  procesandoEstado.value = true
  errorEstado.value = ''

  try {
    const body = accion === 'FINALIZAR'
      ? { observacion: motivoEstado.value.trim() }
      : { motivo: motivoEstado.value.trim() }

    await $api<RespuestaOperacion>(
      `/rrhh/pasantes/${pasante.id}/${configuraciones[accion].endpoint}`,
      {
        method: 'PATCH',
        body,
      },
    )

    modalEstado.value = false
    accionEstado.value = null

    await cargarDatos()

    pasanteSeleccionado.value =
      pasantes.value.find((item) => item.id === pasante.id) ?? null

    alert('Estado de la pasantía actualizado correctamente.')
  } catch (error: unknown) {
    errorEstado.value = obtenerError(error)
  } finally {
    procesandoEstado.value = false
  }
}

async function cerrarSesion(): Promise<void> {
  authStore.logout()
  await navigateTo('/')
}

onMounted(async () => {
  authStore.cargarSesion()

  if (!authStore.estaAutenticado) {
    await navigateTo('/')
    return
  }

  await cargarDatos()
})
</script>


<style scoped>
@import '@/assets/css/inf-postulantes.css';
@import '@/assets/css/pasantes-rrhh.css';
@import '@/assets/css/control-pasantias.css';
</style>
