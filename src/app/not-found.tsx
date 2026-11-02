import type { Metadata } from "next";
import { NoEncontrado } from "@/componentes/layout/NoEncontrado";
import { obtenerTraductorServidor } from "@/lib/textosServidor";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await obtenerTraductorServidor();
  return { title: t("paginas.noEncontrado.seo.titulo") };
}

// Next.js muestra este archivo cuando una ruta no existe (por ejemplo /eventos/algo,
// que se construye en el sprint 2). Se pinta dentro del layout, con encabezado y pie.
export default function PaginaNoEncontrada() {
  return <NoEncontrado />;
}
