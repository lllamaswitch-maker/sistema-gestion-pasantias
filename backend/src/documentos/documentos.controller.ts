import {
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Body,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import {
  diskStorage,
} from 'multer';

import {
  join,
} from 'path';

import {
  mkdirSync,
} from 'fs';

import {
  randomUUID,
} from 'crypto';

import type {
  Response,
} from 'express';

import {
  DocumentosService,
} from './documentos.service';

import {
  JwtAuthGuard,
} from '../auth/guards/jwt-auth.guard';

import {
  RolesGuard,
} from '../auth/guards/roles.guard';

import {
  Roles,
} from '../auth/decorators/roles.decorator';

import {
  CurrentUser,
} from '../auth/decorators/current-user.decorator';

import type {
  UsuarioAutenticado,
} from '../auth/interfaces/jwt-payload.interface';
import {
  AdministrativoGuard,
} from '../auth/guards/administrativo.guard';


@Controller('documentos')
@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
export class DocumentosController {

  constructor(
    private readonly documentosService:
      DocumentosService,
  ) {}


  // ============================================================
  // POSTULANTE - SUBIR SU PROPIO PDF
  // ============================================================

  @Post('upload')
  @Roles(
    'POSTULANTE',
    'PASANTE',
  )
  @UseInterceptors(
    FileInterceptor(
      'file',
      {

        storage:
          diskStorage({

            destination: (
              _req,
              _file,
              callback,
            ) => {

              const directorio =
                join(
                  process.cwd(),
                  'uploads',
                  'documentos',
                );

              mkdirSync(
                directorio,
                {
                  recursive: true,
                },
              );

              callback(
                null,
                directorio,
              );
            },


            filename: (
              _req,
              _file,
              callback,
            ) => {

              const nombreSeguro =
                `${randomUUID()}.pdf`;

              callback(
                null,
                nombreSeguro,
              );
            },
          }),


        fileFilter: (
          _req,
          file,
          callback,
        ) => {

          const nombre =
            file.originalname
              .toLowerCase();

          const esPdf =
            file.mimetype ===
              'application/pdf' &&
            nombre.endsWith(
              '.pdf',
            );


          if (!esPdf) {

            return callback(
              new BadRequestException(
                'Solo se permiten archivos PDF.',
              ),
              false,
            );
          }


          callback(
            null,
            true,
          );
        },


        limits: {
          fileSize:
            5 *
            1024 *
            1024,
        },
      },
    ),
  )
  subirDocumento(

    @CurrentUser()
    usuario: UsuarioAutenticado,

    @UploadedFile()
    file: Express.Multer.File,

    @Body('tipo_documento')
    tipoDocumento: string,
  ) {

    if (!file) {

      throw new BadRequestException(
        'Archivo no proporcionado.',
      );
    }


    return this.documentosService
      .guardarDocumento(
        usuario.id,
        tipoDocumento,
        file,
      );
  }


  // ============================================================
  // POSTULANTE - VER SUS DOCUMENTOS
  // ============================================================

  @Get('mis-documentos')
  @Roles(
    'POSTULANTE',
    'PASANTE',
  )
  misDocumentos(

    @CurrentUser()
    usuario: UsuarioAutenticado,
  ) {

    return this.documentosService
      .obtenerMisDocumentos(
        usuario.id,
      );
  }


  // ============================================================
  // POSTULANTE - FINALIZAR POSTULACIÓN
  // ============================================================

  @Post('finalizar')
  @Roles(
    'POSTULANTE',
    'PASANTE',
  )
  finalizar(

    @CurrentUser()
    usuario: UsuarioAutenticado,
  ) {

    return this.documentosService
      .finalizarPostulacion(
        usuario.id,
      );
  }


  // ============================================================
  // DESCARGAR / VER PDF PROTEGIDO
  // ============================================================

  @Get(':id/archivo')
  async obtenerArchivo(

    @CurrentUser()
    usuario: UsuarioAutenticado,

    @Param(
      'id',
      new ParseUUIDPipe(),
    )
    documentoId: string,

    @Res()
    response: Response,
  ) {

    const archivo =
      await this.documentosService
        .obtenerArchivo(
          usuario,
          documentoId,
        );


    return response.sendFile(
      archivo.rutaAbsoluta,
      {
        headers: {
          'Content-Type':
            'application/pdf',

          'Content-Disposition':
            `inline; filename="${archivo.nombreArchivo}"`,

          'X-Content-Type-Options':
            'nosniff',

          'Cache-Control':
            'private, no-store',
        },
      },
    );
  }


  // ============================================================
  // RRHH - LISTAR TODOS LOS DOCUMENTOS
  // ============================================================

  @Get()
@UseGuards(
  AdministrativoGuard,
)
@Roles(
  'SUPERADMIN',
  'ADMIN_RRHH',
)
findAll() {

  return this
    .documentosService
    .findAll();
}
}