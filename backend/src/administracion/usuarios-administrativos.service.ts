import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import * as bcrypt from 'bcrypt';


// ============================================================
// ROLES ADMINISTRATIVOS PERMITIDOS
// ============================================================

const ROLES_ADMINISTRATIVOS = [
  'SUPERADMIN',
  'ADMIN_RRHH',
  'SUPERVISOR',
] as const;


type RolAdministrativo =
  typeof ROLES_ADMINISTRATIVOS[number];


type CrearUsuarioAdministrativoDto = {

  ci?: string;

  nombres?: string;

  apellidos?: string;

  email?: string;

  cargo?: string;

  rol?: string;

  departamento_id?:
    string | null;

  password?: string;

};


type ActualizarUsuarioAdministrativoDto = {

  ci?: string;

  nombres?: string;

  apellidos?: string;

  email?: string;

  cargo?: string;

  rol?: string;

  departamento_id?:
    string | null;

};


// ============================================================
// UTILIDADES
// ============================================================

const limpiarTexto = (
  valor?: string | null,
): string => {

  return String(
    valor ?? '',
  ).trim();

};


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
export class UsuariosAdministrativosService {

  constructor(
    private readonly prisma:
      PrismaService,
  ) {}
  // ============================================================
  // VALIDAR CONTRASEÑA DEL SUPERADMIN
  // ============================================================

  private async validarAutorizacionSuperadmin(
    administradorId: string,
    password?: string,
  ) {

    const passwordIngresado =
      String(
        password ?? '',
      ).trim();


    if (!passwordIngresado) {

      throw new BadRequestException(
        'Debe ingresar su contraseña para autorizar esta operación.',
      );

    }


    const administrador =
      await this.prisma
        .usuarios_administrativos
        .findUnique({

          where: {
            id:
              administradorId,
          },

          select: {

            id:
              true,

            rol:
              true,

            activo:
              true,

            password_hash:
              true,

          },

        });


    if (
      !administrador ||
      !administrador.activo
    ) {

      throw new UnauthorizedException(
        'La cuenta administrativa no se encuentra activa.',
      );

    }


    if (
      administrador.rol !==
      'SUPERADMIN'
    ) {

      throw new UnauthorizedException(
        'Esta operación requiere autorización de un SUPERADMIN.',
      );

    }


    const passwordCorrecto =
      await bcrypt.compare(
        passwordIngresado,
        administrador.password_hash,
      );


    if (!passwordCorrecto) {

      throw new UnauthorizedException(
        'La contraseña de autorización es incorrecta.',
      );

    }


    return true;
  }

  // ============================================================
  // VALIDAR ROL
  // ============================================================

  private validarRol(
    rol?: string | null,
  ): RolAdministrativo {

    const rolNormalizado =
      limpiarTexto(rol)
        .toUpperCase();


    if (
      !ROLES_ADMINISTRATIVOS.includes(
        rolNormalizado as RolAdministrativo,
      )
    ) {

      throw new BadRequestException(
        `Rol no válido. Valores permitidos: ${ROLES_ADMINISTRATIVOS.join(', ')}.`,
      );

    }


    return rolNormalizado as RolAdministrativo;

  }


  // ============================================================
  // OBTENER DEPARTAMENTO
  // ============================================================

  private async obtenerDepartamento(
    departamentoId?: string | null,
  ) {

    if (!departamentoId) {
      return null;
    }


    if (!esUUID(departamentoId)) {

      throw new BadRequestException(
        'El identificador del departamento no es válido.',
      );

    }


    const departamento =
      await this.prisma
        .departamentos
        .findUnique({

          where: {
            id: departamentoId,
          },

          include: {

            gerencias: {
              select: {
                id: true,
                nombre: true,
                activo: true,
              },
            },

          },

        });


    if (
      !departamento ||
      !departamento.activo
    ) {

      throw new BadRequestException(
        'El departamento seleccionado no existe o se encuentra inactivo.',
      );

    }


    if (
      !departamento.gerencias ||
      !departamento.gerencias.activo
    ) {

      throw new BadRequestException(
        'La gerencia asociada al departamento se encuentra inactiva.',
      );

    }


    return departamento;

  }


