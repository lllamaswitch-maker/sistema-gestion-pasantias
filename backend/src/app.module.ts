
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PostulacionesModule } from './postulaciones/postulaciones.module';
import { DocumentosModule } from './documentos/documentos.module';
import { AdministracionModule } from './administracion/administracion.module';
import { SupervisorModule } from './supervisor/supervisor.module';
import { RrhhModule } from './rrhh/rrhh.module';
import { DataMartModule } from './data-mart/data-mart.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    PostulacionesModule,
    DocumentosModule,
    AdministracionModule,
    SupervisorModule,
    RrhhModule,
    DataMartModule,

    ServeStaticModule.forRoot({
      rootPath: join(
        __dirname,
        '..',
        'uploads',
      ),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
  ],
})
export class AppModule {}
