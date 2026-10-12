import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  Prisma,
} from '@prisma/client';

import {
  PrismaService,
} from '../prisma/prisma.service';

import {
  CompletarFormularioDto,
} from './dto/completar-formulario.dto';

import {
  estado_postulacion_enum,
  puedeCambiarEstado,
} from './estado-postulacion';
import {
  MailService,
} from '../auth/mail.service';

// ============================================================
// VALIDAR UUID
// ============================================================

const esUUID = (
  valor?: string | null,
): boolean => {

  if (!valor) {
    return false;
  }

  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    .test(valor);
};


@Injectable()
export class PostulacionesService {

  constructor(
    private readonly prisma:
      PrismaService,
      private readonly mailService:
    MailService,
  ) {}


  // ============================================================
  // OBTENER POSTULACIÓN ACTUAL
  // ============================================================

  private async obtenerPostulacionActual(
    postulanteId: string,
  ) {

    const postulacion =
      await this.prisma
        .postulaciones
        .findFirst({

          where: {
            postulante_id:
              postulanteId,

            fecha_cierre:
              null,
          },

          orderBy: {
            numero_intento:
              'desc',
          },

          select: {
            id:
              true,

            postulante_id:
              true,

            numero_intento:
              true,

            fecha_inicio:
              true,

            fecha_cierre:
              true,
          },
        });


    if (!postulacion) {

      throw new BadRequestException(
        'No existe una postulación activa asociada al postulante.',
      );
    }


    return postulacion;
  }


  // ============================================================
  // POSTULANTE - OBTENER SU PROPIA POSTULACIÓN
  // ============================================================

  async obtenerMiPostulacion(
    usuarioId: string,
  ) {

    const postulante =
      await this.prisma
        .postulantes
        .findUnique({

          where: {
            usuario_id:
              usuarioId,
          },

          include: {

            datos_contacto_postulante:
              true,

            formacion_academica_postulante:
              true,

            disponibilidad_horaria_postulante:
              true,

            idiomas_postulante:
              true,

            experiencias_laborales:
              true,

            pasantes_activos:
              true,
          },
        });


    if (!postulante) {

      throw new NotFoundException(
        'No se encontró el perfil del postulante asociado a esta cuenta.',
      );
    }


    // ----------------------------------------------------------
    // Obtener la postulación vigente
    // ----------------------------------------------------------

    const postulacion =
      await this.obtenerPostulacionActual(
        postulante.id,
      );


    // ----------------------------------------------------------
    // Estado del intento actual
    // ----------------------------------------------------------

    const estado =
      await this.prisma
        .estados_postulacion
        .findUnique({

          where: {
            postulacion_id:
              postulacion.id,
          },
        });


    // ----------------------------------------------------------
    // Documentos solamente del intento actual
    // ----------------------------------------------------------

    const documentos =
      await this.prisma
        .documentos_postulante
        .findMany({

          where: {
            postulacion_id:
              postulacion.id,
          },

          orderBy: {
            uploaded_at:
              'asc',
          },
        });


    // ----------------------------------------------------------
    // Conservamos la estructura utilizada por el frontend
    // ----------------------------------------------------------

    return {

      ...postulante,

      postulacion_actual: {
        id:
          postulacion.id,

        numero_intento:
          postulacion.numero_intento,

        fecha_inicio:
          postulacion.fecha_inicio,

        fecha_cierre:
          postulacion.fecha_cierre,
      },

      estados_postulacion:
        estado,

      documentos_postulante:
        documentos,
    };
  }


  // ============================================================
  // POSTULANTE - COMPLETAR SU PROPIO FORMULARIO
  // ============================================================

