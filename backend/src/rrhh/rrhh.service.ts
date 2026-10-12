import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  estado_pasante_activo_enum,
  estado_postulacion_enum,
  estado_solicitud_pasante_enum,
  Prisma,
  rol_usuario_enum,
  turno_disponibilidad_enum,
} from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import {
  ActualizarControlAdministrativoDto,
} from './dto/actualizar-control-administrativo.dto';



@Injectable()
export class RrhhService {

  constructor(
    private readonly prisma:
      PrismaService,
  ) {}


  // ============================================================
  // RRHH - OBTENER PETICIONES DE ÁREA
  // ============================================================

  async obtenerPeticiones() {

    // ==========================================================
    // 1. OBTENER DEPARTAMENTOS ACTIVOS
    // ==========================================================

    const departamentos =
      await this.prisma
        .departamentos
        .findMany({

          where: {
            activo: true,
          },

          select: {
            id: true,
            nombre: true,

            gerencias: {
              select: {
                id: true,
                nombre: true,
              },
            },
          },

          orderBy: {
            nombre: 'asc',
          },

        });


    // ==========================================================
    // 2. CONTAR PETICIONES PENDIENTES POR DEPARTAMENTO
    // ==========================================================

    const conteosPendientes =
      await this.prisma
        .solicitudes_pasante_supervisor
        .groupBy({

          by: [
            'departamento_id',
          ],

          where: {
            estado:
              estado_solicitud_pasante_enum
                .PENDIENTE_RRHH,
          },

          _count: {
            _all: true,
          },

        });


    const mapaPendientes =
      new Map<string, number>();


    for (
      const item
      of conteosPendientes
    ) {

      mapaPendientes.set(
        item.departamento_id,
        item._count._all,
      );
    }


    // ==========================================================
    // 3. OBTENER TODAS LAS PETICIONES
    //
    // Se devuelven todos los estados porque el frontend tendrá:
    //
    // - Pendientes de revisión
    // - Historial
    // ==========================================================

    const solicitudes =
      await this.prisma
        .solicitudes_pasante_supervisor
        .findMany({

          include: {

            // --------------------------------------------------
            // SUPERVISOR QUE REALIZÓ LA PETICIÓN
            // --------------------------------------------------

            usuarios_administrativos: {

              select: {
                id: true,
                nombres: true,
                apellidos: true,
                email: true,
                cargo: true,
                rol: true,
                activo: true,
              },

            },


            // --------------------------------------------------
            // DEPARTAMENTO Y GERENCIA
            // --------------------------------------------------

            departamentos: {

              select: {
                id: true,
                nombre: true,

                gerencias: {

                  select: {
                    id: true,
                    nombre: true,
                  },

                },
              },

            },


            // --------------------------------------------------
            // POSTULACIÓN Y POSTULANTE
            // --------------------------------------------------

            postulaciones: {

              include: {

                estados_postulacion:
                  true,


                postulantes: {

                  include: {

                    formacion_academica_postulante:
                      true,

                    disponibilidad_horaria_postulante:
                      true,

                  },

                },

              },

            },

          },

          orderBy: {
            created_at:
              'desc',
          },

        });


    // ==========================================================
    // 4. FORMATEAR PETICIONES PARA EL FRONTEND
    // ==========================================================

    const peticiones =
      solicitudes.map(
        solicitud => {

          const postulante =
            solicitud
              .postulaciones
              .postulantes;


          const formacion =
            postulante
              .formacion_academica_postulante?.[0]
            ?? null;


          const disponibilidad =
            postulante
              .disponibilidad_horaria_postulante
            ?? null;


          const nombreCompleto =
            [
              postulante.nombres,
              postulante.apellido_paterno,
              postulante.apellido_materno,
            ]
              .filter(Boolean)
              .join(' ');


          const nombreSupervisor =
            [
              solicitud
                .usuarios_administrativos
                .nombres,

              solicitud
                .usuarios_administrativos
                .apellidos,
            ]
              .filter(Boolean)
              .join(' ');


          return {

            // --------------------------------------------------
            // PETICIÓN
            // --------------------------------------------------

            id:
              solicitud.id,

            estado:
              solicitud.estado,

            actividades_pasante:
              solicitud.actividades_pasante,

            respuesta_rrhh:
              solicitud.respuesta_rrhh,

            motivo_cancelacion:
              solicitud.motivo_cancelacion,

            fecha_solicitud:
              solicitud.created_at,

            fecha_resolucion:
              solicitud.fecha_resolucion,

            fecha_cancelacion:
              solicitud.fecha_cancelacion,


            // --------------------------------------------------
            // SUPERVISOR
            // --------------------------------------------------

            supervisor: {

              id:
                solicitud
                  .usuarios_administrativos
                  .id,

              nombre_completo:
                nombreSupervisor,

              email:
                solicitud
                  .usuarios_administrativos
                  .email,

              cargo:
                solicitud
                  .usuarios_administrativos
                  .cargo,

            },


            // --------------------------------------------------
            // ESTRUCTURA ORGANIZACIONAL
            // --------------------------------------------------

            departamento: {

              id:
                solicitud
                  .departamentos
                  .id,

              nombre:
                solicitud
                  .departamentos
                  .nombre,

            },


            gerencia: {

              id:
                solicitud
                  .departamentos
                  .gerencias
                  .id,

              nombre:
                solicitud
                  .departamentos
                  .gerencias
                  .nombre,

            },


            // --------------------------------------------------
            // POSTULACIÓN
            // --------------------------------------------------

            postulacion: {

              id:
                solicitud.postulacion_id,

              numero_intento:
                solicitud
                  .postulaciones
                  .numero_intento,

              estado_actual:
                solicitud
                  .postulaciones
                  .estados_postulacion
                  ?.estado_actual
                ?? null,

            },


            // --------------------------------------------------
            // POSTULANTE
            // --------------------------------------------------

            postulante: {

              id:
                postulante.id,

              nombre_completo:
                nombreCompleto,

              ci:
                postulante.ci,

              expedido:
                postulante.expedido,

            },


            // --------------------------------------------------
            // INFORMACIÓN ACADÉMICA
            // --------------------------------------------------

            formacion: formacion
              ? {

                  institucion:
                    formacion
                      .institucion_nombre,

                  carrera:
                    formacion
                      .carrera,

                  semestre_o_nivel:
                    formacion
                      .semestre_o_nivel,

                  modalidad:
                    formacion
                      .modalidad_postulacion,

                }
              : null,


            // --------------------------------------------------
            // DISPONIBILIDAD
            // --------------------------------------------------

            turno:
              disponibilidad
                ?.turno
              ?? null,


            // --------------------------------------------------
            // ACCIONES QUE RRHH PUEDE REALIZAR
            // --------------------------------------------------

            puede_revisar:
              solicitud.estado ===
              estado_solicitud_pasante_enum
                .PENDIENTE_RRHH,

          };

        },
      );


    // ==========================================================
    // 5. CARPETAS DE DEPARTAMENTOS
    // ==========================================================

    const carpetas =
      departamentos.map(
        departamento => ({

          id:
            departamento.id,

          nombre:
            departamento.nombre,

          gerencia: {
            id:
              departamento
                .gerencias
                .id,

            nombre:
              departamento
                .gerencias
                .nombre,
          },

          pendientes:
            mapaPendientes.get(
              departamento.id,
            ) ?? 0,

        }),
      );


    // ==========================================================
    // 6. RESUMEN GENERAL
    // ==========================================================

    const pendientes =
      solicitudes.filter(
        solicitud =>
          solicitud.estado ===
          estado_solicitud_pasante_enum
            .PENDIENTE_RRHH,
      ).length;


    const aprobadas =
      solicitudes.filter(
        solicitud =>
          solicitud.estado ===
          estado_solicitud_pasante_enum
            .APROBADA,
      ).length;


    const rechazadas =
      solicitudes.filter(
        solicitud =>
          solicitud.estado ===
          estado_solicitud_pasante_enum
            .RECHAZADA,
      ).length;


    const canceladas =
      solicitudes.filter(
        solicitud =>
          solicitud.estado ===
          estado_solicitud_pasante_enum
            .CANCELADA,
      ).length;


    // ==========================================================
    // RESPUESTA
    // ==========================================================

    return {

      resumen: {

        total:
          solicitudes.length,

        pendientes,

        aprobadas,

        rechazadas,

        canceladas,

      },


      carpetas: [

        {
          id: 'TODAS',
          nombre: 'Todas',
          gerencia: null,
          pendientes,
        },

        ...carpetas,

      ],


      peticiones,

    };
  }
  async aprobarPeticion(
  administrativoId: string,
  solicitudId: string,
) {

  return this.prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {

      const solicitud =
        await tx.solicitudes_pasante_supervisor.findUnique({
          where: {
            id: solicitudId,
          },

          include: {
            usuarios_administrativos: true,

            postulaciones: {
              include: {
                estados_postulacion: true,
                postulantes: true,
              },
            },

            departamentos: true,
          },
        });


      if (!solicitud) {
        throw new NotFoundException(
          'La petición indicada no existe.',
        );
      }


      if (
        solicitud.estado !==
        estado_solicitud_pasante_enum.PENDIENTE_RRHH
      ) {
        throw new ConflictException(
          'La petición ya fue procesada.',
        );
      }


      if (
        solicitud.postulaciones
          .estados_postulacion
          ?.estado_actual !==
        estado_postulacion_enum.SELECCIONADO_POR_AREA
      ) {
        throw new ConflictException(
          'La postulación ya no se encuentra seleccionada por un área.',
        );
      }


      const ahora = new Date();


      const actualizacion =
        await tx.solicitudes_pasante_supervisor.updateMany({
          where: {
            id: solicitudId,
            estado:
              estado_solicitud_pasante_enum.PENDIENTE_RRHH,
          },

          data: {
            estado:
              estado_solicitud_pasante_enum.APROBADA,

            respuesta_rrhh:
              'Petición aprobada por Talento Humano. Pendiente de contacto con el postulante.',

            fecha_resolucion:
              ahora,

            updated_at:
              ahora,
          },
        });


      if (actualizacion.count !== 1) {
        throw new ConflictException(
          'La petición fue procesada por otro usuario.',
        );
      }


      const postulante =
        solicitud.postulaciones.postulantes;

      const nombrePostulante =
        [
          postulante.nombres,
          postulante.apellido_paterno,
          postulante.apellido_materno,
        ]
          .filter(Boolean)
          .join(' ');


      await tx.notificaciones_administrativas.create({
        data: {
          usuario_administrativo_id:
            solicitud.supervisor_id,

          solicitud_pasante_id:
            solicitud.id,

          tipo:
            'PETICION_APROBADA',

          titulo:
            'Petición de pasante aprobada',

          mensaje:
            `Talento Humano aprobó la petición para ${nombrePostulante}. El siguiente paso es contactar al postulante para confirmar su participación en la entrevista.`,
        },
      });


      await tx.auditoria_logs.create({
        data: {
          administrativo_id:
            administrativoId,

          accion:
            'APROBAR_PETICION_PASANTE',

          tabla_afectada:
            'solicitudes_pasante_supervisor',

          registro_id:
            solicitud.id,

          detalles: {
            postulacion_id:
              solicitud.postulacion_id,

            supervisor_id:
              solicitud.supervisor_id,

            departamento_id:
              solicitud.departamento_id,

            estado_anterior:
              'PENDIENTE_RRHH',

            estado_nuevo:
              'APROBADA',
          },
        },
      });


      return {
        message:
          'Petición aprobada correctamente.',

        solicitud_id:
          solicitud.id,

        estado:
          estado_solicitud_pasante_enum.APROBADA,

        siguiente_etapa:
          'CONTACTAR_POSTULANTE',
      };
    },
  );
}
async rechazarPeticion(
  administrativoId: string,
  solicitudId: string,
  motivo: string,
) {

  const motivoLimpio =
    String(motivo ?? '').trim();


  if (!motivoLimpio) {
    throw new BadRequestException(
      'Debe indicar el motivo del rechazo.',
    );
  }


  if (motivoLimpio.length > 1000) {
    throw new BadRequestException(
      'El motivo del rechazo no puede superar los 1000 caracteres.',
    );
  }


  return this.prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {

      const solicitud =
        await tx.solicitudes_pasante_supervisor.findUnique({
          where: {
            id: solicitudId,
          },

          include: {
            usuarios_administrativos: true,

            postulaciones: {
              include: {
                estados_postulacion: true,
                postulantes: true,
              },
            },

            departamentos: true,
          },
        });


      if (!solicitud) {
        throw new NotFoundException(
          'La petición indicada no existe.',
        );
      }


      if (
        solicitud.estado !==
        estado_solicitud_pasante_enum.PENDIENTE_RRHH
      ) {
        throw new ConflictException(
          'La petición ya fue procesada.',
        );
      }


      if (
        solicitud.postulaciones
          .estados_postulacion
          ?.estado_actual !==
        estado_postulacion_enum.SELECCIONADO_POR_AREA
      ) {
        throw new ConflictException(
          'La postulación ya no se encuentra seleccionada por un área.',
        );
      }


      const ahora = new Date();


      const actualizacion =
        await tx.solicitudes_pasante_supervisor.updateMany({
          where: {
            id: solicitudId,
            estado:
              estado_solicitud_pasante_enum.PENDIENTE_RRHH,
          },

          data: {
            estado:
              estado_solicitud_pasante_enum.RECHAZADA,

            respuesta_rrhh:
              motivoLimpio,

            fecha_resolucion:
              ahora,

            updated_at:
              ahora,
          },
        });


      if (actualizacion.count !== 1) {
        throw new ConflictException(
          'La petición fue procesada por otro usuario.',
        );
      }


      const cambioEstado =
        await tx.estados_postulacion.updateMany({
          where: {
            postulacion_id:
              solicitud.postulacion_id,

            estado_actual:
              estado_postulacion_enum
                .SELECCIONADO_POR_AREA,
          },

          data: {
            estado_actual:
              estado_postulacion_enum.APROBADO,

            observaciones_rrhh:
              `Petición del área rechazada por Talento Humano. Motivo: ${motivoLimpio}`,

            fecha_ultimo_cambio:
              ahora,
          },
        });


      if (cambioEstado.count !== 1) {
        throw new ConflictException(
          'No se pudo devolver al postulante al estado APROBADO.',
        );
      }


      const postulante =
        solicitud.postulaciones.postulantes;

      const nombrePostulante =
        [
          postulante.nombres,
          postulante.apellido_paterno,
          postulante.apellido_materno,
        ]
          .filter(Boolean)
          .join(' ');


      await tx.notificaciones_administrativas.create({
        data: {
          usuario_administrativo_id:
            solicitud.supervisor_id,

          solicitud_pasante_id:
            solicitud.id,

          tipo:
            'PETICION_RECHAZADA',

          titulo:
            'Petición de pasante rechazada',

          mensaje:
            `La petición para ${nombrePostulante} fue rechazada por Talento Humano. Motivo: ${motivoLimpio}`,
        },
      });


      await tx.auditoria_logs.create({
        data: {
          administrativo_id:
            administrativoId,

          accion:
            'RECHAZAR_PETICION_PASANTE',

          tabla_afectada:
            'solicitudes_pasante_supervisor',

          registro_id:
            solicitud.id,

          detalles: {
            postulacion_id:
              solicitud.postulacion_id,

            supervisor_id:
              solicitud.supervisor_id,

            departamento_id:
              solicitud.departamento_id,

            motivo:
              motivoLimpio,

            estado_anterior:
              'PENDIENTE_RRHH',

            estado_nuevo:
              'RECHAZADA',
          },
        },
      });


      return {
        message:
          'Petición rechazada correctamente.',

        solicitud_id:
          solicitud.id,

        estado:
          estado_solicitud_pasante_enum.RECHAZADA,

        postulacion_estado:
          estado_postulacion_enum.APROBADO,
      };
    },
  );
}
async confirmarEntrevista(
  administrativoId: string,
  solicitudId: string,
) {

  return this.prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {

      const solicitud =
        await tx.solicitudes_pasante_supervisor.findUnique({
          where: {
            id: solicitudId,
          },

          include: {
            postulaciones: {
              include: {
                estados_postulacion: true,
                postulantes: true,
              },
            },
          },
        });


      if (!solicitud) {
        throw new NotFoundException(
          'La petición indicada no existe.',
        );
      }


      if (
        solicitud.estado !==
        estado_solicitud_pasante_enum.APROBADA
      ) {
        throw new BadRequestException(
          'La petición todavía no se encuentra aprobada por Talento Humano.',
        );
      }


      if (
        solicitud.postulaciones
          .estados_postulacion
          ?.estado_actual !==
        estado_postulacion_enum.SELECCIONADO_POR_AREA
      ) {
        throw new ConflictException(
          'El postulante ya no se encuentra pendiente de confirmación para entrevista.',
        );
      }


      const ahora = new Date();


      const cambio =
        await tx.estados_postulacion.updateMany({
          where: {
            postulacion_id:
              solicitud.postulacion_id,

            estado_actual:
              estado_postulacion_enum.SELECCIONADO_POR_AREA,
          },

          data: {
            estado_actual:
              estado_postulacion_enum.APROBADO_PARA_ENTREVISTA,

            observaciones_rrhh:
              'El postulante confirmó su participación en la entrevista.',

            fecha_ultimo_cambio:
              ahora,
          },
        });


      if (cambio.count !== 1) {
        throw new ConflictException(
          'El estado de la postulación cambió antes de completar la operación.',
        );
      }


      await tx.solicitudes_pasante_supervisor.update({
        where: {
          id: solicitud.id,
        },

        data: {
          updated_at:
            ahora,
        },
      });


      const postulante =
        solicitud.postulaciones.postulantes;

      const nombrePostulante =
        [
          postulante.nombres,
          postulante.apellido_paterno,
          postulante.apellido_materno,
        ]
          .filter(Boolean)
          .join(' ');


      await tx.notificaciones_administrativas.create({
        data: {
          usuario_administrativo_id:
            solicitud.supervisor_id,

          solicitud_pasante_id:
            solicitud.id,

          tipo:
            'ACEPTA_ENTREVISTA',

          titulo:
            'Postulante confirmó entrevista',

          mensaje:
            `${nombrePostulante} confirmó que desea continuar con el proceso de entrevista.`,
        },
      });


      await tx.auditoria_logs.create({
        data: {
          administrativo_id:
            administrativoId,

          accion:
            'CONFIRMAR_ENTREVISTA_POSTULANTE',

          tabla_afectada:
            'postulaciones',

          registro_id:
            solicitud.postulacion_id,

          detalles: {
            solicitud_pasante_id:
              solicitud.id,

            supervisor_id:
              solicitud.supervisor_id,

            estado_anterior:
              'SELECCIONADO_POR_AREA',

            estado_nuevo:
              'APROBADO_PARA_ENTREVISTA',
          },
        },
      });


      return {
        message:
          'La participación en la entrevista fue confirmada.',

        solicitud_id:
          solicitud.id,

        postulacion_id:
          solicitud.postulacion_id,

        estado_postulacion:
          estado_postulacion_enum.APROBADO_PARA_ENTREVISTA,

        siguiente_etapa:
          'REALIZAR_ENTREVISTA',
      };
    },
  );
}
async registrarDesistimiento(
  administrativoId: string,
  solicitudId: string,
) {

  return this.prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {

      const solicitud =
        await tx.solicitudes_pasante_supervisor.findUnique({
          where: {
            id: solicitudId,
          },

          include: {
            postulaciones: {
              include: {
                estados_postulacion: true,
                postulantes: true,
              },
            },
          },
        });


      if (!solicitud) {
        throw new NotFoundException(
          'La petición indicada no existe.',
        );
      }


      if (
        solicitud.estado !==
        estado_solicitud_pasante_enum.APROBADA
      ) {
        throw new BadRequestException(
          'La petición todavía no se encuentra aprobada.',
        );
      }


      if (
        solicitud.postulaciones
          .estados_postulacion
          ?.estado_actual !==
        estado_postulacion_enum.SELECCIONADO_POR_AREA
      ) {
        throw new ConflictException(
          'El postulante ya no se encuentra pendiente de confirmación.',
        );
      }


      const ahora = new Date();


      const cambio =
        await tx.estados_postulacion.updateMany({
          where: {
            postulacion_id:
              solicitud.postulacion_id,

            estado_actual:
              estado_postulacion_enum.SELECCIONADO_POR_AREA,
          },

          data: {
            estado_actual:
              estado_postulacion_enum.DESISTIDO,

            observaciones_rrhh:
              'El postulante indicó que no desea continuar con el proceso de entrevista.',

            fecha_ultimo_cambio:
              ahora,
          },
        });


      if (cambio.count !== 1) {
        throw new ConflictException(
          'El estado de la postulación cambió antes de completar la operación.',
        );
      }


      await tx.postulaciones.update({
        where: {
          id: solicitud.postulacion_id,
        },

        data: {
          fecha_cierre:
            ahora,

          updated_at:
            ahora,
        },
      });


      await tx.solicitudes_pasante_supervisor.update({
        where: {
          id: solicitud.id,
        },

        data: {
          updated_at:
            ahora,
        },
      });


      const postulante =
        solicitud.postulaciones.postulantes;

      const nombrePostulante =
        [
          postulante.nombres,
          postulante.apellido_paterno,
          postulante.apellido_materno,
        ]
          .filter(Boolean)
          .join(' ');


      await tx.notificaciones_administrativas.create({
        data: {
          usuario_administrativo_id:
            solicitud.supervisor_id,

          solicitud_pasante_id:
            solicitud.id,

          tipo:
            'POSTULANTE_DESISTE',

          titulo:
            'Postulante no continuará el proceso',

          mensaje:
            `${nombrePostulante} informó a Talento Humano que no desea continuar con el proceso de entrevista.`,
        },
      });


      await tx.auditoria_logs.create({
        data: {
          administrativo_id:
            administrativoId,

          accion:
            'REGISTRAR_DESISTIMIENTO_POSTULANTE',

          tabla_afectada:
            'postulaciones',

          registro_id:
            solicitud.postulacion_id,

          detalles: {
            solicitud_pasante_id:
              solicitud.id,

            supervisor_id:
              solicitud.supervisor_id,

            estado_anterior:
              'SELECCIONADO_POR_AREA',

            estado_nuevo:
              'DESISTIDO',
          },
        },
      });


      return {
        message:
          'El desistimiento fue registrado correctamente.',

        solicitud_id:
          solicitud.id,

        postulacion_id:
          solicitud.postulacion_id,

        estado_postulacion:
          estado_postulacion_enum.DESISTIDO,
      };
    },
  );
}
async registrarNoSeleccionado(
  administrativoId: string,
  solicitudId: string,
  motivo: string,
) {
  const motivoLimpio = String(motivo ?? '').trim();

  if (!motivoLimpio) {
    throw new BadRequestException(
      'Debe indicar el motivo por el cual el postulante no fue seleccionado.',
    );
  }

  if (motivoLimpio.length > 1000) {
    throw new BadRequestException(
      'El motivo no puede superar los 1000 caracteres.',
    );
  }

  return this.prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {

      const solicitud =
        await tx.solicitudes_pasante_supervisor.findUnique({
          where: {
            id: solicitudId,
          },

          include: {
            postulaciones: {
              include: {
                estados_postulacion: true,
                postulantes: true,
              },
            },
          },
        });

      if (!solicitud) {
        throw new NotFoundException(
          'La petición indicada no existe.',
        );
      }

      if (
        solicitud.estado !==
        estado_solicitud_pasante_enum.APROBADA
      ) {
        throw new BadRequestException(
          'La petición no se encuentra aprobada.',
        );
      }

      if (
        solicitud.postulaciones
          .estados_postulacion
          ?.estado_actual !==
        estado_postulacion_enum.APROBADO_PARA_ENTREVISTA
      ) {
        throw new ConflictException(
          'El postulante no se encuentra pendiente de resultado de entrevista.',
        );
      }

      const ahora = new Date();

      const cambio =
        await tx.estados_postulacion.updateMany({
          where: {
            postulacion_id:
              solicitud.postulacion_id,

            estado_actual:
              estado_postulacion_enum.APROBADO_PARA_ENTREVISTA,
          },

          data: {
            estado_actual:
              estado_postulacion_enum.NO_SELECCIONADO,

            observaciones_rrhh:
              motivoLimpio,

            fecha_ultimo_cambio:
              ahora,
          },
        });

      if (cambio.count !== 1) {
        throw new ConflictException(
          'El estado de la postulación cambió antes de completar la operación.',
        );
      }

      await tx.postulaciones.update({
        where: {
          id: solicitud.postulacion_id,
        },

        data: {
          fecha_cierre: ahora,
          updated_at: ahora,
        },
      });

      await tx.solicitudes_pasante_supervisor.update({
        where: {
          id: solicitud.id,
        },

        data: {
          respuesta_rrhh:
            `No seleccionado después de entrevista. Motivo: ${motivoLimpio}`,

          updated_at: ahora,
        },
      });

      const postulante =
        solicitud.postulaciones.postulantes;

      const nombrePostulante =
        [
          postulante.nombres,
          postulante.apellido_paterno,
          postulante.apellido_materno,
        ]
          .filter(Boolean)
          .join(' ');

      await tx.notificaciones_administrativas.create({
        data: {
          usuario_administrativo_id:
            solicitud.supervisor_id,

          solicitud_pasante_id:
            solicitud.id,

          tipo:
            'NO_SELECCIONADO',

          titulo:
            'Postulante no seleccionado',

          mensaje:
            `${nombrePostulante} no fue seleccionado después de la entrevista. Motivo: ${motivoLimpio}`,
        },
      });

      await tx.auditoria_logs.create({
        data: {
          administrativo_id:
            administrativoId,

          accion:
            'NO_SELECCIONAR_POSTULANTE',

          tabla_afectada:
            'postulaciones',

          registro_id:
            solicitud.postulacion_id,

          detalles: {
            solicitud_pasante_id:
              solicitud.id,

            supervisor_id:
              solicitud.supervisor_id,

            motivo:
              motivoLimpio,

            estado_anterior:
              'APROBADO_PARA_ENTREVISTA',

            estado_nuevo:
              'NO_SELECCIONADO',
          },
        },
      });

      return {
        message:
          'El resultado de la entrevista fue registrado correctamente.',

        solicitud_id:
          solicitud.id,

        postulacion_id:
          solicitud.postulacion_id,

        estado_postulacion:
          estado_postulacion_enum.NO_SELECCIONADO,
      };
    },
  );
}

