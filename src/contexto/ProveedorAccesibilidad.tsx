"use client";

/*
 * CONTEXTO DE ACCESIBILIDAD
 *
 * Guarda las opciones del panel de accesibilidad (tamaño del texto, alto
 * contraste, reducir movimiento, subrayar enlaces y espaciado de lectura).
 *
 * - Se guardan en localStorage ("se guarda en este dispositivo").
 * - Si nunca se han guardado, los valores iniciales salen del sistema
 *   operativo (prefers-contrast y prefers-reduced-motion).
 * - Se aplican como atributos data-* en <html>; el CSS hace el resto
 *   (ver el final de src/styles/tokens.css).
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface PreferenciasAccesibilidad {
  escala: number;
  altoContraste: boolean;
  reducirMovimiento: boolean;
  subrayarEnlaces: boolean;
  espaciadoLectura: boolean;
}

export type OpcionBooleana = Exclude<keyof PreferenciasAccesibilidad, "escala">;

/** Tamaños de texto disponibles (1 = 100 %) */
export const ESCALAS = [0.875, 1, 1.125, 1.25, 1.5];

const CLAVE_STORAGE = "taquilla-accesibilidad";

function valoresDelSistema(): PreferenciasAccesibilidad {
  // En el servidor no existe window: devolvemos los valores normales
  const hayVentana = typeof window !== "undefined";
  return {
    escala: 1,
    altoContraste: hayVentana && window.matchMedia("(prefers-contrast: more)").matches,
    reducirMovimiento:
      hayVentana && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    subrayarEnlaces: false,
    espaciadoLectura: false,
  };
}

function leerPreferencias(): PreferenciasAccesibilidad {
  const porDefecto = valoresDelSistema();
  if (typeof window === "undefined") return porDefecto;

  try {
    const guardado = window.localStorage.getItem(CLAVE_STORAGE);
    return guardado ? { ...porDefecto, ...JSON.parse(guardado) } : porDefecto;
  } catch {
    // localStorage puede fallar (modo privado, JSON dañado...): usamos los del sistema
    return porDefecto;
  }
}

interface ValorAccesibilidad {
  preferencias: PreferenciasAccesibilidad;
  cambiarOpcion: (opcion: OpcionBooleana, valor: boolean) => void;
  cambiarEscala: (escala: number) => void;
  restablecer: () => void;
}

const ContextoAccesibilidad = createContext<ValorAccesibilidad | null>(null);

export function ProveedorAccesibilidad({ children }: { children: ReactNode }) {
  // Se leen al iniciar en el navegador. El servidor no pinta nada que dependa
  // de estos valores (el panel solo se dibuja cuando se abre), así que no hay
  // diferencias entre el HTML del servidor y el del cliente.
  const [preferencias, setPreferencias] = useState(leerPreferencias);

  // Cada vez que cambian: se aplican en <html> y se guardan
  useEffect(() => {
    const html = document.documentElement;
    html.style.setProperty("--escala-texto", String(preferencias.escala));
    html.toggleAttribute("data-alto-contraste", preferencias.altoContraste);
    html.toggleAttribute("data-reducir-movimiento", preferencias.reducirMovimiento);
    html.toggleAttribute("data-subrayar-enlaces", preferencias.subrayarEnlaces);
    html.toggleAttribute("data-espaciado-lectura", preferencias.espaciadoLectura);

    try {
      window.localStorage.setItem(CLAVE_STORAGE, JSON.stringify(preferencias));
    } catch {
      // Si no se puede guardar, igual funcionan mientras la página esté abierta
    }
  }, [preferencias]);

  const valor: ValorAccesibilidad = {
    preferencias,
    cambiarOpcion: (opcion, nuevoValor) =>
      setPreferencias((anteriores) => ({ ...anteriores, [opcion]: nuevoValor })),
    cambiarEscala: (escala) =>
      setPreferencias((anteriores) => ({ ...anteriores, escala })),
    restablecer: () => setPreferencias(valoresDelSistema()),
  };

  return (
    <ContextoAccesibilidad.Provider value={valor}>
      {children}
    </ContextoAccesibilidad.Provider>
  );
}

export function useAccesibilidad() {
  const valor = useContext(ContextoAccesibilidad);
  if (!valor) {
    throw new Error("useAccesibilidad debe usarse dentro de <ProveedorAccesibilidad>");
  }
  return valor;
}
