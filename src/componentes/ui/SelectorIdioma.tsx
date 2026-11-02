import type { Idioma } from "@/lib/tipos";
import estilos from "./SelectorIdioma.module.css";

export interface OpcionIdioma {
  codigo: Idioma;
  /** Lo que se ve en el botón: "ES" o "EN" */
  abreviatura: string;
  /** Nombre completo para lectores de pantalla: "Español" o "English" */
  nombre: string;
}

interface PropsSelectorIdioma {
  idiomaActual: Idioma;
  opciones: OpcionIdioma[];
  /** Texto para lectores de pantalla, por ejemplo "Cambiar idioma" */
  etiquetaGrupo: string;
  onCambiar: (idioma: Idioma) => void;
  deshabilitado?: boolean;
  /** "claro" para el encabezado blanco y para el menú móvil */
  className?: string;
}

/**
 * Selector ES | EN.
 * Es un componente "de presentación": solo muestra los botones y avisa con
 * onCambiar. Quien lo usa decide qué hacer (ver contexto/ProveedorIdioma.tsx).
 */
export function SelectorIdioma({
  idiomaActual,
  opciones,
  etiquetaGrupo,
  onCambiar,
  deshabilitado = false,
  className,
}: PropsSelectorIdioma) {
  return (
    <div
      role="group"
      aria-label={etiquetaGrupo}
      className={`${estilos.selector} ${className ?? ""}`}
    >
      {opciones.map((opcion) => {
        const activo = opcion.codigo === idiomaActual;
        return (
          <button
            key={opcion.codigo}
            type="button"
            lang={opcion.codigo}
            aria-pressed={activo}
            disabled={deshabilitado}
            className={`${estilos.opcion} ${activo ? estilos.activa : ""}`}
            onClick={() => {
              if (!activo) onCambiar(opcion.codigo);
            }}
          >
            <span aria-hidden="true">{opcion.abreviatura}</span>
            <span className="solo-lectores">{opcion.nombre}</span>
          </button>
        );
      })}
    </div>
  );
}
