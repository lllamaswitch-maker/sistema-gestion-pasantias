import {
  Module,
} from '@nestjs/common';

import {
  PostulacionesService,
} from './postulaciones.service';

import {
  PostulacionesController,
} from './postulaciones.controller';

import {
  PrismaModule,
} from '../prisma/prisma.module';

import {
  AuthModule,
} from '../auth/auth.module';


@Module({

  imports: [
    PrismaModule,
    AuthModule,
  ],

  controllers: [
    PostulacionesController,
  ],

  providers: [
    PostulacionesService,
  ],

  exports: [
    PostulacionesService,
  ],

})
export class PostulacionesModule {}