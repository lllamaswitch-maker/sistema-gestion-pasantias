<template>
  <div class="supervisor-wrapper">
    <div class="supervisor-canvas">

      <aside class="supervisor-sidebar">
        <div>

          <div class="supervisor-profile">
            <div class="supervisor-avatar">
              {{ inicialesSupervisor }}
            </div>

            <h2 class="supervisor-name">
              {{ nombreSupervisor }}
            </h2>

            <p class="supervisor-email">
              {{ authStore.usuario?.email }}
            </p>

            <span class="supervisor-role">
              SUPERVISOR
            </span>
          </div>

          <nav class="supervisor-nav">

            <NuxtLink
              to="/supervisor/dashboard"
              class="supervisor-nav-item"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-6h6v6h4a1 1 0 001-1V10"
                />
              </svg>

              <span>
                Dashboard
              </span>
            </NuxtLink>

            <NuxtLink
              to="/supervisor/postulantes"
              class="supervisor-nav-item"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H3v-2a4 4 0 014-4h2m4-4a4 4 0 100-8 4 4 0 000 8z"
                />
              </svg>

              <span>
                Postulantes
              </span>
            </NuxtLink>

            <NuxtLink
              to="/supervisor/pasantes"
              class="supervisor-nav-item"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m5-2a9 9 0 11-16 0 9 9 0 0116 0z"
                />
              </svg>

              <span>
                Pasantes Activos
              </span>
            </NuxtLink>

            <button
              type="button"
              class="supervisor-nav-item"
              @click="moduloPendiente('Calendario')"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3M5 11h14M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"
                />
              </svg>

              <span>
                Calendario
              </span>
            </button>

            <NuxtLink
              to="/supervisor/reportes"
              class="supervisor-nav-item active"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 17v-6m4 6V7m4 10v-3M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>

              <span>
                Reportes
              </span>
            </NuxtLink>

          </nav>
        </div>

        <button
          type="button"
          class="supervisor-logout"
          @click="cerrarSesion"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
            />
          </svg>

          <span>
            Cerrar Sesión
          </span>
        </button>
      </aside>

      <main class="supervisor-main">

        <header class="supervisor-header">
          <div>
            <p class="supervisor-eyebrow">
              Seguimiento de pasantías
            </p>

            <h1>
              Reportes de comportamiento
            </h1>

            <p class="supervisor-header-description">
              Registre observaciones, reconocimientos,
              incidentes y evaluaciones relacionadas con
              los pasantes bajo su supervisión.
            </p>
          </div>

          <div class="supervisor-header-actions">
            <SupervisorNotifications />

            <div class="supervisor-date">
              <span>
                Gestión
              </span>

              <strong>
                {{ currentYear }}
              </strong>
            </div>
          </div>
        </header>

        <div
          v-if="mensajeModulo"
          class="supervisor-info-message"
        >
          <div>
            <strong>
              {{ mensajeModulo }}
            </strong>

            <p>
              Este módulo será implementado posteriormente.
            </p>
          </div>

          <button
            type="button"
            @click="mensajeModulo = ''"
          >
            ×
          </button>
        </div>

        <section class="sup-reportes-page">

          <div class="sup-reportes-header">
            <div>
              <p class="sup-reportes-label">
                Seguimiento de pasantes
              </p>

              <h2>
                {{
                  vistaActiva === 'ACTUALES'
                    ? 'Reportes actuales'
                    : 'Historial de reportes'
                }}
              </h2>

              <p v-if="vistaActiva === 'ACTUALES'">
                Consulte los reportes correspondientes a
                pasantes activos o suspendidos actualmente
                bajo su supervisión.
              </p>

              <p v-else>
                Consulte los reportes históricos de
                pasantes que finalizaron o abandonaron
                su pasantía.
              </p>
            </div>

            <button
              v-if="vistaActiva === 'ACTUALES'"
              type="button"
              class="sup-reportes-new"
              :disabled="
                cargandoPasantes ||
                pasantesReportables.length === 0
              "
              @click="abrirNuevoReporte"
            >
              Nuevo reporte
            </button>
          </div>

          <div
            v-if="mensajeExito"
            class="sup-reportes-success"
          >
            {{ mensajeExito }}
          </div>

          <div
            v-if="errorMensaje"
            class="sup-reportes-error"
          >
            {{ errorMensaje }}
          </div>

          <!-- VISTA ACTUALES / HISTORIAL -->

          <div class="sup-reportes-tabs">

            <button
              type="button"
              class="sup-reportes-tab"
              :class="{
                active:
                  vistaActiva === 'ACTUALES',
              }"
              @click="cambiarVista('ACTUALES')"
            >
              Reportes actuales

              <span class="sup-reportes-tab-count">
                {{ reportesActuales.length }}
              </span>
            </button>

            <button
              type="button"
              class="sup-reportes-tab"
              :class="{
                active:
                  vistaActiva === 'HISTORIAL',
              }"
              @click="cambiarVista('HISTORIAL')"
            >
              Historial

              <span class="sup-reportes-tab-count">
                {{ reportesHistorial.length }}
              </span>
            </button>

          </div>

          <!-- KPIs -->

          <section class="sup-reportes-kpis">

            <article class="sup-reporte-kpi">
              <span>
                Total
              </span>

              <strong>
                {{ resumenVista.total }}
              </strong>
            </article>

            <article class="sup-reporte-kpi observation">
              <span>
                Observaciones
              </span>

              <strong>
                {{ resumenVista.observaciones }}
              </strong>
            </article>

            <article class="sup-reporte-kpi recognition">
              <span>
                Reconocimientos
              </span>

              <strong>
                {{ resumenVista.reconocimientos }}
              </strong>
            </article>

            <article class="sup-reporte-kpi incident">
              <span>
                Incidentes
              </span>

              <strong>
                {{ resumenVista.incidentes }}
              </strong>
            </article>

            <article class="sup-reporte-kpi evaluation">
              <span>
                Evaluaciones
              </span>

              <strong>
                {{ resumenVista.evaluaciones }}
              </strong>
            </article>

          </section>

          <!-- FILTRO POR TIPO -->

          <div class="sup-reportes-tabs">

            <button
              v-for="tab in tabs"
              :key="tab.valor"
              type="button"
              class="sup-reportes-tab"
              :class="{
                active:
                  tipoActivo === tab.valor,
              }"
              @click="tipoActivo = tab.valor"
            >
              {{ tab.nombre }}

              <span class="sup-reportes-tab-count">
                {{ tab.cantidad }}
              </span>
            </button>

          </div>

          <!-- BUSQUEDA -->

          <div class="sup-reportes-toolbar">

            <input
              v-model="busqueda"
              type="text"
              class="sup-reportes-search"
              placeholder="Buscar por pasante, CI, título o departamento..."
            />

            <select
              v-model="pasanteFiltro"
              class="sup-reportes-select"
            >
              <option value="">
                Todos los pasantes
              </option>

              <option
                v-for="pasante in pasantesConReportes"
                :key="pasante.id"
                :value="pasante.id"
              >
                {{ pasante.nombre }}
              </option>
            </select>

          </div>

          <!-- TABLA -->

          <section class="sup-reportes-card">

            <div
              v-if="cargandoReportes"
              class="sup-reportes-loading"
            >
              <strong>
                Cargando reportes
              </strong>

              <p>
                Espere un momento.
              </p>
            </div>

            <div
              v-else-if="reportesVisibles.length === 0"
              class="sup-reportes-empty"
            >
              <strong>
                {{
                  vistaActiva === 'ACTUALES'
                    ? 'No existen reportes actuales'
                    : 'No existen reportes históricos'
                }}
              </strong>

              <p>
                No se encontraron registros con los
                criterios seleccionados.
              </p>
            </div>

            <div
              v-else
              class="sup-reportes-table-scroll"
            >

              <table class="sup-reportes-table">

                <thead>
                  <tr>
                    <th>
                      Fecha
                    </th>

                    <th>
                      Pasante
                    </th>

                    <th>
                      Tipo
                    </th>

                    <th>
                      Reporte
                    </th>

                    <th>
                      Área
                    </th>

                    <th>
                      Acción
                    </th>
                  </tr>
                </thead>

                <tbody>

                  <tr
                    v-for="reporte in reportesVisibles"
                    :key="reporte.id"
                  >

                    <td>
                      {{
                        formatearFecha(
                          reporte.fecha_reporte,
                        )
                      }}
                    </td>

                    <td>
                      <div class="sup-reporte-person">

                        <strong>
                          {{
                            reporte.pasante
                              ?.nombre_completo ||
                            'Sin nombre'
                          }}
                        </strong>

                        <span>
                          CI:
                          {{
                            reporte.pasante?.ci ||
                            'S/D'
                          }}
                          ·
                          {{
                            nombreEstado(
                              reporte.pasante?.estado,
                            )
                          }}
                        </span>

                      </div>
                    </td>

                    <td>
                      <span
                        class="sup-reporte-type"
                        :class="
                          claseTipo(
                            reporte.tipo,
                          )
                        "
                      >
                        {{
                          nombreTipo(
                            reporte.tipo,
                          )
                        }}
                      </span>
                    </td>

                    <td>
                      <span class="sup-reporte-title">
                        {{ reporte.titulo }}
                      </span>
                    </td>

                    <td>
                      <div class="sup-reporte-person">

                        <strong>
                          {{
                            reporte.pasante
                              ?.departamento ||
                            'Sin departamento'
                          }}
                        </strong>

                        <span>
                          {{
                            reporte.pasante
                              ?.gerencia ||
                            'Sin gerencia'
                          }}
                        </span>

                      </div>
                    </td>

                    <td>
                      <button
                        type="button"
                        class="sup-reporte-detail-button"
                        @click="
                          abrirDetalle(
                            reporte,
                          )
                        "
                      >
                        Ver detalle
                      </button>
                    </td>

                  </tr>

                </tbody>

              </table>

            </div>

          </section>

        </section>

      </main>
    </div>

    <!-- NUEVO REPORTE -->

    <div
      v-if="modalNuevo"
      class="sup-reporte-modal-overlay"
      @click.self="cerrarNuevoReporte"
    >
      <div class="sup-reporte-modal">

        <div class="sup-reporte-modal-header">

          <div>
            <p class="sup-reportes-label">
              Seguimiento del pasante
            </p>

            <h2>
              Nuevo reporte
            </h2>
          </div>

          <button
            type="button"
            class="sup-reporte-modal-close"
            :disabled="guardando"
            @click="cerrarNuevoReporte"
          >
            ×
          </button>

        </div>

        <form @submit.prevent="guardarReporte">

          <div class="sup-reporte-modal-body">

            <div
              v-if="errorFormulario"
              class="sup-reportes-error"
            >
              {{ errorFormulario }}
            </div>

            <div class="sup-reporte-form-grid">

              <div class="sup-reporte-field full">
                <label>
                  Pasante
                </label>

                <select
                  v-model="form.pasante_id"
                  required
                >
                  <option value="">
                    Seleccione un pasante
                  </option>

                  <option
                    v-for="pasante in pasantesReportables"
                    :key="pasante.id"
                    :value="pasante.id"
                  >
                    {{
                      pasante.postulante
                        ?.nombre_completo
                    }}
                    —
                    {{
                      nombreEstado(
                        pasante.estado,
                      )
                    }}
                  </option>
                </select>
              </div>

              <div class="sup-reporte-field">
                <label>
                  Tipo de reporte
                </label>

                <select
                  v-model="form.tipo"
                  required
                >
                  <option value="OBSERVACION">
                    Observación
                  </option>

                  <option value="RECONOCIMIENTO">
                    Reconocimiento
                  </option>

                  <option value="INCIDENTE">
                    Incidente
                  </option>

                  <option value="EVALUACION">
                    Evaluación
                  </option>
                </select>
              </div>

              <div class="sup-reporte-field">
                <label>
                  Fecha del reporte
                </label>

                <input
                  v-model="form.fecha_reporte"
                  type="date"
                  :max="fechaHoy"
                  required
                />
              </div>

              <div class="sup-reporte-field full">
                <label>
                  Título
                </label>

                <input
                  v-model="form.titulo"
                  type="text"
                  maxlength="150"
                  placeholder="Ej.: Cumplimiento de actividades asignadas"
                  required
                />

                <span class="sup-reporte-counter">
                  {{ form.titulo.length }}/150
                </span>
              </div>

              <div class="sup-reporte-field full">
                <label>
                  Descripción
                </label>

                <textarea
                  v-model="form.descripcion"
                  maxlength="3000"
                  placeholder="Describa de forma clara y objetiva el hecho, observación, reconocimiento o evaluación."
                  required
                />

                <span class="sup-reporte-counter">
                  {{ form.descripcion.length }}/3000
                </span>
              </div>

            </div>

          </div>

          <div class="sup-reporte-modal-actions">

            <button
              type="button"
              class="sup-reporte-cancel-button"
              :disabled="guardando"
              @click="cerrarNuevoReporte"
            >
              Cancelar
            </button>

            <button
              type="submit"
              class="sup-reporte-save-button"
              :disabled="guardando"
            >
              {{
                guardando
                  ? 'Guardando...'
                  : 'Registrar reporte'
              }}
            </button>

          </div>

        </form>

      </div>
    </div>

    <!-- DETALLE -->

    <div
      v-if="reporteSeleccionado"
      class="sup-reporte-modal-overlay"
      @click.self="cerrarDetalle"
    >
      <div class="sup-reporte-modal">

        <div class="sup-reporte-modal-header">

          <div>
            <p class="sup-reportes-label">
              Detalle del reporte
            </p>

            <h2>
              {{ reporteSeleccionado.titulo }}
            </h2>
          </div>

          <button
            type="button"
            class="sup-reporte-modal-close"
            @click="cerrarDetalle"
          >
            ×
          </button>

        </div>

        <div class="sup-reporte-modal-body">

          <div class="sup-reporte-detail-grid">

            <div class="sup-reporte-detail">
              <span>
                Pasante
              </span>

              <strong>
                {{
                  reporteSeleccionado
                    .pasante
                    ?.nombre_completo ||
                  'No registrado'
                }}
              </strong>
            </div>

            <div class="sup-reporte-detail">
              <span>
                CI
              </span>

              <strong>
                {{
                  reporteSeleccionado
                    .pasante?.ci ||
                  'No registrado'
                }}
              </strong>
            </div>

            <div class="sup-reporte-detail">
              <span>
                Estado
              </span>

              <strong>
                {{
                  nombreEstado(
                    reporteSeleccionado
                      .pasante?.estado,
                  )
                }}
              </strong>
            </div>

            <div class="sup-reporte-detail">
              <span>
                Tipo
              </span>

              <strong>
                {{
                  nombreTipo(
                    reporteSeleccionado.tipo,
                  )
                }}
              </strong>
            </div>

            <div class="sup-reporte-detail">
              <span>
                Fecha
              </span>

              <strong>
                {{
                  formatearFecha(
                    reporteSeleccionado
                      .fecha_reporte,
                  )
                }}
              </strong>
            </div>

            <div class="sup-reporte-detail">
              <span>
                Gerencia
              </span>

              <strong>
                {{
                  reporteSeleccionado
                    .pasante?.gerencia ||
                  'No registrada'
                }}
              </strong>
            </div>

            <div class="sup-reporte-detail">
              <span>
                Departamento
              </span>

              <strong>
                {{
                  reporteSeleccionado
                    .pasante
                    ?.departamento ||
                  'No registrado'
                }}
              </strong>
            </div>

          </div>

          <div class="sup-reporte-description">
            {{
              reporteSeleccionado.descripcion
            }}
          </div>

        </div>

        <div class="sup-reporte-modal-actions">

          <button
            type="button"
            class="sup-reporte-cancel-button"
            @click="cerrarDetalle"
          >
            Cerrar
          </button>

        </div>

      </div>
    </div>

  </div>
