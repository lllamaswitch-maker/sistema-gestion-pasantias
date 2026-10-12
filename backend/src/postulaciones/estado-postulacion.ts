// ============================================================
// ESTADOS DE POSTULACIÓN
// ============================================================

export const estado_postulacion_enum = {
  REGISTRADO: 'REGISTRADO',
  EN_EVALUACION_RRHH: 'EN_EVALUACION_RRHH',
  SELECCIONADO_POR_AREA: 'SELECCIONADO_POR_AREA',
  APROBADO_PARA_ENTREVISTA: 'APROBADO_PARA_ENTREVISTA',
  ACEPTADO: 'ACEPTADO',
  RECHAZADO: 'RECHAZADO',
  HABILITADO: 'HABILITADO',
  APROBADO: 'APROBADO',
  OBSERVADO: 'OBSERVADO',
  DESISTIDO: 'DESISTIDO',
  NO_SELECCIONADO: 'NO_SELECCIONADO',
} as const;


export type estado_postulacion_enum =
  typeof estado_postulacion_enum[
    keyof typeof estado_postulacion_enum
  ];


// ============================================================
// TRANSICIONES DE ESTADO PERMITIDAS
// ============================================================

export const TRANSICIONES_ESTADO:
  Record<
    estado_postulacion_enum,
    readonly estado_postulacion_enum[]
  > = {

    // ----------------------------------------------------------
    // POSTULANTE RECIÉN REGISTRADO
    // ----------------------------------------------------------
    REGISTRADO: [
      estado_postulacion_enum.EN_EVALUACION_RRHH,
      estado_postulacion_enum.DESISTIDO,
    ],


    // ----------------------------------------------------------
    // RRHH ESTÁ REVISANDO LA DOCUMENTACIÓN
    // ----------------------------------------------------------
    EN_EVALUACION_RRHH: [
      estado_postulacion_enum.OBSERVADO,
      estado_postulacion_enum.APROBADO,
      estado_postulacion_enum.RECHAZADO,
      estado_postulacion_enum.DESISTIDO,
    ],


    // ----------------------------------------------------------
    // DOCUMENTACIÓN OBSERVADA
    // ----------------------------------------------------------
    OBSERVADO: [
      estado_postulacion_enum.EN_EVALUACION_RRHH,
      estado_postulacion_enum.DESISTIDO,
    ],


    // ----------------------------------------------------------
    // POSTULANTE APROBADO POR RRHH
    //
    // Ya puede ser visible para los supervisores.
    // Si un supervisor lo solicita:
    // APROBADO -> SELECCIONADO_POR_AREA
    // ----------------------------------------------------------
    APROBADO: [
      estado_postulacion_enum.SELECCIONADO_POR_AREA,
      estado_postulacion_enum.DESISTIDO,
    ],


    // ----------------------------------------------------------
    // UN SUPERVISOR YA SOLICITÓ AL POSTULANTE
    //
    // Puede ocurrir:
    //
    // 1. RRHH rechaza/cancela la petición:
    //    vuelve a APROBADO.
    //
    // 2. RRHH aprueba la petición, contacta al postulante
    //    y este acepta entrevista:
    //    pasa a APROBADO_PARA_ENTREVISTA.
    //
    // 3. El postulante decide no continuar:
    //    DESISTIDO.
    // ----------------------------------------------------------
    SELECCIONADO_POR_AREA: [
      estado_postulacion_enum.APROBADO,
      estado_postulacion_enum.APROBADO_PARA_ENTREVISTA,
      estado_postulacion_enum.DESISTIDO,
    ],


    // ----------------------------------------------------------
    // POSTULANTE ACEPTÓ CONTINUAR A ENTREVISTA
    //
    // Después de la entrevista puede:
    //
    // ACEPTADO
    // NO_SELECCIONADO
    // DESISTIDO
    // ----------------------------------------------------------
    APROBADO_PARA_ENTREVISTA: [
      estado_postulacion_enum.ACEPTADO,
      estado_postulacion_enum.NO_SELECCIONADO,
      estado_postulacion_enum.DESISTIDO,
    ],


    // ----------------------------------------------------------
    // ESTADO LEGACY / COMPATIBILIDAD
    // ----------------------------------------------------------
    HABILITADO: [
      estado_postulacion_enum.DESISTIDO,
    ],


    // ----------------------------------------------------------
    // ACEPTADO
    //
    // Es estado terminal de la POSTULACIÓN.
    // Desde aquí se crea el registro en pasantes_activos.
    //
    // Si posteriormente abandona, ya no corresponde DESISTIDO,
    // sino ABANDONO en pasantes_activos.
    // ----------------------------------------------------------
    ACEPTADO: [],


    // ----------------------------------------------------------
    // RECHAZADO POR RRHH
    // Estado terminal.
    // ----------------------------------------------------------
    RECHAZADO: [],


    // ----------------------------------------------------------
    // DESISTIMIENTO VOLUNTARIO DEL POSTULANTE
    // Estado terminal.
    // ----------------------------------------------------------
    DESISTIDO: [],


    // ----------------------------------------------------------
    // NO FUE SELECCIONADO DESPUÉS DE ENTREVISTA
    // Estado terminal.
    // ----------------------------------------------------------
    NO_SELECCIONADO: [],
  };


// ============================================================
// VALIDAR TRANSICIÓN
// ============================================================

export function puedeCambiarEstado(
  estadoActual: estado_postulacion_enum,
  nuevoEstado: estado_postulacion_enum,
): boolean {

  return (
    TRANSICIONES_ESTADO[
      estadoActual
    ]?.includes(
      nuevoEstado,
    ) ?? false
  );
}