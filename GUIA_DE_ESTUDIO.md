# Guía de estudio · Proyecto Taquilla (Sprint 1)

Esta guía explica **qué hay en el proyecto, dónde está cada cosa y cómo se conectan las
partes**. Se fue escribiendo a medida que se construía el sprint 1, historia por historia,
así que se puede leer en orden, como un diario de construcción.

> Consejo: abre el código al lado de la guía. Cada sección nombra los archivos que explica.

---

## 1. ¿Qué es Taquilla?

Taquilla es un sitio para descubrir eventos (conciertos, teatro, deportes, festivales…) y,
en sprints futuros, comprar entradas. **No tenemos base de datos propia**: todo lo que se
muestra sale de una API que ya existe:

```
https://yanethm-taquilla-api.fly.dev/api/v1
```

Nuestro proyecto es solo el **frontend**: pide datos a la API y los pinta en pantalla.

### Lo que hace el sprint 1

| Historia     | Qué construye                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------ |
| US-TAQ-S1-01 | La base del proyecto: Next.js, TypeScript, ESLint, Prettier, tokens de diseño y componentes base |
| US-TAQ-S1-02 | Encabezado, navegación, menú móvil y pie de página                                               |
| US-TAQ-S1-03 | Vista 1: Inicio público (destacados y categorías)                                                |
| US-TAQ-S1-04 | Vista 2: Explorar eventos (`/explorar`) con filtros en la URL                                    |
| US-TAQ-S1-05 | Cambio de idioma ES / EN con textos desde la API                                                 |
| US-TAQ-S1-06 | Aviso de cookies (aceptar / rechazar)                                                            |

---

## 2. Tecnologías y por qué se usan

| Herramienta                    | Para qué sirve en el proyecto                                                                                                                 |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Next.js 16 (App Router)**    | Framework de React. Cada carpeta dentro de `src/app` es una ruta del sitio. Permite pedir datos **en el servidor** antes de mandar la página. |
| **React 19**                   | Librería para construir la interfaz con componentes.                                                                                          |
| **TypeScript (modo estricto)** | JavaScript con tipos. El modo `strict` (en `tsconfig.json`) obliga a manejar los `null` y `undefined`, y detecta errores antes de ejecutar.   |
| **ESLint**                     | Revisa el código y avisa de malas prácticas (`npm run lint`).                                                                                 |
| **Prettier**                   | Formatea el código siempre igual (`npm run format`).                                                                                          |
| **CSS Modules**                | Cada componente tiene su `.module.css`. Las clases quedan "privadas" del componente, así no chocan entre sí.                                  |
| **lucide-react**               | Íconos en SVG (lupa, calendario, menú…).                                                                                                      |
| **Git**                        | Una rama por historia y un merge a `main` por historia, con _commits convencionales_.                                                         |

### ¿Servidor o cliente? (lo más importante de Next.js)

En el App Router hay dos tipos de componentes:

- **Componentes de servidor** (los normales): se ejecutan en el servidor. Pueden usar
  `async/await` y llamar a la API directamente. **No** pueden usar `useState`, `onClick`, etc.
- **Componentes de cliente**: empiezan con `"use client"`. Se ejecutan en el navegador y
  pueden tener estado, eventos y efectos.

La regla que seguimos: **los datos se piden en el servidor** (páginas `page.tsx` y el
`layout.tsx`) y se pasan como _props_ a componentes de cliente cuando hace falta
interactividad.

---

## 3. Cómo correr el proyecto

```bash
# 1. Instalar dependencias (solo la primera vez)
npm install

# 2. Crear el archivo de variables de entorno
cp .env.example .env.local

# 3. Levantar el servidor de desarrollo
npm run dev        # abre http://localhost:3000
```

Otros comandos (están en `package.json` → `scripts`):

| Comando                | Qué hace                                                             |
| ---------------------- | -------------------------------------------------------------------- |
| `npm run lint`         | Revisa el código con ESLint                                          |
| `npm run typecheck`    | Revisa los tipos de TypeScript sin compilar                          |
| `npm run format`       | Formatea todo con Prettier                                           |
| `npm run format:check` | Solo revisa si el formato está bien                                  |
| `npm run build`        | Compila la versión de producción (si falla aquí, fallaría en Vercel) |

> La API está en un servidor gratuito que **se apaga cuando nadie la usa**. La primera
> petición del día puede tardar unos segundos mientras "despierta".

---

## 4. Historia por historia

### US-TAQ-S1-01 · Configurar el proyecto y el sistema de diseño

**Rama:** `feat/us-taq-s1-01-configuracion`

#### a) Configuración