</template>


<script setup>
import {
  computed,
  onMounted,
  reactive,
  ref,
} from 'vue'

import {
  useAuthStore,
} from '@/stores/auth'


definePageMeta({
  middleware: 'supervisor',
})


const authStore =
  useAuthStore()

const { $api } =
  useNuxtApp()


const cargandoReportes =
  ref(true)

const cargandoPasantes =
  ref(true)

const guardando =
  ref(false)

const errorMensaje =
  ref('')

const mensajeExito =
  ref('')

const errorFormulario =
  ref('')

const mensajeModulo =
  ref('')

const tipoActivo =
  ref('TODOS')

const vistaActiva =
  ref('ACTUALES')

const busqueda =
  ref('')

const pasanteFiltro =
  ref('')

const modalNuevo =
  ref(false)

const reporteSeleccionado =
  ref(null)


const datos =
  ref({
    resumen: {
      total: 0,
      observaciones: 0,
      reconocimientos: 0,
      incidentes: 0,
      evaluaciones: 0,
    },
    reportes: [],
  })


const pasantes =
  ref([])


const obtenerFechaLocal =
  () => {
    const fecha =
      new Date()

    const anio =
      fecha.getFullYear()

    const mes =
      String(
        fecha.getMonth() + 1,
      ).padStart(2, '0')

    const dia =
      String(
        fecha.getDate(),
      ).padStart(2, '0')

    return `${anio}-${mes}-${dia}`
  }


