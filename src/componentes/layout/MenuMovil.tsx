"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useRef, useState } from "react";
import { BotonEnlace } from "@/componentes/ui/Boton";
import { useIdioma } from "@/contexto/ProveedorIdioma";
import { ENLACES_PRINCIPALES, RUTAS } from "@/lib/navegacion";
import { BuscadorEncabezado } from "./BuscadorEncabezado";
import { CambioIdioma } from "./CambioIdioma";
import { Logo } from "./Logo";
import { OpcionesAccesibilidad } from "./OpcionesAccesibilidad";
import estilos from "./MenuMovil.module.css";

/**
 * Menú hamburguesa (solo en pantallas pequeñas).
 *
 * Usa el elemento nativo <dialog> con showModal(), que ya trae lo necesario
 * para el teclado:
 *  - Escape lo cierra,
 *  - el foco queda atrapado dentro mientras está abierto,
 *  - al cerrarse, el foco vuelve al botón que lo abrió.
 */
export function MenuMovil() {
  const { t } = useIdioma();
  const rutaActual = usePathname();
  const dialogoRef = useRef<HTMLDialogElement>(null);
  const [abierto, setAbierto] = useState(false);

  function abrir() {
    dialogoRef.current?.showModal();
    setAbierto(true);
  }

  function cerrar() {
    dialogoRef.current?.close(); // dispara onClose, que pone abierto = false
  }

  return (
    <>
      <button
        type="button"
        className={estilos.hamburguesa}
        aria-label={t("menuMovil.abrir")}
        aria-expanded={abierto}
        aria-controls="menu-movil"
        onClick={abrir}
      >
        <Menu aria-hidden="true" />
      </button>

      <dialog
        id="menu-movil"
        ref={dialogoRef}
        className={estilos.dialogo}
        aria-label={t("sitio.nombre")}
        onClose={() => setAbierto(false)}
        // Clic en el fondo oscuro (fuera del panel) también cierra
        onClick={(evento) => {
          if (evento.target === dialogoRef.current) cerrar();
        }}
      >
        <div className={estilos.panel}>
          <div className={estilos.cabecera}>
            <Logo onClick={cerrar} />
            <button
              type="button"
              className={estilos.cerrar}
              aria-label={t("menuMovil.cerrar")}
              onClick={cerrar}
            >
              <X aria-hidden="true" />
            </button>
          </div>

          <BuscadorEncabezado onBuscar={cerrar} />

          <nav>
            <ul className={estilos.enlaces}>
              {ENLACES_PRINCIPALES.map((enlace) => (
                <li key={enlace.clave}>
                  <Link
                    href={enlace.href}
                    className={estilos.enlace}
                    aria-current={rutaActual === enlace.href ? "page" : undefined}
                    onClick={cerrar}
                  >
                    {t(`menuMovil.enlaces.${enlace.clave}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={estilos.botones}>
            <BotonEnlace
              href={RUTAS.ingresar}
              variante="secundario"
              anchoCompleto
              onClick={cerrar}
            >
              {t("menuMovil.botones.ingresar")}
            </BotonEnlace>
            <BotonEnlace
              href={RUTAS.registro}
              variante="primario"
              anchoCompleto
              onClick={cerrar}
            >
              {t("menuMovil.botones.crearCuenta")}
            </BotonEnlace>
          </div>

          <section className={estilos.seccion} aria-labelledby="menu-movil-idioma">
            <h2 id="menu-movil-idioma" className={estilos.tituloSeccion}>
              {t("menuMovil.secciones.idioma")}
            </h2>
            <CambioIdioma className={estilos.selectorIdioma} />
          </section>

          <section className={estilos.seccion} aria-labelledby="menu-movil-accesibilidad">
            <h2 id="menu-movil-accesibilidad" className={estilos.tituloSeccion}>
              {t("menuMovil.secciones.accesibilidad")}
            </h2>
            {/* Solo se dibuja abierto: así el HTML del servidor no depende de localStorage */}
            {abierto && <OpcionesAccesibilidad />}
          </section>
        </div>
      </dialog>
    </>
  );
}
