"use client";

/*
 * CONTEXTO DE IDIOMA Y TEXTOS
 *
 * Un "contexto" de React sirve para compartir datos con TODOS los componentes
 * sin tener que pasarlos por props nivel por nivel.
 *
 * El layout (servidor) pide los textos a la API y se los entrega a este
 * proveedor. Cualquier componente de cliente puede leerlos con:
 *
 *   const { t } = useIdioma();
 *   t("navbar.enlaces.inicio")
 */
import { createContext, useContext, useMemo, type ReactNode } from "react";
import { crearTraductor } from "@/lib/textos";
import type { Idioma, TextosAnidados } from "@/lib/tipos";

interface ValorIdioma {
  idioma: Idioma;
  textos: TextosAnidados;
  t: ReturnType<typeof crearTraductor>["t"];
  tPlural: ReturnType<typeof crearTraductor>["tPlural"];
}

const ContextoIdioma = createContext<ValorIdioma | null>(null);

interface PropsProveedor {
  idioma: Idioma;
  textos: TextosAnidados;
  children: ReactNode;
}

export function ProveedorIdioma({ idioma, textos, children }: PropsProveedor) {
  // useMemo: solo volvemos a crear el traductor si cambian los textos
  const valor = useMemo(
    () => ({ idioma, textos, ...crearTraductor(textos) }),
    [idioma, textos],
  );

  return <ContextoIdioma.Provider value={valor}>{children}</ContextoIdioma.Provider>;
}

/** Hook para leer el idioma y los textos desde cualquier componente de cliente */
export function useIdioma() {
  const valor = useContext(ContextoIdioma);
  if (!valor) {
    throw new Error("useIdioma debe usarse dentro de <ProveedorIdioma>");
  }
  return valor;
}