  async completarFormulario(
    usuarioId: string,
    dto: CompletarFormularioDto,
  ) {

    // ----------------------------------------------------------
    // Obtener postulante desde el JWT
    // ----------------------------------------------------------

    const postulante =
      await this.prisma
        .postulantes
        .findUnique({

          where: {
            usuario_id:
              usuarioId,
          },

          select: {
            id:
              true,

            ci:
              true,

            usuario_id:
              true,
          },
        });


    if (!postulante) {

      throw new NotFoundException(
        'No existe un perfil de postulante asociado a su cuenta.',
      );
    }


    const postulanteId =
      postulante.id;


    // ==========================================================
    // OBTENER POSTULACIÓN ACTUAL
    // ==========================================================

    const postulacion =
      await this.obtenerPostulacionActual(
        postulanteId,
      );


    // ==========================================================
    // ESTADO ACTUAL DE ESTA POSTULACIÓN
    // ==========================================================

    const estadoRegistrado =
      await this.prisma
        .estados_postulacion
        .findUnique({

          where: {
            postulacion_id:
              postulacion.id,
          },

          select: {
            estado_actual:
              true,
          },
        });


    const estadoActual =
      estadoRegistrado
        ?.estado_actual ??
      estado_postulacion_enum.REGISTRADO;


    // ==========================================================
    // CONTROLAR SI PUEDE MODIFICAR EL FORMULARIO
    // ==========================================================

    const estadosEditables:
      estado_postulacion_enum[] = [

        estado_postulacion_enum.REGISTRADO,

        estado_postulacion_enum.OBSERVADO,
      ];


    if (
      !estadosEditables.includes(
        estadoActual,
      )
    ) {

      throw new BadRequestException(
        `No puede modificar el formulario mientras la postulación se encuentra en estado ${estadoActual}.`,
      );
    }


    // ==========================================================
    // VALIDAR FECHA DE NACIMIENTO
    // ==========================================================

    const partesFecha =
      dto.fecha_nacimiento
        .split('-')
        .map(Number);


    const [
      anio,
      mes,
      dia,
    ] = partesFecha;


    const fechaNacimiento =
      new Date(
        `${dto.fecha_nacimiento}T12:00:00.000Z`,
      );


    if (
      Number.isNaN(
        fechaNacimiento.getTime(),
      )
    ) {

      throw new BadRequestException(
        'La fecha de nacimiento no es válida.',
      );
    }


    // Evitar fechas inexistentes como 2026-02-31.

    if (
      fechaNacimiento.getUTCFullYear() !==
        anio ||

      fechaNacimiento.getUTCMonth() + 1 !==
        mes ||

      fechaNacimiento.getUTCDate() !==
        dia
    ) {

      throw new BadRequestException(
        'La fecha de nacimiento no existe.',
      );
    }


    if (
      fechaNacimiento >
      new Date()
    ) {

      throw new BadRequestException(
        'La fecha de nacimiento no puede ser futura.',
      );
    }


    // ==========================================================
    // RESOLVER INSTITUCIÓN
    // ==========================================================

    let finalInstitucionId:
      string | null =
        null;


    let finalInstitucionNombre =
      '';


    // ----------------------------------------------------------
    // OTRA INSTITUCIÓN
    // ----------------------------------------------------------

    if (
      dto.institucion_id ===
      'OTRA'
    ) {

      const nombre =
        (
          dto
            .otra_institucion_nombre ??
          ''
        )
          .trim()
          .toUpperCase();


      if (!nombre) {

        throw new BadRequestException(
          'Debe indicar el nombre de la institución.',
        );
      }


      finalInstitucionId =
        null;

      finalInstitucionNombre =
        nombre;
    }


    // ----------------------------------------------------------
    // INSTITUCIÓN EXISTENTE
    // ----------------------------------------------------------

    else if (
      dto.institucion_id &&
      esUUID(
        dto.institucion_id,
      )
    ) {

      const institucion =
        await this.prisma
          .instituciones_convenio
          .findUnique({

            where: {
              id:
                dto.institucion_id,
            },
          });


      if (!institucion) {

        throw new BadRequestException(
          'La institución seleccionada no existe.',
        );
      }


      if (
        !institucion
          .convenio_activo
      ) {

        throw new BadRequestException(
          'La institución seleccionada no se encuentra activa.',
        );
      }


      finalInstitucionId =
        institucion.id;

      finalInstitucionNombre =
        institucion.nombre;
    }


    // ----------------------------------------------------------
    // INSTITUCIÓN MANUAL
    // ----------------------------------------------------------

    else if (
      dto
        .otra_institucion_nombre
        ?.trim()
    ) {

      finalInstitucionId =
        null;

      finalInstitucionNombre =
        dto
          .otra_institucion_nombre
          .trim()
          .toUpperCase();
    }


    else {

      throw new BadRequestException(
        'Debe seleccionar o indicar una institución.',
      );
    }


    // ==========================================================
    // RESOLVER CARRERA
    // ==========================================================

    let finalCarreraId:
      string | null =
        null;


    let finalCarreraNombre =
      '';


    // ----------------------------------------------------------
    // OTRA CARRERA
    // ----------------------------------------------------------

    if (
      dto.carrera_id ===
      'OTRA'
    ) {

      const nombre =
        (
          dto
            .otra_carrera_nombre ??
          ''
        )
          .trim()
          .toUpperCase();


      if (!nombre) {

        throw new BadRequestException(
          'Debe indicar el nombre de la carrera.',
        );
      }


      finalCarreraId =
        null;

      finalCarreraNombre =
        nombre;
    }


    // ----------------------------------------------------------
    // CARRERA EXISTENTE
    // ----------------------------------------------------------

    else if (
      dto.carrera_id &&
      esUUID(
        dto.carrera_id,
      )
    ) {

      const carrera =
        await this.prisma
          .carreras
          .findUnique({

            where: {
              id:
                dto.carrera_id,
            },
          });


      if (!carrera) {

        throw new BadRequestException(
          'La carrera seleccionada no existe.',
        );
      }


      if (!carrera.activa) {

        throw new BadRequestException(
          'La carrera seleccionada no se encuentra activa.',
        );
      }


      finalCarreraId =
        carrera.id;

      finalCarreraNombre =
        carrera.nombre;
    }


    // ----------------------------------------------------------
    // CARRERA MANUAL
    // ----------------------------------------------------------

    else if (
      dto
        .otra_carrera_nombre
        ?.trim()
    ) {

      finalCarreraId =
        null;

      finalCarreraNombre =
        dto
          .otra_carrera_nombre
          .trim()
          .toUpperCase();
    }


    else {

      throw new BadRequestException(
        'Debe seleccionar o indicar una carrera.',
      );
    }


    // ==========================================================
    // TRANSACCIÓN
    // ==========================================================

    return this.prisma
      .$transaction(

        async (
          tx: Prisma.TransactionClient,
        ) => {

          // ====================================================
          // A. DATOS PERSONALES
          // ====================================================

          await tx
            .postulantes
            .update({

              where: {
                id:
                  postulanteId,
              },

              data: {
                fecha_nacimiento:
                  fechaNacimiento,

                genero:
                  dto.genero,

                updated_at:
                  new Date(),
              },
            });


          // ====================================================
          // B. CONTACTO Y DOMICILIO
          // ====================================================

          await tx
            .datos_contacto_postulante
            .upsert({

              where: {
                postulante_id:
                  postulanteId,
              },

              update: {

                numero_celular:
                  dto
                    .numero_celular
                    .trim(),

                telefono_fijo:
                  dto.telefono_fijo
                    ?.trim() ||
                  null,

                ciudad:
                  (
                    dto.ciudad ||
                    'La Paz'
                  )
                    .trim(),

                zona_domicilio:
                  dto
                    .zona_domicilio
                    .trim()
                    .toUpperCase(),

                direccion_detalle:
                  dto.direccion_detalle
                    ?.trim()
                    .toUpperCase() ||
                  null,
              },

              create: {

                postulante_id:
                  postulanteId,

                numero_celular:
                  dto
                    .numero_celular
                    .trim(),

                telefono_fijo:
                  dto.telefono_fijo
                    ?.trim() ||
                  null,

                ciudad:
                  (
                    dto.ciudad ||
                    'La Paz'
                  )
                    .trim(),

                zona_domicilio:
                  dto
                    .zona_domicilio
                    .trim()
                    .toUpperCase(),

                direccion_detalle:
                  dto.direccion_detalle
                    ?.trim()
                    .toUpperCase() ||
                  null,
              },
            });


          // ====================================================
          // C. FORMACIÓN ACADÉMICA
          // ====================================================

          const formacionExistente =
            await tx
              .formacion_academica_postulante
              .findFirst({

                where: {
                  postulante_id:
                    postulanteId,
                },
              });


          if (
            formacionExistente
          ) {

            await tx
              .formacion_academica_postulante
              .update({

                where: {
                  id:
                    formacionExistente.id,
                },

                data: {

                  institucion_id:
                    finalInstitucionId,

                  institucion_nombre:
                    finalInstitucionNombre,

                  carrera_id:
                    finalCarreraId,

                  carrera:
                    finalCarreraNombre,

                  modalidad_postulacion:
                    dto
                      .modalidad_postulacion,

                  semestre_o_nivel:
                    dto
                      .semestre_o_nivel
                      .trim()
                      .toUpperCase(),
                },
              });

          } else {

            await tx
              .formacion_academica_postulante
              .create({

                data: {

                  postulante_id:
                    postulanteId,

                  institucion_id:
                    finalInstitucionId,

                  institucion_nombre:
                    finalInstitucionNombre,

                  carrera_id:
                    finalCarreraId,

                  carrera:
                    finalCarreraNombre,

                  modalidad_postulacion:
                    dto
                      .modalidad_postulacion,

                  semestre_o_nivel:
                    dto
                      .semestre_o_nivel
                      .trim()
                      .toUpperCase(),
                },
              });
          }


          // ====================================================
          // D. DISPONIBILIDAD HORARIA
          // ====================================================

          await tx
            .disponibilidad_horaria_postulante
            .upsert({

              where: {
                postulante_id:
                  postulanteId,
              },

              update: {
                turno:
                  dto.turno,
              },

              create: {
                postulante_id:
                  postulanteId,

                turno:
                  dto.turno,
              },
            });


          // ====================================================
          // E. ESTADO DE LA POSTULACIÓN ACTUAL
          // ====================================================

          const estadoExistente =
            await tx
              .estados_postulacion
              .findUnique({

                where: {
                  postulacion_id:
                    postulacion.id,
                },
              });


          // Si está OBSERVADO no debe regresar automáticamente
          // a REGISTRADO al volver a guardar el formulario.

          if (!estadoExistente) {

            await tx
              .estados_postulacion
              .create({

                data: {

                  // Campo antiguo temporal.
                  postulante_id:
                    postulanteId,

                  // Relación correcta.
                  postulacion_id:
                    postulacion.id,

                  estado_actual:
                    estado_postulacion_enum
                      .REGISTRADO,

                  observaciones_rrhh:
                    'Formulario completado por el postulante.',

                  fecha_ultimo_cambio:
                    new Date(),
                },
              });
          }


          return {

            message:
              'Formulario registrado correctamente.',

            postulante_id:
              postulanteId,

            postulacion_id:
              postulacion.id,

            numero_intento:
              postulacion.numero_intento,
          };
        },
      );
  }


