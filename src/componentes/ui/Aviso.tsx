import { CircleAlert } from "lucide-react";
import type { Ref } from "react";
import estilos from "./Aviso.module.css";

interface PropsAviso {
  titulo: string;
  texto: string;
  /** Para mover el foco al aviso cuando aparece */
  ref?: Ref<HTMLDivElement>;
}

/**
 * Caja roja de error con ícono, título y texto
 * ("Revisa los campos marcados", "No pudimos conectarnos"…).
 * role="alert": el lector de pantalla lo lee apenas aparece.
 */
export function Aviso({ titulo, texto, ref }: PropsAviso) {
  return (
    <div ref={ref} role="alert" tabIndex={-1} className={estilos.aviso}>
      <CircleAlert aria-hidden="true" className={estilos.icono} />
      <div>
        <p className={estilos.titulo}>{titulo}</p>
        <p className={estilos.texto}>{texto}</p>
      </div>
    </div>
  );
}
