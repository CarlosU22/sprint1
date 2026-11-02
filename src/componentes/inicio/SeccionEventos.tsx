"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TarjetaEvento } from "@/componentes/ui/TarjetaEvento";
import { useIdioma } from "@/contexto/ProveedorIdioma";
import type { EventoResumen } from "@/lib/tipos";
import estilos from "./SeccionEventos.module.css";

interface PropsSeccionEventos {
  id: string;
  /** Ruta del texto del título y el subtítulo, por ejemplo "paginas.inicio.destacados" */
  textos: "paginas.inicio.destacados" | "paginas.inicio.proximos";
  /** Variables del título, por ejemplo { ciudad: "Manizales" } */
  variables?: Record<string, string>;
  eventos: EventoResumen[];
  /** A dónde lleva "Ver todos" */
  hrefVerTodos: string;
}

/** Sección del Inicio con título, "Ver todos" y una fila de tarjetas */
export function SeccionEventos({
  id,
  textos,
  variables,
  eventos,
  hrefVerTodos,
}: PropsSeccionEventos) {
  const { t } = useIdioma();

  if (eventos.length === 0) return null;

  return (
    <section className={`contenedor ${estilos.seccion}`} aria-labelledby={id}>
      <div className={estilos.cabecera}>
        <div>
          <h2 id={id} className={estilos.titulo}>
            {t(`${textos}.titulo`, variables)}
          </h2>
          <p className={estilos.subtitulo}>{t(`${textos}.subtitulo`)}</p>
        </div>
        <Link href={hrefVerTodos} className={estilos.verTodos}>
          {t("paginas.inicio.destacados.enlaces.verTodos")}
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>

      <ul className={estilos.grilla}>
        {eventos.map((evento) => (
          <li key={evento.id}>
            <TarjetaEvento evento={evento} />
          </li>
        ))}
      </ul>
    </section>
  );
}
