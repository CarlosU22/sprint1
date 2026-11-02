/*
 * COOKIES EN EL SERVIDOR
 * Lee la decisión del aviso de cookies durante la petición, para saber
 * desde el primer HTML si hay que mostrar el aviso (así no "parpadea").
 */
import { cookies } from "next/headers";
import { COOKIE_CONSENTIMIENTO, type Consentimiento } from "./cookies";

/** "aceptado", "rechazado" o null si la persona todavía no ha decidido */
export async function obtenerConsentimiento(): Promise<Consentimiento | null> {
  const almacen = await cookies();
  const valor = almacen.get(COOKIE_CONSENTIMIENTO)?.value;
  return valor === "aceptado" || valor === "rechazado" ? valor : null;
}
