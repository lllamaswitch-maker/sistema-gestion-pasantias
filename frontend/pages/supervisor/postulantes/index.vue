<template>
  <div class="supervisor-wrapper">
    <div class="supervisor-canvas">

      <!-- ===================================================== -->
      <!-- SIDEBAR -->
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

          <span>
            Cerrar Sesión
          </span>
        </button>

      </aside>


      <!-- ===================================================== -->
      <!-- CONTENIDO -->
      <!-- ===================================================== -->

      <main class="supervisor-main">

        <!-- =================================================== -->
        <!-- CABECERA -->
        <!-- =================================================== -->

        <header class="supervisor-header">

          <div>

            <p class="supervisor-eyebrow">
              Gestión de postulantes
            </p>

            <h1>
              Postulantes aprobados
            </h1>

            <p class="supervisor-header-description">
              Consulte los postulantes aprobados por Talento Humano,
              revise su perfil académico y gestione las solicitudes
              realizadas desde su Departamento.
            </p>

          </div>


          <div class="supervisor-date">

            <span>
              Gestión
            </span>

            <strong>
              {{ currentYear }}
            </strong>

          </div>

        </header>


        <!-- =================================================== -->
        <!-- AVISO DE MÓDULO -->
        <!-- =================================================== -->

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


        <!-- =================================================== -->
        <!-- INFORMACIÓN INSTITUCIONAL -->
        <!-- =================================================== -->

        <section class="supervisor-user-card">

          <div class="supervisor-user-card-header">

            <div>

              <p class="supervisor-section-label">
                Información institucional
              </p>

              <h2>
                Área del Supervisor
              </h2>

            </div>

            <span class="supervisor-status">
              ACTIVO
            </span>

          </div>


          <div class="postulantes-area-grid">

            <div class="supervisor-user-field">

              <span>
                Gerencia
              </span>

              <strong>
                {{
                  datos.departamento
                    ?.gerencia
                    ?.nombre ||
                  'No registrada'
                }}
              </strong>

            </div>


            <div class="supervisor-user-field">

              <span>
                Departamento
              </span>

              <strong>
                {{
                  datos.departamento
                    ?.nombre ||
                  authStore.usuario
                    ?.departamento_unidad ||
                  'No registrado'
                }}
              </strong>

            </div>


            <div class="supervisor-user-field">

              <span>
                Supervisor
              </span>

              <strong>
                {{ nombreSupervisor }}
              </strong>

            </div>

          </div>

        </section>


        <!-- =================================================== -->
        <!-- PESTAÑAS TIPO CARPETA -->
        <!-- =================================================== -->

        <section class="postulantes-tabs-container">

          <div class="postulantes-tabs">

            <!-- DISPONIBLES -->

            <button
              type="button"
              class="postulantes-tab"
              :class="{
                active:
                  pestanaActiva === 'disponibles',
              }"
              @click="cambiarPestana('disponibles')"
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
                Postulantes disponibles
              </span>

              <strong>
                {{ datos.total_postulantes }}
              </strong>

            </button>


            <!-- HISTORIAL -->

            <button
              type="button"
              class="postulantes-tab"
              :class="{
                active:
                  pestanaActiva === 'historial',
              }"
              @click="cambiarPestana('historial')"
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
                  d="M12 8v5l3 2m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

              <span>
                Historial de solicitudes
              </span>

              <strong>
                {{ historial.total }}
              </strong>

            </button>

          </div>

        </section>


        <!-- =================================================== -->
        <!-- PESTAÑA: POSTULANTES DISPONIBLES -->
        <!-- =================================================== -->

        <template
          v-if="pestanaActiva === 'disponibles'"
        >

          <!-- CARGANDO -->

          <section
            v-if="cargandoPostulantes"
            class="postulantes-state-card"
          >

            <div class="postulantes-spinner"></div>

            <strong>
              Cargando postulantes aprobados
            </strong>

            <p>
              Consultando la información registrada por
              Talento Humano...
            </p>

          </section>


          <!-- ERROR -->

          <section
            v-else-if="errorPostulantes"
            class="postulantes-error"
          >

            <div>

              <strong>
                No fue posible cargar los postulantes
              </strong>

              <p>
                {{ errorPostulantes }}
              </p>

            </div>

            <button
              type="button"
              @click="cargarPostulantes"
            >
              Intentar nuevamente
            </button>

          </section>


          <template v-else>

            <!-- =============================================== -->
            <!-- INDICADORES -->
            <!-- =============================================== -->

            <section class="postulantes-kpi-grid">

              <!-- POSTULANTES -->

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
                    Postulantes aprobados
                  </span>

                  <strong>
                    {{ datos.total_postulantes }}
                  </strong>

                  <small>
                    Disponibles para selección
                  </small>

                </div>

              </article>


              <!-- CARRERAS -->

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
                      d="M12 14l9-5-9-5-9 5 9 5zm0 0v6"
                    />
                  </svg>

                </div>

                <div>

                  <span>
                    Carreras
                  </span>

                  <strong>
                    {{ carrerasDisponibles.length }}
                  </strong>

                  <small>
                    Perfiles disponibles
                  </small>

                </div>

              </article>


              <!-- MODALIDADES -->

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
                      d="M9 12l2 2 4-4M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z"
                    />
                  </svg>

                </div>

                <div>

                  <span>
                    Modalidades
                  </span>

                  <strong>
                    {{ modalidadesDisponibles.length }}
                  </strong>

                  <small>
                    Tipos de postulación
                  </small>

                </div>

              </article>

            </section>


            <!-- =============================================== -->
            <!-- FILTROS -->
            <!-- =============================================== -->

            <section class="postulantes-panel">

              <div class="postulantes-panel-header">

                <div>

                  <p class="supervisor-section-label">
                    Filtros académicos
                  </p>

                  <h2>
                    Bolsa de postulantes aprobados
                  </h2>

                </div>


                <div class="postulantes-header-actions">

                  <button
                    v-if="hayFiltrosActivos"
                    type="button"
                    class="postulantes-clear-button"
                    @click="limpiarFiltros"
                  >
                    Limpiar filtros
                  </button>

                  <span class="postulantes-resultados">
                    {{ postulantesFiltrados.length }}
                    resultado(s)
                  </span>

                </div>

              </div>


              <div
                class="
                  postulantes-filtros
                  postulantes-filtros-academicos
                "
              >

                <!-- CARRERA -->

                <div class="postulantes-form-group">

                  <label>
                    Carrera
                  </label>

                  <select
                    v-model="filtroCarrera"
                  >

                    <option value="">
                      Todas las carreras
                    </option>

                    <option
                      v-for="carrera in carrerasDisponibles"
                      :key="carrera"
                      :value="carrera"
                    >
                      {{ carrera }}
                    </option>

                  </select>

                </div>


                <!-- SEMESTRE -->

                <div class="postulantes-form-group">

                  <label>
                    Semestre / Nivel
                  </label>

                  <select
                    v-model="filtroSemestre"
                  >

                    <option value="">
                      Todos
                    </option>

                    <option
                      v-for="semestre in semestresDisponibles"
                      :key="semestre"
                      :value="semestre"
                    >
                      {{ semestre }}
                    </option>

                  </select>

                </div>


                <!-- MODALIDAD -->

                <div class="postulantes-form-group">

                  <label>
                    Modalidad
                  </label>

                  <select
                    v-model="filtroModalidad"
                  >

                    <option value="">
                      Todas
                    </option>

                    <option
                      v-for="modalidad in modalidadesDisponibles"
                      :key="modalidad"
                      :value="modalidad"
                    >
                      {{ formatearModalidad(modalidad) }}
                    </option>

                  </select>

                </div>


                <!-- TURNO -->

                <div class="postulantes-form-group">

                  <label>
                    Turno
                  </label>

                  <select
                    v-model="filtroTurno"
                  >

                    <option value="">
                      Todos
                    </option>

                    <option
                      v-for="turno in turnosDisponibles"
                      :key="turno"
                      :value="turno"
                    >
                      {{ formatearTurno(turno) }}
                    </option>

                  </select>

                </div>

              </div>

            </section>


            <!-- =============================================== -->
            <!-- SIN POSTULANTES -->
            <!-- =============================================== -->

            <section
              v-if="datos.total_postulantes === 0"
              class="postulantes-state-card"
            >

              <div class="postulantes-empty-icon">

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

              <strong>
                No existen postulantes aprobados
              </strong>

              <p>
                Talento Humano todavía no tiene postulantes
                aprobados disponibles para selección.
              </p>

            </section>


            <!-- =============================================== -->
            <!-- SIN COINCIDENCIAS -->
            <!-- =============================================== -->

            <section
              v-else-if="postulantesFiltrados.length === 0"
              class="postulantes-state-card"
            >

              <div class="postulantes-empty-icon">

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2l-6 7v5l-6 3v-8L3 6V4z"
                  />
                </svg>

              </div>

              <strong>
                No existen coincidencias
              </strong>

              <p>
                Ningún postulante coincide con los filtros
                académicos seleccionados.
              </p>

              <button
                type="button"
                class="postulantes-empty-clear"
                @click="limpiarFiltros"
              >
                Limpiar filtros
              </button>

            </section>


            <!-- =============================================== -->
            <!-- TABLA DE POSTULANTES -->
            <!-- =============================================== -->

            <section
              v-else
              class="postulantes-table-card"
            >

              <div class="postulantes-table-header">

                <div>

                  <p class="supervisor-section-label">
                    Talento Humano
                  </p>

                  <h2>
                    Postulantes disponibles
                  </h2>

                </div>

              </div>


              <div class="solicitudes-lote-panel">
                <strong>{{ idsSeleccionados.length }} postulante(s) seleccionados</strong>
                <p>Seleccione uno o varios postulantes y prepare sus actividades en un solo envío a RRHH.</p>
                <button
                  type="button"
                  class="postulantes-solicitar-button"
                  :disabled="idsSeleccionados.length === 0 || enviandoLote"
                  @click="abrirModalLote"
                >Preparar solicitud conjunta</button>
                <button
                  v-if="idsSeleccionados.length"
                  type="button"
                  class="postulantes-clear-button"
                  :disabled="enviandoLote"
                  @click="idsSeleccionados = []"
                >Limpiar selección</button>
              </div>

              <div class="postulantes-table-scroll">

                <table class="postulantes-table">

                  <thead>

                    <tr>

                      <th aria-label="Seleccionar postulante">Seleccionar</th>
                      <th>
                        Postulante
                      </th>

                      <th>
                        Carrera / Institución
                      </th>

                      <th>
                        Semestre / Nivel
                      </th>

                      <th>
                        Modalidad
                      </th>

                      <th>
                        Turno
                      </th>

                      <th class="postulantes-action-column">
                        Acción
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    <tr
                      v-for="postulante in postulantesFiltrados"
                      :key="postulante.postulacion_id"
                    >

                      <td>
                        <input
                          type="checkbox"
                          :checked="idsSeleccionados.includes(postulante.postulacion_id)"
                          :disabled="enviandoLote"
                          :aria-label="`Seleccionar ${postulante.nombre_completo}`"
                          @change="alternarSeleccion(postulante.postulacion_id)"
                        >
                      </td>

                      <!-- POSTULANTE -->

                      <td>

                        <div class="postulante-persona">

                          <div class="postulante-avatar">
                            {{ obtenerIniciales(postulante) }}
                          </div>


                          <div>

                            <strong class="postulante-nombre">
                              {{ postulante.nombre_completo }}
                            </strong>

                            <span class="postulante-aprobado-texto">
                              Aprobado por Talento Humano
                            </span>

                            <span
                              v-if="postulante.es_repostulacion"
                              class="postulante-repostulacion"
                            >
                              Repostulación
                              #{{ postulante.numero_intento }}
                            </span>

                          </div>

                        </div>

                      </td>


                      <!-- CARRERA -->

                      <td>

                        <template
                          v-if="postulante.formacion?.length"
                        >

                          <strong class="postulante-carrera">
                            {{
                              postulante
                                .formacion[0]
                                .carrera
                            }}
                          </strong>

                          <span class="postulante-institucion">
                            {{
                              postulante
                                .formacion[0]
                                .institucion_nombre
                            }}
                          </span>

                        </template>


                        <span
                          v-else
                          class="postulante-sin-dato"
                        >
                          Sin información académica
                        </span>

                      </td>


                      <!-- SEMESTRE -->

                      <td>

                        <span class="postulante-dato">
                          {{
                            postulante
                              .formacion?.[0]
                              ?.semestre_o_nivel ||
                            'No registrado'
                          }}
                        </span>

                      </td>


                      <!-- MODALIDAD -->

                      <td>

                        <span class="postulante-modalidad">
                          {{
                            formatearModalidad(
                              postulante
                                .formacion?.[0]
                                ?.modalidad_postulacion,
                            )
                          }}
                        </span>

                      </td>


                      <!-- TURNO -->

                      <td>

                        <span class="postulante-turno">
                          {{
                            formatearTurno(
                              postulante.turno,
                            )
                          }}
                        </span>

                      </td>


                      <!-- ACCIÓN -->

                      <td class="postulantes-action-column">

                        <button
                          type="button"
                          class="postulante-view-button"
                          @click="revisarPostulante(postulante)"
                        >
                          Revisar
                        </button>

                      </td>

                    </tr>

                  </tbody>

                </table>

              </div>

            </section>

          </template>

        </template>


        <!-- =================================================== -->
        <!-- PESTAÑA: HISTORIAL -->
        <!-- =================================================== -->

        <template
          v-else-if="pestanaActiva === 'historial'"
        >

          <!-- CARGANDO HISTORIAL -->

          <section
            v-if="cargandoHistorial"
            class="postulantes-state-card"
          >

            <div class="postulantes-spinner"></div>

            <strong>
              Cargando historial de solicitudes
            </strong>

            <p>
              Consultando las solicitudes realizadas por
              su usuario...
            </p>

          </section>


          <!-- ERROR HISTORIAL -->

          <section
            v-else-if="errorHistorial"
            class="postulantes-error"
          >

            <div>

              <strong>
                No fue posible cargar el historial
              </strong>

              <p>
                {{ errorHistorial }}
              </p>

            </div>

            <button
              type="button"
              @click="cargarSolicitudes"
            >
              Intentar nuevamente
            </button>

          </section>


          <template v-else>

            <!-- =============================================== -->
            <!-- INDICADORES DEL HISTORIAL -->
            <!-- =============================================== -->

            <section class="postulantes-kpi-grid">

              <!-- TOTAL -->

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
                      d="M9 12h6m-6 4h6M7 4h10a2 2 0 012 2v14H5V6a2 2 0 012-2z"
                    />
                  </svg>

                </div>

                <div>

                  <span>
                    Total solicitudes
                  </span>

                  <strong>
                    {{ historial.total }}
                  </strong>

                  <small>
                    Solicitudes realizadas
                  </small>

                </div>

              </article>


              <!-- PENDIENTES -->

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
                      d="M12 8v4l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>

                </div>

                <div>

                  <span>
                    Pendientes de RRHH
                  </span>

                  <strong>
                    {{ historial.pendientes }}
                  </strong>

                  <small>
                    En espera de revisión
                  </small>

                </div>

              </article>


              <!-- APROBADAS -->

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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>

                </div>

                <div>

                  <span>
                    Aprobadas
                  </span>

                  <strong>
                    {{ historial.aprobadas }}
                  </strong>

                  <small>
                    Aceptadas por RRHH
                  </small>

                </div>

              </article>

            </section>


            <!-- =============================================== -->
            <!-- SIN SOLICITUDES -->
            <!-- =============================================== -->

            <section
              v-if="historial.total === 0"
              class="postulantes-state-card"
            >

              <div class="postulantes-empty-icon">

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6M7 4h10a2 2 0 012 2v14H5V6a2 2 0 012-2z"
                  />
                </svg>

              </div>

              <strong>
                No existen solicitudes registradas
              </strong>

              <p>
                Cuando solicite un postulante, la petición
                aparecerá en este historial.
              </p>

            </section>


            <!-- =============================================== -->
            <!-- TABLA HISTORIAL -->
            <!-- =============================================== -->

            <section
              v-else
              class="postulantes-table-card"
            >

              <div class="postulantes-table-header">

                <div>

                  <p class="supervisor-section-label">
                    Seguimiento de solicitudes
                  </p>

                  <h2>
                    Historial de peticiones
                  </h2>

                </div>


                <div class="historial-resumen-estados">

                  <span>
                    Rechazadas:
                    <strong>
                      {{ historial.rechazadas }}
                    </strong>
                  </span>

                  <span>
                    Canceladas:
                    <strong>
                      {{ historial.canceladas }}
                    </strong>
                  </span>

                </div>

              </div>


              <div class="postulantes-table-scroll">

                <table
                  class="
                    postulantes-table
                    postulantes-historial-table
                  "
                >

                  <thead>

                    <tr>

                      <th>
                        Fecha
                      </th>

                      <th>
                        Postulante
                      </th>

                      <th>
                        Formación
                      </th>

                      <th>
                        Actividades solicitadas
                      </th>

                      <th>
                        Estado
                      </th>

                      <th class="postulantes-action-column">
                        Acción
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    <tr
                      v-for="solicitud in historial.solicitudes"
                      :key="solicitud.id"
                    >

                      <!-- FECHA -->

                      <td>

                        <span class="historial-fecha">
                          {{
                            formatearFecha(
                              solicitud.fecha_solicitud,
                            )
                          }}
                        </span>

                      </td>


                      <!-- POSTULANTE -->

                      <td>

                        <div class="postulante-persona">

                          <div class="postulante-avatar">

                            {{
                              obtenerIniciales({
                                nombre_completo:
                                  solicitud
                                    .postulante
                                    ?.nombre_completo,
                              })
                            }}

                          </div>


                          <div>

                            <strong class="postulante-nombre">
                              {{
                                solicitud
                                  .postulante
                                  ?.nombre_completo ||
                                'Postulante'
                              }}
                            </strong>

                            <span class="postulante-aprobado-texto">
                              Solicitud
                              #{{ solicitud.id.slice(0, 8) }}
                            </span>

                          </div>

                        </div>

                      </td>


                      <!-- FORMACIÓN -->

                      <td>

                        <template
                          v-if="
                            solicitud
                              .postulante
                              ?.formacion
                              ?.length
                          "
                        >

                          <strong class="postulante-carrera">
                            {{
                              solicitud
                                .postulante
                                .formacion[0]
                                .carrera
                            }}
                          </strong>

                          <span class="postulante-institucion">
                            {{
                              formatearModalidad(
                                solicitud
                                  .postulante
                                  .formacion[0]
                                  .modalidad_postulacion,
                              )
                            }}
                          </span>

                        </template>


                        <span
                          v-else
                          class="postulante-sin-dato"
                        >
                          Sin información
                        </span>

                      </td>


                      <!-- ACTIVIDADES -->

                      <td>

                        <div class="historial-actividades">

                          {{
                            solicitud.actividades_pasante
                          }}

                        </div>

                      </td>


                      <!-- ESTADO -->

                      <td>

                        <span
                          class="historial-estado"
                          :class="
                            obtenerClaseEstadoSolicitud(
                              solicitud.estado,
                            )
                          "
                        >
                          {{
                            formatearEstadoSolicitud(
                              solicitud.estado,
                            )
                          }}
                        </span>


                        <!-- RESPUESTA RRHH -->

                        <small
                          v-if="solicitud.respuesta_rrhh"
                          class="historial-observacion"
                        >
                          {{
                            solicitud.respuesta_rrhh
                          }}
                        </small>


                        <!-- MOTIVO CANCELACIÓN -->

                        <small
                          v-if="
                            solicitud.estado === 'CANCELADA' &&
                            solicitud.motivo_cancelacion
                          "
                          class="historial-observacion"
                        >
                          Motivo:
                          {{
                            solicitud.motivo_cancelacion
                          }}
                        </small>

                      </td>


                      <!-- ACCIÓN -->

                      <td class="postulantes-action-column">

                        <button
                          v-if="solicitud.puede_cancelar"
                          type="button"
                          class="historial-cancelar-button"
                          @click="
                            abrirModalCancelacion(
                              solicitud,
                            )
                          "
                        >
                          Cancelar solicitud
                        </button>


                        <span
                          v-else
                          class="historial-sin-accion"
                        >
                          Sin acciones
                        </span>

                      </td>

                    </tr>

                  </tbody>

                </table>

              </div>

            </section>

          </template>

        </template>

      </main>

    </div>


    <!-- ======================================================= -->
    <!-- MODAL DE REVISIÓN DEL POSTULANTE -->
    <!-- ======================================================= -->

    <div
      v-if="postulanteSeleccionado"
      class="postulantes-modal-backdrop"
      @click.self="cerrarModalRevision"
    >

      <div
        class="
          postulantes-modal
          postulantes-modal-revision
        "
      >

        <!-- CABECERA -->

        <div class="postulantes-modal-header">

          <div>

            <p>
              Revisión académica
            </p>

            <h3>
              {{ postulanteSeleccionado.nombre_completo }}
            </h3>

          </div>


          <button
            type="button"
            :disabled="enviandoSolicitud"
            @click="cerrarModalRevision"
          >
            ×
          </button>

        </div>


        <div class="postulantes-modal-body">

          <!-- =============================================== -->
          <!-- INFORMACIÓN ACADÉMICA -->
          <!-- =============================================== -->

          <section class="postulantes-modal-section">

            <div class="postulantes-modal-section-header">

              <div>

                <p class="postulantes-modal-label">
                  Perfil académico
                </p>

                <h4>
                  Información académica del postulante
                </h4>

              </div>

            </div>


            <div
              v-if="postulanteSeleccionado.formacion?.length"
              class="postulantes-formaciones"
            >

              <article
                v-for="formacion in postulanteSeleccionado.formacion"
                :key="formacion.id"
                class="postulantes-formacion-item"
              >

                <div class="postulantes-academic-grid">

                  <div class="postulantes-academic-field">

                    <span>
                      Carrera
                    </span>

                    <strong>
                      {{ formacion.carrera }}
                    </strong>

                  </div>


                  <div class="postulantes-academic-field">

                    <span>
                      Institución
                    </span>

                    <strong>
                      {{ formacion.institucion_nombre }}
                    </strong>

                  </div>


                  <div class="postulantes-academic-field">

                    <span>
                      Semestre / Nivel
                    </span>

                    <strong>
                      {{ formacion.semestre_o_nivel }}
                    </strong>

                  </div>


                  <div class="postulantes-academic-field">

                    <span>
                      Modalidad
                    </span>

                    <strong>
                      {{
                        formatearModalidad(
                          formacion.modalidad_postulacion,
                        )
                      }}
                    </strong>

                  </div>


                  <div class="postulantes-academic-field">

                    <span>
                      Turno disponible
                    </span>

                    <strong>
                      {{
                        formatearTurno(
                          postulanteSeleccionado.turno,
                        )
                      }}
                    </strong>

                  </div>

                </div>

              </article>

            </div>


            <div
              v-else
              class="postulantes-modal-empty"
            >
              No existe información académica registrada.
            </div>

          </section>


          <!-- =============================================== -->
          <!-- DOCUMENTOS -->
          <!-- =============================================== -->

          <section class="postulantes-modal-section">

            <div class="postulantes-modal-section-header">

              <div>

                <p class="postulantes-modal-label">
                  Documentación académica
                </p>

                <h4>
                  Documentos para revisión
                </h4>

              </div>

            </div>


            <div class="postulantes-documentos-grid">

              <!-- HOJA DE VIDA -->

              <article class="postulantes-documento-card">

                <div class="postulantes-documento-icon">
                  PDF
                </div>

                <div class="postulantes-documento-info">

                  <strong>
                    Hoja de Vida / CV
                  </strong>

                  <span
                    v-if="
                      postulanteSeleccionado
                        .documentos
                        ?.hoja_vida
                    "
                  >
                    Documento disponible
                  </span>

                  <span
                    v-else
                    class="postulantes-documento-no-disponible"
                  >
                    No disponible
                  </span>

                </div>


                <button
                  type="button"
                  class="postulantes-documento-button"
                  :disabled="
                    !postulanteSeleccionado
                      .documentos
                      ?.hoja_vida
                  "
                  @click="
                    abrirDocumento(
                      postulanteSeleccionado
                        .documentos
                        ?.hoja_vida,
                    )
                  "
                >
                  Ver documento
                </button>

              </article>


              <!-- RÉCORD ACADÉMICO -->

              <article class="postulantes-documento-card">

                <div class="postulantes-documento-icon">
                  PDF
                </div>

                <div class="postulantes-documento-info">

                  <strong>
                    Récord Académico
                  </strong>

                  <span
                    v-if="
                      postulanteSeleccionado
                        .documentos
                        ?.record_academico
                    "
                  >
                    Documento disponible
                  </span>

                  <span
                    v-else
                    class="postulantes-documento-no-disponible"
                  >
                    No disponible
                  </span>

                </div>


                <button
                  type="button"
                  class="postulantes-documento-button"
                  :disabled="
                    !postulanteSeleccionado
                      .documentos
                      ?.record_academico
                  "
                  @click="
                    abrirDocumento(
                      postulanteSeleccionado
                        .documentos
                        ?.record_academico,
                    )
                  "
                >
                  Ver documento
                </button>

              </article>

            </div>

          </section>


          <!-- =============================================== -->
          <!-- PLAN DE ACTIVIDADES -->
          <!-- =============================================== -->

          <section class="postulantes-modal-section">

            <div class="postulantes-modal-section-header">

              <div>

                <p class="postulantes-modal-label">
                  Solicitud del pasante
                </p>

                <h4>
                  Actividades que realizará
                </h4>

              </div>

              <span class="postulantes-required-badge">
                OBLIGATORIO
              </span>

            </div>


            <div class="postulantes-plan-info">
              Antes de solicitar al postulante, describa las
              principales actividades que desarrollará dentro
              de su Departamento.
            </div>


            <div class="postulantes-plan-field">

              <label for="actividadesPasante">
                ¿Qué actividades realizará este pasante?
                <strong>*</strong>
              </label>


              <textarea
                id="actividadesPasante"
                v-model="actividadesPasante"
                rows="7"
                maxlength="1500"
                :disabled="enviandoSolicitud"
                placeholder="Ej.: Apoyará en la actualización de registros del área, elaboración de reportes, seguimiento de información y otras actividades relacionadas con su formación académica."
              ></textarea>


              <div class="postulantes-plan-footer">

                <span
                  :class="{
                    'postulantes-plan-warning':
                      !actividadesPasante.trim(),
                  }"
                >
                  {{
                    actividadesPasante.trim()
                      ? 'Información completada'
                      : 'Debe completar este campo para solicitar al postulante'
                  }}
                </span>

                <span>
                  {{ actividadesPasante.length }}
                  / 1500
                </span>

              </div>

            </div>


            <div
              v-if="errorSolicitud"
              class="postulantes-solicitud-error"
            >
              {{ errorSolicitud }}
            </div>

          </section>

        </div>


        <!-- ACCIONES -->

        <div class="postulantes-modal-footer">

          <button
            type="button"
            class="postulantes-modal-cancel-button"
            :disabled="enviandoSolicitud"
            @click="cerrarModalRevision"
          >
            Volver
          </button>


          <button
            type="button"
            class="postulantes-solicitar-button"
            :disabled="!puedeSolicitar"
            @click="solicitarPasante"
          >

            <span v-if="!enviandoSolicitud">
              Solicitar pasante
            </span>

            <span v-else>
              Enviando solicitud...
            </span>

          </button>

        </div>

      </div>

    </div>


    <!-- MODAL DE SOLICITUDES MÚLTIPLES -->
    <div v-if="modalLoteAbierto" class="postulantes-modal-backdrop" @click.self="cerrarModalLote">
      <div class="postulantes-modal postulantes-modal-revision">
        <div class="postulantes-modal-header">
          <div>
            <p>Solicitud conjunta</p>
            <h3>{{ seleccionados.length }} postulante(s) para RRHH</h3>
          </div>
          <button type="button" :disabled="enviandoLote" @click="cerrarModalLote">×</button>
        </div>
        <div class="postulantes-modal-body">
          <section class="postulantes-modal-section">
            <h4>Actividades generales</h4>
            <p>Se aplican inicialmente a todos. Luego puede personalizar cada descripción.</p>
            <textarea
              v-model="actividadesGenerales"
              rows="5"
              maxlength="1500"
              :disabled="enviandoLote"
              placeholder="Describa las actividades generales de los pasantes..."
            ></textarea>
            <button
              type="button"
              class="postulante-view-button"
              :disabled="enviandoLote || !actividadesGenerales.trim()"
              @click="aplicarActividadesGenerales"
            >Aplicar actividades a todos</button>
          </section>
          <section class="postulantes-modal-section">
            <h4>Actividades por postulante</h4>
            <p>Cada campo se guardará en su solicitud individual.</p>
            <div v-for="persona in seleccionados" :key="persona.postulacion_id" class="postulantes-plan-field">
              <label :for="`actividades-${persona.postulacion_id}`">{{ persona.nombre_completo }}</label>
              <textarea
                :id="`actividades-${persona.postulacion_id}`"
                v-model="actividadesPorId[persona.postulacion_id]"
                rows="4"
                maxlength="1500"
                :disabled="enviandoLote"
                placeholder="Actividades obligatorias para este postulante"
              ></textarea>
              <small>{{ (actividadesPorId[persona.postulacion_id] || '').length }} / 1500</small>
            </div>
            <div v-if="errorLote" role="alert" class="postulantes-solicitud-error">{{ errorLote }}</div>
          </section>
        </div>
        <div class="postulantes-modal-footer">
          <button type="button" class="postulantes-modal-cancel-button" :disabled="enviandoLote" @click="cerrarModalLote">Volver</button>
          <button
            type="button"
            class="postulantes-solicitar-button"
            :disabled="!puedeEnviarLote"
            @click="enviarSolicitudesLote"
          >{{ enviandoLote ? 'Registrando solicitudes...' : `Enviar ${seleccionados.length} solicitud(es) a RRHH` }}</button>
        </div>
      </div>
    </div>

    <!-- ======================================================= -->
    <!-- MODAL CANCELAR SOLICITUD -->
    <!-- ======================================================= -->

    <div
      v-if="solicitudCancelar"
      class="postulantes-modal-backdrop"
      @click.self="cerrarModalCancelacion"
    >

      <div
        class="
          postulantes-modal
          postulantes-modal-cancelacion
        "
      >

        <!-- CABECERA -->

        <div
          class="
            postulantes-modal-header
            postulantes-modal-header-cancelacion
          "
        >

          <div>

            <p>
              Verificación de seguridad
            </p>

            <h3>
              Cancelar solicitud
            </h3>

          </div>


          <button
            type="button"
            :disabled="cancelandoSolicitud"
            @click="cerrarModalCancelacion"
          >
            ×
          </button>

        </div>


        <div class="postulantes-modal-body">

          <!-- POSTULANTE -->

          <section class="cancelacion-postulante-card">

            <span>
              Solicitud correspondiente a
            </span>

            <strong>
              {{
                solicitudCancelar
                  .postulante
                  ?.nombre_completo
              }}
            </strong>

            <small>
              {{
                solicitudCancelar
                  .postulante
                  ?.formacion?.[0]
                  ?.carrera ||
                'Carrera no registrada'
              }}
            </small>

          </section>


          <!-- ADVERTENCIA -->

          <div class="cancelacion-advertencia">

            <strong>
              Importante
            </strong>

            <p>
              Al cancelar esta solicitud, el postulante volverá
              a estar disponible para los demás supervisores.
              La cancelación quedará registrada en el historial.
            </p>

          </div>


          <!-- MOTIVO -->

          <div class="cancelacion-form-group">

            <label for="motivoCancelacion">
              Motivo de cancelación
              <strong>*</strong>
            </label>

            <textarea
              id="motivoCancelacion"
              v-model="motivoCancelacion"
              rows="5"
              maxlength="1000"
              :disabled="cancelandoSolicitud"
              placeholder="Explique por qué desea cancelar esta solicitud..."
            ></textarea>

            <div class="cancelacion-contador">
              {{ motivoCancelacion.length }}
              / 1000
            </div>

          </div>


          <!-- CONTRASEÑA -->

          <div class="cancelacion-form-group">

            <label for="passwordAutorizacion">
              Contraseña actual
              <strong>*</strong>
            </label>

            <input
              id="passwordAutorizacion"
              v-model="passwordAutorizacion"
              type="password"
              autocomplete="current-password"
              :disabled="cancelandoSolicitud"
              placeholder="Ingrese su contraseña para confirmar"
              @keyup.enter="
                puedeConfirmarCancelacion
                  ? confirmarCancelacion()
                  : null
              "
            >

            <small>
              Por seguridad debe confirmar esta operación
              con la contraseña de su cuenta.
            </small>

          </div>


          <!-- ERROR -->

          <div
            v-if="errorCancelacion"
            class="postulantes-solicitud-error"
          >
            {{ errorCancelacion }}
          </div>

        </div>


        <!-- ACCIONES -->

        <div class="postulantes-modal-footer">

          <button
            type="button"
            class="postulantes-modal-cancel-button"
            :disabled="cancelandoSolicitud"
            @click="cerrarModalCancelacion"
          >
            Volver
          </button>


          <button
            type="button"
            class="historial-confirmar-cancelacion"
            :disabled="!puedeConfirmarCancelacion"
            @click="confirmarCancelacion"
          >

            <span v-if="!cancelandoSolicitud">
              Confirmar cancelación
            </span>

            <span v-else>
              Verificando...
            </span>

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


