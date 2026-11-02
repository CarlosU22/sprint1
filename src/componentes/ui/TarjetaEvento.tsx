"use client";

import { Calendar, MapPin } from "lucide-react";
import { useIdioma } from "@/contexto/ProveedorIdioma";
import { formatearFecha, formatearHora, formatearPrecio } from "@/lib/formatos";
import { rutaEvento } from "@/lib/navegacion";
import type { EventoResumen } from "@/lib/tipos";
import { Afiche } from "./Afiche";
import { BotonEnlace } from "./Boton";
import { Etiqueta } from "./Etiqueta";
import { Tarjeta } from "./Tarjeta";
import estilos from "./TarjetaEvento.module.css";

interface PropsTarjetaEvento {
  evento: EventoResumen;
  /** Nivel del título: h3 dentro de una sección con h2, h2 si la página no tiene secciones */
  nivelTitulo?: "h2" | "h3";
}

/**
 * Tarjeta de un evento (Inicio y Explorar).
 * Los DATOS (título, lugar, precio) vienen de la API y no se traducen.
 * Los TEXTOS ("Desde", "Ver evento", "Concierto") vienen de GET /textos.
 */
export function TarjetaEvento({
  evento,
  nivelTitulo: Titulo = "h3",
}: PropsTarjetaEvento) {
  const { t, idioma } = useIdioma();

  const fecha = t("general.formatos.fechaYHora", {
    fecha: formatearFecha(evento.fecha, idioma),
    hora: formatearHora(evento.fecha, idioma),
  });
  const lugar = t("general.formatos.lugarYCiudad", {
    lugar: evento.recinto.nombre ?? "",
    ciudad: evento.recinto.ciudad ?? "",
  });

  return (
    <Tarjeta como="article" className={estilos.tarjeta}>
      <Afiche afiche={evento.afiche} />

      <div className={estilos.cuerpo}>
        <Etiqueta>{t(`general.categorias.singular.${evento.categoria}`)}</Etiqueta>
        <Titulo className={estilos.titulo}>{evento.titulo}</Titulo>

        <ul className={estilos.datos}>
          <li>
            <Calendar aria-hidden="true" />
            <time dateTime={evento.fecha}>{fecha}</time>
          </li>
          <li>
            <MapPin aria-hidden="true" />
            <span>{lugar}</span>
          </li>
        </ul>

        <div className={estilos.pie}>
          <p className={estilos.precio}>
            <span className={estilos.desde}>{t("paginas.inicio.tarjeta.desde")}</span>
            <span>{formatearPrecio(evento.precioDesde)}</span>
          </p>
          <BotonEnlace
            href={rutaEvento(evento.slug)}
            variante="secundario"
            // Varias tarjetas tienen "Ver evento": el aria-label dice cuál es cuál
            aria-label={`${t("paginas.inicio.tarjeta.botones.verEvento")}: ${evento.titulo}`}
          >
            {t("paginas.inicio.tarjeta.botones.verEvento")}
          </BotonEnlace>
        </div>
      </div>
    </Tarjeta>
  );
}