| Archivo             | Qué contiene                                                                                                                                                      |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `package.json`      | Dependencias y scripts (`dev`, `build`, `lint`, `typecheck`, `format`).                                                                                           |
| `tsconfig.json`     | Configuración de TypeScript. `"strict": true` activa el modo estricto. El alias `@/*` apunta a `src/*`, por eso importamos `@/lib/api` en vez de `../../lib/api`. |
| `eslint.config.mjs` | Reglas de ESLint de Next.js + `eslint-config-prettier` al final, que apaga las reglas que pelean con Prettier.                                                    |
| `.prettierrc.json`  | Estilo del formato: comillas dobles, punto y coma, 90 caracteres por línea.                                                                                       |
| `next.config.ts`    | Configuración de Next.js. Ver la nota de abajo sobre `cacheComponents`.                                                                                           |
| `.env.example`      | Plantilla de la variable `NEXT_PUBLIC_API_URL`. Se copia como `.env.local` (que **no** se sube a git).                                                            |

**¿Por qué `NEXT_PUBLIC_` al inicio?** En Next.js, solo las variables que empiezan con
`NEXT_PUBLIC_` llegan al navegador. La necesitamos ahí porque al cambiar de idioma el
navegador pide los textos directamente a la API (historia 05).

**Nota sobre `cacheComponents: false`:** Next.js 16 trae por defecto un modo nuevo de
caché ("Cache Components") que obliga a envolver en `<Suspense>` cualquier lectura de
cookies. Como nuestro `layout.tsx` lee las cookies `idioma` y `consentimiento` para decidir
el `<html lang>` y si se muestra el aviso, usamos el modelo clásico, que es más fácil de
entender: si una página lee cookies, se genera en cada petición.

#### b) Tokens de diseño · `src/styles/tokens.css`

Un **token** es un valor de diseño con nombre: en vez de escribir `#141414` en diez lugares,
escribimos `var(--color-primario)`. Los tokens se sacaron del diseño de Figma y están
agrupados así:

- **Colores:** `--color-fondo`, `--color-superficie`, `--color-texto`, `--color-primario`…
- **Tipografía:** `--fuente-base` (Geist), tamaños `--texto-xs` a `--texto-3xl`, pesos.
- **Espacios:** escala de 4 px, `--espacio-1` (4 px) hasta `--espacio-16` (64 px).
- **Radios:** `--radio-sm` (6 px) hasta `--radio-redondo` (píldoras).
- **Medidas de la maqueta:** ancho del contenido, alto del encabezado, alto de los controles…

**Regla del proyecto:** ningún `.module.css` escribe colores, tamaños o espacios a mano;
siempre usa un token. La única excepción son los _breakpoints_ de los `@media` (por ejemplo
`max-width: 640px`), porque CSS no permite usar variables dentro de una media query.

Los tamaños están en `rem` (relativos al tamaño de letra del navegador). Por eso, si la
persona agranda el texto, todo el sitio crece de forma proporcional.

`src/app/globals.css` importa los tokens y define reglas para todo el sitio: un reseteo
básico, el anillo de foco (`:focus-visible`), la clase `.contenedor` (centra el contenido) y
`.solo-lectores` (oculta algo a la vista pero lo deja para los lectores de pantalla).

#### c) Componentes base · `src/componentes/ui/`

Todos tienen estados de **hover**, **foco** (`:focus-visible`) y **deshabilitado**
(`:disabled`) en su CSS.

