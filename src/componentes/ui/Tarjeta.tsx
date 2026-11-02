import type { ReactNode } from "react";
import estilos from "./Tarjeta.module.css";

interface PropsTarjeta {
  children: ReactNode;
  className?: string;
  /** Etiqueta HTML que se usa: "article" para eventos, "div" para lo demás */
  como?: "div" | "article" | "li";
}

/** Caja blanca con borde y esquinas redondeadas. Base de las tarjetas del sitio. */
export function Tarjeta({ children, className, como: Elemento = "div" }: PropsTarjeta) {
  return (
    <Elemento className={`${estilos.tarjeta} ${className ?? ""}`}>{children}</Elemento>
  );
}