  // ============================================================
  // OBTENER USUARIO PARA RESPUESTA
  // ============================================================

  private async obtenerUsuario(
    id: string,
  ) {

    return this.prisma
      .usuarios_administrativos
      .findUnique({

        where: {
          id,
        },

        select: {

          id: true,

          ci: true,

          nombres: true,

          apellidos: true,

          email: true,

          cargo: true,

          departamento_unidad:
            true,

          departamento_id:
            true,

          rol: true,

          activo: true,

          ultimo_acceso:
            true,

          created_at:
            true,

          updated_at:
            true,

          departamentos: {

            select: {

              id:
                true,

              nombre:
                true,

              gerencia_id:
                true,

              gerencias: {

                select: {

                  id:
                    true,

                  nombre:
                    true,

                },

              },

            },

          },

        },

      });

  }


  // ============================================================
  // LISTAR USUARIOS ADMINISTRATIVOS
  // ============================================================

  async listar() {

    return this.prisma
      .usuarios_administrativos
      .findMany({

        select: {

          id: true,

          ci: true,

          nombres: true,

          apellidos: true,

          email: true,

          cargo: true,

          departamento_unidad:
            true,

          departamento_id:
            true,

          rol: true,

          activo: true,

          ultimo_acceso:
            true,

          created_at:
            true,

          updated_at:
            true,

          departamentos: {

            select: {

              id:
                true,

              nombre:
                true,

              gerencia_id:
                true,

              gerencias: {

                select: {

                  id:
                    true,

                  nombre:
                    true,

                },

              },

            },

          },

        },

        orderBy: [
          {
            activo:
              'desc',
          },
          {
            nombres:
              'asc',
          },
          {
            apellidos:
              'asc',
          },
        ],

      });

  }


  // ============================================================
  // CREAR USUARIO
  // ============================================================

  async crear(
    body: CrearUsuarioAdministrativoDto,
    administradorId: string,
  ) {

    const ci =
      limpiarTexto(
        body.ci,
      );

    const nombres =
      limpiarTexto(
        body.nombres,
      );

    const apellidos =
      limpiarTexto(
        body.apellidos,
      );

    const email =
      limpiarTexto(
        body.email,
      ).toLowerCase();

    const cargo =
      limpiarTexto(
        body.cargo,
      );

    const password =
      limpiarTexto(
        body.password,
      );


    if (
      !ci ||
      !nombres ||
      !apellidos ||
      !email ||
      !cargo ||
      !password
    ) {

      throw new BadRequestException(
        'C.I., nombres, apellidos, correo, cargo y contraseña son obligatorios.',
      );

    }


    if (password.length < 8) {

      throw new BadRequestException(
        'La contraseña debe tener al menos 8 caracteres.',
      );

    }


    const rol =
      this.validarRol(
        body.rol,
      );


    // ==========================================================
    // DEPARTAMENTO
    // ==========================================================

    let departamento =
      null;


    if (
      rol !== 'SUPERADMIN'
    ) {

      if (
        !body.departamento_id
      ) {

        throw new BadRequestException(
          'Debe seleccionar una gerencia y un departamento para este usuario.',
        );

      }


      departamento =
        await this
          .obtenerDepartamento(
            body.departamento_id,
          );

    } else if (
      body.departamento_id
    ) {

      departamento =
        await this
          .obtenerDepartamento(
            body.departamento_id,
          );

    }


    // ==========================================================
    // DUPLICADOS
    // ==========================================================

    const existente =
      await this.prisma
        .usuarios_administrativos
        .findFirst({

          where: {

            OR: [

              {
                ci,
              },

              {
                email: {
                  equals:
                    email,

                  mode:
                    'insensitive',
                },
              },

            ],

          },

          select: {

            id:
              true,

            ci:
              true,

            email:
              true,

          },

        });


    if (existente) {

      if (
        existente.ci === ci
      ) {

        throw new BadRequestException(
          'Ya existe un usuario administrativo registrado con ese C.I.',
        );

      }


      throw new BadRequestException(
        'Ya existe un usuario administrativo registrado con ese correo.',
      );

    }


    // ==========================================================
    // CONTRASEÑA
    // ==========================================================

    const passwordHash =
      await bcrypt.hash(
        password,
        12,
      );


    // ==========================================================
    // CREAR
    // ==========================================================

    const nuevo =
      await this.prisma
        .usuarios_administrativos
        .create({

          data: {

            ci,

            nombres,

            apellidos,

            email,

            cargo,

            rol,

            departamento_id:
              departamento?.id ??
              null,

            departamento_unidad:
              departamento?.nombre ??
              'ADMINISTRACION GENERAL',

            password_hash:
              passwordHash,

            activo:
              true,

            updated_at:
              new Date(),

          },

          select: {
            id: true,
          },

        });


    // ==========================================================
    // AUDITORÍA
    // ==========================================================

    await this.prisma
      .auditoria_logs
      .create({

        data: {

          administrativo_id:
            administradorId,

          accion:
            'CREAR_USUARIO_ADMINISTRATIVO',

          tabla_afectada:
            'usuarios_administrativos',

          registro_id:
            nuevo.id,

          detalles: {

            rol,

            departamento_id:
              departamento?.id ??
              null,

          },

        },

      });


    return this.obtenerUsuario(
      nuevo.id,
    );

  }


