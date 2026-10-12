import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';

import { LoginDto } from './dto/login.dto';

import {
  PreRegistroDto,
  VerificarCodigoDto,
} from './dto/pre-registro.dto';

import { JwtAuthGuard } from './guards/jwt-auth.guard';

import { CurrentUser } from './decorators/current-user.decorator';

import type {
  UsuarioAutenticado,
} from './interfaces/jwt-payload.interface';



@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
  ) {}


  // ============================================================
  // LOGIN ADMINISTRATIVO / RRHH
  // POST /auth/login
  // ============================================================

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
  ) {
    return this.authService.login(
      loginDto,
    );
  }


  // ============================================================
  // PRE-REGISTRO POSTULANTE
  // POST /auth/pre-registro
  // ============================================================

  @Post('pre-registro')
  async preRegistro(
    @Body() dto: PreRegistroDto,
  ) {
    return this.authService.preRegistro(
      dto,
    );
  }


  // ============================================================
  // VERIFICAR CÓDIGO OTP
  // POST /auth/verificar-codigo
  // ============================================================

  @Post('verificar-codigo')
  async verificarCodigo(
    @Body() dto: VerificarCodigoDto,
  ) {
    return this.authService.verificarCodigo(
      dto,
    );
  }


  // ============================================================
  // LOGIN POSTULANTE
  // POST /auth/login-postulante
  // ============================================================

  @Post('login-postulante')
  async loginPostulante(
    @Body() loginDto: LoginDto,
  ) {
    return this.authService.loginPostulante(
      loginDto,
    );
  }


  // ============================================================
  // USUARIO AUTENTICADO
  // GET /auth/me
  //
  // Esta ruta sirve para:
  // - comprobar que el JWT es válido
  // - obtener el usuario autenticado
  // - comprobar su rol
  // - obtener postulanteId desde el servidor
  //
  // NO recibe postulante_id desde Vue.
  // ============================================================

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(
    @CurrentUser()
    usuario: UsuarioAutenticado,
  ) {
    return {
      usuario,
    };
  }
}