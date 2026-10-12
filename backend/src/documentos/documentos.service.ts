import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import {
  access,
  readFile,
  rename,
  unlink,
} from 'fs/promises';

import {
  basename,
  join,
} from 'path';

import type {
  UsuarioAutenticado,
} from '../auth/interfaces/jwt-payload.interface';
import {
  randomUUID,
} from 'crypto';


// ============================================================
// TIPOS DE DOCUMENTOS PERMITIDOS
// ============================================================

const TIPOS_DOCUMENTO = [
  'CARTA_SOLICITUD',
  'RECORD_ACADEMICO',
  'HOJA_DE_VIDA',
  'FOTOCOPIA_CI',
  'FACTURA_SERVICIO_BASICO',
  'CROQUIS_DOMICILIO',
  'REFERENCIAS_PERSONALES',
] as const;


type TipoDocumento =
  typeof TIPOS_DOCUMENTO[number];


// ============================================================
// TIPOS AUXILIARES
// ============================================================

type DocumentoPropio = {
  id: string;
  postulacion_id: string;
  tipo_documento: string;
  verificado: boolean;
  observacion: string | null;
  uploaded_at: Date | null;
};


type DocumentoListado = {
  id: string;
  tipo_documento: string;
  verificado: boolean;
  observacion: string | null;
  uploaded_at: Date | null;

  postulantes: {
    id: string;
    ci: string;
    nombres: string;
    apellido_paterno: string;
    apellido_materno: string | null;
  };

  postulaciones: {
    id: string;
    numero_intento: number;
    fecha_inicio: Date;
    fecha_cierre: Date | null;
  };
};


@Injectable()
export class DocumentosService {

  constructor(
    private readonly prisma: PrismaService,
  ) {}


  // ============================================================
  // VALIDAR TIPO DE DOCUMENTO
  // ============================================================

  private validarTipoDocumento(
    tipo?: string,
  ): TipoDocumento {

    if (
      !tipo ||
      !TIPOS_DOCUMENTO.includes(
        tipo as TipoDocumento,
      )
    ) {

      throw new BadRequestException(
        `Tipo de documento inválido. Valores permitidos: ${TIPOS_DOCUMENTO.join(', ')}`,
      );
    }


    return tipo as TipoDocumento;
  }


  // ============================================================
  // OBTENER POSTULANTE DESDE EL USUARIO DEL JWT
  // ============================================================

  private async obtenerPostulantePorUsuario(
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

          select: {
            id:
              true,

            usuario_id:
              true,

            ci:
              true,
          },
        });


    if (!postulante) {

      throw new NotFoundException(
        'No existe un perfil de postulante asociado a su cuenta.',
      );
    }


    return postulante;
  }


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

            numero_intento:
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
  // ELIMINAR ARCHIVO FÍSICO
  // ============================================================

  private async eliminarArchivoFisico(
    archivoUrl?: string | null,
  ) {

    if (!archivoUrl) {
      return;
    }


    const nombreArchivo =
      basename(
        archivoUrl,
      );


    if (!nombreArchivo) {
      return;
    }


    const ruta =
      join(
        process.cwd(),
        'uploads',
        'documentos',
        nombreArchivo,
      );


    try {

      await unlink(
        ruta,
      );

    } catch {

      // Si el archivo ya no existe,
      // no interrumpimos la operación.
    }
  }


  // ============================================================
  // ELIMINAR ARCHIVO SUBIDO POR MULTER
  // ============================================================

  private async eliminarArchivoSubido(
    file?: Express.Multer.File,
  ) {

    if (!file?.path) {
      return;
    }


    try {

      await unlink(
        file.path,
      );

    } catch {

      // Ignorar si ya no existe.
    }
  }


  // ============================================================
  // VALIDAR QUE EL ARCHIVO SEA REALMENTE PDF
  // ============================================================

  private async validarPdfReal(
    file: Express.Multer.File,
  ) {

    try {

      const contenido =
        await readFile(
          file.path,
        );


      const firma =
        contenido
          .subarray(
            0,
            5,
          )
          .toString(
            'ascii',
          );


      if (
        firma !== '%PDF-'
      ) {

        await this.eliminarArchivoSubido(
          file,
        );


        throw new BadRequestException(
          'El archivo enviado no es un PDF válido.',
        );
      }

    } catch (error) {

      if (
        error instanceof
        BadRequestException
      ) {

        throw error;
      }


      await this.eliminarArchivoSubido(
        file,
      );


      throw new BadRequestException(
        'No se pudo validar el archivo PDF.',
      );
    }
  }

  private construirNombreInstitucional(
  tipo: TipoDocumento,
  ci: string,
  numeroIntento: number,
): string {

  const ciSeguro =
    String(ci)
      .trim()
      .toUpperCase()
      .replace(
        /[^A-Z0-9-]/g,
        '_',
      );


  const identificador =
    randomUUID()
      .replace(
        /-/g,
        '',
      )
      .slice(
        0,
        8,
      )
      .toUpperCase();


  return (
    `${tipo}_` +
    `${ciSeguro}_` +
    `INTENTO_${numeroIntento}_` +
    `${identificador}.pdf`
  );
}


