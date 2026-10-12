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


export type RequestConAdministrador =
  Request & {

    usuarioAdministrativo?: {

      id:
        string;

      rol:
        string;

      email:
        string;

    };

  };


@Injectable()
export class SuperadminGuard
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
        .getRequest<
          RequestConAdministrador
        >();


    const authorization =
      request
        .headers
        .authorization;


    if (
      !authorization
        ?.startsWith(
          'Bearer ',
        )
    ) {

      throw new UnauthorizedException(
        'Sesión administrativa no válida.',
      );

    }


    const token =
      authorization
        .slice(7)
        .trim();


    if (!token) {

      throw new UnauthorizedException(
        'Sesión administrativa no válida.',
      );

    }


    let payload: {

      sub?:
        string;

      tipoUsuario?:
        string;

    };


    try {

      payload =
        await this.jwtService
          .verifyAsync(
            token,
          );

    } catch {

      throw new UnauthorizedException(
        'La sesión ha expirado o no es válida.',
      );

    }


    if (
      !payload.sub ||
      payload.tipoUsuario !==
        'ADMINISTRATIVO'
    ) {

      throw new UnauthorizedException(
        'Sesión administrativa no válida.',
      );

    }


    const usuario =
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

            rol:
              true,

            email:
              true,

            activo:
              true,

          },

        });


    if (
      !usuario ||
      !usuario.activo
    ) {

      throw new UnauthorizedException(
        'El usuario administrativo no está activo.',
      );

    }


    if (
      usuario.rol !==
      'SUPERADMIN'
    ) {

      throw new ForbiddenException(
        'Esta operación está disponible únicamente para el SUPERADMIN.',
      );

    }


    request.usuarioAdministrativo = {

      id:
        usuario.id,

      rol:
        usuario.rol,

      email:
        usuario.email,

    };


    return true;

  }
}