import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';


// ============================================================
// PRE-REGISTRO
// ============================================================

export class PreRegistroDto {

  @IsString()
  @IsNotEmpty({
    message: 'El CI es obligatorio.',
  })
  @MinLength(4, {
    message:
      'El CI debe tener al menos 4 caracteres.',
  })
  @MaxLength(20, {
    message:
      'El CI no puede superar los 20 caracteres.',
  })
  @Matches(
    /^[A-Za-z0-9-]+$/,
    {
      message:
        'El CI contiene caracteres no permitidos.',
    },
  )
  ci: string;


  @IsString()
  @IsNotEmpty({
    message:
      'Los nombres son obligatorios.',
  })
  @MaxLength(100, {
    message:
      'Los nombres son demasiado largos.',
  })
  nombres: string;


  @IsString()
  @IsNotEmpty({
    message:
      'El apellido paterno es obligatorio.',
  })
  @MaxLength(100, {
    message:
      'El apellido paterno es demasiado largo.',
  })
  apellido_paterno: string;


  @IsOptional()
  @IsString()
  @MaxLength(100, {
    message:
      'El apellido materno es demasiado largo.',
  })
  apellido_materno?: string;


  @IsEmail(
    {},
    {
      message:
        'Ingrese un correo electrónico válido.',
    },
  )
  @IsNotEmpty({
    message:
      'El correo electrónico es obligatorio.',
  })
  @MaxLength(150, {
    message:
      'El correo electrónico es demasiado largo.',
  })
  email: string;


  @IsString()
  @IsNotEmpty({
    message:
      'El lugar de expedición es obligatorio.',
  })
  @MaxLength(10, {
    message:
      'El lugar de expedición no es válido.',
  })
  expedido: string;
}


// ============================================================
// VERIFICAR CÓDIGO OTP
// ============================================================

export class VerificarCodigoDto {

  @IsEmail(
    {},
    {
      message:
        'El correo electrónico no es válido.',
    },
  )
  @IsNotEmpty()
  email: string;


  @IsString()
  @IsNotEmpty({
    message:
      'El código de verificación es obligatorio.',
  })
  @Matches(
    /^\d{6}$/,
    {
      message:
        'El código debe contener exactamente 6 números.',
    },
  )
  codigo: string;
}