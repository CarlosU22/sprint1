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
  RespuestaSesion,
  RespuestaTextos,
} from "./tipos";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/** Error que lanzamos cuando la API responde con un código 4xx o 5xx */
export class ErrorApi extends Error {
  codigo: string;
  estado: number;
  /** Con 422 `validacion`: el mensaje de cada campo, por ejemplo { correo: "..." } */
  campos?: Record<string, string>;
  /** Con 429: cuántos segundos hay que esperar (cabecera Retry-After) */
  esperarSegundos?: number;

  constructor(codigo: string, mensaje: string, estado: number) {
    super(mensaje);
    this.codigo = codigo;
    this.estado = estado;
  }
}

/** Convierte una respuesta 4xx o 5xx en un ErrorApi */
async function crearErrorApi(respuesta: Response) {
  // La API siempre manda { error: { codigo, mensaje } }, pero por si acaso
  // ponemos valores por defecto si el cuerpo no es JSON.
  const cuerpo = (await respuesta.json().catch(() => null)) as ErrorDeApi | null;
  const error = new ErrorApi(
    cuerpo?.error.codigo ?? "error_interno",
    cuerpo?.error.mensaje ?? respuesta.statusText,
    respuesta.status,
  );
  error.campos = cuerpo?.error.campos;

  const esperar = Number(respuesta.headers.get("Retry-After"));
  if (esperar > 0) error.esperarSegundos = esperar;

  return error;
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

  if (!respuesta.ok) throw await crearErrorApi(respuesta);

  return (await respuesta.json()) as T;
}

/**
 * Igual que pedir(), pero ENVÍA datos (POST con un cuerpo JSON).
 * Nunca se guarda en caché: cada envío llega a la API.
 * Si no hay red, fetch() lanza un TypeError (no un ErrorApi): quien llama
 * lo usa para mostrar el error de conexión.
 */
async function enviar<T>(ruta: string, cuerpo: unknown): Promise<T> {
  if (!API_URL) {
    throw new Error("Falta la variable de entorno NEXT_PUBLIC_API_URL");
  }

  const respuesta = await fetch(`${API_URL}${ruta}`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(cuerpo),
    cache: "no-store",
  });

  if (!respuesta.ok) throw await crearErrorApi(respuesta);

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

// ---------- Sesión (vista 4) ----------

/**
 * POST /sesion  →  { usuario, token }
 * Se llama SOLO desde el servidor (la Server Action de Ingresar), para que el
 * token nunca pase por el navegador.
 */
export function crearSesion(correo: string, clave: string) {
  return enviar<RespuestaSesion>("/sesion", { correo, clave });
}
