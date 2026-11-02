import type { Metadata } from "next";
import { VistaPendiente } from "@/componentes/layout/VistaPendiente";
import { obtenerTraductorServidor } from "@/lib/textosServidor";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await obtenerTraductorServidor();
  return {
    title: t("paginas.registro.seo.titulo"),
    description: t("paginas.registro.seo.descripcion"),
  };
}

// Ruta /registro (Crear cuenta). El formulario se construye en un sprint siguiente.
export default function PaginaRegistro() {
  return <VistaPendiente pagina="registro" />;
}
