export type TipoUsuario =
  | 'ADMINISTRATIVO'
  | 'SISTEMA';

export interface JwtPayload {
  sub: string;
  tipoUsuario: TipoUsuario;
}

export interface UsuarioAutenticado {
  id: string;
  email: string;
  rol: string;
  tipoUsuario: TipoUsuario;
  postulanteId: string | null;
}