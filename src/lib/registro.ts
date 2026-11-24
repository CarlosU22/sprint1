/*
 * FORMULARIO DE CREAR CUENTA: estados y validación
 *
 * Igual que en Ingresar (lib/ingreso.ts), lo usan los dos lados:
 * el navegador valida antes de enviar y la Server Action vuelve a validar.
 */
import { pareceCorreo, type Mensaje } from "./ingreso";

export interface ErroresRegistro {
  correo?: Mensaje;
  documento?: Mensaje;
  clave?: Mensaje;
}

/**
 *   inicial      → el formulario vacío
 *   campos       → "Hay N datos por corregir…" + mensaje junto a cada campo.
 *                  `otros`: errores de la API sobre datos que el formulario no pide
 *                  (por ejemplo, el nombre); se muestran en el aviso
 *   correoEnUso  → 409: ya hay una cuenta con ese correo (enlaces a Ingresar y Restablecer)
 *   conexion     → no hay red o la API falló: botón "Reintentar"
 *   exito        → cuenta creada y sesión abierta: vamos al inicio
 */
export type EstadoRegistro =
  | { tipo: "inicial" }
  | { tipo: "campos"; errores: ErroresRegistro; otros?: string[] }
  | { tipo: "correoEnUso" }
  | { tipo: "conexion" }
  | { tipo: "exito" };

/** Límites de la contraseña: el mínimo es del diseño y el máximo, de la API */
const CLAVE_MINIMO = 8;
const CLAVE_MAXIMO = 72;

/**
 * Los requisitos que se ven debajo de la contraseña (paginas.registro.formulario.requisitosClave).
 * Cada clave es el nombre del requisito en los textos de la API.
 */
export function requisitosClave(clave: string) {
  return {
    longitud: clave.length >= CLAVE_MINIMO && clave.length <= CLAVE_MAXIMO,
    mayuscula: /\p{Lu}/u.test(clave), // cualquier mayúscula, también Ñ o Á
    numero: /\d/.test(clave),
  };
}

/**
 * Número de identificación: de 5 a 15 letras o números, sin puntos ni espacios
 * (la misma regla de formularios.validacion.documentoFormato).
 */
const FORMA_DE_DOCUMENTO = /^[0-9A-Za-z]{5,15}$/;

/** Revisa los tres campos. Devuelve el estado de error, o null si están bien. */
export function validarRegistro(
  correo: string,
  documento: string,
  clave: string,
): EstadoRegistro | null {
  const errores: ErroresRegistro = {};

  if (!pareceCorreo(correo)) {
    errores.correo = { ruta: "paginas.registro.errores.correo" };
  }

  if (!documento) {
    errores.documento = { ruta: "formularios.validacion.requerido" };
  } else if (!FORMA_DE_DOCUMENTO.test(documento)) {
    errores.documento = { ruta: "formularios.validacion.documentoFormato" };
  }

  if (!Object.values(requisitosClave(clave)).every(Boolean)) {
    errores.clave = { ruta: "paginas.registro.errores.clave" };
  }

  if (Object.keys(errores).length === 0) return null;
  return { tipo: "campos", errores };
}