async seleccionarPostulante(
  administrativoId: string,
  solicitudId: string,
) {
  return this.prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {

      const solicitud =
        await tx.solicitudes_pasante_supervisor.findUnique({
          where: {
            id: solicitudId,
          },

          include: {
            usuarios_administrativos: true,

            postulaciones: {
              include: {
                estados_postulacion: true,

                postulantes: {
                  include: {
                    formacion_academica_postulante:
                      true,
                  },
                },
              },
            },
          },
        });

      if (!solicitud) {
        throw new NotFoundException(
          'La petición indicada no existe.',
        );
      }

      if (
        solicitud.estado !==
        estado_solicitud_pasante_enum.APROBADA
      ) {
        throw new BadRequestException(
          'La petición no se encuentra aprobada.',
        );
      }

      if (
        solicitud.postulaciones
          .estados_postulacion
          ?.estado_actual !==
        estado_postulacion_enum.APROBADO_PARA_ENTREVISTA
      ) {
        throw new ConflictException(
          'El postulante no se encuentra pendiente de resultado de entrevista.',
        );
      }

      const postulante =
        solicitud.postulaciones.postulantes;

      const pasanteExistente =
        await tx.pasantes_activos.findUnique({
          where: {
            postulante_id:
              postulante.id,
          },
        });

      if (pasanteExistente) {
        throw new ConflictException(
          'El postulante ya se encuentra registrado como pasante.',
        );
      }

      const formacion =
        postulante
          .formacion_academica_postulante?.[0]
        ?? null;

      if (!formacion) {
        throw new BadRequestException(
          'El postulante no tiene información académica registrada.',
        );
      }

      const ahora = new Date();

      const cambio =
        await tx.estados_postulacion.updateMany({
          where: {
            postulacion_id:
              solicitud.postulacion_id,

            estado_actual:
              estado_postulacion_enum.APROBADO_PARA_ENTREVISTA,
          },

          data: {
            estado_actual:
              estado_postulacion_enum.ACEPTADO,

            observaciones_rrhh:
              'Postulante seleccionado después de la entrevista.',

            fecha_ultimo_cambio:
              ahora,
          },
        });

      if (cambio.count !== 1) {
        throw new ConflictException(
          'El estado de la postulación cambió antes de completar la operación.',
        );
      }

      const nombreSupervisor =
        [
          solicitud
            .usuarios_administrativos
            .nombres,

          solicitud
            .usuarios_administrativos
            .apellidos,
        ]
          .filter(Boolean)
          .join(' ');

      const pasante =
        await tx.pasantes_activos.create({
          data: {
            postulante_id:
              postulante.id,

            departamento_id:
              solicitud.departamento_id,

            supervisor_id:
              solicitud.supervisor_id,

            solicitud_pasante_id:
              solicitud.id,

            supervisor:
              nombreSupervisor,

            modalidad_pasantia:
              formacion.modalidad_postulacion,

            estado:
              estado_pasante_activo_enum.ACTIVO,
          },
        });

      await tx.postulaciones.update({
        where: {
          id: solicitud.postulacion_id,
        },

        data: {
          fecha_cierre: ahora,
          updated_at: ahora,
        },
      });

      await tx.solicitudes_pasante_supervisor.update({
        where: {
          id: solicitud.id,
        },

        data: {
          respuesta_rrhh:
            'Postulante seleccionado después de entrevista e incorporado como pasante activo.',

          updated_at:
            ahora,
        },
      });

      if (postulante.usuario_id) {
        await tx.usuarios_sistema.updateMany({
          where: {
            id: postulante.usuario_id,
          },

          data: {
            rol:
              rol_usuario_enum.PASANTE,
          },
        });
      }

      const nombrePostulante =
        [
          postulante.nombres,
          postulante.apellido_paterno,
          postulante.apellido_materno,
        ]
          .filter(Boolean)
          .join(' ');

      await tx.notificaciones_administrativas.create({
        data: {
          usuario_administrativo_id:
            solicitud.supervisor_id,

          solicitud_pasante_id:
            solicitud.id,

          tipo:
            'POSTULANTE_ACEPTADO',

          titulo:
            'Nuevo pasante asignado',

          mensaje:
            `${nombrePostulante} fue seleccionado después de la entrevista y ahora se encuentra registrado como pasante activo de su Departamento.`,
        },
      });

      await tx.auditoria_logs.create({
        data: {
          administrativo_id:
            administrativoId,

          accion:
            'SELECCIONAR_POSTULANTE',

          tabla_afectada:
            'pasantes_activos',

          registro_id:
            pasante.id,

          detalles: {
            solicitud_pasante_id:
              solicitud.id,

            postulacion_id:
              solicitud.postulacion_id,

            postulante_id:
              postulante.id,

            supervisor_id:
              solicitud.supervisor_id,

            departamento_id:
              solicitud.departamento_id,

            estado_postulacion:
              'ACEPTADO',

            estado_pasante:
              'ACTIVO',
          },
        },
      });

      return {
        message:
          'El postulante fue seleccionado y registrado como pasante activo.',

        solicitud_id:
          solicitud.id,

        postulacion_id:
          solicitud.postulacion_id,

        pasante_id:
          pasante.id,

        estado_postulacion:
          estado_postulacion_enum.ACEPTADO,

        estado_pasante:
          estado_pasante_activo_enum.ACTIVO,
      };
    },
  );
}
async obtenerPasantes() {

  const pasantes =
    await this.prisma.pasantes_activos.findMany({

      include: {

        postulantes: {
          include: {
            formacion_academica_postulante: true,
            usuarios_sistema: {
              select: {
                email: true,
              },
            },
          },
        },

        departamentos: {
          include: {
            gerencias: true,
          },
        },

        supervisor_usuario: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            email: true,
            cargo: true,
          },
        },

        solicitud_pasante: {
          select: {
            id: true,
            actividades_pasante: true,
            created_at: true,
          },
        },

        seguimiento_academico_horas: true,
      },

      orderBy: {
        created_at: 'desc',
      },
    });


  const lista =
    pasantes.map(
      pasante => {

        const postulante =
          pasante.postulantes;

        const formacion =
          postulante
            .formacion_academica_postulante?.[0]
          ?? null;


        const nombrePostulante =
          [
            postulante.nombres,
            postulante.apellido_paterno,
            postulante.apellido_materno,
          ]
            .filter(Boolean)
            .join(' ');


        const nombreSupervisor =
          pasante.supervisor_usuario
            ? [
                pasante.supervisor_usuario.nombres,
                pasante.supervisor_usuario.apellidos,
              ]
                .filter(Boolean)
                .join(' ')
            : pasante.supervisor;


        return {

          id:
            pasante.id,

          estado:
            pasante.estado,

          fecha_incorporacion:
            pasante.created_at,

          modalidad_pasantia:
            pasante.modalidad_pasantia,


          postulante: {

            id:
              postulante.id,

            nombre_completo:
              nombrePostulante,

            ci:
              postulante.ci,

            expedido:
              postulante.expedido,

            email:
              postulante
                .usuarios_sistema
                ?.email
              ?? null,
          },


          formacion: formacion
            ? {
                institucion:
                  formacion.institucion_nombre,

                carrera:
                  formacion.carrera,

                semestre_o_nivel:
                  formacion.semestre_o_nivel,

                modalidad:
                  formacion.modalidad_postulacion,
              }
            : null,


          departamento:
            pasante.departamentos
              ? {
                  id:
                    pasante.departamentos.id,

                  nombre:
                    pasante.departamentos.nombre,
                }
              : null,


          gerencia:
            pasante.departamentos
              ?.gerencias
              ? {
                  id:
                    pasante.departamentos
                      .gerencias.id,

                  nombre:
                    pasante.departamentos
                      .gerencias.nombre,
                }
              : null,


          supervisor: {

            id:
              pasante.supervisor_usuario
                ?.id
              ?? null,

            nombre_completo:
              nombreSupervisor,

            email:
              pasante.supervisor_usuario
                ?.email
              ?? null,

            cargo:
              pasante.supervisor_usuario
                ?.cargo
              ?? null,
          },


          actividades:
            pasante
              .solicitud_pasante
              ?.actividades_pasante
            ?? null,


          seguimiento:
            pasante
              .seguimiento_academico_horas
            ?? null,

        };
      },
    );


  const resumen = {

    total:
      pasantes.length,

    activos:
      pasantes.filter(
        item =>
          item.estado ===
          estado_pasante_activo_enum.ACTIVO,
      ).length,

    suspendidos:
      pasantes.filter(
        item =>
          item.estado ===
          estado_pasante_activo_enum.SUSPENDIDO,
      ).length,

    finalizados:
      pasantes.filter(
        item =>
          item.estado ===
          estado_pasante_activo_enum.FINALIZADO,
      ).length,

    abandonos:
      pasantes.filter(
        item =>
          item.estado ===
          estado_pasante_activo_enum.ABANDONO,
      ).length,
  };


  return {
    resumen,
    pasantes: lista,
  };
}
async guardarSeguimientoPasante(
  administrativoId: string,
  pasanteId: string,
  datos: {
    fecha_inicio?: string;
    fecha_conclusion?: string;
    duracion_acordada?: string;
    horas_requeridas?: number;
    turno?: string;
  },
) {

  const fechaInicioTexto =
    String(datos.fecha_inicio ?? '').trim();

  const fechaConclusionTexto =
    String(datos.fecha_conclusion ?? '').trim();

  const duracionAcordada =
    String(datos.duracion_acordada ?? '').trim();

  const horasRequeridas =
    Number(datos.horas_requeridas);

  const turno =
    String(datos.turno ?? '').trim();


  if (
    !fechaInicioTexto ||
    !fechaConclusionTexto ||
    !duracionAcordada ||
    !turno
  ) {
    throw new BadRequestException(
      'Debe completar la fecha de inicio, fecha de conclusión, duración acordada y turno.',
    );
  }


  if (
    !Number.isInteger(horasRequeridas) ||
    horasRequeridas <= 0
  ) {
    throw new BadRequestException(
      'Las horas requeridas deben ser un número entero mayor a cero.',
    );
  }


  if (
    !Object.values(
      turno_disponibilidad_enum,
    ).includes(
      turno as turno_disponibilidad_enum,
    )
  ) {
    throw new BadRequestException(
      'El turno seleccionado no es válido.',
    );
  }


  const fechaInicio =
    new Date(
      `${fechaInicioTexto}T00:00:00`,
    );

  const fechaConclusion =
    new Date(
      `${fechaConclusionTexto}T00:00:00`,
    );


  if (
    Number.isNaN(
      fechaInicio.getTime(),
    ) ||
    Number.isNaN(
      fechaConclusion.getTime(),
    )
  ) {
    throw new BadRequestException(
      'Las fechas ingresadas no son válidas.',
    );
  }


  if (
    fechaConclusion <=
    fechaInicio
  ) {
    throw new BadRequestException(
      'La fecha de conclusión debe ser posterior a la fecha de inicio.',
    );
  }


  return this.prisma.$transaction(
    async (
      tx: Prisma.TransactionClient,
    ) => {

      const pasante =
        await tx.pasantes_activos.findUnique({
          where: {
            id: pasanteId,
          },

          include: {
            seguimiento_academico_horas:
              true,

            postulantes:
              true,
          },
        });


      if (!pasante) {
        throw new NotFoundException(
          'El pasante indicado no existe.',
        );
      }


      if (
        pasante.estado !==
        estado_pasante_activo_enum.ACTIVO
      ) {
        throw new ConflictException(
          'Solo se puede configurar el seguimiento de un pasante activo.',
        );
      }


      const seguimientoExistente =
        pasante.seguimiento_academico_horas;


      const horasRealizadas =
        seguimientoExistente
          ?.horas_realizadas
        ?? 0;


      if (
        horasRequeridas <
        horasRealizadas
      ) {
        throw new BadRequestException(
          `Las horas requeridas no pueden ser menores a las ${horasRealizadas} horas ya realizadas.`,
        );
      }


      const horasFaltantes =
        horasRequeridas -
        horasRealizadas;


      const seguimiento =
        seguimientoExistente
          ? await tx.seguimiento_academico_horas.update({

              where: {
                pasante_id:
                  pasanteId,
              },

              data: {
                fecha_inicio:
                  fechaInicio,

                fecha_conclusion:
                  fechaConclusion,

                duracion_acordada:
                  duracionAcordada,

                horas_requeridas:
                  horasRequeridas,

                horas_faltantes:
                  horasFaltantes,

                turno:
                  turno as turno_disponibilidad_enum,
              },
            })

          : await tx.seguimiento_academico_horas.create({

              data: {
                pasante_id:
                  pasanteId,

                fecha_inicio:
                  fechaInicio,

                fecha_conclusion:
                  fechaConclusion,

                duracion_acordada:
                  duracionAcordada,

                horas_requeridas:
                  horasRequeridas,

                horas_realizadas:
                  0,

                horas_faltantes:
                  horasRequeridas,

                turno:
                  turno as turno_disponibilidad_enum,
              },
            });


      await tx.auditoria_logs.create({
        data: {
          administrativo_id:
            administrativoId,

          accion:
            seguimientoExistente
              ? 'ACTUALIZAR_SEGUIMIENTO_PASANTE'
              : 'CONFIGURAR_SEGUIMIENTO_PASANTE',

          tabla_afectada:
            'seguimiento_academico_horas',

          registro_id:
            seguimiento.id,

          detalles: {
            pasante_id:
              pasanteId,

            fecha_inicio:
              fechaInicioTexto,

            fecha_conclusion:
              fechaConclusionTexto,

            duracion_acordada:
              duracionAcordada,

            horas_requeridas:
              horasRequeridas,

            turno,
          },
        },
      });


      return {
        message:
          seguimientoExistente
            ? 'La planificación del pasante fue actualizada correctamente.'
            : 'La planificación del pasante fue registrada correctamente.',

        seguimiento,
      };
    },
  );
}
async suspenderPasante(
  administrativoId: string,
  pasanteId: string,
  motivoRaw: string,
) {
  const motivo =
    String(motivoRaw ?? '').trim();

  if (!motivo) {
    throw new BadRequestException(
      'Debe registrar el motivo de la suspensión.',
    );
  }

  if (motivo.length > 1000) {
    throw new BadRequestException(
      'El motivo no puede superar los 1000 caracteres.',
    );
  }

  return this.prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      const pasante =
        await tx.pasantes_activos.findUnique({
          where: {
            id: pasanteId,
          },
          include: {
            postulantes: true,
          },
        });

      if (!pasante) {
        throw new NotFoundException(
          'El pasante indicado no existe.',
        );
      }

      if (
        pasante.estado !==
        estado_pasante_activo_enum.ACTIVO
      ) {
        throw new ConflictException(
          'Solo se puede suspender un pasante que se encuentre activo.',
        );
      }

      const actualizado =
        await tx.pasantes_activos.update({
          where: {
            id: pasanteId,
          },
          data: {
            estado:
              estado_pasante_activo_enum.SUSPENDIDO,
            updated_at:
              new Date(),
          },
        });

      const nombreCompleto =
        [
          pasante.postulantes.nombres,
          pasante.postulantes.apellido_paterno,
          pasante.postulantes.apellido_materno,
        ]
          .filter(Boolean)
          .join(' ');

      if (pasante.supervisor_id) {
        await tx.notificaciones_administrativas.create({
          data: {
            usuario_administrativo_id:
              pasante.supervisor_id,

            solicitud_pasante_id:
              pasante.solicitud_pasante_id,

            tipo:
              'PASANTE_SUSPENDIDO',

            titulo:
              'Pasantía suspendida',

            mensaje:
              `Talento Humano suspendió temporalmente la pasantía de ${nombreCompleto}. Motivo: ${motivo}`,
          },
        });
      }

      await tx.auditoria_logs.create({
        data: {
          administrativo_id:
            administrativoId,

          accion:
            'SUSPENDER_PASANTE',

          tabla_afectada:
            'pasantes_activos',

          registro_id:
            pasanteId,

          detalles: {
            estado_anterior:
              'ACTIVO',

            estado_nuevo:
              'SUSPENDIDO',

            motivo,
          },
        },
      });

      return {
        message:
          'La pasantía fue suspendida correctamente.',

        pasante:
          actualizado,
      };
    },
  );
}


