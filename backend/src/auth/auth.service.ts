import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '../prisma/prisma.service';

import { LoginDto } from './dto/login.dto';
import { Prisma } from '@prisma/client';
import {
  estado_postulacion_enum,
} from '../postulaciones/estado-postulacion';

import {
  PreRegistroDto,
  VerificarCodigoDto,
} from './dto/pre-registro.dto';

import { MailService } from './mail.service';

import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';


@Injectable()
export class AuthService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}


  // ============================================================
  // LOGIN ADMINISTRATIVO / RRHH
  // ============================================================

  async login(loginDto: LoginDto) {

    const email = (loginDto.email ?? '')
      .trim()
      .toLowerCase();

    const password = (loginDto.password ?? '')
      .trim();


    if (!email || !password) {
      throw new UnauthorizedException(
        'Credenciales inválidas.',
      );
    }


    // ----------------------------------------------------------
    // Buscar usuario administrativo
    // ----------------------------------------------------------

    const usuario =
      await this.prisma.usuarios_administrativos.findFirst({
        where: {
          email: {
            equals: email,
            mode: 'insensitive',
          },
        },
      });


    if (!usuario || !usuario.activo) {
      throw new UnauthorizedException(
        'Credenciales inválidas.',
      );
    }


    // ----------------------------------------------------------
    // Verificar contraseña
    // ----------------------------------------------------------

    const passwordValido =
      await bcrypt.compare(
        password,
        usuario.password_hash,
      );


    if (!passwordValido) {
      throw new UnauthorizedException(
        'Credenciales inválidas.',
      );
    }


    // ----------------------------------------------------------
    // Registrar último acceso
    // ----------------------------------------------------------

    await this.prisma.usuarios_administrativos.update({
      where: {
        id: usuario.id,
      },

      data: {
        ultimo_acceso: new Date(),
      },
    });


    // ----------------------------------------------------------
    // JWT
    // ----------------------------------------------------------

    const payload = {
      sub: usuario.id,
      tipoUsuario: 'ADMINISTRATIVO' as const,
    };


    const accessToken =
      await this.jwtService.signAsync(payload);


    // ----------------------------------------------------------
    // Respuesta
    // ----------------------------------------------------------

    return {
      access_token: accessToken,

      usuario: {
        id: usuario.id,
        ci: usuario.ci,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        email: usuario.email,
        cargo: usuario.cargo,
        departamento_unidad:
          usuario.departamento_unidad,
        rol: usuario.rol,
      },
    };
  }


  // ============================================================
  // GENERAR OTP
  // ============================================================

  private generarCodigoOTP(): string {

    return crypto
      .randomInt(
        0,
        1_000_000,
      )
      .toString()
      .padStart(
        6,
        '0',
      );
  }

  private async eliminarPreRegistroNoVerificado(
  usuarioId: string,
): Promise<void> {

  await this.prisma.$transaction(
    async (
      tx: Prisma.TransactionClient,
    ) => {

      const usuario =
        await tx.usuarios_sistema.findUnique({
          where: {
            id: usuarioId,
          },

          select: {
            id: true,
            cuenta_verificada: true,
          },
        });


      if (
        !usuario ||
        usuario.cuenta_verificada
      ) {
        return;
      }


      await tx.postulantes.deleteMany({
        where: {
          usuario_id: usuarioId,
        },
      });


      await tx.usuarios_sistema.deleteMany({
        where: {
          id: usuarioId,
          cuenta_verificada: false,
        },
      });

    },
  );
}


