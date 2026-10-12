import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import {
  JwtService,
} from '@nestjs/jwt';

import type {
  Request,
} from 'express';

import {
  PrismaService,
} from '../../prisma/prisma.service';


// ============================================================
// DATOS DEL SUPERVISOR AUTENTICADO
// ============================================================

export interface SupervisorAutenticado {
  id: string;
  email: string;
  rol: string;
  departamento_id: string;
}


// ============================================================
// REQUEST EXTENDIDO
// ============================================================

export interface RequestConSupervisor
  extends Request {

  usuarioSupervisor?:
    SupervisorAutenticado;

}


// ============================================================
// GUARD
// ============================================================

@Injectable()
export class SupervisorGuard
  implements CanActivate {

  constructor(

    private readonly jwtService:
      JwtService,

    private readonly prisma:
      PrismaService,

  ) {}


  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const request =
      context
        .switchToHttp()
        .getRequest<RequestConSupervisor>();


    // ========================================================
    // TOKEN
    // ========================================================

    const authorization =
      request.headers
        .authorization;


    if (
      !authorization ||
      !authorization.startsWith(
        'Bearer ',
      )
    ) {

      throw new UnauthorizedException(
        'No se proporcionó un token de autenticación.',
      );

    }


    const token =
      authorization
        .substring(7)
        .trim();


    if (!token) {

      throw new UnauthorizedException(
        'El token de autenticación no es válido.',
      );

    }


    // ========================================================
    // VALIDAR JWT
    // ========================================================

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


    if (
      !payload.sub ||
      payload.tipoUsuario !==
        'ADMINISTRATIVO'
    ) {

      throw new UnauthorizedException(
        'La sesión administrativa no es válida.',
      );

    }


    // ========================================================
    // BUSCAR USUARIO REAL EN BD
    // ========================================================

    const supervisor =
      await this.prisma
        .usuarios_administrativos
        .findUnique({

          where: {
            id:
              payload.sub,
          },

          select: {

            id:
              true,

            email:
              true,

            rol:
              true,

            activo:
              true,

            departamento_id:
              true,

          },

        });


    if (!supervisor) {

      throw new UnauthorizedException(
        'El usuario administrativo no existe.',
      );

    }


    if (!supervisor.activo) {

      throw new ForbiddenException(
        'La cuenta se encuentra desactivada.',
      );

    }


    // ========================================================
    // SOLO SUPERVISOR
    // ========================================================

    if (
      supervisor.rol !==
      'SUPERVISOR'
    ) {

      throw new ForbiddenException(
        'Esta operación está disponible únicamente para supervisores.',
      );

    }


    // ========================================================
    // DEBE TENER DEPARTAMENTO
    // ========================================================

    if (
      !supervisor.departamento_id
    ) {

      throw new ForbiddenException(
        'El supervisor no tiene un Departamento asignado.',
      );

    }


    // ========================================================
    // ADJUNTAR USUARIO AL REQUEST
    // ========================================================

    request.usuarioSupervisor = {

      id:
        supervisor.id,

      email:
        supervisor.email,

      rol:
        supervisor.rol,

      departamento_id:
        supervisor.departamento_id,

    };


    return true;

  }

}