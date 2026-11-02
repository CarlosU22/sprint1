import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps } from "react";
import estilos from "./Boton.module.css";

type Variante = "primario" | "secundario" | "fantasma";
type Tamano = "md" | "sm";

interface PropsComunes {
  variante?: Variante;
  tamano?: Tamano;
  anchoCompleto?: boolean;
}

/** Junta las clases CSS según la variante y el tamaño */
function clasesBoton(
  variante: Variante,
  tamano: Tamano,
  anchoCompleto: boolean,
  extra?: string,
) {
  return [
    estilos.boton,
    estilos[variante],
    estilos[tamano],
    anchoCompleto ? estilos.anchoCompleto : "",
    extra ?? "",
  ]
    .filter(Boolean)
    .join(" ");
}

/** Botón normal (<button>) para acciones: enviar, abrir, cerrar... */
export function Boton({
  variante = "primario",
  tamano = "md",
  anchoCompleto = false,
  className,
  type = "button",
  ...resto
}: PropsComunes & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={clasesBoton(variante, tamano, anchoCompleto, className)}
      {...resto}
    />
  );
}

/** Enlace con forma de botón (<a>) para ir a otra página */
export function BotonEnlace({
  variante = "primario",
  tamano = "md",
  anchoCompleto = false,
  className,
  ...resto
}: PropsComunes & ComponentProps<typeof Link>) {
  return (
    <Link
      className={clasesBoton(variante, tamano, anchoCompleto, className)}
      {...resto}
    />
  );
}
