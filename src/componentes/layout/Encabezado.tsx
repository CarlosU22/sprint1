"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BotonEnlace } from "@/componentes/ui/Boton";
import { useIdioma } from "@/contexto/ProveedorIdioma";
import { ENLACES_PRINCIPALES, RUTAS } from "@/lib/navegacion";
import { BuscadorEncabezado } from "./BuscadorEncabezado";
import { CambioIdioma } from "./CambioIdioma";
import { Logo } from "./Logo";
import { MenuMovil } from "./MenuMovil";
import { PanelAccesibilidad } from "./PanelAccesibilidad";
import estilos from "./Encabezado.module.css";

/**
 * Encabezado del sitio: aparece en todas las vistas (lo pone el layout).
 * En escritorio muestra todo; en móvil solo el logo y el botón del menú.
 */
export function Encabezado() {
  const { t } = useIdioma();
  const rutaActual = usePathname();

  return (
    <header className={estilos.encabezado}>
      <div className={`contenedor ${estilos.barra}`}>
        <Logo />

        <nav className={estilos.navegacion}>
          <ul className={estilos.enlaces}>
            {ENLACES_PRINCIPALES.map((enlace) => (
              <li key={enlace.clave}>
                <Link
                  href={enlace.href}
                  className={estilos.enlace}
                  // aria-current le dice al lector de pantalla en qué página estamos
                  aria-current={rutaActual === enlace.href ? "page" : undefined}
                >
                  {t(`navbar.enlaces.${enlace.clave}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={estilos.acciones}>
          <div className={estilos.buscador}>
            <BuscadorEncabezado />
          </div>
          <PanelAccesibilidad />
          <CambioIdioma />
          <BotonEnlace href={RUTAS.ingresar} variante="secundario" tamano="sm">
            {t("navbar.botones.ingresar")}
          </BotonEnlace>
          <BotonEnlace href={RUTAS.registro} variante="primario" tamano="sm">
            {t("navbar.botones.crearCuenta")}
          </BotonEnlace>
        </div>

        <MenuMovil />
      </div>
    </header>
  );
}
