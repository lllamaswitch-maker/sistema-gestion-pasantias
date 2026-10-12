<template>
  <div class="dashboard-wrapper font-sans text-slate-700">

    <div class="dashboard-canvas">

      <!-- ===================================================== -->
      <!-- SIDEBAR                                               -->
      <!-- ===================================================== -->

      <aside class="sidebar-corporate">

        <div>

          <!-- PERFIL -->
          <div class="flex flex-col items-center text-center mt-2 mb-8">

            <div class="avatar-container mb-3">
              <img
                src="/tele_img.jpeg"
                alt="Logo Mi Teleférico"
                class="w-full h-full object-cover rounded-full"
              />
            </div>

            <h2
              class="
                text-xs
                font-black
                tracking-widest
                uppercase
                text-white
              "
            >
              {{
                authStore.usuario?.nombres ||
                'ADMINISTRADOR'
              }}
            </h2>

            <p
              class="
                text-[10px]
                text-emerald-200
                font-mono
                mt-0.5
              "
            >
              {{
                authStore.usuario?.email ||
                'admin@miteleferico.bo'
              }}
            </p>

            <span class="superadmin-badge">
              SUPERADMIN
            </span>

          </div>


          <!-- NAVEGACIÓN -->
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3"
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
        class="
          flex-1
          flex
          flex-col
          p-6
          sm:p-8
          overflow-y-auto
        "
      >

        <!-- CABECERA -->
        <div
          class="
            flex
            items-start
            justify-between
            gap-4
            mb-6
          "
        >

          <div>

            <p class="section-label">
              Gestión de usuarios
            </p>

            <h1
              class="
                text-2xl
                font-black
                text-slate-800
                tracking-tight
              "
            >
              Registrar Nuevo Usuario
            </h1>

            <p
              class="
                text-xs
                text-slate-400
                font-medium
                mt-1
              "
            >
              Registre un usuario administrativo y asigne su rol institucional.
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


        <!-- =================================================== -->
        <!-- MENSAJES                                            -->
        <!-- =================================================== -->

        <div
          v-if="errorMensaje"
          class="error-box mb-5"
        >
          {{ errorMensaje }}
        </div>


        <div
          v-if="mensajeExito"
          class="success-box mb-5"
        >
          {{ mensajeExito }}
        </div>


        <!-- =================================================== -->
        <!-- FORMULARIO                                          -->
        <!-- =================================================== -->

        <form
          class="panel-card usuario-form"
          @submit.prevent="guardarUsuario"
        >

          <!-- DATOS PERSONALES -->
          <div class="form-section">

            <div class="form-section-header">

              <div>

                <h2 class="panel-title">
                  Datos personales
                </h2>

                <p class="panel-subtitle">
                  Información básica de identificación del usuario.
                </p>

              </div>

              <span class="section-number">
                01
              </span>

            </div>


            <div
              class="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-5
              "
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
                  placeholder="Ej.: 12345678"
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
                  placeholder="Ej.: Profesional de área"
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
                  placeholder="Nombres"
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
                  placeholder="Apellidos"
                  maxlength="150"
                />

              </div>


              <!-- CORREO -->
              <div class="md:col-span-2">

                <label class="form-label">
                  Correo electrónico *
                </label>

                <input
                  v-model.trim="form.email"
                  type="email"
                  class="form-control"
                  placeholder="usuario@miteleferico.bo"
                  maxlength="200"
                />

              </div>

            </div>

          </div>


          <!-- ================================================= -->
          <!-- ROL Y UNIDAD ORGANIZACIONAL                       -->
          <!-- ================================================= -->

          <div class="form-section">

            <div class="form-section-header">

              <div>

                <h2 class="panel-title">
                  Rol y unidad organizacional
                </h2>

                <p class="panel-subtitle">
                  Defina los permisos y la ubicación organizacional.
                </p>

              </div>

              <span class="section-number">
                02
              </span>

            </div>


            <div
              class="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-5
              "
            >

              <!-- ROL -->
              <div class="md:col-span-2">

                <label class="form-label">
                  Rol *
                </label>

                <select
                  v-model="form.rol"
                  class="form-control"
                >
                  <option value="">
                    Seleccione un rol
                  </option>

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
                  v-if="form.rol === 'SUPERADMIN'"
                  class="form-help"
                >
                  El Superadministrador puede registrarse sin departamento específico.
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
                    cargandoGerencias ||
                    form.rol === 'SUPERADMIN'
                  "
                >
                  <option value="">
                    {{
                      cargandoGerencias
                        ? 'Cargando gerencias...'
                        : 'Seleccione una gerencia'
                    }}
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
                    !form.gerencia_id ||
                    cargandoDepartamentos ||
                    form.rol === 'SUPERADMIN'
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


          <!-- ================================================= -->
          <!-- CREDENCIALES                                      -->
          <!-- ================================================= -->

          <div class="form-section">

            <div class="form-section-header">

              <div>

                <h2 class="panel-title">
                  Credenciales de acceso
                </h2>

                <p class="panel-subtitle">
                  Defina la contraseña inicial para el nuevo usuario.
                </p>

              </div>

              <span class="section-number">
                03
              </span>

            </div>


            <div
              class="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-5
              "
            >

              <!-- CONTRASEÑA -->
              <div>

                <label class="form-label">
                  Contraseña *
                </label>

                <input
                  v-model="form.password"
                  type="password"
                  class="form-control"
                  placeholder="Mínimo 8 caracteres"
                  autocomplete="new-password"
                />

              </div>


              <!-- CONFIRMAR -->
              <div>

                <label class="form-label">
                  Confirmar contraseña *
                </label>

                <input
                  v-model="form.confirmarPassword"
                  type="password"
                  class="form-control"
                  placeholder="Repita la contraseña"
                  autocomplete="new-password"
                />

              </div>

            </div>

          </div>


          <!-- ================================================= -->
          <!-- ACCIONES                                          -->
          <!-- ================================================= -->

          <div class="form-actions">

            <button
              type="button"
              class="btn-cancelar"
              :disabled="guardando"
              @click="volver"
            >
              Cancelar
            </button>


            <button
              type="submit"
              class="btn-guardar"
              :disabled="guardando"
            >
              {{
                guardando
                  ? 'Guardando...'
                  : 'Registrar Usuario'
              }}
            </button>

          </div>

        </form>

      </main>

    </div>

  </div>