private async limpiarPreRegistrosVencidos(
  email: string,
  ci: string,
): Promise<void> {

  const candidatos =
    await this.prisma
      .usuarios_sistema
      .findMany({

        where: {
          cuenta_verificada: false,

          OR: [
            {
              email,
            },

            {
              postulantes: {
                some: {
                  ci,
                },
              },
            },
          ],
        },

        select: {
          id: true,

          codigo_verificacion: true,

          codigo_expira_en: true,
        },
      });


  const ahora =
    Date.now();


  for (
    const usuario
    of candidatos
  ) {

    const sinCodigo =
      !usuario.codigo_verificacion;

    const sinFechaExpiracion =
      !usuario.codigo_expira_en;

    const codigoExpirado =
      usuario.codigo_expira_en
        ? new Date(
            usuario.codigo_expira_en,
          ).getTime() <= ahora
        : true;


    if (
      sinCodigo ||
      sinFechaExpiracion ||
      codigoExpirado
    ) {

      await this
        .eliminarPreRegistroNoVerificado(
          usuario.id,
        );

    }
  }
}

  // ============================================================
  // PRE-REGISTRO POSTULANTE
  // ============================================================

  async preRegistro(
    dto: PreRegistroDto,
  ) {

    const emailNormalizado =
      dto.email
        .trim()
        .toLowerCase();


    const ciNormalizado =
      dto.ci
        .trim();


    await this
      .limpiarPreRegistrosVencidos(
        emailNormalizado,
        ciNormalizado,
      );


    const [
      usuarioExistente,
      postulanteExistente,
    ] =
      await Promise.all([

        this.prisma
          .usuarios_sistema
          .findUnique({
            where: {
              email:
                emailNormalizado,
            },
          }),

        this.prisma
          .postulantes
          .findUnique({
            where: {
              ci:
                ciNormalizado,
            },
          }),

      ]);


    if (
      usuarioExistente &&
      usuarioExistente.cuenta_verificada
    ) {

      throw new BadRequestException(
        'Ya existe una cuenta registrada y verificada con este correo electrónico.',
      );
    }


    if (
      usuarioExistente
        ?.codigo_ultimo_envio
    ) {

      const ultimoEnvio =
        new Date(
          usuarioExistente
            .codigo_ultimo_envio,
        ).getTime();


      const ahora =
        Date.now();


      const tiempoMinimo =
        60 * 1000;


      const tiempoTranscurrido =
        ahora - ultimoEnvio;


      if (
        tiempoTranscurrido <
        tiempoMinimo
      ) {

        const segundosRestantes =
          Math.ceil(
            (
              tiempoMinimo -
              tiempoTranscurrido
            ) / 1000,
          );


        throw new BadRequestException(
          `Debe esperar ${segundosRestantes} segundos antes de solicitar otro código.`,
        );
      }
    }


    if (
      postulanteExistente
        ?.usuario_id
    ) {

      if (
        !usuarioExistente ||
        postulanteExistente
          .usuario_id !==
          usuarioExistente.id
      ) {

        throw new BadRequestException(
          'El número de Carnet de Identidad ya está registrado con otra cuenta.',
        );
      }
    }


    if (
      usuarioExistente
    ) {

      const postulanteDelUsuario =
        await this.prisma
          .postulantes
          .findFirst({

            where: {
              usuario_id:
                usuarioExistente.id,
            },

            select: {
              id: true,
              ci: true,
            },
          });


      if (
        postulanteDelUsuario &&
        postulanteDelUsuario.ci !==
          ciNormalizado
      ) {

        throw new BadRequestException(
          'Este correo electrónico ya está asociado a otro Carnet de Identidad.',
        );
      }
    }


    const passwordHash =
      await bcrypt.hash(
        ciNormalizado,
        12,
      );


    const codigoOtp =
      this.generarCodigoOTP();


    const codigoOtpHash =
      await bcrypt.hash(
        codigoOtp,
        10,
      );


    const fechaActual =
      new Date();


    const expiraEn =
      new Date(
        Date.now() +
        10 * 60 * 1000,
      );


    const resultado =
      await this.prisma
        .$transaction(

          async (
            tx: Prisma.TransactionClient,
          ) => {

            const usuario =
              await tx
                .usuarios_sistema
                .upsert({

                  where: {
                    email:
                      emailNormalizado,
                  },

                  update: {
                    password_hash:
                      passwordHash,

                    codigo_verificacion:
                      codigoOtpHash,

                    codigo_expira_en:
                      expiraEn,

                    codigo_intentos:
                      0,

                    codigo_ultimo_envio:
                      fechaActual,

                    cuenta_verificada:
                      false,

                    activo:
                      true,
                  },

                  create: {
                    email:
                      emailNormalizado,

                    password_hash:
                      passwordHash,

                    rol:
                      'POSTULANTE',

                    activo:
                      true,

                    codigo_verificacion:
                      codigoOtpHash,

                    codigo_expira_en:
                      expiraEn,

                    codigo_intentos:
                      0,

                    codigo_ultimo_envio:
                      fechaActual,

                    cuenta_verificada:
                      false,
                  },
                });


            const postulante =
              postulanteExistente

                ? await tx
                    .postulantes
                    .update({

                      where: {
                        id:
                          postulanteExistente.id,
                      },

                      data: {
                        usuario_id:
                          usuario.id,

                        nombres:
                          dto.nombres
                            .trim()
                            .toUpperCase(),

                        apellido_paterno:
                          dto.apellido_paterno
                            .trim()
                            .toUpperCase(),

                        apellido_materno:
                          dto.apellido_materno
                            ?.trim()
                            ? dto
                                .apellido_materno
                                .trim()
                                .toUpperCase()
                            : null,

                        expedido:
                          dto.expedido
                            .trim()
                            .toUpperCase(),
                      },
                    })

                : await tx
                    .postulantes
                    .create({

                      data: {
                        usuario_id:
                          usuario.id,

                        ci:
                          ciNormalizado,

                        expedido:
                          dto.expedido
                          .trim()
                          .toUpperCase(),

                      nombres:
                        dto.nombres
                          .trim()
                          .toUpperCase(),

                      apellido_paterno:
                        dto.apellido_paterno
                          .trim()
                          .toUpperCase(),

                      apellido_materno:
                        dto.apellido_materno
                          ?.trim()
                          ? dto
                              .apellido_materno
                              .trim()
                              .toUpperCase()
                          : null,

                      fecha_nacimiento:
                        null,

                      genero:
                        null,
                    },
                  });


          return {
            usuario,
            postulante,
          };
        },
      );


  const nombreCompleto =
    `${dto.nombres} ${dto.apellido_paterno}`
      .trim();


  try {

    await this.mailService
      .enviarCodigoVerificacion(
        emailNormalizado,
        nombreCompleto,
        codigoOtp,
      );

  } catch {

    await this
      .eliminarPreRegistroNoVerificado(
        resultado.usuario.id,
      );


    throw new BadRequestException(
      'No se pudo enviar el código de verificación. El pre-registro fue cancelado. Intente nuevamente.',
    );
  }


  return {
    message:
      'Código de verificación enviado correctamente. Revise su correo electrónico.',

    email:
      emailNormalizado,

    postulante_id:
      resultado.postulante.id,

    expiraEn,
  };
    }


  // ============================================================
  // VERIFICAR CÓDIGO OTP
  // ============================================================

  async verificarCodigo(
      dto: VerificarCodigoDto,
    ) {

      const emailNormalizado =
        dto.email
          .trim()
          .toLowerCase();


      const codigoIngresado =
        dto.codigo
          .trim();


      if (
        !/^\d{6}$/.test(
          codigoIngresado,
        )
      ) {

        throw new BadRequestException(
          'El código de verificación debe contener exactamente 6 números.',
        );
      }


      const usuario =
        await this.prisma
          .usuarios_sistema
          .findUnique({

            where: {
              email:
                emailNormalizado,
            },
          });


      if (!usuario) {

        throw new BadRequestException(
          'No se encontró un pre-registro activo. Vuelva a realizar el registro.',
        );
      }


      if (
        usuario.cuenta_verificada
      ) {

        return {
          message:
            'La cuenta ya se encuentra verificada.',

          verificado:
            true,
        };
      }


      if (
        !usuario.codigo_verificacion ||
        !usuario.codigo_expira_en
      ) {

        await this
          .eliminarPreRegistroNoVerificado(
            usuario.id,
          );


        throw new BadRequestException(
          'El pre-registro ya no es válido. Vuelva a registrarse para recibir un nuevo código.',
        );
      }


      const fechaActual =
        Date.now();


      const fechaExpiracion =
        new Date(
          usuario.codigo_expira_en,
        ).getTime();


      if (
        fechaActual >
        fechaExpiracion
      ) {

        await this
          .eliminarPreRegistroNoVerificado(
            usuario.id,
          );


        throw new BadRequestException(
          'El código de verificación ha expirado. El pre-registro fue eliminado. Vuelva a registrarse para recibir un nuevo código.',
        );
      }


      if (
        usuario.codigo_intentos >= 5
      ) {

        await this
          .eliminarPreRegistroNoVerificado(
            usuario.id,
          );


        throw new UnauthorizedException(
          'Se alcanzó el máximo de intentos. Vuelva a realizar el pre-registro.',
        );
      }


      let codigoValido =
        false;


      try {

        codigoValido =
          await bcrypt.compare(
            codigoIngresado,
            usuario.codigo_verificacion,
          );

      } catch {

        codigoValido =
          false;
      }


      if (
        !codigoValido
      ) {

        const nuevosIntentos =
          usuario.codigo_intentos + 1;


        const intentosRestantes =
          5 - nuevosIntentos;


        if (
          nuevosIntentos >= 5
        ) {

          await this
            .eliminarPreRegistroNoVerificado(
              usuario.id,
            );


          throw new UnauthorizedException(
            'Código incorrecto. Se alcanzó el máximo de 5 intentos. Vuelva a realizar el pre-registro.',
          );
        }


        await this.prisma
          .usuarios_sistema
          .update({

            where: {
              id:
                usuario.id,
            },

            data: {
              codigo_intentos:
                nuevosIntentos,
            },
          });


        throw new UnauthorizedException(
          `Código incorrecto. Le quedan ${intentosRestantes} intentos.`,
        );
      }


      await this.prisma
        .$transaction(

          async (
            tx: Prisma.TransactionClient,
          ) => {

            await tx
              .usuarios_sistema
              .update({

                where: {
                  id:
                    usuario.id,
                },

                data: {
                  cuenta_verificada:
                    true,

                  codigo_verificacion:
                    null,

                  codigo_expira_en:
                    null,

                  codigo_intentos:
                    0,
                },
              });


            const postulante =
              await tx
                .postulantes
                .findUnique({

                  where: {
                    usuario_id:
                      usuario.id,
                  },

                  select: {
                    id: true,
                  },
                });


            if (!postulante) {

              throw new BadRequestException(
                'No se encontró el postulante asociado a la cuenta.',
              );
            }


            const postulacionExistente =
              await tx
                .postulaciones
                .findFirst({

                  where: {
                    postulante_id:
                      postulante.id,
                  },

                  select: {
                    id: true,
                    numero_intento: true,
                  },

                  orderBy: {
                    numero_intento:
                      'desc',
                  },
                });


            if (
              !postulacionExistente
            ) {

              await tx
                .postulaciones
                .create({

                  data: {
                    postulante_id:
                      postulante.id,

                    numero_intento:
                      1,
                  },
                });
            }
          },
        );


      return {
        message:
          'Cuenta verificada correctamente.',

        verificado:
          true,
      };
    }

