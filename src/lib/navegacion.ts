/*
 * RUTAS DEL SITIO
 * Un solo lugar con las direcciones de las vistas, para no repetirlas.
 * El texto de cada enlace sale de la API (navbar.enlaces.<clave>, menuMovil.enlaces.<clave>).
 */
export const RUTAS = {
  inicio: "/",
  explorar: "/explorar",
  ingresar: "/ingresar",
  registro: "/registro",
  terminos: "/terminos",
  accesibilidad: "/accesibilidad",
} as const;

/** Enlaces de la navegación principal (encabezado y menú móvil) */
export const ENLACES_PRINCIPALES = [
  { clave: "inicio", href: RUTAS.inicio },
  { clave: "explorar", href: RUTAS.explorar },
];

/** Dirección del detalle de un evento (la vista 3 se construye en el sprint 2) */
export function rutaEvento(slug: string) {
  return `/eventos/${slug}`;
}