// ============================================================
// PESTAÑAS
// ============================================================

const pestanaActiva =
  ref('disponibles')


// ============================================================
// ESTADO GENERAL
// ============================================================

const mensajeModulo =
  ref('')


// ============================================================
// CARGA POSTULANTES
// ============================================================

const cargandoPostulantes =
  ref(true)

const errorPostulantes =
  ref('')


// ============================================================
// CARGA HISTORIAL
// ============================================================

const cargandoHistorial =
  ref(false)

const errorHistorial =
  ref('')

const historialCargado =
  ref(false)


// ============================================================
// FILTROS
// ============================================================

const filtroCarrera =
  ref('')

const filtroSemestre =
  ref('')

const filtroModalidad =
  ref('')

const filtroTurno =
  ref('')


// ============================================================
// MODAL DE SOLICITUD
// ============================================================

// Selección múltiple y actividades independientes por postulante.
const idsSeleccionados = ref([])
const modalLoteAbierto = ref(false)
const actividadesGenerales = ref('')
const actividadesPorId = ref({})
const enviandoLote = ref(false)
const errorLote = ref('')
const seleccionados = computed(() =>
  (datos.value.postulantes || []).filter(p => idsSeleccionados.value.includes(p.postulacion_id)),
)
const puedeEnviarLote = computed(() =>
  !enviandoLote.value && seleccionados.value.length > 0 &&
  seleccionados.value.every(p => {
    const valor = (actividadesPorId.value[p.postulacion_id] || '').trim()
    return valor.length > 0 && valor.length <= 1500
  }),
)

