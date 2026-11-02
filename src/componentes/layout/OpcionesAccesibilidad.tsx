"use client";

import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { useId } from "react";
import { Boton } from "@/componentes/ui/Boton";
import {
  ESCALAS,
  useAccesibilidad,
  type OpcionBooleana,
} from "@/contexto/ProveedorAccesibilidad";
import { useIdioma } from "@/contexto/ProveedorIdioma";
import { RUTAS } from "@/lib/navegacion";
import estilos from "./OpcionesAccesibilidad.module.css";

// Las cuatro opciones de sí/no, en el orden del diseño.
// La clave coincide con el nombre del texto en accesibilidad.* de la API.
const OPCIONES: OpcionBooleana[] = [
  "altoContraste",
  "reducirMovimiento",
  "subrayarEnlaces",
  "espaciadoLectura",
];

/** Contenido del panel de accesibilidad. Se usa en el panel de escritorio y en el menú móvil. */
export function OpcionesAccesibilidad() {
  const { t } = useIdioma();
  const { preferencias, cambiarOpcion, cambiarEscala, restablecer } = useAccesibilidad();
  const idBase = useId();

  const posicion = ESCALAS.indexOf(preferencias.escala);

  return (
    <div className={estilos.opciones}>
      <div className={estilos.grupo}>
        <p id={`${idBase}-tamano`} className={estilos.nombre}>
          {t("accesibilidad.tamanoTexto")}
        </p>
        <div className={estilos.tamano} role="group" aria-labelledby={`${idBase}-tamano`}>
          <button
            type="button"
            className={estilos.botonTamano}
            aria-label={t("accesibilidad.aria.disminuirTexto")}
            disabled={posicion <= 0}
            onClick={() => cambiarEscala(ESCALAS[posicion - 1])}
          >
            <Minus aria-hidden="true" />
          </button>
          <span className={estilos.muestra} aria-live="polite">
            {t("accesibilidad.muestraTamano")}
            <span className="solo-lectores">
              {" "}
              {Math.round(preferencias.escala * 100)} %
            </span>
          </span>
          <button
            type="button"
            className={estilos.botonTamano}
            aria-label={t("accesibilidad.aria.aumentarTexto")}
            disabled={posicion >= ESCALAS.length - 1}
            onClick={() => cambiarEscala(ESCALAS[posicion + 1])}
          >
            <Plus aria-hidden="true" />
          </button>
        </div>
      </div>

      <ul className={estilos.lista}>
        {OPCIONES.map((opcion) => {
          const activo = preferencias[opcion];
          return (
            <li key={opcion} className={estilos.opcion}>
              <div>
                <p id={`${idBase}-${opcion}`} className={estilos.nombre}>
                  {t(`accesibilidad.${opcion}.nombre`)}
                </p>
                <p id={`${idBase}-${opcion}-desc`} className={estilos.descripcion}>
                  {t(`accesibilidad.${opcion}.descripcion`)}
                </p>
              </div>
              {/* Un interruptor accesible: botón con role="switch" y aria-checked */}
              <button
                type="button"
                role="switch"
                aria-checked={activo}
                aria-labelledby={`${idBase}-${opcion}`}
                aria-describedby={`${idBase}-${opcion}-desc`}
                className={estilos.interruptor}
                onClick={() => cambiarOpcion(opcion, !activo)}
              >
                <span className={estilos.perilla} />
              </button>
            </li>
          );
        })}
      </ul>

      <p className={estilos.nota}>{t("accesibilidad.nota")}</p>

      <div className={estilos.pie}>
        <Link href={RUTAS.accesibilidad} className={estilos.enlace}>
          {t("accesibilidad.enlaces.declaracion")}
        </Link>
        <Boton variante="secundario" tamano="sm" onClick={restablecer}>
          {t("accesibilidad.botones.restablecer")}
        </Boton>
      </div>
    </div>
  );
}
