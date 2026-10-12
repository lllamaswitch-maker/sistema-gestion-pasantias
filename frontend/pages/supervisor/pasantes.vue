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
              Pasantes asignados
            </h1>

            <p class="supervisor-header-description">
              Consulte los pasantes asignados a su supervisión,
              las actividades establecidas y su planificación académica.
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


        <section class="sup-pasantes-page">

          <div class="sup-pasantes-header">
            <div>
              <p class="sup-pasantes-label">
                Pasantes bajo su supervisión
              </p>

              <h2>
                Seguimiento de pasantes
              </h2>

              <p>
                Consulte la información académica, actividades,
                planificación y estado actual de los pasantes
                asignados a su cargo.
              </p>
            </div>

            <button
              type="button"
              class="sup-pasantes-refresh"
              :disabled="cargando"
              @click="cargarPasantes"
            >
              {{
                cargando
                  ? 'Actualizando...'
                  : 'Actualizar'
              }}
            </button>
          </div>


          <div
            v-if="errorMensaje"
            class="sup-pasantes-error"
          >
            {{ errorMensaje }}
          </div>


          <section class="sup-pasantes-kpis">

            <article class="sup-pasante-kpi">
              <span>
                Total
              </span>

              <strong>
                {{ datos.resumen.total }}
              </strong>
            </article>


            <article class="sup-pasante-kpi active">
              <span>
                Activos
              </span>

              <strong>
                {{ datos.resumen.activos }}
              </strong>
            </article>


            <article class="sup-pasante-kpi suspended">
              <span>
                Suspendidos
              </span>

              <strong>
                {{ datos.resumen.suspendidos }}
              </strong>
            </article>


            <article class="sup-pasante-kpi finished">
              <span>
                Finalizados
              </span>

              <strong>
                {{ datos.resumen.finalizados }}
              </strong>
            </article>


            <article class="sup-pasante-kpi abandoned">
              <span>
                Abandono
              </span>

              <strong>
                {{ datos.resumen.abandonos }}
              </strong>
            </article>

          </section>


          <div class="sup-pasantes-tabs">

            <button
              v-for="tab in tabs"
              :key="tab.valor"
              type="button"
              class="sup-pasantes-tab"
              :class="{
                active:
                  estadoActivo ===
                  tab.valor,
              }"
              @click="
                estadoActivo =
                  tab.valor
              "
            >
              {{ tab.nombre }}

              <span class="sup-pasantes-tab-count">
                {{ tab.cantidad }}
              </span>
            </button>

          </div>


          <div class="sup-pasantes-toolbar">

            <input
              v-model="busqueda"
              type="text"
              class="sup-pasantes-search"
              placeholder="Buscar por nombre, CI, carrera o departamento..."
            />

          </div>


          <section class="sup-pasantes-card">

            <div
              v-if="cargando"
              class="sup-pasantes-loading"
            >
              <strong>
                Cargando pasantes
              </strong>

              <p>
                Espere un momento.
              </p>
            </div>


            <div
              v-else-if="
                pasantesVisibles.length ===
                0
              "
              class="sup-pasantes-empty"
            >
              <strong>
                No existen registros
              </strong>

              <p>
                No se encontraron pasantes
                con los criterios seleccionados.
              </p>
            </div>


            <div
              v-else
              class="sup-pasantes-table-scroll"
            >
              <table class="sup-pasantes-table">

                <thead>
                  <tr>
                    <th>
                      Pasante
                    </th>

                    <th>
                      Formación
                    </th>

                    <th>
                      Área
                    </th>

                    <th>
                      Modalidad
                    </th>

                    <th>
                      Incorporación
                    </th>

                    <th>
                      Estado
                    </th>

                    <th>
                      Acción
                    </th>
                  </tr>
                </thead>


                <tbody>

                  <tr
                    v-for="pasante in pasantesVisibles"
                    :key="pasante.id"
                  >

                    <td>
                      <div class="sup-pasante-person">

                        <strong>
                          {{
                            pasante.postulante
                              ?.nombre_completo
                          }}
                        </strong>

                        <span>
                          CI:
                          {{
                            pasante.postulante?.ci
                          }}
                          {{
                            pasante.postulante
                              ?.expedido
                          }}
                        </span>

                        <span
                          v-if="
                            pasante.postulante?.email
                          "
                        >
                          {{
                            pasante.postulante
                              .email
                          }}
                        </span>

                      </div>
                    </td>


                    <td>
                      <div class="sup-pasante-person">

                        <strong>
                          {{
                            pasante.formacion
                              ?.carrera ||
                            'Sin registro'
                          }}
                        </strong>

                        <span>
                          {{
                            pasante.formacion
                              ?.semestre_o_nivel ||
                            'Sin nivel'
                          }}
                        </span>

                      </div>
                    </td>


                    <td>
                      <div class="sup-pasante-area">

                        <strong>
                          {{
                            pasante.departamento
                              ?.nombre ||
                            'Sin departamento'
                          }}
                        </strong>

                        <span>
                          {{
                            pasante.gerencia
                              ?.nombre ||
                            'Sin gerencia'
                          }}
                        </span>

                      </div>
                    </td>


                    <td>
                      {{
                        formatearTexto(
                          pasante.modalidad_pasantia,
                        )
                      }}
                    </td>


                    <td>
                      {{
                        formatearFecha(
                          pasante.fecha_incorporacion,
                        )
                      }}
                    </td>


                    <td>
                      <span
                        class="sup-pasante-status"
                        :class="
                          claseEstado(
                            pasante.estado,
                          )
                        "
                      >
                        {{
                          etiquetaEstado(
                            pasante.estado,
                          )
                        }}
                      </span>
                    </td>


                    <td>
                      <button
                        type="button"
                        class="sup-pasante-detail-button"
                        @click="
                          abrirDetalle(
                            pasante,
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


    <div
      v-if="pasanteSeleccionado"
      class="sup-pasante-modal-overlay"
      @click.self="cerrarDetalle"
    >

      <div class="sup-pasante-modal">

        <div class="sup-pasante-modal-header">

          <div>
            <p class="sup-pasantes-label">
              Información del pasante
            </p>

            <h2>
              {{
                pasanteSeleccionado
                  .postulante
                  ?.nombre_completo
              }}
            </h2>
          </div>


          <button
            type="button"
            class="sup-pasante-modal-close"
            @click="cerrarDetalle"
          >
            ×
          </button>

        </div>


        <div class="sup-pasante-modal-body">

          <div class="sup-pasante-detail-grid">

            <div class="sup-pasante-detail">
              <span>
                CI
              </span>

              <strong>
                {{
                  pasanteSeleccionado
                    .postulante?.ci
                }}
                {{
                  pasanteSeleccionado
                    .postulante?.expedido
                }}
              </strong>
            </div>


            <div class="sup-pasante-detail">
              <span>
                Correo
              </span>

              <strong>
                {{
                  pasanteSeleccionado
                    .postulante?.email ||
                  'No registrado'
                }}
              </strong>
            </div>


            <div class="sup-pasante-detail">
              <span>
                Carrera
              </span>

              <strong>
                {{
                  pasanteSeleccionado
                    .formacion?.carrera ||
                  'No registrada'
                }}
              </strong>

              <p>
                {{
                  pasanteSeleccionado
                    .formacion?.institucion ||
                  ''
                }}
              </p>
            </div>


            <div class="sup-pasante-detail">
              <span>
                Semestre / Nivel
              </span>

              <strong>
                {{
                  pasanteSeleccionado
                    .formacion
                    ?.semestre_o_nivel ||
                  'No registrado'
                }}
              </strong>
            </div>


            <div class="sup-pasante-detail">
              <span>
                Gerencia
              </span>

              <strong>
                {{
                  pasanteSeleccionado
                    .gerencia?.nombre ||
                  'No registrada'
                }}
              </strong>
            </div>


            <div class="sup-pasante-detail">
              <span>
                Departamento
              </span>

              <strong>
                {{
                  pasanteSeleccionado
                    .departamento?.nombre ||
                  'No registrado'
                }}
              </strong>
            </div>


            <div class="sup-pasante-detail">
              <span>
                Modalidad
              </span>

              <strong>
                {{
                  formatearTexto(
                    pasanteSeleccionado
                      .modalidad_pasantia,
                  )
                }}
              </strong>
            </div>


            <div class="sup-pasante-detail">
              <span>
                Fecha de incorporación
              </span>

              <strong>
                {{
                  formatearFecha(
                    pasanteSeleccionado
                      .fecha_incorporacion,
                  )
                }}
              </strong>
            </div>


            <div class="sup-pasante-detail">
              <span>
                Estado
              </span>

              <strong>
                {{
                  etiquetaEstado(
                    pasanteSeleccionado
                      .estado,
                  )
                }}
              </strong>
            </div>

          </div>


          <h3 class="sup-pasante-section-title">
            Actividades asignadas
          </h3>

          <div class="sup-pasante-activity">
            {{
              pasanteSeleccionado
                .actividades ||
              'No existen actividades registradas.'
            }}
          </div>


          <h3 class="sup-pasante-section-title">
            Planificación y seguimiento
          </h3>


          <div
            v-if="
              pasanteSeleccionado
                .seguimiento
            "
            class="sup-pasante-followup-grid"
          >

            <div class="sup-pasante-followup-card">
              <span>
                Fecha de inicio
              </span>

              <strong>
                {{
                  formatearFecha(
                    pasanteSeleccionado
                      .seguimiento
                      .fecha_inicio,
                  )
                }}
              </strong>
            </div>


            <div class="sup-pasante-followup-card">
              <span>
                Fecha de conclusión
              </span>

              <strong>
                {{
                  formatearFecha(
                    pasanteSeleccionado
                      .seguimiento
                      .fecha_conclusion,
                  )
                }}
              </strong>
            </div>


            <div class="sup-pasante-followup-card">
              <span>
                Duración acordada
              </span>

              <strong>
                {{
                  pasanteSeleccionado
                    .seguimiento
                    .duracion_acordada
                }}
              </strong>
            </div>


            <div class="sup-pasante-followup-card">
              <span>
                Turno
              </span>

              <strong>
                {{
                  formatearTexto(
                    pasanteSeleccionado
                      .seguimiento.turno,
                  )
                }}
              </strong>
            </div>


            <div class="sup-pasante-followup-card">
              <span>
                Horas requeridas
              </span>

              <strong>
                {{
                  pasanteSeleccionado
                    .seguimiento
                    .horas_requeridas ??
                  'No definidas'
                }}
              </strong>
            </div>


            <div class="sup-pasante-followup-card">
              <span>
                Horas realizadas
              </span>

              <strong>
                {{
                  pasanteSeleccionado
                    .seguimiento
                    .horas_realizadas ??
                  0
                }}
              </strong>
            </div>


            <div class="sup-pasante-followup-card">
              <span>
                Horas faltantes
              </span>

              <strong>
                {{
                  pasanteSeleccionado
                    .seguimiento
                    .horas_faltantes ??
                  'Pendiente'
                }}
              </strong>
            </div>

          </div>


          <div
            v-else
            class="sup-pasante-no-followup"
          >
            Talento Humano aún no ha registrado
            la planificación de fechas, turno y
            horas para este pasante.
          </div>

        </div>


        <div class="sup-pasante-modal-actions">

          <button
            type="button"
            class="sup-pasante-close-button"
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


const cargando =
  ref(true)

const errorMensaje =
  ref('')

const mensajeModulo =
  ref('')

const estadoActivo =
  ref('TODOS')

const busqueda =
  ref('')

const pasanteSeleccionado =
  ref(null)


const datos =
  ref({
    resumen: {
      total: 0,
      activos: 0,
      suspendidos: 0,
      finalizados: 0,
      abandonos: 0,
    },

    pasantes: [],
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


const tabs =
  computed(() => [
    {
      valor:
        'TODOS',

      nombre:
        'Todos',

      cantidad:
        datos.value.resumen.total,
    },

    {
      valor:
        'ACTIVO',

      nombre:
        'Activos',

      cantidad:
        datos.value.resumen.activos,
    },

    {
      valor:
        'SUSPENDIDO',

      nombre:
        'Suspendidos',

      cantidad:
        datos.value.resumen.suspendidos,
    },

    {
      valor:
        'FINALIZADO',

      nombre:
        'Finalizados',

      cantidad:
        datos.value.resumen.finalizados,
    },

    {
      valor:
        'ABANDONO',

      nombre:
        'Abandono',

      cantidad:
        datos.value.resumen.abandonos,
    },
  ])


const pasantesVisibles =
  computed(() => {
    let lista =
      Array.isArray(
        datos.value.pasantes,
      )
        ? [
            ...datos.value.pasantes,
          ]
        : []


    if (
      estadoActivo.value !==
      'TODOS'
    ) {
      lista =
        lista.filter(
          item =>
            item.estado ===
            estadoActivo.value,
        )
    }


    const termino =
      busqueda.value
        .trim()
        .toLowerCase()


    if (termino) {
      lista =
        lista.filter(
          item => {
            const contenido =
              [
                item.postulante
                  ?.nombre_completo,

                item.postulante
                  ?.ci,

                item.formacion
                  ?.carrera,

                item.formacion
                  ?.institucion,

                item.departamento
                  ?.nombre,

                item.gerencia
                  ?.nombre,

                item.modalidad_pasantia,
              ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()


            return contenido.includes(
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
      'No se pudieron cargar los pasantes.'
    )
  }


const cargarPasantes =
  async () => {
    cargando.value =
      true

    errorMensaje.value =
      ''


    try {
      const respuesta =
        await $api(
          '/supervisor/pasantes',
        )


      datos.value = {
        resumen: {
          total:
            respuesta?.resumen
              ?.total ??
            0,

          activos:
            respuesta?.resumen
              ?.activos ??
            0,

          suspendidos:
            respuesta?.resumen
              ?.suspendidos ??
            0,

          finalizados:
            respuesta?.resumen
              ?.finalizados ??
            0,

          abandonos:
            respuesta?.resumen
              ?.abandonos ??
            0,
        },

        pasantes:
          Array.isArray(
            respuesta?.pasantes,
          )
            ? respuesta.pasantes
            : [],
      }
    } catch (error) {
      errorMensaje.value =
        obtenerMensajeError(
          error,
        )
    } finally {
      cargando.value =
        false
    }
  }


const abrirDetalle =
  pasante => {
    pasanteSeleccionado.value =
      pasante
  }


const cerrarDetalle =
  () => {
    pasanteSeleccionado.value =
      null
  }


const etiquetaEstado =
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


const claseEstado =
  estado => {
    const clases = {
      ACTIVO:
        'active',

      SUSPENDIDO:
        'suspended',

      FINALIZADO:
        'finished',

      ABANDONO:
        'abandoned',
    }

    return (
      clases[estado] ||
      ''
    )
  }


const formatearTexto =
  valor => {
    if (!valor) {
      return 'No registrado'
    }

    return String(valor)
      .replaceAll(
        '_',
        ' ',
      )
      .toLowerCase()
      .replace(
        /\b\w/g,
        letra =>
          letra.toUpperCase(),
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


    await cargarPasantes()
  },
)
</script>


<style scoped>
@import '@/assets/css/dashboard-supervisor.css';
@import '@/assets/css/pasantes-supervisor.css';
</style>