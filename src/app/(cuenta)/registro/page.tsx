import type { Metadata } from "next";
import { PantallaCuenta } from "@/componentes/cuenta/PantallaCuenta";
import { FormularioRegistro } from "@/componentes/registro/FormularioRegistro";
import { obtenerTraductorServidor } from "@/lib/textosServidor";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await obtenerTraductorServidor();
  return {
    title: t("paginas.registro.seo.titulo"),
    description: t("paginas.registro.seo.descripcion"),
  };
}

/** Claves de paginas.registro.presentacion.beneficios */
const BENEFICIOS = ["unaCuenta", "dispositivos", "recupera"] as const;

// Ruta /registro (vista 5). El envío lo hace la Server Action de ./acciones.ts
export default function PaginaRegistro() {
  return (
    <PantallaCuenta pagina="registro" beneficios={BENEFICIOS}>
      <FormularioRegistro />
    </PantallaCuenta>
  );
}
