
<template>
  <div class="dashboard-wrapper font-sans select-none text-slate-700">
    <div class="dashboard-canvas">

      <!-- ===================================================== -->
      <!-- SIDEBAR INSTITUCIONAL -->
      <!-- ===================================================== -->

      <aside class="sidebar-corporate">
        <div>
          <!-- LOGO Y PERFIL -->
          <div class="flex flex-col items-center text-center mt-2 mb-8">
            <div class="avatar-container mb-3">
              <img
                src="/tele_img.jpeg"
                alt="Logo Mi Teleférico"
                class="w-full h-full object-cover rounded-full"
              />
            </div>

            <h2 class="text-xs font-black tracking-widest uppercase text-white">
              {{ authStore.usuario?.nombres || 'RESPONSABLE' }}
            </h2>

            <p class="text-[10px] text-emerald-200 font-mono mt-0.5">
              {{ authStore.usuario?.email || 'Mi Teleférico' }}
            </p>
          </div>

          <!-- NAVEGACIÓN -->
          <nav class="space-y-1.5 text-xs font-bold">

            <NuxtLink
              to="/admin/rrhh/dashboard"
              class="nav-item active"
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>

              <span>Dashboard</span>
            </NuxtLink>

            <NuxtLink
              v-if="esSuperadmin"
              to="/admin/rrhh/usuarios"
              class="nav-item"
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M17 11a4 4 0 100-8 4 4 0 000 8z"
                />
              </svg>

              <span>Gestionar Usuarios</span>
            </NuxtLink>

            <NuxtLink
              to="/admin/rrhh/postulantes_registrados/inf_postulante"
              class="nav-item"
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>

              <span>Postulantes Registrados</span>
            </NuxtLink>

            <NuxtLink
              to="/admin/rrhh/peticiones"
              class="nav-item"
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
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>

              <span>Peticiones Áreas</span>
            </NuxtLink>

            <NuxtLink
              to="/admin/rrhh/pasantes"
              class="nav-item"
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2c0-.656.126-1.283.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>

              <span>Pasantes Activos</span>
            </NuxtLink>

            <NuxtLink
              to="/admin/rrhh/control-pasantias"
              class="nav-item"
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 5h6m-6 7l2 2 4-4m-6 8h6"
                />
              </svg>

              <span>Control de Pasantías</span>
            </NuxtLink>

            <NuxtLink
              to="/admin/rrhh/reportes-certificados"
              class="nav-item"
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
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>

              <span>Reportes y Certificados</span>
            </NuxtLink>

          </nav>
        </div>

        <!-- CERRAR SESIÓN -->
        <button
          type="button"
          class="btn-logout"
          @click="authStore.logout"
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
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>

          <span>Cerrar Sesión</span>
        </button>
      </aside>

      <!-- ===================================================== -->
      <!-- CONTENIDO PRINCIPAL -->
      <!-- ===================================================== -->

      <main class="flex-1 flex flex-col p-6 sm:p-8 overflow-y-auto">

        <!-- CABECERA -->
        <div
          class="flex flex-wrap items-start justify-between gap-4 mb-6"
        >
          <div>
            <h1 class="text-xl font-black text-slate-800 tracking-tight">
              Panel de Control General
            </h1>

            <p class="text-xs text-slate-400 font-medium">
              Gerencia de Gestión de Talento Humano • Mi Teleférico
            </p>

            <p
              v-if="ultimaActualizacion"
              class="text-[10px] text-slate-400 mt-2"
            >
              Última actualización:
              {{ ultimaActualizacion }}
            </p>
          </div>

          <button
            type="button"
            class="header-icon-box"
            :disabled="cargando"
            :title="cargando ? 'Actualizando...' : 'Actualizar estadísticas'"
            aria-label="Actualizar estadísticas"
            @click="cargarDatos"
          >
            <svg
              class="w-5 h-5"
              :class="{ 'animate-spin': cargando }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v6h6M20 20v-6h-6M5.6 14A7 7 0 0018 17m.4-7A7 7 0 006 7"
              />
            </svg>
          </button>
        </div>

        <!-- ERROR DE CONSULTA -->
        <div
          v-if="errorCarga"
          class="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700"
          role="alert"
        >
          {{ errorCarga }}

          <button
            type="button"
            class="ml-2 font-bold underline"
            @click="cargarDatos"
          >
            Reintentar
          </button>
        </div>

        <!-- ================================================= -->
        <!-- INDICADORES GENERALES -->
        <!-- ================================================= -->

        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">

          <!-- TOTAL POSTULANTES -->
          <div class="kpi-card-featured">
            <div
              class="flex items-center justify-between text-[11px] text-emerald-100 font-bold uppercase tracking-wider"
            >
              <span>Postulantes</span>

              <div class="kpi-icon-pill-featured">
                <svg
                  class="w-3.5 h-3.5 text-white"
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
              </div>
            </div>

            <p class="text-3xl font-black text-white font-mono">
              {{ mostrarIndicador(stats?.kpis?.totalPostulantes) }}
            </p>
          </div>

          <!-- PASANTES ACTIVOS -->
          <div class="kpi-card">
            <div
              class="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider"
            >
              <span>Pasantes Activos</span>

              <div class="kpi-icon-pill bg-emerald-50 text-[#114d3f]">
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>

            <p class="text-3xl font-black text-slate-800 font-mono">
              {{ mostrarIndicador(stats?.kpis?.totalPasantesActivos) }}
            </p>
          </div>

          <!-- HABILITADOS -->
          <div class="kpi-card">
            <div
              class="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider"
            >
              <span>Habilitados</span>

              <div class="kpi-icon-pill bg-emerald-50 text-emerald-600">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            <p class="text-3xl font-black text-slate-800 font-mono">
              {{ mostrarIndicador(stats?.kpis?.totalHabilitados) }}
            </p>
          </div>

          <!-- PETICIONES ÁREAS -->
          <div class="kpi-card">
            <div
              class="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider"
            >
              <span>Peticiones Áreas</span>

              <div class="kpi-icon-pill bg-emerald-50 text-[#114d3f]">
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
            </div>

            <p class="text-3xl font-black text-slate-800 font-mono">
              {{ mostrarIndicador(stats?.kpis?.totalPeticionesAreas) }}
            </p>
          </div>

        </div>

        <!-- ================================================= -->
        <!-- GRÁFICAS Y RESUMEN -->
        <!-- ================================================= -->

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">

          <!-- COLUMNA PRINCIPAL -->
          <div class="lg:col-span-2 space-y-6 flex flex-col">

            <!-- POSTULACIONES SEMANALES -->
            <div class="chart-card">
              <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
                <span
                  class="text-xs font-black text-slate-700 uppercase tracking-wider"
                >
                  Postulaciones Registradas por Día
                </span>

                <span class="badge-tag">
                  SEMANA ACTUAL
                </span>
              </div>

              <div
                v-if="cargando && !stats"
                class="h-44 flex items-center justify-center text-xs text-slate-400"
              >
                Cargando estadísticas...
              </div>

              <div
                v-else-if="tieneDatosPostulaciones"
                class="h-44"
              >
                <ClientOnly>
                  <Bar
                    :data="barChartData"
                    :options="barChartOptions"
                  />
                </ClientOnly>
              </div>

              <div
                v-else
                class="h-44 flex flex-col items-center justify-center text-slate-400"
              >
                <svg
                  class="w-8 h-8 mb-2 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 3v18h18M7 16v-4m5 4V7m5 9v-6"
                  />
                </svg>

                <p class="text-xs font-semibold">
                  Sin postulaciones registradas para mostrar
                </p>
              </div>
            </div>

            <!-- SEGUIMIENTO DE HORAS -->
            <div class="chart-card">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <span
                    class="text-xs font-black text-slate-700 uppercase tracking-wider"
                  >
                    Avance Promedio de Horas de Pasantes
                  </span>

                  <p class="text-[10px] text-slate-400 mt-1">
                    Seguimiento sujeto a validación biométrica
                  </p>
                </div>
              </div>

              <div
                class="min-h-44 flex flex-col items-center justify-center text-center px-6 py-6"
              >
                <div
                  class="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4"
                >
                  <svg
                    class="w-6 h-6 text-[#114d3f]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>

                <h3 class="text-sm font-black text-slate-700">
                  Integración biométrica pendiente
                </h3>

                <p class="text-xs text-slate-400 mt-2 max-w-md leading-5">
                  El avance de horas se habilitará cuando el sistema
                  disponga de registros biométricos verificados.
                  No se utilizarán valores estimados como horas cumplidas.
                </p>
              </div>
            </div>

          </div>

          <!-- COLUMNA DERECHA -->
          <div class="chart-card flex flex-col justify-between">

            <!-- RESUMEN INSTITUCIONAL -->
            <div>
              <div
                class="text-xs font-black text-slate-700 uppercase tracking-wider mb-5"
              >
                Resumen de Gestión
              </div>

              <div class="flex flex-col items-center text-center">
                <div
                  class="w-36 h-36 rounded-full border-[12px] border-emerald-100 flex flex-col items-center justify-center my-2"
                >
                  <span class="text-3xl font-black text-[#114d3f] font-mono">
                    {{ mostrarIndicador(stats?.kpis?.totalPasantesActivos) }}
                  </span>

                  <span
                    class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1"
                  >
                    Pasantes activos
                  </span>
                </div>

                <p class="text-[11px] text-slate-400 mt-3">
                  Información registrada en el sistema operacional
                </p>
              </div>

              <div class="border-t border-slate-100 mt-6 pt-4 space-y-4">

                <div
                  class="flex items-center justify-between text-xs"
                >
                  <span class="font-medium text-slate-600">
                    Postulantes registrados
                  </span>

                  <strong class="text-[#114d3f] font-mono">
                    {{ mostrarIndicador(stats?.kpis?.totalPostulantes) }}
                  </strong>
                </div>

                <div
                  class="flex items-center justify-between text-xs"
                >
                  <span class="font-medium text-slate-600">
                    Postulantes habilitados
                  </span>

                  <strong class="text-[#114d3f] font-mono">
                    {{ mostrarIndicador(stats?.kpis?.totalHabilitados) }}
                  </strong>
                </div>

                <div
                  class="flex items-center justify-between text-xs"
                >
                  <span class="font-medium text-slate-600">
                    Peticiones de áreas
                  </span>

                  <strong class="text-[#114d3f] font-mono">
                    {{ mostrarIndicador(stats?.kpis?.totalPeticionesAreas) }}
                  </strong>
                </div>

              </div>

              <NuxtLink
                to="/admin/rrhh/reportes-certificados"
                class="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-[#114d3f] px-4 py-3 text-xs font-black text-white hover:bg-[#0b382e] transition-colors"
              >
                Ver Reportes y Certificados

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
                    d="M5 12h14m-6-6l6 6-6 6"
                  />
                </svg>
              </NuxtLink>
            </div>

            <!-- CALENDARIO DINÁMICO -->
            <div class="border-t border-slate-100 pt-4 mt-6">

              <div
                class="flex items-center justify-between mb-3 text-xs font-black text-slate-700"
              >
                <span class="uppercase">
                  {{ tituloCalendario }}
                </span>

                <span class="text-[10px] text-slate-400 font-mono">
                  L - D
                </span>
              </div>

              <div
                class="grid grid-cols-7 gap-1 text-center text-[10px] font-bold"
              >
                <span
                  v-for="dia in diasSemana"
                  :key="dia"
                  class="text-slate-300"
                >
                  {{ dia }}
                </span>

                <span
                  v-for="espacio in espaciosIniciales"
                  :key="`espacio-${espacio}`"
                  class="calendar-day"
                />

                <span
                  v-for="dia in diasDelMes"
                  :key="`dia-${dia}`"
                  class="calendar-day"
                  :class="{
                    'day-highlight': dia === diaActual,
                    'day-normal': dia !== diaActual,
                  }"
                >
                  {{ dia }}
                </span>
              </div>

              <NuxtLink
                to="/admin/rrhh/postulantes_registrados/inf_postulante"
                class="btn-action-green flex items-center justify-center"
              >
                Revisar Postulantes
              </NuxtLink>

            </div>

          </div>
        </div>

      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
} from 'vue';