// ============================================================
// OBTENER O CREAR POSTULACIÓN PARA EL LOGIN
// ============================================================

private async obtenerOCrearPostulacionParaLogin(
  postulanteId: string,
) {

  /*
   * Se permiten dos intentos solamente para cubrir
   * una posible colisión de concurrencia.
   *
   * La restricción UNIQUE:
   * (postulante_id, numero_intento)
   *
   * continúa siendo la última protección en PostgreSQL.
   */
  for (
    let intentoTransaccion = 0;
    intentoTransaccion < 2;
    intentoTransaccion++
  ) {

    try {

      return await this.prisma.$transaction(

        async (
          tx: Prisma.TransactionClient,
        ) => {

          // ====================================================
          // 1. BUSCAR POSTULACIÓN ABIERTA
          // ====================================================

          const postulacionAbierta =
            await tx.postulaciones.findFirst({

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

              include: {

                estados_postulacion:
                  true,

              },

            });


          /*
           * Si ya existe una postulación abierta,
           * nunca creamos otra.
           */
          if (postulacionAbierta) {

            return {

              id:
                postulacionAbierta.id,

              numero_intento:
                postulacionAbierta.numero_intento,

              estado_actual:
                postulacionAbierta
                  .estados_postulacion
                  ?.estado_actual ??
                estado_postulacion_enum.REGISTRADO,

              nueva_postulacion:
                false,

            };

          }


          // ====================================================
          // 2. BUSCAR ÚLTIMO INTENTO
          // ====================================================

          const ultimaPostulacion =
            await tx.postulaciones.findFirst({

              where: {

                postulante_id:
                  postulanteId,

              },

              orderBy: {

                numero_intento:
                  'desc',

              },

              include: {

                estados_postulacion:
                  true,

              },

            });


          // ====================================================
          // 3. SI NUNCA POSTULÓ -> CREAR INTENTO #1
          // ====================================================

          if (!ultimaPostulacion) {

            const nuevaPostulacion =
              await tx.postulaciones.create({

                data: {

                  postulante_id:
                    postulanteId,

                  numero_intento:
                    1,

                },

                select: {

                  id:
                    true,

                  numero_intento:
                    true,

                },

              });


            await tx.estados_postulacion.create({

              data: {

                postulante_id:
                  postulanteId,

                postulacion_id:
                  nuevaPostulacion.id,

                estado_actual:
                  estado_postulacion_enum.REGISTRADO,

                observaciones_rrhh:
                  'Primera postulación iniciada por el postulante.',

                fecha_ultimo_cambio:
                  new Date(),

              },

            });


            return {

              id:
                nuevaPostulacion.id,

              numero_intento:
                nuevaPostulacion.numero_intento,

              estado_actual:
                estado_postulacion_enum.REGISTRADO,

              nueva_postulacion:
                true,

            };

          }


          // ====================================================
          // 4. SOLO DESISTIDO PUEDE GENERAR OTRO INTENTO
          // ====================================================

          const ultimoEstado =
            ultimaPostulacion
              .estados_postulacion
              ?.estado_actual;


          if (
            ultimoEstado !==
            estado_postulacion_enum.DESISTIDO
          ) {

            throw new BadRequestException(
              'No existe una postulación activa y el último proceso no permite iniciar una nueva postulación.',
            );

          }


          // ====================================================
          // 5. CREAR SIGUIENTE INTENTO
          // ====================================================

          const siguienteNumeroIntento =
            ultimaPostulacion.numero_intento + 1;


          const nuevaPostulacion =
            await tx.postulaciones.create({

              data: {

                postulante_id:
                  postulanteId,

                numero_intento:
                  siguienteNumeroIntento,

              },

              select: {

                id:
                  true,

                numero_intento:
                  true,

              },

            });


          // ====================================================
          // 6. NUEVO INTENTO COMIENZA EN REGISTRADO
          // ====================================================

          await tx.estados_postulacion.create({

            data: {

              postulante_id:
                postulanteId,

              postulacion_id:
                nuevaPostulacion.id,

              estado_actual:
                estado_postulacion_enum.REGISTRADO,

              observaciones_rrhh:
                'Nueva postulación iniciada después de un desistimiento anterior.',

              fecha_ultimo_cambio:
                new Date(),

            },

          });


          return {

            id:
              nuevaPostulacion.id,

            numero_intento:
              nuevaPostulacion.numero_intento,

            estado_actual:
              estado_postulacion_enum.REGISTRADO,

            nueva_postulacion:
              true,

          };

        },

        {

          isolationLevel:
            Prisma.TransactionIsolationLevel.Serializable,

        },

      );


    } catch (error) {

      /*
       * P2002:
       * otro request creó el mismo numero_intento.
       *
       * P2034:
       * PostgreSQL abortó una transacción serializable
       * por concurrencia.
       */
      const errorReintentable =
        error instanceof
          Prisma.PrismaClientKnownRequestError &&
        (
          error.code === 'P2002' ||
          error.code === 'P2034'
        );


      if (
        errorReintentable &&
        intentoTransaccion === 0
      ) {

        continue;

      }


      throw error;

    }

  }


  throw new BadRequestException(
    'No se pudo preparar la postulación. Intente nuevamente.',
  );
}
  // ============================================================
