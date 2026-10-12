import { ArrayMaxSize, ArrayMinSize, IsArray, IsString, IsUUID, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SolicitudIndividualDto {
  @IsUUID('4')
  postulacion_id!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(1500)
  actividades_pasante!: string;
}

export class SolicitarPasantesLoteDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(30)
  @ValidateNested({ each: true })
  @Type(() => SolicitudIndividualDto)
  solicitudes!: SolicitudIndividualDto[];
}
