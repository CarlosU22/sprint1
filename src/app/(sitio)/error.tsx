"use client"; // Los archivos error.tsx siempre son componentes de cliente

import { Boton } from "@/componentes/ui/Boton";
import { EstadoPagina } from "@/componentes/ui/EstadoPagina";
import { useIdioma } from "@/contexto/ProveedorIdioma";

/**
 * Next.js muestra este archivo si una página lanza un error, por ejemplo si
 * la API no responde. `retry` vuelve a pedir los datos y a pintar la página.
 */
export default function ErrorDePagina({ retry }: { error: unknown; retry: () => void }) {
  const { t } = useIdioma();
  return (
    <EstadoPagina
      titulo={t("estados.error.titulo")}
      texto={t("estados.error.texto")}
      accion={
        <Boton onClick={() => retry()}>{t("estados.error.botones.reintentar")}</Boton>
      }
    />
  );
}