function alternarSeleccion(id) {
  idsSeleccionados.value = idsSeleccionados.value.includes(id)
    ? idsSeleccionados.value.filter(actual => actual !== id)
    : [...idsSeleccionados.value, id]
}

function abrirModalLote() {
  if (!seleccionados.value.length) return
  errorLote.value = ''
  const actuales = actividadesPorId.value
  actividadesPorId.value = Object.fromEntries(
    seleccionados.value.map(p => [p.postulacion_id, actuales[p.postulacion_id] || '']),
  )
  modalLoteAbierto.value = true
}

function aplicarActividadesGenerales() {
  const descripcion = actividadesGenerales.value.trim()
  if (!descripcion) return
  actividadesPorId.value = Object.fromEntries(
    seleccionados.value.map(p => [p.postulacion_id, descripcion]),
  )
}

function cerrarModalLote() {
  if (!enviandoLote.value) modalLoteAbierto.value = false
}

async function enviarSolicitudesLote() {
  if (!puedeEnviarLote.value) return
  enviandoLote.value = true
  errorLote.value = ''
  try {
    const respuesta = await $api('/supervisor/postulantes/solicitar-lote', {
      method: 'POST',
      body: {
        solicitudes: seleccionados.value.map(p => ({
          postulacion_id: p.postulacion_id,
          actividades_pasante: actividadesPorId.value[p.postulacion_id].trim(),
        })),
      },
    })
    modalLoteAbierto.value = false
    idsSeleccionados.value = []
    actividadesGenerales.value = ''
    actividadesPorId.value = {}
    historialCargado.value = false
    await Promise.all([cargarPostulantes(), cargarSolicitudes()])
    pestanaActiva.value = 'historial'
    alert(respuesta?.message || 'Solicitudes registradas correctamente.')
  } catch (error) {
    errorLote.value = obtenerMensajeError(error, 'No se pudo registrar el lote de solicitudes.')
  } finally {
    enviandoLote.value = false
  }
}

