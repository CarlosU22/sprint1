/*
 * FORMULARIO DE INGRESO: estados y validación
 *
 * Este archivo lo usan los dos lados:
 *   - el navegador valida antes de enviar (respuesta inmediata, funciona sin red),
 *   - la Server Action vuelve a validar (nunca hay que confiar solo en el navegador).
 */

/** Un mensaje para la persona: una ruta de los textos de la API, o un texto que ya viene escrito */
export type Mensaje = { ruta: string } | { texto: string };

export interface ErroresIngreso {
  correo?: Mensaje;
  clave?: Mensaje;
}

/**
 * Cada pantalla de Figma es un estado:
 *   inicial       → el formulario vacío
 *   campos        → "Revisa los campos marcados" + mensaje junto a cada campo
 *   credenciales  → "Correo o contraseña incorrectos" (401)
 *   intentos      → "Demasiados intentos" (429)
 *   conexion      → "No pudimos conectarnos" + botón "Reintentar"
 *   exito         → ya ingresó: vamos al inicio
 * El estado "Ingresando…" no está aquí: lo da `pendiente` de useActionState.
 */
export type EstadoIngreso =
  | { tipo: "inicial" }
  | { tipo: "campos"; errores: ErroresIngreso; faltanDatos: boolean }
  | { tipo: "credenciales" }
  | { tipo: "intentos"; segundos: number }
  | { tipo: "conexion" }
  | { tipo: "exito" };

/** Lee un campo de texto del formulario. FormData.get() también puede traer un archivo: eso cuenta como vacío */
export function leerCampo(datos: FormData, nombre: string) {
  const valor = datos.get(nombre);
  return typeof valor === "string" ? valor : "";
}

/**
 * Lo mínimo para que algo parezca un correo: texto@texto.texto, sin espacios.
 * La revisión completa la hace la API (responde 422 si no es válido).
 */
function pareceCorreo(texto: string) {
  const [usuario, dominio, ...sobra] = texto.split("@");
  if (sobra.length > 0 || !usuario || !dominio || /\s/.test(texto)) return false;
  const punto = dominio.lastIndexOf(".");
  return punto > 0 && punto < dominio.length - 1;
}

/** Revisa los dos campos. Devuelve el estado de error, o null si están bien. */
export function validarIngreso(correo: string, clave: string): EstadoIngreso | null {
  const errores: ErroresIngreso = {};

  if (!correo) {
    errores.correo = { ruta: "paginas.ingresar.errores.correoObligatorio" };
  } else if (!pareceCorreo(correo)) {
    errores.correo = { ruta: "formularios.validacion.correoInvalido" };
  }

  if (!clave) {
    errores.clave = { ruta: "paginas.ingresar.errores.claveObligatoria" };
  }

  if (!errores.correo && !errores.clave) return null;
  return { tipo: "campos", errores, faltanDatos: !correo || !clave };
}
