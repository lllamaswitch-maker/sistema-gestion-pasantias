<template>
  <div class="dashboard-wrapper font-sans text-slate-700">

    <div class="dashboard-canvas">

      <!-- ===================================================== -->
      <!-- SIDEBAR                                               -->
      <!-- ===================================================== -->

      <aside class="sidebar-corporate">

        <div>

          <div class="flex flex-col items-center text-center mt-2 mb-8">

            <div class="avatar-container mb-3">
              <img
                src="/tele_img.jpeg"
                alt="Logo Mi Teleférico"
                class="w-full h-full object-cover rounded-full"
              />
            </div>

            <h2 class="text-xs font-black tracking-widest uppercase text-white">
              {{ authStore.usuario?.nombres || 'ADMINISTRADOR' }}
            </h2>

            <p class="text-[10px] text-emerald-200 font-mono mt-0.5">
              {{ authStore.usuario?.email || 'admin@miteleferico.bo' }}
            </p>

            <span class="superadmin-badge">
              SUPERADMIN
            </span>

          </div>


          <nav class="space-y-1.5 text-xs font-bold">

            <NuxtLink
              to="/admin/rrhh/dashboard"
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3"
                />
              </svg>

              <span>Dashboard</span>
            </NuxtLink>


            <NuxtLink
              to="/admin/rrhh/usuarios"
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
                  d="M17 20h5v-2a4 4 0 00-4-4h-1m-4 6H3v-2a4 4 0 014-4h6a4 4 0 014 4v2zm-3-8a4 4 0 100-8 4 4 0 000 8z"
                />
              </svg>

              <span>Gestionar Usuarios</span>
            </NuxtLink>


            <NuxtLink
              to="/admin/rrhh/postulantes_registrados/inf_postulante"
              class="nav-item"
            >
              <span>Postulantes Registrados</span>
            </NuxtLink>


            <NuxtLink
              to="/admin/rrhh/peticiones"
              class="nav-item"
            >
              <span>Peticiones Áreas</span>
            </NuxtLink>


            <NuxtLink
              to="/admin/rrhh/pasantes"
              class="nav-item"
            >
              <span>Pasantes Activos</span>
            </NuxtLink>


            <NuxtLink
              to="/admin/rrhh/reportes-certificados"
              class="nav-item"
            >
              <span>Reportes y Certificados</span>
            </NuxtLink>

          </nav>

        </div>


        <button
          type="button"
          class="btn-logout"
          @click="cerrarSesion"
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
              d="M17 16l4-4m0 0l-4-4m4 4H7"
            />
          </svg>

          <span>Cerrar Sesión</span>
        </button>

      </aside>


      <!-- ===================================================== -->
      <!-- CONTENIDO                                             -->
      <!-- ===================================================== -->

      <main
        class="flex-1 flex flex-col p-6 sm:p-8 overflow-y-auto"
      >

        <!-- CABECERA -->

        <div
          class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6"
        >

          <div>

            <p class="section-label">
              Gestión de usuarios
            </p>

            <h1 class="text-2xl font-black text-slate-800 tracking-tight">
              Editar Usuario
            </h1>

            <p class="text-xs text-slate-400 font-medium mt-1">
              Modifique los datos, rol y unidad organizacional del usuario.
            </p>

          </div>


          <button
            type="button"
            class="btn-volver"
            @click="volver"
          >
            Volver
          </button>

        </div>


        <!-- CARGANDO -->

        <div
          v-if="cargando"
          class="panel-card estado-vacio"
        >
          <div class="loader"></div>

          <p>
            Cargando información del usuario...
          </p>
        </div>


        <template v-else>

          <!-- ERROR -->

          <div
            v-if="errorMensaje"
            class="error-box mb-5"
          >
            {{ errorMensaje }}
          </div>


          <!-- ÉXITO -->

          <div
            v-if="mensajeExito"
            class="success-box mb-5"
          >
            {{ mensajeExito }}
          </div>


          <!-- ================================================= -->
          <!-- RESUMEN USUARIO                                   -->
          <!-- ================================================= -->

          <section
            v-if="usuarioActual"
            class="panel-card user-summary-edit mb-6"
          >

            <div class="flex items-center gap-4">

              <div class="user-avatar user-avatar-large">
                {{ inicialesUsuario }}
              </div>


              <div class="flex-1">

                <h2 class="text-base font-black text-slate-800">
                  {{ usuarioActual.nombres }}
                  {{ usuarioActual.apellidos }}
                </h2>

                <p class="text-xs text-slate-400 mt-1">
                  {{ usuarioActual.email }}
                </p>

                <div class="flex flex-wrap items-center gap-2 mt-3">

                  <span
                    class="role-badge"
                    :class="claseRol(usuarioActual.rol)"
                  >
                    {{ nombreRol(usuarioActual.rol) }}
                  </span>

                  <span
                    class="status-badge"
                    :class="
                      usuarioActual.activo
                        ? 'status-active'
                        : 'status-inactive'
                    "
                  >
                    {{
                      usuarioActual.activo
                        ? 'ACTIVO'
                        : 'INACTIVO'
                    }}
                  </span>

                </div>

              </div>

            </div>

          </section>


          <!-- ================================================= -->
          <!-- FORMULARIO EDICIÓN                                -->
          <!-- ================================================= -->

          <form
            class="panel-card usuario-form"
            @submit.prevent="solicitarAutorizacion"
            >

            <!-- DATOS PERSONALES -->

            <div class="form-section">

              <div class="form-section-header">

                <div>

                  <h2 class="panel-title">
                    Datos personales
                  </h2>

                  <p class="panel-subtitle">
                    Información principal del usuario administrativo.
                  </p>

                </div>

                <span class="section-number">
                  01
                </span>

              </div>


              <div
                class="grid grid-cols-1 md:grid-cols-2 gap-5"
              >

                <!-- CI -->

                <div>

                  <label class="form-label">
                    C.I. *
                  </label>

                  <input
                    v-model.trim="form.ci"
                    type="text"
                    class="form-control"
                    maxlength="30"
                  />

                </div>


                <!-- CARGO -->

                <div>

                  <label class="form-label">
                    Cargo *
                  </label>

                  <input
                    v-model.trim="form.cargo"
                    type="text"
                    class="form-control"
                    maxlength="150"
                  />

                </div>


                <!-- NOMBRES -->

                <div>

                  <label class="form-label">
                    Nombres *
                  </label>

                  <input
                    v-model.trim="form.nombres"
                    type="text"
                    class="form-control"
                    maxlength="150"
                  />

                </div>


                <!-- APELLIDOS -->

                <div>

                  <label class="form-label">
                    Apellidos *
                  </label>

                  <input
                    v-model.trim="form.apellidos"
                    type="text"
                    class="form-control"
                    maxlength="150"
                  />

                </div>


                <!-- EMAIL -->

                <div class="md:col-span-2">

                  <label class="form-label">
                    Correo electrónico *
                  </label>

                  <input
                    v-model.trim="form.email"
                    type="email"
                    class="form-control"
                    maxlength="200"
                  />

                </div>

              </div>

            </div>


            <!-- ================================================= -->
            <!-- ROL Y ORGANIZACIÓN                                -->
            <!-- ================================================= -->

            <div class="form-section">

              <div class="form-section-header">

                <div>

                  <h2 class="panel-title">
                    Rol y unidad organizacional
                  </h2>

                  <p class="panel-subtitle">
                    Configure el nivel de acceso, Gerencia y Departamento.
                  </p>

                </div>

                <span class="section-number">
                  02
                </span>

              </div>


              <div
                class="grid grid-cols-1 md:grid-cols-2 gap-5"
              >

                <!-- ROL -->

                <div class="md:col-span-2">

                  <label class="form-label">
                    Rol *
                  </label>

                  <select
                    v-model="form.rol"
                    class="form-control"
                    :disabled="esMiPropiaCuenta"
                  >

                    <option value="SUPERADMIN">
                      Superadministrador
                    </option>

                    <option value="ADMIN_RRHH">
                      Administrador RRHH
                    </option>

                    <option value="SUPERVISOR">
                      Supervisor
                    </option>

                  </select>


                  <p
                    v-if="esMiPropiaCuenta"
                    class="form-help"
                  >
                    No puede modificar su propio rol mientras utiliza esta cuenta.
                  </p>


                  <p
                    v-else-if="form.rol === 'SUPERADMIN'"
                    class="form-help"
                  >
                    El Superadministrador no requiere un departamento específico.
                  </p>

                </div>


                <!-- GERENCIA -->

                <div>

                  <label class="form-label">
                    Gerencia
                    <span v-if="requiereDepartamento">
                      *
                    </span>
                  </label>

                  <select
                    v-model="form.gerencia_id"
                    class="form-control"
                    :disabled="
                      form.rol === 'SUPERADMIN' ||
                      cargandoGerencias
                    "
                  >

                    <option value="">
                      Seleccione una gerencia
                    </option>

                    <option
                      v-for="gerencia in listaGerencias"
                      :key="gerencia.id"
                      :value="gerencia.id"
                    >
                      {{ gerencia.nombre }}
                    </option>

                  </select>

                </div>


                <!-- DEPARTAMENTO -->

                <div>

                  <label class="form-label">
                    Departamento
                    <span v-if="requiereDepartamento">
                      *
                    </span>
                  </label>

                  <select
                    v-model="form.departamento_id"
                    class="form-control"
                    :disabled="
                      form.rol === 'SUPERADMIN' ||
                      !form.gerencia_id ||
                      cargandoDepartamentos
                    "
                  >

                    <option value="">
                      {{
                        cargandoDepartamentos
                          ? 'Cargando departamentos...'
                          : 'Seleccione un departamento'
                      }}
                    </option>

                    <option
                      v-for="departamento in listaDepartamentos"
                      :key="departamento.id"
                      :value="departamento.id"
                    >
                      {{ departamento.nombre }}
                    </option>

                  </select>

                </div>

              </div>

            </div>


            <!-- ACCIONES -->

            <div class="form-actions">

              <button type="button" class="btn-cancelar"  :disabled="guardando"  @click="volver">
                Cancelar
              </button>


              <button type="button" class="btn-guardar" :disabled="guardando" @click="solicitarAutorizacion" >
                Guardar Cambios
                </button>
            </div>
          </form>


          <!-- ================================================= -->
          <!-- CONTRASEÑA                                        -->
          <!-- ================================================= -->

          <section
            class="panel-card usuario-form mt-6"
          >

            <div class="form-section-header">

              <div>

                <h2 class="panel-title">
                  Restablecer contraseña
                </h2>

                <p class="panel-subtitle">
                  Asigne una nueva contraseña de acceso al usuario.
                </p>

              </div>

              <span class="section-number">
                03
              </span>

            </div>


            <div
              class="grid grid-cols-1 md:grid-cols-2 gap-5"
            >

              <div>

                <label class="form-label">
                  Nueva contraseña
                </label>

                <input
                  v-model="password.nueva"
                  type="password"
                  class="form-control"
                  placeholder="Mínimo 8 caracteres"
                  autocomplete="new-password"
                />

              </div>


              <div>

                <label class="form-label">
                  Confirmar contraseña
                </label>

                <input
                  v-model="password.confirmacion"
                  type="password"
                  class="form-control"
                  placeholder="Repita la contraseña"
                  autocomplete="new-password"
                />

              </div>

            </div>

                    <div
                        v-if="errorPassword"
                        class="error-box mt-4"
                        >
                        {{ errorPassword }}
                        </div>

                        <div
                        v-if="mensajePassword"
                        class="success-box mt-4"
                        >
                        {{ mensajePassword }}
                        </div>
            <div class="form-actions mt-5">

              <button
                    type="button"
                    class="btn-guardar"
                    :disabled="restableciendoPassword"
                    @click="restablecerPassword"
                    >
                    {{
                        restableciendoPassword
                        ? 'Actualizando...'
                        : 'Restablecer Contraseña'
                    }}
                    </button>

            </div>

          </section>


          <!-- ================================================= -->
          <!-- ESTADO DEL USUARIO                                -->
          <!-- ================================================= -->

          <section
            v-if="usuarioActual"
            class="panel-card usuario-form mt-6"
          >

            <div class="form-section-header">

              <div>

                <h2 class="panel-title">
                  Estado de la cuenta
                </h2>

                <p class="panel-subtitle">
                  Active o desactive temporalmente el acceso del usuario.
                </p>

              </div>

              <span class="section-number">
                04
              </span>

            </div>


            <div
              class="account-status-row"
            >

              <div>

                <p class="text-xs font-black text-slate-700">
                  Estado actual
                </p>

                <span
                  class="status-badge mt-2"
                  :class="
                    usuarioActual.activo
                      ? 'status-active'
                      : 'status-inactive'
                  "
                >
                  {{
                    usuarioActual.activo
                      ? 'ACTIVO'
                      : 'INACTIVO'
                  }}
                </span>

              </div>


              <button
                type="button"
                class="btn-estado"
                :class="
                  usuarioActual.activo
                    ? 'btn-desactivar'
                    : 'btn-activar'
                "
                :disabled="
                  cambiandoEstado ||
                  esMiPropiaCuenta
                "
                @click="cambiarEstado"
              >
                {{
                  cambiandoEstado
                    ? 'Procesando...'
                    : usuarioActual.activo
                      ? 'Desactivar Usuario'
                      : 'Activar Usuario'
                }}
              </button>

            </div>


            <p
              v-if="esMiPropiaCuenta"
              class="form-help mt-4"
            >
              No puede desactivar la cuenta con la que tiene iniciada la sesión.
            </p>

          </section>

        </template>

      </main>

    </div>

  </div>

  <!-- ======================================================= -->