  // ============================================================
  // RRHH - LISTAR POSTULACIONES
  // ============================================================

  async findAll() {

    return this.prisma
      .postulantes
      .findMany({

        include: {

          datos_contacto_postulante:
            true,

          formacion_academica_postulante:
            true,

          disponibilidad_horaria_postulante:
            true,

          estados_postulacion:
            true,

          documentos_postulante:
            true,

          idiomas_postulante:
            true,

          experiencias_laborales:
            true,

          pasantes_activos:
            true,

          postulaciones: {

            orderBy: {
              numero_intento:
                'desc',
            },

            include: {

              estados_postulacion:
                true,

              documentos_postulante:
                true,
            },
          },
        },

        orderBy: {
          created_at:
            'desc',
        },
      });
  }
// ============================================================
// RRHH - HISTORIAL DE POSTULACIONES FINALIZADAS
// ============================================================

async obtenerHistorialPostulaciones() {

  const postulaciones =
    await this.prisma
      .postulaciones
      .findMany({

        where: {

          estados_postulacion: {
            is: {

             estado_actual: {
                in: [
                  estado_postulacion_enum.DESISTIDO,
                  estado_postulacion_enum.RECHAZADO,
                  estado_postulacion_enum.NO_SELECCIONADO,
                ],
              },

            },
          },

        },

        include: {

          postulantes: {

            include: {

              datos_contacto_postulante:
                true,

              formacion_academica_postulante:
                true,

            },

          },

          estados_postulacion:
            true,

          historial_estados_postulacion: {

            orderBy: {
              created_at:
                'desc',
            },

          },

        },

        orderBy: {

          created_at:
            'desc',

        },

      });


  return postulaciones.map(
    postulacion => ({

      postulacion_id:
        postulacion.id,

      numero_intento:
        postulacion.numero_intento,

      fecha_inicio:
        postulacion.fecha_inicio,

      fecha_cierre:
        postulacion.fecha_cierre,

      postulante: {

        id:
          postulacion.postulantes.id,

        ci:
          postulacion.postulantes.ci,

        expedido:
          postulacion.postulantes.expedido,

        nombres:
          postulacion.postulantes.nombres,

        apellido_paterno:
          postulacion.postulantes.apellido_paterno,

        apellido_materno:
          postulacion.postulantes.apellido_materno,

        datos_contacto_postulante:
          postulacion
            .postulantes
            .datos_contacto_postulante,

        formacion_academica_postulante:
          postulacion
            .postulantes
            .formacion_academica_postulante,

      },

      estado_actual:
        postulacion
          .estados_postulacion
          ?.estado_actual ??
        null,

      motivo:
        postulacion
          .estados_postulacion
          ?.observaciones_rrhh ??
        null,

      fecha_ultimo_cambio:
        postulacion
          .estados_postulacion
          ?.fecha_ultimo_cambio ??
        null,

      historial:
        postulacion
          .historial_estados_postulacion,

    }),
  );
}