async reactivarPasante(
  administrativoId: string,
  pasanteId: string,
  motivoRaw: string,
) {
  const motivo =
    String(motivoRaw ?? '').trim();

  if (!motivo) {
    throw new BadRequestException(
      'Debe registrar el motivo de la reactivación.',
    );
  }

  if (motivo.length > 1000) {
    throw new BadRequestException(
      'El motivo no puede superar los 1000 caracteres.',
    );
  }

  return this.prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      const pasante =
        await tx.pasantes_activos.findUnique({
          where: {
            id: pasanteId,
          },
          include: {
            postulantes: true,
          },
        });

      if (!pasante) {
        throw new NotFoundException(
          'El pasante indicado no existe.',
        );
      }

      if (
        pasante.estado !==
        estado_pasante_activo_enum.SUSPENDIDO
      ) {
        throw new ConflictException(
          'Solo se puede reactivar un pasante suspendido.',
        );
      }

      const actualizado =
        await tx.pasantes_activos.update({
          where: {
            id: pasanteId,
          },
          data: {
            estado:
              estado_pasante_activo_enum.ACTIVO,
            updated_at:
              new Date(),
          },
        });

      const nombreCompleto =
        [
          pasante.postulantes.nombres,
          pasante.postulantes.apellido_paterno,
          pasante.postulantes.apellido_materno,
        ]
          .filter(Boolean)
          .join(' ');

      if (pasante.supervisor_id) {
        await tx.notificaciones_administrativas.create({
          data: {
            usuario_administrativo_id:
              pasante.supervisor_id,

            solicitud_pasante_id:
              pasante.solicitud_pasante_id,

            tipo:
              'PASANTE_REACTIVADO',

            titulo:
              'Pasantía reactivada',

            mensaje:
              `Talento Humano reactivó la pasantía de ${nombreCompleto}.`,
          },
        });
      }

      await tx.auditoria_logs.create({
        data: {
          administrativo_id:
            administrativoId,

          accion:
            'REACTIVAR_PASANTE',

          tabla_afectada:
            'pasantes_activos',

          registro_id:
            pasanteId,

          detalles: {
            estado_anterior:
              'SUSPENDIDO',

            estado_nuevo:
              'ACTIVO',

            motivo,
          },
        },
      });

      return {
        message:
          'La pasantía fue reactivada correctamente.',

        pasante:
          actualizado,
      };
    },
  );
}


