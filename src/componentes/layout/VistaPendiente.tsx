"use client";

import { useIdioma } from "@/contexto/ProveedorIdioma";
import estilos from "./VistaPendiente.module.css";

/**
 * Vista mínima para las rutas que existen en el sprint 1 pero cuyo contenido
 * se construye después (Ingresar y Crear cuenta). Muestra el título y el
 * subtítulo del formulario que llegan de la API en paginas.<pagina>.formulario.
 */
export function VistaPendiente({ pagina }: { pagina: "ingresar" | "registro" }) {
  const { t } = useIdioma();

  return (
    <div className={`contenedor ${estilos.vista}`}>
      <h1 className={estilos.titulo}>{t(`paginas.${pagina}.formulario.titulo`)}</h1>
      <p className={estilos.subtitulo}>{t(`paginas.${pagina}.formulario.subtitulo`)}</p>
    </div>
  );
}