const fechaHoy =
  obtenerFechaLocal()


const form =
  reactive({
    pasante_id: '',
    tipo: 'OBSERVACION',
    titulo: '',
    descripcion: '',
    fecha_reporte:
      fechaHoy,
  })


const currentYear =
  computed(
    () =>
      new Date()
        .getFullYear(),
  )


const nombreSupervisor =
  computed(() => {
    const nombres =
      authStore.usuario?.nombres ||
      ''

    const apellidos =
      authStore.usuario?.apellidos ||
      ''

    return (
      `${nombres} ${apellidos}`
        .trim() ||
      'Supervisor'
    )
  })


const inicialesSupervisor =
  computed(() => {
    const nombre =
      String(
        authStore.usuario?.nombres ||
        '',
      )
        .trim()
        .charAt(0)

    const apellido =
      String(
        authStore.usuario?.apellidos ||
        '',
      )
        .trim()
        .charAt(0)

    return (
      `${nombre}${apellido}`
        .toUpperCase() ||
      'S'
    )
  })


const todosLosReportes =
  computed(() => {
    if (
      !Array.isArray(
        datos.value?.reportes,
      )
    ) {
      return []
    }

    return datos.value.reportes
  })


const reportesActuales =
  computed(() =>
    todosLosReportes.value.filter(
      reporte =>
        reporte.pasante?.estado ===
          'ACTIVO' ||
        reporte.pasante?.estado ===
          'SUSPENDIDO',
    ),
  )


