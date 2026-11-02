"use client";

import { EstadoPagina } from "@/componentes/ui/EstadoPagina";
import { useIdioma } from "@/contexto/ProveedorIdioma";

// Next.js muestra este archivo MIENTRAS la página espera los datos de la API.
export default function Cargando() {
  const { t } = useIdioma();
  return (
    <EstadoPagina
      cargando
      titulo={t("estados.cargando.titulo")}
      texto={t("estados.cargando.texto")}
    />
  );
}
