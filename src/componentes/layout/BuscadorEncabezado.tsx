"use client";

import Form from "next/form";
import { Search } from "lucide-react";
import { useId } from "react";
import { Campo } from "@/componentes/ui/Campo";
import { useIdioma } from "@/contexto/ProveedorIdioma";
import estilos from "./BuscadorEncabezado.module.css";

/**
 * Buscador de la barra. Es un formulario GET hacia /explorar:
 * escribir "salsa" y presionar Enter lleva a /explorar?q=salsa
 *
 * <Form> de next/form funciona como un <form> normal, pero navega
 * sin recargar toda la página.
 */
export function BuscadorEncabezado({ onBuscar }: { onBuscar?: () => void }) {
  const { t } = useIdioma();
  const id = useId();

  return (
    <Form
      action="/explorar"
      role="search"
      className={estilos.buscador}
      onSubmit={onBuscar}
    >
      <Campo
        id={id}
        name="q"
        type="search"
        etiqueta={t("navbar.buscador.aria")}
        ocultarEtiqueta
        placeholder={t("navbar.buscador.placeholder")}
        icono={<Search />}
        className={estilos.campo}
        maxLength={80}
      />
    </Form>
  );
}
