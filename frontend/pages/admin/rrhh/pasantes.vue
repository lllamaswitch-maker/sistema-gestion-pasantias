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
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5"
              />
            </svg>
            <span>Peticiones Áreas</span>
          </NuxtLink>

          <NuxtLink
            to="/admin/rrhh/pasantes"
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
            Pasantes Activos
          </h1>
          <p class="text-xs text-slate-400 font-medium">
            Seguimiento de pasantes incorporados a las áreas
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
        <div class="pasantes-page">
          <div class="pasantes-header">
            <div>
              <p class="pasantes-label">
                Gestión de pasantías
              </p>

              <h1>
                Pasantes
              </h1>

              <p>
                Consulte la asignación, actividades, área responsable y seguimiento de cada pasante.
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

          <div
            v-if="errorMensaje"
            class="pasantes-error"
          >
            {{ errorMensaje }}
          </div>

          <section class="pasantes-kpis">
            <article class="pasante-kpi">
              <span>Total</span>
              <strong>{{ datos.resumen.total }}</strong>
            </article>

            <article class="pasante-kpi active">
              <span>Activos</span>
              <strong>{{ datos.resumen.activos }}</strong>
            </article>

            <article class="pasante-kpi suspended">
              <span>Suspendidos</span>
              <strong>{{ datos.resumen.suspendidos }}</strong>
            </article>

            <article class="pasante-kpi finished">
              <span>Finalizados</span>
              <strong>{{ datos.resumen.finalizados }}</strong>
            </article>

            <article class="pasante-kpi abandoned">
              <span>Abandono</span>
              <strong>{{ datos.resumen.abandonos }}</strong>
            </article>
          </section>

          <div class="pasantes-tabs">
            <button
              v-for="tab in tabs"
              :key="tab.valor"
              type="button"
              class="pasantes-tab"
              :class="{ active: estadoActivo === tab.valor }"
              @click="estadoActivo = tab.valor"
            >
              {{ tab.nombre }}

              <span class="pasantes-tab-count">
                {{ tab.cantidad }}
              </span>
            </button>
          </div>

          <div class="pasantes-toolbar">
            <input
              v-model="busqueda"
              type="text"
              class="pasantes-search"
              placeholder="Buscar por nombre, CI, carrera o supervisor..."
            />

            <select
              v-model="filtroDepartamento"
              class="pasantes-select"
            >
              <option value="">
                Todos los departamentos
              </option>

              <option
                v-for="departamento in departamentosDisponibles"
                :key="departamento"
                :value="departamento"
              >
                {{ departamento }}
              </option>
            </select>

            <select
              v-model="filtroModalidad"
              class="pasantes-select"
            >
              <option value="">
                Todas las modalidades
              </option>

              <option
                v-for="modalidad in modalidadesDisponibles"
                :key="modalidad"
                :value="modalidad"
              >
                {{ formatearTexto(modalidad) }}
              </option>
            </select>
          </div>

          <section class="pasantes-table-card">
            <div
              v-if="cargando"
              class="pasantes-loading"
            >
              <strong>Cargando pasantes</strong>
              <p>Espere un momento.</p>
            </div>

            <div
              v-else-if="pasantesVisibles.length === 0"
              class="pasantes-empty"
            >
              <strong>No existen registros</strong>

              <p>
                No se encontraron pasantes con los filtros seleccionados.
              </p>
            </div>

            <div
              v-else
              class="pasantes-table-scroll"
            >
              <table class="pasantes-table">
                <thead>
                  <tr>
                    <th>Pasante</th>
                    <th>Formación</th>
                    <th>Área</th>
                    <th>Supervisor</th>
                    <th>Modalidad</th>
                    <th>Incorporación</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="pasante in pasantesVisibles"
                    :key="pasante.id"
                  >
                    <td>
                      <div class="pasante-person">
                        <strong>
                          {{ pasante.postulante?.nombre_completo }}
                        </strong>

                        <span>
                          CI:
                          {{ pasante.postulante?.ci }}
                          {{ pasante.postulante?.expedido }}
                        </span>

                        <span v-if="pasante.postulante?.email">
                          {{ pasante.postulante.email }}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div class="pasante-person">
                        <strong>
                          {{ pasante.formacion?.carrera || 'Sin registro' }}
                        </strong>

                        <span>
                          {{ pasante.formacion?.semestre_o_nivel || 'Sin nivel' }}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div class="pasante-area">
                        <strong>
                          {{ pasante.departamento?.nombre || 'Sin departamento' }}
                        </strong>

                        <span>
                          {{ pasante.gerencia?.nombre || 'Sin gerencia' }}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div class="pasante-person">
                        <strong>
                          {{ pasante.supervisor?.nombre_completo || 'Sin supervisor' }}
                        </strong>

                        <span>
                          {{ pasante.supervisor?.cargo || '' }}
                        </span>
                      </div>
                    </td>

                    <td>
                      {{ formatearTexto(pasante.modalidad_pasantia) }}
                    </td>

                    <td>
                      {{ formatearFecha(pasante.fecha_incorporacion) }}
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
                        @click="abrirDetalle(pasante)"
                      >
                        Ver detalle
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

    <!-- DETALLE -->
    <div
      v-if="pasanteSeleccionado"
      class="pasante-modal-overlay"
      @click.self="cerrarDetalle"
    >
      <div class="pasante-modal">
        <div class="pasante-modal-header">
          <div>
            <p class="pasantes-label">
              Expediente del pasante
            </p>

            <h2>
              {{ pasanteSeleccionado.postulante?.nombre_completo }}
            </h2>
          </div>

          <button
            type="button"
            class="pasante-modal-close"
            @click="cerrarDetalle"
          >
            ×
          </button>
        </div>

        <div class="pasante-modal-body">
          <div class="pasante-detail-grid">
            <div class="pasante-detail">
              <span>CI</span>
              <strong>
                {{ pasanteSeleccionado.postulante?.ci }}
                {{ pasanteSeleccionado.postulante?.expedido }}
              </strong>
            </div>

            <div class="pasante-detail">
              <span>Correo</span>
              <strong>
                {{ pasanteSeleccionado.postulante?.email || 'No registrado' }}
              </strong>
            </div>

            <div class="pasante-detail">
              <span>Carrera</span>
              <strong>
                {{ pasanteSeleccionado.formacion?.carrera || 'No registrada' }}
              </strong>

              <p>
                {{ pasanteSeleccionado.formacion?.institucion || '' }}
              </p>
            </div>

            <div class="pasante-detail">
              <span>Semestre / Nivel</span>
              <strong>
                {{ pasanteSeleccionado.formacion?.semestre_o_nivel || 'No registrado' }}
              </strong>
            </div>

            <div class="pasante-detail">
              <span>Gerencia</span>
              <strong>
                {{ pasanteSeleccionado.gerencia?.nombre || 'No registrada' }}
              </strong>
            </div>

            <div class="pasante-detail">
              <span>Departamento</span>
              <strong>
                {{ pasanteSeleccionado.departamento?.nombre || 'No registrado' }}
              </strong>
            </div>

            <div class="pasante-detail">
              <span>Supervisor</span>
              <strong>
                {{ pasanteSeleccionado.supervisor?.nombre_completo || 'No registrado' }}
              </strong>

              <p>
                {{ pasanteSeleccionado.supervisor?.cargo || '' }}
              </p>
            </div>

            <div class="pasante-detail">
              <span>Modalidad</span>
              <strong>
                {{ formatearTexto(pasanteSeleccionado.modalidad_pasantia) }}
              </strong>
            </div>

            <div class="pasante-detail">
              <span>Fecha de incorporación</span>
              <strong>
                {{ formatearFecha(pasanteSeleccionado.fecha_incorporacion) }}
              </strong>
            </div>

            <div class="pasante-detail">
              <span>Estado</span>
              <strong>
                {{ etiquetaEstado(pasanteSeleccionado.estado) }}
              </strong>
            </div>
          </div>

          <h3 class="pasante-section-title">
            Actividades asignadas
          </h3>

          <div class="pasante-activity-box">
            {{
              pasanteSeleccionado.actividades ||
              'No existen actividades registradas.'
            }}
          </div>

          <h3 class="pasante-section-title">
            Seguimiento académico y horas
          </h3>

          <div
            v-if="pasanteSeleccionado.seguimiento"
            class="pasante-followup-grid"
          >
            <div class="pasante-followup-card">
              <span>Fecha de inicio</span>
              <strong>
                {{ formatearFecha(pasanteSeleccionado.seguimiento.fecha_inicio) }}
              </strong>
            </div>

            <div class="pasante-followup-card">
              <span>Fecha de conclusión</span>
              <strong>
                {{ formatearFecha(pasanteSeleccionado.seguimiento.fecha_conclusion) }}
              </strong>
            </div>

            <div class="pasante-followup-card">
              <span>Duración acordada</span>
              <strong>
                {{ pasanteSeleccionado.seguimiento.duracion_acordada }}
              </strong>
            </div>

            <div class="pasante-followup-card">
              <span>Turno</span>
              <strong>
                {{ formatearTexto(pasanteSeleccionado.seguimiento.turno) }}
              </strong>
            </div>

            <div class="pasante-followup-card">
              <span>Horas requeridas</span>
              <strong>
                {{
                  pasanteSeleccionado.seguimiento.horas_requeridas ??
                  'No definidas'
                }}
              </strong>
            </div>

            <div class="pasante-followup-card">
              <span>Horas realizadas</span>
              <strong>
                {{ pasanteSeleccionado.seguimiento.horas_realizadas ?? 0 }}
              </strong>
            </div>

            <div class="pasante-followup-card">
              <span>Horas faltantes</span>
              <strong>
                {{
                  pasanteSeleccionado.seguimiento.horas_faltantes ??
                  'Pendiente biométrico'
                }}
              </strong>
            </div>
          </div>

          <div
            v-else
            class="pasante-no-followup"
          >
            Aún no se ha registrado la planificación de fechas y horas para este pasante.
          </div>
        </div>

        <div class="pasante-modal-actions">
          <div class="pasante-action-buttons">
            <template v-if="pasanteSeleccionado.estado === 'ACTIVO'">
              <button
                type="button"
                class="pasante-btn-config"
                @click="abrirConfiguracion"
              >
                {{
                  pasanteSeleccionado.seguimiento
                    ? 'Editar planificación'
                    : 'Configurar pasantía'
                }}
              </button>

              <button
                type="button"
                class="pasante-btn-suspend"
                @click="abrirAccionEstado('SUSPENDER')"
              >
                Suspender
              </button>

              <button
                type="button"
                class="pasante-btn-abandon"
                @click="abrirAccionEstado('ABANDONO')"
              >
                Registrar abandono
              </button>

              <button
                type="button"
                class="pasante-btn-finish"
                @click="abrirAccionEstado('FINALIZAR')"
              >
                Finalizar
              </button>
            </template>

            <template v-else-if="pasanteSeleccionado.estado === 'SUSPENDIDO'">
              <button
                type="button"
                class="pasante-btn-reactivate"
                @click="abrirAccionEstado('REACTIVAR')"
              >
                Reactivar
              </button>

              <button
                type="button"
                class="pasante-btn-abandon"
                @click="abrirAccionEstado('ABANDONO')"
              >
                Registrar abandono
              </button>
            </template>

            <button
              type="button"
              class="pasante-btn-close"
              @click="cerrarDetalle"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- CONFIGURACIÓN -->
    <div
      v-if="modalConfiguracion"
      class="pasante-modal-overlay"
      @click.self="cerrarConfiguracion"
    >
      <div class="pasante-config-modal">
        <div class="pasante-modal-header">
          <div>
            <p class="pasantes-label">
              Planificación de pasantía
            </p>

            <h2>
              {{
                pasanteSeleccionado?.seguimiento
                  ? 'Editar planificación'
                  : 'Configurar pasantía'
              }}
            </h2>

            <p class="text-sm text-slate-500 mt-1">
              {{ pasanteSeleccionado?.postulante?.nombre_completo }}
            </p>
          </div>

          <button
            type="button"
            class="pasante-modal-close"
            :disabled="guardandoSeguimiento"
            @click="cerrarConfiguracion"
          >
            ×
          </button>
        </div>

        <div class="pasante-modal-body">
          <div
            v-if="errorConfiguracion"
            class="pasante-config-error"
          >
            {{ errorConfiguracion }}
          </div>

          <div class="pasante-form-grid">
            <div class="pasante-form-group">
              <label>Fecha de inicio *</label>

              <input
                v-model="formSeguimiento.fecha_inicio"
                type="date"
                class="pasante-form-control"
              />
            </div>

            <div class="pasante-form-group">
              <label>Fecha de conclusión *</label>

              <input
                v-model="formSeguimiento.fecha_conclusion"
                type="date"
                class="pasante-form-control"
              />
            </div>

            <div class="pasante-form-group full">
              <label>Duración acordada *</label>

              <select
                v-model="formSeguimiento.duracion_acordada"
                class="pasante-form-control"
              >
                <option value="">
                  Seleccione la duración
                </option>

                <option value="1 mes">1 mes</option>
                <option value="2 meses">2 meses</option>
                <option value="3 meses">3 meses</option>
                <option value="4 meses">4 meses</option>
                <option value="5 meses">5 meses</option>
                <option value="6 meses">6 meses</option>
                <option value="7 meses">7 meses</option>
                <option value="8 meses">8 meses</option>
                <option value="9 meses">9 meses</option>
                <option value="10 meses">10 meses</option>
                <option value="11 meses">11 meses</option>
                <option value="12 meses">12 meses</option>
              </select>

              <span class="pasante-form-help">
                Seleccione el tiempo acordado para la pasantía.
              </span>
            </div>

            <div class="pasante-form-group">
              <label>Horas requeridas *</label>

              <input
                v-model.number="formSeguimiento.horas_requeridas"
                type="number"
                min="1"
                step="1"
                class="pasante-form-control"
                placeholder="Ej.: 360"
              />
            </div>

            <div class="pasante-form-group">
              <label>Turno *</label>

              <select
                v-model="formSeguimiento.turno"
                class="pasante-form-control"
              >
                <option value="">
                  Seleccione un turno
                </option>

                <option value="MANANA">
                  Mañana
                </option>

                <option value="TARDE">
                  Tarde
                </option>

                <option value="TIEMPO_COMPLETO">
                  Tiempo completo
                </option>
              </select>
            </div>

            <div
              v-if="pasanteSeleccionado?.seguimiento"
              class="pasante-form-group full"
            >
              <div class="pasante-no-followup">
                Horas realizadas actualmente:
                <strong>
                  {{ pasanteSeleccionado.seguimiento.horas_realizadas ?? 0 }}
                </strong>

                <br />

                Las horas realizadas serán obtenidas posteriormente mediante la integración con el biométrico.
              </div>
            </div>
          </div>
        </div>

        <div class="pasante-modal-actions">
          <button
            type="button"
            class="pasante-btn-close"
            :disabled="guardandoSeguimiento"
            @click="cerrarConfiguracion"
          >
            Cancelar
          </button>

          <button
            type="button"
            class="pasante-btn-config"
            :disabled="guardandoSeguimiento"
            @click="guardarConfiguracion"
          >
            {{
              guardandoSeguimiento
                ? 'Guardando...'
                : 'Guardar planificación'
            }}
          </button>
        </div>
      </div>
    </div>

    <!-- CAMBIO DE ESTADO -->
    <div
      v-if="modalEstado"
      class="pasante-modal-overlay"
      @click.self="cerrarAccionEstado"
    >
      <div class="pasante-state-modal">
        <div class="pasante-modal-header">
          <div>
            <p class="pasantes-label">
              Gestión de pasantía
            </p>

            <h2>
              {{ configuracionAccion.titulo }}
            </h2>
          </div>

          <button
            type="button"
            class="pasante-modal-close"
            :disabled="procesandoEstado"
            @click="cerrarAccionEstado"
          >
            ×
          </button>
        </div>

        <div class="pasante-modal-body">
          <div class="pasante-state-info">
            <span>Pasante</span>

            <strong>
              {{ pasanteSeleccionado?.postulante?.nombre_completo }}
            </strong>
          </div>

          <div
            v-if="accionEstado === 'SUSPENDER'"
            class="pasante-state-warning"
          >
            La suspensión es temporal. Posteriormente Talento Humano podrá reactivar la pasantía.
          </div>

          <div
            v-if="accionEstado === 'ABANDONO'"
            class="pasante-state-danger"
          >
            El abandono indica que la persona ya era pasante activo y dejó la pasantía antes de concluirla. Este estado será definitivo.
          </div>

          <div
            v-if="accionEstado === 'FINALIZAR'"
            class="pasante-state-warning"
          >
            Esta acción marcará la pasantía como finalizada. La validación automática de las horas realizadas será incorporada cuando se integre el sistema biométrico.
          </div>

          <div
            v-if="errorEstado"
            class="pasante-state-error"
          >
            {{ errorEstado }}
          </div>

          <div class="pasante-form-group">
            <label>
              {{ configuracionAccion.etiquetaCampo }}
              <template v-if="configuracionAccion.obligatorio">
                *
              </template>
            </label>

            <textarea
              v-model="textoEstado"
              class="pasante-state-textarea"
              maxlength="1000"
              :placeholder="configuracionAccion.placeholder"
            />

            <span class="pasante-state-count">
              {{ textoEstado.length }}/1000
            </span>
          </div>
        </div>

        <div class="pasante-modal-actions">
          <button
            type="button"
            class="pasante-btn-close"
            :disabled="procesandoEstado"
            @click="cerrarAccionEstado"
          >
            Cancelar
          </button>

          <button
            type="button"
            :class="configuracionAccion.claseBoton"
            :disabled="procesandoEstado"
            @click="confirmarAccionEstado"
          >
            {{
              procesandoEstado
                ? 'Procesando...'
                : configuracionAccion.textoBoton
            }}
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

