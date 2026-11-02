import { Boton } from "./Boton";
import estilos from "./AvisoCookies.module.css";

interface PropsAvisoCookies {
  titulo: string;
  texto: string;
  textoAceptar: string;
  textoRechazar: string;
  onAceptar: () => void;
  onRechazar: () => void;
}

/**
 * Aviso de cookies (solo la parte visual).
 * La lógica de guardar la decisión está en layout/ControlCookies.tsx.
 *
 * - Es una <section> con título: los lectores de pantalla la anuncian como región.
 * - "Rechazar" y "Aceptar" usan la MISMA clase de tamaño, así tienen el mismo peso.
 */
export function AvisoCookies({
  titulo,
  texto,
  textoAceptar,
  textoRechazar,
  onAceptar,
  onRechazar,
}: PropsAvisoCookies) {
  return (
    <section className={estilos.aviso} aria-labelledby="aviso-cookies-titulo">
      <div className={estilos.contenido}>
        <h2 id="aviso-cookies-titulo" className={estilos.titulo}>
          {titulo}
        </h2>
        <p className={estilos.texto}>{texto}</p>
      </div>
      <div className={estilos.botones}>
        <Boton variante="secundario" className={estilos.boton} onClick={onRechazar}>
          {textoRechazar}
        </Boton>
        <Boton variante="primario" className={estilos.boton} onClick={onAceptar}>
          {textoAceptar}
        </Boton>
      </div>
    </section>
  );
}
