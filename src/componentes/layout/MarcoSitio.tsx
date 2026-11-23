import type { ReactNode } from "react";
import { Encabezado } from "./Encabezado";
import { PieDePagina } from "./PieDePagina";

/**
 * Encabezado + <main> + pie de página.
 * Lo usan el layout del grupo (sitio) y la página 404, que vive fuera de los grupos.
 */
export function MarcoSitio({ children }: { children: ReactNode }) {
  return (
    <>
      <Encabezado />
      {/* tabIndex={-1}: permite mover el foco aquí desde el código */}
      <main id="contenido" tabIndex={-1}>
        {children}
      </main>
      <PieDePagina />
    </>
  );
}