const errorMensaje =
  ref('')

const estadoActivo =
  ref('TODOS')

const busqueda =
  ref('')

const filtroDepartamento =
  ref('')

const filtroModalidad =
  ref('')

const pasanteSeleccionado =
  ref(null)

const modalConfiguracion =
  ref(false)

const guardandoSeguimiento =
  ref(false)

const errorConfiguracion =
  ref('')

const modalEstado =
  ref(false)

const accionEstado =
  ref('')

const textoEstado =
  ref('')

const errorEstado =
  ref('')

const procesandoEstado =
  ref(false)

const formSeguimiento =
  ref({
    fecha_inicio: '',
    fecha_conclusion: '',
    duracion_acordada: '',
    horas_requeridas: null,
    turno: '',
  })

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

const tabs =
  computed(() => [
    {
      valor: 'TODOS',
      nombre: 'Todos',
      cantidad:
        datos.value.resumen.total,
    },
    {
      valor: 'ACTIVO',
      nombre: 'Activos',
      cantidad:
        datos.value.resumen.activos,
    },
    {
      valor: 'SUSPENDIDO',
      nombre: 'Suspendidos',
      cantidad:
        datos.value.resumen.suspendidos,
    },
    {
      valor: 'FINALIZADO',
      nombre: 'Finalizados',
      cantidad:
        datos.value.resumen.finalizados,
    },
    {
      valor: 'ABANDONO',
      nombre: 'Abandono',
      cantidad:
        datos.value.resumen.abandonos,
    },
  ])

