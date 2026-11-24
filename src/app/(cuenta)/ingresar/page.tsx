import type { Metadata } from "next";
import { PantallaCuenta } from "@/componentes/cuenta/PantallaCuenta";
import { FormularioIngreso } from "@/componentes/ingresar/FormularioIngreso";
import { obtenerTraductorServidor } from "@/lib/textosServidor";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await obtenerTraductorServidor();
  return {
    title: t("paginas.ingresar.seo.titulo"),
    description: t("paginas.ingresar.seo.descripcion"),
  };
}

/** Claves de paginas.ingresar.presentacion.beneficios, en el orden de Figma */
const BENEFICIOS = ["descubre", "filtra", "consulta"] as const;

// Ruta /ingresar (vista 4). El envío lo hace la Server Action de ./acciones.ts
export default function PaginaIngresar() {
  return (
    <PantallaCuenta pagina="ingresar" beneficios={BENEFICIOS}>
      <FormularioIngreso />
    </PantallaCuenta>
  );
}