// LOGIN POSTULANTE
// ============================================================

async loginPostulante(
  loginDto: LoginDto,
) {

  const email =
    (loginDto.email ?? '')
      .trim()
      .toLowerCase();


  const password =
    (loginDto.password ?? '')
      .trim();


  if (
    !email ||
    !password
  ) {

    throw new UnauthorizedException(
      'Correo o contraseña incorrectos.',
    );

  }


  // ==========================================================
  // BUSCAR USUARIO
  // ==========================================================

  const usuario =
    await this.prisma
      .usuarios_sistema
      .findUnique({

        where: {
          email,
        },

      });


  if (
    !usuario ||
    !usuario.activo
  ) {

    throw new UnauthorizedException(
      'Correo o contraseña incorrectos.',
    );

  }


  // ==========================================================
  // CUENTA VERIFICADA
  // ==========================================================

  if (
    !usuario.cuenta_verificada
  ) {

    throw new UnauthorizedException(
      'Su cuenta aún no ha sido verificada con el código enviado a su correo.',
    );

  }


  // ==========================================================
  // VERIFICAR CONTRASEÑA
  // ==========================================================

  const passwordValido =
    await bcrypt.compare(
      password,
      usuario.password_hash,
    );


  if (!passwordValido) {

    throw new UnauthorizedException(
      'Correo o contraseña incorrectos.',
    );

  }


  // ==========================================================
  // OBTENER POSTULANTE
  // ==========================================================

  const postulante =
    await this.prisma
      .postulantes
      .findFirst({

        where: {

          usuario_id:
            usuario.id,

        },

        include: {

          datos_contacto_postulante:
            true,

          formacion_academica_postulante:
            true,

          pasantes_activos:
            true,

        },

      });


  if (!postulante) {

    throw new BadRequestException(
      'No se encontró el perfil del postulante.',
    );

  }


  // ==========================================================
  // CONTROL DE ABANDONO
  // ==========================================================

  /*
   * ABANDONO:
   *
   * La persona ya llegó a convertirse en pasante
   * y abandonó la pasantía.
   *
   * No puede generar una nueva postulación.
   */
  if (
    postulante
      .pasantes_activos
      ?.estado ===
    'ABANDONO'
  ) {

    throw new BadRequestException(
      'No es posible iniciar una nueva postulación con los datos registrados.',
    );

  }


  // ==========================================================
  // DETERMINAR SI YA ES PASANTE ACTIVO
  // ==========================================================

  const esPasanteActivo =
    postulante
      .pasantes_activos
      ?.estado ===
    'ACTIVO';


  // ==========================================================
  // OBTENER / CREAR POSTULACIÓN ACTUAL
  // ==========================================================

  let postulacionActual: {

    id:
      string;

    numero_intento:
      number;

    estado_actual:
      estado_postulacion_enum;

    nueva_postulacion:
      boolean;

  } | null =
    null;


  /*
   * Un pasante ACTIVO no necesita una nueva
   * postulación porque debe ingresar directamente
   * a su dashboard.
   */
  if (!esPasanteActivo) {

    postulacionActual =
      await this
        .obtenerOCrearPostulacionParaLogin(
          postulante.id,
        );

  }


  // ==========================================================
  // REGISTRAR ÚLTIMO ACCESO
  // ==========================================================

  await this.prisma
    .usuarios_sistema
    .update({

      where: {

        id:
          usuario.id,

      },

      data: {

        ultimo_login:
          new Date(),

      },

    });


  // ==========================================================
  // DATOS DE CONTACTO
  // ==========================================================

  const contacto =
    postulante
      .datos_contacto_postulante;


  const numeroCelular =
    contacto
      ?.numero_celular
      ?.trim() ??
    '';


  const tieneContacto =
    numeroCelular.length > 5;


  // ==========================================================
  // FORMACIÓN ACADÉMICA
  // ==========================================================

  const formacion =
    postulante
      .formacion_academica_postulante
      ?.[0];


  const semestreONivel =
    formacion
      ?.semestre_o_nivel
      ?.trim() ??
    '';


  const tieneFormacion =
    semestreONivel.length > 0;


  const tieneFormularioCompleto =
    tieneContacto &&
    tieneFormacion;


  // ==========================================================
  // DOCUMENTOS DE LA POSTULACIÓN ACTUAL
  // ==========================================================

  /*
   * MUY IMPORTANTE:
   *
   * Ya no contamos:
   *
   * postulante.documentos_postulante
   *
   * porque eso mezclaría documentos del intento #1
   * con documentos del intento #2.
   *
   * Aquí contamos únicamente los documentos
   * pertenecientes a la postulación actual.
   */

  let cantidadPdfs =
    0;


  if (postulacionActual) {

    cantidadPdfs =
      await this.prisma
        .documentos_postulante
        .count({

          where: {

            postulacion_id:
              postulacionActual.id,

          },

        });

  }


  const tieneDocumentosCompletos =
    cantidadPdfs >= 7;


  // ==========================================================
  // DETERMINAR RUTA
  // ==========================================================

  let rutaDestino =
    '/postulacion/formulario-postulacion';


  if (esPasanteActivo) {

    rutaDestino =
      '/pasante/dashboard';

  }

  /*
   * RECHAZADO es terminal.
   *
   * Aunque por alguna razón tenga menos de siete
   * documentos, no debe regresar a cargarlos.
   */
  else if (
    postulacionActual
      ?.estado_actual ===
    estado_postulacion_enum.RECHAZADO
  ) {

    rutaDestino =
      '/postulacion/estado';

  }

  else if (
    !tieneFormularioCompleto
  ) {

    rutaDestino =
      '/postulacion/formulario-postulacion';

  }

  else if (
    !tieneDocumentosCompletos
  ) {

    rutaDestino =
      '/postulacion/pdf_archivos';

  }

  else {

    rutaDestino =
      '/postulacion/estado';

  }


  // ==========================================================
  // JWT
  // ==========================================================

  const payload = {

    sub:
      usuario.id,

    tipoUsuario:
      'SISTEMA' as const,

  };


  const accessToken =
    await this.jwtService
      .signAsync(
        payload,
      );


  // ==========================================================
  // RESPUESTA
  // ==========================================================

  return {

    access_token:
      accessToken,

    rutaDestino,

    postulacion:
      postulacionActual
        ? {

            id:
              postulacionActual.id,

            numero_intento:
              postulacionActual.numero_intento,

            es_repostulacion:
              postulacionActual.numero_intento > 1,

            nueva_postulacion:
              postulacionActual.nueva_postulacion,

            estado_actual:
              postulacionActual.estado_actual,

          }
        : null,

    usuario: {

      id:
        usuario.id,

      email:
        usuario.email,

      rol:
        usuario.rol,

      postulante_id:
        postulante.id,

      ci:
        postulante.ci,

      expedido:
        postulante.expedido,

      nombres:
        postulante.nombres,

      apellido_paterno:
        postulante.apellido_paterno,

      apellido_materno:
        postulante.apellido_materno,

      esPasanteActivo,

      tieneFormularioCompleto,

      tieneDocumentosCompletos,

    },

  };
}
}