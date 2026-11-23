import { Hero } from "@/componentes/inicio/Hero";
import { ListaCategorias } from "@/componentes/inicio/ListaCategorias";
import { SeccionEventos } from "@/componentes/inicio/SeccionEventos";
import {
  buscarEventos,
  obtenerCategorias,
  obtenerCiudades,
  obtenerDestacados,
} from "@/lib/api";
import { RUTAS } from "@/lib/navegacion";

/**
 * VISTA 1 · INICIO PÚBLICO (ruta "/")
 *
 * Es un componente de servidor: pide los datos a la API ANTES de mandar la
 * página al navegador, y se los pasa a los componentes como props.
 */
export default async function PaginaInicio() {
  // Promise.all hace las tres peticiones al mismo tiempo (no una tras otra)
  const [destacados, categorias, ciudades] = await Promise.all([
    obtenerDestacados(),
    obtenerCategorias(),
    obtenerCiudades(),
  ]);

  // La ciudad con más eventos (la API las ordena de más a menos)
  const ciudadPrincipal = ciudades[0]?.nombre ?? "";

  // "Próximamente en <ciudad>": los 4 eventos más cercanos en fecha de esa ciudad
  const proximos = ciudadPrincipal
    ? await buscarEventos(
        new URLSearchParams({ ciudad: ciudadPrincipal, orden: "fecha", porPagina: "4" }),
      )
    : null;

  return (
    <>
      <Hero destacado={destacados[0]} ciudades={ciudades} categorias={categorias} />
      <ListaCategorias categorias={categorias} />
      <SeccionEventos
        id="destacados-titulo"
        textos="paginas.inicio.destacados"
        eventos={destacados.slice(0, 4)}
        hrefVerTodos={`${RUTAS.explorar}?orden=popularidad`}
      />
      <SeccionEventos
        id="proximos-titulo"
        textos="paginas.inicio.proximos"
        variables={{ ciudad: ciudadPrincipal }}
        eventos={proximos?.datos ?? []}
        hrefVerTodos={`${RUTAS.explorar}?ciudad=${encodeURIComponent(ciudadPrincipal)}`}
      />
    </>
  );
}
