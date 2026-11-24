/*
 * TIPOS DE DATOS DE LA API
 * Son una copia en TypeScript de los "schemas" del contrato OpenAPI de Taquilla.
 * Solo están los que usamos en el proyecto.
 */

export type Idioma = "es" | "en";

export const IDIOMAS: Idioma[] = ["es", "en"];
export const IDIOMA_POR_DEFECTO: Idioma = "es";

/** Objeto anidado de textos: cada hoja es un string (o un plural { uno, otro }). */
export interface TextosAnidados {
  [clave: string]: string | TextosAnidados;
}

/** Respuesta de GET /textos */
export interface RespuestaTextos {
  idioma: Idioma;
  version: string;
  textos: TextosAnidados;
}

/** GET /categorias */
export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
  eventos: number;
}

/** GET /ciudades */
export interface Ciudad {
  nombre: string;
  eventos: number;
}

export interface Recinto {
  nombre: string | null;
  direccion: string | null;
  ciudad: string | null;
  capacidad: number | null;
}

export type PatronAfiche = "liso" | "ondas" | "puntos" | "lineas" | "rombos" | "circulos";

/** El afiche no es una foto: es un degradado de color1 a color2 con un patrón */
export interface Afiche {
  color1: string;
  color2: string;
  patron: PatronAfiche;
}

export interface Disponibilidad {
  aforo: number;
  vendidas: number;
  disponibles: number;
  porcentajeVendido: number;
  agotado: boolean;
  ultimasEntradas: boolean;
}

/** Un evento como llega en las listas (GET /eventos y GET /eventos/destacados) */
export interface EventoResumen {
  id: string;
  slug: string;
  titulo: string;
  categoria: string;
  estado: "borrador" | "publicado" | "finalizado";
  fecha: string; // ISO 8601, en UTC
  numeroFunciones: number;
  recinto: Recinto;
  tipoAforo: "numerado" | "general";
  precioDesde: number;
  afiche: Afiche;
  destacado: boolean;
  disponibilidad: Disponibilidad;
}

export interface Paginacion {
  pagina: number;
  porPagina: number;
  total: number;
  paginas: number;
}

// ---------- Sesión (vistas 4 y 5) ----------

/** La persona que inició sesión */
export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  correoVerificado: boolean;
  rol: string;
}

/** Respuesta de POST /sesion */
export interface RespuestaSesion {
  usuario: Usuario;
  token: string;
}

/** Respuesta de POST /usuarios: la sesión abierta + el código para verificar el correo */
export interface RespuestaRegistro extends RespuestaSesion {
  verificacion: { enviadaA: string; codigoDePrueba?: string };
}

/** Forma de los errores de la API: { error: { codigo, mensaje, campos?, detalles? } } */
export interface ErrorDeApi {
  error: {
    codigo: string;
    mensaje: string;
    campos?: Record<string, string>;
    detalles?: Record<string, unknown>;
  };
}
