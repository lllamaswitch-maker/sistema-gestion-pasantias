import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  UsuariosAdministrativosService,
} from './usuarios-administrativos.service';

import {
  SuperadminGuard,
} from './guards/superadmin.guard';

import type {
  RequestConAdministrador,
} from './guards/superadmin.guard';


@Controller('usuarios-administrativos')
@UseGuards(SuperadminGuard)
export class UsuariosAdministrativosController {

  constructor(
    private readonly usuariosService:
      UsuariosAdministrativosService,
  ) {}


  // ============================================================
  // LISTAR
  // ============================================================

  @Get()
  listar() {

    return this.usuariosService
      .listar();

  }


  // ============================================================
  // CREAR
  // ============================================================

  @Post()
  crear(

    @Body()
    body: {
      ci?: string;
      nombres?: string;
      apellidos?: string;
      email?: string;
      cargo?: string;
      rol?: string;
      departamento_id?: string | null;
      password?: string;
    },

    @Req()
    request: RequestConAdministrador,

  ) {

    return this.usuariosService
      .crear(
        body,
        request.usuarioAdministrativo!.id,
      );

  }


  // ============================================================
  // ACTUALIZAR
  // REQUIERE CONTRASEÑA DEL SUPERADMIN
  // ============================================================

  @Patch(':id')
  actualizar(

    @Param('id')
    id: string,

    @Body()
    body: {
      ci?: string;
      nombres?: string;
      apellidos?: string;
      email?: string;
      cargo?: string;
      rol?: string;
      departamento_id?: string | null;

      // Contraseña del SUPERADMIN
      // que autoriza la operación.
      password_autorizacion?: string;
    },

    @Req()
    request: RequestConAdministrador,

  ) {

    return this.usuariosService
      .actualizar(
        id,
        body,
        request.usuarioAdministrativo!.id,
      );

  }


  // ============================================================
  // ACTIVAR / DESACTIVAR
  // ============================================================

  @Patch(':id/estado')
  cambiarEstado(

    @Param('id')
    id: string,

    @Body()
    body: {
      activo?: boolean;
    },

    @Req()
    request: RequestConAdministrador,

  ) {

    return this.usuariosService
      .cambiarEstado(
        id,
        body,
        request.usuarioAdministrativo!.id,
      );

  }


  // ============================================================
  // RESTABLECER CONTRASEÑA
  // ============================================================

  @Patch(':id/restablecer-password')
    restablecerPassword(

      @Param('id')
      id: string,

      @Body()
      body: {
        password?: string;
        password_autorizacion?: string;
      },

      @Req()
      request: RequestConAdministrador,

    ) {

      return this.usuariosService
        .restablecerPassword(
          id,
          body,
          request.usuarioAdministrativo!.id,
        );

    }
}