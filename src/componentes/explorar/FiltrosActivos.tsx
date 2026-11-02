"use client";

import { X } from "lucide-react";
import { useIdioma } from "@/contexto/ProveedorIdioma";
import { formatearPrecio } from "@/lib/formatos";
import type { FiltrosExplorar } from "@/lib/filtros";
import estilos from "./FiltrosActivos.module.css";

interface PropsFiltrosActivos {
  filtros: FiltrosExplorar;
  navegar: (cambios: Partial<FiltrosExplorar>) => void;
}

/** Chips con los filtros puestos, como "Conciertos ×". La × quita ese filtro. */
export function FiltrosActivos({ filtros, navegar }: PropsFiltrosActivos) {
  const { t } = useIdioma();

  // Armamos la lista: texto del chip + qué cambio hace al quitarlo
  const chips: { clave: string; texto: string; quitar: Partial<FiltrosExplorar> }[] = [];

  if (filtros.categoria) {
    chips.push({
      clave: "categoria",
      texto: t(`general.categorias.${filtros.categoria}`),
      quitar: { categoria: "" },
    });
  }
  if (filtros.fecha) {
    chips.push({
      clave: "fecha",
      texto: t(`paginas.explorar.filtros.fecha.${filtros.fecha}`),
      quitar: { fecha: "" },
    });
  }
  if (filtros.ciudad) {
    chips.push({ clave: "ciudad", texto: filtros.ciudad, quitar: { ciudad: "" } });
  }
  if (filtros.q) {
    chips.push({ clave: "q", texto: `“${filtros.q}”`, quitar: { q: "" } });
  }
  if (filtros.precioMax !== null) {
    chips.push({
      clave: "precio",
      texto: `${t("paginas.explorar.filtros.precio")}: ${formatearPrecio(filtros.precioMax)}`,
      quitar: { precioMax: null },
    });
  }

  if (chips.length === 0) return null;

  return (
    <ul className={estilos.chips}>
      {chips.map((chip) => (
        <li key={chip.clave}>
          <button
            type="button"
            className={estilos.chip}
            aria-label={`${t("general.acciones.eliminar")}: ${chip.texto}`}
            onClick={() => navegar(chip.quitar)}
          >
            {chip.texto}
            <X aria-hidden="true" />
          </button>
        </li>
      ))}
    </ul>
  );
}
