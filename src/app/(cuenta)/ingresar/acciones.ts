"use server";

/*
 * SERVER ACTION DE INGRESAR
 * "use server" hace que esta función se ejecute SIEMPRE en el servidor, aunque
 * la llame un componente de cliente. Así el token de la API nunca llega al
 * navegador: solo viaja en la cookie httpOnly.
 */
import { crearSesion, ErrorApi } from "@/lib/api";
import {
  leerCampo,
  validarIngreso,
  type EstadoIngreso,
  type ErroresIngreso,
} from "@/lib/ingreso";
import { guardarSesion } from "@/lib/sesionServidor";

/** Si la API no manda Retry-After con el 429, esperamos esto */
const ESPERA_POR_DEFECTO = 60;

export async function ingresar(datos: FormData): Promise<EstadoIngreso> {
  const correo = leerCampo(datos, "correo").trim();
  const clave = leerCampo(datos, "clave");
  const mantener = datos.get("mantener") === "si";

  // 1. Validamos otra vez (alguien podría saltarse la validación del navegador)
  const errorDeCampos = validarIngreso(correo, clave);
  if (errorDeCampos) return errorDeCampos;

  try {
    // 2. Pedimos la sesión a la API y guardamos el token en nuestra cookie
    const { token } = await crearSesion(correo, clave);
    await guardarSesion(token, mantener);
    return { tipo: "exito" };
  } catch (error) {
    // 3. La API respondió con un error: cada código es una pantalla de Figma
    if (error instanceof ErrorApi) {
      switch (error.codigo) {
        case "credenciales_invalidas":
          // Un solo mensaje: no decimos si falló el correo o la contraseña
          return { tipo: "credenciales" };
        case "demasiadas_peticiones":
          return {
            tipo: "intentos",
            segundos: error.esperarSegundos ?? ESPERA_POR_DEFECTO,
          };
        case "validacion":
          return {
            tipo: "campos",
            errores: erroresDeLaApi(error.campos),
            faltanDatos: false,
          };
      }
    }
    // 4. Sin respuesta (no hay red) o una falla de la API (500, 503…):
    //    las dos se muestran como el error de conexión, con "Reintentar"
    return { tipo: "conexion" };
  }
}

/** Pasa los mensajes de la API (422) al formato del formulario */
function erroresDeLaApi(campos: Record<string, string> = {}): ErroresIngreso {
  return {
    ...(campos.correo ? { correo: { texto: campos.correo } } : {}),
    ...(campos.clave ? { clave: { texto: campos.clave } } : {}),
  };
}
