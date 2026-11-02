"use client";

import Form from "next/form";
import Link from "next/link";
import { CalendarDays, MapPin, Search } from "lucide-react";
import { BotonEnlace, Boton } from "@/componentes/ui/Boton";
import { Afiche } from "@/componentes/ui/Afiche";
import { Etiqueta } from "@/componentes/ui/Etiqueta";
import { useIdioma } from "@/contexto/ProveedorIdioma";
import { formatearFecha, formatearPrecio } from "@/lib/formatos";
import { OPCIONES_FECHA } from "@/lib/filtros";
import { RUTAS, rutaEvento } from "@/lib/navegacion";
import type { Categoria, Ciudad, EventoResumen } from "@/lib/tipos";
import estilos from "./Hero.module.css";

interface PropsHero {
  destacado: EventoResumen | undefined;
  ciudades: Ciudad[];
  categorias: Categoria[];
}

/** Parte de arriba del Inicio: título, buscador grande y el evento destacado */
export function Hero({ destacado, ciudades, categorias }: PropsHero) {
  const { t, idioma } = useIdioma();

  return (
    <section className={estilos.hero} aria-labelledby="hero-titulo">
      <div className={`contenedor ${estilos.contenido}`}>
        <div className={estilos.texto}>
          <Etiqueta variante="blanca">
            {t("paginas.inicio.hero.etiquetas.temporada")}
          </Etiqueta>
          <h1 id="hero-titulo" className={estilos.titulo}>
            {t("paginas.inicio.hero.titulo")}
          </h1>
          <p className={estilos.subtitulo}>{t("paginas.inicio.hero.subtitulo")}</p>

          {/* Buscador: un formulario GET que lleva a /explorar con los filtros en la URL */}
          <Form action={RUTAS.explorar} className={estilos.buscador} role="search">
            <label className={estilos.campo}>
              <Search aria-hidden="true" />
              <span className={estilos.etiquetaCampo}>
                {t("paginas.inicio.hero.buscador.etiquetas.que")}
              </span>
              <input
                name="q"
                type="search"
                maxLength={80}
                placeholder={t("paginas.inicio.hero.buscador.placeholders.que")}
              />
            </label>

            <label className={estilos.campo}>
              <MapPin aria-hidden="true" />
              <span className={estilos.etiquetaCampo}>
                {t("paginas.inicio.hero.buscador.etiquetas.donde")}
              </span>
              <select name="ciudad" defaultValue={ciudades[0]?.nombre}>
                {ciudades.map((ciudad) => (
                  <option key={ciudad.nombre} value={ciudad.nombre}>
                    {ciudad.nombre}
                  </option>
                ))}
              </select>
            </label>

            <label className={estilos.campo}>
              <CalendarDays aria-hidden="true" />
              <span className={estilos.etiquetaCampo}>
                {t("paginas.inicio.hero.buscador.etiquetas.cuando")}
              </span>
              <select name="fecha" defaultValue="">
                <option value="">
                  {t("paginas.inicio.hero.buscador.placeholders.cuando")}
                </option>
                {OPCIONES_FECHA.filter((opcion) => opcion !== "elegir").map((opcion) => (
                  <option key={opcion} value={opcion}>
                    {t(`paginas.explorar.filtros.fecha.${opcion}`)}
                  </option>
                ))}
              </select>
            </label>

            <Boton type="submit" className={estilos.botonBuscar}>
              {t("paginas.inicio.hero.buscador.botones.buscar")}
            </Boton>
          </Form>

          {/* "Populares": accesos rápidos a las primeras categorías */}
          <div className={estilos.populares}>
            <span>{t("paginas.inicio.hero.buscador.populares")}</span>
            <ul>
              {categorias.slice(0, 4).map((categoria) => (
                <li key={categoria.id}>
                  <Link href={`${RUTAS.explorar}?categoria=${categoria.id}`}>
                    {t(`general.categorias.${categoria.id}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {destacado && (
          <div className={estilos.destacado}>
            <Afiche afiche={destacado.afiche} className={estilos.fondoDestacado} />
            <div className={estilos.tarjetaDestacado}>
              <Etiqueta>{t("paginas.inicio.hero.destacado.etiqueta")}</Etiqueta>
              <h2 className={estilos.tituloDestacado}>{destacado.titulo}</h2>
              <div className={estilos.filaDestacado}>
                <div>
                  <p className={estilos.datoDestacado}>
                    {t("general.formatos.fechaYLugar", {
                      fecha: formatearFecha(destacado.fecha, idioma),
                      lugar: destacado.recinto.nombre ?? "",
                    })}
                  </p>
                  <p className={estilos.precioDestacado}>
                    {t("paginas.inicio.hero.destacado.desde", {
                      precio: formatearPrecio(destacado.precioDesde),
                    })}
                  </p>
                </div>
                <BotonEnlace
                  href={rutaEvento(destacado.slug)}
                  aria-label={`${t("paginas.inicio.hero.destacado.botones.verEvento")}: ${destacado.titulo}`}
                >
                  {t("paginas.inicio.hero.destacado.botones.verEvento")}
                </BotonEnlace>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
