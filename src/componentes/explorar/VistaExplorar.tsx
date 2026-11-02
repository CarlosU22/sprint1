"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { BotonEnlace } from "@/componentes/ui/Boton";
import { CampoSelect } from "@/componentes/ui/Campo";
import { EstadoPagina } from "@/componentes/ui/EstadoPagina";
import { TarjetaEvento } from "@/componentes/ui/TarjetaEvento";
import { useIdioma } from "@/contexto/ProveedorIdioma";
import {
  ORDENES,
  crearUrlExplorar,
  hayFiltrosActivos,
  type FiltrosExplorar,
  type Orden,
} from "@/lib/filtros";
import { RUTAS } from "@/lib/navegacion";
import type {
  Categoria,
  Ciudad,
  EventoResumen,
  Paginacion as DatosPaginacion,
} from "@/lib/tipos";
import { Filtros } from "./Filtros";
import { FiltrosActivos } from "./FiltrosActivos";
import { Paginacion } from "./Paginacion";
import { PanelFiltrosMovil } from "./PanelFiltrosMovil";
import estilos from "./VistaExplorar.module.css";

interface PropsVistaExplorar {
  filtros: FiltrosExplorar;
  eventos: EventoResumen[];
  paginacion: DatosPaginacion;
  categorias: Categoria[];
  ciudades: Ciudad[];
}

/**
 * VISTA 2 · EXPLORAR EVENTOS (parte de cliente)
 *
 * Recibe los datos ya pedidos por la página (servidor). Cuando la persona
 * cambia un filtro, NO pedimos datos desde aquí: solo cambiamos la URL con
 * router.push(). Next.js vuelve a ejecutar la página en el servidor con los
 * nuevos searchParams y nos manda los eventos nuevos.
 */
export function VistaExplorar({
  filtros,
  eventos,
  paginacion,
  categorias,
  ciudades,
}: PropsVistaExplorar) {
  const { t, tPlural } = useIdioma();
  const router = useRouter();
  // useTransition: mientras llega la respuesta, "cargando" es true y
  // la página actual sigue visible (atenuada) en vez de quedar en blanco
  const [cargando, iniciarTransicion] = useTransition();

  function navegar(cambios: Partial<FiltrosExplorar>) {
    iniciarTransicion(() => {
      router.push(crearUrlExplorar(filtros, cambios), { scroll: false });
    });
  }

  const cantidadActivos = [
    filtros.q,
    filtros.categoria,
    filtros.ciudad,
    filtros.fecha,
    filtros.precioMax !== null ? "precio" : "",
  ].filter(Boolean).length;

  const panelFiltros = (
    <Filtros
      filtros={filtros}
      categorias={categorias}
      ciudades={ciudades}
      navegar={navegar}
    />
  );

  return (
    <div className={`contenedor ${estilos.vista}`}>
      {/* Migas de pan: Inicio > Explorar */}
      <ol className={estilos.migas}>
        <li>
          <Link href={RUTAS.inicio}>{t("componentes.migas.inicio")}</Link>
          <ChevronRight aria-hidden="true" />
        </li>
        <li aria-current="page">{t("componentes.migas.explorar")}</li>
      </ol>

      <div className={estilos.encabezado}>
        {/* La API no tiene un título propio para esta vista; usamos el del enlace del pie,
            que es el mismo texto del diseño ("Explorar eventos") */}
        <h1 className={estilos.titulo}>
          {t("footer.columnas.explora.enlaces.explorar")}
        </h1>
        {/* aria-live: el lector de pantalla anuncia el nuevo total al filtrar */}
        <p className={estilos.resultados} aria-live="polite">
          {tPlural("paginas.explorar.resultados", paginacion.total)}
        </p>
      </div>

      <div className={estilos.columnas}>
        <aside className={estilos.lateral}>{panelFiltros}</aside>

        <div className={estilos.principal}>
          <div className={estilos.barra}>
            <PanelFiltrosMovil total={paginacion.total} cantidadActivos={cantidadActivos}>
              {panelFiltros}
            </PanelFiltrosMovil>
            <FiltrosActivos filtros={filtros} navegar={navegar} />
            <CampoSelect
              id="orden"
              etiqueta={t("paginas.explorar.orden.etiqueta")}
              value={filtros.orden}
              onChange={(evento) => navegar({ orden: evento.target.value as Orden })}
              className={estilos.orden}
            >
              {ORDENES.map((orden) => (
                <option key={orden} value={orden}>
                  {t(`paginas.explorar.orden.opciones.${orden}`)}
                </option>
              ))}
            </CampoSelect>
          </div>

          <div aria-busy={cargando} className={cargando ? estilos.cargando : undefined}>
            {eventos.length > 0 ? (
              <ul className={estilos.grilla}>
                {eventos.map((evento) => (
                  <li key={evento.id}>
                    <TarjetaEvento evento={evento} nivelTitulo="h2" />
                  </li>
                ))}
              </ul>
            ) : (
              <EstadoPagina
                titulo={t("paginas.explorar.vacio.titulo")}
                texto={t("paginas.explorar.vacio.texto")}
                accion={
                  hayFiltrosActivos(filtros) && (
                    <BotonEnlace href={RUTAS.explorar} variante="secundario">
                      {t("paginas.explorar.vacio.botones.limpiar")}
                    </BotonEnlace>
                  )
                }
              />
            )}

            <Paginacion filtros={filtros} totalPaginas={paginacion.paginas} />
          </div>
        </div>
      </div>
    </div>
  );
}