private async renombrarArchivoInstitucional(
  file: Express.Multer.File,
  nombreArchivo: string,
): Promise<void> {

  const rutaDestino =
    join(
      process.cwd(),
      'uploads',
      'documentos',
      nombreArchivo,
    );


  try {

    await rename(
      file.path,
      rutaDestino,
    );


    file.filename =
      nombreArchivo;


    file.path =
      rutaDestino;

  } catch {

    await this.eliminarArchivoSubido(
      file,
    );


    throw new BadRequestException(
      'No se pudo preparar el documento para su almacenamiento.',
    );
  }
}

  // ============================================================
  // SUBIR / REEMPLAZAR DOCUMENTO
  // ============================================================

  async guardarDocumento(
    usuarioId: string,
    tipoDocumento: string,
    file: Express.Multer.File,
  ) {

    if (!file) {

      throw new BadRequestException(
        'Archivo no proporcionado.',
      );
    }


    // ----------------------------------------------------------
    // VALIDAR TIPO
    // ----------------------------------------------------------

    let tipo: TipoDocumento;


    try {

      tipo =
        this.validarTipoDocumento(
          tipoDocumento,
        );

    } catch (error) {

      await this.eliminarArchivoSubido(
        file,
      );

      throw error;
    }


    // ----------------------------------------------------------
    // VALIDAR PDF
    // ----------------------------------------------------------

    await this.validarPdfReal(
      file,
    );


    // ----------------------------------------------------------
    // OBTENER POSTULANTE
    // ----------------------------------------------------------

    let postulante;


    try {

      postulante =
        await this.obtenerPostulantePorUsuario(
          usuarioId,
        );

    } catch (error) {

      await this.eliminarArchivoSubido(
        file,
      );

      throw error;
    }


    const postulanteId =
      postulante.id;


    // ----------------------------------------------------------
    // OBTENER POSTULACIÓN ACTUAL
    // ----------------------------------------------------------

    let postulacion;


    try {

      postulacion =
        await this.obtenerPostulacionActual(
          postulanteId,
        );

    } catch (error) {

      await this.eliminarArchivoSubido(
        file,
      );

      throw error;
    }


    // ==========================================================
    // VALIDAR ESTADO
    // ==========================================================
    //
    // El postulante solamente puede modificar documentos cuando
    // todavía está registrando su postulación o cuando RRHH
    // realizó una observación.
    // ==========================================================

    const estadoActual =
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


    const estadosEditables =
      new Set<string>([
        'REGISTRADO',
        'OBSERVADO',
      ]);


    if (
      estadoActual &&
      !estadosEditables.has(
        estadoActual.estado_actual,
      )
    ) {

      await this.eliminarArchivoSubido(
        file,
      );


      throw new BadRequestException(
        `No puede modificar documentos mientras la postulación se encuentra en estado ${estadoActual.estado_actual}.`,
      );
    }
     const nombreInstitucional =
  this.construirNombreInstitucional(
    tipo,
    postulante.ci,
    postulacion.numero_intento,
  );


await this
  .renombrarArchivoInstitucional(
    file,
    nombreInstitucional,
  );

    const archivoUrl =
      `/uploads/documentos/${file.filename}`;


    try {

      // ========================================================
      // BUSCAR DOCUMENTO ANTERIOR DE ESTA POSTULACIÓN
      // ========================================================

      const anterior =
        await this.prisma
          .documentos_postulante
          .findUnique({

            where: {

              postulacion_id_tipo_documento: {

                postulacion_id:
                  postulacion.id,

                tipo_documento:
                  tipo,
              },
            },

            select: {

              id:
                true,

              archivo_url:
                true,
            },
          });


      // ========================================================
      // CREAR O REEMPLAZAR DOCUMENTO
      // ========================================================

      const documento =
        await this.prisma
          .documentos_postulante
          .upsert({

            where: {

              postulacion_id_tipo_documento: {

                postulacion_id:
                  postulacion.id,

                tipo_documento:
                  tipo,
              },
            },

            update: {

              archivo_url:
                archivoUrl,

              verificado:
                false,

              observacion:
                null,

              uploaded_at:
                new Date(),
            },

            create: {

              // Campo antiguo.
              // Se mantiene temporalmente mientras terminamos
              // la migración del backend.
              postulante_id:
                postulanteId,

              // Nueva relación correcta.
              postulacion_id:
                postulacion.id,

              tipo_documento:
                tipo,

              archivo_url:
                archivoUrl,

              verificado:
                false,

              observacion:
                null,

              uploaded_at:
                new Date(),
            },
          });


      // --------------------------------------------------------
      // BORRAR ARCHIVO ANTERIOR
      // --------------------------------------------------------

      if (
        anterior?.archivo_url &&
        anterior.archivo_url !==
          archivoUrl
      ) {

        await this.eliminarArchivoFisico(
          anterior.archivo_url,
        );
      }


      return {

        message:
          'Documento subido correctamente.',

        documento_id:
          documento.id,

        postulacion_id:
          documento.postulacion_id,

        numero_intento:
          postulacion.numero_intento,

        tipo_documento:
          documento.tipo_documento,

        verificado:
          documento.verificado,

        archivo_endpoint:
          `/documentos/${documento.id}/archivo`,

        originalName:
          file.originalname,

        size:
          file.size,
      };

    } catch (error) {

      await this.eliminarArchivoSubido(
        file,
      );

      throw error;
    }
  }


  // ============================================================
  // POSTULANTE - OBTENER SUS PROPIOS DOCUMENTOS
  // ============================================================

  async obtenerMisDocumentos(
    usuarioId: string,
  ) {

    const postulante =
      await this.obtenerPostulantePorUsuario(
        usuarioId,
      );


    // ----------------------------------------------------------
    // DOCUMENTOS SOLO DE LA POSTULACIÓN ACTUAL
    // ----------------------------------------------------------

    const postulacion =
      await this.obtenerPostulacionActual(
        postulante.id,
      );


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


    return documentos.map(
      (
        documento: DocumentoPropio,
      ) => ({

        id:
          documento.id,

        postulacion_id:
          documento.postulacion_id,

        numero_intento:
          postulacion.numero_intento,

        tipo_documento:
          documento.tipo_documento,

        verificado:
          documento.verificado,

        observacion:
          documento.observacion,

        uploaded_at:
          documento.uploaded_at,

        archivo_endpoint:
          `/documentos/${documento.id}/archivo`,
      }),
    );
  }


  // ============================================================
  // POSTULANTE - FINALIZAR SU POSTULACIÓN
  // ============================================================

  async finalizarPostulacion(
    usuarioId: string,
  ) {

    // ----------------------------------------------------------
    // OBTENER POSTULANTE DESDE USUARIO AUTENTICADO
    // ----------------------------------------------------------

    const postulanteBase =
      await this.obtenerPostulantePorUsuario(
        usuarioId,
      );


    // ----------------------------------------------------------
    // OBTENER POSTULACIÓN ACTUAL
    // ----------------------------------------------------------

    const postulacion =
      await this.obtenerPostulacionActual(
        postulanteBase.id,
      );


    // ----------------------------------------------------------
    // OBTENER INFORMACIÓN NECESARIA
    // ----------------------------------------------------------

    const postulante =
      await this.prisma
        .postulantes
        .findUnique({

          where: {
            id:
              postulanteBase.id,
          },

          include: {

            datos_contacto_postulante:
              true,

            formacion_academica_postulante:
              true,

            disponibilidad_horaria_postulante:
              true,

            // Solo documentos del intento actual.
            documentos_postulante: {

              where: {
                postulacion_id:
                  postulacion.id,
              },
            },
          },
        });


    if (!postulante) {

      throw new NotFoundException(
        'No existe el postulante.',
      );
    }


    // ==========================================================
    // COMPROBAR LOS 7 DOCUMENTOS
    // ==========================================================

    const tiposSubidos =
      new Set<string>(
        postulante
          .documentos_postulante
          .map(
            (
              documento: {
                tipo_documento: string;
              },
            ) =>
              documento.tipo_documento,
          ),
      );


    const faltantes =
      TIPOS_DOCUMENTO.filter(
        tipo =>
          !tiposSubidos.has(
            tipo,
          ),
      );


    if (
      faltantes.length > 0
    ) {

      throw new BadRequestException(
        `No se puede finalizar: faltan documentos (${faltantes.join(', ')}).`,
      );
    }


    // ==========================================================
    // COMPROBAR FORMULARIO
    // ==========================================================

    const formularioCompleto =
      Boolean(

        postulante
          .fecha_nacimiento &&

        postulante
          .genero &&

        postulante
          .datos_contacto_postulante
          ?.numero_celular &&

        postulante
          .datos_contacto_postulante
          ?.zona_domicilio &&

        postulante
          .formacion_academica_postulante
          .length > 0 &&

        postulante
          .disponibilidad_horaria_postulante
      );


    if (!formularioCompleto) {

      throw new BadRequestException(
        'No se puede finalizar: el formulario de postulación aún está incompleto.',
      );
    }


    // ==========================================================
    // OBTENER ESTADO ACTUAL DE ESTE INTENTO
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
      'REGISTRADO';


    // ==========================================================
    // VALIDAR QUE PUEDA ENVIARSE A RRHH
    // ==========================================================
    //
    // REGISTRADO:
    // primera entrega.
    //
    // OBSERVADO:
    // corrigió documentos y vuelve a enviar.
    // ==========================================================

    const estadosPermitidos =
      new Set<string>([
        'REGISTRADO',
        'OBSERVADO',
      ]);


    if (
      !estadosPermitidos.has(
        estadoActual,
      )
    ) {

      throw new BadRequestException(
        `No se puede finalizar la postulación mientras se encuentra en estado ${estadoActual}.`,
      );
    }


    // ==========================================================
    // PASAR A EVALUACIÓN RRHH
    // ==========================================================

    const estado =
      await this.prisma
        .estados_postulacion
        .upsert({

          where: {
            postulacion_id:
              postulacion.id,
          },

          update: {

            estado_actual:
              'EN_EVALUACION_RRHH',

            fecha_ultimo_cambio:
              new Date(),

            observaciones_rrhh:
              'Postulación completada por el postulante. Documentación pendiente de revisión por Talento Humano.',
          },

          create: {

            // Relación antigua temporal.
            postulante_id:
              postulante.id,

            // Relación correcta con el intento.
            postulacion_id:
              postulacion.id,

            estado_actual:
              'EN_EVALUACION_RRHH',

            fecha_ultimo_cambio:
              new Date(),

            observaciones_rrhh:
              'Postulación completada por el postulante. Documentación pendiente de revisión por Talento Humano.',
          },
        });


    return {

      message:
        'Postulación finalizada correctamente.',

      postulacion_id:
        postulacion.id,

      numero_intento:
        postulacion.numero_intento,

      estado:
        estado.estado_actual,

      documentos_registrados:
        postulante
          .documentos_postulante
          .length,
    };
  }


  // ============================================================
  // OBTENER PDF PROTEGIDO
  // ============================================================

  // ============================================================