async registrarAbandonoPasante(
  administrativoId: string,
  pasanteId: string,
  motivoRaw: string,
) {
  const motivo =
    String(motivoRaw ?? '').trim();

  if (!motivo) {
    throw new BadRequestException(
      'Debe registrar el motivo del abandono.',
    );
  }

  if (motivo.length > 1000) {
    throw new BadRequestException(
      'El motivo no puede superar los 1000 caracteres.',
    );
  }

  return this.prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      const pasante =
        await tx.pasantes_activos.findUnique({
          where: {
            id: pasanteId,
          },
          include: {
            postulantes: true,
          },
        });

      if (!pasante) {
        throw new NotFoundException(
          'El pasante indicado no existe.',
        );
      }

      if (
        pasante.estado !==
          estado_pasante_activo_enum.ACTIVO &&
        pasante.estado !==
          estado_pasante_activo_enum.SUSPENDIDO
      ) {
        throw new ConflictException(
          'Solo se puede registrar abandono de una pasantía activa o suspendida.',
        );
      }

      const estadoAnterior =
        pasante.estado;

      const actualizado =
        await tx.pasantes_activos.update({
          where: {
            id: pasanteId,
          },
          data: {
            estado:
              estado_pasante_activo_enum.ABANDONO,
            updated_at:
              new Date(),
          },
        });

      const nombreCompleto =
        [
          pasante.postulantes.nombres,
          pasante.postulantes.apellido_paterno,
          pasante.postulantes.apellido_materno,
        ]
          .filter(Boolean)
          .join(' ');

      if (pasante.supervisor_id) {
        await tx.notificaciones_administrativas.create({
          data: {
            usuario_administrativo_id:
              pasante.supervisor_id,

            solicitud_pasante_id:
              pasante.solicitud_pasante_id,

            tipo:
              'PASANTE_ABANDONO',

            titulo:
              'Abandono de pasantía',

            mensaje:
              `Talento Humano registró el abandono de la pasantía de ${nombreCompleto}. Motivo: ${motivo}`,
          },
        });
      }

      await tx.auditoria_logs.create({
        data: {
          administrativo_id:
            administrativoId,

          accion:
            'REGISTRAR_ABANDONO_PASANTE',

          tabla_afectada:
            'pasantes_activos',

          registro_id:
            pasanteId,

          detalles: {
            estado_anterior:
              estadoAnterior,

            estado_nuevo:
              'ABANDONO',

            motivo,
          },
        },
      });

      return {
        message:
          'El abandono de la pasantía fue registrado correctamente.',

        pasante:
          actualizado,
      };
    },
  );
}


