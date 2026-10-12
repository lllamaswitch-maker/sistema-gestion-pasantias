import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import type {
  UsuarioAutenticado,
} from '../interfaces/jwt-payload.interface';


@Injectable()
export class AdministrativoGuard
  implements CanActivate {

  canActivate(
    context: ExecutionContext,
  ): boolean {

    const request =
      context
        .switchToHttp()
        .getRequest();


    const usuario =
      request.user as
        | UsuarioAutenticado
        | undefined;


    // ==========================================================
    // DEBE ESTAR AUTENTICADO
    // ==========================================================

    if (!usuario) {

      throw new UnauthorizedException(
        'Usuario no autenticado.',
      );
    }


    // ==========================================================
    // DEBE SER USUARIO ADMINISTRATIVO
    // ==========================================================

    if (
      usuario.tipoUsuario !==
      'ADMINISTRATIVO'
    ) {

      throw new ForbiddenException(
        'Esta operación está reservada para usuarios administrativos.',
      );
    }


    return true;
  }
}