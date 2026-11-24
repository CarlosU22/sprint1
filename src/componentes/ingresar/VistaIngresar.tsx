import { FormularioIngreso } from "./FormularioIngreso";
import { PresentacionIngreso } from "./PresentacionIngreso";
import estilos from "./VistaIngresar.module.css";

/** Vista 4 · Iniciar sesión: panel negro a la izquierda y formulario a la derecha */
export function VistaIngresar() {
  return (
    <div className={estilos.vista}>
      <PresentacionIngreso />
      <div className={estilos.lado}>
        <FormularioIngreso />
      </div>
    </div>
  );
}
