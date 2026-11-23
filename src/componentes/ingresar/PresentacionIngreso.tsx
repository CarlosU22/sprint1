"use client";

import { Check } from "lucide-react";
import { Logo } from "@/componentes/layout/Logo";
import { useIdioma } from "@/contexto/ProveedorIdioma";
import estilos from "./PresentacionIngreso.module.css";

/** Las claves de paginas.ingresar.presentacion.beneficios, en el orden de Figma */
const BENEFICIOS = ["descubre", "filtra", "consulta"];

/**
 * Panel negro de la izquierda: logo, lema y beneficios.
 * Es decorativo para quien ya sabe a qué viene, por eso en móvil se oculta
 * y el formulario queda primero.
 */
export function PresentacionIngreso() {
  const { t } = useIdioma();

  return (
    <aside className={estilos.presentacion}>
      <Logo tema="claro" />

      <div className={estilos.contenido}>
        <p className={estilos.lema}>{t("paginas.ingresar.presentacion.lema")}</p>
        <ul className={estilos.beneficios}>
          {BENEFICIOS.map((clave) => (
            <li key={clave}>
              <span className={estilos.marca} aria-hidden="true">
                <Check />
              </span>
              {t(`paginas.ingresar.presentacion.beneficios.${clave}`)}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