<!-- MODAL AUTORIZACIÓN SUPERADMIN                           -->
<!-- ======================================================= -->

<div
  v-if="modalAutorizacion"
  class="auth-modal-overlay"
  @click.self="cerrarModalAutorizacion"
>

  <div class="auth-modal">

    <div class="auth-modal-header">

      <div>

        <p class="section-label">
          Confirmación de seguridad
        </p>

        <h2 class="auth-modal-title">
            {{
                accionAutorizacion === 'RESTABLECER_PASSWORD'
                ? 'Autorizar cambio de contraseña'
                : 'Autorizar modificación'
            }}
            </h2>>

      </div>


      <button
        type="button"
        class="auth-modal-close"
        :disabled="guardando"
        @click="cerrarModalAutorizacion"
      >
        ×
      </button>

    </div>


    <div class="auth-modal-body">

      <p class="auth-modal-description">

            <template
                v-if="accionAutorizacion === 'RESTABLECER_PASSWORD'"
            >
                Para restablecer la contraseña del usuario,
                confirme su identidad ingresando la contraseña
                de la cuenta SUPERADMIN actualmente autenticada.
            </template>

            <template v-else>
                Para guardar los cambios, confirme su identidad
                ingresando la contraseña de la cuenta SUPERADMIN
                actualmente autenticada.
            </template>

            </p>


      <div class="auth-user-box">

        <span class="auth-user-label">
          Usuario que autoriza
        </span>

        <strong>
          {{
            authStore.usuario?.nombres
          }}
          {{
            authStore.usuario?.apellidos
          }}
        </strong>

        <span>
          {{ authStore.usuario?.email }}
        </span>

      </div>


      <div class="mt-5">

            <label class="form-label">
                Contraseña *
            </label>

            <input
                ref="inputPasswordAutorizacion"
                v-model="passwordAutorizacion"
                type="password"
                class="form-control"
                placeholder="Ingrese su contraseña"
                autocomplete="current-password"
                @keyup.enter="confirmarActualizacion"
            />

            </div>


      <div
        v-if="errorAutorizacion"
        class="error-box mt-4"
      >
        {{ errorAutorizacion }}
      </div>

    </div>


    <div class="auth-modal-actions">

      <button
        type="button"
        class="btn-cancelar"
        :disabled="guardando"
        @click="cerrarModalAutorizacion"
      >
        Cancelar
      </button>


      <button
            type="button"
            class="btn-guardar"
            :disabled="
                guardando ||
                restableciendoPassword ||
                !passwordAutorizacion
            "
            @click="confirmarActualizacion"
            >
            {{
                guardando || restableciendoPassword
                ? 'Verificando...'
                : accionAutorizacion === 'RESTABLECER_PASSWORD'
                    ? 'Confirmar Cambio'
                    : 'Confirmar y Guardar'
            }}
            </button>

    </div>

  </div>

