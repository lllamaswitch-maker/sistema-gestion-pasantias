import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';

import { RrhhController } from './rrhh.controller';
import { RrhhService } from './rrhh.service';
import { RrhhGuard } from './guards/rrhh.guard';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
  ],

  controllers: [
    RrhhController,
  ],

  providers: [
    RrhhService,
    RrhhGuard,
  ],

  exports: [
    RrhhService,
  ],
})
export class RrhhModule {}