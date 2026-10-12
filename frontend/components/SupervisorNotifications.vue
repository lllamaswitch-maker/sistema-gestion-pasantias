<template>
  <div
    ref="contenedor"
    class="supervisor-notifications"
  >
    <button
      type="button"
      class="notification-bell"
      title="Notificaciones"
      @click.stop="alternarPanel"
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
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>

      <span
        v-if="cantidadNoLeidas > 0"
        class="notification-counter"
      >
        {{
          cantidadNoLeidas > 99
            ? '99+'
            : cantidadNoLeidas
        }}
      </span>
    </button>

    <div
      v-if="panelAbierto"
      class="notification-panel"
      @click.stop
    >
      <div class="notification-header">
        <div>
          <span>
            Centro de avisos
          </span>

          <h3>
            Notificaciones
          </h3>
        </div>

        <strong v-if="cantidadNoLeidas > 0">
          {{ cantidadNoLeidas }} sin leer
        </strong>
      </div>

      <div
        v-if="cargando"
        class="notification-state"
      >
        Cargando notificaciones...
      </div>

      <div
        v-else-if="errorMensaje"
        class="notification-error"
      >
        {{ errorMensaje }}
      </div>

      <div
        v-else-if="notificacionesVisibles.length === 0"
        class="notification-state"
      >
        No tiene notificaciones registradas.
      </div>

      <div
        v-else
        class="notification-list"
      >
        <button
          v-for="notificacion in notificacionesVisibles"
          :key="notificacion.id"
          type="button"
          class="notification-item"
          :class="{
            unread:
              !notificacion.leida,
          }"
          :disabled="
            marcandoId ===
            notificacion.id
          "
          @click="marcarLeida(notificacion)"
        >
          <span
            v-if="!notificacion.leida"
            class="notification-dot"
          />

          <div class="notification-content">
            <div class="notification-title-row">
              <strong>
                {{ notificacion.titulo }}
              </strong>

              <span>
                {{
                  formatearFecha(
                    notificacion.created_at,
                  )
                }}
              </span>
            </div>

            <p>
              {{ notificacion.mensaje }}
            </p>

            <small v-if="!notificacion.leida">
              {{
                marcandoId === notificacion.id
                  ? 'Marcando...'
                  : 'Nueva notificación'
              }}
            </small>

            <small v-else>
              Leída
            </small>
          </div>
        </button>
      </div>

      <div
        v-if="notificaciones.length > 10"
        class="notification-footer"
      >
        Mostrando las 10 notificaciones más recientes.
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue'

const { $api } =
  useNuxtApp()

const contenedor =
  ref(null)

const panelAbierto =
  ref(false)

const cargando =
  ref(false)

const errorMensaje =
  ref('')

const marcandoId =
  ref(null)

const notificaciones =
  ref([])

const cantidadNoLeidas =
  computed(() => {
    return notificaciones.value.filter(
      item =>
        !item.leida,
    ).length
  })