</div>
</template>


<script setup>
definePageMeta({
  middleware: 'admin',
})


import {computed,nextTick,onMounted,reactive,ref,watch,

} from 'vue'


import {
  useAuthStore,
} from '@/stores/auth'


const authStore =
  useAuthStore()


const route =
  useRoute()


const {
  $api,
} = useNuxtApp()


// ============================================================
// ID
// ============================================================

const usuarioId =
  computed(() => {

    return String(
      route.params.id || '',
    )

  })


// ============================================================
// ESTADO
// ============================================================

const usuarioActual =
  ref(null)


const listaGerencias =
  ref([])


const listaDepartamentos =
  ref([])


const cargando =
  ref(true)


const cargandoGerencias =
  ref(false)


const cargandoDepartamentos =
  ref(false)


const guardando =
  ref(false)


const restableciendoPassword =
  ref(false)


const cambiandoEstado =
  ref(false)


const cargaInicial =
  ref(true)


const errorMensaje =
  ref('')


const mensajeExito =
  ref('')
  const errorPassword =
  ref('')

const mensajePassword =
  ref('')

const accionAutorizacion =
  ref('')

const modalAutorizacion =
  ref(false)

const passwordAutorizacion =
  ref('')

const errorAutorizacion =
  ref('')

const inputPasswordAutorizacion =
  ref(null)


  
