import type { Metadata } from "next";
import { VistaPendiente } from "@/componentes/layout/VistaPendiente";
import { obtenerTraductorServidor } from "@/lib/textosServidor";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await obtenerTraductorServidor();
  return {
    title: t("paginas.recuperarClave.seo.titulo"),
    description: t("paginas.recuperarClave.seo.descripcion"),
  };
}

// Ruta /recuperar-clave: el enlace "¿Olvidaste tu contraseña?" de Ingresar lleva aquí.
// Los pasos para restablecer la contraseña (POST /recuperacion) se construyen después.
export default function PaginaRecuperarClave() {
  return (
    <VistaPendiente
      titulo="paginas.recuperarClave.solicitud.titulo"
      texto="paginas.recuperarClave.solicitud.texto"
    />
  );
}
