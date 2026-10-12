import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';


export class LoginDto {

  @IsEmail(
    {},
    {
      message:
        'El correo electrónico no es válido.',
    },
  )
  @IsNotEmpty({
    message:
      'El correo electrónico es obligatorio.',
  })
  @MaxLength(
    150,
    {
      message:
        'El correo electrónico es demasiado largo.',
    },
  )
  email: string;


  @IsString({
    message:
      'La contraseña debe ser texto.',
  })
  @IsNotEmpty({
    message:
      'La contraseña es obligatoria.',
  })
  @MaxLength(
    200,
    {
      message:
        'La contraseña es demasiado larga.',
    },
  )
  password: string;
}