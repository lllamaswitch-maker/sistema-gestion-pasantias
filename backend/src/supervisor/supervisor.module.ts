import {
  Module,
} from '@nestjs/common';

import {
  AuthModule,
} from '../auth/auth.module';

import {
  PrismaService,
} from '../prisma/prisma.service';

import {
  PrismaModule,
} from '../prisma/prisma.module';

import {
  SupervisorController,
} from './supervisor.controller';

import {
  SupervisorService,
} from './supervisor.service';

import {
  SupervisorGuard,
} from './guards/supervisor.guard';


@Module({

  imports: [
  PrismaModule,
  AuthModule,
  ],

  controllers: [
    SupervisorController,
  ],

  providers: [
    PrismaService,
    SupervisorService,
    SupervisorGuard,
  ],

})
export class SupervisorModule {}