const postulanteSeleccionado =
  ref(null)

const actividadesPasante =
  ref('')

const enviandoSolicitud =
  ref(false)

const errorSolicitud =
  ref('')


// ============================================================
// MODAL DE CANCELACIÓN
// ============================================================

const solicitudCancelar =
  ref(null)

const motivoCancelacion =
  ref('')

const passwordAutorizacion =
  ref('')

const cancelandoSolicitud =
  ref(false)

const errorCancelacion =
  ref('')


// ============================================================
// DATOS DE POSTULANTES
// ============================================================

const datos =
  ref({

    departamento:
      null,

    total_postulantes:
      0,

    filtros: {

      carreras:
        [],

      semestres:
        [],

      modalidades:
        [],

      turnos:
        [],

    },

    postulantes:
      [],

  })


// ============================================================
// DATOS DEL HISTORIAL
// ============================================================

const historial =
  ref({

    total:
      0,

    pendientes:
      0,

    aprobadas:
      0,

    rechazadas:
      0,

    canceladas:
      0,

    solicitudes:
      [],

  })


// ============================================================
// DATOS DEL SUPERVISOR
// ============================================================

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


// ============================================================
// OPCIONES PARA FILTROS
// ============================================================

const carrerasDisponibles =
  computed(
    () =>
      datos.value
        .filtros
        ?.carreras ||
      [],
  )


