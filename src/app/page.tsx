import { obtenerTextos } from "@/lib/api";

// Página temporal del sprint 1 (historia 01): solo comprueba que la API responde
// y que la variable de entorno NEXT_PUBLIC_API_URL está bien configurada.
export default async function Inicio() {
  const { textos } = await obtenerTextos("es");
  const sitio = textos.sitio as { nombre: string; lema: string };

  return (
    <main className="contenedor">
      <h1>{sitio.nombre}</h1>
      <p>{sitio.lema}</p>
    </main>
  );
}