  // ============================================================
  // ACTUALIZAR USUARIO
  // ============================================================

  async actualizar(
  id: string,
  body: ActualizarUsuarioAdministrativoDto & {
    password_autorizacion?: string;
  },
  administradorId: string,
    ) {
      await this.validarAutorizacionSuperadmin(
          administradorId,
          body.password_autorizacion,
        );

    if (!esUUID(id)) {

      throw new BadRequestException(
        'El identificador del usuario no es válido.',
      );

    }


    const actual =
      await this.prisma
        .usuarios_administrativos
        .findUnique({

          where: {
            id,
          },

        });


    if (!actual) {

      throw new NotFoundException(
        'El usuario administrativo no existe.',
      );

    }


    const ci =
      body.ci === undefined
        ? actual.ci
        : limpiarTexto(
            body.ci,
          );


    const nombres =
      body.nombres === undefined
        ? actual.nombres
        : limpiarTexto(
            body.nombres,
          );


    const apellidos =
      body.apellidos === undefined
        ? actual.apellidos
        : limpiarTexto(
            body.apellidos,
          );


    const email =
      body.email === undefined
        ? actual.email
        : limpiarTexto(
            body.email,
          ).toLowerCase();


    const cargo =
      body.cargo === undefined
        ? actual.cargo
        : limpiarTexto(
            body.cargo,
          );


    if (
      !ci ||
      !nombres ||
      !apellidos ||
      !email ||
      !cargo
    ) {

      throw new BadRequestException(
        'Los datos principales del usuario no pueden quedar vacíos.',
      );

    }


    const rol =
      body.rol === undefined
        ? this.validarRol(
            actual.rol,
          )
        : this.validarRol(
            body.rol,
          );


    // ==========================================================
    // DEPARTAMENTO
    // ==========================================================

    let departamento =
      null;


    if (
      rol !== 'SUPERADMIN'
    ) {

      const departamentoId =
        body.departamento_id !== undefined
          ? body.departamento_id
          : actual.departamento_id;


      if (!departamentoId) {

        throw new BadRequestException(
          'Debe seleccionar un departamento para este usuario.',
        );

      }


      departamento =
        await this
          .obtenerDepartamento(
            departamentoId,
          );

    } else if (
      body.departamento_id
    ) {

      departamento =
        await this
          .obtenerDepartamento(
            body.departamento_id,
          );

    }


    // ==========================================================
    // VALIDAR C.I. Y CORREO ÚNICOS
    // ==========================================================

    const duplicado =
      await this.prisma
        .usuarios_administrativos
        .findFirst({

          where: {

            id: {
              not:
                id,
            },

            OR: [

              {
                ci,
              },

              {
                email: {
                  equals:
                    email,

                  mode:
                    'insensitive',
                },
              },

            ],

          },

          select: {

            id:
              true,

            ci:
              true,

            email:
              true,

          },

        });


    if (duplicado) {

      if (
        duplicado.ci === ci
      ) {

        throw new BadRequestException(
          'Ya existe otro usuario con ese C.I.',
        );

      }


      throw new BadRequestException(
        'Ya existe otro usuario con ese correo.',
      );

    }


    await this.prisma
      .usuarios_administrativos
      .update({

        where: {
          id,
        },

        data: {

          ci,

          nombres,

          apellidos,

          email,

          cargo,

          rol,

          departamento_id:
            departamento?.id ??
            null,

          departamento_unidad:
            departamento?.nombre ??
            'ADMINISTRACION GENERAL',

          updated_at:
            new Date(),

        },

      });


    await this.prisma
      .auditoria_logs
      .create({

        data: {

          administrativo_id:
            administradorId,

          accion:
            'ACTUALIZAR_USUARIO_ADMINISTRATIVO',

          tabla_afectada:
            'usuarios_administrativos',

          registro_id:
            id,

          detalles: {

            rol,

            departamento_id:
              departamento?.id ??
              null,

          },

        },

      });


    return this.obtenerUsuario(
      id,
    );

  }