// ============================================================
// FORMULARIO
// ============================================================

const form =
  reactive({

    ci:
      '',

    nombres:
      '',

    apellidos:
      '',

    email:
      '',

    cargo:
      '',

    rol:
      '',

    gerencia_id:
      '',

    departamento_id:
      '',

  })


const password =
  reactive({

    nueva:
      '',

    confirmacion:
      '',

  })


// ============================================================
// PERMISOS
// ============================================================

const esSuperadmin =
  computed(() => {

    return (
      authStore.usuario?.rol ===
      'SUPERADMIN'
    )

  })


const esMiPropiaCuenta =
  computed(() => {

    return (
      String(
        authStore.usuario?.id ||
        '',
      ) ===
      usuarioId.value
    )

  })


const requiereDepartamento =
  computed(() => {

    return (
      form.rol ===
        'ADMIN_RRHH' ||
      form.rol ===
        'SUPERVISOR'
    )

  })


// ============================================================
// PRESENTACIÓN
// ============================================================

const inicialesUsuario =
  computed(() => {

    const nombre =
      String(
        usuarioActual.value?.nombres ||
        '',
      )
        .trim()
        .charAt(0)


    const apellido =
      String(
        usuarioActual.value?.apellidos ||
        '',
      )
        .trim()
        .charAt(0)


    return (
      `${nombre}${apellido}`
        .toUpperCase() ||
      'U'
    )

  })


