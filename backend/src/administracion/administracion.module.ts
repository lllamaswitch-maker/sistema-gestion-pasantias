import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma/prisma.service';
import { SuperadminGuard } from './guards/superadmin.guard';
import { OrganizacionController } from './organizacion.controller';
import { OrganizacionService } from './organizacion.service';
import { UsuariosAdministrativosController } from './usuarios-administrativos.controller';
import { UsuariosAdministrativosService } from './usuarios-administrativos.service';

@Module({
  imports: [
    AuthModule,
  ],

  controllers: [
    OrganizacionController,
    UsuariosAdministrativosController,
  ],

  providers: [
    PrismaService,
    SuperadminGuard,
    OrganizacionService,
    UsuariosAdministrativosService,
  ],
})
export class AdministracionModule {}