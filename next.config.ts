import type { NextConfig } from "next";

// Usamos el modelo de caché "clásico" de Next.js (sin Cache Components).
// Así podemos leer las cookies `idioma` y `consentimiento` en el layout
// sin tener que envolver todo en <Suspense>. Ver GUIA_DE_ESTUDIO.md.
const nextConfig: NextConfig = {
  cacheComponents: false,
  partialPrefetching: false,
};

export default nextConfig;