// ============================================================
// ERROR DEL SERVIDOR
// ============================================================

const obtenerMensajeError =
  (error) => {

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
      ''
    )

  }


// ============================================================
// GERENCIAS
// ============================================================

const cargarGerencias =
  async () => {

    cargandoGerencias.value =
      true


    try {

      const respuesta =
        await $api(
          '/organizacion/gerencias',
        )


      listaGerencias.value =
        Array.isArray(
          respuesta,
        )
          ? respuesta
          : []


    } finally {

      cargandoGerencias.value =
        false

    }

  }


// ============================================================
// DEPARTAMENTOS
// ============================================================

const cargarDepartamentos =
  async (
    gerenciaId,
    limpiarSeleccion = true,
  ) => {

    listaDepartamentos.value =
      []


    if (limpiarSeleccion) {

      form.departamento_id =
        ''

    }


    if (!gerenciaId) {
      return
    }


    cargandoDepartamentos.value =
      true


    try {

      const respuesta =
        await $api(
          `/organizacion/gerencias/${gerenciaId}/departamentos`,
        )


      listaDepartamentos.value =
        Array.isArray(
          respuesta?.departamentos,
        )
          ? respuesta.departamentos
          : []


    } catch (error) {

      errorMensaje.value =
        obtenerMensajeError(
          error,
        ) ||
        'No se pudieron cargar los departamentos.'


    } finally {

      cargandoDepartamentos.value =
        false

    }

  }


