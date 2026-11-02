import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

// Fuente del sitio. Next.js la descarga en el build y la sirve desde nuestro dominio.
const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Taquilla",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={geist.variable}>
      <body>{children}</body>
    </html>
  );
}