const departamentosDisponibles =
  computed(() => {
    return [
      ...new Set(
        datos.value.pasantes
          .map(
            item =>
              item.departamento?.nombre,
          )
          .filter(Boolean),
      ),
    ].sort(
      (a, b) =>
        a.localeCompare(
          b,
          'es',
        ),
    )
  })

const modalidadesDisponibles =
  computed(() => {
    return [
      ...new Set(
        datos.value.pasantes
          .map(
            item =>
              item.modalidad_pasantia,
          )
          .filter(Boolean),
      ),
    ].sort()
  })

const pasantesVisibles =
  computed(() => {
    let lista =
      Array.isArray(
        datos.value.pasantes,
      )
        ? [...datos.value.pasantes]
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

    if (
      filtroDepartamento.value
    ) {
      lista =
        lista.filter(
          item =>
            item.departamento?.nombre ===
            filtroDepartamento.value,
        )
    }

    if (
      filtroModalidad.value
    ) {
      lista =
        lista.filter(
          item =>
            item.modalidad_pasantia ===
            filtroModalidad.value,
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

                item.departamento
                  ?.nombre,

                item.gerencia
                  ?.nombre,

                item.supervisor
                  ?.nombre_completo,
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

const configuracionAccion =
  computed(() => {
    const configuraciones = {
      SUSPENDER: {
        titulo:
          'Suspender pasantía',

        etiquetaCampo:
          'Motivo de la suspensión',

        placeholder:
          'Explique el motivo de la suspensión temporal...',

        obligatorio:
          true,

        textoBoton:
          'Suspender pasantía',

        claseBoton:
          'pasante-btn-suspend',
      },

      REACTIVAR: {
        titulo:
          'Reactivar pasantía',

        etiquetaCampo:
          'Motivo de la reactivación',

        placeholder:
          'Explique el motivo por el cual se reactiva la pasantía...',

        obligatorio:
          true,

        textoBoton:
          'Reactivar pasantía',

        claseBoton:
          'pasante-btn-reactivate',
      },

      ABANDONO: {
        titulo:
          'Registrar abandono',

        etiquetaCampo:
          'Motivo del abandono',

        placeholder:
          'Registre el motivo del abandono de la pasantía...',

        obligatorio:
          true,

        textoBoton:
          'Registrar abandono',

        claseBoton:
          'pasante-btn-abandon',
      },

      FINALIZAR: {
        titulo:
          'Finalizar pasantía',

        etiquetaCampo:
          'Observación',

        placeholder:
          'Puede registrar una observación sobre la finalización...',

        obligatorio:
          false,

        textoBoton:
          'Finalizar pasantía',

        claseBoton:
          'pasante-btn-finish',
      },
    }

    return (
      configuraciones[
        accionEstado.value
      ] || {
        titulo:
          'Gestión de pasantía',

        etiquetaCampo:
          'Observación',

        placeholder:
          '',

        obligatorio:
          false,

        textoBoton:
          'Confirmar',

        claseBoton:
          'pasante-btn-config',
      }
    )
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
          '/rrhh/pasantes',
        )

      datos.value = {
        resumen: {
          total:
            respuesta?.resumen?.total ?? 0,

          activos:
            respuesta?.resumen?.activos ?? 0,

          suspendidos:
            respuesta?.resumen?.suspendidos ?? 0,

          finalizados:
            respuesta?.resumen?.finalizados ?? 0,

          abandonos:
            respuesta?.resumen?.abandonos ?? 0,
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

const actualizarPasanteSeleccionado =
  pasanteId => {
    const actualizado =
      datos.value.pasantes.find(
        item =>
          item.id ===
          pasanteId,
      )

    pasanteSeleccionado.value =
      actualizado ?? null
  }

const abrirDetalle =
  pasante => {
    pasanteSeleccionado.value =
      pasante
  }

const cerrarDetalle =
  () => {
    if (
      guardandoSeguimiento.value ||
      procesandoEstado.value
    ) {
      return
    }

    pasanteSeleccionado.value =
      null
  }

const convertirFechaInput =
  valor => {
    if (!valor) {
      return ''
    }

    if (
      typeof valor === 'string' &&
      /^\d{4}-\d{2}-\d{2}/.test(valor)
    ) {
      return valor.slice(
        0,
        10,
      )
    }

    const fecha =
      new Date(valor)

    if (
      Number.isNaN(
        fecha.getTime(),
      )
    ) {
      return ''
    }

    const anio =
      fecha.getFullYear()

    const mes =
      String(
        fecha.getMonth() + 1,
      ).padStart(
        2,
        '0',
      )

    const dia =
      String(
        fecha.getDate(),
      ).padStart(
        2,
        '0',
      )

    return `${anio}-${mes}-${dia}`
  }

const abrirConfiguracion =
  () => {
    if (
      !pasanteSeleccionado.value ||
      pasanteSeleccionado.value.estado !==
        'ACTIVO'
    ) {
      return
    }

    const seguimiento =
      pasanteSeleccionado
        .value
        .seguimiento

    formSeguimiento.value = {
      fecha_inicio:
        convertirFechaInput(
          seguimiento?.fecha_inicio,
        ),

      fecha_conclusion:
        convertirFechaInput(
          seguimiento?.fecha_conclusion,
        ),

      duracion_acordada:
        seguimiento
          ?.duracion_acordada ?? '',

      horas_requeridas:
        seguimiento
          ?.horas_requeridas ?? null,

      turno:
        seguimiento?.turno ?? '',
    }

    errorConfiguracion.value =
      ''

    modalConfiguracion.value =
      true
  }

const cerrarConfiguracion =
  () => {
    if (
      guardandoSeguimiento.value
    ) {
      return
    }

    modalConfiguracion.value =
      false

    errorConfiguracion.value =
      ''
  }

const guardarConfiguracion =
  async () => {
    if (
      !pasanteSeleccionado.value
    ) {
      return
    }

    const formulario =
      formSeguimiento.value

    if (
      !formulario.fecha_inicio ||
      !formulario.fecha_conclusion ||
      !formulario.duracion_acordada ||
      !formulario.horas_requeridas ||
      !formulario.turno
    ) {
      errorConfiguracion.value =
        'Debe completar todos los campos obligatorios.'

      return
    }

    const horas =
      Number(
        formulario.horas_requeridas,
      )

    if (
      !Number.isInteger(horas) ||
      horas <= 0
    ) {
      errorConfiguracion.value =
        'Las horas requeridas deben ser un número entero mayor a cero.'

      return
    }

    if (
      formulario.fecha_conclusion <=
      formulario.fecha_inicio
    ) {
      errorConfiguracion.value =
        'La fecha de conclusión debe ser posterior a la fecha de inicio.'

      return
    }

    guardandoSeguimiento.value =
      true

    errorConfiguracion.value =
      ''

    try {
      const pasanteId =
        pasanteSeleccionado.value.id

      await $api(
        `/rrhh/pasantes/${pasanteId}/seguimiento`,
        {
          method: 'PATCH',

          body: {
            fecha_inicio:
              formulario.fecha_inicio,

            fecha_conclusion:
              formulario.fecha_conclusion,

            duracion_acordada:
              formulario.duracion_acordada,

            horas_requeridas:
              horas,

            turno:
              formulario.turno,
          },
        },
      )

      modalConfiguracion.value =
        false

      await cargarDatos()

      actualizarPasanteSeleccionado(
        pasanteId,
      )
    } catch (error) {
      errorConfiguracion.value =
        obtenerMensajeError(
          error,
        )
    } finally {
      guardandoSeguimiento.value =
        false
    }
  }

const abrirAccionEstado =
  accion => {
    if (
      !pasanteSeleccionado.value
    ) {
      return
    }

    accionEstado.value =
      accion

    textoEstado.value =
      ''

    errorEstado.value =
      ''

    modalEstado.value =
      true
  }

const cerrarAccionEstado =
  () => {
    if (
      procesandoEstado.value
    ) {
      return
    }

    modalEstado.value =
      false

    accionEstado.value =
      ''

    textoEstado.value =
      ''

    errorEstado.value =
      ''
  }

const confirmarAccionEstado =
  async () => {
    if (
      !pasanteSeleccionado.value ||
      !accionEstado.value
    ) {
      return
    }

    const configuracion =
      configuracionAccion.value

    const texto =
      textoEstado.value.trim()

    if (
      configuracion.obligatorio &&
      !texto
    ) {
      errorEstado.value =
        'Debe registrar el motivo para continuar.'

      return
    }

    const pasanteId =
      pasanteSeleccionado.value.id

    const endpoints = {
      SUSPENDER:
        `/rrhh/pasantes/${pasanteId}/suspender`,

      REACTIVAR:
        `/rrhh/pasantes/${pasanteId}/reactivar`,

      ABANDONO:
        `/rrhh/pasantes/${pasanteId}/abandono`,

      FINALIZAR:
        `/rrhh/pasantes/${pasanteId}/finalizar`,
    }

    const endpoint =
      endpoints[
        accionEstado.value
      ]

    if (!endpoint) {
      return
    }

    procesandoEstado.value =
      true

    errorEstado.value =
      ''

    try {
      const body =
        accionEstado.value ===
        'FINALIZAR'
          ? {
              observacion:
                texto || undefined,
            }
          : {
              motivo:
                texto,
            }

      await $api(
        endpoint,
        {
          method: 'PATCH',
          body,
        },
      )

      modalEstado.value =
        false

      accionEstado.value =
        ''

      textoEstado.value =
        ''

      await cargarDatos()

      actualizarPasanteSeleccionado(
        pasanteId,
      )
    } catch (error) {
      errorEstado.value =
        obtenerMensajeError(
          error,
        )
    } finally {
      procesandoEstado.value =
        false
    }
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
    const fechaIso =
      convertirFechaInput(
        valor,
      )

    if (!fechaIso) {
      return 'S/F'
    }

    const [
      anio,
      mes,
      dia,
    ] =
      fechaIso.split('-')

    return `${dia}/${mes}/${anio}`
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
@import '@/assets/css/pasantes-rrhh.css';
</style>