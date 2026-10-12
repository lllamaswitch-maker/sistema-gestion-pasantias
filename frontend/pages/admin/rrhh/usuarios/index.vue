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


          <!-- ================================================= -->
          <!-- NAVEGACIÓN                                        -->
          <!-- ================================================= -->

          <nav class="space-y-1.5 text-xs font-bold">

            <!-- DASHBOARD -->
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>

              <span>Dashboard</span>
            </NuxtLink>


            <!-- GESTIONAR USUARIOS -->
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
                  d="M17 20h5v-2a4 4 0 00-4-4h-1m-4 6H3v-2a4 4 0 014-4h6a4 4 0 014 4v2zm-3-8a4 4 0 100-8 4 4 0 000 8zm7-1a3 3 0 100-6"
                />
              </svg>

              <span>Gestionar Usuarios</span>
            </NuxtLink>


            <!-- POSTULANTES -->
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


            <!-- PETICIONES -->
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
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5"
                />
              </svg>

              <span>Peticiones Áreas</span>
            </NuxtLink>


            <!-- PASANTES -->
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>

              <span>Pasantes Activos</span>
            </NuxtLink>


            <!-- REPORTES -->
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
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806"
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
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
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
            flex-col
            lg:flex-row
            lg:items-center
            lg:justify-between
            gap-4
            mb-6
          "
        >

          <div>

            <p class="section-label">
              Administración del sistema
            </p>

            <h1
              class="
                text-2xl
                font-black
                text-slate-800
                tracking-tight
              "
            >
              Gestión de Usuarios
            </h1>

            <p
              class="
                text-xs
                text-slate-400
                font-medium
                mt-1
              "
            >
              Administración de accesos, roles y unidades organizacionales.
            </p>

          </div>


          <button
            type="button"
            class="btn-nuevo"
            @click="irNuevoUsuario"
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
                d="M12 4v16m8-8H4"
              />
            </svg>

            Nuevo Usuario
          </button>

        </div>


        <!-- =================================================== -->
        <!-- KPIS                                                -->
        <!-- =================================================== -->

        <section
          class="
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-4
            gap-4
            mb-6
          "
        >

          <div class="summary-card">

            <span class="summary-label">
              Total Usuarios
            </span>

            <strong class="summary-value">
              {{ listaUsuarios.length }}
            </strong>

          </div>


          <div class="summary-card">

            <span class="summary-label">
              Supervisores
            </span>

            <strong class="summary-value">
              {{ totalSupervisores }}
            </strong>

          </div>


          <div class="summary-card">

            <span class="summary-label">
              RRHH
            </span>

            <strong class="summary-value">
              {{ totalRrhh }}
            </strong>

          </div>


          <div class="summary-card">

            <span class="summary-label">
              Usuarios Activos
            </span>

            <strong class="summary-value">
              {{ totalActivos }}
            </strong>

          </div>

        </section>


        <!-- =================================================== -->
        <!-- FILTROS                                             -->
        <!-- =================================================== -->

        <section class="panel-card mb-6">

          <div
            class="
              flex
              items-center
              justify-between
              mb-4
            "
          >
            <div>
              <h2 class="panel-title">
                Buscar usuarios
              </h2>

              <p class="panel-subtitle">
                Filtre por datos personales, rol o estado.
              </p>
            </div>


            <button
              type="button"
              class="btn-secundario"
              :disabled="cargando"
              @click="cargarUsuarios"
            >
              Actualizar
            </button>

          </div>


          <div
            class="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-4
              gap-4
            "
          >

            <!-- BUSCADOR -->
            <div class="xl:col-span-2">

              <label class="form-label">
                Buscar
              </label>

              <input
                v-model="filtroBusqueda"
                type="text"
                class="form-control"
                placeholder="Nombre, C.I. o correo"
              />

            </div>


            <!-- ROL -->
            <div>

              <label class="form-label">
                Rol
              </label>

              <select
                v-model="filtroRol"
                class="form-control"
              >
                <option value="">
                  Todos los roles
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

            </div>


            <!-- ESTADO -->
            <div>

              <label class="form-label">
                Estado
              </label>

              <select
                v-model="filtroEstado"
                class="form-control"
              >
                <option value="">
                  Todos
                </option>

                <option value="ACTIVO">
                  Activos
                </option>

                <option value="INACTIVO">
                  Inactivos
                </option>
              </select>

            </div>

          </div>

        </section>


        <!-- =================================================== -->
        <!-- MENSAJE DE ERROR                                    -->
        <!-- =================================================== -->

        <div
          v-if="errorMensaje"
          class="error-box mb-6"
        >
          {{ errorMensaje }}
        </div>


        <!-- =================================================== -->
        <!-- TABLA                                               -->
        <!-- =================================================== -->

        <section class="panel-card flex-1">

          <div
            class="
              flex
              items-center
              justify-between
              mb-5
            "
          >

            <div>

              <h2 class="panel-title">
                Usuarios administrativos
              </h2>

              <p class="panel-subtitle">
                {{ usuariosFiltrados.length }}
                registro{{
                  usuariosFiltrados.length === 1
                    ? ''
                    : 's'
                }}
              </p>

            </div>

          </div>


          <!-- CARGANDO -->
          <div
            v-if="cargando"
            class="estado-vacio"
          >
            <div class="loader"></div>

            <p>
              Cargando usuarios...
            </p>
          </div>


          <!-- SIN REGISTROS -->
          <div
            v-else-if="usuariosFiltrados.length === 0"
            class="estado-vacio"
          >
            <div class="empty-icon">

              <svg
                class="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H3v-2a4 4 0 014-4h2m3-2a4 4 0 100-8 4 4 0 000 8z"
                />
              </svg>

            </div>

            <p class="font-bold text-slate-600">
              No existen usuarios para mostrar
            </p>

            <p class="text-xs text-slate-400 mt-1">
              Modifique los filtros o registre un nuevo usuario.
            </p>
          </div>


          <!-- TABLA -->
          <div
            v-else
            class="overflow-x-auto"
          >

            <table class="users-table">

              <thead>
                <tr>

                  <th>
                    Usuario
                  </th>

                  <th>
                    C.I.
                  </th>

                  <th>
                    Rol
                  </th>

                  <th>
                    Gerencia / Departamento
                  </th>

                  <th>
                    Estado
                  </th>

                  <th class="text-right">
                    Acciones
                  </th>

                </tr>
              </thead>


              <tbody>

                <tr
                  v-for="usuario in usuariosFiltrados"
                  :key="usuario.id"
                >

                  <!-- USUARIO -->
                  <td>

                    <div class="flex items-center gap-3">

                      <div class="user-avatar">
                        {{
                          obtenerIniciales(
                            usuario,
                          )
                        }}
                      </div>

                      <div>

                        <p
                          class="
                            text-xs
                            font-black
                            text-slate-800
                          "
                        >
                          {{
                            usuario.nombres
                          }}
                          {{
                            usuario.apellidos
                          }}
                        </p>

                        <p
                          class="
                            text-[10px]
                            text-slate-400
                            mt-0.5
                          "
                        >
                          {{
                            usuario.email
                          }}
                        </p>

                        <p
                          class="
                            text-[10px]
                            text-slate-500
                            mt-0.5
                          "
                        >
                          {{
                            usuario.cargo
                          }}
                        </p>

                      </div>

                    </div>

                  </td>


                  <!-- CI -->
                  <td>
                    <span class="dato-mono">
                      {{
                        usuario.ci ||
                        'S/D'
                      }}
                    </span>
                  </td>


                  <!-- ROL -->
                  <td>

                    <span
                      class="role-badge"
                      :class="
                        claseRol(
                          usuario.rol,
                        )
                      "
                    >
                      {{
                        nombreRol(
                          usuario.rol,
                        )
                      }}
                    </span>

                  </td>


                  <!-- ORGANIZACIÓN -->
                  <td>

                    <template
                      v-if="usuario.departamentos"
                    >

                      <p
                        class="
                          text-[11px]
                          font-bold
                          text-slate-700
                        "
                      >
                        {{
                          usuario
                            .departamentos
                            ?.gerencias
                            ?.nombre ||
                          'Sin gerencia'
                        }}
                      </p>

                      <p
                        class="
                          text-[10px]
                          text-slate-400
                          mt-1
                        "
                      >
                        {{
                          usuario
                            .departamentos
                            ?.nombre ||
                          'Sin departamento'
                        }}
                      </p>

                    </template>


                    <template v-else>

                      <p
                        class="
                          text-[11px]
                          text-slate-400
                          font-medium
                        "
                      >
                        Administración general
                      </p>

                    </template>

                  </td>


                  <!-- ESTADO -->
                  <td>

                    <span
                      class="status-badge"
                      :class="
                        usuario.activo
                          ? 'status-active'
                          : 'status-inactive'
                      "
                    >
                      {{
                        usuario.activo
                          ? 'ACTIVO'
                          : 'INACTIVO'
                      }}
                    </span>

                  </td>


                  <!-- ACCIONES -->
                  <td>

                    <div
                      class="
                        flex
                        items-center
                        justify-end
                        gap-2
                      "
                    >

                      <button
                        type="button"
                        class="table-action"
                        @click="
                          editarUsuario(
                            usuario.id,
                          )
                        "
                      >
                        Editar
                      </button>


                      <button
                        type="button"
                        class="table-action"
                        @click="
                          cambiarEstado(
                            usuario,
                          )
                        "
                      >
                        {{
                          usuario.activo
                            ? 'Desactivar'
                            : 'Activar'
                        }}
                      </button>

                    </div>

                  </td>

                </tr>

              </tbody>

            </table>

          </div>

        </section>

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
  ref,
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
// ESTADO
// ============================================================

