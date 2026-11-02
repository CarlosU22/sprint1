/*
 * CLIENTE DE LA API
 * Todas las llamadas a la API de Taquilla pasan por este archivo.
 * La dirección base sale de la variable de entorno NEXT_PUBLIC_API_URL
 * (ver .env.example). Así, si cambia la API, no hay que tocar el código.
 */
import type {
  Categoria,
  Ciudad,
  ErrorDeApi,
  EventoResumen,
  Idioma,
  Paginacion,
  RespuestaTextos,
} from "./tipos";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/** Error que lanzamos cuando la API responde con un código 4xx o 5xx */
export class ErrorApi extends Error {
  codigo: string;
  estado: number;

  constructor(codigo: string, mensaje: string, estado: number) {
    super(mensaje);
    this.codigo = codigo;
    this.estado = estado;
  }
}

/**
 * Función base: hace el fetch, revisa si hubo error y devuelve el JSON.
 * `revalidar` son los segundos que Next.js puede guardar la respuesta en caché
 * (0 = pedirla siempre de nuevo).
 */
async function pedir<T>(ruta: string, revalidar = 0): Promise<T> {
  if (!API_URL) {
    throw new Error("Falta la variable de entorno NEXT_PUBLIC_API_URL");
  }

  const respuesta = await fetch(`${API_URL}${ruta}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: revalidar },
  });

  if (!respuesta.ok) {
    // La API siempre manda { error: { codigo, mensaje } }, pero por si acaso
    // ponemos valores por defecto si el cuerpo no es JSON.
    const cuerpo = (await respuesta.json().catch(() => null)) as ErrorDeApi | null;
    throw new ErrorApi(
      cuerpo?.error.codigo ?? "error_interno",
      cuerpo?.error.mensaje ?? respuesta.statusText,
      respuesta.status,
    );
  }

  return (await respuesta.json()) as T;
}

// ---------- Textos de la interfaz ----------

/** GET /textos?idioma=es|en  →  todos los textos de la interfaz */
export function obtenerTextos(idioma: Idioma) {
  // Los textos casi no cambian: se guardan 5 minutos (igual que el Cache-Control de la API)
  return pedir<RespuestaTextos>(`/textos?idioma=${idioma}`, 300);
}

// ---------- Catálogo público ----------

/** GET /categorias */
export async function obtenerCategorias() {
  const respuesta = await pedir<{ datos: Categoria[] }>("/categorias", 60);
  return respuesta.datos;
}

/** GET /ciudades (vienen ordenadas de más a menos eventos) */
export async function obtenerCiudades() {
  const respuesta = await pedir<{ datos: Ciudad[] }>("/ciudades", 60);
  return respuesta.datos;
}

/** GET /eventos/destacados */
export async function obtenerDestacados() {
  const respuesta = await pedir<{ datos: EventoResumen[] }>("/eventos/destacados", 60);
  return respuesta.datos;
}

/**
 * GET /eventos?q=&categoria=&ciudad=&orden=&pagina=...
 * Recibe los parámetros ya armados (ver lib/filtros.ts).
 */
export function buscarEventos(parametros: URLSearchParams) {
  return pedir<{ datos: EventoResumen[]; paginacion: Paginacion }>(
    `/eventos?${parametros.toString()}`,
  );
}
