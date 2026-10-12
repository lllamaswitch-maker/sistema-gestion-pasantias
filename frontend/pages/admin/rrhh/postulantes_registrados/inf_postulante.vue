<template>
  <div class="postulantes-wrapper font-sans select-none text-slate-700">
    <!-- SIDEBAR -->
    <aside class="sidebar-corporate hidden md:flex">
      <div>
        <div class="flex items-center gap-3 pb-6 border-b border-white/10">
          <div class="avatar-mini">
            <img
              src="/tele_img.jpeg"
              alt="Logo"
              class="w-full h-full object-cover rounded-lg"
            />
          </div>

          <div>
            <h2 class="text-xs font-black tracking-wider uppercase text-white">
              Mi Teleférico
            </h2>
            <p class="text-[10px] text-emerald-200">Talento Humano</p>
          </div>
        </div>

        <nav class="space-y-1.5 mt-6">
          <NuxtLink to="/admin/rrhh/dashboard" class="nav-link">
            <svg
              class="w-4 h-4 text-emerald-200/70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span>Dashboard</span>
          </NuxtLink>

          <NuxtLink
            to="/admin/rrhh/postulantes_registrados/inf_postulante"
            class="nav-link active"
          >
            <svg
              class="w-4 h-4 text-emerald-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Postulantes Registrados</span>
          </NuxtLink>

          <NuxtLink to="/admin/rrhh/peticiones" class="nav-link">
            <svg
              class="w-4 h-4 text-emerald-200/70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <span>Peticiones Áreas</span>
          </NuxtLink>

          <NuxtLink to="/admin/rrhh/pasantes" class="nav-link">
            <svg
              class="w-4 h-4 text-emerald-200/70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span>Pasantes Activos</span>
          </NuxtLink>
        </nav>
      </div>

      <div class="pt-4 border-t border-white/10">
        <button
          @click="authStore.logout"
          class="w-full py-2.5 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-300 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition"
        >
          Cerrar Sesión
        </button>
      </div>
    </aside>

    <!-- CONTENEDOR CENTRAL -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- CABECERA -->
      <header
        class="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm"
      >
        <div>
          <h1 class="text-base font-black text-slate-800">
            Información General de Postulantes
          </h1>
          <p class="text-xs text-slate-400 font-medium">
            Revisión documental, cotejo de requisitos y trazabilidad del proceso
          </p>
        </div>

        <div class="text-right hidden sm:block">
          <p class="text-xs font-bold text-slate-800">
            {{ authStore.usuario?.nombres }} {{ authStore.usuario?.apellidos }}
          </p>
          <span
            class="text-[10px] font-extrabold text-[#114d3f] bg-emerald-50 px-2 py-0.5 rounded-full"
          >
            {{ authStore.usuario?.cargo || 'RRHH' }}
          </span>
        </div>
      </header>

      <!-- CONTENIDO -->
      <main class="p-6 space-y-6 flex-1 overflow-y-auto">
        <!-- PESTAÑAS -->
        <!-- PESTAÑAS TIPO CARPETA -->
