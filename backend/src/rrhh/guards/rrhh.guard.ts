import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '../../prisma/prisma.service';


// ============================================================
// TIPO DE REQUEST CON USUARIO RRHH
// ============================================================

export interface RequestConRrhh extends Request {
  usuarioRrhh: {
    id: string;
    email: string;
    nombres: string;
    apellidos: string;
    cargo: string;
    rol: string;
    activo: boolean;
    departamento_id: string | null;
  };
}


// ============================================================
// GUARD RRHH
// ============================================================

@Injectable()
export class RrhhGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}


  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const request =
      context
        .switchToHttp()
        .getRequest();


    // ==========================================================
    // OBTENER TOKEN
    // ==========================================================

    const authorization =
      request.headers?.authorization;


    if (
      !authorization ||
      !authorization.startsWith('Bearer ')
    ) {

      throw new UnauthorizedException(
        'No se encontró un token de autenticación válido.',
      );
    }


    const token =
      authorization.substring(7);


    if (!token) {

      throw new UnauthorizedException(
        'Token de autenticación inválido.',
      );
    }


    // ==========================================================
    // VALIDAR JWT
    // ==========================================================

    let payload: {
      sub?: string;
      tipoUsuario?: string;
    };


    try {

      payload =
        await this.jwtService
          .verifyAsync(token);

    } catch {

      throw new UnauthorizedException(
        'La sesión no es válida o ha expirado.',
      );
    }


    // ==========================================================
    // DEBE SER USUARIO ADMINISTRATIVO
    // ==========================================================

    if (
      !payload?.sub ||
      payload.tipoUsuario !== 'ADMINISTRATIVO'
    ) {

      throw new UnauthorizedException(
        'Usuario administrativo no válido.',
      );
    }


    // ==========================================================
    // CONSULTAR USUARIO REAL EN BASE DE DATOS
    // ==========================================================

    const usuario =
      await this.prisma
        .usuarios_administrativos
        .findUnique({

          where: {
            id: payload.sub,
          },

          select: {
            id: true,
            email: true,
            nombres: true,
            apellidos: true,
            cargo: true,
            rol: true,
            activo: true,
            departamento_id: true,
          },

        });


    if (
      !usuario ||
      !usuario.activo
    ) {

      throw new UnauthorizedException(
        'El usuario administrativo no existe o se encuentra inactivo.',
      );
    }


    // ==========================================================
    // SOLO RRHH Y SUPERADMIN
    // ==========================================================

    const rolesPermitidos = [
      'ADMIN_RRHH',
      'SUPERADMIN',
    ];


    if (
      !rolesPermitidos.includes(
        usuario.rol,
      )
    ) {

      throw new ForbiddenException(
        'No tiene permisos para acceder al módulo de Talento Humano.',
      );
    }


    // ==========================================================
    // ADJUNTAR USUARIO ACTUAL AL REQUEST
    // ==========================================================

    request.usuarioRrhh = {
      id: usuario.id,
      email: usuario.email,
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      cargo: usuario.cargo,
      rol: usuario.rol,
      activo: usuario.activo,
      departamento_id:
        usuario.departamento_id,
    };


    return true;
  }
}