  // ============================================================
  // RRHH - CAMBIAR ESTADO
  // ============================================================

  async updateEstado(
  postulanteId: string,

  nuevoEstado:
    estado_postulacion_enum,

  observaciones?: string,
) {

  // ==========================================================
  // COMPROBAR POSTULANTE
  // ==========================================================

  const postulante =
    await this.prisma
      .postulantes
      .findUnique({

        where: {
          id:
            postulanteId,
        },

        select: {
          id:
            true,
        },
      });


  if (!postulante) {

    throw new NotFoundException(
      'El postulante indicado no existe.',
    );
  }


  // ==========================================================
  // OBTENER POSTULACIÓN ACTIVA
  // ==========================================================

  const postulacion =
    await this.obtenerPostulacionActual(
      postulanteId,
    );


  // ==========================================================
  // OBTENER ESTADO ACTUAL
  // ==========================================================

  const estadoRegistrado =
    await this.prisma
      .estados_postulacion
      .findUnique({

        where: {
          postulacion_id:
            postulacion.id,
        },

        select: {
          estado_actual:
            true,
        },
      });


  const estadoActual =
    estadoRegistrado
      ?.estado_actual ??
    estado_postulacion_enum.REGISTRADO;


  // ==========================================================
  // EVITAR MISMO ESTADO
  // ==========================================================

  if (
    estadoActual ===
    nuevoEstado
  ) {

    throw new BadRequestException(
      `La postulación ya se encuentra en estado ${estadoActual}.`,
    );
  }


  // ==========================================================
  // VALIDAR TRANSICIÓN
  // ==========================================================

  const permitido =
    puedeCambiarEstado(
      estadoActual,
      nuevoEstado,
    );


  if (!permitido) {

    throw new BadRequestException(
      `No está permitido cambiar la postulación de ${estadoActual} a ${nuevoEstado}.`,
    );
  }


  // ==========================================================
  // TRANSACCIÓN
  // ==========================================================
  //
  // Si se marca DESISTIDO:
  //
  // 1. Cambiamos el estado.
  // 2. El trigger registra el historial.
  // 3. Cerramos esta postulación.
  //
  // Todo ocurre junto o no ocurre nada.
  // ==========================================================

  return this.prisma
    .$transaction(

      async (
        tx: Prisma.TransactionClient,
      ) => {

        const ahora =
          new Date();


        // ------------------------------------------------------
        // ACTUALIZAR ESTADO
        // ------------------------------------------------------

        const estado =
          await tx
            .estados_postulacion
            .upsert({

              where: {
                postulacion_id:
                  postulacion.id,
              },

              update: {

                estado_actual:
                  nuevoEstado,

                observaciones_rrhh:
                  observaciones
                    ?.trim() ||
                  (
                    nuevoEstado ===
                    estado_postulacion_enum.DESISTIDO

                      ? 'El postulante desistió del proceso de postulación.'

                      : 'Estado actualizado por Talento Humano.'
                  ),

                fecha_ultimo_cambio:
                  ahora,
              },

              create: {

                // Campo temporal de la estructura anterior.
                postulante_id:
                  postulanteId,

                // Relación correcta con el intento.
                postulacion_id:
                  postulacion.id,

                estado_actual:
                  nuevoEstado,

                observaciones_rrhh:
                  observaciones
                    ?.trim() ||
                  (
                    nuevoEstado ===
                    estado_postulacion_enum.DESISTIDO

                      ? 'El postulante desistió del proceso de postulación.'

                      : 'Estado actualizado por Talento Humano.'
                  ),

                fecha_ultimo_cambio:
                  ahora,
              },
            });


        // ------------------------------------------------------
        // SI DESISTE, CERRAR EL INTENTO ACTUAL
        // ------------------------------------------------------

        if (
          nuevoEstado ===
          estado_postulacion_enum.DESISTIDO
        ) {

          await tx
            .postulaciones
            .update({

              where: {
                id:
                  postulacion.id,
              },

              data: {

                fecha_cierre:
                  ahora,

                updated_at:
                  ahora,
              },
            });
        }


        return estado;
      },
    );
}


