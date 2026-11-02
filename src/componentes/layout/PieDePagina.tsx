"use client";

import Link from "next/link";
import { useIdioma } from "@/contexto/ProveedorIdioma";
import { RUTAS } from "@/lib/navegacion";
import { Logo } from "./Logo";
import estilos from "./PieDePagina.module.css";

// Columnas del pie. Los textos salen de footer.columnas.<columna>.titulo
// y footer.columnas.<columna>.enlaces.<clave>
const COLUMNAS = [
  {
    clave: "explora",
    enlaces: [
      { clave: "inicio", href: RUTAS.inicio },
      { clave: "explorar", href: RUTAS.explorar },
    ],
  },
  {
    clave: "cuenta",
    enlaces: [
      { clave: "ingresar", href: RUTAS.ingresar },
      { clave: "crearCuenta", href: RUTAS.registro },
    ],
  },
  {
    clave: "legal",
    enlaces: [
      // Estas dos páginas se construyen en sprints futuros
      { clave: "terminos", href: RUTAS.terminos },
      { clave: "accesibilidad", href: RUTAS.accesibilidad },
    ],
  },
];

/** Pie de página: aparece en todas las vistas (lo pone el layout). */
export function PieDePagina() {
  const { t } = useIdioma();

  return (
    <footer className={estilos.pie}>
      <div className="contenedor">
        <div className={estilos.arriba}>
          <div className={estilos.marca}>
            <Logo tema="claro" />
            <p className={estilos.lema}>{t("footer.lema")}</p>
          </div>

          <div className={estilos.columnas}>
            {COLUMNAS.map((columna) => (
              <nav key={columna.clave} aria-labelledby={`pie-${columna.clave}`}>
                <h2 id={`pie-${columna.clave}`} className={estilos.tituloColumna}>
                  {t(`footer.columnas.${columna.clave}.titulo`)}
                </h2>
                <ul className={estilos.lista}>
                  {columna.enlaces.map((enlace) => (
                    <li key={enlace.clave}>
                      <Link href={enlace.href} className={estilos.enlace}>
                        {t(`footer.columnas.${columna.clave}.enlaces.${enlace.clave}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className={estilos.abajo}>
          <p>{t("footer.legal.derechos", { anio: new Date().getFullYear() })}</p>
          <p>{t("footer.legal.nota")}</p>
        </div>
      </div>
    </footer>
  );
}
