"use client";

/*
 * CONTEXTO DE IDIOMA Y TEXTOS
 *
 * Un "contexto" de React sirve para compartir datos con TODOS los componentes
 * sin tener que pasarlos por props nivel por nivel.
 *
 * El layout (servidor) pide los textos a la API y se los entrega a este
 * proveedor. Cualquier componente de cliente puede leerlos con:
 *
 *   const { t } = useIdioma();
 *   t("navbar.enlaces.inicio")
 *
 * Al cambiar de idioma (selector ES | EN), el proveedor pide los textos
 * nuevos a la API DESDE EL NAVEGADOR y los cambia en el estado: todos los
 * componentes que usan useIdioma() se vuelven a pintar en el otro idioma,
 * sin recargar la página.
 */
import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { obtenerTextos } from "@/lib/api";
import { COOKIE_IDIOMA, aceptoCookies, escribirCookie } from "@/lib/cookies";
import { crearTraductor } from "@/lib/textos";
import type { Idioma, TextosAnidados } from "@/lib/tipos";

interface ValorIdioma {
  idioma: Idioma;
  textos: TextosAnidados;
  t: ReturnType<typeof crearTraductor>["t"];
  tPlural: ReturnType<typeof crearTraductor>["tPlural"];
  cambiarIdioma: (nuevo: Idioma) => Promise<void>;
  /** true mientras llegan los textos del otro idioma */
  cambiando: boolean;
}

const ContextoIdioma = createContext<ValorIdioma | null>(null);

interface PropsProveedor {
  idioma: Idioma;
  textos: TextosAnidados;
  children: ReactNode;
}

export function ProveedorIdioma({
  idioma: idiomaInicial,
  textos: textosIniciales,
  children,
}: PropsProveedor) {
  const router = useRouter();
  const [idioma, setIdioma] = useState(idiomaInicial);
  const [textos, setTextos] = useState(textosIniciales);
  const [cambiando, setCambiando] = useState(false);
  const [aviso, setAviso] = useState("");

  // Guardamos los textos que ya pedimos para no pedirlos dos veces.
  // useRef guarda un valor entre renders SIN volver a pintar el componente.
  const textosGuardados = useRef<Partial<Record<Idioma, TextosAnidados>>>({
    [idiomaInicial]: textosIniciales,
  });

  // Criterio: <html lang> cambia con el idioma (lo usan los lectores de pantalla)
  useEffect(() => {
    document.documentElement.lang = idioma;
  }, [idioma]);

  async function cambiarIdioma(nuevo: Idioma) {
    if (nuevo === idioma) return;
    setCambiando(true);

    try {
      // 1. Pedimos los textos a la API (o los sacamos de los que ya teníamos)
      let nuevosTextos = textosGuardados.current[nuevo];
      if (!nuevosTextos) {
        nuevosTextos = (await obtenerTextos(nuevo)).textos;
        textosGuardados.current[nuevo] = nuevosTextos;
      }

      // 2. Cambiamos el estado: toda la interfaz se vuelve a pintar
      setIdioma(nuevo);
      setTextos(nuevosTextos);
      setAviso(crearTraductor(nuevosTextos).t("idioma.cambiado"));

      // 3. Solo si la persona aceptó las cookies, recordamos el idioma
      if (aceptoCookies()) {
        escribirCookie(COOKIE_IDIOMA, nuevo);
        // Pedimos al servidor la página de nuevo para que el <title> también cambie
        router.refresh();
      }
    } catch (error) {
      // Si la API falla, nos quedamos en el idioma actual
      console.error("No se pudieron cargar los textos del idioma", nuevo, error);
    } finally {
      setCambiando(false);
    }
  }

  // useMemo: solo volvemos a crear el traductor si cambian los textos
  const traductor = useMemo(() => crearTraductor(textos), [textos]);

  const valor: ValorIdioma = { idioma, textos, ...traductor, cambiarIdioma, cambiando };

  return (
    <ContextoIdioma.Provider value={valor}>
      {children}
      {/* Región invisible: el lector de pantalla anuncia "Language changed to English." */}
      <p className="solo-lectores" aria-live="polite">
        {aviso}
      </p>
    </ContextoIdioma.Provider>
  );
}

/** Hook para leer el idioma y los textos desde cualquier componente de cliente */
export function useIdioma() {
  const valor = useContext(ContextoIdioma);
  if (!valor) {
    throw new Error("useIdioma debe usarse dentro de <ProveedorIdioma>");
  }
  return valor;
}
