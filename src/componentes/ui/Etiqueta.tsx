import type { ReactNode } from "react";
import estilos from "./Etiqueta.module.css";

interface PropsEtiqueta {
  children: ReactNode;
  /** "gris" para tarjetas, "blanca" para fondos oscuros como el hero */
  variante?: "gris" | "blanca";
}

/** Etiqueta pequeña, por ejemplo "Concierto" o "Destacado" */
export function Etiqueta({ children, variante = "gris" }: PropsEtiqueta) {
  return <span className={`${estilos.etiqueta} ${estilos[variante]}`}>{children}</span>;
}
