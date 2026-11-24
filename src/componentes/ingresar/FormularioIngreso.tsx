"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { ingresar } from "@/app/(cuenta)/ingresar/acciones";
import { CampoClave } from "@/componentes/cuenta/CampoClave";
import { Logo } from "@/componentes/layout/Logo";
import { Aviso } from "@/componentes/ui/Aviso";
import { Boton } from "@/componentes/ui/Boton";
import { Campo } from "@/componentes/ui/Campo";
import { useIdioma } from "@/contexto/ProveedorIdioma";
import {
  leerCampo,
  validarIngreso,
  type EstadoIngreso,
  type Mensaje,
} from "@/lib/ingreso";
import { RUTAS } from "@/lib/navegacion";
import estilos from "@/componentes/cuenta/FormularioCuenta.module.css";

const ESTADO_INICIAL: EstadoIngreso = { tipo: "inicial" };

/**
 * Se ejecuta al enviar el formulario (lo llama useActionState).
 * 1. Valida en el navegador: si falta algo, ni siquiera se llama al servidor.
 * 2. Llama a la Server Action, que habla con la API.
 * 3. Si la llamada al servidor falla (no hay internet), muestra el error de conexión.
 */
async function enviarIngreso(_previo: EstadoIngreso, datos: FormData) {
  const errorDeCampos = validarIngreso(
    leerCampo(datos, "correo").trim(),
    leerCampo(datos, "clave"),
  );
  if (errorDeCampos) return errorDeCampos;

  try {
    return await ingresar(datos);
  } catch {
    return { tipo: "conexion" } satisfies EstadoIngreso;
  }
}

/** Formulario de la vista 4. Los textos salen de paginas.ingresar (API). */
export function FormularioIngreso() {
  const { t } = useIdioma();
  const router = useRouter();

  // useActionState guarda el último resultado (estado) y dice si se está enviando (pendiente)
  const [estado, accion, pendiente] = useActionState(enviarIngreso, ESTADO_INICIAL);

  // Campos "controlados": React 19 limpia el formulario después de enviarlo, pero
  // Figma pide que lo escrito se conserve si hay un error. Con useState no se pierde.
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [mantener, setMantener] = useState(true);

  const refAviso = useRef<HTMLDivElement>(null);
  const refCorreo = useRef<HTMLInputElement>(null);
  const refClave = useRef<HTMLInputElement>(null);

  // Cada vez que llega un resultado nuevo, movemos el foco a donde está el problema
  useEffect(() => {
    if (estado.tipo === "exito") {
      router.replace(RUTAS.inicio);
      router.refresh(); // el servidor vuelve a pintar todo, ya con la cookie de sesión
    } else if (estado.tipo === "campos") {
      (estado.errores.correo ? refCorreo : refClave).current?.focus();
    } else if (estado.tipo !== "inicial") {
      refAviso.current?.focus();
    }
  }, [estado, router]);

  /** Un mensaje puede ser una ruta de los textos o un texto que ya viene de la API */
  function textoDe(mensaje?: Mensaje) {
    if (!mensaje) return undefined;
    return "ruta" in mensaje ? t(mensaje.ruta) : mensaje.texto;
  }

  const enviando = pendiente || estado.tipo === "exito";
  // Mientras se envía, los errores del intento anterior ya no aplican (Figma: "Ingresando…" va limpio)
  const errores = !enviando && estado.tipo === "campos" ? estado.errores : {};
  const aviso = enviando ? null : textosDelAviso(estado);

  /** Título y texto de la caja roja según el estado (null = sin aviso) */
  function textosDelAviso(actual: EstadoIngreso) {
    const base = "paginas.ingresar.errores";
    switch (actual.tipo) {
      case "campos":
        return {
          titulo: t(`${base}.camposObligatorios.titulo`),
          texto: actual.faltanDatos
            ? t(`${base}.camposObligatorios.texto`)
            : t("formularios.validacion.revisaDatos"),
        };
      case "credenciales":
        return {
          titulo: t(`${base}.credenciales.titulo`),
          texto: t(`${base}.credenciales.texto`),
        };
      case "intentos":
        return {
          titulo: t(`${base}.demasiadosIntentos.titulo`),
          texto: t(`${base}.demasiadosIntentos.texto`, { segundos: actual.segundos }),
        };
      case "conexion":
        return {
          titulo: t(`${base}.conexion.titulo`),
          texto: t(`${base}.conexion.texto`),
        };
      default:
        return null;
    }
  }

  function textoDelBoton() {
    if (enviando) return t("paginas.ingresar.formulario.mensajes.ingresando");
    if (estado.tipo === "conexion")
      return t("paginas.ingresar.errores.conexion.botones.reintentar");
    return t("paginas.ingresar.formulario.botones.ingresar");
  }

  return (
    <div className={estilos.formulario}>
      {/* En móvil el panel negro se oculta: el logo queda aquí arriba */}
      <div className={estilos.logoMovil}>
        <Logo />
      </div>

      <div className={estilos.encabezado}>
        <h1 className={estilos.titulo}>{t("paginas.ingresar.formulario.titulo")}</h1>
        <p className={estilos.subtitulo}>{t("paginas.ingresar.formulario.subtitulo")}</p>
      </div>

      {/* noValidate: los mensajes son los de Figma, no las burbujas del navegador */}
      <form action={accion} noValidate className={estilos.campos}>
        {aviso && <Aviso ref={refAviso} titulo={aviso.titulo} texto={aviso.texto} />}

        <Campo
          ref={refCorreo}
          id="correo"
          name="correo"
          type="email"
          autoComplete="email"
          etiqueta={t("paginas.ingresar.formulario.etiquetas.correo")}
          placeholder={t("paginas.ingresar.formulario.placeholders.correo")}
          value={correo}
          onChange={(evento) => setCorreo(evento.target.value)}
          error={textoDe(errores.correo)}
        />

        <CampoClave
          ref={refClave}
          id="clave"
          name="clave"
          autoComplete="current-password"
          etiqueta={t("paginas.ingresar.formulario.etiquetas.clave")}
          value={clave}
          onChange={(evento) => setClave(evento.target.value)}
          error={textoDe(errores.clave)}
        />

        <div className={estilos.opciones}>
          <label className={estilos.casilla}>
            <input
              type="checkbox"
              name="mantener"
              value="si"
              checked={mantener}
              onChange={(evento) => setMantener(evento.target.checked)}
            />
            {t("paginas.ingresar.formulario.etiquetas.mantenerSesion")}
          </label>
          <Link href={RUTAS.recuperarClave} className={estilos.enlace}>
            {t("paginas.ingresar.formulario.enlaces.olvidasteClave")}
          </Link>
        </div>

        <Boton type="submit" anchoCompleto cargando={enviando}>
          {textoDelBoton()}
        </Boton>
      </form>

      <p className={estilos.pie}>
        {t("paginas.ingresar.formulario.mensajes.sinCuenta")}{" "}
        <Link href={RUTAS.registro} className={estilos.enlace}>
          {t("paginas.ingresar.formulario.enlaces.crearCuenta")}
        </Link>
      </p>
    </div>
  );
}