const listaUsuarios =
  ref([])

const cargando =
  ref(true)

const errorMensaje =
  ref('')


// ============================================================
// FILTROS
// ============================================================

const filtroBusqueda =
  ref('')

const filtroRol =
  ref('')

const filtroEstado =
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
// KPIS
// ============================================================

const totalSupervisores =
  computed(() => {

    return listaUsuarios
      .value
      .filter(
        (usuario) =>
          usuario.rol ===
          'SUPERVISOR',
      )
      .length

  })


const totalRrhh =
  computed(() => {

    return listaUsuarios
      .value
      .filter(
        (usuario) =>
          usuario.rol ===
          'ADMIN_RRHH',
      )
      .length

  })


const totalActivos =
  computed(() => {

    return listaUsuarios
      .value
      .filter(
        (usuario) =>
          usuario.activo === true,
      )
      .length

  })


// ============================================================
// FILTRADO
// ============================================================

const usuariosFiltrados =
  computed(() => {

    const busqueda =
      filtroBusqueda
        .value
        .trim()
        .toLowerCase()


    return listaUsuarios
      .value
      .filter((usuario) => {

        // ----------------------------------------
        // BÚSQUEDA GENERAL
        // ----------------------------------------

        const textoUsuario = [
          usuario.ci,
          usuario.nombres,
          usuario.apellidos,
          usuario.email,
          usuario.cargo,
          usuario
            .departamentos
            ?.nombre,
          usuario
            .departamentos
            ?.gerencias
            ?.nombre,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()


        const coincideBusqueda =
          busqueda
            ? textoUsuario
                .includes(
                  busqueda,
                )
            : true


        // ----------------------------------------
        // ROL
        // ----------------------------------------

        const coincideRol =
          filtroRol.value
            ? usuario.rol ===
              filtroRol.value
            : true


        // ----------------------------------------
        // ESTADO
        // ----------------------------------------

        let coincideEstado =
          true


        if (
          filtroEstado.value ===
          'ACTIVO'
        ) {

          coincideEstado =
            usuario.activo ===
            true

        }


        if (
          filtroEstado.value ===
          'INACTIVO'
        ) {

          coincideEstado =
            usuario.activo ===
            false

        }


        return (
          coincideBusqueda &&
          coincideRol &&
          coincideEstado
        )

      })

  })


// ============================================================
// CARGAR USUARIOS
// ============================================================

const cargarUsuarios =
  async () => {

    cargando.value =
      true

    errorMensaje.value =
      ''


    try {

      const respuesta =
        await $api(
          '/usuarios-administrativos',
        )


      listaUsuarios.value =
        Array.isArray(
          respuesta,
        )
          ? respuesta
          : []


    } catch (error) {

      console.error(
        'Error al cargar usuarios:',
        error,
      )


      const mensaje =
        Array.isArray(
          error?.data?.message,
        )
          ? error
              .data
              .message
              .join(', ')
          : error
              ?.data
              ?.message


      errorMensaje.value =
        mensaje ||
        error?.message ||
        'No se pudieron cargar los usuarios administrativos.'

    } finally {

      cargando.value =
        false

    }

  }


// ============================================================
// ACTIVAR / DESACTIVAR
// ============================================================

const cambiarEstado =
  async (usuario) => {

    if (!usuario?.id) {
      return
    }


    const nuevoEstado =
      !usuario.activo


    const accion =
      nuevoEstado
        ? 'activar'
        : 'desactivar'


    const confirmado =
      window.confirm(
        `¿Desea ${accion} al usuario ${usuario.nombres} ${usuario.apellidos}?`,
      )


    if (!confirmado) {
      return
    }


    try {

      await $api(
        `/usuarios-administrativos/${usuario.id}/estado`,
        {

          method:
            'PATCH',

          body: {
            activo:
              nuevoEstado,
          },

        },
      )


      await cargarUsuarios()


    } catch (error) {

      const mensaje =
        Array.isArray(
          error?.data?.message,
        )
          ? error
              .data
              .message
              .join(', ')
          : error
              ?.data
              ?.message


      alert(
        mensaje ||
        error?.message ||
        'No se pudo modificar el estado del usuario.',
      )

    }

  }


// ============================================================
// NAVEGACIÓN
// ============================================================

const irNuevoUsuario =
  async () => {

    await navigateTo(
      '/admin/rrhh/usuarios/nuevo',
    )

  }


const editarUsuario =
  async (id) => {

    if (!id) {
      return
    }


    await navigateTo(
      `/admin/rrhh/usuarios/${id}`,
    )

  }


// ============================================================
// FORMATOS
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


const obtenerIniciales =
  (usuario) => {

    const nombre =
      String(
        usuario?.nombres ||
        '',
      )
        .trim()
        .charAt(0)


    const apellido =
      String(
        usuario?.apellidos ||
        '',
      )
        .trim()
        .charAt(0)


    return (
      `${nombre}${apellido}`
        .toUpperCase() ||
      'U'
    )

  }


// ============================================================
// SESIÓN
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


    await cargarUsuarios()

  },
)
</script>


<style scoped>
@import '@/assets/css/dashboard-rrhh.css';
@import '@/assets/css/usuarios-admin.css';
</style>