const semestresDisponibles =
  computed(() => {

    return [
      ...(
        datos.value
          .filtros
          ?.semestres ||
        []
      ),
    ]
      .sort(
        (
          a,
          b,
        ) =>
          String(a)
            .localeCompare(
              String(b),
              'es',
              {
                numeric: true,
                sensitivity: 'base',
              },
            ),
      )

  })


const modalidadesDisponibles =
  computed(
    () =>
      datos.value
        .filtros
        ?.modalidades ||
      [],
  )


const turnosDisponibles =
  computed(
    () =>
      datos.value
        .filtros
        ?.turnos ||
      [],
  )


// ============================================================
// FILTROS ACTIVOS
// ============================================================

const hayFiltrosActivos =
  computed(() => {

    return Boolean(
      filtroCarrera.value ||
      filtroSemestre.value ||
      filtroModalidad.value ||
      filtroTurno.value,
    )

  })


// ============================================================
// POSTULANTES FILTRADOS
// ============================================================

const postulantesFiltrados =
  computed(() => {

    return (
      datos.value.postulantes ||
      []
    )
      .filter(
        postulante => {

          const formaciones =
            postulante.formacion ||
            []


          const hayFiltroAcademico =
            Boolean(
              filtroCarrera.value ||
              filtroSemestre.value ||
              filtroModalidad.value,
            )


          // ====================================================
          // LOS FILTROS ACADÉMICOS DEBEN COINCIDIR EN LA MISMA
          // FORMACIÓN
          // ====================================================

          if (hayFiltroAcademico) {

            const coincideFormacion =
              formaciones.some(
                formacion => {

                  const carreraCorrecta =
                    !filtroCarrera.value ||
                    formacion.carrera ===
                      filtroCarrera.value


                  const semestreCorrecto =
                    !filtroSemestre.value ||
                    formacion
                      .semestre_o_nivel ===
                      filtroSemestre.value


                  const modalidadCorrecta =
                    !filtroModalidad.value ||
                    formacion
                      .modalidad_postulacion ===
                      filtroModalidad.value


                  return (
                    carreraCorrecta &&
                    semestreCorrecto &&
                    modalidadCorrecta
                  )

                },
              )


            if (!coincideFormacion) {

              return false

            }

          }


          // ====================================================
          // TURNO
          // ====================================================

          if (
            filtroTurno.value &&
            postulante.turno !==
              filtroTurno.value
          ) {

            return false

          }


          return true

        },
      )

  })


