/*
 * FORMATOS DE FECHAS Y PRECIOS
 *
 * La API manda las fechas en UTC ("2026-11-15T01:00:00.000Z") y los precios
 * como números enteros (95000). Aquí los convertimos a lo que se ve en el
 * diseño: "Sáb 14 nov" · "8:00 p. m." · "$95.000".
 *
 * Usamos Intl, que ya viene en JavaScript y conoce los nombres de los días
 * y meses en cada idioma. Todos los eventos son en Colombia, así que
 * siempre mostramos la hora de Bogotá.
 */
import type { Idioma } from "./tipos";

const ZONA_HORARIA = "America/Bogota";

const LOCALES: Record<Idioma, string> = {
  es: "es-CO",
  en: "en-US",
};

function primeraEnMayuscula(texto: string) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/** "Sáb 14 nov" (español) o "Sat Nov 14" (inglés) */
export function formatearFecha(fechaIso: string, idioma: Idioma) {
  const partes = new Intl.DateTimeFormat(LOCALES[idioma], {
    timeZone: ZONA_HORARIA,
    weekday: "short",
    day: "numeric",
    month: "short",
  }).formatToParts(new Date(fechaIso));

  // formatToParts devuelve [{ type: "weekday", value: "sáb" }, ...]
  const parte = (tipo: string) => partes.find((p) => p.type === tipo)?.value ?? "";
  const diaSemana = primeraEnMayuscula(parte("weekday").replace(".", ""));
  const mes = parte("month").replace(".", "");

  return idioma === "es"
    ? `${diaSemana} ${parte("day")} ${mes}`
    : `${diaSemana} ${mes} ${parte("day")}`;
}

/** "8:00 p. m." (español) o "8:00 PM" (inglés) */
export function formatearHora(fechaIso: string, idioma: Idioma) {
  return new Intl.DateTimeFormat(LOCALES[idioma], {
    timeZone: ZONA_HORARIA,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(fechaIso));
}

/** Pesos colombianos sin decimales: 95000 → "$95.000" (igual en los dos idiomas) */
export function formatearPrecio(valor: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  })
    .format(valor)
    .replace(/\s/g, ""); // Intl pone un espacio después del "$"; el diseño no lo tiene
}