| Componente           | Uso                                                                                                                                                                  |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Boton.tsx`          | `<Boton>` (un `<button>`) y `<BotonEnlace>` (un `<Link>` con forma de botón). Variantes `primario` (negro), `secundario` (blanco con borde), `fantasma` (sin fondo). |
| `Campo.tsx`          | `<Campo>` (label + input, con ícono opcional) y `<CampoSelect>` (label + select). El `id` es obligatorio para que la etiqueta quede unida al campo con `htmlFor`.    |
| `Etiqueta.tsx`       | Etiqueta pequeña como "Concierto" o "Destacado".                                                                                                                     |
| `Tarjeta.tsx`        | Caja blanca con borde y radio. Base de la tarjeta de evento.                                                                                                         |
| `SelectorIdioma.tsx` | Botones ES / EN. Usa `aria-pressed` para indicar cuál está activo.                                                                                                   |
| `AvisoCookies.tsx`   | El aviso con "Rechazar" y "Aceptar", del mismo tamaño.                                                                                                               |

**Componentes "de presentación":** `SelectorIdioma` y `AvisoCookies` no saben nada de
cookies ni de la API. Solo reciben textos y funciones por _props_ (`onCambiar`,
`onAceptar`…). La lógica se conecta después (historias 05 y 06). Separar "cómo se ve" de
"qué hace" hace que los componentes sean más fáciles de probar y reutilizar.

#### d) Cliente de la API · `src/lib/api.ts` y `src/lib/tipos.ts`

- `tipos.ts` copia en TypeScript los _schemas_ del contrato OpenAPI (`EventoResumen`,
  `Categoria`, `Ciudad`, `Paginacion`…). Así el editor nos avisa si escribimos mal un campo.
- `api.ts` tiene una función base `pedir()` que:
  1. arma la URL con `NEXT_PUBLIC_API_URL`,
  2. hace el `fetch`,
  3. si la respuesta es un error, lanza un `ErrorApi` con el `codigo` que manda la API
     (por ejemplo `validacion` o `falla_simulada`),
  4. si todo sale bien, devuelve el JSON ya tipado.
- Encima de `pedir()` hay una función por endpoint: `obtenerTextos`, `obtenerCategorias`,
  `obtenerCiudades`, `obtenerDestacados`, `buscarEventos`.
- `next: { revalidate: 300 }` le dice a Next.js que puede guardar esa respuesta 5 minutos.
  Los textos y las categorías cambian poco; la búsqueda de eventos se pide siempre (`0`).

#### e) Git y commits convencionales

Cada historia vive en su propia rama y se une a `main` con un _merge_ (`--no-ff`), que hace
el papel del _Pull Request_: el mensaje del merge describe la historia y sus criterios.
Todo el repositorio es **local** (no hay remoto configurado).

Los mensajes siguen _Conventional Commits_: `tipo: descripción`.

| Tipo       | Cuándo                                 |
| ---------- | -------------------------------------- |
| `feat`     | Funcionalidad nueva                    |
| `fix`      | Corrección de un error                 |
| `chore`    | Configuración, dependencias            |
| `style`    | Solo estilos o formato                 |
| `docs`     | Documentación (como esta guía)         |
| `refactor` | Cambiar código sin cambiar lo que hace |

Comandos útiles para revisar la historia del proyecto:

```bash
git log --oneline --graph --all   # ver ramas y merges
git show <hash>                    # ver qué cambió en un commit
```

#### f) Despliegue en Vercel (pendiente, se hace a mano)

El criterio 2 pide desplegar en Vercel. Este proyecto se mantiene **solo en local** (sin
GitHub ni GitLab), así que el despliegue no se hizo. Cuando se quiera hacer, sin subir el
código a ningún repositorio, se puede usar la CLI de Vercel:

```bash
npm i -g vercel
vercel            # primera vez: crea el proyecto en tu cuenta
vercel env add NEXT_PUBLIC_API_URL   # pega la dirección de la API
vercel --prod     # despliega
```

---

### US-TAQ-S1-02 · Navegar por el sitio en web y móvil

**Rama:** `feat/us-taq-s1-02-navegacion`

#### a) El layout raíz · `src/app/layout.tsx`

En Next.js, `layout.tsx` **envuelve todas las páginas**. Lo que se pone aquí aparece en
todas las vistas sin repetirlo:

```
<html lang="es">
  <body>
    <ProveedorIdioma>            ← comparte los textos de la API
      <ProveedorAccesibilidad>   ← comparte las opciones de accesibilidad
        <SaltarAlContenido />    ← enlace oculto para teclado
        <Encabezado />           ← <header> con <nav>
        <main id="contenido">
          {children}             ← aquí se pinta cada page.tsx
        </main>
        <PieDePagina />          ← <footer>
```

El layout es un **componente de servidor** y `async`: antes de pintar nada, pide los textos
a la API con `obtenerTraductorServidor()` (archivo `src/lib/textosServidor.ts`).

#### b) ¿Cómo llegan los textos a los componentes? (contexto de React)

Regla del proyecto: **ningún texto está escrito dentro de un componente**. Todos salen de
`GET /textos`. El camino es:

```
API  ──GET /textos──▶  layout.tsx (servidor)
                          │  props: idioma, textos
                          ▼
                  <ProveedorIdioma>  (src/contexto/ProveedorIdioma.tsx)
                          │  contexto de React
                          ▼
     cualquier componente:  const { t } = useIdioma();
                            t("navbar.botones.ingresar")  →  "Ingresar"
