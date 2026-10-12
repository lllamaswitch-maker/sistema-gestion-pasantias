
import { Injectable } from '@nestjs/common';

import {
  estado_pasante_activo_enum,
  estado_postulacion_enum,
  estado_solicitud_pasante_enum,
} from '@prisma/client';

import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // ============================================================
  // INSTITUCIONES CON CONVENIO ACTIVO
  // ============================================================

  async getInstituciones() {
    return this.prisma.instituciones_convenio.findMany({
      where: {
        convenio_activo: true,
      },

      orderBy: {
        nombre: 'asc',
      },
    });
  }

  // ============================================================
  // CARRERAS ACTIVAS
  // ============================================================

  async getCarreras() {
    return this.prisma.carreras.findMany({
      where: {
        activa: true,
      },

      orderBy: {
        nombre: 'asc',
      },
    });
  }

  // ============================================================
  // DASHBOARD GENERAL DE RECURSOS HUMANOS
  // ============================================================

  async getDashboardRrhh() {
    /*
     * POSTULANTES:
     * Personas registradas en el sistema.
     *
     * HABILITADOS:
     * Postulaciones aprobadas documentalmente por RRHH
     * que continúan en el proceso de selección.
     *
     * PASANTES ACTIVOS:
     * Personas incorporadas formalmente con estado ACTIVO.
     *
     * PETICIONES:
     * Solicitudes de pasantes pendientes de revisión de RRHH.
     */

    const [
      totalPostulantes,
      totalPasantesActivos,
      totalHabilitados,
      totalPeticionesAreas,
    ] = await Promise.all([
      // --------------------------------------------------------
      // 1. POSTULANTES REGISTRADOS
      // --------------------------------------------------------

      this.prisma.postulantes.count(),

      // --------------------------------------------------------
      // 2. PASANTES ACTIVOS
      // --------------------------------------------------------

      this.prisma.pasantes_activos.count({
        where: {
          estado: estado_pasante_activo_enum.ACTIVO,
        },
      }),

      // --------------------------------------------------------
      // 3. HABILITADOS POR RRHH
      // --------------------------------------------------------

      this.prisma.estados_postulacion.count({
        where: {
          estado_actual: {
            in: [
              estado_postulacion_enum.APROBADO,
              estado_postulacion_enum.SELECCIONADO_POR_AREA,
              estado_postulacion_enum.APROBADO_PARA_ENTREVISTA,
            ],
          },
        },
      }),

      // --------------------------------------------------------
      // 4. PETICIONES PENDIENTES DE RRHH
      // --------------------------------------------------------

      this.prisma.solicitudes_pasante_supervisor.count({
        where: {
          estado:
            estado_solicitud_pasante_enum.PENDIENTE_RRHH,
        },
      }),
    ]);

    // ==========================================================
    // 5. POSTULACIONES REGISTRADAS DURANTE LA SEMANA ACTUAL
    // ==========================================================

    const ahora = new Date();

    const inicioSemana = new Date(ahora);
    const diaSemana = (inicioSemana.getDay() + 6) % 7;

    inicioSemana.setDate(
      inicioSemana.getDate() - diaSemana,
    );

    inicioSemana.setHours(0, 0, 0, 0);

    const finSemana = new Date(inicioSemana);

    finSemana.setDate(finSemana.getDate() + 7);

    const postulacionesSemana =
      await this.prisma.postulaciones.findMany({
        where: {
          created_at: {
            gte: inicioSemana,
            lt: finSemana,
          },
        },

        select: {
          created_at: true,
        },
      });

    const postulantesPorDia = [
      0, 0, 0, 0, 0, 0, 0,
    ];

    for (const postulacion of postulacionesSemana) {
      if (!postulacion.created_at) {
        continue;
      }

      const dia =
        (postulacion.created_at.getDay() + 6) % 7;

      postulantesPorDia[dia]++;
    }

    // ==========================================================
    // 6. RESPUESTA PARA EL FRONTEND
    // ==========================================================

    return {
      kpis: {
        totalPostulantes,
        totalPasantesActivos,
        totalHabilitados,
        totalPeticionesAreas,
      },

      postulantesPorDia: {
        labels: [
          'Lun',
          'Mar',
          'Mié',
          'Jue',
          'Vie',
          'Sáb',
          'Dom',
        ],

        datos: postulantesPorDia,
      },

      /*
       * El sistema todavía no tiene integrada la
       * fuente biométrica.
       *
       * No proporcionamos estadísticas ficticias
       * de horas o cumplimiento.
       */

      promedioHoras: null,

      porcentajeCumplimiento: null,

      biometricoIntegrado: false,
    };
  }
}