const reportesHistorial =
  computed(() =>
    todosLosReportes.value.filter(
      reporte =>
        reporte.pasante?.estado ===
          'FINALIZADO' ||
        reporte.pasante?.estado ===
          'ABANDONO',
    ),
  )


const reportesBaseVista =
  computed(() => {
    if (
      vistaActiva.value ===
      'HISTORIAL'
    ) {
      return reportesHistorial.value
    }

    return reportesActuales.value
  })


const resumenVista =
  computed(() => {
    const lista =
      reportesBaseVista.value

    return {
      total:
        lista.length,

      observaciones:
        lista.filter(
          item =>
            item.tipo ===
            'OBSERVACION',
        ).length,

      reconocimientos:
        lista.filter(
          item =>
            item.tipo ===
            'RECONOCIMIENTO',
        ).length,

      incidentes:
        lista.filter(
          item =>
            item.tipo ===
            'INCIDENTE',
        ).length,

      evaluaciones:
        lista.filter(
          item =>
            item.tipo ===
            'EVALUACION',
        ).length,
    }
  })


const tabs =
  computed(() => [
    {
      valor: 'TODOS',
      nombre: 'Todos',
      cantidad:
        resumenVista.value.total,
    },

    {
      valor: 'OBSERVACION',
      nombre: 'Observaciones',
      cantidad:
        resumenVista.value
          .observaciones,
    },

    {
      valor: 'RECONOCIMIENTO',
      nombre: 'Reconocimientos',
      cantidad:
        resumenVista.value
          .reconocimientos,
    },

    {
      valor: 'INCIDENTE',
      nombre: 'Incidentes',
      cantidad:
        resumenVista.value
          .incidentes,
    },

    {
      valor: 'EVALUACION',
      nombre: 'Evaluaciones',
      cantidad:
        resumenVista.value
          .evaluaciones,
    },
  ])


