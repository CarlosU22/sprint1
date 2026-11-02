"use client";

import type { ReactNode } from "react";
import estilos from "./EstadoPagina.module.css";

interface PropsEstadoPagina {
  titulo: string;
  texto: string;
  /** Botón opcional, por ejemplo "Reintentar" o "Limpiar filtros" */
  accion?: ReactNode;
  /** true mientras se carga: muestra un indicador y avisa a los lectores de pantalla */
  cargando?: boolean;
}

/** Bloque centrado para los estados de carga, vacío y error */
export function EstadoPagina({
  titulo,
  texto,
  accion,
  cargando = false,
}: PropsEstadoPagina) {
  return (
    <div
      className={estilos.estado}
      role={cargando ? "status" : undefined}
      aria-busy={cargando || undefined}
    >
      {cargando && <span className={estilos.indicador} aria-hidden="true" />}
      <p className={estilos.titulo}>{titulo}</p>
      <p className={estilos.texto}>{texto}</p>
      {accion}
    </div>
  );
}