// ============================================================
// CARGAR USUARIO
// ============================================================

const cargarUsuario =
  async () => {

    cargando.value =
      true

    errorMensaje.value =
      ''


    try {

      const [
        usuarios,
      ] =
        await Promise.all([

          $api(
            '/usuarios-administrativos',
          ),

          cargarGerencias(),

        ])


      const usuario =
        Array.isArray(
          usuarios,
        )
          ? usuarios.find(
              (item) =>
                String(item.id) ===
                usuarioId.value,
            )
          : null


      if (!usuario) {

        throw new Error(
          'El usuario administrativo solicitado no existe.',
        )

      }


      usuarioActual.value =
        usuario


      form.ci =
        usuario.ci || ''

      form.nombres =
        usuario.nombres || ''

      form.apellidos =
        usuario.apellidos || ''

      form.email =
        usuario.email || ''

      form.cargo =
        usuario.cargo || ''

      form.rol =
        usuario.rol || ''


      // ------------------------------------------
      // GERENCIA ACTUAL
      // ------------------------------------------

      const gerenciaId =
        usuario
          .departamentos
          ?.gerencias
          ?.id ||
        usuario
          .departamentos
          ?.gerencia_id ||
        ''


      form.gerencia_id =
        gerenciaId


      if (gerenciaId) {

        await cargarDepartamentos(
          gerenciaId,
          false,
        )

      }


      form.departamento_id =
        usuario.departamento_id ||
        usuario.departamentos?.id ||
        ''


    } catch (error) {

      console.error(
        'Error cargando usuario:',
        error,
      )


      errorMensaje.value =
        obtenerMensajeError(
          error,
        ) ||
        'No se pudo cargar la información del usuario.'


    } finally {

      cargaInicial.value =
        false

      cargando.value =
        false

    }

  }


// ============================================================
// CAMBIO GERENCIA
// ============================================================

watch(
  () =>
    form.gerencia_id,

  async (
    nuevoValor,
    valorAnterior,
  ) => {

    if (
      cargaInicial.value
    ) {
      return
    }


    if (
      nuevoValor ===
      valorAnterior
    ) {
      return
    }


    await cargarDepartamentos(
      nuevoValor,
      true,
    )

  },
)


// ============================================================
// CAMBIO ROL
// ============================================================

watch(
  () =>
    form.rol,

  (nuevoRol) => {

    if (
      cargaInicial.value
    ) {
      return
    }


    if (
      nuevoRol ===
      'SUPERADMIN'
    ) {

      form.gerencia_id =
        ''

      form.departamento_id =
        ''

      listaDepartamentos.value =
        []

    }

  },
)


// ============================================================
// VALIDACIÓN
// ============================================================