import { useAuthStore } from '@/stores/auth';

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

import type {
  ChartData,
  ChartOptions,
} from 'chart.js';

import { Bar } from 'vue-chartjs';

// ============================================================
// CONFIGURACIÓN DE PÁGINA
// ============================================================

definePageMeta({
  middleware: 'admin',
});

// ============================================================
// REGISTRO DE CHART.JS
// ============================================================

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
);

// ============================================================
// TIPOS
// ============================================================

interface DashboardKpis {
  totalPostulantes: number;
  totalPasantesActivos: number;
  totalHabilitados: number;
  totalPeticionesAreas: number;
}

interface SerieEstadistica {
  labels: string[];
  datos: number[];
}

interface DashboardStats {
  kpis: DashboardKpis;
  postulantesPorDia: SerieEstadistica;
}

// ============================================================
// ESTADO
// ============================================================

const authStore = useAuthStore();

const stats = ref<DashboardStats | null>(null);

const cargando = ref(false);

const errorCarga = ref<string | null>(null);

const ultimaActualizacion = ref<string | null>(null);

// ============================================================
// AUTORIZACIÓN DE MENÚ
// ============================================================

const esSuperadmin = computed(() => {
  return authStore.usuario?.rol === 'SUPERADMIN';
});

// ============================================================
// VALIDACIÓN DE RESPUESTAS
// ============================================================

