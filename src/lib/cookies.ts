/*
 * COOKIES DEL SITIO
 *
 * Usamos solo dos cookies propias:
 *   - consentimiento = "aceptado" | "rechazado"   (la decisión del aviso de cookies)
 *   - idioma         = "es" | "en"                (solo si se aceptaron las cookies)
 *
 * Estas funciones son para el NAVEGADOR (usan document.cookie).
 * En el servidor las cookies se leen con cookies() de "next/headers"
 * (ver src/lib/textosServidor.ts).
 */

export const COOKIE_IDIOMA = "idioma";
export const COOKIE_CONSENTIMIENTO = "consentimiento";

export type Consentimiento = "aceptado" | "rechazado";

const UN_ANIO_EN_SEGUNDOS = 60 * 60 * 24 * 365;

/** Lee una cookie por su nombre. Devuelve null si no existe. */
export function leerCookie(nombre: string): string | null {
  // document.cookie es un texto como: "idioma=en; consentimiento=aceptado"
  const encontrada = document.cookie
    .split("; ")
    .find((parte) => parte.startsWith(`${nombre}=`));
  return encontrada ? decodeURIComponent(encontrada.split("=")[1]) : null;
}

/** Guarda una cookie para todo el sitio durante un año */
export function escribirCookie(nombre: string, valor: string) {
  document.cookie = `${nombre}=${encodeURIComponent(valor)}; Path=/; Max-Age=${UN_ANIO_EN_SEGUNDOS}; SameSite=Lax`;
}

/** Borra una cookie (se le pone una duración de 0 segundos) */
export function borrarCookie(nombre: string) {
  document.cookie = `${nombre}=; Path=/; Max-Age=0; SameSite=Lax`;
}

/** true si la persona aceptó las cookies en el aviso */
export function aceptoCookies() {
  return leerCookie(COOKIE_CONSENTIMIENTO) === "aceptado";
}
