"use client";

import { useState } from "react";
import { AvisoCookies } from "@/componentes/ui/AvisoCookies";
import { useIdioma } from "@/contexto/ProveedorIdioma";
import {
  COOKIE_CONSENTIMIENTO,
  COOKIE_IDIOMA,
  borrarCookie,
  escribirCookie,
} from "@/lib/cookies";

/**
 * Lógica del aviso de cookies (la parte visual está en ui/AvisoCookies.tsx).
 *
 * - Aparece solo si todavía no hay cookie `consentimiento` (lo decide el layout).
 * - Aceptar: guarda consentimiento=aceptado y el idioma que se está usando.
 * - Rechazar: guarda consentimiento=rechazado y borra la cookie `idioma`.
 *   El sitio funciona igual; solo que el idioma no se recuerda.
 *
 * La cookie `consentimiento` sí se guarda al rechazar: es necesaria para no
 * volver a preguntar en cada visita.
 */
export function ControlCookies({ mostrarAviso }: { mostrarAviso: boolean }) {
  const { t, idioma } = useIdioma();
  const [visible, setVisible] = useState(mostrarAviso);

  function decidir(acepta: boolean) {
    escribirCookie(COOKIE_CONSENTIMIENTO, acepta ? "aceptado" : "rechazado");

    if (acepta) {
      escribirCookie(COOKIE_IDIOMA, idioma);
    } else {
      borrarCookie(COOKIE_IDIOMA);
    }

    setVisible(false);
    // El aviso desaparece: movemos el foco al contenido para que quien usa
    // teclado no quede "perdido" al inicio de la página
    document.getElementById("contenido")?.focus();
  }

  if (!visible) return null;

  return (
    <AvisoCookies
      titulo={t("cookies.banner.titulo")}
      texto={t("cookies.banner.texto")}
      textoAceptar={t("cookies.banner.botones.aceptar")}
      textoRechazar={t("cookies.banner.botones.rechazar")}
      onAceptar={() => decidir(true)}
      onRechazar={() => decidir(false)}
    />
  );
}
