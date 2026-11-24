"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState, type ComponentProps } from "react";
import { Campo } from "@/componentes/ui/Campo";
import { useIdioma } from "@/contexto/ProveedorIdioma";
import estilos from "./FormularioCuenta.module.css";

type PropsCampoClave = Omit<ComponentProps<typeof Campo>, "type" | "accion">;

/**
 * Campo de contraseña con el botón del ojo para mostrarla u ocultarla.
 * Lo usan Ingresar y Crear cuenta.
 */
export function CampoClave(props: PropsCampoClave) {
  const { t } = useIdioma();
  const [visible, setVisible] = useState(false);

  return (
    <Campo
      {...props}
      type={visible ? "text" : "password"}
      accion={
        <button
          type="button"
          className={estilos.ojo}
          onClick={() => setVisible(!visible)}
          aria-label={t(
            visible
              ? "paginas.ingresar.formulario.botones.ocultarClave"
              : "paginas.ingresar.formulario.botones.mostrarClave",
          )}
        >
          {visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
        </button>
      }
    />
  );
}
