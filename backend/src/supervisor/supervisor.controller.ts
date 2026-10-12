import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  SupervisorService,
} from './supervisor.service';

import {
  SupervisorGuard,
} from './guards/supervisor.guard';

import type {
  RequestConSupervisor,
} from './guards/supervisor.guard';
import { SolicitarPasantesLoteDto } from './dto/solicitar-pasantes-lote.dto';


// ============================================================
// BODY - SOLICITAR PASANTE
// ============================================================

type SolicitarPasanteBody = {
  actividades_pasante?: string;
};


// ============================================================
// BODY - CANCELAR SOLICITUD
// ============================================================

type CancelarSolicitudBody = {
  motivo_cancelacion?: string;
  password_autorizacion?: string;
};


@Controller('supervisor')
@UseGuards(SupervisorGuard)
export class SupervisorController {

  constructor(
    private readonly supervisorService:
      SupervisorService,
  ) {}




  @Get('notificaciones')
      async obtenerNotificaciones(
        @Req()
        request: RequestConSupervisor,
      ) {

        const supervisor =
          request.usuarioSupervisor!;


        return this.supervisorService
          .obtenerNotificaciones(
            supervisor.id,
          );

      }


      @Patch(
        'notificaciones/:notificacionId/leida',
      )
      async marcarNotificacionLeida(
        @Req()
        request: RequestConSupervisor,

        @Param('notificacionId')
        notificacionId: string,
      ) {

        const supervisor =
          request.usuarioSupervisor!;


        return this.supervisorService
          .marcarNotificacionLeida(
            supervisor.id,
            notificacionId,
          );

      }
  // ============================================================
  // OBTENER POSTULANTES APROBADOS DISPONIBLES
  // ============================================================
  //
  // GET /supervisor/postulantes
  //
  // Devuelve todos los postulantes:
  //
  // - aprobados por Talento Humano;
  // - que todavía no son pasantes activos;
  // - disponibles para ser solicitados.
  //
  // ============================================================

  @Get('postulantes')
  obtenerPostulantes(
    @Req()
    request: RequestConSupervisor,
  ) {

    const supervisor =
      request.usuarioSupervisor!;


    return this.supervisorService
      .obtenerPostulantesDisponibles(
        supervisor.departamento_id,
      );

  }


  // ============================================================
  // OBTENER HISTORIAL DE SOLICITUDES DEL SUPERVISOR
  // ============================================================
  //
  // GET /supervisor/solicitudes
  //
  // Devuelve solamente las solicitudes realizadas por
  // el Supervisor autenticado.
  //
  // Estados:
  //
  // - PENDIENTE_RRHH
  // - APROBADA
  // - RECHAZADA
  // - CANCELADA
  //
  // ============================================================

  @Get('solicitudes')
  obtenerSolicitudes(
    @Req()
    request: RequestConSupervisor,
  ) {

    const supervisor =
      request.usuarioSupervisor!;


    return this.supervisorService
      .obtenerSolicitudesSupervisor(
        supervisor.id,
      );

  }


  // ============================================================
  // SOLICITAR PASANTE
  // ============================================================
  //
  // POST
  // /supervisor/postulantes/:postulacionId/solicitar
  //
  // BODY:
  //
  // {
  //   "actividades_pasante": "Descripción de actividades..."
  // }
  //
  // ============================================================

  @Post(
    'postulantes/:postulacionId/solicitar',
  )
  solicitarPasante(
    @Req()
    request: RequestConSupervisor,

    @Param('postulacionId')
    postulacionId: string,

    @Body()
    body: SolicitarPasanteBody,
  ) {

    const supervisor =
      request.usuarioSupervisor!;


    return this.supervisorService
      .solicitarPasante(

        supervisor.id,

        supervisor.departamento_id,

        postulacionId,

        body.actividades_pasante ?? '',

      );

  }


  // Solicitudes múltiples: un lote, un correo a RRHH.
  @Post('postulantes/solicitar-lote')
  solicitarPasantesLote(
    @Req() request: RequestConSupervisor,
    @Body() body: SolicitarPasantesLoteDto,
  ) {
    const supervisor = request.usuarioSupervisor!;
    return this.supervisorService.solicitarPasantesLote(
      supervisor.id,
      supervisor.departamento_id,
      body.solicitudes,
    );
  }

  // ============================================================
  // CANCELAR SOLICITUD
  // ============================================================
  //
  // PATCH
  // /supervisor/solicitudes/:solicitudId/cancelar
  //
  // BODY:
  //
  // {
  //   "motivo_cancelacion": "Motivo...",
  //   "password_autorizacion": "Contraseña actual"
  // }
  //
  // REGLAS:
  //
  // - debe pertenecer al Supervisor autenticado;
  // - debe estar PENDIENTE_RRHH;
  // - motivo obligatorio;
  // - contraseña obligatoria;
  // - contraseña validada con bcrypt en backend.
  //
  // Al cancelar:
  //
  // PENDIENTE_RRHH
  //       ↓
  // CANCELADA
  //
  // Y la postulación:
  //
  // SELECCIONADO_POR_AREA
  //       ↓
  // APROBADO
  //
  // El postulante vuelve a aparecer en la bolsa.
  //
  // ============================================================

  @Patch(
    'solicitudes/:solicitudId/cancelar',
  )
  cancelarSolicitud(
    @Req()
    request: RequestConSupervisor,

    @Param('solicitudId')
    solicitudId: string,

    @Body()
    body: CancelarSolicitudBody,
  ) {

    const supervisor =
      request.usuarioSupervisor!;


    return this.supervisorService
      .cancelarSolicitud(

        // 1. Supervisor autenticado
        supervisor.id,

        // 2. Departamento del Supervisor
        supervisor.departamento_id,

        // 3. Solicitud que desea cancelar
        solicitudId,

        // 4. Motivo obligatorio
        body.motivo_cancelacion ?? '',

        // 5. Contraseña de autorización
        body.password_autorizacion ?? '',

      );


      

  }
@Get('pasantes')
async obtenerPasantesSupervisor(
  @Req()
  request: RequestConSupervisor,
) {

  const supervisor =
    request.usuarioSupervisor!;


  return this.supervisorService
    .obtenerPasantesSupervisor(
      supervisor.id,
    );

}
  
@Get('reportes')
async obtenerReportesSupervisor(
  @Req() request: RequestConSupervisor,
) {
  const supervisor =
    request.usuarioSupervisor!;

  return this.supervisorService
    .obtenerReportesSupervisor(
      supervisor.id,
    );
}

@Post('pasantes/:pasanteId/reportes')
async crearReporteComportamiento(
  @Req() request: RequestConSupervisor,

  @Param('pasanteId')
  pasanteId: string,

  @Body()
  body: {
    tipo?: string;
    titulo?: string;
    descripcion?: string;
    fecha_reporte?: string;
  },
) {
  const supervisor =
    request.usuarioSupervisor!;

  return this.supervisorService
    .crearReporteComportamiento(
      supervisor.id,
      pasanteId,
      body,
    );
}

}