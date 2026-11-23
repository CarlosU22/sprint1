import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ControlCookies } from "@/componentes/layout/ControlCookies";
import { SaltarAlContenido } from "@/componentes/layout/SaltarAlContenido";
import { ProveedorAccesibilidad } from "@/contexto/ProveedorAccesibilidad";
import { ProveedorIdioma } from "@/contexto/ProveedorIdioma";
import { obtenerConsentimiento } from "@/lib/cookiesServidor";
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
 * Envuelve TODAS las páginas. Aquí van las piezas que comparten todas las
 * vistas: los "proveedores" de contexto, "Saltar al contenido" y el aviso de cookies.
 *
 * El encabezado y el pie NO van aquí: los pone el layout de cada grupo de rutas.
 *   - app/(sitio)/layout.tsx  → con encabezado y pie (Inicio, Explorar…)
 *   - app/(cuenta)/layout.tsx → pantalla completa, sin ellos (Ingresar)
 * Los paréntesis hacen que el nombre del grupo no aparezca en la URL.
 */
export default async function RootLayout({ children }: LayoutProps<"/">) {
  // 1. Pedimos los textos de la interfaz a la API (en el servidor)
  const { idioma, textos } = await obtenerTraductorServidor();
  // ¿Ya decidió sobre las cookies? Si no, se muestra el aviso
  const consentimiento = await obtenerConsentimiento();

  return (
    <html lang={idioma} className={geist.variable}>
      <body>
        {/* 2. Los entregamos al contexto para que los usen los componentes de cliente */}
        <ProveedorIdioma idioma={idioma} textos={textos}>
          <ProveedorAccesibilidad>
            {/* Primer elemento con Tab: permite saltarse la navegación */}
            <SaltarAlContenido />
            {/* El aviso va al inicio del HTML para llegar a él rápido con Tab;
                con CSS se ve abajo, flotando */}
            <ControlCookies mostrarAviso={consentimiento === null} />
            {/* Aquí se pinta el layout del grupo (sitio o cuenta) con su página */}
            {children}
          </ProveedorAccesibilidad>
        </ProveedorIdioma>
      </body>
    </html>
  );
}
