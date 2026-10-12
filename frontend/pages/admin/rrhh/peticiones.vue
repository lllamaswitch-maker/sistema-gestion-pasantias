<template>
  <div class="postulantes-wrapper font-sans select-none text-slate-700">

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

            <p class="text-[10px] text-emerald-200">
              Talento Humano
            </p>
          </div>
        </div>

        <nav class="space-y-1.5 mt-6">

          <NuxtLink
            to="/admin/rrhh/dashboard"
            class="nav-link"
          >
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3"
              />
            </svg>

            <span>Dashboard</span>
          </NuxtLink>


          <NuxtLink
            to="/admin/rrhh/postulantes_registrados/inf_postulante"
            class="nav-link"
          >
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414"
              />
            </svg>

            <span>Postulantes Registrados</span>
          </NuxtLink>


          <NuxtLink
            to="/admin/rrhh/peticiones"
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
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5"
              />
            </svg>

            <span>Peticiones Áreas</span>
          </NuxtLink>


          <NuxtLink
            to="/admin/rrhh/pasantes"
            class="nav-link"
          >
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>

            <span>Pasantes Activos</span>
          </NuxtLink>

        </nav>
      </div>


      <div class="pt-4 border-t border-white/10">
        <button
          type="button"
          class="w-full py-2.5 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-300 font-bold rounded-xl text-xs transition"
          @click="authStore.logout"
        >
          Cerrar Sesión
        </button>
      </div>
    </aside>


    <div class="flex-1 flex flex-col min-w-0">

      <header
        class="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm"
      >
        <div>
          <h1 class="text-base font-black text-slate-800">
            Peticiones de Áreas
          </h1>

          <p class="text-xs text-slate-400 font-medium">
            Gestión de solicitudes realizadas por los supervisores
          </p>
        </div>


        <div class="text-right hidden sm:block">
          <p class="text-xs font-bold text-slate-800">
            {{ authStore.usuario?.nombres }}
            {{ authStore.usuario?.apellidos }}
          </p>

          <span
            class="text-[10px] font-extrabold text-[#114d3f] bg-emerald-50 px-2 py-0.5 rounded-full"
          >
            {{ authStore.usuario?.cargo || 'RRHH' }}
          </span>
        </div>
      </header>


      <main class="p-6 flex-1 overflow-y-auto">

        <div class="peticiones-page">

          <div class="peticiones-header">
            <div>
              <p class="peticiones-label">
                Talento Humano
              </p>

              <h1>
                Gestión de Peticiones
              </h1>

              <p>
                Revise las solicitudes enviadas por los supervisores y gestione el proceso de selección.
              </p>
            </div>

            <button
              type="button"
              class="peticiones-refresh"
              :disabled="cargando"
              @click="cargarDatos"
            >
              {{ cargando ? 'Actualizando...' : 'Actualizar' }}
            </button>
          </div>


          <div
            v-if="errorMensaje"
            class="peticion-error mb-5"
          >
            {{ errorMensaje }}
          </div>


          <section class="peticiones-kpis">

            <article class="peticion-kpi">
              <span>Total de peticiones</span>
              <strong>
                {{ datos.resumen.total }}
              </strong>
            </article>

            <article class="peticion-kpi pending">
              <span>Pendientes de revisión</span>
              <strong>
                {{ datos.resumen.pendientes }}
              </strong>
            </article>

            <article class="peticion-kpi approved">
              <span>Peticiones aprobadas</span>
              <strong>
                {{ datos.resumen.aprobadas }}
              </strong>
            </article>

            <article class="peticion-kpi rejected">
              <span>Rechazadas</span>
              <strong>
                {{ datos.resumen.rechazadas }}
              </strong>
            </article>

          </section>


          <div class="peticion-main-tabs">

            <button
              type="button"
              class="peticion-main-tab"
              :class="{ active: vistaActiva === 'PENDIENTES' }"
              @click="cambiarVista('PENDIENTES')"
            >
              Pendientes de revisión

              <span
                v-if="datos.resumen.pendientes > 0"
                class="peticion-tab-count"
              >
                {{ datos.resumen.pendientes }}
              </span>
            </button>


            <button
              type="button"
              class="peticion-main-tab"
              :class="{ active: vistaActiva === 'HISTORIAL' }"
              @click="cambiarVista('HISTORIAL')"
            >
              Historial
            </button>

          </div>


          <div class="peticion-folder-wrapper">
            <div class="peticion-folders">

              <button
                v-for="carpeta in datos.carpetas"
                :key="carpeta.id"
                type="button"
                class="peticion-folder"
                :class="{ active: carpetaActiva === carpeta.id }"
                @click="carpetaActiva = carpeta.id"
              >
                <span>
                  {{ carpeta.nombre }}
                </span>

                <span
                  v-if="carpeta.pendientes > 0"
                  class="peticion-folder-badge"
                >
                  {{ carpeta.pendientes }}
                </span>
              </button>

            </div>
          </div>


          <div
            v-if="vistaActiva === 'HISTORIAL'"
            class="peticion-toolbar"
          >
            <div class="peticion-toolbar-left">

              <select
                v-model="filtroHistorial"
                class="peticion-select"
              >
                <option value="">
                  Todos los estados
                </option>

                <option value="APROBADA">
                  Aprobadas
                </option>

                <option value="RECHAZADA">
                  Rechazadas
                </option>

                <option value="CANCELADA">
                  Canceladas
                </option>
              </select>

            </div>
          </div>


          <section class="peticion-table-card">

            <div
              v-if="cargando"
              class="peticion-loading"
            >
              <strong>
                Cargando peticiones
              </strong>

              <p>
                Espere un momento.
              </p>
            </div>


            <div
              v-else-if="peticionesVisibles.length === 0"
              class="peticion-empty"
            >
              <strong>
                No existen peticiones
              </strong>

              <p>
                No se encontraron registros para esta sección.
              </p>
            </div>


            <div
              v-else
              class="peticion-table-scroll"
            >
              <table class="peticion-table">

                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Área solicitante</th>
                    <th>Supervisor</th>
                    <th>Postulante</th>
                    <th>Formación</th>
                    <th>Actividades</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>


                <tbody>

                  <tr
                    v-for="peticion in peticionesVisibles"
                    :key="peticion.id"
                  >

                    <td>
                      {{ formatearFecha(peticion.fecha_solicitud) }}
                    </td>


                    <td>
                      <div class="peticion-department">

                        <strong>
                          {{ peticion.departamento?.nombre || 'Sin departamento' }}
                        </strong>

                        <span>
                          {{ peticion.gerencia?.nombre || 'Sin gerencia' }}
                        </span>

                      </div>
                    </td>


                    <td>
                      <div class="peticion-person">

                        <strong>
                          {{ peticion.supervisor?.nombre_completo }}
                        </strong>

                        <span>
                          {{ peticion.supervisor?.cargo }}
                        </span>

                      </div>
                    </td>


                    <td>
                      <div class="peticion-person">

                        <strong>
                          {{ peticion.postulante?.nombre_completo }}
                        </strong>

                        <span>
                          CI:
                          {{ peticion.postulante?.ci }}
                          {{ peticion.postulante?.expedido }}
                        </span>

                      </div>
                    </td>


                    <td>
                      <div class="peticion-person">

                        <strong>
                          {{ peticion.formacion?.carrera || 'Sin registro' }}
                        </strong>

                        <span>
                          {{ peticion.formacion?.semestre_o_nivel || 'Sin nivel' }}
                        </span>

                      </div>
                    </td>


                    <td>
                      <span class="peticion-activities">
                        {{ peticion.actividades_pasante }}
                      </span>
                    </td>


                    <td>
                      <span
                        class="peticion-status"
                        :class="claseEstado(peticion)"
                      >
                        {{ etiquetaEstado(peticion) }}
                      </span>
                    </td>


                    <td>
                      <button
                        type="button"
                        class="peticion-btn-review"
                        @click="abrirPeticion(peticion)"
                      >
                        {{ textoBoton(peticion) }}
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


    <div
      v-if="peticionSeleccionada"
      class="peticion-modal-overlay"
      @click.self="cerrarPeticion"
    >
      <div class="peticion-modal">

        <div class="peticion-modal-header">

          <div>
            <p class="peticiones-label">
              Detalle de petición
            </p>

            <h2>
              {{ peticionSeleccionada.postulante?.nombre_completo }}
            </h2>
          </div>


          <button
            type="button"
            class="peticion-modal-close"
            @click="cerrarPeticion"
          >
            ×
          </button>

        </div>


        <div class="peticion-modal-body">

          <div class="peticion-detail-grid">

            <div class="peticion-detail">
              <span>Supervisor</span>

              <strong>
                {{ peticionSeleccionada.supervisor?.nombre_completo }}
              </strong>

              <p>
                {{ peticionSeleccionada.supervisor?.cargo }}
              </p>
            </div>


            <div class="peticion-detail">
              <span>Departamento</span>

              <strong>
                {{ peticionSeleccionada.departamento?.nombre }}
              </strong>

              <p>
                {{ peticionSeleccionada.gerencia?.nombre }}
              </p>
            </div>


            <div class="peticion-detail">
              <span>Carrera</span>

              <strong>
                {{ peticionSeleccionada.formacion?.carrera || 'No registrada' }}
              </strong>

              <p>
                {{ peticionSeleccionada.formacion?.institucion }}
              </p>
            </div>


            <div class="peticion-detail">
              <span>Semestre / Nivel</span>

              <strong>
                {{ peticionSeleccionada.formacion?.semestre_o_nivel || 'No registrado' }}
              </strong>

              <p>
                Modalidad:
                {{ formatearTexto(peticionSeleccionada.formacion?.modalidad) }}
              </p>
            </div>


            <div class="peticion-detail">
              <span>Turno disponible</span>

              <strong>
                {{ formatearTexto(peticionSeleccionada.turno) }}
              </strong>
            </div>


            <div class="peticion-detail">
              <span>Fecha de solicitud</span>

              <strong>
                {{ formatearFechaHora(peticionSeleccionada.fecha_solicitud) }}
              </strong>
            </div>


            <div class="peticion-detail full">
              <span>Estado actual</span>

              <strong>
                {{ etiquetaEstado(peticionSeleccionada) }}
              </strong>
            </div>

          </div>


          <h3 class="peticion-modal-section-title">
            Actividades propuestas por el Supervisor
          </h3>

          <div class="peticion-activity-box">
            {{ peticionSeleccionada.actividades_pasante }}
          </div>


          <template
            v-if="peticionSeleccionada.respuesta_rrhh"
          >
            <h3 class="peticion-modal-section-title">
              Respuesta de Talento Humano
            </h3>

            <div class="peticion-activity-box">
              {{ peticionSeleccionada.respuesta_rrhh }}
            </div>
          </template>

        </div>


        <div class="peticion-actions">

          <button
            type="button"
            class="peticion-btn secondary"
            :disabled="procesando"
            @click="cerrarPeticion"
          >
            Cerrar
          </button>


          <template
            v-if="
              peticionSeleccionada.estado ===
              'PENDIENTE_RRHH'
            "
          >

            <button
              type="button"
              class="peticion-btn reject"
              :disabled="procesando"
              @click="abrirRechazo"
            >
              Rechazar petición
            </button>


            <button
              type="button"
              class="peticion-btn approve"
              :disabled="procesando"
              @click="aprobarPeticion"
            >
              Aprobar petición
            </button>

          </template>


          <template
            v-else-if="
              peticionSeleccionada.estado === 'APROBADA' &&
              peticionSeleccionada.postulacion?.estado_actual ===
                'SELECCIONADO_POR_AREA'
            "
          >

            <button
              type="button"
              class="peticion-btn reject"
              :disabled="procesando"
              @click="registrarDesistimiento"
            >
              No desea continuar
            </button>


            <button
              type="button"
              class="peticion-btn interview"
              :disabled="procesando"
              @click="confirmarEntrevista"
            >
              Acepta entrevista
            </button>

          </template>


          <template
            v-else-if="
              peticionSeleccionada.estado === 'APROBADA' &&
              peticionSeleccionada.postulacion?.estado_actual ===
                'APROBADO_PARA_ENTREVISTA'
            "
          >

            <button
              type="button"
              class="peticion-btn reject"
              :disabled="procesando"
              @click="abrirNoSeleccionado"
            >
              No seleccionado
            </button>


            <button
              type="button"
              class="peticion-btn accept"
              :disabled="procesando"
              @click="seleccionarPostulante"
            >
              Seleccionar postulante
            </button>

          </template>

        </div>
      </div>
    </div>


    <div
      v-if="modalRechazo"
      class="peticion-modal-overlay"
      @click.self="cerrarRechazo"
    >
      <div class="peticion-modal small">

        <div class="peticion-modal-header">

          <div>
            <p class="peticiones-label">
              Decisión de RRHH
            </p>

            <h2>
              Rechazar petición
            </h2>
          </div>


          <button
            type="button"
            class="peticion-modal-close"
            @click="cerrarRechazo"
          >
            ×
          </button>

        </div>


        <div class="peticion-modal-body">

          <div class="peticion-form-group">

            <label>
              Motivo del rechazo *
            </label>

            <textarea
              v-model="motivoRechazo"
              class="peticion-textarea"
              maxlength="1000"
              placeholder="Explique el motivo por el cual la petición del área será rechazada..."
            />

            <span class="peticion-character-count">
              {{ motivoRechazo.length }}/1000
            </span>

          </div>

        </div>


        <div class="peticion-actions">

          <button
            type="button"
            class="peticion-btn secondary"
            :disabled="procesando"
            @click="cerrarRechazo"
          >
            Cancelar
          </button>

          <button
            type="button"
            class="peticion-btn reject"
            :disabled="procesando || !motivoRechazo.trim()"
            @click="confirmarRechazo"
          >
            Confirmar rechazo
          </button>

        </div>

      </div>
    </div>


    <div
      v-if="modalNoSeleccionado"
      class="peticion-modal-overlay"
      @click.self="cerrarNoSeleccionado"
    >
      <div class="peticion-modal small">

        <div class="peticion-modal-header">

          <div>
            <p class="peticiones-label">
              Resultado de entrevista
            </p>

            <h2>
              No seleccionar postulante
            </h2>
          </div>


          <button
            type="button"
            class="peticion-modal-close"
            @click="cerrarNoSeleccionado"
          >
            ×
          </button>

        </div>


        <div class="peticion-modal-body">

          <div class="peticion-form-group">

            <label>
              Motivo de la decisión *
            </label>

            <textarea
              v-model="motivoNoSeleccionado"
              class="peticion-textarea"
              maxlength="1000"
              placeholder="Registre el motivo por el cual el postulante no fue seleccionado..."
            />

            <span class="peticion-character-count">
              {{ motivoNoSeleccionado.length }}/1000
            </span>

          </div>

        </div>


        <div class="peticion-actions">

          <button
            type="button"
            class="peticion-btn secondary"
            :disabled="procesando"
            @click="cerrarNoSeleccionado"
          >
            Cancelar
          </button>

          <button
            type="button"
            class="peticion-btn reject"
            :disabled="
              procesando ||
              !motivoNoSeleccionado.trim()
            "
            @click="confirmarNoSeleccionado"
          >
            Confirmar
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
  middleware: 'admin',
})