</template>


<script setup>
definePageMeta({
  middleware: 'admin',
})


import {
  computed,
  onMounted,
  reactive,
  ref,
  watch,
} from 'vue'


import {
  useAuthStore,
} from '@/stores/auth'


const authStore =
  useAuthStore()


const {
  $api,
} = useNuxtApp()


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

    password:
      '',

    confirmarPassword:
      '',

  })


// ============================================================
// ESTADO
// ============================================================

const listaGerencias =
  ref([])


const listaDepartamentos =
  ref([])


const cargandoGerencias =
  ref(false)


const cargandoDepartamentos =
  ref(false)


const guardando =
  ref(false)


const errorMensaje =
  ref('')


const mensajeExito =
  ref('')


// ============================================================
// PERMISOS
// ============================================================

const esSuperadmin =
  computed(() => {

    return (
      authStore
        .usuario
        ?.rol ===
      'SUPERADMIN'
    )

  })


// ============================================================
// REGLAS DEL FORMULARIO
// ============================================================

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
// CARGAR GERENCIAS
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


    } catch (error) {

      console.error(
        'Error cargando gerencias:',
        error,
      )


      const mensaje =
        obtenerMensajeError(
          error,
        )


      errorMensaje.value =
        mensaje ||
        'No se pudieron cargar las gerencias.'

    } finally {

      cargandoGerencias.value =
        false

    }

  }


// ============================================================
// CARGAR DEPARTAMENTOS
// ============================================================

const cargarDepartamentos =
  async () => {

    listaDepartamentos.value =
      []

    form.departamento_id =
      ''


    if (
      !form.gerencia_id ||
      form.rol ===
        'SUPERADMIN'
    ) {

      return

    }


    cargandoDepartamentos.value =
      true


    try {

      const respuesta =
        await $api(
          `/organizacion/gerencias/${form.gerencia_id}/departamentos`,
        )


      listaDepartamentos.value =
        Array.isArray(
          respuesta?.departamentos,
        )
          ? respuesta.departamentos
          : []


    } catch (error) {

      console.error(
        'Error cargando departamentos:',
        error,
      )


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
// CUANDO CAMBIA LA GERENCIA
// ============================================================

watch(
  () =>
    form.gerencia_id,

  async () => {

    await cargarDepartamentos()

  },
)


// ============================================================
// CUANDO CAMBIA EL ROL
// ============================================================

watch(
  () =>
    form.rol,

  (nuevoRol) => {

    errorMensaje.value =
      ''


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
// VALIDAR FORMULARIO
// ============================================================

const validarFormulario =
  () => {

    errorMensaje.value =
      ''


    if (
      !form.ci.trim()
    ) {

      errorMensaje.value =
        'Debe ingresar el C.I.'

      return false

    }


    if (
      !form.nombres.trim()
    ) {

      errorMensaje.value =
        'Debe ingresar los nombres.'

      return false

    }


    if (
      !form.apellidos.trim()
    ) {

      errorMensaje.value =
        'Debe ingresar los apellidos.'

      return false

    }


    if (
      !form.email.trim()
    ) {

      errorMensaje.value =
        'Debe ingresar el correo electrónico.'

      return false

    }


    if (
      !form.cargo.trim()
    ) {

      errorMensaje.value =
        'Debe ingresar el cargo.'

      return false

    }


    if (
      !form.rol
    ) {

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


    if (
      form.password.length <
      8
    ) {

      errorMensaje.value =
        'La contraseña debe tener al menos 8 caracteres.'

      return false

    }


    if (
      form.password !==
      form.confirmarPassword
    ) {

      errorMensaje.value =
        'Las contraseñas no coinciden.'

      return false

    }


    return true

  }


// ============================================================
// GUARDAR USUARIO
// ============================================================

const guardarUsuario =
  async () => {

    if (
      !validarFormulario()
    ) {

      return

    }


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

        password:
          form.password,

      }


      await $api(
        '/usuarios-administrativos',
        {

          method:
            'POST',

          body,

        },
      )


      mensajeExito.value =
        'Usuario administrativo registrado correctamente.'


      setTimeout(
        async () => {

          await navigateTo(
            '/admin/rrhh/usuarios',
          )

        },
        900,
      )


    } catch (error) {

      console.error(
        'Error registrando usuario:',
        error,
      )


      errorMensaje.value =
        obtenerMensajeError(
          error,
        ) ||
        'No se pudo registrar el usuario.'

    } finally {

      guardando.value =
        false

    }

  }


// ============================================================
// MENSAJE DE ERROR
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
      error
        ?.data
        ?.message ||
      error
        ?.message ||
      ''
    )

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

    authStore
      .cargarSesion()


    if (
      !authStore
        .estaAutenticado
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


    await cargarGerencias()

  },
)
</script>


<style scoped>
@import '@/assets/css/dashboard-rrhh.css';
@import '@/assets/css/usuarios-admin.css';
</style>