<div class="folder-tabs">
  <button
    type="button"
    @click="cambiarVista('ACTIVOS')"
    class="folder-tab"
    :class="{ 'folder-tab-active': vistaActiva === 'ACTIVOS' }"
  >
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
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M15 7a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>

    <span>En proceso</span>
          </button>

          <button
            type="button"
            @click="cambiarVista('HISTORIAL')"
            class="folder-tab"
            :class="{ 'folder-tab-active': vistaActiva === 'HISTORIAL' }"
          >
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
                d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>

            <span>Historial</span>
          </button>
        </div>

        <!-- ===================================================== -->
        <!-- EN PROCESO -->
        <!-- ===================================================== -->
        <template v-if="vistaActiva === 'ACTIVOS'">
          <!-- GUÍA -->
          <div
            class="guide-banner flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div class="space-y-1">
              <h4 class="text-xs font-black text-slate-800 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-[#114d3f]"></span>
                Guía de Revisión Documental y Observaciones
              </h4>

              <p class="text-[11px] text-slate-500 leading-relaxed flex flex-wrap items-center gap-1.5">
                <span>
                  Presione
                  <strong class="text-slate-700">"Revisar Documentos"</strong>
                  para abrir los archivos y marcar cada requisito como
                </span>

                <span
                  class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 text-[#114d3f] border border-emerald-200 font-extrabold text-[10px]"
                >
                  ✓ Válido
                </span>

                <span>o</span>

                <span
                  class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 font-extrabold text-[10px]"
                >
                  ✕ Observado
                </span>

                <span>e ingresar comentarios específicos para cada requisito.</span>
              </p>
            </div>

            <div class="flex items-center gap-3 text-[10px] font-bold">
              <div
                class="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg text-slate-600 border border-slate-200"
              >
                <span class="w-2 h-2 rounded-full bg-slate-400"></span>
                Sin Verificar
              </div>

              <div
                class="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 rounded-lg text-amber-700 border border-amber-200"
              >
                <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                Observado
              </div>

              <div
                class="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 rounded-lg text-[#114d3f] border border-emerald-200"
              >
                <span class="w-2 h-2 rounded-full bg-[#114d3f]"></span>
                Aprobado
              </div>
            </div>
          </div>

          <!-- FILTROS -->
          <div class="filter-card grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label
                class="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1"
              >
                C.I. Postulante
              </label>
              <input
                v-model="filtroCi"
                type="text"
                placeholder="Ej: 8440940"
                class="input-field"
              />
            </div>

            <div>
              <label
                class="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1"
              >
                Apellido
              </label>
              <input
                v-model="filtroApellido"
                type="text"
                placeholder="Ej: Chavez / Mamani"
                class="input-field"
              />
            </div>

            <div>
              <label
                class="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1"
              >
                Carrera
              </label>
              <select v-model="filtroCarrera" class="input-field">
                <option value="">TODAS LAS CARRERAS</option>
                <option
                  v-for="carrera in listaCarreras"
                  :key="carrera.id"
                  :value="carrera.nombre"
                >
                  {{ carrera.nombre }}
                </option>
              </select>
            </div>

            <div>
              <label
                class="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1"
              >
                Fecha de Registro
              </label>

              <div class="flex gap-2">
                <select v-model="modoFecha" class="input-field w-1/2">
                  <option value="TODAS">TODAS</option>
                  <option value="FECHA">FECHA ESPECÍFICA</option>
                </select>

                <input
                  v-if="modoFecha === 'FECHA'"
                  v-model="filtroFecha"
                  type="date"
                  class="input-field w-1/2"
                />
              </div>
            </div>
          </div>

          <!-- TABLA EN PROCESO -->
          <div class="table-container">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead>
                  <tr>
                    <th class="table-header-col">Fecha Reg.</th>
                    <th class="table-header-col">C.I.</th>
                    <th class="table-header-col">Postulante</th>
                    <th class="table-header-col">Institución / Carrera</th>
                    <th class="table-header-col">Modalidad</th>
                    <th class="table-header-col text-center">Docs</th>
                    <th class="table-header-col text-right">Acciones</th>
                  </tr>
                </thead>

                <tbody class="divide-y divide-slate-100">
                  <tr v-if="cargando" class="text-center">
                    <td colspan="7" class="p-8 text-slate-400 font-medium">
                      Cargando información de postulantes...
                    </td>
                  </tr>

                  <tr
                    v-else-if="postulantesFiltrados.length === 0"
                    class="text-center"
                  >
                    <td colspan="7" class="p-8 text-slate-400 font-medium">
                      No se encontraron postulantes con los criterios de búsqueda.
                    </td>
                  </tr>

                  <tr
                    v-for="item in postulantesFiltrados"
                    :key="item.id"
                    class="table-row"
                    :class="obtenerClaseFila(item)"
                  >
                    <td class="p-4 font-mono text-slate-500 text-[11px]">
                      {{ formatearFecha(obtenerFechaRegistroActual(item)) }}
                    </td>

                    <td class="p-4 font-mono font-bold text-slate-800">
                      {{ item.ci }} {{ item.expedido }}
                    </td>

                    <td class="p-4">

                        <div class="flex flex-wrap items-center gap-2">

                          <p class="font-black text-slate-800">
                            {{ item.nombres }}
                            {{ item.apellido_paterno }}
                            {{ item.apellido_materno || '' }}
                          </p>

                          <button v-if="obtenerNumeroIntento(item) > 1"
                            type="button"
                            class="repostulacion-badge"
                            @click="abrirHistorialAnterior(item)"
                          >
                            REPOSTULACIÓN
                          </button>

                        </div>

                        <div class="flex flex-wrap items-center gap-2 mt-1">

                          <p class="text-[10px] text-slate-400 font-mono">
                            Cel:
                            {{
                              item.datos_contacto_postulante?.[0]?.numero_celular ||
                              'S/N'
                            }}
                          </p>

                          <span
                            v-if="obtenerNumeroIntento(item) > 1"
                            class="intento-badge"
                          >
                            Intento {{ obtenerNumeroIntento(item) }}
                          </span>

                        </div>

                      </td>

                    <td class="p-4">
                      <p class="font-bold text-slate-700">
                        {{
                          item.formacion_academica_postulante?.[0]
                            ?.institucion_nombre || 'S/N'
                        }}
                      </p>
                      <p class="text-[11px] text-slate-500">
                        {{
                          item.formacion_academica_postulante?.[0]?.carrera ||
                          'S/N'
                        }}
                      </p>
                    </td>

                    <td class="p-4">
                      <span
                        class="px-2 py-0.5 bg-emerald-50 text-[#114d3f] border border-emerald-200 rounded text-[10px] font-extrabold"
                      >
                        {{
                          item.formacion_academica_postulante?.[0]
                            ?.modalidad_postulacion || 'S/N'
                        }}
                      </span>
                    </td>

                    <td class="p-4 text-center">
                      <span
                        class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                        :class="
                          obtenerDocumentosActuales(item).length >= 7
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        "
                      >
                        {{ obtenerDocumentosActuales(item).length }}/7
                      </span>
                    </td>

                    <td class="p-4 text-right whitespace-nowrap">
                      <div class="inline-flex items-center gap-2">
                        <!-- REVISAR / ESTADO -->
                        <button
                          @click="abrirModalRevision(item)"
                          :disabled="!puedeAbrirRevision(item)"
                          :class="[
                            obtenerClaseBoton(item),
                            !puedeAbrirRevision(item) ? 'cursor-default' : '',
                          ]"
                        >
                          <svg
                            v-if="obtenerEstadoActual(item) === 'APROBADO'"
                            class="w-3.5 h-3.5 text-emerald-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>

                          <svg
                            v-else-if="obtenerEstadoActual(item) === 'OBSERVADO'"
                            class="w-3.5 h-3.5 text-amber-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>

                          <svg
                            v-else
                            class="w-3.5 h-3.5 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>

                          <span>{{ formatearTextoBoton(item) }}</span>
                        </button>

                        <!-- RECHAZAR -->
                        <button
                          v-if="puedeRechazar(item)"
                          @click="abrirModalRechazo(item)"
                          class="btn-descartar"
                          title="Rechazar postulación"
                        >
                          <svg
                            class="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          <span>Descartar</span>
                        </button>

                        <!-- DESISTIR -->
                        <button
                          v-if="puedeDesistir(item)"
                          @click="abrirModalDesistimiento(item)"
                          class="btn-descartar"
                          title="Registrar desistimiento voluntario"
                        >
                          <svg
                            class="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          <span>Desistió</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>

        <!-- ===================================================== -->
        <!-- HISTORIAL -->
        <!-- ===================================================== -->
        <template v-else>
          <div class="filter-card grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label
                class="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1"
              >
                C.I. Postulante
              </label>
              <input
                v-model="filtroHistorialCi"
                type="text"
                placeholder="Ej: 8440940"
                class="input-field"
              />
            </div>

            <div>
              <label
                class="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1"
              >
                Apellido
              </label>
              <input
                v-model="filtroHistorialApellido"
                type="text"
                placeholder="Ej: Chavez / Mamani"
                class="input-field"
              />
            </div>

            <div>
              <label
                class="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1"
              >
                Carrera
              </label>
              <select v-model="filtroHistorialCarrera" class="input-field">
                <option value="">TODAS LAS CARRERAS</option>
                <option
                  v-for="carrera in listaCarreras"
                  :key="`hist-${carrera.id}`"
                  :value="carrera.nombre"
                >
                  {{ carrera.nombre }}
                </option>
              </select>
            </div>

            <div>
              <label
                class="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1"
              >
                Estado
              </label>
              <select v-model="filtroHistorialEstado" class="input-field">
                <option value="">TODOS</option>
                <option value="DESISTIDO">DESISTIDO</option>
                <option value="RECHAZADO">RECHAZADO</option>
              </select>
            </div>
          </div>

          <div class="table-container">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead>
                  <tr>
                    <th class="table-header-col">Fecha</th>
                    <th class="table-header-col">C.I.</th>
                    <th class="table-header-col">Postulante</th>
                    <th class="table-header-col">Carrera</th>
                    <th class="table-header-col text-center">Intento</th>
                    <th class="table-header-col text-center">Estado</th>
                    <th class="table-header-col text-right">Acciones</th>
                  </tr>
                </thead>

                <tbody class="divide-y divide-slate-100">
                  <tr v-if="cargandoHistorial">
                    <td colspan="7" class="p-8 text-center text-slate-400">
                      Cargando historial...
                    </td>
                  </tr>

                  <tr v-else-if="errorHistorial">
                    <td colspan="7" class="p-8 text-center">
                      <p class="text-red-600 font-bold text-xs">
                        {{ errorHistorial }}
                      </p>
                      <button
                        @click="cargarHistorial"
                        class="mt-3 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                      >
                        Reintentar
                      </button>
                    </td>
                  </tr>

                  <tr v-else-if="historialFiltrado.length === 0">
                    <td colspan="7" class="p-8 text-center text-slate-400">
                      No existen postulaciones finalizadas con esos filtros.
                    </td>
                  </tr>

                  <tr
                    v-for="item in historialFiltrado"
                    :key="item.postulacion_id"
                    class="table-row"
                  >
                    <td class="p-4 text-slate-500 font-mono">
                      {{
                        formatearFecha(
                          item.fecha_cierre || item.fecha_ultimo_cambio,
                        )
                      }}
                    </td>

                    <td class="p-4 font-bold text-slate-800">
                      {{ item.postulante?.ci }} {{ item.postulante?.expedido }}
                    </td>

                    <td class="p-4">
                      <p class="font-black text-slate-800">
                        {{ item.postulante?.nombres }}
                        {{ item.postulante?.apellido_paterno }}
                        {{ item.postulante?.apellido_materno || '' }}
                      </p>
                    </td>

                    <td class="p-4 text-slate-600">
                      {{
                        item.postulante?.formacion_academica_postulante?.[0]
                          ?.carrera || 'S/N'
                      }}
                    </td>

                    <td class="p-4 text-center">
                      <span
                        class="px-2 py-1 rounded-lg bg-slate-100 text-slate-700 font-black"
                      >
                        #{{ item.numero_intento }}
                      </span>
                    </td>

                    <td class="p-4 text-center">
                      <span
                        v-if="item.estado_actual === 'DESISTIDO'"
                        class="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-black text-[10px]"
                      >
                        DESISTIDO
                      </span>

                      <span
                        v-else
                        class="px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 font-black text-[10px]"
                      >
                        RECHAZADO
                      </span>
                    </td>

                    <td class="p-4 text-right">
                      <button
                        @click="abrirDetalleHistorial(item)"
                        class="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>
      </main>
    </div>

    <!-- ======================================================= -->
    <!-- MODAL DE REVISIÓN DOCUMENTAL -->
    <!-- ======================================================= -->
    <div v-if="postulanteSeleccionado" class="modal-backdrop">
      <div class="modal-box">
        <div
          class="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50"
        >
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span
                class="text-[10px] font-extrabold uppercase tracking-widest text-[#114d3f]"
              >
                Panel de Cotejo y Validación
              </span>

              <span
                class="px-2 py-0.5 rounded text-[9px] font-extrabold"
                :class="{
                  'bg-emerald-100 text-emerald-800':
                    obtenerEstadoActual(postulanteSeleccionado) === 'APROBADO',
                  'bg-amber-100 text-amber-800':
                    obtenerEstadoActual(postulanteSeleccionado) === 'OBSERVADO',
                  'bg-slate-200 text-slate-700':
                    obtenerEstadoActual(postulanteSeleccionado) === 'REGISTRADO' ||
                    obtenerEstadoActual(postulanteSeleccionado) ===
                      'EN_EVALUACION_RRHH',
                }"
              >
                ESTADO: {{ obtenerEstadoActual(postulanteSeleccionado) }}
              </span>
            </div>

            <h3 class="text-sm font-black text-slate-800">
              {{ postulanteSeleccionado.nombres }}
              {{ postulanteSeleccionado.apellido_paterno }}
              {{ postulanteSeleccionado.apellido_materno || '' }}
            </h3>

            <p class="text-[11px] text-slate-500">
              CI: {{ postulanteSeleccionado.ci }}
              {{ postulanteSeleccionado.expedido }} •
              {{
                postulanteSeleccionado.formacion_academica_postulante?.[0]
                  ?.carrera || 'S/N'
              }}
            </p>
          </div>

          <button
            @click="cerrarModal"
            class="w-7 h-7 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 font-bold flex items-center justify-center text-xs"
          >
            ✕
          </button>
        </div>

        <div class="p-5 overflow-y-auto space-y-3.5 max-h-[58vh]">
          <div
            class="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-[11px] text-[#114d3f] font-medium"
          >
            <span>
              Abra el documento y elija <strong>✓ (Aprobar)</strong> o
              <strong>✕ (Observar)</strong>. Puede dejar un comentario para cada
              requisito.
            </span>
          </div>

          <div
            v-for="(doc, idx) in obtenerDocumentosActuales(postulanteSeleccionado)"
            :key="doc.id || idx"
            class="doc-card-review"
            :class="{
              'doc-card-valid': revisiones[doc.id]?.verificado === true,
              'doc-card-invalid': revisiones[doc.id]?.verificado === false,
            }"
          >
            <div class="flex items-center justify-between gap-4">
              <div class="flex items-center gap-3 min-w-0 flex-1">
                <div
                  class="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-[10px] flex-shrink-0"
                >
                  PDF
                </div>

                <div class="min-w-0">
                  <p class="text-xs font-bold text-slate-800 truncate">
                    {{ formatearTipoDocumento(doc.tipo_documento) }}
                  </p>
                  <p class="text-[10px] text-slate-400 font-mono truncate">
                    Documento protegido
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-2 flex-shrink-0">
                <button
                  @click="abrirPdf(doc)"
                  class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1 transition border border-slate-200"
                >
                  <span>Abrir</span>
                  <span>↗</span>
                </button>

                <button
                  @click="marcarDocumento(doc.id, true)"
                  class="btn-doc-choice"
                  :class="
                    revisiones[doc.id]?.verificado === true
                      ? 'btn-check-active'
                      : 'btn-check-inactive'
                  "
                  title="Marcar como Válido / Aprobado"
                >
                  ✓
                </button>

                <button
                  @click="marcarDocumento(doc.id, false)"
                  class="btn-doc-choice"
                  :class="
                    revisiones[doc.id]?.verificado === false
                      ? 'btn-cross-active'
                      : 'btn-cross-inactive'
                  "
                  title="Marcar como Observado"
                >
                  ✕
                </button>
              </div>
            </div>

            <div
              v-if="revisiones[doc.id]?.verificado === false"
              class="mt-3 pt-3 border-t border-red-100 space-y-2"
            >
              <label
                class="block text-[10px] font-extrabold text-red-700 uppercase tracking-wider"
              >
                Motivo de observación *
              </label>

              <select
                v-model="revisiones[doc.id].motivo_observacion"
                class="comment-input"
              >
                <option value="" disabled>
                  Seleccione el motivo de la observación...
                </option>

                <option
                  v-for="motivo in obtenerMotivosObservacion(doc.tipo_documento)"
                  :key="motivo"
                  :value="motivo"
                >
                  {{ motivo }}
                </option>
              </select>

                      <textarea
                        v-if="revisiones[doc.id].motivo_observacion === 'Otro'"
                        v-model="revisiones[doc.id].detalle_otro"
                        rows="2"
                        maxlength="300"
                        placeholder="Especifique el motivo de la observación..."
                        class="comment-input resize-none"
                      ></textarea>

                      <p
                        v-if="revisiones[doc.id].motivo_observacion"
                        class="text-[10px] text-red-600 font-medium"
                      >
                        Este motivo será comunicado al postulante para que corrija el documento.
                      </p>
                    </div>

                    <div
                      v-else-if="revisiones[doc.id]?.verificado === true"
                      class="mt-3 pt-3 border-t border-emerald-100"
                    >
                      <p
                        class="text-[11px] text-emerald-700 font-bold"
                      >
                        Documento aprobado. No requiere observación.
                      </p>
              </div>
          </div>
        </div>

        <div
          class="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between"
        >
          <div class="text-[11px] font-bold text-slate-500 space-x-3">
            <span>
              Aprobados:
              <strong class="text-[#114d3f] font-mono">{{ totalAprobados }}</strong>
            </span>
            <span>
              Observados:
              <strong class="text-red-600 font-mono">{{ totalObservados }}</strong>
            </span>
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="cerrarModal"
              class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider"
            >
              Cancelar
            </button>

            <button
              @click="guardarRevisionCompleta"
              :disabled="guardando"
              class="px-5 py-2 bg-gradient-to-r from-[#114d3f] to-[#176b58] hover:brightness-110 disabled:opacity-50 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md transition"
            >
              <span>{{ guardando ? 'Guardando...' : 'Guardar Evaluación' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ======================================================= -->
    <!-- MODAL DE RECHAZO -->
    <!-- ======================================================= -->
    <div
      v-if="modalRechazo && postulanteRechazo"
      class="modal-backdrop"
    >
      <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div
          class="px-5 py-4 bg-red-50 border-b border-red-100 flex items-center justify-between"
        >
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-red-600">
              Talento Humano
            </p>
            <h3 class="text-base font-black text-slate-800 mt-1">
              Rechazar postulación
            </h3>
          </div>

          <button
            @click="cerrarModalRechazo"
            :disabled="guardandoRechazo"
            class="w-8 h-8 rounded-full bg-white border border-red-100 text-slate-500 hover:bg-red-100 flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        <div class="p-5 space-y-4">
          <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <p class="text-[10px] uppercase font-extrabold text-slate-400">
              Postulante
            </p>
            <p class="font-black text-slate-800 mt-1">
              {{ postulanteRechazo.nombres }} {{ postulanteRechazo.apellido_paterno }}
              {{ postulanteRechazo.apellido_materno || '' }}
            </p>
            <p class="text-xs text-slate-500 mt-1">
              C.I.: {{ postulanteRechazo.ci }} {{ postulanteRechazo.expedido }}
            </p>
          </div>

          <div
            class="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 leading-relaxed"
          >
            Al confirmar, la postulación quedará como
            <strong>RECHAZADA</strong>. El motivo quedará registrado para consulta
            posterior.
          </div>

          <div>
            <label
              class="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5"
            >
              Motivo del rechazo
            </label>
            <textarea
              v-model="motivoRechazo"
              rows="4"
              maxlength="500"
              placeholder="Ej.: No cumple con los requisitos documentales establecidos."
              class="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 resize-none"
            ></textarea>
            <p class="text-[10px] text-slate-400 text-right mt-1">
              {{ motivoRechazo.length }}/500
            </p>
          </div>
        </div>

        <div
          class="px-5 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2"
        >
          <button
            @click="cerrarModalRechazo"
            :disabled="guardandoRechazo"
            class="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            @click="confirmarRechazo"
            :disabled="guardandoRechazo"
            class="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm disabled:opacity-50"
          >
            {{ guardandoRechazo ? 'Procesando...' : 'Confirmar rechazo' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ======================================================= -->
    <!-- MODAL DE DESISTIMIENTO -->
    <!-- ======================================================= -->
    <div
      v-if="modalDesistimiento && postulanteDesistimiento"
      class="modal-backdrop"
    >
      <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div
          class="px-5 py-4 bg-amber-50 border-b border-amber-100 flex items-center justify-between"
        >
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-amber-700">
              Gestión de postulación
            </p>
            <h3 class="text-base font-black text-slate-800 mt-1">
              Confirmar desistimiento
            </h3>
          </div>

          <button
            @click="cerrarModalDesistimiento"
            :disabled="guardandoDesistimiento"
            class="w-8 h-8 rounded-full bg-white border border-amber-100 text-slate-500 hover:bg-amber-100 flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        <div class="p-5 space-y-4">
          <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <p class="text-[10px] uppercase font-extrabold text-slate-400">
              Postulante
            </p>
            <p class="font-black text-slate-800 mt-1">
              {{ postulanteDesistimiento.nombres }}
              {{ postulanteDesistimiento.apellido_paterno }}
              {{ postulanteDesistimiento.apellido_materno || '' }}
            </p>
            <p class="text-xs text-slate-500 mt-1">
              C.I.: {{ postulanteDesistimiento.ci }}
              {{ postulanteDesistimiento.expedido }}
            </p>
          </div>

          <div
            class="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 leading-relaxed"
          >
            Al confirmar, la postulación actual será cerrada como
            <strong>DESISTIDA</strong>. El postulante podrá realizar una nueva
            postulación posteriormente.
          </div>

          <div>
            <label
              class="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5"
            >
              Motivo u observación
            </label>
            <textarea
              v-model="motivoDesistimiento"
              rows="4"
              maxlength="500"
              placeholder="Ej.: El postulante informó que actualmente no dispone de tiempo para continuar con el proceso."
              class="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-300 resize-none"
            ></textarea>
            <p class="text-[10px] text-slate-400 text-right mt-1">
              {{ motivoDesistimiento.length }}/500
            </p>
          </div>
        </div>

        <div
          class="px-5 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2"
        >
          <button
            @click="cerrarModalDesistimiento"
            :disabled="guardandoDesistimiento"
            class="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            @click="confirmarDesistimiento"
            :disabled="guardandoDesistimiento"
            class="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm disabled:opacity-50"
          >
            {{
              guardandoDesistimiento
                ? 'Procesando...'
                : 'Confirmar desistimiento'
            }}
          </button>
        </div>
      </div>
    </div>

    <!-- ======================================================= -->
    <!-- MODAL DETALLE DE HISTORIAL -->
    <!-- ======================================================= -->
    <div v-if="historialSeleccionado" class="modal-backdrop">
      <div class="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
        <div
          class="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between"
        >
          <div>
            <p
              class="text-[10px] font-black uppercase tracking-widest text-[#114d3f]"
            >
              Trazabilidad de la postulación
            </p>
            <h3 class="text-base font-black text-slate-800 mt-1">
              Detalle del historial
            </h3>
          </div>

          <button
            @click="cerrarDetalleHistorial"
            class="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 font-bold flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <div class="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <p class="text-[10px] uppercase font-extrabold text-slate-400">
                Postulante
              </p>
              <p class="font-black text-slate-800 mt-1">
                {{ historialSeleccionado.postulante?.nombres }}
                {{ historialSeleccionado.postulante?.apellido_paterno }}
                {{ historialSeleccionado.postulante?.apellido_materno || '' }}
              </p>
              <p class="text-xs text-slate-500 mt-1">
                C.I.: {{ historialSeleccionado.postulante?.ci }}
                {{ historialSeleccionado.postulante?.expedido }}
              </p>
            </div>

            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <p class="text-[10px] uppercase font-extrabold text-slate-400">
                Postulación
              </p>
              <p class="font-black text-slate-800 mt-1">
                Intento #{{ historialSeleccionado.numero_intento }}
              </p>
              <p class="text-xs text-slate-500 mt-1">
                Inicio: {{ formatearFecha(historialSeleccionado.fecha_inicio) }}
              </p>
            </div>
          </div>

          <div
            class="p-4 rounded-xl border"
            :class="
              historialSeleccionado.estado_actual === 'DESISTIDO'
                ? 'bg-amber-50 border-amber-200'
                : 'bg-red-50 border-red-200'
            "
          >
            <div class="flex items-center justify-between gap-3 mb-2">
              <p class="text-[10px] uppercase font-extrabold text-slate-500">
                Estado final
              </p>
              <span
                class="px-3 py-1 rounded-full text-[10px] font-black"
                :class="
                  historialSeleccionado.estado_actual === 'DESISTIDO'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-red-100 text-red-800'
                "
              >
                {{ historialSeleccionado.estado_actual }}
              </span>
            </div>

            <p class="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              <strong>Motivo:</strong>
              {{ historialSeleccionado.motivo || 'Sin observación registrada.' }}
            </p>

            <p class="text-[10px] text-slate-500 mt-3">
              Último cambio:
              {{
                formatearFechaHora(
                  historialSeleccionado.fecha_ultimo_cambio ||
                    historialSeleccionado.fecha_cierre,
                )
              }}
            </p>
          </div>

          <div>
            <h4 class="text-xs font-black text-slate-800 mb-3">
              Historial de cambios
            </h4>

            <div
              v-if="!historialSeleccionado.historial?.length"
              class="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-400"
            >
              No existen movimientos registrados para este intento.
            </div>

            <div v-else class="space-y-2">
              <div
                v-for="movimiento in historialSeleccionado.historial"
                :key="movimiento.id"
                class="p-3 rounded-xl border border-slate-200 bg-white"
              >
                <div class="flex flex-wrap items-center gap-2 text-[10px] font-black">
                  <span class="px-2 py-1 rounded bg-slate-100 text-slate-600">
                    {{ movimiento.estado_anterior || 'INICIO' }}
                  </span>
                  <span class="text-slate-400">→</span>
                  <span class="px-2 py-1 rounded bg-emerald-50 text-[#114d3f]">
                    {{ movimiento.estado_nuevo }}
                  </span>
                </div>

                <p
                  v-if="movimiento.observacion"
                  class="mt-2 text-xs text-slate-600 whitespace-pre-line"
                >
                  {{ movimiento.observacion }}
                </p>

                <p class="mt-2 text-[10px] text-slate-400">
                  {{ formatearFechaHora(movimiento.created_at) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="px-5 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            @click="cerrarDetalleHistorial"
            class="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'admin',
})

import { computed, onMounted, reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const { $api } = useNuxtApp()

// ============================================================
// DATOS GENERALES
// ============================================================

const listaPostulantes = ref([])
const listaCarreras = ref([])
const listaHistorial = ref([])

const cargando = ref(true)
const guardando = ref(false)
const cargandoHistorial = ref(false)
const historialCargado = ref(false)
const errorHistorial = ref('')

const vistaActiva = ref('ACTIVOS')

// ============================================================
// FILTROS - EN PROCESO
// ============================================================

const filtroCi = ref('')
const filtroApellido = ref('')
const filtroCarrera = ref('')
const filtroFecha = ref('')
const modoFecha = ref('TODAS')

// ============================================================
// FILTROS - HISTORIAL
// ============================================================

const filtroHistorialCi = ref('')
const filtroHistorialApellido = ref('')
const filtroHistorialCarrera = ref('')
const filtroHistorialEstado = ref('')

// ============================================================
// MODAL DE REVISIÓN DOCUMENTAL
// ============================================================

const postulanteSeleccionado = ref(null)
const revisiones = reactive({})

// ============================================================
// MODAL DE RECHAZO
// ============================================================

const modalRechazo = ref(false)
const postulanteRechazo = ref(null)
const motivoRechazo = ref('')
const guardandoRechazo = ref(false)

// ============================================================
// MODAL DE DESISTIMIENTO
// ============================================================

const modalDesistimiento = ref(false)
const postulanteDesistimiento = ref(null)
const motivoDesistimiento = ref('')
const guardandoDesistimiento = ref(false)

// ============================================================
// MODAL DE HISTORIAL
// ============================================================

const historialSeleccionado = ref(null)

// ============================================================
// HELPERS DE POSTULACIÓN ACTUAL
// ============================================================

const obtenerPostulacionActual = (postulante) => {
  if (!postulante?.postulaciones || !Array.isArray(postulante.postulaciones)) {
    return null
  }

  return postulante.postulaciones[0] || null
}

const obtenerEstadoActual = (postulante) => {
  const postulacionActual = obtenerPostulacionActual(postulante)

  if (postulacionActual?.estados_postulacion?.estado_actual) {
    return postulacionActual.estados_postulacion.estado_actual
  }

  if (!postulante?.estados_postulacion) {
    return 'REGISTRADO'
  }

  if (Array.isArray(postulante.estados_postulacion)) {
    return postulante.estados_postulacion[0]?.estado_actual || 'REGISTRADO'
  }

  return postulante.estados_postulacion.estado_actual || 'REGISTRADO'
}

const obtenerDocumentosActuales = (postulante) => {
  const postulacionActual = obtenerPostulacionActual(postulante)

  if (Array.isArray(postulacionActual?.documentos_postulante)) {
    return postulacionActual.documentos_postulante
  }

  return Array.isArray(postulante?.documentos_postulante)
    ? postulante.documentos_postulante
    : []
}

const obtenerFechaRegistroActual = (postulante) => {
  const postulacionActual = obtenerPostulacionActual(postulante)
  return postulacionActual?.fecha_inicio || postulante?.created_at || null
}

const obtenerNumeroIntento = (postulante) => {
  const postulacionActual =
    obtenerPostulacionActual(postulante)

  return postulacionActual?.numero_intento || 1
}
const estadosTerminales = ['RECHAZADO', 'DESISTIDO']

const estadosDesistibles = [
  'REGISTRADO',
  'EN_EVALUACION_RRHH',
  'OBSERVADO',
  'APROBADO',
  'HABILITADO',
  'SELECCIONADO_POR_AREA',
  'APROBADO_PARA_ENTREVISTA',
  'ACEPTADO',
]

const estadosRechazables = [
  'REGISTRADO',
  'EN_EVALUACION_RRHH',
  'OBSERVADO',
]

const estadosRevisables = [
  'REGISTRADO',
  'EN_EVALUACION_RRHH',
  'OBSERVADO',
]

const estadosVerificados = [
  'APROBADO',
  'HABILITADO',
  'SELECCIONADO_POR_AREA',
  'APROBADO_PARA_ENTREVISTA',
  'ACEPTADO',
]

const puedeAbrirRevision = (postulante) =>
  estadosRevisables.includes(obtenerEstadoActual(postulante))

const puedeDesistir = (postulante) =>
  estadosDesistibles.includes(obtenerEstadoActual(postulante))

const puedeRechazar = (postulante) =>
  estadosRechazables.includes(obtenerEstadoActual(postulante))

// ============================================================
// CARGA DE DATOS
// ============================================================

const cargarDatos = async () => {
  cargando.value = true

  try {
    const [postulantes, carreras] = await Promise.all([
      $api('/postulaciones'),
      $api('/carreras'),
    ])

    listaPostulantes.value = Array.isArray(postulantes) ? postulantes : []
    listaCarreras.value = Array.isArray(carreras) ? carreras : []
  } catch (error) {
    console.error('Error al cargar datos:', error)
  } finally {
    cargando.value = false
  }
}

const cargarHistorial = async () => {
  cargandoHistorial.value = true
  errorHistorial.value = ''

  try {
    const historial = await $api('/postulaciones/historial')

    listaHistorial.value = Array.isArray(historial) ? historial : []
    historialCargado.value = true
  } catch (error) {
    console.error('Error al cargar historial:', error)

    const mensaje = Array.isArray(error?.data?.message)
      ? error.data.message.join(', ')
      : error?.data?.message

    errorHistorial.value =
      mensaje ||
      error?.message ||
      'No se pudo cargar el historial de postulaciones.'
  } finally {
    cargandoHistorial.value = false
  }
}

const cambiarVista = async (vista) => {
  vistaActiva.value = vista

  if (vista === 'HISTORIAL' && !historialCargado.value) {
    await cargarHistorial()
  }
}

onMounted(() => {
  authStore.cargarSesion()

  if (!authStore.estaAutenticado) {
    navigateTo('/')
    return
  }

  cargarDatos()
})

// ============================================================
// FILTRO DE POSTULANTES EN PROCESO
// ============================================================

const postulantesFiltrados = computed(() => {
  return listaPostulantes.value.filter((p) => {
    const estado = obtenerEstadoActual(p)

    if (estadosTerminales.includes(estado)) {
      return false
    }

    const coincideCi = filtroCi.value
      ? String(p.ci || '')
          .toLowerCase()
          .includes(filtroCi.value.trim().toLowerCase())
      : true

    const apellidos = `${p.apellido_paterno || ''} ${p.apellido_materno || ''}`
      .toLowerCase()

    const coincideApellido = filtroApellido.value
      ? apellidos.includes(filtroApellido.value.trim().toLowerCase())
      : true

    const carreraPostulante =
      p.formacion_academica_postulante?.[0]?.carrera?.toLowerCase() || ''

    const coincideCarrera = filtroCarrera.value
      ? carreraPostulante === filtroCarrera.value.toLowerCase()
      : true

    let coincideFecha = true

    if (modoFecha.value === 'FECHA' && filtroFecha.value) {
      const fechaRaw = obtenerFechaRegistroActual(p)

      if (!fechaRaw) {
        coincideFecha = false
      } else {
        const fechaPostulante = new Date(fechaRaw)
        const anio = fechaPostulante.getFullYear()
        const mes = String(fechaPostulante.getMonth() + 1).padStart(2, '0')
        const dia = String(fechaPostulante.getDate()).padStart(2, '0')
        const fechaFormateada = `${anio}-${mes}-${dia}`

        coincideFecha = fechaFormateada === filtroFecha.value
      }
    }

    return (
      coincideCi &&
      coincideApellido &&
      coincideCarrera &&
      coincideFecha
    )
  })
})

// ============================================================
// FILTRO DE HISTORIAL
// ============================================================

const historialFiltrado = computed(() => {
  return listaHistorial.value.filter((item) => {
    const postulante = item.postulante || {}

    const coincideCi = filtroHistorialCi.value
      ? String(postulante.ci || '')
          .toLowerCase()
          .includes(filtroHistorialCi.value.trim().toLowerCase())
      : true

    const apellidos = `${postulante.apellido_paterno || ''} ${
      postulante.apellido_materno || ''
    }`.toLowerCase()

    const coincideApellido = filtroHistorialApellido.value
      ? apellidos.includes(filtroHistorialApellido.value.trim().toLowerCase())
      : true

    const carrera =
      postulante.formacion_academica_postulante?.[0]?.carrera?.toLowerCase() || ''

    const coincideCarrera = filtroHistorialCarrera.value
      ? carrera === filtroHistorialCarrera.value.toLowerCase()
      : true

    const coincideEstado = filtroHistorialEstado.value
      ? item.estado_actual === filtroHistorialEstado.value
      : true

    return (
      coincideCi &&
      coincideApellido &&
      coincideCarrera &&
      coincideEstado
    )
  })
})

// ============================================================
// ESTILOS Y TEXTOS DE ESTADO
// ============================================================

const obtenerClaseFila = (postulante) => {
  const est = obtenerEstadoActual(postulante)

  if (estadosVerificados.includes(est)) {
    return 'row-verificado'
  }

  if (est === 'OBSERVADO') {
    return 'row-observado'
  }

  return 'row-sin-verificar'
}

const obtenerClaseBoton = (postulante) => {
  const est = obtenerEstadoActual(postulante)

  if (estadosVerificados.includes(est)) {
    return 'btn-verificado'
  }

  if (est === 'OBSERVADO') {
    return 'btn-observado'
  }

  return 'btn-sin-verificar'
}

const formatearTextoBoton = (postulante) => {
  const est = obtenerEstadoActual(postulante)

  const etiquetas = {
    REGISTRADO: 'Revisar Documentos',
    EN_EVALUACION_RRHH: 'En Evaluación',
    OBSERVADO: 'Observado',
    APROBADO: 'Aprobado',
    HABILITADO: 'Habilitado',
    SELECCIONADO_POR_AREA: 'Seleccionado',
    APROBADO_PARA_ENTREVISTA: 'Para Entrevista',
    ACEPTADO: 'Aceptado',
  }

  return etiquetas[est] || est
}

// ============================================================
// REVISIÓN DOCUMENTAL
// ============================================================

const motivosObservacion = {
  CARTA_SOLICITUD: [
    'Carta de solicitud mal elaborada',
    'Documento ilegible',
    'Documento borroso / baja resolución',
    'Documento incompleto',
    'Documento incorrecto / no corresponde al requisito',
    'Carta de solicitud sin firma',
    'Carta de solicitud sin sello',
    'Falta identificación de la autoridad competente',
    'Carta dirigida incorrectamente',
    'Datos del postulante incompletos o incorrectos',
    'Otro',
  ],

  RECORD_ACADEMICO: [
    'Documento ilegible',
    'Documento borroso / baja resolución',
    'Documento incompleto',
    'Documento incorrecto / no corresponde al requisito',
    'Récord académico sin firma',
    'Récord académico sin sello',
    'Información académica incompleta',
    'Datos inconsistentes',
    'Documento cortado o mal escaneado',
    'Otro',
  ],

  HOJA_DE_VIDA: [
    'Documento ilegible',
    'Documento borroso / baja resolución',
    'Documento incompleto',
    'Documento incorrecto / no corresponde al requisito',
    'Hoja de vida incompleta',
    'Hoja de vida desactualizada',
    'Datos personales incompletos',
    'Datos inconsistentes',
    'Otro',
  ],

  FOTOCOPIA_CI: [
    'Documento ilegible',
    'Documento borroso / baja resolución',
    'Documento incompleto',
    'Documento incorrecto / no corresponde al requisito',
    'Carnet de identidad vencido / expirado',
    'Falta anverso del carnet de identidad',
    'Falta reverso del carnet de identidad',
    'Documento cortado o mal escaneado',
    'Datos del documento no coinciden con el postulante',
    'Otro',
  ],

  FACTURA_SERVICIO_BASICO: [
    'Documento ilegible',
    'Documento borroso / baja resolución',
    'Documento incompleto',
    'Documento incorrecto / no corresponde al requisito',
    'Factura vencida / fuera del periodo permitido',
    'Factura desactualizada',
    'Factura no corresponde al domicilio declarado',
    'Dirección del domicilio no identificable',
    'Datos inconsistentes',
    'Otro',
  ],

  CROQUIS_DOMICILIO: [
    'Documento ilegible',
    'Documento borroso / baja resolución',
    'Documento incompleto',
    'Documento incorrecto / no corresponde al requisito',
    'Croquis de domicilio incompleto',
    'Ubicación del domicilio no identificable',
    'Croquis no corresponde al domicilio declarado',
    'Faltan referencias de ubicación',
    'Otro',
  ],

  REFERENCIAS_PERSONALES: [
    'Documento ilegible',
    'Documento borroso / baja resolución',
    'Documento incompleto',
    'Documento incorrecto / no corresponde al requisito',
    'Referencias personales incompletas',
    'Faltan referencias personales requeridas',
    'Faltan números de contacto',
    'Faltan fotocopias de C.I.',
    'Falta información de las referencias',
    'Datos inconsistentes',
    'Otro',
  ],
}


const obtenerMotivosObservacion = (tipoDocumento) => {
  return (
    motivosObservacion[tipoDocumento] || [
      'Documento ilegible',
      'Documento borroso / baja resolución',
      'Documento incompleto',
      'Documento incorrecto / no corresponde al requisito',
      'Documento vencido / expirado',
      'Datos inconsistentes',
      'Otro',
    ]
  )
}


const construirObservacion = (revision) => {
  if (
    !revision ||
    revision.verificado !== false
  ) {
    return ''
  }

  if (
    revision.motivo_observacion === 'Otro'
  ) {
    return String(
      revision.detalle_otro || '',
    ).trim()
  }

  return String(
    revision.motivo_observacion || '',
  ).trim()
}

const abrirModalRevision = async (postulante) => {
  try {
    let postulanteActual = postulante
    const estadoActual = obtenerEstadoActual(postulanteActual)

    if (estadoActual === 'REGISTRADO' || estadoActual === 'OBSERVADO') {
      await $api(`/postulaciones/${postulanteActual.id}/iniciar-evaluacion`, {
        method: 'PATCH',
      })

      await cargarDatos()

      postulanteActual =
        listaPostulantes.value.find((item) => item.id === postulanteActual.id) ||
        postulanteActual
    }

    const nuevoEstado = obtenerEstadoActual(postulanteActual)

    if (nuevoEstado !== 'EN_EVALUACION_RRHH') {
      alert(
        `No se puede revisar la documentación mientras la postulación se encuentre en estado ${nuevoEstado}.`,
      )
      return
    }

    postulanteSeleccionado.value = postulanteActual

    Object.keys(revisiones).forEach((key) => {
      delete revisiones[key]
    })

    obtenerDocumentosActuales(postulanteActual).forEach((doc) => {
        const observacionAnterior =
          String(doc.observacion || '').trim()

        const motivosPermitidos =
          obtenerMotivosObservacion(
            doc.tipo_documento,
          )

        let motivoObservacion = ''
        let detalleOtro = ''

        if (observacionAnterior) {
          if (
            motivosPermitidos.includes(
              observacionAnterior,
            )
          ) {
            motivoObservacion =
              observacionAnterior
          } else {
            motivoObservacion =
              'Otro'

            detalleOtro =
              observacionAnterior
          }
        }

        revisiones[doc.id] = {
          verificado:
            typeof doc.verificado === 'boolean'
              ? doc.verificado
              : null,

          motivo_observacion:
            motivoObservacion,

          detalle_otro:
            detalleOtro,
        }
      })
  } catch (error) {
    const mensaje = Array.isArray(error?.data?.message)
      ? error.data.message.join(', ')
      : error?.data?.message

    alert(
      mensaje ||
        error?.message ||
        'No se pudo iniciar la revisión de la postulación.',
    )
  }
}

    const marcarDocumento = (
      docId,
      esValido,
    ) => {
      if (!revisiones[docId]) {
        revisiones[docId] = {
          verificado: null,
          motivo_observacion: '',
          detalle_otro: '',
        }
      }

      revisiones[docId].verificado =
        esValido

      if (esValido) {
        revisiones[docId].motivo_observacion =
          ''

        revisiones[docId].detalle_otro =
          ''
      }
    }

const abrirPdf = async (doc) => {
  if (!doc?.id) {
    alert('No se pudo identificar el documento.')
    return
  }

  const ventana = window.open('about:blank', '_blank')

  try {
    const archivo = await $api(`/documentos/${doc.id}/archivo`, {
      method: 'GET',
      responseType: 'blob',
    })

    if (!(archivo instanceof Blob)) {
      throw new Error('El servidor no devolvió un PDF válido.')
    }

    const blobPdf =
      archivo.type === 'application/pdf'
        ? archivo
        : new Blob([archivo], {
            type: 'application/pdf',
          })

    const urlTemporal = URL.createObjectURL(blobPdf)

    if (!ventana) {
      URL.revokeObjectURL(urlTemporal)
      throw new Error(
        'El navegador bloqueó la ventana del PDF. Permita las ventanas emergentes para este sitio.',
      )
    }

    ventana.opener = null
    ventana.location.href = urlTemporal

    setTimeout(() => {
      URL.revokeObjectURL(urlTemporal)
    }, 60_000)
  } catch (error) {
    if (ventana) {
      ventana.close()
    }

    const mensaje = Array.isArray(error?.data?.message)
      ? error.data.message.join(', ')
      : error?.data?.message

    alert(
      mensaje || error?.message || 'No se pudo abrir el documento.',
    )
  }
}

const cerrarModal = () => {
  postulanteSeleccionado.value = null
}

const totalAprobados = computed(() =>
  Object.values(revisiones).filter((r) => r.verificado === true).length,
)

const totalObservados = computed(() =>
  Object.values(revisiones).filter((r) => r.verificado === false).length,
)

const guardarRevisionCompleta = async () => {
  if (!postulanteSeleccionado.value) {
    return
  }

  const documentos = obtenerDocumentosActuales(postulanteSeleccionado.value)

  if (documentos.length === 0) {
    alert('El postulante no tiene documentos registrados.')
    return
  }

  const documentosSinRevisar = documentos.filter(
    (doc) => typeof revisiones[doc.id]?.verificado !== 'boolean',
  )

  if (documentosSinRevisar.length > 0) {
    alert(
      `Debe revisar todos los documentos. Faltan ${documentosSinRevisar.length}.`,
    )
    return
  }

  const documentosObservadosSinMotivo =
  documentos.filter((doc) => {
    const revision =
      revisiones[doc.id]

    return (
      revision?.verificado === false &&
      !revision?.motivo_observacion
    )
  })


if (
  documentosObservadosSinMotivo.length > 0
) {
  alert(
    'Todo documento observado debe tener un motivo seleccionado.',
  )

  return
}


const documentosOtroSinDetalle =
      documentos.filter((doc) => {
        const revision =
          revisiones[doc.id]

        return (
          revision?.verificado === false &&
          revision?.motivo_observacion ===
            'Otro' &&
          !String(
            revision?.detalle_otro || '',
          ).trim()
        )
      })


      if (
        documentosOtroSinDetalle.length > 0
      ) {
        alert(
          'Debe especificar el motivo cuando seleccione "Otro".',
        )

        return
      }

      guardando.value = true

      try {
        const listaRevisiones =
      documentos.map((doc) => {

        const revision =
          revisiones[doc.id]

        return {
          documento_id:
            doc.id,

          verificado:
            revision.verificado,

          observacion:
            construirObservacion(
              revision,
            ),
        }
      })

    const cantidadObservados = listaRevisiones.filter(
      (revision) => revision.verificado === false,
    ).length

    await $api(
      `/postulaciones/${postulanteSeleccionado.value.id}/revisar-documentos`,
      {
        method: 'PATCH',
        body: {
          revisiones: listaRevisiones,
          observacion_general:
            cantidadObservados > 0
              ? `Expediente con ${cantidadObservados} documento(s) observado(s).`
              : 'Todos los requisitos fueron verificados y aprobados.',
        },
      },
    )

    await cargarDatos()
    cerrarModal()
  } catch (error) {
    const mensaje = Array.isArray(error?.data?.message)
      ? error.data.message.join(', ')
      : error?.data?.message

    alert(
      mensaje ||
        error?.message ||
        'No se pudo guardar la evaluación.',
    )
  } finally {
    guardando.value = false
  }
}

// ============================================================
// RECHAZO
// ============================================================

const abrirModalRechazo = (postulante) => {
  postulanteRechazo.value = postulante
  motivoRechazo.value = ''
  modalRechazo.value = true
}

const cerrarModalRechazo = () => {
  if (guardandoRechazo.value) {
    return
  }

  modalRechazo.value = false
  postulanteRechazo.value = null
  motivoRechazo.value = ''
}

const confirmarRechazo = async () => {
  if (!postulanteRechazo.value) {
    return
  }

  const motivo = motivoRechazo.value.trim()

  if (!motivo) {
    alert('Debe registrar el motivo del rechazo.')
    return
  }

  guardandoRechazo.value = true

  try {
    let estadoActual = obtenerEstadoActual(postulanteRechazo.value)

    if (estadoActual === 'REGISTRADO' || estadoActual === 'OBSERVADO') {
      await $api(
        `/postulaciones/${postulanteRechazo.value.id}/iniciar-evaluacion`,
        {
          method: 'PATCH',
        },
      )

      estadoActual = 'EN_EVALUACION_RRHH'
    }

    if (estadoActual !== 'EN_EVALUACION_RRHH') {
      throw new Error(
        `No se puede rechazar una postulación que se encuentra en estado ${estadoActual}.`,
      )
    }

    await $api(`/postulaciones/${postulanteRechazo.value.id}/descartar`, {
      method: 'PATCH',
      body: {
        motivo,
      },
    })

    cerrarModalRechazoForzado()
    await cargarDatos()

    if (historialCargado.value || vistaActiva.value === 'HISTORIAL') {
      await cargarHistorial()
    }
  } catch (error) {
    const mensaje = Array.isArray(error?.data?.message)
      ? error.data.message.join(', ')
      : error?.data?.message

    alert(
      mensaje || error?.message || 'No se pudo rechazar la postulación.',
    )
  } finally {
    guardandoRechazo.value = false
  }
}

const cerrarModalRechazoForzado = () => {
  modalRechazo.value = false
  postulanteRechazo.value = null
  motivoRechazo.value = ''
}

// ============================================================
// DESISTIMIENTO
// ============================================================

const abrirModalDesistimiento = (postulante) => {
  postulanteDesistimiento.value = postulante
  motivoDesistimiento.value = ''
  modalDesistimiento.value = true
}

const cerrarModalDesistimiento = () => {
  if (guardandoDesistimiento.value) {
    return
  }

  modalDesistimiento.value = false
  postulanteDesistimiento.value = null
  motivoDesistimiento.value = ''
}

const confirmarDesistimiento = async () => {
  if (!postulanteDesistimiento.value) {
    return
  }

  guardandoDesistimiento.value = true

  try {
    await $api(
      `/postulaciones/${postulanteDesistimiento.value.id}/desistir`,
      {
        method: 'PATCH',
        body: {
          motivo:
            motivoDesistimiento.value.trim() ||
            'El postulante comunicó que desiste voluntariamente del proceso de postulación.',
        },
      },
    )

    cerrarModalDesistimientoForzado()
    await cargarDatos()

    if (historialCargado.value || vistaActiva.value === 'HISTORIAL') {
      await cargarHistorial()
    }
  } catch (error) {
    const mensaje = Array.isArray(error?.data?.message)
      ? error.data.message.join(', ')
      : error?.data?.message

    alert(
      mensaje ||
        error?.message ||
        'No se pudo registrar el desistimiento.',
    )
  } finally {
    guardandoDesistimiento.value = false
  }
}

const cerrarModalDesistimientoForzado = () => {
  modalDesistimiento.value = false
  postulanteDesistimiento.value = null
  motivoDesistimiento.value = ''
}

// ============================================================
// HISTORIAL
// ============================================================

const abrirDetalleHistorial = (item) => {
  historialSeleccionado.value = item
}

const cerrarDetalleHistorial = () => {
  historialSeleccionado.value = null
}


// ============================================================
// ABRIR POSTULACIÓN ANTERIOR DESDE REPOSTULACIÓN
// ============================================================

const abrirHistorialAnterior = async (postulante) => {
  if (!postulante) {
    return
  }

  const numeroIntentoActual =
    obtenerNumeroIntento(postulante)

  if (numeroIntentoActual <= 1) {
    return
  }

  try {
    // Si todavía no cargamos el historial, lo obtenemos del backend
    if (!historialCargado.value) {
      await cargarHistorial()
    }

    const numeroIntentoAnterior =
      numeroIntentoActual - 1

    const intentoAnterior =
      listaHistorial.value.find((registro) => {

        const mismoPostulante =
          registro.postulante?.id ===
          postulante.id

        const mismoIntento =
          registro.numero_intento ===
          numeroIntentoAnterior

        return (
          mismoPostulante &&
          mismoIntento
        )
      })

    if (!intentoAnterior) {
      alert(
        `No se encontró el historial del intento ${numeroIntentoAnterior}.`,
      )

      return
    }

    historialSeleccionado.value =
      intentoAnterior

  } catch (error) {
    console.error(
      'Error al consultar el historial anterior:',
      error,
    )

    const mensaje =
      Array.isArray(error?.data?.message)
        ? error.data.message.join(', ')
        : error?.data?.message

    alert(
      mensaje ||
      error?.message ||
      'No se pudo consultar la postulación anterior.',
    )
  }
}

// ============================================================
// FORMATEADORES
// ============================================================

const formatearFecha = (fechaRaw) => {
  if (!fechaRaw) {
    return 'S/F'
  }

  const fecha = new Date(fechaRaw)

  if (Number.isNaN(fecha.getTime())) {
    return 'S/F'
  }

  return fecha.toLocaleDateString('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const formatearFechaHora = (fechaRaw) => {
  if (!fechaRaw) {
    return 'S/F'
  }

  const fecha = new Date(fechaRaw)

  if (Number.isNaN(fecha.getTime())) {
    return 'S/F'
  }

  return fecha.toLocaleString('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatearTipoDocumento = (tipo) => {
  const nombres = {
    CARTA_SOLICITUD: 'Carta de Solicitud Institucional',
    RECORD_ACADEMICO: 'Récord Académico de Notas',
    HOJA_DE_VIDA: 'Hoja de Vida (CV)',
    FOTOCOPIA_CI: 'Fotocopia Cédula de Identidad',
    FACTURA_SERVICIO_BASICO: 'Factura de Servicio Básico',
    CROQUIS_DOMICILIO: 'Croquis de Domicilio',
    REFERENCIAS_PERSONALES: 'Referencias Personales',
  }

  return nombres[tipo] || tipo
}
</script>

<style scoped>
@import '@/assets/css/inf-postulantes.css';
</style>
