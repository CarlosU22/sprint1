"use client";

import { SelectorIdioma, type OpcionIdioma } from "@/componentes/ui/SelectorIdioma";
import { useIdioma } from "@/contexto/ProveedorIdioma";

/**
 * Conecta el SelectorIdioma (solo visual) con el contexto de idioma.
 * Se usa en el encabezado y en el menú móvil.
 */
export function CambioIdioma({ className }: { className?: string }) {
  const { t, idioma, cambiarIdioma, cambiando } = useIdioma();

  const opciones: OpcionIdioma[] = [
    { codigo: "es", abreviatura: t("idioma.codigoEs"), nombre: t("idioma.es") },
    { codigo: "en", abreviatura: t("idioma.codigoEn"), nombre: t("idioma.en") },
  ];

  return (
    <SelectorIdioma
      idiomaActual={idioma}
      opciones={opciones}
      etiquetaGrupo={t("navbar.aria.idioma")}
      onCambiar={cambiarIdioma}
      deshabilitado={cambiando}
      className={className}
    />
  );
}
