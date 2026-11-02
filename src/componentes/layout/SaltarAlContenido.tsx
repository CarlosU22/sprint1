"use client";

import { useIdioma } from "@/contexto/ProveedorIdioma";

/**
 * Enlace "Saltar al contenido principal".
 * Es lo primero que se enfoca con Tab: permite a quien usa teclado o lector
 * de pantalla saltarse la navegación e ir directo al <main id="contenido">.
 */
export function SaltarAlContenido() {
  const { t } = useIdioma();
  return (
    <a href="#contenido" className="saltar-contenido">
      {t("general.aria.saltarAlContenido")}
    </a>
  );
}
