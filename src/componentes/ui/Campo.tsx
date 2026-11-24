import type { InputHTMLAttributes, ReactNode, Ref, SelectHTMLAttributes } from "react";
import estilos from "./Campo.module.css";

interface PropsCampo extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  /** Llega al <input> (en React 19 `ref` es una prop normal). Sirve para darle el foco */
  ref?: Ref<HTMLInputElement>;
  etiqueta: string;
  /** Si es true, la etiqueta solo la leen los lectores de pantalla */
  ocultarEtiqueta?: boolean;
  icono?: ReactNode;
  /** Mensaje de error debajo del campo. Si hay, el borde se pone rojo */
  error?: string;
  /** Algo clicable dentro del campo, a la derecha (por ejemplo, el ojo de la contraseña) */
  accion?: ReactNode;
  /** Ayuda debajo del campo ("Sin puntos ni espacios"). El lector de pantalla la lee al entrar */
  ayuda?: ReactNode;
}

/** Campo de texto con su etiqueta (<label> + <input>) */
export function Campo({
  id,
  etiqueta,
  ocultarEtiqueta = false,
  icono,
  error,
  accion,
  ayuda,
  className,
  ...resto
}: PropsCampo) {
  const idError = `${id}-error`;
  const idAyuda = `${id}-ayuda`;
  // El campo se "describe" con su ayuda y su error (los dos, si hay)
  const descripcion = [ayuda && idAyuda, error && idError].filter(Boolean).join(" ");

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
        <input
          id={id}
          className={`${estilos.control} ${accion ? estilos.conAccion : ""}`}
          // Los lectores de pantalla anuncian "inválido" y leen el mensaje de error
          aria-invalid={error ? true : undefined}
          aria-describedby={descripcion || undefined}
          {...resto}
        />
        {accion && <span className={estilos.accion}>{accion}</span>}
      </div>
      {ayuda && (
        <div id={idAyuda} className={estilos.ayuda}>
          {ayuda}
        </div>
      )}
      {error && (
        <p id={idError} className={estilos.error}>
          {error}
        </p>
      )}
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
