import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import {
  ROLES_KEY,
} from '../decorators/roles.decorator';

import {
  UsuarioAutenticado,
} from '../interfaces/jwt-payload.interface';


@Injectable()
export class RolesGuard
  implements CanActivate {

  constructor(
    private readonly reflector: Reflector,
  ) {}


  canActivate(
    context: ExecutionContext,
  ): boolean {

    const rolesPermitidos =
      this.reflector
        .getAllAndOverride<string[]>(
          ROLES_KEY,
          [
            context.getHandler(),
            context.getClass(),
          ],
        );


    // Si la ruta no especifica roles,
    // basta con estar autenticado.
    if (
      !rolesPermitidos ||
      rolesPermitidos.length === 0
    ) {
      return true;
    }


    const request =
      context
        .switchToHttp()
        .getRequest();


    const usuario =
      request.user as
        | UsuarioAutenticado
        | undefined;


    if (!usuario) {
      throw new UnauthorizedException(
        'Usuario no autenticado.',
      );
    }


    if (
      !rolesPermitidos.includes(
        usuario.rol,
      )
    ) {
      throw new ForbiddenException(
        'No tiene permisos para realizar esta operación.',
      );
    }


    return true;
  }
}