// OBTENER PDF PROTEGIDO
// ============================================================

async obtenerArchivo(
  usuario: UsuarioAutenticado,
  documentoId: string,
) {

  // ==========================================================
  // 1. BUSCAR DOCUMENTO
  // ==========================================================

  const documento =
    await this.prisma
      .documentos_postulante
      .findUnique({

        where: {
          id:
            documentoId,
        },

        select: {

          id:
            true,

          archivo_url:
            true,

          tipo_documento:
            true,

          postulante_id:
            true,

          postulacion_id:
            true,


          // ----------------------------------------------------
          // Propietario del documento
          // ----------------------------------------------------

         postulantes: {

            select: {

              usuario_id:
                true,

              ci:
                true,

            },

          },

          // ----------------------------------------------------
          // Estado de la postulación a la que pertenece
          // el documento
          // ----------------------------------------------------

         postulaciones: {

            select: {

              id:
                true,

              numero_intento:
                true,

              estados_postulacion: {

                select: {

                  estado_actual:
                    true,

                },

              },

            },

          },

        },

      });


  if (!documento) {

    throw new NotFoundException(
      'Documento no encontrado.',
    );

  }


  // ==========================================================
  // 2. POSTULANTE / USUARIO DEL SISTEMA
  // ==========================================================
  //
  // Solamente puede consultar sus propios documentos.
  // ==========================================================

  if (
    usuario.tipoUsuario ===
    'SISTEMA'
  ) {

    if (
      documento
        .postulantes
        .usuario_id !==
      usuario.id
    ) {

      throw new ForbiddenException(
        'No tiene permiso para acceder a este documento.',
      );

    }

  }


  // ==========================================================
  // 3. USUARIO ADMINISTRATIVO
  // ==========================================================

  else if (
    usuario.tipoUsuario ===
    'ADMINISTRATIVO'
  ) {

    // --------------------------------------------------------
    // IMPORTANTE:
    //
    // El JWT administrativo contiene principalmente el ID.
    // Por seguridad consultamos el rol ACTUAL directamente
    // desde la base de datos.
    // --------------------------------------------------------

    const administrativo =
      await this.prisma
        .usuarios_administrativos
        .findUnique({

          where: {
            id:
              usuario.id,
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
      !administrativo ||
      !administrativo.activo
    ) {

      throw new ForbiddenException(
        'El usuario administrativo no se encuentra autorizado.',
      );

    }


    const rol =
      String(
        administrativo.rol ||
        '',
      )
        .trim()
        .toUpperCase();


    // ========================================================
    // SUPERADMIN / RRHH
    // ========================================================
    //
    // Pueden revisar los documentos de los postulantes según
    // sus funciones administrativas.
    // ========================================================

    if (
      rol === 'SUPERADMIN' ||
      rol === 'ADMIN_RRHH'
    ) {

      // Permitido.
      // No se requiere validación adicional aquí.

    }


    // ========================================================
    // SUPERVISOR
    // ========================================================

    else if (
      rol === 'SUPERVISOR'
    ) {

      // ------------------------------------------------------
      // DOCUMENTOS PERMITIDOS PARA EL SUPERVISOR
      // ------------------------------------------------------

      const documentosPermitidos =
        new Set<string>([
          'HOJA_DE_VIDA',
          'RECORD_ACADEMICO',
        ]);


      if (
        !documentosPermitidos.has(
          documento.tipo_documento,
        )
      ) {

        throw new ForbiddenException(
          'Como Supervisor solamente puede consultar la Hoja de Vida y el Récord Académico del postulante.',
        );

      }


      // ------------------------------------------------------
      // EL POSTULANTE DEBE CONTINUAR APROBADO POR RRHH
      // ------------------------------------------------------
      //
      // De esta manera un Supervisor no puede intentar abrir
      // documentos pertenecientes a postulaciones rechazadas,
      // observadas, desistidas, etc.
      // ------------------------------------------------------

      const estadoPostulacion =
        documento
          .postulaciones
          .estados_postulacion
          ?.estado_actual;


      if (
        estadoPostulacion !==
        'APROBADO'
      ) {

        throw new ForbiddenException(
          'El documento no pertenece a un postulante aprobado y disponible para revisión.',
        );

      }

    }


    // ========================================================
    // OTROS ROLES ADMINISTRATIVOS
    // ========================================================

    else {

      throw new ForbiddenException(
        'No tiene permiso para acceder a documentos de postulantes.',
      );

    }

  }


  // ==========================================================
  // 4. TIPO DE USUARIO NO RECONOCIDO
  // ==========================================================

  else {

    throw new ForbiddenException(
      'No tiene permiso para acceder a este documento.',
    );

  }


  // ==========================================================
  // 5. OBTENER ARCHIVO FÍSICO
  // ==========================================================

  const nombreArchivo =
    basename(
      documento.archivo_url,
    );


  if (!nombreArchivo) {

    throw new NotFoundException(
      'El archivo asociado al documento no está disponible.',
    );

  }


  const rutaAbsoluta =
    join(
      process.cwd(),
      'uploads',
      'documentos',
      nombreArchivo,
    );


  // ==========================================================
  // 6. COMPROBAR EXISTENCIA DEL PDF
  // ==========================================================

  try {

    await access(
      rutaAbsoluta,
    );

  } catch {

    throw new NotFoundException(
      'El archivo físico no está disponible.',
    );

  }


  // ==========================================================
  // 7. RESPUESTA
  // ==========================================================

 const ciSeguro =
      String(
        documento.postulantes.ci ||
        'POSTULANTE',
      )
        .trim()
        .toUpperCase()
        .replace(
          /[^A-Z0-9-]/g,
          '_',
        );


    const numeroIntento =
      documento
        .postulaciones
        .numero_intento;


    return {

      rutaAbsoluta,

      nombreArchivo:
        `${documento.tipo_documento}_${ciSeguro}_INTENTO_${numeroIntento}.pdf`,

    };

}


  // ============================================================
  // RRHH - LISTAR TODOS LOS DOCUMENTOS
  // ============================================================

  async findAll() {

    const documentos =
      await this.prisma
        .documentos_postulante
        .findMany({

          include: {

            postulantes: {

              select: {
                id:
                  true,

                ci:
                  true,

                nombres:
                  true,

                apellido_paterno:
                  true,

                apellido_materno:
                  true,
              },
            },

            // Esta relación faltaba en tu código anterior.
            postulaciones: {

              select: {
                id:
                  true,

                numero_intento:
                  true,

                fecha_inicio:
                  true,

                fecha_cierre:
                  true,
              },
            },
          },

          orderBy: {
            uploaded_at:
              'desc',
          },
        });


    return documentos.map(
      (
        documento: DocumentoListado,
      ) => ({

        id:
          documento.id,

        postulante:
          documento.postulantes,

        postulacion: {

          id:
            documento.postulaciones.id,

          numero_intento:
            documento.postulaciones
              .numero_intento,

          fecha_inicio:
            documento.postulaciones
              .fecha_inicio,

          fecha_cierre:
            documento.postulaciones
              .fecha_cierre,
        },

        tipo_documento:
          documento.tipo_documento,

        verificado:
          documento.verificado,

        observacion:
          documento.observacion,

        uploaded_at:
          documento.uploaded_at,

        archivo_endpoint:
          `/documentos/${documento.id}/archivo`,
      }),
    );
  }
}