// ============================================================
// VALIDAR SOLICITUD
// ============================================================

const puedeSolicitar =
  computed(() => {

    return Boolean(
      postulanteSeleccionado.value &&
      actividadesPasante.value
        .trim()
        .length >
        0 &&
      !enviandoSolicitud.value,
    )

  })


// ============================================================
// VALIDAR CANCELACIÓN
// ============================================================

const puedeConfirmarCancelacion =
  computed(() => {

    return Boolean(
      solicitudCancelar.value &&
      motivoCancelacion.value
        .trim()
        .length >
        0 &&
      passwordAutorizacion.value
        .trim()
        .length >
        0 &&
      !cancelandoSolicitud.value,
    )

  })


// ============================================================
// CAMBIAR PESTAÑA
// ============================================================

const cambiarPestana =
  async pestana => {

    pestanaActiva.value =
      pestana


    if (
      pestana === 'historial' &&
      !historialCargado.value
    ) {

      await cargarSolicitudes()

    }

  }


// ============================================================
// CARGAR POSTULANTES
// ============================================================

const cargarPostulantes =
  async () => {

    cargandoPostulantes.value =
      true

    errorPostulantes.value =
      ''


    try {

      const respuesta =
        await $api(
          '/supervisor/postulantes',
        )


      datos.value = {

        departamento:
          respuesta
            ?.departamento ??
          null,

        total_postulantes:
          respuesta
            ?.total_postulantes ??
          0,

        filtros: {

          carreras:
            respuesta
              ?.filtros
              ?.carreras ??
            [],

          semestres:
            respuesta
              ?.filtros
              ?.semestres ??
            [],

          modalidades:
            respuesta
              ?.filtros
              ?.modalidades ??
            [],

          turnos:
            respuesta
              ?.filtros
              ?.turnos ??
            [],

        },

        postulantes:
          respuesta
            ?.postulantes ??
          [],

      }

    } catch (error) {

      errorPostulantes.value =
        obtenerMensajeError(
          error,
          'Ocurrió un error al consultar los postulantes.',
        )

    } finally {

      cargandoPostulantes.value =
        false

    }

  }