const esRegistro = (
  valor: unknown,
): valor is Record<string, unknown> => {
  return (
    typeof valor === 'object' &&
    valor !== null &&
    !Array.isArray(valor)
  );
};

const esNumeroValido = (valor: unknown): valor is number => {
  return (
    typeof valor === 'number' &&
    Number.isFinite(valor) &&
    valor >= 0
  );
};

const leerNumero = (
  objeto: Record<string, unknown>,
  propiedad: string,
): number | null => {
  const valor = objeto[propiedad];

  return esNumeroValido(valor) ? valor : null;
};

const leerSerie = (
  valor: unknown,
): SerieEstadistica | null => {
  if (!esRegistro(valor)) {
    return null;
  }

  const labels = valor.labels;
  const datos = valor.datos;

  if (
    !Array.isArray(labels) ||
    !Array.isArray(datos) ||
    labels.length !== datos.length ||
    !labels.every(
      (elemento: unknown) => typeof elemento === 'string',
    ) ||
    !datos.every(
      (elemento: unknown) => esNumeroValido(elemento),
    )
  ) {
    return null;
  }

  return {
    labels: labels as string[],
    datos: datos as number[],
  };
};

const validarDashboard = (
  valor: unknown,
): DashboardStats => {
  if (!esRegistro(valor) || !esRegistro(valor.kpis)) {
    throw new Error(
      'El servidor devolvió una estructura de estadísticas inválida.',
    );
  }

  const kpis = valor.kpis;

  const totalPostulantes = leerNumero(kpis, 'totalPostulantes');

  const totalPasantesActivos = leerNumero(
    kpis,
    'totalPasantesActivos',
  );

  const totalHabilitados = leerNumero(
    kpis,
    'totalHabilitados',
  );

  const totalPeticionesAreas = leerNumero(
    kpis,
    'totalPeticionesAreas',
  );

  if (
    totalPostulantes === null ||
    totalPasantesActivos === null ||
    totalHabilitados === null ||
    totalPeticionesAreas === null
  ) {
    throw new Error(
      'Los indicadores recibidos no tienen valores válidos.',
    );
  }

  const serie = leerSerie(valor.postulantesPorDia);

  return {
    kpis: {
      totalPostulantes,
      totalPasantesActivos,
      totalHabilitados,
      totalPeticionesAreas,
    },

    postulantesPorDia: serie ?? {
      labels: [],
      datos: [],
    },
  };
};