  // ============================================================
  // ACTIVAR / DESACTIVAR
  // ============================================================

  async cambiarEstado(
    id: string,
    body: {
      activo?: boolean;
    },
    administradorId: string,
  ) {

    if (!esUUID(id)) {

      throw new BadRequestException(
        'El identificador del usuario no es válido.',
      );

    }


    if (
      typeof body.activo !==
      'boolean'
    ) {

      throw new BadRequestException(
        'Debe indicar correctamente el estado activo del usuario.',
      );

    }


    const usuario =
      await this.prisma
        .usuarios_administrativos
        .findUnique({

          where: {
            id,
          },

          select: {

            id:
              true,

            activo:
              true,

            rol:
              true,

          },

        });


    if (!usuario) {

      throw new NotFoundException(
        'El usuario administrativo no existe.',
      );

    }


    if (
      usuario.id === administradorId &&
      body.activo === false
    ) {

      throw new BadRequestException(
        'No puede desactivar su propia cuenta de SUPERADMIN.',
      );

    }


    await this.prisma
      .usuarios_administrativos
      .update({

        where: {
          id,
        },

        data: {

          activo:
            body.activo,

          updated_at:
            new Date(),

        },

      });


    await this.prisma
      .auditoria_logs
      .create({

        data: {

          administrativo_id:
            administradorId,

          accion:
            body.activo
              ? 'ACTIVAR_USUARIO_ADMINISTRATIVO'
              : 'DESACTIVAR_USUARIO_ADMINISTRATIVO',

          tabla_afectada:
            'usuarios_administrativos',

          registro_id:
            id,

          detalles: {
            activo:
              body.activo,
          },

        },

      });


    return this.obtenerUsuario(
      id,
    );

  }


  // ============================================================
  // RESTABLECER CONTRASEÑA
  // ============================================================


  
  async restablecerPassword(
    
 id: string,
  body: {
    password?: string;
    password_autorizacion?: string;
  },
  administradorId: string,
) {

  await this.validarAutorizacionSuperadmin(
    administradorId,
    body.password_autorizacion,
  );
  
  
  

    
    if (!esUUID(id)) {

      throw new BadRequestException(
        'El identificador del usuario no es válido.',
      );

    }


    const password =
      limpiarTexto(
        body.password,
      );


    if (
      password.length < 8
    ) {

      throw new BadRequestException(
        'La nueva contraseña debe tener al menos 8 caracteres.',
      );

    }


    const usuario =
      await this.prisma
        .usuarios_administrativos
        .findUnique({

          where: {
            id,
          },

          select: {
            id:
              true,
          },

        });


    if (!usuario) {

      throw new NotFoundException(
        'El usuario administrativo no existe.',
      );

    }


    const passwordHash =
      await bcrypt.hash(
        password,
        12,
      );


    await this.prisma
      .usuarios_administrativos
      .update({

        where: {
          id,
        },

        data: {

          password_hash:
            passwordHash,

          updated_at:
            new Date(),

        },

      });


    await this.prisma
      .auditoria_logs
      .create({

        data: {

          administrativo_id:
            administradorId,

          accion:
            'RESTABLECER_PASSWORD_ADMINISTRATIVO',

          tabla_afectada:
            'usuarios_administrativos',

          registro_id:
            id,

        },

      });


    return {
      message:
        'Contraseña actualizada correctamente.',
    };

  }
  
}