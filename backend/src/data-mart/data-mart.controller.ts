
import {
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdministrativoGuard } from '../auth/guards/administrativo.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { Roles } from '../auth/decorators/roles.decorator';

import { DataMartService } from './data-mart.service';
import { DataMartEtlService } from './data-mart-etl.service';

@Controller('rrhh/data-mart')
@UseGuards(
  JwtAuthGuard,
  AdministrativoGuard,
  RolesGuard,
)
@Roles('ADMIN_RRHH')
export class DataMartController {
  constructor(
    private readonly dataMartService: DataMartService,
    private readonly dataMartEtlService: DataMartEtlService,
  ) {}

  // ============================================================
  // RESUMEN GENERAL
  // ============================================================

  @Get('resumen')
  obtenerResumen() {
    return this.dataMartService.obtenerResumen();
  }

  // ============================================================
  // PASANTÍAS POR PERÍODO
  // ============================================================

  @Get('por-periodo')
  obtenerPorPeriodo() {
    return this.dataMartService.obtenerPorPeriodo();
  }

  // ============================================================
  // PASANTÍAS POR INSTITUCIÓN Y CARRERA
  // ============================================================

  @Get('por-institucion-carrera')
  obtenerPorInstitucionCarrera() {
    return this.dataMartService.obtenerPorInstitucionCarrera();
  }

  // ============================================================
  // PASANTÍAS POR GERENCIA Y DEPARTAMENTO
  // ============================================================

  @Get('por-unidad')
  obtenerPorUnidad() {
    return this.dataMartService.obtenerPorUnidadOrganizacional();
  }

  // ============================================================
  // DISTRIBUCIÓN POR GÉNERO, EDAD Y TURNO
  // ============================================================

  @Get('distribucion-postulantes')
  obtenerDistribucionPostulantes() {
    return this.dataMartService.obtenerDistribucionPostulantes();
  }

  // ============================================================
  // SINCRONIZACIÓN DEL DATA MART
  // ============================================================

  @Post('sincronizar')
  sincronizar() {
    return this.dataMartEtlService.sincronizar();
  }
}