// ============================================================
// MOSTRAR VALORES SIN INVENTAR INFORMACIÓN
// ============================================================

const mostrarIndicador = (
  valor: number | null | undefined,
): string => {
  if (cargando.value && !stats.value) {
    return '...';
  }

  if (valor === null || valor === undefined) {
    return '—';
  }

  return valor.toLocaleString('es-BO');
};

// ============================================================
// CARGA DE ESTADÍSTICAS OPERACIONALES
// ============================================================

const cargarDatos = async (): Promise<void> => {
  if (cargando.value) {
    return;
  }

  cargando.value = true;
  errorCarga.value = null;

  try {
    /*
     * Conservamos el endpoint existente del dashboard.
     *
     * Este endpoint es distinto del Data Mart.
     * El Data Mart se utilizará en Reportes y Certificados.
     */

    const respuesta = await fetch(
      'http://localhost:3000/rrhh/dashboard-stats',
      {
        method: 'GET',

        headers: {
          Accept: 'application/json',
        },

        cache: 'no-store',
      },
    );

    if (!respuesta.ok) {
      throw new Error(
        `No se pudieron consultar las estadísticas (HTTP ${respuesta.status}).`,
      );
    }

    const datos: unknown = await respuesta.json();

    stats.value = validarDashboard(datos);

    ultimaActualizacion.value =
      new Date().toLocaleString('es-BO');
  } catch (error: unknown) {
    console.error(
      'Error cargando estadísticas del dashboard:',
      error,
    );

    errorCarga.value =
      error instanceof Error
        ? error.message
        : 'No se pudieron cargar las estadísticas.';

    /*
     * Si ya existían datos válidos, se conservan.
     * Si no existen, el dashboard muestra valores vacíos.
     */
  } finally {
    cargando.value = false;
  }
};