const validarFormulario =
  () => {

    errorMensaje.value =
      ''


    if (!form.ci.trim()) {

      errorMensaje.value =
        'Debe ingresar el C.I.'

      return false

    }


    if (!form.nombres.trim()) {

      errorMensaje.value =
        'Debe ingresar los nombres.'

      return false

    }


    if (!form.apellidos.trim()) {

      errorMensaje.value =
        'Debe ingresar los apellidos.'

      return false

    }


    if (!form.email.trim()) {

      errorMensaje.value =
        'Debe ingresar el correo electrónico.'

      return false

    }


    if (!form.cargo.trim()) {

      errorMensaje.value =
        'Debe ingresar el cargo.'

      return false

    }


    if (!form.rol) {

      errorMensaje.value =
        'Debe seleccionar un rol.'

      return false

    }


    if (
      requiereDepartamento.value &&
      !form.gerencia_id
    ) {

      errorMensaje.value =
        'Debe seleccionar una gerencia.'

      return false

    }


    if (
      requiereDepartamento.value &&
      !form.departamento_id
    ) {

      errorMensaje.value =
        'Debe seleccionar un departamento.'

      return false

    }


    return true

  }


// ============================================================
// GUARDAR CAMBIOS
// ============================================================
// ============================================================
// SOLICITAR AUTORIZACIÓN
// ============================================================

const solicitarAutorizacion =
  async () => {

    if (
      !validarFormulario()
    ) {
      return
    }


    errorMensaje.value =
      ''

    mensajeExito.value =
      ''

    errorAutorizacion.value =
      ''

    passwordAutorizacion.value =
      ''

    modalAutorizacion.value =
      true
    accionAutorizacion.value =
    'ACTUALIZAR_USUARIO'

    await nextTick()


    inputPasswordAutorizacion.value
      ?.focus()

  }


// ============================================================
// CERRAR MODAL
// ============================================================

const cerrarModalAutorizacion =
  () => {

    if (
        guardando.value ||
        restableciendoPassword.value
        ) {
        return
        }


    modalAutorizacion.value =
      false

    passwordAutorizacion.value =
      ''

    errorAutorizacion.value =
      ''

  }



// ============================================================
// CONFIRMAR OPERACIÓN CON CONTRASEÑA SUPERADMIN
// ============================================================

const confirmarActualizacion =
  async () => {

    errorAutorizacion.value =
      ''


    if (
      !passwordAutorizacion
        .value
        .trim()
    ) {

      errorAutorizacion.value =
        'Debe ingresar su contraseña.'

      return

    }


    // ========================================================
    // RESTABLECER CONTRASEÑA
    // ========================================================

    if (
      accionAutorizacion.value ===
      'RESTABLECER_PASSWORD'
    ) {

      restableciendoPassword.value =
        true


      try {

        await $api(
          `/usuarios-administrativos/${usuarioId.value}/restablecer-password`,
          {

            method:
              'PATCH',

            body: {

              password:
                password.nueva,

              password_autorizacion:
                passwordAutorizacion.value,

            },

          },
        )


        password.nueva =
          ''

        password.confirmacion =
          ''

        passwordAutorizacion.value =
          ''

        modalAutorizacion.value =
          false

        accionAutorizacion.value =
          ''


        mensajePassword.value =
          'La contraseña del usuario fue restablecida correctamente.'


      } catch (error) {

        console.error(
          'Error restableciendo contraseña:',
          error,
        )


        errorAutorizacion.value =
          obtenerMensajeError(
            error,
          ) ||
          'No se pudo autorizar el cambio de contraseña.'


      } finally {

        restableciendoPassword.value =
          false

      }


      return

    }


    // ========================================================
    // ACTUALIZAR DATOS DEL USUARIO
    // ========================================================

    guardando.value =
      true

    errorMensaje.value =
      ''

    mensajeExito.value =
      ''


    try {

      const body = {

        ci:
          form.ci.trim(),

        nombres:
          form.nombres.trim(),

        apellidos:
          form.apellidos.trim(),

        email:
          form.email
            .trim()
            .toLowerCase(),

        cargo:
          form.cargo.trim(),

        rol:
          form.rol,

        departamento_id:
          form.rol ===
            'SUPERADMIN'
            ? null
            : form.departamento_id,

        password_autorizacion:
          passwordAutorizacion.value,

      }


      await $api(
        `/usuarios-administrativos/${usuarioId.value}`,
        {

          method:
            'PATCH',

          body,

        },
      )


      modalAutorizacion.value =
        false

      passwordAutorizacion.value =
        ''

      accionAutorizacion.value =
        ''


      mensajeExito.value =
        'Los datos del usuario se actualizaron correctamente.'


      await cargarUsuario()


    } catch (error) {

      console.error(
        'Error actualizando usuario:',
        error,
      )


      errorAutorizacion.value =
        obtenerMensajeError(
          error,
        ) ||
        'No se pudo autorizar la operación.'


    } finally {

      guardando.value =
        false

    }

  }
