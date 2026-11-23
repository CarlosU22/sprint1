"use client";

import { useIdioma } from "@/contexto/ProveedorIdioma";
import estilos from "./VistaPendiente.module.css";

interface PropsVistaPendiente {
  /** Ruta del título en los textos de la API, por ejemplo "paginas.registro.formulario.titulo" */
  titulo: string;
  /** Ruta del texto de abajo */
  texto: string;
}

/**
 * Vista mínima para las rutas que ya existen pero cuyo contenido se construye
 * después (Crear cuenta, Restablecer la contraseña). Solo muestra un título y
 * un texto que llegan de la API.
 */
export function VistaPendiente({ titulo, texto }: PropsVistaPendiente) {
  const { t } = useIdioma();

  return (
    <div className={`contenedor ${estilos.vista}`}>
      <h1 className={estilos.titulo}>{t(titulo)}</h1>
      <p className={estilos.subtitulo}>{t(texto)}</p>
    </div>
  );
}
