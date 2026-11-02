"use client";

import Link from "next/link";
import { Flag, Music, Smile, Star, Trophy, Users, type LucideIcon } from "lucide-react";
import { useIdioma } from "@/contexto/ProveedorIdioma";
import { RUTAS } from "@/lib/navegacion";
import type { Categoria } from "@/lib/tipos";
import estilos from "./ListaCategorias.module.css";

// Ícono de cada categoría según su id (el ícono es parte del diseño, no del catálogo)
const ICONOS: Record<string, LucideIcon> = {
  conciertos: Music,
  teatro: Star,
  deportes: Trophy,
  festivales: Flag,
  comedia: Smile,
  familiares: Users,
};

/** Fila de categorías del Inicio. Cada una lleva a /explorar?categoria=<id> */
export function ListaCategorias({ categorias }: { categorias: Categoria[] }) {
  const { t, tPlural } = useIdioma();

  return (
    <section className="contenedor" aria-labelledby="categorias-titulo">
      {/* El diseño no muestra un título aquí, pero lo dejamos para lectores de pantalla */}
      <h2 id="categorias-titulo" className="solo-lectores">
        {t("paginas.explorar.filtros.categoria")}
      </h2>
      <ul className={estilos.lista}>
        {categorias.map((categoria) => {
          const Icono = ICONOS[categoria.id] ?? Star;
          return (
            <li key={categoria.id}>
              <Link
                href={`${RUTAS.explorar}?categoria=${categoria.id}`}
                className={estilos.categoria}
              >
                <span className={estilos.icono} aria-hidden="true">
                  <Icono />
                </span>
                <span className={estilos.textos}>
                  {/* El nombre visible sale de los textos (general.categorias.<id>);
                      de /categorias usamos el id y el número de eventos */}
                  <span className={estilos.nombre}>
                    {t(`general.categorias.${categoria.id}`)}
                  </span>
                  <span className={estilos.cantidad}>
                    {tPlural("paginas.inicio.categorias.eventos", categoria.eventos)}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
