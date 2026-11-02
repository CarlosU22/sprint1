/*
 * TEXTOS EN EL SERVIDOR
 * Ayudantes para usar los textos de la API dentro de componentes de servidor,
 * por ejemplo en generateMetadata() para el <title> de cada página.
 */
import { obtenerTextos } from "./api";
import { crearTraductor } from "./textos";
import { IDIOMA_POR_DEFECTO, type Idioma } from "./tipos";

/** Idioma de la petición actual */
export async function obtenerIdiomaActual(): Promise<Idioma> {
  return IDIOMA_POR_DEFECTO;
}

/** Devuelve t() y tPlural() con los textos del idioma actual */
export async function obtenerTraductorServidor() {
  const idioma = await obtenerIdiomaActual();
  const { textos } = await obtenerTextos(idioma);
  return { idioma, textos, ...crearTraductor(textos) };
}
