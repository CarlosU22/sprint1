import type { CSSProperties } from "react";
import type { Afiche as DatosAfiche } from "@/lib/tipos";
import estilos from "./Afiche.module.css";

interface PropsAfiche {
  afiche: DatosAfiche;
  className?: string;
}

/**
 * La API no manda fotos: cada evento trae un "afiche" con dos colores y un
 * patrón. Aquí lo pintamos con CSS: un degradado de color1 a color2, el
 * patrón encima y los dos círculos decorativos del diseño de Figma.
 *
 * Los colores llegan de la API, así que se pasan como variables CSS en
 * `style` (es la única forma de usar un valor que llega en tiempo de ejecución).
 */
export function Afiche({ afiche, className }: PropsAfiche) {
  const colores = {
    "--afiche-color1": afiche.color1,
    "--afiche-color2": afiche.color2,
  } as CSSProperties;

  return (
    <div
      className={`${estilos.afiche} ${estilos[afiche.patron]} ${className ?? ""}`}
      style={colores}
      aria-hidden="true"
    >
      <span className={estilos.circuloGrande} />
      <span className={estilos.circuloPequeno} />
    </div>
  );
}
