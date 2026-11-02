/*
 * TEXTOS EN EL SERVIDOR
 * Ayudantes para usar los textos de la API dentro de componentes de servidor:
 * el layout y generateMetadata() (el <title> de cada página).
 */
import { cookies } from "next/headers";
import { obtenerTextos } from "./api";
import { COOKIE_IDIOMA } from "./cookies";
import { crearTraductor } from "./textos";
import { IDIOMA_POR_DEFECTO, IDIOMAS, type Idioma } from "./tipos";

/**
 * Idioma de la petición actual:
 *  - el de la cookie `idioma`, si existe (solo existe si se aceptaron las cookies),
 *  - si no, español.
 */
export async function obtenerIdiomaActual(): Promise<Idioma> {
  const almacen = await cookies(); // en Next.js 16 cookies() es asíncrona
  const valor = almacen.get(COOKIE_IDIOMA)?.value as Idioma | undefined;
  return valor && IDIOMAS.includes(valor) ? valor : IDIOMA_POR_DEFECTO;
}

/** Devuelve t() y tPlural() con los textos del idioma actual */
export async function obtenerTraductorServidor() {
  const idioma = await obtenerIdiomaActual();
  const { textos } = await obtenerTextos(idioma);
  return { idioma, textos, ...crearTraductor(textos) };
}
