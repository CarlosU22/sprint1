"use client";

import { Check } from "lucide-react";
import { Logo } from "@/componentes/layout/Logo";
import { useIdioma } from "@/contexto/ProveedorIdioma";
import type { PaginaCuenta } from "./PantallaCuenta";
import estilos from "./PresentacionCuenta.module.css";

interface PropsPresentacion {
  pagina: PaginaCuenta;
  /** Claves de paginas.<pagina>.presentacion.beneficios, en el orden del diseño */
  beneficios: readonly string[];
}

/**
 * Panel negro de la izquierda: logo, lema y beneficios.
 * Lo comparten Ingresar y Crear cuenta; cada una trae sus textos de
 * paginas.<pagina>.presentacion. En móvil se oculta y el formulario queda primero.
 */
export function PresentacionCuenta({ pagina, beneficios }: PropsPresentacion) {
  const { t } = useIdioma();

  return (
    <aside className={estilos.presentacion}>
      <Logo tema="claro" />

      <div className={estilos.contenido}>
        <p className={estilos.lema}>{t(`paginas.${pagina}.presentacion.lema`)}</p>
        <ul className={estilos.beneficios}>
          {beneficios.map((clave) => (
            <li key={clave}>
              <span className={estilos.marca} aria-hidden="true">
                <Check />
              </span>
              {t(`paginas.${pagina}.presentacion.beneficios.${clave}`)}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
