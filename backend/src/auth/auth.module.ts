import {
  Module,
} from '@nestjs/common';

import {
  JwtModule,
} from '@nestjs/jwt';

import {
  PassportModule,
} from '@nestjs/passport';

import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';

import {
  AuthService,
} from './auth.service';

import {
  AuthController,
} from './auth.controller';

import {
  PrismaModule,
} from '../prisma/prisma.module';

import {
  MailService,
} from './mail.service';

import {
  JwtStrategy,
} from './strategies/jwt.strategy';

import {
  JwtAuthGuard,
} from './guards/jwt-auth.guard';

import {
  RolesGuard,
} from './guards/roles.guard';

import {
  AdministrativoGuard,
} from './guards/administrativo.guard';


@Module({

  imports: [

    PrismaModule,

    ConfigModule,

    PassportModule.register({
      defaultStrategy:
        'jwt',
    }),

    JwtModule.registerAsync({

      imports: [
        ConfigModule,
      ],

      inject: [
        ConfigService,
      ],

      useFactory: (
        configService:
          ConfigService,
      ) => {

        const secret =
          configService
            .get<string>(
              'JWT_SECRET',
            );


        if (!secret) {

          throw new Error(
            'JWT_SECRET no está configurado.',
          );

        }


        return {

          secret,

          signOptions: {
            expiresIn:
              '8h',
          },

        };

      },

    }),

  ],


  controllers: [
    AuthController,
  ],


  providers: [

    AuthService,

    MailService,

    JwtStrategy,

    JwtAuthGuard,

    RolesGuard,

    AdministrativoGuard,

  ],


  exports: [

    AuthService,

    MailService,

    JwtModule,

    JwtAuthGuard,

    RolesGuard,

    AdministrativoGuard,

  ],

})
export class AuthModule {}