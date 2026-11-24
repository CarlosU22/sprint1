"use server";

/*
 * SERVER ACTION DE CREAR CUENTA
 * Igual que la de Ingresar: corre en el servidor, así el token nunca llega al navegador.
 *
 * IMPORTANTE · El formulario pide correo, número de identificación y contraseña
 * (decisión del equipo). La API, en cambio:
 *   - EXIGE `nombre` (2 a 80 caracteres): sin él responde 422 y no crea la cuenta.
 *   - NO guarda el número de identificación: su identificador único es el correo.
 * Por eso el documento se valida en el formulario pero no se envía. Si el formulario
 * pide el nombre (o la API deja de exigirlo), solo hay que agregarlo en crearCuenta().
 */
import { crearCuenta, ErrorApi } from "@/lib/api";
import { leerCampo } from "@/lib/ingreso";
import {
  validarRegistro,
  type ErroresRegistro,
  type EstadoRegistro,
} from "@/lib/registro";
import { guardarSesion } from "@/lib/sesionServidor";

/** Los campos que tiene el formulario: los demás errores de la API no se pueden marcar */
const CAMPOS_DEL_FORMULARIO = ["correo", "clave"] as const;

export async function registrar(datos: FormData): Promise<EstadoRegistro> {
  const correo = leerCampo(datos, "correo").trim();
  const documento = leerCampo(datos, "documento").trim();
  const clave = leerCampo(datos, "clave");

  // 1. Validamos otra vez (alguien podría saltarse la validación del navegador)
  const errorDeCampos = validarRegistro(correo, documento, clave);
  if (errorDeCampos) return errorDeCampos;

  try {
    // 2. La API crea la cuenta y deja la sesión abierta (12 horas)
    const { token } = await crearCuenta({ correo, clave });
    await guardarSesion(token, true);
    return { tipo: "exito" };
  } catch (error) {
    if (error instanceof ErrorApi) {
      if (error.codigo === "correo_en_uso") return { tipo: "correoEnUso" };
      if (error.codigo === "validacion") return estadoDeValidacion(error.campos);
    }
    // 3. Sin respuesta (no hay red) o una falla de la API: error de conexión
    return { tipo: "conexion" };
  }
}

/**
 * 422: los errores de correo y clave van junto a su campo. Los de otros datos
 * (por ejemplo `nombre`, que el formulario no pide) se muestran en el aviso.
 */
function estadoDeValidacion(campos: Record<string, string> = {}): EstadoRegistro {
  const errores: ErroresRegistro = {};
  for (const campo of CAMPOS_DEL_FORMULARIO) {
    if (campos[campo]) errores[campo] = { texto: campos[campo] };
  }

  const otros = Object.entries(campos)
    .filter(([campo]) => !(CAMPOS_DEL_FORMULARIO as readonly string[]).includes(campo))
    .map(([campo, mensaje]) => `${campo}: ${mensaje}`);

  return { tipo: "campos", errores, ...(otros.length > 0 ? { otros } : {}) };
}