  // ============================================================
  // RRHH - REVISAR DOCUMENTOS
  // ============================================================

  async revisarDocumentos(
  postulanteId: string,

  data: {
    revisiones: Array<{
      documento_id: string;
      verificado: boolean;
      observacion?: string;
    }>;

    observacion_general?: string;
  },
) {

  const postulante =
    await this.prisma
      .postulantes
      .findUnique({

        where: {
          id:
            postulanteId,
        },

        select: {
          id:
            true,

          nombres:
            true,

          apellido_paterno:
            true,

          apellido_materno:
            true,

          usuarios_sistema: {
            select: {
              email:
                true,
            },
          },
        },

      });


  if (!postulante) {

    throw new NotFoundException(
      'El postulante indicado no existe.',
    );

  }


  const postulacion =
    await this.obtenerPostulacionActual(
      postulanteId,
    );


  if (
    !Array.isArray(
      data.revisiones,
    ) ||
    data.revisiones.length === 0
  ) {

    throw new BadRequestException(
      'Debe enviar al menos un documento para revisar.',
    );

  }


  for (
    const revision
    of data.revisiones
  ) {

    if (
      !esUUID(
        revision.documento_id,
      )
    ) {

      throw new BadRequestException(
        'Uno de los identificadores de documento no es válido.',
      );

    }

  }


  const idsUnicos = [
    ...new Set(
      data.revisiones.map(
        revision =>
          revision.documento_id,
      ),
    ),
  ];


  if (
    idsUnicos.length !==
    data.revisiones.length
  ) {

    throw new BadRequestException(
      'No puede enviar el mismo documento más de una vez en la revisión.',
    );

  }


  const documentos =
    await this.prisma
      .documentos_postulante
      .findMany({

        where: {

          postulacion_id:
            postulacion.id,

          id: {
            in:
              idsUnicos,
          },

        },

        select: {
          id:
            true,
        },

      });


  if (
    documentos.length !==
    idsUnicos.length
  ) {

    throw new BadRequestException(
      'Uno o más documentos no pertenecen a la postulación indicada.',
    );

  }


  const estadoRegistrado =
    await this.prisma
      .estados_postulacion
      .findUnique({

        where: {
          postulacion_id:
            postulacion.id,
        },

        select: {
          estado_actual:
            true,
        },

      });


  const estadoActual =
    estadoRegistrado
      ?.estado_actual ??
    estado_postulacion_enum
      .REGISTRADO;


  if (
    estadoActual !==
    estado_postulacion_enum
      .EN_EVALUACION_RRHH
  ) {

    throw new BadRequestException(
      `No se puede revisar la documentación cuando la postulación se encuentra en estado ${estadoActual}.`,
    );

  }


  const resultado =
    await this.prisma
      .$transaction(

        async (
          tx: Prisma.TransactionClient,
        ) => {

          for (
            const revision
            of data.revisiones
          ) {

            await tx
              .documentos_postulante
              .update({

                where: {
                  id:
                    revision.documento_id,
                },

                data: {

                  verificado:
                    revision.verificado,

                  observacion:
                    revision.verificado
                      ? null
                      : (
                          revision
                            .observacion
                            ?.trim() ||
                          null
                        ),

                },

              });

          }


          const documentosActualizados =
            await tx
              .documentos_postulante
              .findMany({

                where: {
                  postulacion_id:
                    postulacion.id,
                },

                select: {

                  id:
                    true,

                  tipo_documento:
                    true,

                  verificado:
                    true,

                  observacion:
                    true,

                },

              });


          const tieneLosSieteDocumentos =
            documentosActualizados
              .length >= 7;


          const todosVerificados =
            documentosActualizados
              .every(
                documento =>
                  documento.verificado ===
                  true,
              );


          const tieneObservaciones =
            !tieneLosSieteDocumentos ||
            !todosVerificados;


          const estadoFinal =
            tieneObservaciones

              ? estado_postulacion_enum
                  .OBSERVADO

              : estado_postulacion_enum
                  .APROBADO;


          if (
            !puedeCambiarEstado(
              estadoActual,
              estadoFinal,
            )
          ) {

            throw new BadRequestException(
              `No está permitido cambiar la postulación de ${estadoActual} a ${estadoFinal}.`,
            );

          }


          await tx
            .estados_postulacion
            .upsert({

              where: {
                postulacion_id:
                  postulacion.id,
              },

              update: {

                estado_actual:
                  estadoFinal,

                observaciones_rrhh:
                  data
                    .observacion_general
                    ?.trim() ||
                  (
                    tieneObservaciones
                      ? 'Documentación con observaciones.'
                      : 'Documentación verificada correctamente.'
                  ),

                fecha_ultimo_cambio:
                  new Date(),

              },

              create: {

                postulante_id:
                  postulanteId,

                postulacion_id:
                  postulacion.id,

                estado_actual:
                  estadoFinal,

                observaciones_rrhh:
                  data
                    .observacion_general
                    ?.trim() ||
                  (
                    tieneObservaciones
                      ? 'Documentación con observaciones.'
                      : 'Documentación verificada correctamente.'
                  ),

                fecha_ultimo_cambio:
                  new Date(),

              },

            });


          const observacionesCorreo =
            documentosActualizados
              .filter(
                documento =>
                  documento.verificado ===
                    false &&
                  Boolean(
                    documento
                      .observacion
                      ?.trim(),
                  ),
              )
              .map(
                documento => ({

                  tipo_documento:
                    String(
                      documento
                        .tipo_documento,
                    ),

                  observacion:
                    documento
                      .observacion
                      ?.trim() ||
                    '',

                }),
              );


          return {

            message:
              'Revisión guardada exitosamente.',

            postulacion_id:
              postulacion.id,

            numero_intento:
              postulacion.numero_intento,

            estado:
              estadoFinal,

            documentos_revisados:
              data.revisiones.length,

            documentos_registrados:
              documentosActualizados.length,

            observaciones_correo:
              observacionesCorreo,

          };

        },

      );


  let correoEnviado =
    false;

  let mensajeCorreo:
    string | null =
      null;


  if (
    resultado.estado ===
    estado_postulacion_enum
      .OBSERVADO
  ) {

    const email =
      postulante
        .usuarios_sistema
        ?.email
        ?.trim();


    const nombreCompleto =
      [
        postulante.nombres,
        postulante.apellido_paterno,
        postulante.apellido_materno,
      ]
        .filter(
          nombre =>
            Boolean(
              String(
                nombre || '',
              ).trim(),
            ),
        )
        .join(' ')
        .trim();


    if (!email) {

      mensajeCorreo =
        'El postulante no tiene un correo electrónico asociado.';

      console.warn(
        '[MAIL OBSERVACIONES] El postulante no tiene correo electrónico asociado.',
      );

    } else if (
      resultado
        .observaciones_correo
        .length === 0
    ) {

      mensajeCorreo =
        'La postulación quedó observada, pero no existen observaciones específicas para enviar.';

      console.warn(
        '[MAIL OBSERVACIONES] No existen observaciones específicas para enviar.',
      );

    } else {

      try {

        await this.mailService
          .enviarObservacionesPostulacion(
            email,
            nombreCompleto ||
              'Postulante',
            resultado
              .observaciones_correo,
            data
              .observacion_general
              ?.trim(),
          );


        correoEnviado =
          true;

        mensajeCorreo =
          'Correo de observaciones enviado correctamente.';


        console.log(
          '[MAIL OBSERVACIONES] Correo enviado correctamente.',
        );

      } catch (error) {

        correoEnviado =
          false;

        mensajeCorreo =
          'La revisión fue guardada, pero no se pudo enviar el correo electrónico.';


        console.error(
          '[MAIL OBSERVACIONES] Error al enviar el correo:',
          error,
        );

      }

    }

  }


  return {

    message:
      resultado.message,

    postulacion_id:
      resultado.postulacion_id,

    numero_intento:
      resultado.numero_intento,

    estado:
      resultado.estado,

    documentos_revisados:
      resultado
        .documentos_revisados,

    documentos_registrados:
      resultado
        .documentos_registrados,

    correo_enviado:
      correoEnviado,

    mensaje_correo:
      mensajeCorreo,

  };

}
}