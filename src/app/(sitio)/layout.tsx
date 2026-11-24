import { MarcoSitio } from "@/componentes/layout/MarcoSitio";

/** Layout de las vistas públicas: todas llevan encabezado y pie de página */
export default function LayoutSitio({ children }: LayoutProps<"/">) {
  return <MarcoSitio>{children}</MarcoSitio>;
}
