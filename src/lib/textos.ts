/*
 * AYUDANTES PARA LOS TEXTOS DE LA INTERFAZ
 *
 * La API manda los textos como un objeto anidado, por ejemplo:
 *   { navbar: { enlaces: { inicio: "Inicio" } } }
 *
 * En vez de escribir textos.navbar.enlaces.inicio (y pelear con TypeScript
 * porque cada nivel puede ser string u objeto), usamos una "ruta con puntos":
 *   t("navbar.enlaces.inicio")  →  "Inicio"
 */
import type { TextosAnidados } from "./tipos";

type Variables = Record<string, string | number>;

/** Recorre el objeto siguiendo la ruta "a.b.c". Devuelve undefined si no existe. */
export function buscarTexto(
  textos: TextosAnidados,
  ruta: string,
): string | TextosAnidados | undefined {
  let actual: string | TextosAnidados | undefined = textos;

  for (const clave of ruta.split(".")) {
    if (actual === undefined || typeof actual === "string") return undefined;
    actual = actual[clave];
  }

  return actual;
}

/** Reemplaza las llaves: interpolar("Pagar {total}", { total: "$10" }) → "Pagar $10" */
export function interpolar(texto: string, variables?: Variables) {
  if (!variables) return texto;
  return texto.replace(/\{(\w+)\}/g, (completo, nombre: string) =>
    nombre in variables ? String(variables[nombre]) : completo,
  );
}

/**
 * Crea las dos funciones que usan los componentes:
 *  - t(ruta, variables)          → un texto normal
 *  - tPlural(ruta, n, variables) → un plural { uno, otro } según la cantidad n
 *
 * Si una ruta no existe devolvemos la misma ruta: así se ve en pantalla
 * qué texto falta y es fácil de encontrar.
 */
export function crearTraductor(textos: TextosAnidados) {
  function t(ruta: string, variables?: Variables): string {
    const valor = buscarTexto(textos, ruta);
    return typeof valor === "string" ? interpolar(valor, variables) : ruta;
  }

  function tPlural(ruta: string, cantidad: number, variables?: Variables): string {
    const forma = cantidad === 1 ? "uno" : "otro";
    // La variable {cantidad} se agrega sola para no repetirla siempre
    return t(`${ruta}.${forma}`, { cantidad, n: cantidad, ...variables });
  }

  return { t, tPlural };
}
