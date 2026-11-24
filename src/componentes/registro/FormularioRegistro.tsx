"use client";

import { Check, Circle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { registrar } from "@/app/(cuenta)/registro/acciones";
import { CampoClave } from "@/componentes/cuenta/CampoClave";
import estilos from "@/componentes/cuenta/FormularioCuenta.module.css";
import { Logo } from "@/componentes/layout/Logo";
import { Aviso } from "@/componentes/ui/Aviso";
import { Boton } from "@/componentes/ui/Boton";
import { Campo } from "@/componentes/ui/Campo";
import { useIdioma } from "@/contexto/ProveedorIdioma";
import { leerCampo, type Mensaje } from "@/lib/ingreso";
import { RUTAS } from "@/lib/navegacion";
import {
  requisitosClave,
  validarRegistro,
  type ErroresRegistro,
  type EstadoRegistro,
} from "@/lib/registro";
import propios from "./FormularioRegistro.module.css";

const ESTADO_INICIAL: EstadoRegistro = { tipo: "inicial" };

/** El orden de los campos en pantalla: el foco va al primero que tenga error */
const ORDEN: (keyof ErroresRegistro)[] = ["correo", "documento", "clave"];

/** Igual que en Ingresar: valida en el navegador, llama al servidor y atrapa la falta de red */
async function enviarRegistro(_previo: EstadoRegistro, datos: FormData) {
  const errorDeCampos = validarRegistro(
    leerCampo(datos, "correo").trim(),
    leerCampo(datos, "documento").trim(),
    leerCampo(datos, "clave"),
  );
  if (errorDeCampos) return errorDeCampos;

  try {
    return await registrar(datos);
  } catch {
    return { tipo: "conexion" } satisfies EstadoRegistro;
  }
}

/** Formulario de Crear cuenta: correo, número de identificación y contraseña */
export function FormularioRegistro() {
  const { t } = useIdioma();
  const router = useRouter();
  const [estado, accion, pendiente] = useActionState(enviarRegistro, ESTADO_INICIAL);

  // Campos controlados: lo escrito se conserva si hay un error (ver Ingresar)
  const [correo, setCorreo] = useState("");
  const [documento, setDocumento] = useState("");
  const [clave, setClave] = useState("");

  const refAviso = useRef<HTMLDivElement>(null);
  const refCorreo = useRef<HTMLInputElement>(null);
  const refDocumento = useRef<HTMLInputElement>(null);
  const refClave = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (estado.tipo === "exito") {
      router.replace(RUTAS.inicio);
      router.refresh();
      return;
    }
    if (estado.tipo === "inicial") return;
    // El foco va al primer campo con error; si no hay, a la caja roja
    const refDeCampo = { correo: refCorreo, documento: refDocumento, clave: refClave };
    const primero =
      estado.tipo === "campos" ? ORDEN.find((campo) => estado.errores[campo]) : undefined;
    (primero ? refDeCampo[primero].current : refAviso.current)?.focus();
  }, [estado, router]);

  function textoDe(mensaje?: Mensaje) {
    if (!mensaje) return undefined;
    return "ruta" in mensaje ? t(mensaje.ruta) : mensaje.texto;
  }

  const enviando = pendiente || estado.tipo === "exito";
  const errores = erroresVisibles();
  const requisitos = requisitosClave(clave);

  /** Los errores junto a cada campo. Nunca se modifica `estado`: se arma un objeto nuevo */
  function erroresVisibles(): ErroresRegistro {
    if (enviando) return {};
    if (estado.tipo === "campos") return estado.errores;
    // Con 409 el correo también se marca, como pide el contrato
    if (estado.tipo === "correoEnUso") {
      return { correo: { ruta: "paginas.registro.errores.correoEnUso.campo" } };
    }
    return {};
  }

  function aviso() {
    if (enviando) return null;
    const base = "paginas.registro.errores";
    switch (estado.tipo) {
      case "campos": {
        const cantidad = Object.keys(estado.errores).length;
        return (
          <Aviso
            ref={refAviso}
            titulo={
              cantidad > 0
                ? t(`${base}.resumen`, { cantidad })
                : t("formularios.validacion.revisaDatos")
            }
            texto={estado.otros?.join(" ")}
          />
        );
      }
      case "correoEnUso":
        return (
          <Aviso
            ref={refAviso}
            titulo={t(`${base}.correoEnUso.titulo`)}
            texto={t(`${base}.correoEnUso.texto`)}
          >
            <Link href={RUTAS.ingresar}>{t(`${base}.correoEnUso.botones.ingresar`)}</Link>
            <Link href={RUTAS.recuperarClave}>
              {t(`${base}.correoEnUso.botones.restablecer`)}
            </Link>
          </Aviso>
        );
      case "conexion":
        return (
          <Aviso
            ref={refAviso}
            titulo={t("paginas.ingresar.errores.conexion.titulo")}
            texto={t("paginas.ingresar.errores.conexion.texto")}
          />
        );
      default:
        return null;
    }
  }

  function textoDelBoton() {
    if (enviando) return t("paginas.registro.formulario.mensajes.creando");
    if (estado.tipo === "conexion")
      return t("paginas.ingresar.errores.conexion.botones.reintentar");
    return t("paginas.registro.formulario.botones.crearCuenta");
  }

  return (
    <div className={estilos.formulario}>
      <div className={estilos.logoMovil}>
        <Logo />
      </div>

      <div className={estilos.encabezado}>
        <h1 className={estilos.titulo}>{t("paginas.registro.formulario.titulo")}</h1>
        <p className={estilos.subtitulo}>{t("paginas.registro.formulario.subtitulo")}</p>
      </div>

      <form action={accion} noValidate className={estilos.campos}>
        {aviso()}

        <Campo
          ref={refCorreo}
          id="correo"
          name="correo"
          type="email"
          autoComplete="email"
          etiqueta={t("paginas.registro.formulario.etiquetas.correo")}
          placeholder={t("paginas.registro.formulario.placeholders.correo")}
          value={correo}
          onChange={(evento) => setCorreo(evento.target.value)}
          error={textoDe(errores.correo)}
        />

        <Campo
          ref={refDocumento}
          id="documento"
          name="documento"
          autoComplete="off"
          maxLength={15}
          etiqueta={t("formularios.campos.documento.label")}
          ayuda={t("formularios.campos.documento.ayuda")}
          value={documento}
          onChange={(evento) => setDocumento(evento.target.value)}
          error={textoDe(errores.documento)}
        />

        <CampoClave
          ref={refClave}
          id="clave"
          name="clave"
          autoComplete="new-password"
          etiqueta={t("paginas.registro.formulario.etiquetas.clave")}
          value={clave}
          onChange={(evento) => setClave(evento.target.value)}
          error={textoDe(errores.clave)}
          ayuda={
            <ul className={propios.requisitos}>
              {Object.entries(requisitos).map(([nombre, cumplido]) => (
                <li key={nombre} className={cumplido ? propios.cumplido : undefined}>
                  {cumplido ? (
                    <Check aria-hidden="true" />
                  ) : (
                    <Circle aria-hidden="true" />
                  )}
                  {t(`paginas.registro.formulario.requisitosClave.${nombre}`)}
                </li>
              ))}
            </ul>
          }
        />

        <Boton type="submit" anchoCompleto cargando={enviando}>
          {textoDelBoton()}
        </Boton>
      </form>

      <p className={estilos.pie}>
        {t("paginas.registro.formulario.mensajes.yaTienesCuenta")}{" "}
        <Link href={RUTAS.ingresar} className={estilos.enlace}>
          {t("paginas.registro.formulario.enlaces.ingresar")}
        </Link>
      </p>
    </div>
  );
}