// ============================================================
// CARGAR HISTORIAL
// ============================================================

const cargarSolicitudes =
  async () => {

    cargandoHistorial.value =
      true

    errorHistorial.value =
      ''


    try {

      const respuesta =
        await $api(
          '/supervisor/solicitudes',
        )


      historial.value = {

        total:
          respuesta?.total ??
          0,

        pendientes:
          respuesta?.pendientes ??
          0,

        aprobadas:
          respuesta?.aprobadas ??
          0,

        rechazadas:
          respuesta?.rechazadas ??
          0,

        canceladas:
          respuesta?.canceladas ??
          0,

        solicitudes:
          respuesta?.solicitudes ??
          [],

      }


      historialCargado.value =
        true

    } catch (error) {

      errorHistorial.value =
        obtenerMensajeError(
          error,
          'Ocurrió un error al consultar el historial de solicitudes.',
        )

    } finally {

      cargandoHistorial.value =
        false

    }

  }


// ============================================================
// LIMPIAR FILTROS
// ============================================================

const limpiarFiltros =
  () => {

    filtroCarrera.value =
      ''

    filtroSemestre.value =
      ''

    filtroModalidad.value =
      ''

    filtroTurno.value =
      ''

  }


// ============================================================
// OBTENER INICIALES
// ============================================================

const obtenerIniciales =
  postulante => {

    const partes =
      String(
        postulante
          ?.nombre_completo ||
        '',
      )
        .trim()
        .split(/\s+/)
        .filter(Boolean)


    if (
      partes.length ===
      0
    ) {

      return 'P'

    }


    if (
      partes.length ===
      1
    ) {

      return partes[0]
        .charAt(0)
        .toUpperCase()

    }


    return (
      partes[0]
        .charAt(0) +
      partes[1]
        .charAt(0)
    )
      .toUpperCase()

  }


// ============================================================
// FORMATEAR TURNO
// ============================================================

const formatearTurno =
  turno => {

    const nombres = {

      MANANA:
        'Mañana',

      TARDE:
        'Tarde',

      TIEMPO_COMPLETO:
        'Tiempo completo',

    }


    return (
      nombres[turno] ||
      'No registrado'
    )

  }


// ============================================================
// FORMATEAR MODALIDAD
// ============================================================

const formatearModalidad =
  modalidad => {

    const nombres = {

      PASANTIA:
        'Pasantía',

      PROYECTO_DE_GRADO:
        'Proyecto de Grado',

      TRABAJO_DIRIGIDO:
        'Trabajo Dirigido',

      EXCELENCIA_ACADEMICA:
        'Excelencia Académica',

      OTRO:
        'Otro',

    }


    return (
      nombres[modalidad] ||
      modalidad ||
      'No registrada'
    )

  }


// ============================================================
// FORMATEAR ESTADO SOLICITUD
// ============================================================

const formatearEstadoSolicitud =
  estado => {

    const nombres = {

      PENDIENTE_RRHH:
        'Pendiente de RRHH',

      APROBADA:
        'Aprobada',

      RECHAZADA:
        'Rechazada',

      CANCELADA:
        'Cancelada',

    }


    return (
      nombres[estado] ||
      estado ||
      'Sin estado'
    )

  }


// ============================================================
// CLASE DEL ESTADO
// ============================================================

const obtenerClaseEstadoSolicitud =
  estado => {

    const clases = {

      PENDIENTE_RRHH:
        'pendiente',

      APROBADA:
        'aprobada',

      RECHAZADA:
        'rechazada',

      CANCELADA:
        'cancelada',

    }


    return (
      clases[estado] ||
      ''
    )

  }


// ============================================================
// FORMATEAR FECHA
// ============================================================

const formatearFecha =
  fecha => {

    if (!fecha) {

      return 'Sin fecha'

    }


    const fechaObjeto =
      new Date(fecha)


    if (
      Number.isNaN(
        fechaObjeto.getTime(),
      )
    ) {

      return 'Sin fecha'

    }


    return new Intl
      .DateTimeFormat(
        'es-BO',
        {

          day:
            '2-digit',

          month:
            '2-digit',

          year:
            'numeric',

          hour:
            '2-digit',

          minute:
            '2-digit',

        },
      )
      .format(
        fechaObjeto,
      )

  }


// ============================================================
// MENSAJE DE ERROR
// ============================================================

const obtenerMensajeError =
  (
    error,
    mensajeDefecto,
  ) => {

    const mensajeServidor =
      error
        ?.data
        ?.message


    if (
      Array.isArray(
        mensajeServidor,
      )
    ) {

      return mensajeServidor
        .join(', ')

    }


    return (
      mensajeServidor ||
      error?.message ||
      mensajeDefecto
    )

  }


// ============================================================
// REVISAR POSTULANTE
// ============================================================

const revisarPostulante =
  postulante => {

    postulanteSeleccionado.value =
      postulante

    actividadesPasante.value =
      ''

    errorSolicitud.value =
      ''

  }