// ============================================================
// SOLICITAR AUTORIZACIÓN PARA CAMBIO DE CONTRASEÑA
// ============================================================

    const restablecerPassword =
  async () => {

    errorPassword.value =
      ''

    mensajePassword.value =
      ''

    errorAutorizacion.value =
      ''


    if (
      password.nueva.length <
      8
    ) {

      errorPassword.value =
        'La nueva contraseña debe tener al menos 8 caracteres.'

      return

    }


    if (
      password.nueva !==
      password.confirmacion
    ) {

      errorPassword.value =
        'Las contraseñas no coinciden.'

      return

    }


    accionAutorizacion.value =
      'RESTABLECER_PASSWORD'


    passwordAutorizacion.value =
      ''

    modalAutorizacion.value =
      true


    await nextTick()


    inputPasswordAutorizacion.value
      ?.focus()

  }
// ============================================================
// ACTIVAR / DESACTIVAR
// ============================================================

const cambiarEstado =
  async () => {

    if (
      !usuarioActual.value
    ) {
      return
    }


    if (
      esMiPropiaCuenta.value
    ) {

      errorMensaje.value =
        'No puede desactivar su propia cuenta.'

      return

    }


    const nuevoEstado =
      !usuarioActual.value.activo


    const accion =
      nuevoEstado
        ? 'activar'
        : 'desactivar'


    const confirmado =
      window.confirm(
        `¿Está seguro de ${accion} este usuario?`,
      )


    if (!confirmado) {
      return
    }


    cambiandoEstado.value =
      true

    errorMensaje.value =
      ''

    mensajeExito.value =
      ''


    try {

      await $api(
        `/usuarios-administrativos/${usuarioId.value}/estado`,
        {

          method:
            'PATCH',

          body: {

            activo:
              nuevoEstado,

          },

        },
      )


      mensajeExito.value =
        nuevoEstado
          ? 'Usuario activado correctamente.'
          : 'Usuario desactivado correctamente.'


      await cargarUsuario()


    } catch (error) {

      errorMensaje.value =
        obtenerMensajeError(
          error,
        ) ||
        'No se pudo modificar el estado del usuario.'


    } finally {

      cambiandoEstado.value =
        false

    }

  }


// ============================================================
// ROLES
// ============================================================

const nombreRol =
  (rol) => {

    const nombres = {

      SUPERADMIN:
        'Superadministrador',

      ADMIN_RRHH:
        'Administrador RRHH',

      SUPERVISOR:
        'Supervisor',

    }


    return (
      nombres[rol] ||
      rol ||
      'Sin rol'
    )

  }


const claseRol =
  (rol) => {

    if (
      rol ===
      'SUPERADMIN'
    ) {
      return 'role-superadmin'
    }


    if (
      rol ===
      'ADMIN_RRHH'
    ) {
      return 'role-rrhh'
    }


    if (
      rol ===
      'SUPERVISOR'
    ) {
      return 'role-supervisor'
    }


    return 'role-default'

  }


// ============================================================
// VOLVER
// ============================================================

const volver =
  async () => {

    await navigateTo(
      '/admin/rrhh/usuarios',
    )

  }


// ============================================================
// LOGOUT
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

    authStore
      .cargarSesion()


    if (
      !authStore.estaAutenticado
    ) {

      await navigateTo('/')

      return

    }


    if (
      !esSuperadmin.value
    ) {

      await navigateTo(
        '/admin/rrhh/dashboard',
      )

      return

    }


    await cargarUsuario()

  },
)
</script>


<style scoped>
@import '@/assets/css/dashboard-rrhh.css';
@import '@/assets/css/usuarios-admin.css';
</style>