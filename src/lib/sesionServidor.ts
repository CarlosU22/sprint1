/*
 * SESIÓN EN EL SERVIDOR
 *
 * Al ingresar, la API devuelve un `token`. Siguiendo el contrato de la API, lo
 * guardamos en una cookie httpOnly de NUESTRO dominio:
 *   - httpOnly: el JavaScript del navegador no la puede leer (protege el token).
 *   - Nunca en localStorage: cualquier script de la página podría robarlo.
 * Más adelante, las peticiones que pidan sesión lo envían desde el servidor
 * como `Authorization: Bearer <token>`.
 *
 * Es una cookie NECESARIA (sin ella no hay sesión), así que no depende del
 * aviso de cookies.
 */
import { cookies } from "next/headers";

export const COOKIE_SESION = "sesion";

/** La sesión de la API dura 12 horas: la cookie no debe durar más */
const DOCE_HORAS_EN_SEGUNDOS = 60 * 60 * 12;

/**
 * Guarda el token.
 * - mantener = true  → la cookie dura 12 horas, aunque se cierre el navegador.
 * - mantener = false → cookie "de sesión" (sin Max-Age): se borra al cerrar el navegador.
 */
export async function guardarSesion(token: string, mantener: boolean) {
  const almacen = await cookies();
  almacen.set(COOKIE_SESION, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // solo por https en producción
    sameSite: "lax",
    path: "/",
    ...(mantener ? { maxAge: DOCE_HORAS_EN_SEGUNDOS } : {}),
  });
}
