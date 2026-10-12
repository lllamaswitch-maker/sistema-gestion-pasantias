import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';


// ============================================================
// VALIDAR UUID
// ============================================================

const esUUID = (
  valor?: string | null,
): boolean => {

  if (!valor) {
    return false;
  }

  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    .test(valor);

};


@Injectable()
export class OrganizacionService {

  constructor(
    private readonly prisma:
      PrismaService,
  ) {}


  // ============================================================
  // LISTAR GERENCIAS ACTIVAS
  // ============================================================

  async listarGerencias() {

    return this.prisma
      .gerencias
      .findMany({

        where: {
          activo: true,
        },

        select: {
          id: true,
          nombre: true,
          activo: true,
        },

        orderBy: {
          nombre: 'asc',
        },

      });

  }


  // ============================================================
  // LISTAR DEPARTAMENTOS POR GERENCIA
  // ============================================================

  async listarDepartamentosPorGerencia(
    gerenciaId: string,
  ) {

    if (!esUUID(gerenciaId)) {

      throw new BadRequestException(
        'El identificador de la gerencia no es válido.',
      );

    }


    const gerencia =
      await this.prisma
        .gerencias
        .findUnique({

          where: {
            id: gerenciaId,
          },

          select: {
            id: true,
            nombre: true,
            activo: true,
          },

        });


    if (
      !gerencia ||
      !gerencia.activo
    ) {

      throw new NotFoundException(
        'La gerencia indicada no existe o se encuentra inactiva.',
      );

    }


    const departamentos =
      await this.prisma
        .departamentos
        .findMany({

          where: {

            gerencia_id:
              gerenciaId,

            activo:
              true,

          },

          select: {
            id: true,
            nombre: true,
            activo: true,
          },

          orderBy: {
            nombre: 'asc',
          },

        });


    return {
      gerencia,
      departamentos,
    };
  }
}