const authStore =
  useAuthStore()

const { $api } =
  useNuxtApp()


const cargando =
  ref(true)

const procesando =
  ref(false)

const errorMensaje =
  ref('')

const vistaActiva =
  ref('PENDIENTES')

const carpetaActiva =
  ref('TODAS')

const filtroHistorial =
  ref('')


const peticionSeleccionada =
  ref(null)

const modalRechazo =
  ref(false)

const motivoRechazo =
  ref('')

const modalNoSeleccionado =
  ref(false)

const motivoNoSeleccionado =
  ref('')


const datos =
  ref({
    resumen: {
      total: 0,
      pendientes: 0,
      aprobadas: 0,
      rechazadas: 0,
      canceladas: 0,
    },

    carpetas: [],

    peticiones: [],
  })


const peticionesVisibles =
  computed(() => {

    let lista =
      Array.isArray(
        datos.value.peticiones,
      )
        ? [...datos.value.peticiones]
        : []


    if (
      carpetaActiva.value !==
      'TODAS'
    ) {
      lista =
        lista.filter(
          peticion =>
            peticion
              .departamento
              ?.id ===
            carpetaActiva.value,
        )
    }


    if (
      vistaActiva.value ===
      'PENDIENTES'
    ) {
      return lista.filter(
        peticion =>
          peticion.estado ===
          'PENDIENTE_RRHH',
      )
    }


    lista =
      lista.filter(
        peticion =>
          peticion.estado !==
          'PENDIENTE_RRHH',
      )


    if (
      filtroHistorial.value
    ) {
      lista =
        lista.filter(
          peticion =>
            peticion.estado ===
            filtroHistorial.value,
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
      return error.data.message.join(', ')
    }

    return (
      error?.data?.message ||
      error?.message ||
      'Ocurrió un error inesperado.'
    )
  }


const cargarDatos =
  async () => {

    cargando.value =
      true

    errorMensaje.value =
      ''

    try {

      const respuesta =
        await $api(
          '/rrhh/peticiones',
        )


      datos.value = {
        resumen: {
          total:
            respuesta?.resumen?.total ?? 0,

          pendientes:
            respuesta?.resumen?.pendientes ?? 0,

          aprobadas:
            respuesta?.resumen?.aprobadas ?? 0,

          rechazadas:
            respuesta?.resumen?.rechazadas ?? 0,

          canceladas:
            respuesta?.resumen?.canceladas ?? 0,
        },

        carpetas:
          Array.isArray(
            respuesta?.carpetas,
          )
            ? respuesta.carpetas
            : [],

        peticiones:
          Array.isArray(
            respuesta?.peticiones,
          )
            ? respuesta.peticiones
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


const cambiarVista =
  vista => {

    vistaActiva.value =
      vista

    filtroHistorial.value =
      ''
  }


const abrirPeticion =
  peticion => {

    peticionSeleccionada.value =
      peticion
  }


const cerrarPeticion =
  () => {

    if (procesando.value) {
      return
    }

    peticionSeleccionada.value =
      null
  }


const actualizarYSalir =
  async () => {

    peticionSeleccionada.value =
      null

    modalRechazo.value =
      false

    modalNoSeleccionado.value =
      false

    motivoRechazo.value =
      ''

    motivoNoSeleccionado.value =
      ''

    await cargarDatos()
  }


const aprobarPeticion =
  async () => {

    if (
      !peticionSeleccionada.value
    ) {
      return
    }


    const confirmar =
      window.confirm(
        '¿Confirma la aprobación de esta petición? El postulante todavía no será registrado como pasante activo.',
      )


    if (!confirmar) {
      return
    }


    procesando.value =
      true


    try {

      await $api(
        `/rrhh/peticiones/${peticionSeleccionada.value.id}/aprobar`,
        {
          method: 'PATCH',
        },
      )


      await actualizarYSalir()


    } catch (error) {

      alert(
        obtenerMensajeError(
          error,
        ),
      )

    } finally {

      procesando.value =
        false
    }
  }


const abrirRechazo =
  () => {

    motivoRechazo.value =
      ''

    modalRechazo.value =
      true
  }


const cerrarRechazo =
  () => {

    if (procesando.value) {
      return
    }

    modalRechazo.value =
      false

    motivoRechazo.value =
      ''
  }


const confirmarRechazo =
  async () => {

    if (
      !peticionSeleccionada.value
    ) {
      return
    }


    const motivo =
      motivoRechazo.value.trim()


    if (!motivo) {
      return
    }


    procesando.value =
      true


    try {

      await $api(
        `/rrhh/peticiones/${peticionSeleccionada.value.id}/rechazar`,
        {
          method: 'PATCH',

          body: {
            motivo,
          },
        },
      )


      await actualizarYSalir()


    } catch (error) {

      alert(
        obtenerMensajeError(
          error,
        ),
      )

    } finally {

      procesando.value =
        false
    }
  }


const confirmarEntrevista =
  async () => {

    if (
      !peticionSeleccionada.value
    ) {
      return
    }


    const confirmar =
      window.confirm(
        '¿Confirma que el postulante aceptó continuar con la entrevista?',
      )


    if (!confirmar) {
      return
    }


    procesando.value =
      true


    try {

      await $api(
        `/rrhh/peticiones/${peticionSeleccionada.value.id}/confirmar-entrevista`,
        {
          method: 'PATCH',
        },
      )


      await actualizarYSalir()


    } catch (error) {

      alert(
        obtenerMensajeError(
          error,
        ),
      )

    } finally {

      procesando.value =
        false
    }
  }


const registrarDesistimiento =
  async () => {

    if (
      !peticionSeleccionada.value
    ) {
      return
    }


    const confirmar =
      window.confirm(
        '¿Confirma que el postulante indicó que no desea continuar con el proceso?',
      )


    if (!confirmar) {
      return
    }


    procesando.value =
      true


    try {

      await $api(
        `/rrhh/peticiones/${peticionSeleccionada.value.id}/desistimiento`,
        {
          method: 'PATCH',
        },
      )


      await actualizarYSalir()


    } catch (error) {

      alert(
        obtenerMensajeError(
          error,
        ),
      )

    } finally {

      procesando.value =
        false
    }
  }


const abrirNoSeleccionado =
  () => {

    motivoNoSeleccionado.value =
      ''

    modalNoSeleccionado.value =
      true
  }


const cerrarNoSeleccionado =
  () => {

    if (procesando.value) {
      return
    }

    modalNoSeleccionado.value =
      false

    motivoNoSeleccionado.value =
      ''
  }


const confirmarNoSeleccionado =
  async () => {

    if (
      !peticionSeleccionada.value
    ) {
      return
    }


    const motivo =
      motivoNoSeleccionado.value.trim()


    if (!motivo) {
      return
    }


    procesando.value =
      true


    try {

      await $api(
        `/rrhh/peticiones/${peticionSeleccionada.value.id}/no-seleccionado`,
        {
          method: 'PATCH',

          body: {
            motivo,
          },
        },
      )


      await actualizarYSalir()


    } catch (error) {

      alert(
        obtenerMensajeError(
          error,
        ),
      )

    } finally {

      procesando.value =
        false
    }
  }


const seleccionarPostulante =
  async () => {

    if (
      !peticionSeleccionada.value
    ) {
      return
    }


    const confirmar =
      window.confirm(
        '¿Confirma que el postulante fue seleccionado? Esta acción lo registrará como PASANTE ACTIVO.',
      )


    if (!confirmar) {
      return
    }


    procesando.value =
      true


    try {

      await $api(
        `/rrhh/peticiones/${peticionSeleccionada.value.id}/seleccionar`,
        {
          method: 'PATCH',
        },
      )


      await actualizarYSalir()


    } catch (error) {

      alert(
        obtenerMensajeError(
          error,
        ),
      )

    } finally {

      procesando.value =
        false
    }
  }


const etiquetaEstado =
  peticion => {

    if (
      peticion.estado ===
      'PENDIENTE_RRHH'
    ) {
      return 'Pendiente de revisión'
    }


    if (
      peticion.estado ===
      'RECHAZADA'
    ) {
      return 'Petición rechazada'
    }


    if (
      peticion.estado ===
      'CANCELADA'
    ) {
      return 'Cancelada por Supervisor'
    }


    const estadoPostulacion =
      peticion
        .postulacion
        ?.estado_actual


    if (
      peticion.estado ===
      'APROBADA'
    ) {

      if (
        estadoPostulacion ===
        'SELECCIONADO_POR_AREA'
      ) {
        return 'Pendiente de contacto'
      }


      if (
        estadoPostulacion ===
        'APROBADO_PARA_ENTREVISTA'
      ) {
        return 'Pendiente resultado entrevista'
      }


      if (
        estadoPostulacion ===
        'DESISTIDO'
      ) {
        return 'Desistió'
      }


      if (
        estadoPostulacion ===
        'NO_SELECCIONADO'
      ) {
        return 'No seleccionado'
      }


      if (
        estadoPostulacion ===
        'ACEPTADO'
      ) {
        return 'Pasante activo'
      }


      return 'Petición aprobada'
    }


    return peticion.estado
  }


const claseEstado =
  peticion => {

    const estado =
      peticion
        .postulacion
        ?.estado_actual


    if (
      peticion.estado ===
      'PENDIENTE_RRHH'
    ) {
      return 'pending'
    }


    if (
      peticion.estado ===
      'RECHAZADA'
    ) {
      return 'rejected'
    }


    if (
      peticion.estado ===
      'CANCELADA'
    ) {
      return 'cancelled'
    }


    if (
      estado ===
      'APROBADO_PARA_ENTREVISTA'
    ) {
      return 'interview'
    }


    if (
      estado ===
      'ACEPTADO'
    ) {
      return 'accepted'
    }


    if (
      estado ===
      'NO_SELECCIONADO'
    ) {
      return 'not-selected'
    }


    return 'approved'
  }


const textoBoton =
  peticion => {

    if (
      peticion.estado ===
      'PENDIENTE_RRHH'
    ) {
      return 'Revisar petición'
    }


    if (
      peticion.estado ===
        'APROBADA' &&
      [
        'SELECCIONADO_POR_AREA',
        'APROBADO_PARA_ENTREVISTA',
      ].includes(
        peticion
          .postulacion
          ?.estado_actual,
      )
    ) {
      return 'Gestionar'
    }


    return 'Ver detalle'
  }


const formatearTexto =
  texto => {

    if (!texto) {
      return 'No registrado'
    }

    return String(texto)
      .replaceAll('_', ' ')
      .toLowerCase()
      .replace(
        /\b\w/g,
        letra =>
          letra.toUpperCase(),
      )
  }


const formatearFecha =
  fechaRaw => {

    if (!fechaRaw) {
      return 'S/F'
    }


    const fecha =
      new Date(fechaRaw)


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
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      },
    )
  }


const formatearFechaHora =
  fechaRaw => {

    if (!fechaRaw) {
      return 'S/F'
    }


    const fecha =
      new Date(fechaRaw)


    if (
      Number.isNaN(
        fecha.getTime(),
      )
    ) {
      return 'S/F'
    }


    return fecha.toLocaleString(
      'es-BO',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      },
    )
  }


onMounted(
  async () => {

    authStore.cargarSesion()


    if (
      !authStore.estaAutenticado
    ) {
      await navigateTo('/')
      return
    }


    await cargarDatos()
  },
)
</script>


<style scoped>
@import '@/assets/css/inf-postulantes.css';
@import '@/assets/css/peticiones-rrhh.css';
</style>