// ============================================================
// CERRAR MODAL DE REVISIÓN
// ============================================================

const cerrarModalRevision =
  () => {

    if (
      enviandoSolicitud.value
    ) {

      return

    }


    postulanteSeleccionado.value =
      null

    actividadesPasante.value =
      ''

    errorSolicitud.value =
      ''

  }


// ============================================================
// ABRIR PDF
// ============================================================

const abrirDocumento =
  async documento => {

    if (
      !documento
        ?.archivo_endpoint
    ) {

      return

    }


    const ventana =
      window.open(
        'about:blank',
        '_blank',
      )


    try {

      const archivo =
        await $api(
          documento
            .archivo_endpoint,
          {

            method:
              'GET',

            responseType:
              'blob',

          },
        )


      if (
        !(
          archivo instanceof
          Blob
        )
      ) {

        throw new Error(
          'El servidor no devolvió un documento válido.',
        )

      }


      const pdf =
        archivo.type ===
        'application/pdf'
          ? archivo
          : new Blob(
              [archivo],
              {
                type:
                  'application/pdf',
              },
            )


      const urlTemporal =
        URL.createObjectURL(
          pdf,
        )


      if (!ventana) {

        URL.revokeObjectURL(
          urlTemporal,
        )

        throw new Error(
          'El navegador bloqueó la ventana del documento.',
        )

      }


      ventana.opener =
        null

      ventana.location.href =
        urlTemporal


      setTimeout(
        () => {

          URL.revokeObjectURL(
            urlTemporal,
          )

        },
        60_000,
      )

    } catch (error) {

      if (ventana) {

        ventana.close()

      }


      alert(
        obtenerMensajeError(
          error,
          'No se pudo abrir el documento.',
        ),
      )

    }

  }


// ============================================================
// SOLICITAR PASANTE
// ============================================================

const solicitarPasante =
  async () => {

    if (
      !postulanteSeleccionado.value
    ) {

      return

    }


    const actividades =
      actividadesPasante.value
        .trim()


    if (!actividades) {

      errorSolicitud.value =
        'Debe describir las actividades que realizará el pasante.'

      return

    }


    enviandoSolicitud.value =
      true

    errorSolicitud.value =
      ''


    try {

      const respuesta =
        await $api(
          `/supervisor/postulantes/${postulanteSeleccionado.value.postulacion_id}/solicitar`,
          {

            method:
              'POST',

            body: {

              actividades_pasante:
                actividades,

            },

          },
        )


      // --------------------------------------------------------
      // Cerrar correctamente el modal
      // --------------------------------------------------------

      enviandoSolicitud.value =
        false

      postulanteSeleccionado.value =
        null

      actividadesPasante.value =
        ''

      errorSolicitud.value =
        ''


      // --------------------------------------------------------
      // Actualizar ambas pestañas
      // --------------------------------------------------------

      historialCargado.value =
        false


      await Promise.all([

        cargarPostulantes(),

        cargarSolicitudes(),

      ])


      pestanaActiva.value =
        'historial'


      alert(
        respuesta?.message ||
        'La solicitud del pasante fue enviada correctamente a Talento Humano.',
      )

    } catch (error) {

      errorSolicitud.value =
        obtenerMensajeError(
          error,
          'No se pudo enviar la solicitud del pasante.',
        )

    } finally {

      enviandoSolicitud.value =
        false

    }

  }


// ============================================================
// ABRIR MODAL DE CANCELACIÓN
// ============================================================

const abrirModalCancelacion =
  solicitud => {

    solicitudCancelar.value =
      solicitud

    motivoCancelacion.value =
      ''

    passwordAutorizacion.value =
      ''

    errorCancelacion.value =
      ''

  }


// ============================================================
// CERRAR MODAL CANCELACIÓN
// ============================================================

const cerrarModalCancelacion =
  () => {

    if (
      cancelandoSolicitud.value
    ) {

      return

    }


    solicitudCancelar.value =
      null

    motivoCancelacion.value =
      ''

    passwordAutorizacion.value =
      ''

    errorCancelacion.value =
      ''

  }


// ============================================================
// CONFIRMAR CANCELACIÓN
// ============================================================

const confirmarCancelacion =
  async () => {

    if (
      !solicitudCancelar.value
    ) {

      return

    }


    const motivo =
      motivoCancelacion.value
        .trim()


    const password =
      passwordAutorizacion.value


    if (!motivo) {

      errorCancelacion.value =
        'Debe indicar el motivo de cancelación.'

      return

    }


    if (
      !password.trim()
    ) {

      errorCancelacion.value =
        'Debe ingresar su contraseña para confirmar la operación.'

      return

    }


    cancelandoSolicitud.value =
      true

    errorCancelacion.value =
      ''


    try {

      const respuesta =
        await $api(
          `/supervisor/solicitudes/${solicitudCancelar.value.id}/cancelar`,
          {

            method:
              'PATCH',

            body: {

              motivo_cancelacion:
                motivo,

              // IMPORTANTE:
              // enviamos la contraseña exactamente como
              // fue introducida por el usuario.
              password_autorizacion:
                password,

            },

          },
        )


      cancelandoSolicitud.value =
        false

      solicitudCancelar.value =
        null

      motivoCancelacion.value =
        ''

      passwordAutorizacion.value =
        ''

      errorCancelacion.value =
        ''


      // --------------------------------------------------------
      // Actualizar historial y bolsa
      // --------------------------------------------------------

      await Promise.all([

        cargarSolicitudes(),

        cargarPostulantes(),

      ])


      pestanaActiva.value =
        'historial'


      alert(
        respuesta?.message ||
        'La solicitud fue cancelada correctamente.',
      )

    } catch (error) {

      errorCancelacion.value =
        obtenerMensajeError(
          error,
          'No se pudo cancelar la solicitud.',
        )

    } finally {

      cancelandoSolicitud.value =
        false

    }

  }


// ============================================================
// MÓDULOS PENDIENTES
// ============================================================

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


// ============================================================
// CERRAR SESIÓN
// ============================================================

const cerrarSesion =
  async () => {

    authStore.logout()

    await navigateTo('/')

  }


// ============================================================
// INICIO
// ============================================================

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


    // Cargamos postulantes primero.

    await cargarPostulantes()


    // Cargamos también el contador del historial para que
    // aparezca en la pestaña desde el inicio.

    await cargarSolicitudes()

  },
)
</script>


<style scoped>
/* ESTILOS ORIGINALES */
@import '@/assets/css/dashboard-supervisor.css';
@import '@/assets/css/postulantes-supervisor.css';

/* ESTILOS NUEVOS */
.solicitudes-lote-panel {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
}

.solicitudes-lote-panel p {
  flex-basis: 100%;
  margin: 0;
}

.postulantes-modal-body textarea {
  width: 100%;
  box-sizing: border-box;
}

.postulantes-plan-field {
  margin: 18px 0;
}
</style>