<template>
  <div class="supervisor-wrapper">

    <div class="supervisor-canvas">

      <!-- ===================================================== -->
      <!-- SIDEBAR                                               -->
      <!-- ===================================================== -->

      <aside class="supervisor-sidebar">

        <div>

          <!-- PERFIL -->

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


          <!-- NAVEGACIÓN -->

          <nav class="supervisor-nav">

            <NuxtLink
              to="/supervisor/dashboard"
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
                  d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-6h6v6h4a1 1 0 001-1V10"
                />
              </svg>

              <span>Dashboard</span>
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

                    <span>Postulantes</span>
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

              <span>Calendario</span>
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


        <!-- CERRAR SESIÓN -->

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

          <span>Cerrar Sesión</span>
        </button>

      </aside>


      <!-- ===================================================== -->
      <!-- CONTENIDO                                             -->
      <!-- ===================================================== -->

      <main class="supervisor-main">

        <!-- CABECERA -->

        <header class="supervisor-header">

          <div>

            <p class="supervisor-eyebrow">
              Panel de supervisión
            </p>

            <h1>
              Bienvenido, {{ primerNombre }}
            </h1>

            <p class="supervisor-header-description">
              Gestione los procesos de selección, seguimiento y evaluación
              de los pasantes asignados a su área.
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


        <!-- AVISO MÓDULO -->

        <div
          v-if="mensajeModulo"
          class="supervisor-info-message"
        >
          <div>

            <strong>
              {{ mensajeModulo }}
            </strong>

            <p>
              Este módulo será implementado en el siguiente paso.
            </p>

          </div>

          <button
            type="button"
            @click="mensajeModulo = ''"
          >
            ×
          </button>
        </div>


        <!-- =================================================== -->
        <!-- INFORMACIÓN DEL SUPERVISOR                          -->
        <!-- =================================================== -->

        <section class="supervisor-user-card">

          <div class="supervisor-user-card-header">

            <div>

              <p class="supervisor-section-label">
                Información institucional
              </p>

              <h2>
                Datos del Supervisor
              </h2>

            </div>

            <span class="supervisor-status">
              ACTIVO
            </span>

          </div>


          <div class="supervisor-user-grid">

            <div class="supervisor-user-field">

              <span>
                Nombre completo
              </span>

              <strong>
                {{ nombreSupervisor }}
              </strong>

            </div>


            <div class="supervisor-user-field">

              <span>
                Cargo
              </span>

              <strong>
                {{ authStore.usuario?.cargo || 'No registrado' }}
              </strong>

            </div>


            <div class="supervisor-user-field">

              <span>
                Departamento
              </span>

              <strong>
                {{
                  authStore.usuario?.departamento_unidad ||
                  'No asignado'
                }}
              </strong>

            </div>


            <div class="supervisor-user-field">

              <span>
                Rol del sistema
              </span>

              <strong>
                Supervisor
              </strong>

            </div>

          </div>

        </section>


        <!-- =================================================== -->
        <!-- INDICADORES                                         -->
        <!-- =================================================== -->

        <section class="supervisor-kpi-grid">

          <article class="supervisor-kpi">

            <div class="kpi-icon">

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

            </div>

            <div>

              <span>
                Postulantes disponibles
              </span>

              <strong>
                —
              </strong>

              <small>
                Pendientes de revisión
              </small>

            </div>

          </article>


          <article class="supervisor-kpi">

            <div class="kpi-icon">

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

            </div>

            <div>

              <span>
                Pasantes activos
              </span>

              <strong>
                —
              </strong>

              <small>
                Asignados al área
              </small>

            </div>

          </article>


          <article class="supervisor-kpi">

            <div class="kpi-icon">

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

            </div>

            <div>

              <span>
                Actividades próximas
              </span>

              <strong>
                —
              </strong>

              <small>
                Calendario del área
              </small>

            </div>

          </article>


          <article class="supervisor-kpi">

            <div class="kpi-icon">

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

            </div>

            <div>

              <span>
                Reportes pendientes
              </span>

              <strong>
                —
              </strong>

              <small>
                Seguimiento y evaluación
              </small>

            </div>

          </article>

        </section>


        <!-- =================================================== -->
        <!-- MÓDULOS                                             -->
        <!-- =================================================== -->

        <section class="supervisor-modules">

          <div class="supervisor-section-header">

            <div>

              <p class="supervisor-section-label">
                Gestión del área
              </p>

              <h2>
                Módulos de Supervisión
              </h2>

            </div>

          </div>


          <div class="supervisor-module-grid">

            <!-- POSTULANTES -->

            <NuxtLink
                to="/supervisor/postulantes"
                class="supervisor-module-card"
                >

              <div class="module-number">
                01
              </div>

              <div class="module-icon">

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

              </div>

              <h3>
                Postulantes
              </h3>

              <p>
                Consulte los candidatos aprobados por Recursos Humanos
                disponibles para procesos de selección en su área.
              </p>

              <span class="module-action">
                Ver postulantes
                </span>

            </NuxtLink>


            <!-- PASANTES -->

            <button
              type="button"
              class="supervisor-module-card"
              @click="navigateTo('/supervisor/pasantes')"
            >

              <div class="module-number">
                02
              </div>

              <div class="module-icon">

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

              </div>

              <h3>
                Pasantes Activos
              </h3>

              <p>
                Realice el seguimiento de los pasantes asignados a su
                Departamento y consulte su progreso.
              </p>

              <span class="module-action">
                Ver pasantes
              </span>

            </button>


            <!-- CALENDARIO -->

            <button
              type="button"
              class="supervisor-module-card"
              @click="moduloPendiente('Calendario')"
            >

              <div class="module-number">
                03
              </div>

              <div class="module-icon">

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

              </div>

              <h3>
                Calendario
              </h3>

              <p>
                Organice actividades, reuniones, evaluaciones y fechas
                relevantes para los pasantes a su cargo.
              </p>

              <span class="module-action">
                Próximo módulo
              </span>

            </button>


            <!-- REPORTES -->

            <button
              type="button"
              class="supervisor-module-card"
              @click="navigateTo('/supervisor/reportes')"
            >

              <div class="module-number">
                04
              </div>

              <div class="module-icon">

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

              </div>

              <h3>
                Reportes de Comportamiento
              </h3>

              <p>
                Registre observaciones, desempeño, cumplimiento y
                comportamiento de los pasantes supervisados.
              </p>

              <span class="module-action">
                  Ver reportes
                </span>

            </button>

          </div>

        </section>

      </main>

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


const mensajeModulo =
  ref('')


const currentYear =
  computed(() => {

    return new Date()
      .getFullYear()

  })


const nombreSupervisor =
  computed(() => {

    const nombres =
      authStore.usuario?.nombres || ''

    const apellidos =
      authStore.usuario?.apellidos || ''

    return (
      `${nombres} ${apellidos}`
        .trim() ||
      'Supervisor'
    )

  })


const primerNombre =
  computed(() => {

    const nombres =
      String(
        authStore.usuario?.nombres ||
        'Supervisor',
      )
        .trim()
        .split(' ')

    return nombres[0] || 'Supervisor'

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


const moduloPendiente =
  (modulo) => {

    mensajeModulo.value =
      modulo

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
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


    if (
      authStore.usuario.rol !==
      'SUPERVISOR'
    ) {

      await navigateTo(
        '/admin/rrhh/dashboard',
      )

    }

  },
)
</script>


<style scoped>
@import '@/assets/css/dashboard-supervisor.css';
</style>