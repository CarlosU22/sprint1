import type { ReactNode } from "react";
import { PresentacionCuenta } from "./PresentacionCuenta";
import estilos from "./PantallaCuenta.module.css";

/** Las vistas de cuenta y su carpeta de textos en la API (paginas.<pagina>) */
export type PaginaCuenta = "ingresar" | "registro";

interface PropsPantallaCuenta {
  pagina: PaginaCuenta;
  beneficios: readonly string[];
  /** El formulario de la derecha */
  children: ReactNode;
}

/**
 * Pantalla de las vistas de cuenta (Ingresar y Crear cuenta):
 * panel negro a la izquierda y formulario a la derecha, a pantalla completa.
 */
export function PantallaCuenta({ pagina, beneficios, children }: PropsPantallaCuenta) {
  return (
    <div className={estilos.vista}>
      <PresentacionCuenta pagina={pagina} beneficios={beneficios} />
      <div className={estilos.lado}>{children}</div>
    </div>
  );
}
