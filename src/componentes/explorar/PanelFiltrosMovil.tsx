"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { Boton } from "@/componentes/ui/Boton";
import { useIdioma } from "@/contexto/ProveedorIdioma";
import estilos from "./PanelFiltrosMovil.module.css";

interface PropsPanelFiltrosMovil {
  total: number;
  cantidadActivos: number;
  children: ReactNode;
}

/**
 * En móvil los filtros se abren en un panel ("Filtros abiertos" en Figma).
 * Igual que el menú móvil, usa <dialog>: Escape cierra y el foco queda dentro.
 * Los filtros se aplican al momento; "Ver N eventos" solo cierra el panel.
 */
export function PanelFiltrosMovil({
  total,
  cantidadActivos,
  children,
}: PropsPanelFiltrosMovil) {
  const { t } = useIdioma();
  const dialogoRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Boton
        variante="secundario"
        className={estilos.abrir}
        aria-haspopup="dialog"
        onClick={() => dialogoRef.current?.showModal()}
      >
        <SlidersHorizontal aria-hidden="true" />
        {t("paginas.explorar.filtros.titulo")}
        {cantidadActivos > 0 && (
          <span className={estilos.contador}>{cantidadActivos}</span>
        )}
      </Boton>

      <dialog
        ref={dialogoRef}
        className={estilos.dialogo}
        aria-label={t("paginas.explorar.filtros.titulo")}
        onClick={(evento) => {
          if (evento.target === dialogoRef.current) dialogoRef.current.close();
        }}
      >
        <div className={estilos.panel}>
          <button
            type="button"
            className={estilos.cerrar}
            aria-label={t("general.aria.cerrarDialogo")}
            onClick={() => dialogoRef.current?.close()}
          >
            <X aria-hidden="true" />
          </button>

          <div className={estilos.contenido}>{children}</div>

          <div className={estilos.pie}>
            <Boton anchoCompleto onClick={() => dialogoRef.current?.close()}>
              {t("paginas.explorar.filtros.botones.verResultados", { cantidad: total })}
            </Boton>
          </div>
        </div>
      </dialog>
    </>
  );
}