async finalizarPasante(
  administrativoId: string,
  pasanteId: string,
  observacionRaw?: string,
) {
  const observacion =
    String(
      observacionRaw ?? '',
    ).trim();

  if (observacion.length > 1000) {
    throw new BadRequestException(
      'La observación no puede superar los 1000 caracteres.',
    );
  }

  return this.prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      const pasante =
        await tx.pasantes_activos.findUnique({
          where: {
            id: pasanteId,
          },
          include: {
            postulantes: true,
            seguimiento_academico_horas:
              true,
          },
        });

      if (!pasante) {
        throw new NotFoundException(
          'El pasante indicado no existe.',
        );
      }

      if (
        pasante.estado !==
        estado_pasante_activo_enum.ACTIVO
      ) {
        throw new ConflictException(
          'Solo se puede finalizar una pasantía que se encuentre activa.',
        );
      }

      if (
        !pasante.seguimiento_academico_horas
      ) {
        throw new ConflictException(
          'Debe configurar la planificación de la pasantía antes de finalizarla.',
        );
      }

      const actualizado =
        await tx.pasantes_activos.update({
          where: {
            id: pasanteId,
          },
          data: {
            estado:
              estado_pasante_activo_enum.FINALIZADO,
            updated_at:
              new Date(),
          },
        });

      const nombreCompleto =
        [
          pasante.postulantes.nombres,
          pasante.postulantes.apellido_paterno,
          pasante.postulantes.apellido_materno,
        ]
          .filter(Boolean)
          .join(' ');

      if (pasante.supervisor_id) {
        await tx.notificaciones_administrativas.create({
          data: {
            usuario_administrativo_id:
              pasante.supervisor_id,

            solicitud_pasante_id:
              pasante.solicitud_pasante_id,

            tipo:
              'PASANTE_FINALIZADO',

            titulo:
              'Pasantía finalizada',

            mensaje:
              `Talento Humano registró la finalización de la pasantía de ${nombreCompleto}.`,
          },
        });
      }

      await tx.auditoria_logs.create({
        data: {
          administrativo_id:
            administrativoId,

          accion:
            'FINALIZAR_PASANTE',

          tabla_afectada:
            'pasantes_activos',

          registro_id:
            pasanteId,

          detalles: {
            estado_anterior:
              'ACTIVO',

            estado_nuevo:
              'FINALIZADO',

            observacion:
              observacion || null,

            validacion_horas:
              'PENDIENTE_INTEGRACION_BIOMETRICO',
          },
        },
      });

      return {
        message:
          'La pasantía fue finalizada correctamente.',

        pasante:
          actualizado,
      };
    },
  );
}

  // ============================================================
  // VALIDAR FECHAS ADMINISTRATIVAS
  // ============================================================

  private convertirFechaAdministrativa(
    valor: string | undefined,
  ): Date | undefined {
    if (valor === undefined) {
      return undefined;
    }

    const fechaTexto = valor.trim();

    if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaTexto)) {
      throw new BadRequestException(
        'La fecha debe tener el formato AAAA-MM-DD.',
      );
    }

    const fecha = new Date(
      `${fechaTexto}T00:00:00.000Z`,
    );

    if (
      Number.isNaN(fecha.getTime()) ||
      fecha.toISOString().slice(0, 10) !== fechaTexto
    ) {
      throw new BadRequestException(
        'La fecha ingresada no es válida.',
      );
    }

    return fecha;
  }

  // ============================================================
  // CONSULTAR CONTROL ADMINISTRATIVO
  // ============================================================

  async obtenerControlAdministrativo(
    pasanteId: string,
  ) {
    const pasante = await this.prisma.pasantes_activos
      .findUnique({
        where: {
          id: pasanteId,
        },
        select: {
          id: true,
          estado: true,

          postulantes: {
            select: {
              nombres: true,
              apellido_paterno: true,
              apellido_materno: true,
              ci: true,
            },
          },

          control_administrativo: true,
        },
      });

    if (!pasante) {
      throw new NotFoundException(
        'El pasante indicado no existe.',
      );
    }

    const nombreCompleto = [
      pasante.postulantes.nombres,
      pasante.postulantes.apellido_paterno,
      pasante.postulantes.apellido_materno,
    ]
      .filter(Boolean)
      .join(' ');

    return {
      pasante_id: pasante.id,
      nombre_completo: nombreCompleto,
      ci: pasante.postulantes.ci,
      estado: pasante.estado,
      control: pasante.control_administrativo,
    };
  }

  // ============================================================
  // ACTUALIZAR CONTROL ADMINISTRATIVO
  // ============================================================

  async actualizarControlAdministrativo(
    administrativoId: string,
    pasanteId: string,
    datos: ActualizarControlAdministrativoDto,
  ) {
    if (Object.keys(datos).length === 0) {
      throw new BadRequestException(
        'Debe proporcionar al menos un campo para actualizar.',
      );
    }

    const fechaDevolucionTarjeta =
      this.convertirFechaAdministrativa(
        datos.fecha_devolucion_tarjeta,
      );

    const fechaDevolucionChamarra =
      this.convertirFechaAdministrativa(
        datos.fecha_devolucion_chamarra,
      );

    return this.prisma.$transaction(async (tx) => {
      // --------------------------------------------------------
      // 1. COMPROBAR EXISTENCIA DEL PASANTE
      // --------------------------------------------------------

      const pasante = await tx.pasantes_activos.findUnique({
        where: {
          id: pasanteId,
        },
        select: {
          id: true,
          estado: true,
          control_administrativo: true,
        },
      });

      if (!pasante) {
        throw new NotFoundException(
          'El pasante indicado no existe.',
        );
      }

      // --------------------------------------------------------
      // 2. CONSTRUIR SOLO LOS CAMPOS ENVIADOS
      // --------------------------------------------------------

      const cambios: Prisma.control_administrativoUpdateInput = {};

      if (datos.talla_chamarra !== undefined) {
        cambios.talla_chamarra = datos.talla_chamarra;
      }

      if (datos.credencial_codigo !== undefined) {
        cambios.credencial_codigo =
          datos.credencial_codigo.trim();
      }

      if (datos.induccion !== undefined) {
        cambios.induccion = datos.induccion;
      }

      if (datos.compromiso !== undefined) {
        cambios.compromiso = datos.compromiso;
      }

      if (datos.carta_t3 !== undefined) {
        cambios.carta_t3 = datos.carta_t3.trim();
      }

      if (datos.seguro_contra_accidente !== undefined) {
        cambios.seguro_contra_accidente =
          datos.seguro_contra_accidente.trim();
      }

      if (fechaDevolucionTarjeta !== undefined) {
        cambios.fecha_devolucion_tarjeta =
          fechaDevolucionTarjeta;
      }

      if (fechaDevolucionChamarra !== undefined) {
        cambios.fecha_devolucion_chamarra =
          fechaDevolucionChamarra;
      }

      if (datos.reposicion_tarjeta !== undefined) {
        cambios.reposicion_tarjeta =
          datos.reposicion_tarjeta.trim();
      }

      if (datos.certificado_emitido !== undefined) {
        cambios.certificado_emitido =
          datos.certificado_emitido;
      }

      // --------------------------------------------------------
      // 3. CREAR O ACTUALIZAR LA FICHA
      // --------------------------------------------------------

      const control = await tx.control_administrativo.upsert({
        where: {
          pasante_id: pasanteId,
        },

        create: {
          pasante_id: pasanteId,

          talla_chamarra:
            datos.talla_chamarra ?? 'NO_ENTREGADO',

          credencial_codigo:
            datos.credencial_codigo?.trim() ?? null,

          induccion:
            datos.induccion ?? false,

          compromiso:
            datos.compromiso ?? false,

          carta_t3:
            datos.carta_t3?.trim() ?? 'NO CORRESPONDE',

          seguro_contra_accidente:
            datos.seguro_contra_accidente?.trim() ??
            'NO CORRESPONDE',

          fecha_devolucion_tarjeta:
            fechaDevolucionTarjeta ?? null,

          fecha_devolucion_chamarra:
            fechaDevolucionChamarra ?? null,

          reposicion_tarjeta:
            datos.reposicion_tarjeta?.trim() ?? null,

          certificado_emitido:
            datos.certificado_emitido ?? false,

          abandono:
            pasante.estado ===
            estado_pasante_activo_enum.ABANDONO,
        },

        update: cambios,
      });

      // --------------------------------------------------------
      // 4. AUDITORÍA
      // --------------------------------------------------------

      await tx.auditoria_logs.create({
        data: {
          administrativo_id: administrativoId,

          accion: 'ACTUALIZAR_CONTROL_ADMINISTRATIVO',

          tabla_afectada: 'control_administrativo',

          registro_id: control.id,

          detalles: {
            pasante_id: pasanteId,
            estado_pasante: pasante.estado,

            campos_modificados: Object.keys(datos),

            // Se registran únicamente los campos anteriores
            // afectados. No se modifica el historial existente.
            valores_anteriores:
              pasante.control_administrativo
                ? Object.fromEntries(
                    Object.keys(datos).map((campo) => [
                      campo,
                      pasante.control_administrativo?.[
                        campo as keyof typeof pasante.control_administrativo
                      ] ?? null,
                    ]),
                  )
                : null,
          },
        },
      });

      // --------------------------------------------------------
      // 5. RESPUESTA
      // --------------------------------------------------------

      return {
        message:
          'El control administrativo fue actualizado correctamente.',

        pasante_id: pasanteId,

        control,
      };
    });
  }




}