```

- **Contexto de React** (`createContext` + `useContext`): sirve para compartir datos con
  todos los componentes sin pasarlos por _props_ nivel por nivel.
- `src/lib/textos.ts` tiene la función `crearTraductor(textos)`, que devuelve:
  - `t(ruta, variables)`: busca un texto con una **ruta con puntos**
    (`"footer.legal.derechos"`) y reemplaza las llaves (`{anio}` → `2026`).
  - `tPlural(ruta, cantidad)`: escoge entre `uno` y `otro` según la cantidad
    (`"1 evento"` / `"42 eventos"`).
  - Si una ruta no existe, devuelve la misma ruta. Así se ve en pantalla qué texto falta.

¿Por qué los componentes que muestran texto son de **cliente** (`"use client"`)? Porque en la
historia 05 el idioma cambia **sin recargar la página**: el contexto recibe textos nuevos y
todos los componentes que usan `useIdioma()` se vuelven a pintar solos.

#### c) Encabezado y menú móvil · `src/componentes/layout/`

| Archivo                  | Qué hace                                                                                                                                                                                |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Encabezado.tsx`         | `<header>` con logo, `<nav>` (Inicio, Explorar), buscador, botón de accesibilidad, Ingresar y Crear cuenta. Usa `usePathname()` para marcar el enlace actual con `aria-current="page"`. |
| `Logo.tsx`               | Ícono + "taquilla". Siempre lleva a `/`. Tiene dos temas: oscuro (encabezado) y claro (pie).                                                                                            |
| `BuscadorEncabezado.tsx` | Formulario `GET` a `/explorar` con un campo `name="q"`. Escribir "salsa" + Enter lleva a `/explorar?q=salsa`. Usa `<Form>` de `next/form`, que navega sin recargar.                     |
| `MenuMovil.tsx`          | Botón hamburguesa + `<dialog>` con los enlaces, el buscador, los botones y las opciones de accesibilidad.                                                                               |
| `PieDePagina.tsx`        | `<footer>` con logo, lema, tres columnas de enlaces y la línea legal.                                                                                                                   |
| `SaltarAlContenido.tsx`  | Enlace invisible que aparece con la primera tecla Tab y lleva a `<main>`.                                                                                                               |
| `src/lib/navegacion.ts`  | Todas las rutas del sitio (`RUTAS.explorar`…) en un solo lugar.                                                                                                                         |

**¿Cómo cambia entre escritorio y móvil?** Con CSS, no con JavaScript. En
`Encabezado.module.css`, por debajo de 1024 px se esconden la navegación y las acciones; en
`MenuMovil.module.css`, en esa misma medida aparece el botón hamburguesa. No hay barra de
pestañas inferior (lo pide el criterio 2).

**¿Por qué `<dialog>` para el menú móvil?** El elemento nativo `<dialog>` abierto con
`showModal()` ya resuelve el uso con teclado:

- `Escape` lo cierra,
- el foco queda **atrapado** dentro mientras está abierto (Tab no se escapa a la página de atrás),
- al cerrarse, el navegador devuelve el foco al botón que lo abrió,
- `::backdrop` es el fondo oscuro de atrás.

El botón hamburguesa indica su estado con `aria-expanded` y apunta al menú con `aria-controls`.

#### d) HTML semántico

| Etiqueta                | Dónde                                                                                     |
| ----------------------- | ----------------------------------------------------------------------------------------- |
| `<header>`              | `Encabezado.tsx`                                                                          |
| `<nav>`                 | Navegación principal y cada columna del pie (con `aria-labelledby` apuntando a su título) |
| `<main id="contenido">` | `layout.tsx`, una sola vez                                                                |
| `<footer>`              | `PieDePagina.tsx`                                                                         |

**Encabezados en orden:** cada página tiene **un solo `<h1>`** (su título). Las secciones usan
`<h2>` y lo que va dentro de una sección usa `<h3>`. Nunca se salta un nivel.

#### e) Panel de accesibilidad (extra del diseño)

En la barra de Figma hay un botón de accesibilidad que abre un panel. Se agregó porque sale en
el diseño del sprint:

- `src/contexto/ProveedorAccesibilidad.tsx`: guarda las opciones en `localStorage`. Si no hay
  nada guardado, los valores iniciales salen del sistema operativo (`prefers-contrast`,
  `prefers-reduced-motion`). Las aplica como atributos en `<html>` (`data-alto-contraste`…).
- `src/styles/tokens.css` (al final): cada atributo **cambia tokens**. Por ejemplo, alto
  contraste oscurece `--color-texto-suave` y `--color-borde`. Como todos los componentes usan
  tokens, se adaptan solos. Esto muestra por qué los tokens valen la pena.
- `PanelAccesibilidad.tsx` (escritorio) y `MenuMovil.tsx` (móvil) muestran el mismo contenido:
  `OpcionesAccesibilidad.tsx`. Los interruptores son `<button role="switch" aria-checked>`.

#### f) Páginas de Ingresar, Crear cuenta y 404

- `src/app/ingresar/page.tsx` → ruta `/ingresar`
- `src/app/registro/page.tsx` → ruta `/registro`
- `src/app/not-found.tsx` → se muestra cuando una ruta no existe

Los formularios de Ingresar y Crear cuenta son de otro sprint. Por ahora las páginas muestran
el título y el subtítulo que manda la API (`VistaPendiente.tsx`), para que los enlaces del
sprint 1 lleven a una vista real.

Cada página exporta `generateMetadata()`: Next.js la ejecuta en el servidor para poner el
`<title>` de la pestaña con el texto de `paginas.<pagina>.seo.titulo`.