const pasantesReportables =
  computed(() => {
    if (
      !Array.isArray(
        pasantes.value,
      )
    ) {
      return []
    }

    return pasantes.value.filter(
      item =>
        item.estado ===
          'ACTIVO' ||
        item.estado ===
          'SUSPENDIDO',
    )
  })


const pasantesConReportes =
  computed(() => {
    const mapa =
      new Map()

    for (
      const reporte
      of reportesBaseVista.value
    ) {
      if (
        !reporte.pasante?.id
      ) {
        continue
      }

      mapa.set(
        reporte.pasante.id,
        {
          id:
            reporte.pasante.id,

          nombre:
            reporte.pasante
              .nombre_completo ||
            'Sin nombre',
        },
      )
    }

    return Array.from(
      mapa.values(),
    ).sort(
      (a, b) =>
        String(a.nombre)
          .localeCompare(
            String(b.nombre),
            'es',
          ),
    )
  })


const reportesVisibles =
  computed(() => {
    let lista = [
      ...reportesBaseVista.value,
    ]

    if (
      tipoActivo.value !==
      'TODOS'
    ) {
      lista =
        lista.filter(
          reporte =>
            reporte.tipo ===
            tipoActivo.value,
        )
    }

    if (
      pasanteFiltro.value
    ) {
      lista =
        lista.filter(
          reporte =>
            reporte.pasante
              ?.id ===
            pasanteFiltro.value,
        )
    }

    const termino =
      busqueda.value
        .trim()
        .toLowerCase()

    if (termino) {
      lista =
        lista.filter(
          reporte => {
            const contenido =
              [
                reporte.pasante
                  ?.nombre_completo,

                reporte.pasante
                  ?.ci,

                reporte.titulo,

                reporte.descripcion,

                reporte.pasante
                  ?.departamento,

                reporte.pasante
                  ?.gerencia,

                reporte.pasante
                  ?.estado,

                reporte.tipo,
              ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()

            return contenido
              .includes(
                termino,
              )
          },
        )
    }

    return lista
  })


const obtenerMensajeError =
  error => {
    if (
      Array.isArray(
        error?.data?.message,
      )
    ) {
      return error
        .data
        .message
        .join(', ')
    }

    return (
      error?.data?.message ||
      error?.message ||
      'Ocurrió un error inesperado.'
    )
  }


const cargarReportes =
  async () => {
    cargandoReportes.value =
      true

    errorMensaje.value =
      ''

    try {
      const respuesta =
        await $api(
          '/supervisor/reportes',
        )

      datos.value = {
        resumen: {
          total:
            respuesta?.resumen
              ?.total ??
            0,

          observaciones:
            respuesta?.resumen
              ?.observaciones ??
            0,

          reconocimientos:
            respuesta?.resumen
              ?.reconocimientos ??
            0,

          incidentes:
            respuesta?.resumen
              ?.incidentes ??
            0,

          evaluaciones:
            respuesta?.resumen
              ?.evaluaciones ??
            0,
        },

        reportes:
          Array.isArray(
            respuesta?.reportes,
          )
            ? respuesta.reportes
            : [],
      }
    } catch (error) {
      errorMensaje.value =
        obtenerMensajeError(
          error,
        )
    } finally {
      cargandoReportes.value =
        false
    }
  }


const cargarPasantes =
  async () => {
    cargandoPasantes.value =
      true

    try {
      const respuesta =
        await $api(
          '/supervisor/pasantes',
        )

      pasantes.value =
        Array.isArray(
          respuesta?.pasantes,
        )
          ? respuesta.pasantes
          : []
    } catch (error) {
      errorMensaje.value =
        obtenerMensajeError(
          error,
        )
    } finally {
      cargandoPasantes.value =
        false
    }
  }


const cambiarVista =
  vista => {
    vistaActiva.value =
      vista

    tipoActivo.value =
      'TODOS'

    pasanteFiltro.value =
      ''

    busqueda.value =
      ''

    mensajeExito.value =
      ''
  }


const limpiarFormulario =
  () => {
    form.pasante_id =
      ''

    form.tipo =
      'OBSERVACION'

    form.titulo =
      ''

    form.descripcion =
      ''

    form.fecha_reporte =
      obtenerFechaLocal()

    errorFormulario.value =
      ''
  }


const abrirNuevoReporte =
  () => {
    limpiarFormulario()

    modalNuevo.value =
      true
  }


const cerrarNuevoReporte =
  () => {
    if (
      guardando.value
    ) {
      return
    }

    modalNuevo.value =
      false

    errorFormulario.value =
      ''
  }


const validarFormulario =
  () => {
    if (
      !form.pasante_id
    ) {
      return 'Debe seleccionar un pasante.'
    }

    if (
      !form.tipo
    ) {
      return 'Debe seleccionar el tipo de reporte.'
    }

    if (
      !form.fecha_reporte
    ) {
      return 'Debe indicar la fecha del reporte.'
    }

    if (
      form.fecha_reporte >
      fechaHoy
    ) {
      return 'La fecha del reporte no puede ser futura.'
    }

    if (
      !form.titulo.trim()
    ) {
      return 'Debe registrar el título del reporte.'
    }

    if (
      form.titulo
        .trim()
        .length > 150
    ) {
      return 'El título no puede superar los 150 caracteres.'
    }

    if (
      !form.descripcion.trim()
    ) {
      return 'Debe registrar la descripción del reporte.'
    }

    if (
      form.descripcion
        .trim()
        .length > 3000
    ) {
      return 'La descripción no puede superar los 3000 caracteres.'
    }

    return ''
  }


const guardarReporte =
  async () => {
    errorFormulario.value =
      ''

    mensajeExito.value =
      ''

    const error =
      validarFormulario()

    if (error) {
      errorFormulario.value =
        error

      return
    }

    guardando.value =
      true

    try {
      const respuesta =
        await $api(
          `/supervisor/pasantes/${form.pasante_id}/reportes`,
          {
            method:
              'POST',

            body: {
              tipo:
                form.tipo,

              titulo:
                form.titulo
                  .trim(),

              descripcion:
                form.descripcion
                  .trim(),

              fecha_reporte:
                form.fecha_reporte,
            },
          },
        )

      mensajeExito.value =
        respuesta?.message ||
        'El reporte fue registrado correctamente.'

      modalNuevo.value =
        false

      limpiarFormulario()

      vistaActiva.value =
        'ACTUALES'

      tipoActivo.value =
        'TODOS'

      await cargarReportes()
    } catch (error) {
      errorFormulario.value =
        obtenerMensajeError(
          error,
        )
    } finally {
      guardando.value =
        false
    }
  }


const abrirDetalle =
  reporte => {
    reporteSeleccionado.value =
      reporte
  }


const cerrarDetalle =
  () => {
    reporteSeleccionado.value =
      null
  }


const nombreTipo =
  tipo => {
    const tipos = {
      OBSERVACION:
        'Observación',

      RECONOCIMIENTO:
        'Reconocimiento',

      INCIDENTE:
        'Incidente',

      EVALUACION:
        'Evaluación',
    }

    return (
      tipos[tipo] ||
      tipo ||
      'Sin tipo'
    )
  }


const claseTipo =
  tipo => {
    const clases = {
      OBSERVACION:
        'observation',

      RECONOCIMIENTO:
        'recognition',

      INCIDENTE:
        'incident',

      EVALUACION:
        'evaluation',
    }

    return (
      clases[tipo] ||
      ''
    )
  }


const nombreEstado =
  estado => {
    const estados = {
      ACTIVO:
        'Activo',

      SUSPENDIDO:
        'Suspendido',

      FINALIZADO:
        'Finalizado',

      ABANDONO:
        'Abandono',
    }

    return (
      estados[estado] ||
      estado ||
      'Sin estado'
    )
  }


const formatearFecha =
  valor => {
    if (!valor) {
      return 'S/F'
    }

    const texto =
      String(valor)

    const coincidencia =
      texto.match(
        /^(\d{4})-(\d{2})-(\d{2})/,
      )

    if (coincidencia) {
      return `${coincidencia[3]}/${coincidencia[2]}/${coincidencia[1]}`
    }

    const fecha =
      new Date(valor)

    if (
      Number.isNaN(
        fecha.getTime(),
      )
    ) {
      return 'S/F'
    }

    return fecha.toLocaleDateString(
      'es-BO',
      {
        day:
          '2-digit',

        month:
          '2-digit',

        year:
          'numeric',
      },
    )
  }


const moduloPendiente =
  modulo => {
    mensajeModulo.value =
      modulo

    window.scrollTo({
      top:
        0,

      behavior:
        'smooth',
    })
  }


const cerrarSesion =
  async () => {
    authStore.logout()

    await navigateTo('/')
  }


onMounted(
  async () => {
    authStore.cargarSesion()

    if (
      !authStore.estaAutenticado ||
      !authStore.usuario
    ) {
      await navigateTo('/')

      return
    }

    await Promise.all([
      cargarReportes(),
      cargarPasantes(),
    ])
  },
)
</script>


<style scoped>
@import '@/assets/css/dashboard-supervisor.css';
@import '@/assets/css/reportes-supervisor.css';
</style>