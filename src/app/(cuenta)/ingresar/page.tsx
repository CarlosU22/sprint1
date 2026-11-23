import type { Metadata } from "next";
import { VistaIngresar } from "@/componentes/ingresar/VistaIngresar";
import { obtenerTraductorServidor } from "@/lib/textosServidor";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await obtenerTraductorServidor();
  return {
    title: t("paginas.ingresar.seo.titulo"),
    description: t("paginas.ingresar.seo.descripcion"),
  };
}

// Ruta /ingresar (vista 4). El envío lo hace la Server Action de ./acciones.ts
export default function PaginaIngresar() {
  return <VistaIngresar />;
}
