"use client";

import { BotonEnlace } from "@/componentes/ui/Boton";
import { useIdioma } from "@/contexto/ProveedorIdioma";
import { RUTAS } from "@/lib/navegacion";
import estilos from "./VistaPendiente.module.css";

/** Contenido de la página 404 (textos de paginas.noEncontrado) */
export function NoEncontrado() {
  const { t } = useIdioma();

  return (
    <div className={`contenedor ${estilos.vista}`}>
      <h1 className={estilos.titulo}>{t("paginas.noEncontrado.contenido.titulo")}</h1>
      <p className={estilos.subtitulo}>{t("paginas.noEncontrado.contenido.texto")}</p>
      <div>
        <BotonEnlace href={RUTAS.inicio}>
          {t("paginas.noEncontrado.contenido.botones.volverInicio")}
        </BotonEnlace>
      </div>
    </div>
  );
}
