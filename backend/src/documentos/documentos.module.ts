import {
  Module,
} from '@nestjs/common';

import {
  DocumentosService,
} from './documentos.service';

import {
  DocumentosController,
} from './documentos.controller';

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
    DocumentosController,
  ],

  providers: [
    DocumentosService,
  ],

  exports: [
    DocumentosService,
  ],
})
export class DocumentosModule {}