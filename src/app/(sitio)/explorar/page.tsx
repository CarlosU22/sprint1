import type { Metadata } from "next";
import { VistaExplorar } from "@/componentes/explorar/VistaExplorar";
import { buscarEventos, obtenerCategorias, obtenerCiudades } from "@/lib/api";
import { crearParametrosApi, leerFiltros } from "@/lib/filtros";
import { obtenerTraductorServidor } from "@/lib/textosServidor";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await obtenerTraductorServidor();
  return {
    title: t("paginas.explorar.seo.titulo"),
    description: t("paginas.explorar.seo.descripcion"),
  };
}

/**
 * VISTA 2 · EXPLORAR EVENTOS (ruta "/explorar")
 *
 * `searchParams` son los parámetros de la URL (?categoria=teatro&pagina=2...).
 * Cada vez que cambian, Next.js vuelve a ejecutar esta función en el servidor.
 */
export default async function PaginaExplorar({ searchParams }: PageProps<"/explorar">) {
  // 1. URL → objeto con los filtros (lo inválido se ignora)
  const filtros = leerFiltros(await searchParams);

  // 2. Pedimos todo a la API al mismo tiempo
  const [resultado, categorias, ciudades] = await Promise.all([
    buscarEventos(crearParametrosApi(filtros)),
    obtenerCategorias(),
    obtenerCiudades(),
  ]);

  // 3. Le pasamos los datos a la parte de cliente (la que tiene interactividad)
  return (
    <VistaExplorar
      filtros={filtros}
      eventos={resultado.datos}
      paginacion={resultado.paginacion}
      categorias={categorias}
      ciudades={ciudades}
    />
  );
}
