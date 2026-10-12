import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import {
  estado_postulacion_enum,
  estado_solicitud_pasante_enum,
  tipo_reporte_comportamiento_enum,
  Prisma,
  tipo_documento_postulacion_enum,
} from '@prisma/client';

import * as bcrypt from 'bcrypt';

import {
  MailService,
} from '../auth/mail.service';

import {
  PrismaService,
} from '../prisma/prisma.service';


type CrearReporteComportamientoInput = {
  tipo?: string;
  titulo?: string;
  descripcion?: string;
  fecha_reporte?: string;
};

@Injectable()
export class SupervisorService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService:
    MailService,
  ) {}


  // ============================================================
  // VALIDAR CONTRASEÑA DEL SUPERVISOR
  // ============================================================

  private async validarPasswordSupervisor(
    supervisorId: string,
    passwordAutorizacion: string,
  ) {

    const password =
      String(
        passwordAutorizacion ?? '',
      );


    // ----------------------------------------------------------
    // No hacemos trim() antes de bcrypt.compare(),
    // porque una contraseña válida puede contener espacios.
    // ----------------------------------------------------------

    if (
      !password.trim()
    ) {

      throw new BadRequestException(
        'Debe ingresar su contraseña para autorizar la operación.',
      );

    }


    const supervisor =
      await this.prisma
        .usuarios_administrativos
        .findUnique({

          where: {
            id:
              supervisorId,
          },

          select: {

            id:
              true,

            rol:
              true,

            activo:
              true,

            departamento_id:
              true,

            password_hash:
              true,

          },

        });


    if (
      !supervisor ||
      !supervisor.activo
    ) {

      throw new ForbiddenException(
        'El usuario Supervisor no se encuentra autorizado.',
      );

    }


    if (
      supervisor.rol !==
      'SUPERVISOR'
    ) {

      throw new ForbiddenException(
        'El usuario no tiene permisos de Supervisor.',
      );

    }


    const passwordCorrecto =
      await bcrypt.compare(
        password,
        supervisor.password_hash,
      );


    if (
      !passwordCorrecto
    ) {

      throw new UnauthorizedException(
        'La contraseña ingresada es incorrecta.',
      );

    }


    return supervisor;

  }


  // ============================================================
  // OBTENER POSTULANTES APROBADOS DISPONIBLES
  // ============================================================

  async obtenerPostulantesDisponibles(
    departamentoId: string,
  ) {

    // ==========================================================
    // 1. VALIDAR DEPARTAMENTO DEL SUPERVISOR
    // ==========================================================

    const departamento =
      await this.prisma
        .departamentos
        .findUnique({

          where: {
            id:
              departamentoId,
          },

          select: {

            id:
              true,

            nombre:
              true,

            activo:
              true,

            gerencias: {

              select: {

                id:
                  true,

                nombre:
                  true,

                activo:
                  true,

              },

            },

          },

        });


    if (!departamento) {

      throw new NotFoundException(
        'El Departamento asignado al supervisor no existe.',
      );

    }


    if (
      !departamento.activo ||
      !departamento.gerencias.activo
    ) {

      throw new ForbiddenException(
        'El Departamento o la Gerencia asignada no se encuentra activa.',
      );

    }


    // ==========================================================
    // 2. OBTENER TODAS LAS POSTULACIONES APROBADAS
    // ==========================================================
    //
    // La bolsa NO depende de requerimientos.
    //
    // Solo aparecen:
    //
    // - postulaciones abiertas;
    // - APROBADAS por RRHH;
    // - postulantes que todavía no son pasantes activos.
    //
    // ==========================================================

    const postulaciones =
      await this.prisma
        .postulaciones
        .findMany({

          where: {

            fecha_cierre:
              null,

            estados_postulacion: {

              is: {

                estado_actual:
                  estado_postulacion_enum
                    .APROBADO,

              },

            },

            postulantes: {

              is: {

                pasantes_activos:
                  null,

              },

            },

          },


          select: {

            id:
              true,

            numero_intento:
              true,

            fecha_inicio:
              true,


            // ==================================================
            // ESTADO
            // ==================================================

            estados_postulacion: {

              select: {

                estado_actual:
                  true,

                fecha_ultimo_cambio:
                  true,

              },

            },


            // ==================================================
            // DOCUMENTOS PERMITIDOS PARA EL SUPERVISOR
            // ==================================================

            documentos_postulante: {

              where: {

                tipo_documento: {

                  in: [

                    tipo_documento_postulacion_enum
                      .HOJA_DE_VIDA,

                    tipo_documento_postulacion_enum
                      .RECORD_ACADEMICO,

                  ],

                },

              },

              select: {

                id:
                  true,

                tipo_documento:
                  true,

                verificado:
                  true,

                uploaded_at:
                  true,

              },

            },


            // ==================================================
            // POSTULANTE
            // ==================================================

            postulantes: {

              select: {

                id:
                  true,

                nombres:
                  true,

                apellido_paterno:
                  true,

                apellido_materno:
                  true,


                // ==============================================
                // FORMACIÓN ACADÉMICA
                // ==============================================

                formacion_academica_postulante: {

                  select: {

                    id:
                      true,

                    carrera_id:
                      true,

                    carrera:
                      true,

                    institucion_id:
                      true,

                    institucion_nombre:
                      true,

                    institucion_tipo:
                      true,

                    semestre_o_nivel:
                      true,

                    modalidad_postulacion:
                      true,

                  },

                },


                // ==============================================
                // DISPONIBILIDAD
                // ==============================================

                disponibilidad_horaria_postulante: {

                  select: {

                    turno:
                      true,

                  },

                },

              },

            },

          },


          orderBy: {

            fecha_inicio:
              'desc',

          },

        });


    // ==========================================================
    // 3. FORMATEAR POSTULANTES
    // ==========================================================

    const postulantesDisponibles =
      postulaciones.map(
        postulacion => {

          const persona =
            postulacion.postulantes;


          // ----------------------------------------------------
          // HOJA DE VIDA
          // ----------------------------------------------------

          const hojaVida =
            postulacion
              .documentos_postulante
              .find(
                documento =>
                  documento.tipo_documento ===
                  tipo_documento_postulacion_enum
                    .HOJA_DE_VIDA,
              );


          // ----------------------------------------------------
          // RÉCORD ACADÉMICO
          // ----------------------------------------------------

          const recordAcademico =
            postulacion
              .documentos_postulante
              .find(
                documento =>
                  documento.tipo_documento ===
                  tipo_documento_postulacion_enum
                    .RECORD_ACADEMICO,
              );


          return {

            // ==================================================
            // IDENTIFICADORES INTERNOS
            // ==================================================

            postulacion_id:
              postulacion.id,

            postulante_id:
              persona.id,


            // ==================================================
            // NOMBRE
            // ==================================================

            nombre_completo:
              [

                persona.nombres,

                persona.apellido_paterno,

                persona.apellido_materno,

              ]
                .filter(Boolean)
                .join(' '),


            numero_intento:
              postulacion.numero_intento,

            es_repostulacion:
              postulacion.numero_intento >
              1,


            // ==================================================
            // ESTADO
            // ==================================================

            estado_actual:
              postulacion
                .estados_postulacion
                ?.estado_actual ??
              null,

            fecha_aprobacion:
              postulacion
                .estados_postulacion
                ?.fecha_ultimo_cambio ??
              null,


            // ==================================================
            // FORMACIÓN
            // ==================================================

            formacion:
              persona
                .formacion_academica_postulante,


            // ==================================================
            // TURNO
            // ==================================================

            turno:
              persona
                .disponibilidad_horaria_postulante
                ?.turno ??
              null,


            // ==================================================
            // DOCUMENTACIÓN
            // ==================================================

            documentos: {

              hoja_vida:
                hojaVida
                  ? {

                      id:
                        hojaVida.id,

                      tipo_documento:
                        hojaVida
                          .tipo_documento,

                      archivo_endpoint:
                        `/documentos/${hojaVida.id}/archivo`,

                    }
                  : null,


              record_academico:
                recordAcademico
                  ? {

                      id:
                        recordAcademico.id,

                      tipo_documento:
                        recordAcademico
                          .tipo_documento,

                      archivo_endpoint:
                        `/documentos/${recordAcademico.id}/archivo`,

                    }
                  : null,

            },

          };

        },
      );


    // ==========================================================
    // 4. CARRERAS PARA FILTROS
    // ==========================================================

    const carreras =
      [
        ...new Set(

          postulantesDisponibles
            .flatMap(
              postulante =>

                postulante
                  .formacion
                  .map(
                    formacion =>
                      formacion.carrera,
                  ),

            )
            .filter(Boolean),

        ),
      ]
        .sort();


    // ==========================================================
    // 5. SEMESTRES / NIVELES
    // ==========================================================

    const semestres =
      [
        ...new Set(

          postulantesDisponibles
            .flatMap(
              postulante =>

                postulante
                  .formacion
                  .map(
                    formacion =>
                      formacion
                        .semestre_o_nivel,
                  ),

            )
            .filter(Boolean),

        ),
      ]
        .sort();


    // ==========================================================
    // 6. MODALIDADES
    // ==========================================================

    const modalidades =
      [
        ...new Set(

          postulantesDisponibles
            .flatMap(
              postulante =>

                postulante
                  .formacion
                  .map(
                    formacion =>
                      formacion
                        .modalidad_postulacion,
                  ),

            )
            .filter(Boolean),

        ),
      ]
        .sort();


    // ==========================================================
    // 7. TURNOS
    // ==========================================================

    const turnos =
      [
        ...new Set(

          postulantesDisponibles
            .map(
              postulante =>
                postulante.turno,
            )
            .filter(
              (
                turno,
              ): turno is NonNullable<
                typeof turno
              > =>
                Boolean(turno),
            ),

        ),
      ]
        .sort();


    // ==========================================================
    // 8. RESPUESTA
    // ==========================================================

    return {

      departamento: {

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

      },


      total_postulantes:
        postulantesDisponibles.length,


      filtros: {

        carreras,

        semestres,

        modalidades,

        turnos,

      },


      postulantes:
        postulantesDisponibles,

    };

  }


  // ============================================================
  // SOLICITAR PASANTE
  // ============================================================

  async solicitarPasante(
    supervisorId: string,
    departamentoId: string,
    postulacionId: string,
    actividadesPasante: string,
  ) {

    // ==========================================================
    // 1. VALIDAR ACTIVIDADES
    // ==========================================================

    const actividades =
      String(
        actividadesPasante ?? '',
      )
        .trim();


    if (!actividades) {

      throw new BadRequestException(
        'Debe describir las actividades que realizará el pasante.',
      );

    }


    if (
      actividades.length >
      1500
    ) {

      throw new BadRequestException(
        'La descripción de actividades no puede superar los 1500 caracteres.',
      );

    }


    // ==========================================================
    // 2. VALIDAR SUPERVISOR
    // ==========================================================

    const supervisor =
      await this.prisma
        .usuarios_administrativos
        .findUnique({

          where: {
            id:
              supervisorId,
          },

          select: {

            id:
              true,

            rol:
              true,

            activo:
              true,

            departamento_id:
              true,

          },

        });


    if (
      !supervisor ||
      !supervisor.activo ||
      supervisor.rol !==
        'SUPERVISOR'
    ) {

      throw new ForbiddenException(
        'El usuario no se encuentra autorizado para solicitar pasantes.',
      );

    }


    if (
      !supervisor.departamento_id ||
      supervisor.departamento_id !==
        departamentoId
    ) {

      throw new ForbiddenException(
        'El Supervisor no pertenece al Departamento indicado.',
      );

    }


    // ==========================================================
    // 3. TRANSACCIÓN
    // ==========================================================

    try {

      const resultado =
        await this.prisma
          .$transaction(
            async tx => {

              // =================================================
              // BUSCAR POSTULACIÓN
              // =================================================

              const postulacion =
                await tx
                  .postulaciones
                  .findUnique({

                    where: {
                      id:
                        postulacionId,
                    },

                    select: {

                      id:
                        true,

                      postulante_id:
                        true,

                      fecha_cierre:
                        true,


                      estados_postulacion: {

                        select: {

                          estado_actual:
                            true,

                        },

                      },


                      postulantes: {

                        select: {

                          pasantes_activos: {

                            select: {

                              id:
                                true,

                              estado:
                                true,

                            },

                          },

                        },

                      },

                    },

                  });


              if (!postulacion) {

                throw new NotFoundException(
                  'La postulación seleccionada no existe.',
                );

              }


              // =================================================
              // POSTULACIÓN CERRADA
              // =================================================

              if (
                postulacion
                  .fecha_cierre
              ) {

                throw new ConflictException(
                  'La postulación ya se encuentra cerrada.',
                );

              }


              // =================================================
              // DEBE ESTAR APROBADO
              // =================================================

              if (
                postulacion
                  .estados_postulacion
                  ?.estado_actual !==
                estado_postulacion_enum
                  .APROBADO
              ) {

                throw new ConflictException(
                  'El postulante ya no se encuentra disponible para solicitud.',
                );

              }


              // =================================================
              // NO DEBE SER PASANTE ACTIVO
              // =================================================

              if (
                postulacion
                  .postulantes
                  .pasantes_activos
              ) {

                throw new ConflictException(
                  'El postulante ya se encuentra registrado como pasante.',
                );

              }


              // =================================================
              // VERIFICAR SOLICITUD ACTIVA
              // =================================================

              const solicitudExistente =
                await tx
                  .solicitudes_pasante_supervisor
                  .findFirst({

                    where: {

                      postulacion_id:
                        postulacionId,

                      estado: {

                        in: [

                          estado_solicitud_pasante_enum
                            .PENDIENTE_RRHH,

                          estado_solicitud_pasante_enum
                            .APROBADA,

                        ],

                      },

                    },

                    select: {

                      id:
                        true,

                      estado:
                        true,

                    },

                  });


              if (
                solicitudExistente
              ) {

                throw new ConflictException(
                  'Este postulante ya fue solicitado por otro Supervisor.',
                );

              }


              // =================================================
              // CREAR SOLICITUD
              // =================================================

              const solicitud =
                await tx
                  .solicitudes_pasante_supervisor
                  .create({

                    data: {

                      supervisor_id:
                        supervisorId,

                      departamento_id:
                        departamentoId,

                      postulacion_id:
                        postulacionId,

                      actividades_pasante:
                        actividades,

                      estado:
                        estado_solicitud_pasante_enum
                          .PENDIENTE_RRHH,

                    },

                    select: {

                      id:
                        true,

                      postulacion_id:
                        true,

                      departamento_id:
                        true,

                      supervisor_id:
                        true,

                      actividades_pasante:
                        true,

                      estado:
                        true,

                      created_at:
                        true,

                    },

                  });


              // =================================================
              // CAMBIAR ESTADO DE POSTULACIÓN
              // =================================================

              await tx
                .estados_postulacion
                .update({

                  where: {

                    postulacion_id:
                      postulacionId,

                  },

                  data: {

                    estado_actual:
                      estado_postulacion_enum
                        .SELECCIONADO_POR_AREA,

                    fecha_ultimo_cambio:
                      new Date(),

                  },

                });


              // =================================================
              // AUDITORÍA
              // =================================================

              await tx
                .auditoria_logs
                .create({

                  data: {

                    administrativo_id:
                      supervisorId,

                    accion:
                      'SOLICITAR_PASANTE',

                    tabla_afectada:
                      'solicitudes_pasante_supervisor',

                    registro_id:
                      solicitud.id,

                    detalles: {

                      postulacion_id:
                        postulacionId,

                      departamento_id:
                        departamentoId,

                      estado:
                        'PENDIENTE_RRHH',

                    },

                  },

                });


              return solicitud;

            },
          );


      let correoEnviado =
  false;


try {

  const detalleSolicitud =
    await this.prisma
      .solicitudes_pasante_supervisor
      .findUnique({

        where: {
          id:
            resultado.id,
        },

        select: {

          created_at:
            true,

          actividades_pasante:
            true,

          departamentos: {
            select: {
              nombre:
                true,
            },
          },

          usuarios_administrativos: {
            select: {
              nombres:
                true,

              apellidos:
                true,
            },
          },

          postulaciones: {
            select: {

              postulantes: {
                select: {

                  nombres:
                    true,

                  apellido_paterno:
                    true,

                  apellido_materno:
                    true,

                },
              },

            },
          },

        },

      });


  const usuariosRrhh =
    await this.prisma
      .usuarios_administrativos
      .findMany({

        where: {

          activo:
            true,

          rol:
            'ADMIN_RRHH',

        },

        select: {
          email:
            true,
        },

      });


  const destinatarios =
    usuariosRrhh
      .map(
        usuario =>
          usuario.email.trim(),
      )
      .filter(Boolean);


  if (
    detalleSolicitud &&
    destinatarios.length > 0
  ) {

    const supervisorNombre =
      [
        detalleSolicitud
          .usuarios_administrativos
          .nombres,

        detalleSolicitud
          .usuarios_administrativos
          .apellidos,
      ]
        .filter(Boolean)
        .join(' ');


    const postulante =
      detalleSolicitud
        .postulaciones
        .postulantes;


    const pasanteNombre =
      [
        postulante.nombres,
        postulante.apellido_paterno,
        postulante.apellido_materno,
      ]
        .filter(Boolean)
        .join(' ');


    await this.mailService
      .enviarPeticionPasanteRrhh(
        destinatarios,
        {

          area:
            detalleSolicitud
              .departamentos
              .nombre,

          supervisor:
            supervisorNombre,

          pasante:
            pasanteNombre,

          fechaSolicitud:
            detalleSolicitud
              .created_at,

          actividades:
            detalleSolicitud
              .actividades_pasante,

        },
      );


    correoEnviado =
      true;

  }


      } catch (error) {

        console.error(
          '[MAIL PETICION PASANTE] La solicitud fue registrada, pero no se pudo enviar el correo:',
          error,
        );

      }


      return {

        message:
          'La solicitud del pasante fue enviada correctamente a Talento Humano.',

        solicitud:
          resultado,

        correo_rrhh_enviado:
          correoEnviado,

      };

    } catch (error) {

      // ========================================================
      // CONTROL DE CONCURRENCIA
      // ========================================================

      if (
        error instanceof
          Prisma.PrismaClientKnownRequestError &&
        error.code ===
          'P2002'
      ) {

        throw new ConflictException(
          'El postulante ya fue solicitado y dejó de estar disponible.',
        );

      }


      throw error;

    }

  }


  // ============================================================
  // SOLICITAR LOTE DE POSTULANTES (UN SOLO CORREO)
  // ============================================================
  async solicitarPasantesLote(
    supervisorId: string,
    departamentoId: string,
    solicitudes: ReadonlyArray<{
      postulacion_id: string;
      actividades_pasante: string;
    }>,
  ) {
    if (!Array.isArray(solicitudes) || solicitudes.length < 1 || solicitudes.length > 30) {
      throw new BadRequestException('Debe seleccionar entre 1 y 30 postulantes.');
    }

    const ids = solicitudes.map(item => item.postulacion_id);
    if (new Set(ids).size !== ids.length) {
      throw new BadRequestException('No se puede repetir una postulación en el mismo envío.');
    }

    const entradas = solicitudes.map(item => ({
      postulacion_id: item.postulacion_id,
      actividades_pasante: item.actividades_pasante.trim(),
    }));
    if (entradas.some(item => !item.actividades_pasante || item.actividades_pasante.length > 1500)) {
      throw new BadRequestException('Cada postulante debe tener actividades de entre 1 y 1500 caracteres.');
    }

    const supervisor = await this.prisma.usuarios_administrativos.findUnique({
      where: { id: supervisorId },
      select: {
        activo: true, rol: true, departamento_id: true,
        nombres: true, apellidos: true,
        departamentos: { select: { nombre: true, activo: true, gerencias: { select: { activo: true } } } },
      },
    });
    if (!supervisor || !supervisor.activo || supervisor.rol !== 'SUPERVISOR' ||
      supervisor.departamento_id !== departamentoId ||
      !supervisor.departamentos?.activo || !supervisor.departamentos.gerencias.activo) {
      throw new ForbiddenException('El supervisor o su departamento no están autorizados.');
    }

    // Operación atómica: todo el lote se guarda o nada se guarda.
    // La actualización condicional impide que dos supervisores reclamen el mismo estado APROBADO.
    let creadas: Array<{ id: string; postulacion_id: string; actividades_pasante: string; created_at: Date }>;
    try {
      creadas = await this.prisma.$transaction(async tx => {
        const postulaciones = await tx.postulaciones.findMany({
          where: { id: { in: ids } },
          select: {
            id: true,
            fecha_cierre: true,
            postulantes: { select: { pasantes_activos: { select: { id: true } } } },
          },
        });
        const porId = new Map(postulaciones.map(item => [item.id, item]));
        const resultado: Array<{ id: string; postulacion_id: string; actividades_pasante: string; created_at: Date }> = [];

        for (const item of entradas) {
          const postulacion = porId.get(item.postulacion_id);
          if (!postulacion || postulacion.fecha_cierre || postulacion.postulantes.pasantes_activos) {
            throw new ConflictException('Una de las postulaciones no existe o ya no está disponible. Actualice la lista.');
          }
          const solicitudPrevia = await tx.solicitudes_pasante_supervisor.findFirst({
            where: {
              postulacion_id: item.postulacion_id,
              estado: { in: [estado_solicitud_pasante_enum.PENDIENTE_RRHH, estado_solicitud_pasante_enum.APROBADA] },
            },
            select: { id: true },
          });
          if (solicitudPrevia) {
            throw new ConflictException('Uno de los postulantes ya fue solicitado por otro supervisor.');
          }
          const reserva = await tx.estados_postulacion.updateMany({
            where: { postulacion_id: item.postulacion_id, estado_actual: estado_postulacion_enum.APROBADO },
            data: { estado_actual: estado_postulacion_enum.SELECCIONADO_POR_AREA, fecha_ultimo_cambio: new Date() },
          });
          if (reserva.count !== 1) {
            throw new ConflictException('Uno de los postulantes dejó de estar disponible. Ninguna solicitud del lote fue registrada.');
          }
          const nueva = await tx.solicitudes_pasante_supervisor.create({
            data: {
              supervisor_id: supervisorId,
              departamento_id: departamentoId,
              postulacion_id: item.postulacion_id,
              actividades_pasante: item.actividades_pasante,
              estado: estado_solicitud_pasante_enum.PENDIENTE_RRHH,
            },
            select: { id: true, postulacion_id: true, actividades_pasante: true, created_at: true },
          });
          await tx.auditoria_logs.create({
            data: {
              administrativo_id: supervisorId,
              accion: 'SOLICITAR_PASANTE',
              tabla_afectada: 'solicitudes_pasante_supervisor',
              registro_id: nueva.id,
              detalles: { postulacion_id: item.postulacion_id, departamento_id: departamentoId, estado: 'PENDIENTE_RRHH', tipo_envio: 'LOTE' },
            },
          });
          resultado.push(nueva);
        }
        return resultado;
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, maxWait: 5000, timeout: 15000 });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && ['P2002', 'P2034'].includes(error.code)) {
        throw new ConflictException('Los postulantes cambiaron de disponibilidad. Actualice la lista e intente nuevamente.');
      }
      throw error;
    }

    // El correo se envía DESPUÉS del commit y una sola vez, no en el bucle.
    let correoEnviado = false;
    try {
      const [registros, usuariosRrhh] = await Promise.all([
        this.prisma.solicitudes_pasante_supervisor.findMany({
          where: { id: { in: creadas.map(item => item.id) } },
          select: {
            id: true, postulacion_id: true, actividades_pasante: true, created_at: true,
            postulaciones: { select: { postulantes: { select: { nombres: true, apellido_paterno: true, apellido_materno: true } } } },
          },
        }),
        this.prisma.usuarios_administrativos.findMany({
          where: { activo: true, rol: 'ADMIN_RRHH' }, select: { email: true },
        }),
      ]);
      const destinatarios = [...new Set(usuariosRrhh.map(u => u.email.trim()).filter(Boolean))];
      if (destinatarios.length) {
        const porSolicitud = new Map(registros.map(item => [item.id, item]));
        await this.mailService.enviarPeticionesPasantesRrhh(destinatarios, {
          area: supervisor.departamentos.nombre,
          supervisor: [supervisor.nombres, supervisor.apellidos].filter(Boolean).join(' '),
          fechaSolicitud: creadas[0].created_at,
          postulantes: creadas.map(item => {
            const registro = porSolicitud.get(item.id);
            if (!registro) throw new Error('No se pudo recuperar una solicitud creada.');
            const persona = registro.postulaciones.postulantes;
            return {
              nombre: [persona.nombres, persona.apellido_paterno, persona.apellido_materno].filter(Boolean).join(' '),
              actividades: registro.actividades_pasante,
            };
          }),
        });
        correoEnviado = true;
      }
    } catch (error) {
      console.error('[MAIL LOTE] Solicitudes guardadas, correo no confirmado:', error);
    }

    return {
      message: correoEnviado
        ? `${creadas.length} solicitud(es) registradas. Se envió un correo consolidado a RRHH.`
        : `${creadas.length} solicitud(es) registradas. El correo a RRHH no pudo confirmarse; no reenvíe el lote.`,
      total: creadas.length,
      solicitudes: creadas,
      correo_rrhh_enviado: correoEnviado,
    };
  }

  // ============================================================
  // HISTORIAL DE SOLICITUDES DEL SUPERVISOR
  // ============================================================

  async obtenerSolicitudesSupervisor(
    supervisorId: string,
  ) {

    // ==========================================================
    // 1. VALIDAR SUPERVISOR
    // ==========================================================

    const supervisor =
      await this.prisma
        .usuarios_administrativos
        .findUnique({

          where: {
            id:
              supervisorId,
          },

          select: {

            id:
              true,

            rol:
              true,

            activo:
              true,

          },

        });


    if (
      !supervisor ||
      !supervisor.activo ||
      supervisor.rol !==
        'SUPERVISOR'
    ) {

      throw new ForbiddenException(
        'El usuario no se encuentra autorizado para consultar solicitudes.',
      );

    }


    // ==========================================================
    // 2. CONSULTAR SOLICITUDES DEL SUPERVISOR
    // ==========================================================

    const solicitudes =
      await this.prisma
        .solicitudes_pasante_supervisor
        .findMany({

          where: {

            supervisor_id:
              supervisorId,

          },


          select: {

            id:
              true,

            actividades_pasante:
              true,

            estado:
              true,

            respuesta_rrhh:
              true,

            fecha_resolucion:
              true,

            motivo_cancelacion:
              true,

            fecha_cancelacion:
              true,

            created_at:
              true,

            updated_at:
              true,


            postulaciones: {

              select: {

                id:
                  true,

                numero_intento:
                  true,


                postulantes: {

                  select: {

                    id:
                      true,

                    nombres:
                      true,

                    apellido_paterno:
                      true,

                    apellido_materno:
                      true,


                    formacion_academica_postulante: {

                      select: {

                        id:
                          true,

                        carrera:
                          true,

                        institucion_nombre:
                          true,

                        semestre_o_nivel:
                          true,

                        modalidad_postulacion:
                          true,

                      },

                    },


                    disponibilidad_horaria_postulante: {

                      select: {

                        turno:
                          true,

                      },

                    },

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
    // 3. FORMATEAR RESPUESTA
    // ==========================================================

    const solicitudesFormateadas =
      solicitudes.map(
        solicitud => {

          const postulante =
            solicitud
              .postulaciones
              .postulantes;


          return {

            id:
              solicitud.id,

            postulacion_id:
              solicitud
                .postulaciones
                .id,

            numero_intento:
              solicitud
                .postulaciones
                .numero_intento,


            // ==================================================
            // POSTULANTE
            // ==================================================

            postulante: {

              id:
                postulante.id,

              nombre_completo:
                [

                  postulante.nombres,

                  postulante
                    .apellido_paterno,

                  postulante
                    .apellido_materno,

                ]
                  .filter(Boolean)
                  .join(' '),

              formacion:
                postulante
                  .formacion_academica_postulante,

              turno:
                postulante
                  .disponibilidad_horaria_postulante
                  ?.turno ??
                null,

            },


            // ==================================================
            // SOLICITUD
            // ==================================================

            actividades_pasante:
              solicitud
                .actividades_pasante,

            estado:
              solicitud.estado,

            fecha_solicitud:
              solicitud.created_at,


            // ==================================================
            // RESPUESTA RRHH
            // ==================================================

            respuesta_rrhh:
              solicitud
                .respuesta_rrhh,

            fecha_resolucion:
              solicitud
                .fecha_resolucion,


            // ==================================================
            // CANCELACIÓN
            // ==================================================

            motivo_cancelacion:
              solicitud
                .motivo_cancelacion,

            fecha_cancelacion:
              solicitud
                .fecha_cancelacion,


            // ==================================================
            // PERMISO PARA CANCELAR
            // ==================================================

            puede_cancelar:
              solicitud.estado ===
              estado_solicitud_pasante_enum
                .PENDIENTE_RRHH,

          };

        },
      );


    // ==========================================================
    // 4. CONTADORES
    // ==========================================================

    const pendientes =
      solicitudesFormateadas.filter(
        solicitud =>
          solicitud.estado ===
          estado_solicitud_pasante_enum
            .PENDIENTE_RRHH,
      )
        .length;


    const aprobadas =
      solicitudesFormateadas.filter(
        solicitud =>
          solicitud.estado ===
          estado_solicitud_pasante_enum
            .APROBADA,
      )
        .length;


    const rechazadas =
      solicitudesFormateadas.filter(
        solicitud =>
          solicitud.estado ===
          estado_solicitud_pasante_enum
            .RECHAZADA,
      )
        .length;


    const canceladas =
      solicitudesFormateadas.filter(
        solicitud =>
          solicitud.estado ===
          estado_solicitud_pasante_enum
            .CANCELADA,
      )
        .length;


    return {

      total:
        solicitudesFormateadas.length,

      pendientes,

      aprobadas,

      rechazadas,

      canceladas,

      solicitudes:
        solicitudesFormateadas,

    };

  }


  // ============================================================
  // CANCELAR SOLICITUD
  // ============================================================

  async cancelarSolicitud(
    supervisorId: string,
    departamentoId: string,
    solicitudId: string,
    motivoCancelacion: string,
    passwordAutorizacion: string,
  ) {

    // ==========================================================
    // 1. VALIDAR MOTIVO
    // ==========================================================

    const motivo =
      String(
        motivoCancelacion ?? '',
      )
        .trim();


    if (!motivo) {

      throw new BadRequestException(
        'Debe indicar el motivo de cancelación de la solicitud.',
      );

    }


    if (
      motivo.length >
      1000
    ) {

      throw new BadRequestException(
        'El motivo de cancelación no puede superar los 1000 caracteres.',
      );

    }


    // ==========================================================
    // 2. VALIDAR CONTRASEÑA DEL SUPERVISOR
    // ==========================================================

    const supervisor =
      await this
        .validarPasswordSupervisor(
          supervisorId,
          passwordAutorizacion,
        );


    if (
      !supervisor.departamento_id ||
      supervisor.departamento_id !==
        departamentoId
    ) {

      throw new ForbiddenException(
        'El Supervisor no pertenece al Departamento indicado.',
      );

    }


    // ==========================================================
    // 3. TRANSACCIÓN
    // ==========================================================

    return this.prisma
      .$transaction(
        async tx => {

          // =====================================================
          // 3.1. BUSCAR SOLICITUD
          // =====================================================

          const solicitud =
            await tx
              .solicitudes_pasante_supervisor
              .findUnique({

                where: {
                  id:
                    solicitudId,
                },

                select: {

                  id:
                    true,

                  supervisor_id:
                    true,

                  departamento_id:
                    true,

                  postulacion_id:
                    true,

                  estado:
                    true,

                },

              });


          if (!solicitud) {

            throw new NotFoundException(
              'La solicitud de pasante no existe.',
            );

          }


          // =====================================================
          // 3.2. SOLO EL SUPERVISOR PROPIETARIO PUEDE CANCELAR
          // =====================================================

          if (
            solicitud.supervisor_id !==
            supervisorId
          ) {

            throw new ForbiddenException(
              'No puede cancelar una solicitud perteneciente a otro Supervisor.',
            );

          }


          if (
            solicitud.departamento_id !==
            departamentoId
          ) {

            throw new ForbiddenException(
              'La solicitud no pertenece al Departamento del Supervisor.',
            );

          }


          // =====================================================
          // 3.3. SOLO PENDIENTE_RRHH PUEDE CANCELARSE
          // =====================================================

          if (
            solicitud.estado !==
            estado_solicitud_pasante_enum
              .PENDIENTE_RRHH
          ) {

            throw new ConflictException(
              'La solicitud ya no puede cancelarse porque fue procesada por Talento Humano.',
            );

          }


          // =====================================================
          // 3.4. VALIDAR ESTADO DE POSTULACIÓN
          // =====================================================

          const estadoPostulacion =
            await tx
              .estados_postulacion
              .findUnique({

                where: {

                  postulacion_id:
                    solicitud.postulacion_id,

                },

                select: {

                  estado_actual:
                    true,

                },

              });


          if (
            !estadoPostulacion
          ) {

            throw new NotFoundException(
              'No se encontró el estado de la postulación.',
            );

          }


          if (
            estadoPostulacion
              .estado_actual !==
            estado_postulacion_enum
              .SELECCIONADO_POR_AREA
          ) {

            throw new ConflictException(
              'La postulación ya avanzó a otro estado y la solicitud no puede cancelarse.',
            );

          }


          // =====================================================
          // 3.5. CANCELAR SOLICITUD
          // =====================================================

          const solicitudCancelada =
            await tx
              .solicitudes_pasante_supervisor
              .update({

                where: {
                  id:
                    solicitudId,
                },

                data: {

                  estado:
                    estado_solicitud_pasante_enum
                      .CANCELADA,

                  motivo_cancelacion:
                    motivo,

                  fecha_cancelacion:
                    new Date(),

                  updated_at:
                    new Date(),

                },

                select: {

                  id:
                    true,

                  postulacion_id:
                    true,

                  estado:
                    true,

                  motivo_cancelacion:
                    true,

                  fecha_cancelacion:
                    true,

                },

              });


          // =====================================================
          // 3.6. DEVOLVER POSTULANTE A APROBADO
          // =====================================================

          await tx
            .estados_postulacion
            .update({

              where: {

                postulacion_id:
                  solicitud.postulacion_id,

              },

              data: {

                estado_actual:
                  estado_postulacion_enum
                    .APROBADO,

                fecha_ultimo_cambio:
                  new Date(),

              },

            });


          // =====================================================
          // 3.7. AUDITORÍA
          // =====================================================
          //
          // IMPORTANTE:
          //
          // NUNCA guardar password_autorizacion.
          //
          // =====================================================

          await tx
            .auditoria_logs
            .create({

              data: {

                administrativo_id:
                  supervisorId,

                accion:
                  'CANCELAR_SOLICITUD_PASANTE',

                tabla_afectada:
                  'solicitudes_pasante_supervisor',

                registro_id:
                  solicitudId,

                detalles: {

                  postulacion_id:
                    solicitud
                      .postulacion_id,

                  departamento_id:
                    departamentoId,

                  estado:
                    'CANCELADA',

                  motivo_cancelacion:
                    motivo,

                },

              },

            });


          // =====================================================
          // 3.8. RESPUESTA
          // =====================================================

          return {

            message:
              'La solicitud fue cancelada correctamente. El postulante volvió a estar disponible.',

            solicitud:
              solicitudCancelada,

          };

        },
      );

  }

  async obtenerNotificaciones(
  supervisorId: string,
) {
  const notificaciones =
    await this.prisma.notificaciones_administrativas.findMany({
      where: {
        usuario_administrativo_id:
          supervisorId,
      },

      orderBy: {
        created_at:
          'desc',
      },

      select: {
        id: true,
        solicitud_pasante_id: true,
        tipo: true,
        titulo: true,
        mensaje: true,
        leida: true,
        fecha_leida: true,
        created_at: true,
      },
    });


  const noLeidas =
    notificaciones.filter(
      item =>
        !item.leida,
    ).length;


  return {
    resumen: {
      total:
        notificaciones.length,

      no_leidas:
        noLeidas,

      leidas:
        notificaciones.length -
        noLeidas,
    },

    notificaciones,
  };
}


async marcarNotificacionLeida(
  supervisorId: string,
  notificacionId: string,
) {
  const resultado =
    await this.prisma.notificaciones_administrativas.updateMany({
      where: {
        id:
          notificacionId,

        usuario_administrativo_id:
          supervisorId,
      },

      data: {
        leida:
          true,

        fecha_leida:
          new Date(),
      },
    });


  if (
    resultado.count === 0
  ) {
    throw new NotFoundException(
      'La notificación indicada no existe.',
    );
  }


  const notificacion =
    await this.prisma.notificaciones_administrativas.findUnique({
      where: {
        id:
          notificacionId,
      },

      select: {
        id: true,
        solicitud_pasante_id: true,
        tipo: true,
        titulo: true,
        mensaje: true,
        leida: true,
        fecha_leida: true,
        created_at: true,
      },
    });


  return {
    message:
      'La notificación fue marcada como leída.',

    notificacion,
  };
}

async obtenerPasantesSupervisor(
  supervisorId: string,
) {
  const pasantes =
    await this.prisma.pasantes_activos.findMany({
      where: {
        supervisor_id:
          supervisorId,
      },

      include: {
        postulantes: {
          include: {
            formacion_academica_postulante:
              true,

            usuarios_sistema: {
              select: {
                email: true,
              },
            },
          },
        },

        departamentos: {
          include: {
            gerencias:
              true,
          },
        },

        solicitud_pasante: {
          select: {
            id: true,
            actividades_pasante: true,
            created_at: true,
          },
        },

        seguimiento_academico_horas:
          true,
      },

      orderBy: {
        created_at:
          'desc',
      },
    });


  const lista =
    pasantes.map(
      pasante => {

        const formacion =
          pasante
            .postulantes
            .formacion_academica_postulante?.[0] ??
          null;


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
              pasante.postulantes.id,

            nombre_completo:
              [
                pasante.postulantes.nombres,
                pasante.postulantes.apellido_paterno,
                pasante.postulantes.apellido_materno,
              ]
                .filter(Boolean)
                .join(' '),

            ci:
              pasante.postulantes.ci,

            expedido:
              pasante.postulantes.expedido,

            email:
              pasante.postulantes
                .usuarios_sistema
                ?.email ??
              null,
          },

          formacion:
            formacion
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

          actividades:
            pasante
              .solicitud_pasante
              ?.actividades_pasante ??
            null,

          seguimiento:
            pasante
              .seguimiento_academico_horas ??
            null,
        };
      },
    );


  return {
    resumen: {
      total:
        lista.length,

      activos:
        lista.filter(
          item =>
            item.estado ===
            'ACTIVO',
        ).length,

      suspendidos:
        lista.filter(
          item =>
            item.estado ===
            'SUSPENDIDO',
        ).length,

      finalizados:
        lista.filter(
          item =>
            item.estado ===
            'FINALIZADO',
        ).length,

      abandonos:
        lista.filter(
          item =>
            item.estado ===
            'ABANDONO',
        ).length,
    },

    pasantes:
      lista,
  };
}

async obtenerReportesSupervisor(
  supervisorId: string,
) {
  const reportes =
    await this.prisma
      .reportes_comportamiento_pasante
      .findMany({
        where: {
          supervisor_id:
            supervisorId,
        },

        include: {
          pasantes_activos: {
            include: {
              postulantes: true,

              departamentos: {
                include: {
                  gerencias:
                    true,
                },
              },
            },
          },
        },

        orderBy: [
          {
            fecha_reporte:
              'desc',
          },
          {
            created_at:
              'desc',
          },
        ],
      });


  return {
    resumen: {
      total:
        reportes.length,

      observaciones:
        reportes.filter(
          item =>
            item.tipo ===
            tipo_reporte_comportamiento_enum.OBSERVACION,
        ).length,

      reconocimientos:
        reportes.filter(
          item =>
            item.tipo ===
            tipo_reporte_comportamiento_enum.RECONOCIMIENTO,
        ).length,

      incidentes:
        reportes.filter(
          item =>
            item.tipo ===
            tipo_reporte_comportamiento_enum.INCIDENTE,
        ).length,

      evaluaciones:
        reportes.filter(
          item =>
            item.tipo ===
            tipo_reporte_comportamiento_enum.EVALUACION,
        ).length,
    },

    reportes:
      reportes.map(
        reporte => ({
          id:
            reporte.id,

          tipo:
            reporte.tipo,

          titulo:
            reporte.titulo,

          descripcion:
            reporte.descripcion,

          fecha_reporte:
            reporte.fecha_reporte,

          created_at:
            reporte.created_at,

          pasante: {
            id:
              reporte
                .pasantes_activos
                .id,

            estado:
              reporte
                .pasantes_activos
                .estado,

            nombre_completo:
              [
                reporte
                  .pasantes_activos
                  .postulantes
                  .nombres,

                reporte
                  .pasantes_activos
                  .postulantes
                  .apellido_paterno,

                reporte
                  .pasantes_activos
                  .postulantes
                  .apellido_materno,
              ]
                .filter(Boolean)
                .join(' '),

            ci:
              reporte
                .pasantes_activos
                .postulantes
                .ci,

            departamento:
              reporte
                .pasantes_activos
                .departamentos
                ?.nombre ??
              null,

            gerencia:
              reporte
                .pasantes_activos
                .departamentos
                ?.gerencias
                ?.nombre ??
              null,
          },
        }),
      ),
  };
}


async crearReporteComportamiento(
  supervisorId: string,
  pasanteId: string,
  datos: CrearReporteComportamientoInput,
) {
  const tipoTexto =
    String(
      datos.tipo ?? '',
    )
      .trim()
      .toUpperCase();

  const titulo =
    String(
      datos.titulo ?? '',
    ).trim();

  const descripcion =
    String(
      datos.descripcion ?? '',
    ).trim();


  if (
    !Object.values(
      tipo_reporte_comportamiento_enum,
    ).includes(
      tipoTexto as
        tipo_reporte_comportamiento_enum,
    )
  ) {
    throw new BadRequestException(
      'El tipo de reporte no es válido.',
    );
  }


  if (!titulo) {
    throw new BadRequestException(
      'Debe registrar el título del reporte.',
    );
  }


  if (
    titulo.length > 150
  ) {
    throw new BadRequestException(
      'El título no puede superar los 150 caracteres.',
    );
  }


  if (!descripcion) {
    throw new BadRequestException(
      'Debe registrar la descripción del reporte.',
    );
  }


  if (
    descripcion.length > 3000
  ) {
    throw new BadRequestException(
      'La descripción no puede superar los 3000 caracteres.',
    );
  }


  let fechaReporte =
    new Date();


  if (
    datos.fecha_reporte
  ) {
    const textoFecha =
      String(
        datos.fecha_reporte,
      ).trim();


    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(
        textoFecha,
      )
    ) {
      throw new BadRequestException(
        'La fecha del reporte no tiene un formato válido.',
      );
    }


    fechaReporte =
      new Date(
        `${textoFecha}T00:00:00.000Z`,
      );


    if (
      Number.isNaN(
        fechaReporte.getTime(),
      )
    ) {
      throw new BadRequestException(
        'La fecha del reporte no es válida.',
      );
    }
  }


  return this.prisma.$transaction(
    async (
      tx: Prisma.TransactionClient,
    ) => {

      const pasante =
        await tx
          .pasantes_activos
          .findFirst({
            where: {
              id:
                pasanteId,

              supervisor_id:
                supervisorId,
            },

            include: {
              postulantes:
                true,
            },
          });


      if (!pasante) {
        throw new NotFoundException(
          'El pasante no existe o no se encuentra asignado a su supervisión.',
        );
      }


      if (
        pasante.estado !==
          'ACTIVO' &&
        pasante.estado !==
          'SUSPENDIDO'
      ) {
        throw new ConflictException(
          'No se pueden registrar nuevos reportes sobre una pasantía finalizada o en abandono.',
        );
      }


      const reporte =
        await tx
          .reportes_comportamiento_pasante
          .create({
            data: {
              pasante_id:
                pasanteId,

              supervisor_id:
                supervisorId,

              tipo:
                tipoTexto as
                  tipo_reporte_comportamiento_enum,

              titulo,

              descripcion,

              fecha_reporte:
                fechaReporte,
            },
          });


      await tx
        .auditoria_logs
        .create({
          data: {
            administrativo_id:
              supervisorId,

            accion:
              'CREAR_REPORTE_COMPORTAMIENTO',

            tabla_afectada:
              'reportes_comportamiento_pasante',

            registro_id:
              reporte.id,

            detalles: {
              pasante_id:
                pasanteId,

              tipo:
                reporte.tipo,

              titulo:
                reporte.titulo,

              fecha_reporte:
                reporte.fecha_reporte,
            },
          },
        });


      return {
        message:
          'El reporte de comportamiento fue registrado correctamente.',

        reporte,
      };
    },
  );
}


}