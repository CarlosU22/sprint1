"use client";

import Link from "next/link";
import { Ticket } from "lucide-react";
import { useIdioma } from "@/contexto/ProveedorIdioma";
import { RUTAS } from "@/lib/navegacion";
import estilos from "./Logo.module.css";

interface PropsLogo {
  /** "oscuro" para el encabezado blanco, "claro" para el pie de página negro */
  tema?: "oscuro" | "claro";
  onClick?: () => void;
}

/** Logo de Taquilla: siempre lleva al inicio */
export function Logo({ tema = "oscuro", onClick }: PropsLogo) {
  const { t } = useIdioma();

  return (
    <Link
      href={RUTAS.inicio}
      aria-label={t("navbar.logo.aria")}
      className={`${estilos.logo} ${estilos[tema]}`}
      onClick={onClick}
    >
      <span className={estilos.icono} aria-hidden="true">
        <Ticket />
      </span>
      <span className={estilos.texto}>{t("navbar.logo.texto")}</span>
    </Link>
  );
}
