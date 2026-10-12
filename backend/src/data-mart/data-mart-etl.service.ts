
import {
  ConflictException,
  Injectable,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DataMartEtlService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // ============================================================
  // NORMALIZACIÓN DE TEXOS
  // ============================================================

  private normalizar(
    valor: string | null | undefined,
  ): string {
    return valor?.trim() || 'SIN REGISTRO';
  }

  // ============================================================
  // CÁLCULO DE RANGO DE EDAD
  // ============================================================

  private obtenerRangoEdad(
    nacimiento: Date | null,
    fechaReferencia: Date,
  ): string {
    if (!nacimiento) {
      return 'SIN REGISTRO';
    }

    let edad =
      fechaReferencia.getUTCFullYear() -
      nacimiento.getUTCFullYear();

    const diferenciaMeses =
      fechaReferencia.getUTCMonth() -
      nacimiento.getUTCMonth();

    if (
      diferenciaMeses < 0 ||
      (
        diferenciaMeses === 0 &&
        fechaReferencia.getUTCDate() <
          nacimiento.getUTCDate()
      )
    ) {
      edad--;
    }

    if (edad < 0) {
      return 'SIN REGISTRO';
    }

    if (edad < 18) {
      return 'MENOR DE 18';
    }

    if (edad <= 24) {
      return '18-24';
    }

    if (edad <= 29) {
      return '25-29';
    }

    if (edad <= 34) {
      return '30-34';
    }

    return '35 O MAS';
  }

  // ============================================================
  // NORMALIZAR FECHA A UTC
  // ============================================================

  private obtenerFechaUtc(
    valor: Date,
  ): Date {
    return new Date(
      Date.UTC(
        valor.getUTCFullYear(),
        valor.getUTCMonth(),
        valor.getUTCDate(),
      ),
    );
  }

  // ============================================================
  // OBTENER DURACIÓN EN MESES
  // ============================================================

  private obtenerMeses(
    duracion: string | null | undefined,
  ): number | null {
    if (!duracion) {
      return null;
    }

    const coincidencia = duracion
      .trim()
      .match(/^(\d+)\s*(mes|meses)$/i);

    if (!coincidencia) {
      return null;
    }

    const meses = Number(coincidencia[1]);

    if (
      !Number.isInteger(meses) ||
      meses <= 0
    ) {
      return null;
    }

    return meses;
  }

  // ============================================================
  // SINCRONIZACIÓN ETL
  // ============================================================

  async sincronizar() {
    /*
     * El ETL utiliza una transacción con un advisory lock
     * para evitar dos ejecuciones simultáneas de este proceso.
     *
     * Se emplea ReadCommitted para adquirir el bloqueo antes
     * de consultar los datos operacionales, sin conservar una
     * instantánea anterior a la espera del bloqueo.
     *
     * Este bloqueo coordina ejecuciones del ETL.
     * No bloquea las actualizaciones normales de otros módulos.
     */

    return this.prisma.$transaction(
      async (tx) => {
        // ------------------------------------------------------
        // 1. BLOQUEAR EJECUCIÓN SIMULTÁNEA DEL ETL
        // ------------------------------------------------------

        await tx.$queryRaw`
          SELECT pg_advisory_xact_lock(740211, 1)
        `;

        // ------------------------------------------------------
        // 2. EXTRAER PASANTES DESPUÉS DEL BLOQUEO
        // ------------------------------------------------------

        const pasantes =
          await tx.pasantes_activos.findMany({
            include: {
              postulantes: {
                include: {
                  formacion_academica_postulante: {
                    orderBy: {
                      id: 'asc',
                    },
                    take: 1,
                  },

                  disponibilidad_horaria_postulante: true,
                },
              },

              departamentos: {
                include: {
                  gerencias: true,
                },
              },

              unidades_organizacionales: true,

              seguimiento_academico_horas: true,

              control_administrativo: true,
            },

            orderBy: {
              id: 'asc',
            },
          });

        let creados = 0;
        let actualizados = 0;
        let omitidos = 0;

        // ------------------------------------------------------
        // 3. RECORRER PASANTES
        // ------------------------------------------------------

        for (const pasante of pasantes) {
          const postulante = pasante.postulantes;

          const formacion =
            postulante.formacion_academica_postulante[0];

          const seguimiento =
            pasante.seguimiento_academico_horas;

          const administrativo =
            pasante.control_administrativo;

          // ----------------------------------------------------
          // 4. FECHA BASE DE LA PASANTÍA
          // ----------------------------------------------------

          const fechaBase =
            seguimiento?.fecha_inicio ??
            pasante.created_at;

          if (!fechaBase) {
            omitidos++;
            continue;
          }

          const fecha =
            this.obtenerFechaUtc(fechaBase);

          const mes =
            fecha.getUTCMonth() + 1;

          const anio =
            fecha.getUTCFullYear();

          const nombresMes = [
            'ENERO',
            'FEBRERO',
            'MARZO',
            'ABRIL',
            'MAYO',
            'JUNIO',
            'JULIO',
            'AGOSTO',
            'SEPTIEMBRE',
            'OCTUBRE',
            'NOVIEMBRE',
            'DICIEMBRE',
          ];

          const diasSemana = [
            'DOMINGO',
            'LUNES',
            'MARTES',
            'MIERCOLES',
            'JUEVES',
            'VIERNES',
            'SABADO',
          ];

          // ----------------------------------------------------
          // 5. DIMENSIÓN TIEMPO
          // ----------------------------------------------------

          const dimTiempo =
            await tx.dim_tiempo.upsert({
              where: {
                fecha,
              },

              create: {
                fecha,
                anio,
                mes,

                nombre_mes:
                  nombresMes[mes - 1],

                semestre:
                  Math.ceil(mes / 6),

                trimestre:
                  Math.ceil(mes / 3),

                dia_semana:
                  diasSemana[fecha.getUTCDay()],
              },

              update: {},
            });

          // ----------------------------------------------------
          // 6. DIMENSIÓN POSTULANTE
          // ----------------------------------------------------

          const turno =
            seguimiento?.turno ??
            postulante
              .disponibilidad_horaria_postulante
              ?.turno;

          const genero =
            postulante.genero ??
            'SIN REGISTRO';

          const rangoEdad =
            this.obtenerRangoEdad(
              postulante.fecha_nacimiento,
              fecha,
            );

          const turnoDisponible =
            turno ?? 'SIN REGISTRO';

          const dimPostulante =
            await tx.dim_postulante.upsert({
              where: {
                ci: postulante.ci,
              },

              create: {
                ci: postulante.ci,
                genero,
                rango_edad: rangoEdad,
                turno_disponible: turnoDisponible,
              },

              update: {
                genero,
                rango_edad: rangoEdad,
                turno_disponible: turnoDisponible,
              },
            });

          // ----------------------------------------------------
          // 7. DIMENSIÓN INSTITUCIÓN Y CARRERA
          // ----------------------------------------------------

          const institucionNombre =
            this.normalizar(
              formacion?.institucion_nombre,
            );

          const carreraNombre =
            this.normalizar(
              formacion?.carrera,
            );

          const tipoInstitucion =
            formacion?.institucion_tipo ??
            'SIN REGISTRO';

          const dimCarrera =
            await tx.dim_institucion_carrera.upsert({
              where: {
                institucion_nombre_carrera: {
                  institucion_nombre:
                    institucionNombre,

                  carrera:
                    carreraNombre,
                },
              },

              create: {
                institucion_nombre:
                  institucionNombre,

                tipo_institucion:
                  tipoInstitucion,

                carrera:
                  carreraNombre,
              },

              update: {
                tipo_institucion:
                  tipoInstitucion,
              },
            });

          // ----------------------------------------------------
          // 8. DIMENSIÓN UNIDAD ORGANIZACIONAL
          // ----------------------------------------------------

          const gerenciaNombre =
            this.normalizar(
              pasante.departamentos
                ?.gerencias?.nombre ??
              pasante.unidades_organizacionales
                ?.gerencia,
            );

          const departamentoNombre =
            this.normalizar(
              pasante.departamentos
                ?.nombre ??
              pasante.unidades_organizacionales
                ?.departamento,
            );

          const dimUnidad =
            await tx.dim_unidad_organizacional.upsert({
              where: {
                gerencia_departamento: {
                  gerencia:
                    gerenciaNombre,

                  departamento:
                    departamentoNombre,
                },
              },

              create: {
                gerencia:
                  gerenciaNombre,

                departamento:
                  departamentoNombre,
              },

              update: {},
            });

          // ----------------------------------------------------
          // 9. VERIFICAR SI EXISTE EL HECHO
          // ----------------------------------------------------

          /*
           * El esquema actual no cuenta con pasante_id
           * dentro de fact_pasantias.
           *
           * Temporalmente identificamos el hecho por
           * la dimensión del postulante.
           *
           * Si existen varios hechos, detenemos el ETL
           * y revertimos la transacción para evitar
           * modificaciones ambiguas.
           */

          const hechosExistentes =
            await tx.fact_pasantias.findMany({
              where: {
                postulante_key:
                  dimPostulante.id,
              },

              select: {
                id: true,
              },

              take: 2,
            });

          if (
            hechosExistentes.length > 1
          ) {
            throw new ConflictException(
              'Se detectaron múltiples hechos para el mismo postulante. ' +
              'Revise los registros históricos antes de sincronizar.',
            );
          }

          // ----------------------------------------------------
          // 10. PREPARAR INDICADORES DEL HECHO
          // ----------------------------------------------------

          const valoresHecho = {
            postulante_key:
              dimPostulante.id,

            carrera_key:
              dimCarrera.id,

            unidad_key:
              dimUnidad.id,

            tiempo_inicio_key:
              dimTiempo.id,

            horas_requeridas:
              seguimiento?.horas_requeridas ??
              null,

            duracion_meses:
              this.obtenerMeses(
                seguimiento?.duracion_acordada,
              ),

            abandono:
              pasante.estado === 'ABANDONO',

            tarjeta_devuelta:
              administrativo
                ?.fecha_devolucion_tarjeta != null,

            certificado_otorgado:
              administrativo
                ?.certificado_emitido ?? false,
          };

          // ----------------------------------------------------
          // 11. ACTUALIZAR O INSERTAR HECHO
          // ----------------------------------------------------

          if (
            hechosExistentes.length === 1
          ) {
            /*
             * Solo actualizamos los indicadores
             * disponibles en las tablas operacionales.
             *
             * No modificamos horas_acumuladas,
             * horas_restantes ni porcentaje_avance.
             */

            await tx.fact_pasantias.update({
              where: {
                id:
                  hechosExistentes[0].id,
              },

              data:
                valoresHecho,
            });

            actualizados++;
          } else {
            /*
             * Para registros nuevos, dejamos el
             * avance biométrico como no validado.
             *
             * horas_acumuladas es obligatorio en
             * el esquema actual y tiene default(0).
             *
             * Ese cero no significa cumplimiento
             * biométrico comprobado.
             */

            await tx.fact_pasantias.create({
              data: {
                ...valoresHecho,

                horas_acumuladas: 0,

                horas_restantes: null,

                porcentaje_avance: null,
              },
            });

            creados++;
          }
        }

        // ------------------------------------------------------
        // 12. RESULTADO DE LA SINCRONIZACIÓN
        // ------------------------------------------------------

        return {
          mensaje:
            'Sincronización del Data Mart completada correctamente.',

          pasantes_consultados:
            pasantes.length,

          hechos_creados:
            creados,

          hechos_actualizados:
            actualizados,

          pasantes_omitidos:
            omitidos,

          biometrico_integrado:
            false,

          observacion:
            'Las horas realizadas y los porcentajes de avance ' +
            'no fueron calculados ni modificados.',
        };
      },

      {
        isolationLevel:
          Prisma.TransactionIsolationLevel.ReadCommitted,

        maxWait: 10000,

        timeout: 60000,
      },
    );
  }
}
