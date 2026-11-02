import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Encabezado } from "@/componentes/layout/Encabezado";
import { PieDePagina } from "@/componentes/layout/PieDePagina";
import { SaltarAlContenido } from "@/componentes/layout/SaltarAlContenido";
import { ProveedorAccesibilidad } from "@/contexto/ProveedorAccesibilidad";
import { ProveedorIdioma } from "@/contexto/ProveedorIdioma";
import { obtenerTraductorServidor } from "@/lib/textosServidor";
import "./globals.css";

// Fuente del sitio. Next.js la descarga en el build y la sirve desde nuestro dominio.
const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// <title> y descripción por defecto. Cada página puede cambiarlos con su propio generateMetadata.
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await obtenerTraductorServidor();
  return {
    title: t("paginas.inicio.seo.titulo"),
    description: t("paginas.inicio.seo.descripcion"),
  };
}

/**
 * LAYOUT RAÍZ
 * Envuelve TODAS las páginas. Aquí van las piezas que se repiten en todas
 * las vistas: encabezado, pie de página y los "proveedores" de contexto.
 */
export default async function RootLayout({ children }: LayoutProps<"/">) {
  // 1. Pedimos los textos de la interfaz a la API (en el servidor)
  const { idioma, textos } = await obtenerTraductorServidor();

  return (
    <html lang={idioma} className={geist.variable}>
      <body>
        {/* 2. Los entregamos al contexto para que los usen los componentes de cliente */}
        <ProveedorIdioma idioma={idioma} textos={textos}>
          <ProveedorAccesibilidad>
            {/* Primer elemento con Tab: permite saltarse la navegación */}
            <SaltarAlContenido />
            <Encabezado />
            {/* Cada page.tsx se pinta aquí, dentro de <main> */}
            <main id="contenido">{children}</main>
            <PieDePagina />
          </ProveedorAccesibilidad>
        </ProveedorIdioma>
      </body>
    </html>
  );
}
