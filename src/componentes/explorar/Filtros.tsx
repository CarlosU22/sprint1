"use client";

import { useId, useState } from "react";
import { Boton } from "@/componentes/ui/Boton";
import { CampoSelect } from "@/componentes/ui/Campo";
import { useIdioma } from "@/contexto/ProveedorIdioma";
import { formatearPrecio } from "@/lib/formatos";
import {
  FILTROS_VACIOS,
  OPCIONES_FECHA,
  PASO_PRECIO,
  PRECIO_MAXIMO,
  type FiltrosExplorar,
} from "@/lib/filtros";
import type { Categoria, Ciudad } from "@/lib/tipos";
import estilos from "./Filtros.module.css";

interface PropsFiltros {
  filtros: FiltrosExplorar;
  categorias: Categoria[];
  ciudades: Ciudad[];
  /** Cambia la URL con los filtros nuevos (viene de VistaExplorar) */
  navegar: (cambios: Partial<FiltrosExplorar>) => void;
}

/**
 * Panel de filtros: categoría, fecha, ciudad y precio.
 * No guarda estado propio: lee los filtros que vienen de la URL y, al cambiar
 * algo, llama a navegar(), que cambia la URL. Next.js vuelve a pedir los
 * eventos a la API con los filtros nuevos.
 */
export function Filtros({ filtros, categorias, ciudades, navegar }: PropsFiltros) {
  const { t } = useIdioma();
  // useId: el panel se dibuja dos veces (escritorio y móvil), así los id no se repiten
  const id = useId();

  return (
    <div className={estilos.filtros}>
      <div className={estilos.cabecera}>
        <h2 className={estilos.titulo}>{t("paginas.explorar.filtros.titulo")}</h2>
        <Boton
          variante="fantasma"
          tamano="sm" // Limpia los filtros pero mantiene el orden elegido
          onClick={() => navegar({ ...FILTROS_VACIOS, orden: filtros.orden })}
        >
          {t("paginas.explorar.filtros.botones.limpiar")}
        </Boton>
      </div>

      {/* Categoría: <fieldset> agrupa las opciones y <legend> les da nombre */}
      <fieldset className={estilos.grupo}>
        <legend className={estilos.leyenda}>
          {t("paginas.explorar.filtros.categoria")}
        </legend>
        <ul className={estilos.opciones}>
          <li>
            <label className={estilos.opcion}>
              <input
                type="radio"
                name={`${id}-categoria`}
                checked={filtros.categoria === ""}
                onChange={() => navegar({ categoria: "" })}
              />
              <span>{t("general.categorias.todas")}</span>
            </label>
          </li>
          {categorias.map((categoria) => (
            <li key={categoria.id}>
              <label className={estilos.opcion}>
                <input
                  type="radio"
                  name={`${id}-categoria`}
                  checked={filtros.categoria === categoria.id}
                  onChange={() => navegar({ categoria: categoria.id })}
                />
                <span>{t(`general.categorias.${categoria.id}`)}</span>
                <span className={estilos.cantidad}>{categoria.eventos}</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      {/* Fecha: botones tipo "píldora". aria-pressed indica cuál está activo */}
      <fieldset className={estilos.grupo}>
        <legend className={estilos.leyenda}>
          {t("paginas.explorar.filtros.fecha.titulo")}
        </legend>
        <div className={estilos.pildoras}>
          {OPCIONES_FECHA.map((opcion) => {
            const activa = filtros.fecha === opcion;
            return (
              <button
                key={opcion}
                type="button"
                aria-pressed={activa}
                className={estilos.pildora}
                // Si ya estaba activa, al tocarla de nuevo se quita
                onClick={() => navegar({ fecha: activa ? "" : opcion })}
              >
                {t(`paginas.explorar.filtros.fecha.${opcion}`)}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className={estilos.grupo}>
        <CampoSelect
          id={`${id}-ciudad`}
          etiqueta={t("paginas.explorar.filtros.ciudad")}
          value={filtros.ciudad}
          onChange={(evento) => navegar({ ciudad: evento.target.value })}
          className={estilos.campoCiudad}
        >
          <option value="">{t("general.categorias.todas")}</option>
          {ciudades.map((ciudad) => (
            <option key={ciudad.nombre} value={ciudad.nombre}>
              {ciudad.nombre}
            </option>
          ))}
        </CampoSelect>
      </div>

      {/* key: si el precio cambia desde afuera (por ejemplo con "Limpiar"),
          React crea el control de nuevo y su estado interno se reinicia */}
      <ControlPrecio
        key={filtros.precioMax ?? "sin-precio"}
        id={`${id}-precio`}
        precioMax={filtros.precioMax}
        navegar={navegar}
      />
    </div>
  );
}

interface PropsControlPrecio {
  id: string;
  precioMax: number | null;
  navegar: PropsFiltros["navegar"];
}

/**
 * Control deslizante del precio máximo.
 * Mientras se arrastra solo cambia el estado local (para no llamar a la API
 * en cada píxel). Al soltar, se aplica el filtro.
 */
function ControlPrecio({ id, precioMax, navegar }: PropsControlPrecio) {
  const { t } = useIdioma();
  const [valor, setValor] = useState(precioMax ?? PRECIO_MAXIMO);

  function aplicar() {
    const nuevo = valor >= PRECIO_MAXIMO ? null : valor; // al máximo = sin filtro
    if (nuevo !== precioMax) navegar({ precioMax: nuevo });
  }

  return (
    <div className={estilos.grupo}>
      <label htmlFor={id} className={estilos.leyenda}>
        {t("paginas.explorar.filtros.precio")}
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={PRECIO_MAXIMO}
        step={PASO_PRECIO}
        value={valor}
        aria-valuetext={formatearPrecio(valor)}
        className={estilos.rango}
        onChange={(evento) => setValor(Number(evento.target.value))}
        onPointerUp={aplicar}
        onKeyUp={aplicar}
        onBlur={aplicar}
      />
      <div className={estilos.extremos} aria-hidden="true">
        <span>{formatearPrecio(0)}</span>
        <span>{formatearPrecio(valor)}</span>
      </div>
    </div>
  );
}
