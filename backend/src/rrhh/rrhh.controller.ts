import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';

import { RrhhService } from './rrhh.service';
import { RrhhGuard } from './guards/rrhh.guard';

import { ParseUUIDPipe } from '@nestjs/common';

import {
  ActualizarControlAdministrativoDto,
} from './dto/actualizar-control-administrativo.dto';


import type {
  RequestConRrhh,
} from './guards/rrhh.guard';


type RechazarPeticionBody = {
  motivo?: string;
};

type NoSeleccionadoBody = {
  motivo?: string;
};

type SeguimientoPasanteBody = {
  fecha_inicio?: string;
  fecha_conclusion?: string;
  duracion_acordada?: string;
  horas_requeridas?: number;
  turno?: string;
};

type MotivoPasanteBody = {
  motivo?: string;
};

type FinalizarPasanteBody = {
  observacion?: string;
};


@Controller('rrhh')
@UseGuards(RrhhGuard)
export class RrhhController {

  constructor(
    private readonly rrhhService: RrhhService,
  ) {}


  @Get('peticiones')
  async obtenerPeticiones() {
    return this.rrhhService.obtenerPeticiones();
  }


  @Get('pasantes')
  async obtenerPasantes() {
    return this.rrhhService.obtenerPasantes();
  }


  @Patch('peticiones/:solicitudId/aprobar')
  async aprobarPeticion(
    @Req() request: RequestConRrhh,
    @Param('solicitudId') solicitudId: string,
  ) {
    return this.rrhhService.aprobarPeticion(
      request.usuarioRrhh.id,
      solicitudId,
    );
  }


  @Patch('peticiones/:solicitudId/rechazar')
  async rechazarPeticion(
    @Req() request: RequestConRrhh,
    @Param('solicitudId') solicitudId: string,
    @Body() body: RechazarPeticionBody,
  ) {
    return this.rrhhService.rechazarPeticion(
      request.usuarioRrhh.id,
      solicitudId,
      body.motivo ?? '',
    );
  }


  @Patch('peticiones/:solicitudId/confirmar-entrevista')
  async confirmarEntrevista(
    @Req() request: RequestConRrhh,
    @Param('solicitudId') solicitudId: string,
  ) {
    return this.rrhhService.confirmarEntrevista(
      request.usuarioRrhh.id,
      solicitudId,
    );
  }


  @Patch('peticiones/:solicitudId/desistimiento')
  async registrarDesistimiento(
    @Req() request: RequestConRrhh,
    @Param('solicitudId') solicitudId: string,
  ) {
    return this.rrhhService.registrarDesistimiento(
      request.usuarioRrhh.id,
      solicitudId,
    );
  }


  @Patch('peticiones/:solicitudId/no-seleccionado')
  async registrarNoSeleccionado(
    @Req() request: RequestConRrhh,
    @Param('solicitudId') solicitudId: string,
    @Body() body: NoSeleccionadoBody,
  ) {
    return this.rrhhService.registrarNoSeleccionado(
      request.usuarioRrhh.id,
      solicitudId,
      body.motivo ?? '',
    );
  }


  @Patch('peticiones/:solicitudId/seleccionar')
  async seleccionarPostulante(
    @Req() request: RequestConRrhh,
    @Param('solicitudId') solicitudId: string,
  ) {
    return this.rrhhService.seleccionarPostulante(
      request.usuarioRrhh.id,
      solicitudId,
    );
  }


  @Patch('pasantes/:pasanteId/seguimiento')
  async guardarSeguimientoPasante(
    @Req() request: RequestConRrhh,
    @Param('pasanteId') pasanteId: string,
    @Body() body: SeguimientoPasanteBody,
  ) {
    return this.rrhhService.guardarSeguimientoPasante(
      request.usuarioRrhh.id,
      pasanteId,
      body,
    );
  }


  @Patch('pasantes/:pasanteId/suspender')
  async suspenderPasante(
    @Req() request: RequestConRrhh,
    @Param('pasanteId') pasanteId: string,
    @Body() body: MotivoPasanteBody,
  ) {
    return this.rrhhService.suspenderPasante(
      request.usuarioRrhh.id,
      pasanteId,
      body.motivo ?? '',
    );
  }


  @Patch('pasantes/:pasanteId/reactivar')
  async reactivarPasante(
    @Req() request: RequestConRrhh,
    @Param('pasanteId') pasanteId: string,
    @Body() body: MotivoPasanteBody,
  ) {
    return this.rrhhService.reactivarPasante(
      request.usuarioRrhh.id,
      pasanteId,
      body.motivo ?? '',
    );
  }


  @Patch('pasantes/:pasanteId/abandono')
  async registrarAbandonoPasante(
    @Req() request: RequestConRrhh,
    @Param('pasanteId') pasanteId: string,
    @Body() body: MotivoPasanteBody,
  ) {
    return this.rrhhService.registrarAbandonoPasante(
      request.usuarioRrhh.id,
      pasanteId,
      body.motivo ?? '',
    );
  }


  @Patch('pasantes/:pasanteId/finalizar')
  async finalizarPasante(
    @Req() request: RequestConRrhh,
    @Param('pasanteId') pasanteId: string,
    @Body() body: FinalizarPasanteBody,
  ) {
    return this.rrhhService.finalizarPasante(
      request.usuarioRrhh.id,
      pasanteId,
      body.observacion,
    );
  }


  
  // ============================================================
  // CONTROL ADMINISTRATIVO - CONSULTAR
  // ============================================================

  @Get('pasantes/:pasanteId/control-administrativo')
  async obtenerControlAdministrativo(
    @Param('pasanteId', ParseUUIDPipe)
    pasanteId: string,
  ) {
    return this.rrhhService.obtenerControlAdministrativo(
      pasanteId,
    );
  }

  // ============================================================
  // CONTROL ADMINISTRATIVO - ACTUALIZAR
  // ============================================================

  @Patch('pasantes/:pasanteId/control-administrativo')
  async actualizarControlAdministrativo(
    @Req()
    request: RequestConRrhh,

    @Param('pasanteId', ParseUUIDPipe)
    pasanteId: string,

    @Body()
    body: ActualizarControlAdministrativoDto,
  ) {
    return this.rrhhService.actualizarControlAdministrativo(
      request.usuarioRrhh.id,
      pasanteId,
      body,
    );
  }


}