const notificacionesVisibles =
  computed(() => {
    return notificaciones.value.slice(
      0,
      10,
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
      'No se pudieron cargar las notificaciones.'
    )
  }

const cargarNotificaciones =
  async () => {
    cargando.value =
      true

    errorMensaje.value =
      ''

    try {
      const respuesta =
        await $api(
          '/supervisor/notificaciones',
        )

      notificaciones.value =
        Array.isArray(
          respuesta?.notificaciones,
        )
          ? respuesta.notificaciones
          : []
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

const alternarPanel =
  async () => {
    panelAbierto.value =
      !panelAbierto.value

    if (
      panelAbierto.value
    ) {
      await cargarNotificaciones()
    }
  }

const marcarLeida =
  async notificacion => {
    if (
      !notificacion ||
      notificacion.leida ||
      marcandoId.value
    ) {
      return
    }

    marcandoId.value =
      notificacion.id

    try {
      const respuesta =
        await $api(
          `/supervisor/notificaciones/${notificacion.id}/leida`,
          {
            method: 'PATCH',
          },
        )

      const actualizada =
        respuesta?.notificacion

      notificaciones.value =
        notificaciones.value.map(
          item => {
            if (
              item.id !==
              notificacion.id
            ) {
              return item
            }

            return {
              ...item,
              leida:
                actualizada?.leida ??
                true,

              fecha_leida:
                actualizada?.fecha_leida ??
                new Date().toISOString(),
            }
          },
        )
    } catch (error) {
      errorMensaje.value =
        obtenerMensajeError(
          error,
        )
    } finally {
      marcandoId.value =
        null
    }
  }

const formatearFecha =
  valor => {
    if (!valor) {
      return ''
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

const cerrarExterior =
  event => {
    if (
      contenedor.value &&
      !contenedor.value.contains(
        event.target,
      )
    ) {
      panelAbierto.value =
        false
    }
  }

onMounted(
  async () => {
    await cargarNotificaciones()

    document.addEventListener(
      'click',
      cerrarExterior,
    )
  },
)

onBeforeUnmount(
  () => {
    document.removeEventListener(
      'click',
      cerrarExterior,
    )
  },
)
</script>

<style scoped>
.supervisor-notifications {
  position: relative;
}

.notification-bell {
  position: relative;
  display: flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border: 1px solid #dbe4e1;
  border-radius: 12px;
  background: #ffffff;
  color: #12574c;
  cursor: pointer;
  transition: 0.18s ease;
}

.notification-bell:hover {
  border-color: #9fc5bd;
  background: #f0fdf9;
}

.notification-bell svg {
  width: 21px;
  height: 21px;
}

.notification-counter {
  position: absolute;
  top: -6px;
  right: -6px;
  display: flex;
  min-width: 21px;
  height: 21px;
  padding: 0 5px;
  align-items: center;
  justify-content: center;
  border: 2px solid #ffffff;
  border-radius: 999px;
  background: #dc2626;
  color: #ffffff;
  font-size: 10px;
  font-weight: 900;
}

.notification-panel {
  position: absolute;
  top: 54px;
  right: 0;
  z-index: 100;
  width: 410px;
  max-height: 540px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #ffffff;
  box-shadow:
    0 24px 60px
    rgba(15, 23, 42, 0.18);
}

.notification-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 18px;
  border-bottom: 1px solid #e2e8f0;
}

.notification-header span {
  display: block;
  margin-bottom: 2px;
  color: #94a3b8;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.notification-header h3 {
  margin: 0;
  color: #1e293b;
  font-size: 17px;
  font-weight: 900;
}

.notification-header > strong {
  padding: 5px 9px;
  border-radius: 999px;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 11px;
  font-weight: 800;
}

.notification-list {
  max-height: 410px;
  overflow-y: auto;
}

.notification-item {
  position: relative;
  display: flex;
  width: 100%;
  gap: 12px;
  border: 0;
  border-bottom: 1px solid #f1f5f9;
  background: #ffffff;
  padding: 16px 18px;
  text-align: left;
  cursor: pointer;
}

.notification-item:hover {
  background: #f8fafc;
}

.notification-item.unread {
  background: #f0fdf9;
}

.notification-item.unread:hover {
  background: #e6f8f2;
}

.notification-item:disabled {
  cursor: wait;
}

.notification-dot {
  width: 8px;
  height: 8px;
  flex-shrink: 0;
  margin-top: 6px;
  border-radius: 50%;
  background: #059669;
}

.notification-content {
  min-width: 0;
  flex: 1;
}

.notification-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.notification-title-row strong {
  color: #1e293b;
  font-size: 13px;
  font-weight: 900;
}

.notification-title-row span {
  flex-shrink: 0;
  color: #94a3b8;
  font-size: 10px;
  font-weight: 600;
}

.notification-content p {
  margin: 6px 0;
  color: #64748b;
  font-size: 12px;
  line-height: 1.5;
}

.notification-content small {
  color: #0f766e;
  font-size: 10px;
  font-weight: 800;
}

.notification-state,
.notification-error {
  padding: 35px 20px;
  text-align: center;
  font-size: 12px;
  font-weight: 700;
}

.notification-state {
  color: #64748b;
}

.notification-error {
  color: #b91c1c;
}

.notification-footer {
  padding: 11px 18px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
  color: #94a3b8;
  text-align: center;
  font-size: 10px;
  font-weight: 700;
}

@media (max-width: 600px) {
  .notification-panel {
    position: fixed;
    top: 70px;
    right: 15px;
    left: 15px;
    width: auto;
  }
}
</style>