import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';

import { OrganizacionService } from './organizacion.service';

import { SuperadminGuard } from './guards/superadmin.guard';


@Controller('organizacion')
@UseGuards(SuperadminGuard)
export class OrganizacionController {

  constructor(
    private readonly organizacionService:
      OrganizacionService,
  ) {}


  // ============================================================
  // LISTAR GERENCIAS
  // ============================================================

  @Get('gerencias')
  listarGerencias() {

    return this.organizacionService
      .listarGerencias();

  }


  // ============================================================
  // LISTAR DEPARTAMENTOS DE UNA GERENCIA
  // ============================================================

  @Get('gerencias/:gerenciaId/departamentos')
  listarDepartamentosPorGerencia(
    @Param('gerenciaId')
    gerenciaId: string,
  ) {

    return this.organizacionService
      .listarDepartamentosPorGerencia(
        gerenciaId,
      );

  }
}