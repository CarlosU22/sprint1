/**
 * Layout de las vistas de cuenta (Ingresar): en Figma ocupan toda la pantalla,
 * sin encabezado ni pie. Solo ponemos el <main> al que apunta "Saltar al contenido".
 */
export default function LayoutCuenta({ children }: LayoutProps<"/">) {
  return (
    <main id="contenido" tabIndex={-1}>
      {children}
    </main>
  );
}
