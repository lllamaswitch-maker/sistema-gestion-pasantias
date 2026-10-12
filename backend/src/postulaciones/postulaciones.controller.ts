import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import {
  estado_postulacion_enum,
} from './estado-postulacion';

import {
  PostulacionesService,
} from './postulaciones.service';

import {
  CompletarFormularioDto,
} from './dto/completar-formulario.dto';

import {
  JwtAuthGuard,
} from '../auth/guards/jwt-auth.guard';

import {
  RolesGuard,
} from '../auth/guards/roles.guard';

import {
  AdministrativoGuard,
} from '../auth/guards/administrativo.guard';

import {
  Roles,
} from '../auth/decorators/roles.decorator';

import {
  CurrentUser,
} from '../auth/decorators/current-user.decorator';

import type {
  UsuarioAutenticado,
} from '../auth/interfaces/jwt-payload.interface';


@Controller('postulaciones')
@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
export class PostulacionesController {

  constructor(
    private readonly postulacionesService:
      PostulacionesService,
  ) {}


  // ============================================================
  // POSTULANTE - OBTENER SU PROPIA POSTULACIÓN
  // ============================================================

  @Get('mi-postulacion')
  @Roles(
    'POSTULANTE',
    'PASANTE',
  )
  obtenerMiPostulacion(

    @CurrentUser()
    usuario:
      UsuarioAutenticado,
  ) {

    return this
      .postulacionesService
      .obtenerMiPostulacion(
        usuario.id,
      );
  }


  // ============================================================
  // POSTULANTE - COMPLETAR SU FORMULARIO
  // ============================================================

  @Post('completar-formulario')
  @Roles(
    'POSTULANTE',
    'PASANTE',
  )
  completarFormulario(

    @CurrentUser()
    usuario:
      UsuarioAutenticado,

    @Body()
    dto:
      CompletarFormularioDto,
  ) {

    return this
      .postulacionesService
      .completarFormulario(
        usuario.id,
        dto,
      );
  }


  // ============================================================
  // RRHH - LISTAR POSTULACIONES
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
      .postulacionesService
      .findAll();
  }

// ============================================================
// RRHH - HISTORIAL DE POSTULACIONES
// ============================================================

@Get('historial')
@UseGuards(
  AdministrativoGuard,
)
@Roles(
  'SUPERADMIN',
  'ADMIN_RRHH',
)
obtenerHistorialPostulaciones() {

  return this
    .postulacionesService
    .obtenerHistorialPostulaciones();
}
  // ============================================================
  // RRHH - APROBAR
  // ============================================================

  @Patch(':id/aprobar')
  @UseGuards(
    AdministrativoGuard,
  )
  @Roles(
    'SUPERADMIN',
    'ADMIN_RRHH',
  )
  aprobarPostulacion(

    @Param(
      'id',
      new ParseUUIDPipe(),
    )
    id: string,

    @Body()
    body: {
      observaciones?: string;
    },
  ) {

    return this
      .postulacionesService
      .updateEstado(

        id,

        estado_postulacion_enum
          .APROBADO,

        body.observaciones ||
          'Documentación verificada y aprobada por Talento Humano',
      );
  }
  // ============================================================
  // RRHH - INICIAR EVALUACIÓN
  // ============================================================

  @Patch(':id/iniciar-evaluacion')
  @UseGuards(
    AdministrativoGuard,
  )
  @Roles(
    'SUPERADMIN',
    'ADMIN_RRHH',
  )
  iniciarEvaluacion(

    @Param(
      'id',
      new ParseUUIDPipe(),
    )
    id: string,

  ) {

    return this
      .postulacionesService
      .updateEstado(

        id,

        estado_postulacion_enum
          .EN_EVALUACION_RRHH,

        'Postulación ingresada a evaluación por Talento Humano.',
      );
  }

  // ============================================================
  // RRHH - RECHAZAR
  // ============================================================

  @Patch(':id/descartar')
  @UseGuards(
    AdministrativoGuard,
  )
  @Roles(
    'SUPERADMIN',
    'ADMIN_RRHH',
  )
  descartarPostulacion(

    @Param(
      'id',
      new ParseUUIDPipe(),
    )
    id: string,

    @Body()
    body: {
      motivo?: string;
    },
  ) {

    return this
      .postulacionesService
      .updateEstado(

        id,

        estado_postulacion_enum
          .RECHAZADO,

        body.motivo ||
          'Postulación rechazada por Talento Humano',
      );
  }
// ============================================================
// RRHH - MARCAR POSTULACIÓN COMO DESISTIDA
// ============================================================

@Patch(':id/desistir')
@UseGuards(
  AdministrativoGuard,
)
@Roles(
  'SUPERADMIN',
  'ADMIN_RRHH',
)
desistirPostulacion(

  @Param(
    'id',
    new ParseUUIDPipe(),
  )
  id: string,

  @Body()
  body: {
    motivo?: string;
  },
) {

  return this
    .postulacionesService
    .updateEstado(

      id,

      estado_postulacion_enum
        .DESISTIDO,

      body.motivo ||
        'El postulante comunicó que desiste del proceso de postulación.',
    );
}

  // ============================================================
  // RRHH - REVISAR DOCUMENTOS
  // ============================================================

  @Patch(':id/revisar-documentos')
  @UseGuards(
    AdministrativoGuard,
  )
  @Roles(
    'SUPERADMIN',
    'ADMIN_RRHH',
  )
  revisarDocumentos(

    @Param(
      'id',
      new ParseUUIDPipe(),
    )
    id: string,

    @Body()
    body: {

      revisiones: Array<{

        documento_id:
          string;

        verificado:
          boolean;

        observacion?:
          string;
      }>;

      observacion_general?:
        string;
    },
  ) {

    return this
      .postulacionesService
      .revisarDocumentos(
        id,
        body,
      );
  }
}