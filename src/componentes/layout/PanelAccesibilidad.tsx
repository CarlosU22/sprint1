"use client";

import { Accessibility, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useIdioma } from "@/contexto/ProveedorIdioma";
import { OpcionesAccesibilidad } from "./OpcionesAccesibilidad";
import estilos from "./PanelAccesibilidad.module.css";

/**
 * Botón de la barra + panel flotante de accesibilidad (solo escritorio).
 * - Se cierra con Escape, con la X o haciendo clic por fuera.
 * - Al cerrarse, el foco vuelve al botón que lo abrió.
 */
export function PanelAccesibilidad() {
  const { t } = useIdioma();
  const [abierto, setAbierto] = useState(false);
  const contenedorRef = useRef<HTMLDivElement>(null);
  const botonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  function cerrar() {
    setAbierto(false);
    botonRef.current?.focus();
  }

  useEffect(() => {
    if (!abierto) return;

    // Al abrir, movemos el foco al panel para que el teclado siga desde ahí
    panelRef.current?.focus();

    function alPresionarTecla(evento: KeyboardEvent) {
      if (evento.key === "Escape") {
        setAbierto(false);
        botonRef.current?.focus();
      }
    }

    function alHacerClic(evento: MouseEvent) {
      const objetivo = evento.target as Node;
      if (!contenedorRef.current?.contains(objetivo)) setAbierto(false);
    }

    document.addEventListener("keydown", alPresionarTecla);
    document.addEventListener("mousedown", alHacerClic);

    // Limpieza: quitamos los "escuchadores" cuando el panel se cierra
    return () => {
      document.removeEventListener("keydown", alPresionarTecla);
      document.removeEventListener("mousedown", alHacerClic);
    };
  }, [abierto]);

  return (
    <div className={estilos.contenedor} ref={contenedorRef}>
      <button
        ref={botonRef}
        type="button"
        className={estilos.boton}
        aria-label={t("navbar.aria.accesibilidad")}
        aria-expanded={abierto}
        aria-controls="panel-accesibilidad"
        onClick={() => setAbierto(!abierto)}
      >
        <Accessibility aria-hidden="true" />
      </button>

      {abierto && (
        <div
          id="panel-accesibilidad"
          ref={panelRef}
          role="dialog"
          aria-labelledby="panel-accesibilidad-titulo"
          tabIndex={-1}
          className={estilos.panel}
        >
          <div className={estilos.cabecera}>
            <h2 id="panel-accesibilidad-titulo" className={estilos.titulo}>
              {t("accesibilidad.titulo")}
            </h2>
            <button
              type="button"
              className={estilos.cerrar}
              aria-label={t("general.aria.cerrarDialogo")}
              onClick={cerrar}
            >
              <X aria-hidden="true" />
            </button>
          </div>
          <OpcionesAccesibilidad />
        </div>
      )}
    </div>
  );
}
