import type { Metadata } from "next";
import { MarcoSitio } from "@/componentes/layout/MarcoSitio";
import { NoEncontrado } from "@/componentes/layout/NoEncontrado";
import { obtenerTraductorServidor } from "@/lib/textosServidor";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await obtenerTraductorServidor();
  return { title: t("paginas.noEncontrado.seo.titulo") };
}

// Next.js muestra este archivo cuando una ruta no existe (por ejemplo /eventos/algo,
// que se construye en el sprint 2). Vive fuera de los grupos de rutas, así que solo
// tiene el layout raíz: por eso pone él mismo el encabezado y el pie (MarcoSitio).
export default function PaginaNoEncontrada() {
  return (
    <MarcoSitio>
      <NoEncontrado />
    </MarcoSitio>
  );
}
