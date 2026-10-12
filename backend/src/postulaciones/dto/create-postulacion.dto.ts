export class CreatePostulacionDto {
  // Datos Personales
  ci: string;
  expedido: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno?: string;
  fecha_nacimiento: string;
  genero: 'MASCULINO' | 'FEMENINO';
  estado_civil?: 'SOLTERO' | 'CASADO' | 'OTRO';
  tiene_hijos?: boolean;

  // Contacto y Domicilio
  numero_celular: string;
  telefono_fijo?: string;
  zona_domicilio: string;
  direccion_detalle?: string;

  // Formación Académica
  institucion_id?: string;
  otra_institucion_nombre?: string;
  carrera_id?: string;
  otra_carrera_nombre?: string;
  semestre_o_nivel: string;
  modalidad_postulacion: 'PASANTIA' | 'PROYECTO_DE_GRADO' | 'TRABAJO_DIRIGIDO' | 'EXCELENCIA_ACADEMICA' | 'OTRO';

  // Disponibilidad Horaria
  turno: 'MANANA' | 'TARDE' | 'TIEMPO_COMPLETO';
  observaciones_horario?: string;

  // Experiencia Laboral (Opcional)
  experiencias?: {
    institucion_empresa: string;
    fecha_inicio?: string;
    fecha_final?: string;
    tiempo_duracion?: string;
  }[];

  // Idiomas (Opcional)
  idiomas?: {
    idioma: string;
    porcentaje: number;
  }[];

  // Referencias a los 7 Documentos subidos
  documentos: {
    tipo_documento: any;
    archivo_url: string;
  }[];
}