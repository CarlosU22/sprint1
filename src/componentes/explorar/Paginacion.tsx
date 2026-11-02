"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useIdioma } from "@/contexto/ProveedorIdioma";
import { crearUrlExplorar, type FiltrosExplorar } from "@/lib/filtros";
import estilos from "./Paginacion.module.css";

interface PropsPaginacion {
  filtros: FiltrosExplorar;
  totalPaginas: number;
}

/**
 * Decide qué números mostrar. Ejemplo con 6 páginas estando en la 1:
 *   1 2 3 … 6
 * Siempre se ven la primera, la última, la actual y sus vecinas.
 */
function calcularPaginas(actual: number, total: number): (number | "…")[] {
  const visibles = new Set([1, total, actual - 1, actual, actual + 1]);
  if (actual <= 2) visibles.add(3); // al inicio mostramos 1 2 3
  if (actual >= total - 1) visibles.add(total - 2); // al final, las tres últimas

  const ordenadas = [...visibles]
    .filter((n) => n >= 1 && n <= total)
    .sort((a, b) => a - b);

  const resultado: (number | "…")[] = [];
  ordenadas.forEach((numero, i) => {
    // Si hay un hueco entre dos números, ponemos puntos suspensivos
    if (i > 0 && numero - ordenadas[i - 1] > 1) resultado.push("…");
    resultado.push(numero);
  });
  return resultado;
}

/**
 * Paginación. Son ENLACES (no botones): cada página tiene su propia URL,
 * así se puede abrir en otra pestaña o compartir.
 */
export function Paginacion({ filtros, totalPaginas }: PropsPaginacion) {
  const { t } = useIdioma();
  const actual = filtros.pagina;

  if (totalPaginas <= 1) return null;

  const url = (pagina: number) => crearUrlExplorar(filtros, { pagina });

  return (
    <nav
      aria-label={t("componentes.paginacion.aria.etiqueta")}
      className={estilos.paginacion}
    >
      <ul className={estilos.lista}>
        <li>
          {actual > 1 ? (
            <Link
              href={url(actual - 1)}
              className={estilos.flecha}
              aria-label={t("componentes.paginacion.aria.anterior")}
            >
              <ChevronLeft aria-hidden="true" />
            </Link>
          ) : (
            <span
              className={`${estilos.flecha} ${estilos.deshabilitado}`}
              aria-hidden="true"
            >
              <ChevronLeft />
            </span>
          )}
        </li>

        {calcularPaginas(actual, totalPaginas).map((numero, i) =>
          numero === "…" ? (
            <li key={`puntos-${i}`} className={estilos.puntos} aria-hidden="true">
              …
            </li>
          ) : (
            <li key={numero}>
              <Link
                href={url(numero)}
                className={estilos.numero}
                aria-current={numero === actual ? "page" : undefined}
                aria-label={
                  numero === actual
                    ? t("componentes.paginacion.aria.paginaActual", { numero })
                    : t("componentes.paginacion.aria.irAPagina", { numero })
                }
              >
                {numero}
              </Link>
            </li>
          ),
        )}

        <li>
          {actual < totalPaginas ? (
            <Link
              href={url(actual + 1)}
              className={estilos.flecha}
              aria-label={t("componentes.paginacion.aria.siguiente")}
            >
              <ChevronRight aria-hidden="true" />
            </Link>
          ) : (
            <span
              className={`${estilos.flecha} ${estilos.deshabilitado}`}
              aria-hidden="true"
            >
              <ChevronRight />
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
