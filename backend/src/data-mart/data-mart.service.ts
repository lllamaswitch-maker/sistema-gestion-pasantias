
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DataMartService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async obtenerResumen() {
    const [
      totalPasantias,
      totalPostulantes,
      totalInstitucionesCarreras,
      totalUnidades,
      totalFechas,
      indicadores,
    ] = await Promise.all([
      this.prisma.fact_pasantias.count(),
      this.prisma.dim_postulante.count(),
      this.prisma.dim_institucion_carrera.count(),
      this.prisma.dim_unidad_organizacional.count(),
      this.prisma.dim_tiempo.count(),

      this.prisma.fact_pasantias.aggregate({
        _sum: {
          horas_requeridas: true,
        },
        _count: {
          abandono: true,
        },
      }),
    ]);

    const [abandonos, tarjetasDevueltas, certificados] =
      await Promise.all([
        this.prisma.fact_pasantias.count({
          where: { abandono: true },
        }),
        this.prisma.fact_pasantias.count({
          where: { tarjeta_devuelta: true },
        }),
        this.prisma.fact_pasantias.count({
          where: { certificado_otorgado: true },
        }),
      ]);

    return {
      registros: {
        pasantias: totalPasantias,
        postulantes: totalPostulantes,
        instituciones_carreras: totalInstitucionesCarreras,
        unidades_organizacionales: totalUnidades,
        fechas: totalFechas,
      },
      indicadores: {
        horas_requeridas: indicadores._sum.horas_requeridas ?? 0,
        abandonos,
        tarjetas_devueltas: tarjetasDevueltas,
        certificados_otorgados: certificados,
        tasa_abandono:
          totalPasantias > 0
            ? Number(
                ((abandonos / totalPasantias) * 100).toFixed(2),
              )
            : 0,
      },
      biometrico: {
        integrado: false,
        observacion:
          'El cumplimiento de horas permanece pendiente de integración biométrica.',
      },
    };
  }

  async obtenerPorPeriodo() {
    const filas = await this.prisma.fact_pasantias.groupBy({
      by: ['tiempo_inicio_key'],
      _count: {
        id: true,
      },
    });

    const fechas = await this.prisma.dim_tiempo.findMany({
      where: {
        id: {
          in: filas.map((fila) => fila.tiempo_inicio_key),
        },
      },
      select: {
        id: true,
        anio: true,
        mes: true,
        nombre_mes: true,
      },
    });

    const fechasPorId = new Map(
      fechas.map((fecha) => [fecha.id, fecha]),
    );

    const agrupados = new Map<
      string,
      {
        anio: number;
        mes: number;
        nombre_mes: string;
        cantidad: number;
      }
    >();

    for (const fila of filas) {
      const fecha = fechasPorId.get(fila.tiempo_inicio_key);

      if (!fecha) {
        continue;
      }

      const clave = `${fecha.anio}-${String(fecha.mes).padStart(2, '0')}`;
      const actual = agrupados.get(clave);

      if (actual) {
        actual.cantidad += fila._count.id;
      } else {
        agrupados.set(clave, {
          anio: fecha.anio,
          mes: fecha.mes,
          nombre_mes: fecha.nombre_mes,
          cantidad: fila._count.id,
        });
      }
    }

    return [...agrupados.values()].sort(
      (a, b) => a.anio - b.anio || a.mes - b.mes,
    );
  }

  async obtenerPorInstitucionCarrera() {
    const filas = await this.prisma.fact_pasantias.groupBy({
      by: ['carrera_key'],
      _count: {
        id: true,
      },
    });

    const dimensiones =
      await this.prisma.dim_institucion_carrera.findMany({
        where: {
          id: {
            in: filas.map((fila) => fila.carrera_key),
          },
        },
        select: {
          id: true,
          institucion_nombre: true,
          tipo_institucion: true,
          carrera: true,
        },
      });

    const indice = new Map(
      dimensiones.map((dimension) => [dimension.id, dimension]),
    );

    return filas
      .map((fila) => {
        const dimension = indice.get(fila.carrera_key);

        return dimension
          ? {
              institucion: dimension.institucion_nombre,
              tipo_institucion: dimension.tipo_institucion,
              carrera: dimension.carrera,
              cantidad: fila._count.id,
            }
          : null;
      })
      .filter((fila): fila is NonNullable<typeof fila> =>
        fila !== null,
      )
      .sort((a, b) => b.cantidad - a.cantidad);
  }

  async obtenerPorUnidadOrganizacional() {
    const filas = await this.prisma.fact_pasantias.groupBy({
      by: ['unidad_key'],
      _count: {
        id: true,
      },
    });

    const dimensiones =
      await this.prisma.dim_unidad_organizacional.findMany({
        where: {
          id: {
            in: filas.map((fila) => fila.unidad_key),
          },
        },
        select: {
          id: true,
          gerencia: true,
          departamento: true,
        },
      });

    const indice = new Map(
      dimensiones.map((dimension) => [dimension.id, dimension]),
    );

    return filas
      .map((fila) => {
        const dimension = indice.get(fila.unidad_key);

        return dimension
          ? {
              gerencia: dimension.gerencia,
              departamento: dimension.departamento,
              cantidad: fila._count.id,
            }
          : null;
      })
      .filter((fila): fila is NonNullable<typeof fila> =>
        fila !== null,
      )
      .sort((a, b) => b.cantidad - a.cantidad);
  }

  async obtenerDistribucionPostulantes() {
    const hechos = await this.prisma.fact_pasantias.groupBy({
      by: ['postulante_key'],
      _count: {
        id: true,
      },
    });

    const postulantes = await this.prisma.dim_postulante.findMany({
      where: {
        id: {
          in: hechos.map((hecho) => hecho.postulante_key),
        },
      },
      select: {
        id: true,
        genero: true,
        rango_edad: true,
        turno_disponible: true,
      },
    });

    const indice = new Map(
      postulantes.map((postulante) => [postulante.id, postulante]),
    );

    const genero = new Map<string, number>();
    const rangoEdad = new Map<string, number>();
    const turno = new Map<string, number>();

    for (const hecho of hechos) {
      const postulante = indice.get(hecho.postulante_key);

      if (!postulante) {
        continue;
      }

      const cantidad = hecho._count.id;

      genero.set(
        postulante.genero,
        (genero.get(postulante.genero) ?? 0) + cantidad,
      );

      rangoEdad.set(
        postulante.rango_edad,
        (rangoEdad.get(postulante.rango_edad) ?? 0) + cantidad,
      );

      turno.set(
        postulante.turno_disponible,
        (turno.get(postulante.turno_disponible) ?? 0) + cantidad,
      );
    }

    const convertir = (datos: Map<string, number>) =>
      [...datos.entries()]
        .map(([nombre, cantidad]) => ({
          nombre,
          cantidad,
        }))
        .sort((a, b) => b.cantidad - a.cantidad);

    return {
      por_genero: convertir(genero),
      por_rango_edad: convertir(rangoEdad),
      por_turno: convertir(turno),
    };
  }
}
