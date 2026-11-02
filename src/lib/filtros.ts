/*
 * FILTROS DE EXPLORAR
 *
 * Los filtros viven en la URL, por ejemplo:
 *   /explorar?categoria=teatro&ciudad=Manizales&q=salsa&orden=precio&pagina=2
 *
 * Ventaja: si se recarga la página o se comparte el enlace, los filtros se
 * conservan, porque la URL es la "fuente de la verdad".
 *
 * Este archivo tiene funciones PURAS (sin React) para:
 *   1. leerFiltros()          URL  →  objeto FiltrosExplorar
 *   2. crearParametrosApi()   objeto  →  parámetros de GET /eventos
 *   3. crearUrlExplorar()     objeto + cambios  →  nueva URL
 */

/** Atajos de fecha. El texto sale de paginas.explorar.filtros.fecha.<opcion> */
export const OPCIONES_FECHA = ["hoy", "finDeSemana", "mes"] as const;
export type OpcionFecha = (typeof OPCIONES_FECHA)[number];

/** Órdenes que acepta la API. El texto sale de paginas.explorar.orden.opciones.<orden> */
export const ORDENES = ["fecha", "precio", "popularidad"] as const;
export type Orden = (typeof ORDENES)[number];

/** 9 eventos por página: 3 filas de 3, como en el diseño */
export const EVENTOS_POR_PAGINA = 9;

/** Límites del control de precio (en pesos) */
export const PRECIO_MAXIMO = 300000;
export const PASO_PRECIO = 10000;

export interface FiltrosExplorar {
  q: string;
  categoria: string;
  ciudad: string;
  fecha: OpcionFecha | "";
  precioMax: number | null;
  orden: Orden;
  pagina: number;
}

export const FILTROS_VACIOS: FiltrosExplorar = {
  q: "",
  categoria: "",
  ciudad: "",
  fecha: "",
  precioMax: null,
  orden: "fecha",
  pagina: 1,
};

type ParametrosUrl = Record<string, string | string[] | undefined>;

/** Si un parámetro viene repetido (?q=a&q=b), Next.js lo entrega como arreglo: usamos el primero */
function primero(valor: string | string[] | undefined) {
  return (Array.isArray(valor) ? valor[0] : valor)?.trim() ?? "";
}

/** 1. Lee los filtros de la URL. Lo que no sea válido se ignora (queda el valor por defecto). */
export function leerFiltros(parametros: ParametrosUrl): FiltrosExplorar {
  const orden = primero(parametros.orden) as Orden;
  const fecha = primero(parametros.fecha) as OpcionFecha;
  const pagina = Number.parseInt(primero(parametros.pagina), 10);
  const precioMax = Number.parseInt(primero(parametros.precioMax), 10);

  return {
    q: primero(parametros.q).slice(0, 80), // la API acepta máximo 80 caracteres
    categoria: primero(parametros.categoria),
    ciudad: primero(parametros.ciudad),
    fecha: OPCIONES_FECHA.includes(fecha) ? fecha : "",
    precioMax: Number.isInteger(precioMax) && precioMax >= 0 ? precioMax : null,
    orden: ORDENES.includes(orden) ? orden : "fecha",
    pagina: Number.isInteger(pagina) && pagina > 0 ? pagina : 1,
  };
}

// ---------- Fechas (siempre en hora de Colombia) ----------

/** Fecha de hoy en Colombia como "AAAA-MM-DD" */
function hoyEnColombia() {
  // en-CA formatea las fechas como 2026-11-02
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(
    new Date(),
  );
}

/** Suma días a una fecha "AAAA-MM-DD" */
function sumarDias(fecha: string, dias: number) {
  const d = new Date(`${fecha}T12:00:00Z`); // al mediodía para no tener líos de zona horaria
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().slice(0, 10);
}

/** Convierte un atajo de fecha en el rango { desde, hasta } que entiende la API */
export function rangoDeFecha(opcion: OpcionFecha) {
  const hoy = hoyEnColombia();
  const diaSemana = new Date(`${hoy}T12:00:00Z`).getUTCDay(); // 0 domingo … 6 sábado

  if (opcion === "hoy") {
    return { desde: hoy, hasta: hoy };
  }

  if (opcion === "finDeSemana") {
    // Si hoy es domingo, el fin de semana es solo hoy; si no, del próximo sábado al domingo
    if (diaSemana === 0) return { desde: hoy, hasta: hoy };
    const sabado = sumarDias(hoy, 6 - diaSemana);
    return { desde: sabado, hasta: sumarDias(sabado, 1) };
  }

  // "mes": desde hoy hasta el último día del mes
  const [anio, mes] = hoy.split("-").map(Number);
  const ultimoDia = new Date(Date.UTC(anio, mes, 0)).toISOString().slice(0, 10);
  return { desde: hoy, hasta: ultimoDia };
}

// ---------- Hacia la API ----------

/** 2. Arma los parámetros de GET /eventos. Los filtros vacíos no se envían. */
export function crearParametrosApi(filtros: FiltrosExplorar) {
  const parametros = new URLSearchParams();

  if (filtros.q) parametros.set("q", filtros.q);
  if (filtros.categoria) parametros.set("categoria", filtros.categoria);
  if (filtros.ciudad) parametros.set("ciudad", filtros.ciudad);
  if (filtros.fecha) {
    const { desde, hasta } = rangoDeFecha(filtros.fecha);
    parametros.set("desde", desde);
    parametros.set("hasta", hasta);
  }
  if (filtros.precioMax !== null) parametros.set("precioMax", String(filtros.precioMax));
  parametros.set("orden", filtros.orden);
  parametros.set("pagina", String(filtros.pagina));
  parametros.set("porPagina", String(EVENTOS_POR_PAGINA));

  return parametros;
}

// ---------- Hacia la URL ----------

/**
 * 3. Crea la URL de /explorar con algunos filtros cambiados.
 *    Si cambia cualquier filtro que no sea la página, volvemos a la página 1
 *    (si no, podríamos quedar en la página 5 de un resultado con 1 página).
 */
export function crearUrlExplorar(
  filtros: FiltrosExplorar,
  cambios: Partial<FiltrosExplorar> = {},
) {
  const nuevos = { ...filtros, ...cambios };
  if (!("pagina" in cambios)) nuevos.pagina = 1;

  const parametros = new URLSearchParams();
  // Mismo orden del ejemplo de la historia: ?categoria=&ciudad=&q=&orden=&pagina=
  if (nuevos.categoria) parametros.set("categoria", nuevos.categoria);
  if (nuevos.ciudad) parametros.set("ciudad", nuevos.ciudad);
  if (nuevos.q) parametros.set("q", nuevos.q);
  if (nuevos.fecha) parametros.set("fecha", nuevos.fecha);
  if (nuevos.precioMax !== null) parametros.set("precioMax", String(nuevos.precioMax));
  if (nuevos.orden !== "fecha") parametros.set("orden", nuevos.orden);
  if (nuevos.pagina > 1) parametros.set("pagina", String(nuevos.pagina));

  const consulta = parametros.toString();
  return consulta ? `/explorar?${consulta}` : "/explorar";
}

/** true si hay al menos un filtro puesto (el orden y la página no cuentan) */
export function hayFiltrosActivos(filtros: FiltrosExplorar) {
  return Boolean(
    filtros.q ||
    filtros.categoria ||
    filtros.ciudad ||
    filtros.fecha ||
    filtros.precioMax !== null,
  );
}
