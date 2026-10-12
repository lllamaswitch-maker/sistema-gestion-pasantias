
import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { DataMartController } from './data-mart.controller';
import { DataMartService } from './data-mart.service';
import { DataMartEtlService } from './data-mart-etl.service';

@Module({
  imports: [PrismaModule],
  controllers: [DataMartController],
  providers: [DataMartService, DataMartEtlService],
})
export class DataMartModule {}
