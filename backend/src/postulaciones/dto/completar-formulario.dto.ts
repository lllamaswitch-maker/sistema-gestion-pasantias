import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CompletarFormularioDto {

  @IsString()
  @IsNotEmpty({
    message: 'La fecha de nacimiento es obligatoria.',
  })
  @Matches(
    /^\d{4}-\d{2}-\d{2}$/,
    {
      message:
        'La fecha de nacimiento debe tener formato YYYY-MM-DD.',
    },
  )
  fecha_nacimiento!: string;


  @IsIn(
    [
      'MASCULINO',
      'FEMENINO',
    ],
    {
      message:
        'El género seleccionado no es válido.',
    },
  )
  genero!:
    | 'MASCULINO'
    | 'FEMENINO';


  @IsString()
  @IsNotEmpty({
    message:
      'El número de celular es obligatorio.',
  })
  @MaxLength(20)
  @Matches(
    /^[0-9+\-\s]+$/,
    {
      message:
        'El número de celular contiene caracteres no permitidos.',
    },
  )
  numero_celular!: string;


  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Matches(
    /^[0-9+\-\s]+$/,
    {
      message:
        'El teléfono fijo contiene caracteres no permitidos.',
    },
  )
  telefono_fijo?: string;


  @IsString()
  @IsNotEmpty({
    message:
      'La ciudad o municipio es obligatorio.',
  })
  @MaxLength(100)
  ciudad!: string;


  @IsString()
  @IsNotEmpty({
    message:
      'La zona de domicilio es obligatoria.',
  })
  @MaxLength(150)
  zona_domicilio!: string;


  @IsString()
  @IsNotEmpty({
    message:
      'La dirección es obligatoria.',
  })
  @MaxLength(255)
  direccion_detalle!: string;


  /*
   * Puede contener:
   *
   * - UUID de una institución
   * - "OTRA"
   */
  @IsString()
  @IsNotEmpty({
    message:
      'Debe seleccionar una institución.',
  })
  @MaxLength(50)
  institucion_id!: string;


  @IsOptional()
  @IsString()
  @MaxLength(150)
  otra_institucion_nombre?: string;


  /*
   * Puede contener:
   *
   * - UUID de una carrera
   * - "OTRA"
   */
  @IsString()
  @IsNotEmpty({
    message:
      'Debe seleccionar una carrera.',
  })
  @MaxLength(50)
  carrera_id!: string;


  @IsOptional()
  @IsString()
  @MaxLength(150)
  otra_carrera_nombre?: string;


  @IsIn(
    [
      'PASANTIA',
      'PROYECTO_DE_GRADO',
      'TRABAJO_DIRIGIDO',
      'EXCELENCIA_ACADEMICA',
      'OTRO',
    ],
    {
      message:
        'La modalidad de postulación no es válida.',
    },
  )
  modalidad_postulacion!:
    | 'PASANTIA'
    | 'PROYECTO_DE_GRADO'
    | 'TRABAJO_DIRIGIDO'
    | 'EXCELENCIA_ACADEMICA'
    | 'OTRO';


  @IsString()
  @IsNotEmpty({
    message:
      'El semestre o nivel es obligatorio.',
  })
  @MaxLength(50)
  semestre_o_nivel!: string;


  @IsIn(
    [
      'MANANA',
      'TARDE',
      'TIEMPO_COMPLETO',
    ],
    {
      message:
        'El turno seleccionado no es válido.',
    },
  )
  turno!:
    | 'MANANA'
    | 'TARDE'
    | 'TIEMPO_COMPLETO';
}