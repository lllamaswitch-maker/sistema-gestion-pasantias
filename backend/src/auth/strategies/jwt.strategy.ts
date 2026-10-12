import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import {
  PassportStrategy,
} from '@nestjs/passport';

import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';

import { ConfigService } from '@nestjs/config';

import { PrismaService } from '../../prisma/prisma.service';

import {
  JwtPayload,
  UsuarioAutenticado,
} from '../interfaces/jwt-payload.interface';


@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
) {
  private readonly prisma: PrismaService;

  constructor(
    configService: ConfigService,
    prisma: PrismaService,
  ) {
    const secret =
      configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error(
        'JWT_SECRET no está configurado.',
      );
    }

    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,

      secretOrKey: secret,
    });

    this.prisma = prisma;
  }


  async validate(
    payload: JwtPayload,
  ): Promise<UsuarioAutenticado> {

    if (
      !payload?.sub ||
      !payload?.tipoUsuario
    ) {
      throw new UnauthorizedException(
        'Token inválido.',
      );
    }


    // =========================================================
    // USUARIO ADMINISTRATIVO / RRHH
    // =========================================================
    if (
      payload.tipoUsuario ===
      'ADMINISTRATIVO'
    ) {
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
              rol: true,
              activo: true,
            },
          });


      if (
        !usuario ||
        !usuario.activo
      ) {
        throw new UnauthorizedException(
          'Usuario no autorizado.',
        );
      }


      return {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
        tipoUsuario:
          'ADMINISTRATIVO',
        postulanteId: null,
      };
    }


    // =========================================================
    // USUARIO DEL SISTEMA
    // POSTULANTE / PASANTE / ETC.
    // =========================================================
    if (
      payload.tipoUsuario ===
      'SISTEMA'
    ) {
      const usuario =
        await this.prisma
          .usuarios_sistema
          .findUnique({
            where: {
              id: payload.sub,
            },

            select: {
              id: true,
              email: true,
              rol: true,
              activo: true,
              cuenta_verificada: true,

              postulantes: {
                select: {
                  id: true,
                },

                take: 1,
              },
            },
          });


      if (
        !usuario ||
        !usuario.activo ||
        !usuario.cuenta_verificada
      ) {
        throw new UnauthorizedException(
          'Usuario no autorizado.',
        );
      }


      const postulante =
        usuario.postulantes?.[0];


      return {
        id: usuario.id,
        email: usuario.email,
        rol: String(usuario.rol),

        tipoUsuario: 'SISTEMA',

        postulanteId:
          postulante?.id ?? null,
      };
    }


    throw new UnauthorizedException(
      'Tipo de usuario inválido.',
    );
  }
}