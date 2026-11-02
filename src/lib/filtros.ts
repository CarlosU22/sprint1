/*
 * FILTROS DE EXPLORAR
 * Opciones de los filtros que se comparten entre el buscador del Inicio y la vista Explorar.
 */

/** Atajos de fecha. El texto sale de paginas.explorar.filtros.fecha.<opcion> */
export const OPCIONES_FECHA = ["hoy", "finDeSemana", "mes", "elegir"] as const;
export type OpcionFecha = (typeof OPCIONES_FECHA)[number];
