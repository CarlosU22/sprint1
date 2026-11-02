import type { Metadata } from "next";
import { VistaPendiente } from "@/componentes/layout/VistaPendiente";
import { obtenerTraductorServidor } from "@/lib/textosServidor";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await obtenerTraductorServidor();
  return {
    title: t("paginas.ingresar.seo.titulo"),
    description: t("paginas.ingresar.seo.descripcion"),
  };
}

// Ruta /ingresar. El formulario se construye en un sprint siguiente.
export default function PaginaIngresar() {
  return <VistaPendiente pagina="ingresar" />;
}
