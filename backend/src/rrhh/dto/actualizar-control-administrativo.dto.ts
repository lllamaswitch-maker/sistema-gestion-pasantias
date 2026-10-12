
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

import { talla_chamarra_enum } from '@prisma/client';

export class ActualizarControlAdministrativoDto {
  @IsOptional()
  @IsEnum(talla_chamarra_enum)
  talla_chamarra?: talla_chamarra_enum;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  credencial_codigo?: string;

  @IsOptional()
  @IsBoolean()
  induccion?: boolean;

  @IsOptional()
  @IsBoolean()
  compromiso?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  carta_t3?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  seguro_contra_accidente?: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  fecha_devolucion_tarjeta?: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  fecha_devolucion_chamarra?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  reposicion_tarjeta?: string;

  @IsOptional()
  @IsBoolean()
  certificado_emitido?: boolean;
}
