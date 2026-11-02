import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import estilos from "./Campo.module.css";

interface PropsCampo extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  etiqueta: string;
  /** Si es true, la etiqueta solo la leen los lectores de pantalla */
  ocultarEtiqueta?: boolean;
  icono?: ReactNode;
}

/** Campo de texto con su etiqueta (<label> + <input>) */
export function Campo({
  id,
  etiqueta,
  ocultarEtiqueta = false,
  icono,
  className,
  ...resto
}: PropsCampo) {
  return (
    <div className={`${estilos.campo} ${className ?? ""}`}>
      <label
        htmlFor={id}
        className={ocultarEtiqueta ? "solo-lectores" : estilos.etiqueta}
      >
        {etiqueta}
      </label>
      <div className={estilos.caja}>
        {icono && (
          <span className={estilos.icono} aria-hidden="true">
            {icono}
          </span>
        )}
        <input id={id} className={estilos.control} {...resto} />
      </div>
    </div>
  );
}

interface PropsCampoSelect extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  etiqueta: string;
  ocultarEtiqueta?: boolean;
  children: ReactNode;
}

/** Lista desplegable con su etiqueta (<label> + <select>) */
export function CampoSelect({
  id,
  etiqueta,
  ocultarEtiqueta = false,
  className,
  children,
  ...resto
}: PropsCampoSelect) {
  return (
    <div className={`${estilos.campo} ${className ?? ""}`}>
      <label
        htmlFor={id}
        className={ocultarEtiqueta ? "solo-lectores" : estilos.etiqueta}
      >
        {etiqueta}
      </label>
      <select id={id} className={`${estilos.control} ${estilos.select}`} {...resto}>
        {children}
      </select>
    </div>
  );
}