// ============================================================
// GRÁFICA DE POSTULACIONES POR DÍA
// ============================================================

const tieneDatosPostulaciones = computed(() => {
  const serie = stats.value?.postulantesPorDia;

  return Boolean(
    serie &&
    serie.labels.length > 0 &&
    serie.datos.some((valor) => valor > 0),
  );
});

const barChartData = computed<ChartData<'bar'>>(() => {
  const serie = stats.value?.postulantesPorDia;

  return {
    labels: serie?.labels ?? [],

    datasets: [
      {
        label: 'Postulaciones registradas',

        backgroundColor: '#114d3f',

        borderRadius: 5,

        data: serie?.datos ?? [],
      },
    ],
  };
});

const barChartOptions: ChartOptions<'bar'> = {
  responsive: true,

  maintainAspectRatio: false,

  plugins: {
    legend: {
      display: false,
    },

    tooltip: {
      enabled: true,
    },
  },

  scales: {
    x: {
      grid: {
        display: false,
      },
    },

    y: {
      beginAtZero: true,

      ticks: {
        precision: 0,
      },

      grid: {
        color: '#f1f5f9',
      },
    },
  },
};

// ============================================================
// CALENDARIO DINÁMICO
// ============================================================

const fechaActual = ref(new Date());

const diasSemana = [
  'L',
  'M',
  'M',
  'J',
  'V',
  'S',
  'D',
];

const tituloCalendario = computed(() => {
  return new Intl.DateTimeFormat('es-BO', {
    month: 'long',
    year: 'numeric',
  })
    .format(fechaActual.value)
    .toUpperCase();
});

const diaActual = computed(() => {
  return fechaActual.value.getDate();
});

const diasDelMes = computed(() => {
  const anio = fechaActual.value.getFullYear();
  const mes = fechaActual.value.getMonth();

  return new Date(anio, mes + 1, 0).getDate();
});

const espaciosIniciales = computed(() => {
  const anio = fechaActual.value.getFullYear();
  const mes = fechaActual.value.getMonth();

  const primerDia = new Date(anio, mes, 1).getDay();

  // Convertimos domingo=0 a un calendario lunes=0.
  return (primerDia + 6) % 7;
});

// ============================================================
// INICIALIZACIÓN
// ============================================================

onMounted(async () => {
  authStore.cargarSesion();

  if (!authStore.estaAutenticado) {
    await navigateTo('/');
    return;
  }

  fechaActual.value = new Date();

  await cargarDatos();
});
</script>

<style scoped>
@import '@/assets/css/dashboard-rrhh.css';
</style>
