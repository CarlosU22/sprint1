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

---

### US-TAQ-S1-03 · Inicio público

**Rama:** `feat/us-taq-s1-03-inicio`

#### a) La página · `src/app/page.tsx`

`page.tsx` dentro de `src/app` es la ruta `/`. Es un **componente de servidor `async`**:

```ts
const [destacados, categorias, ciudades] = await Promise.all([
  obtenerDestacados(), // GET /eventos/destacados
  obtenerCategorias(), // GET /categorias
  obtenerCiudades(), // GET /ciudades
]);
```

`Promise.all` lanza las tres peticiones **al mismo tiempo** y espera a que terminen todas.
Si se hicieran con tres `await` seguidos, cada una esperaría a la anterior.

Después pide `GET /eventos?ciudad=<ciudad con más eventos>&orden=fecha&porPagina=4` para la
sección "Próximamente en …". La ciudad **no está escrita a mano**: es la primera de
`GET /ciudades`, que viene ordenada de más a menos eventos.

Con los datos listos, la página pinta las secciones y les pasa los datos por _props_:

```
page.tsx (servidor)
 ├─ <Hero destacado ciudades categorias />      componentes/inicio/Hero.tsx
 ├─ <ListaCategorias categorias />              componentes/inicio/ListaCategorias.tsx
 ├─ <SeccionEventos "destacados" eventos />     componentes/inicio/SeccionEventos.tsx
 └─ <SeccionEventos "proximos" eventos />            └─ <TarjetaEvento /> por cada evento
```

#### b) Datos vs. textos (¡importante!)

En cada tarjeta hay dos tipos de información:

| Viene de…                                                       | Ejemplos                                                                     | ¿Se traduce?                   |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------ |
| **Datos del catálogo** (`/eventos`, `/categorias`, `/ciudades`) | "Noche de Salsa Brava", "Teatro Aurora", 95000, número de eventos            | **No**. Llegan como están.     |
| **Textos de la interfaz** (`/textos`)                           | "Desde", "Ver evento", "Concierto", "42 eventos", "Próximamente en {ciudad}" | **Sí**, cambian con el idioma. |

El nombre visible de cada categoría sale de `general.categorias.<id>` (los textos de la
interfaz); de `/categorias` se usan el `id` (para el enlace) y el número de eventos.

#### c) Componentes nuevos

| Archivo                                  | Qué hace                                                                                                                                                                                                                                                           |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `componentes/inicio/Hero.tsx`            | Título, subtítulo, buscador grande y tarjeta del evento destacado (el primero de `/eventos/destacados`). El buscador es un `<Form action="/explorar">` con campos `q`, `ciudad` y `fecha`: al enviarlo, el navegador arma la URL `/explorar?q=…&ciudad=…&fecha=…`. |
| `componentes/inicio/ListaCategorias.tsx` | Las seis categorías. Cada una enlaza a `/explorar?categoria=<id>`. El ícono se elige con un objeto `ICONOS[id]`.                                                                                                                                                   |
| `componentes/inicio/SeccionEventos.tsx`  | Título + subtítulo + "Ver todos" + grilla de tarjetas. Se usa dos veces con distintos textos.                                                                                                                                                                      |
| `componentes/ui/TarjetaEvento.tsx`       | Tarjeta de un evento. Se reutiliza en Explorar. "Ver evento" lleva a `/eventos/<slug>` (vista 3, sprint 2).                                                                                                                                                        |
| `componentes/ui/Afiche.tsx`              | La API no manda fotos, manda `afiche: { color1, color2, patron }`. Se pinta con un `linear-gradient` y el patrón con degradados repetidos (`repeating-linear-gradient`…). Los colores entran como variables CSS en `style`, porque llegan en tiempo de ejecución.  |
| `componentes/ui/EstadoPagina.tsx`        | Bloque para los estados de carga, vacío y error.                                                                                                                                                                                                                   |
| `src/lib/formatos.ts`                    | `formatearFecha`, `formatearHora` y `formatearPrecio` con `Intl` (ver abajo).                                                                                                                                                                                      |

#### d) Fechas y precios con `Intl`

La API manda `"fecha": "2026-11-15T01:00:00.000Z"` (UTC). En Colombia eso es el sábado 14 a
las 8:00 p. m. Por eso `formatos.ts` usa siempre `timeZone: "America/Bogota"`.

```ts
formatearFecha("2026-11-15T01:00:00.000Z", "es")  // "Sáb 14 nov"
formatearFecha("2026-11-15T01:00:00.000Z", "en")  // "Sat Nov 14"
formatearHora(...)                                  // "8:00 p. m." / "8:00 PM"
formatearPrecio(95000)                              // "$95.000"
```

Las piezas se unen con los textos de la API: `general.formatos.fechaYHora` es
`"{fecha} · {hora}"`. Así, hasta el separador "·" viene de la API.

#### e) `loading.tsx` y `error.tsx`

Son **archivos especiales** de Next.js:

- `src/app/loading.tsx`: se muestra **mientras** la página espera los datos (Next.js lo
  envuelve en un `<Suspense>` por nosotros).
- `src/app/error.tsx`: se muestra si la página lanza un error (por ejemplo, la API cae). Su
  prop `retry()` vuelve a pedir los datos.

Para probarlos se puede simular lentitud o error en la API con las cabeceras
`X-Simular-Latencia: 2000` o `X-Simular-Error: 503` (ver la documentación de la API).

#### f) Diseño adaptable (_responsive_)

Todo se hace con CSS Grid y media queries:

| Elemento   | Escritorio                    | Tablet (< 1024 px) | Móvil               |
| ---------- | ----------------------------- | ------------------ | ------------------- |
| Hero       | texto + destacado lado a lado | apilados           | buscador en columna |
| Categorías | 6 columnas                    | 3 columnas         | 2 columnas          |
| Tarjetas   | 4 columnas                    | 2 columnas         | 1 columna           |

`minmax(0, 1fr)` en las columnas evita que un texto muy largo (por ejemplo en inglés) estire
la grilla y cause desbordes horizontales.

---

### US-TAQ-S1-04 · Explorar eventos

**Rama:** `feat/us-taq-s1-04-explorar`

#### a) La idea central: los filtros viven en la URL

```
/explorar?categoria=teatro&ciudad=Manizales&q=salsa&orden=precio&pagina=2
```

La URL es la **fuente de la verdad**. No hay un `useState` con los filtros: si se recarga la
página o se comparte el enlace, los filtros siguen ahí porque están en la dirección.

El ciclo completo cuando alguien marca "Teatro":

```
1. Clic en "Teatro"               (Filtros.tsx, cliente)
2. navegar({ categoria: "teatro" })
3. crearUrlExplorar(...)  →  "/explorar?categoria=teatro"      (lib/filtros.ts)
4. router.push(url)               cambia la URL sin recargar
5. Next.js vuelve a ejecutar      src/app/explorar/page.tsx  (servidor)
6. leerFiltros(searchParams)  →  { categoria: "teatro", ... }
7. crearParametrosApi(filtros)  →  GET /eventos?categoria=teatro&orden=fecha&pagina=1&porPagina=9
8. La página manda los eventos nuevos a <VistaExplorar> y React actualiza la pantalla
```

#### b) `src/lib/filtros.ts`: funciones puras

Una **función pura** recibe datos y devuelve datos, sin tocar React ni la pantalla. Por eso
son fáciles de entender y de probar.

| Función                              | Entrada → Salida                                                                                                                                                     |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `leerFiltros(searchParams)`          | Parámetros de la URL → objeto `FiltrosExplorar`. Lo inválido se ignora (`orden=xyz` queda en `fecha`, `pagina=-3` queda en `1`).                                     |
| `crearParametrosApi(filtros)`        | Objeto → parámetros de `GET /eventos`. Convierte `fecha=mes` en `desde`/`hasta`.                                                                                     |
| `rangoDeFecha(opcion)`               | `"hoy"`, `"finDeSemana"`, `"mes"` → `{ desde, hasta }` en hora de Colombia.                                                                                          |
| `crearUrlExplorar(filtros, cambios)` | Objeto + cambios → nueva URL. Si cambia un filtro, vuelve a la página 1. No escribe los valores por defecto (`orden=fecha`, `pagina=1`) para que la URL quede corta. |

#### c) Archivos de la vista

| Archivo                                      | Tipo     | Qué hace                                                                                                            |
| -------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| `src/app/explorar/page.tsx`                  | Servidor | Lee `searchParams`, pide `/eventos`, `/categorias` y `/ciudades` con `Promise.all` y se los pasa a `VistaExplorar`. |
| `componentes/explorar/VistaExplorar.tsx`     | Cliente  | Arma la vista: migas, título, total, filtros, chips, orden, grilla, vacío y paginación. Define `navegar()`.         |
| `componentes/explorar/Filtros.tsx`           | Cliente  | Categoría (radios), fecha (píldoras con `aria-pressed`), ciudad (`<select>`) y precio (`<input type="range">`).     |
| `componentes/explorar/FiltrosActivos.tsx`    | Cliente  | Chips "Teatro ×". La × quita ese filtro.                                                                            |
| `componentes/explorar/Paginacion.tsx`        | Cliente  | Números con "…" (`1 2 3 … 11`). Son **enlaces**, no botones: cada página tiene su URL.                              |
| `componentes/explorar/PanelFiltrosMovil.tsx` | Cliente  | En móvil, botón "Filtros" que abre los mismos filtros en un `<dialog>` ("Filtros abiertos" en Figma).               |

#### d) Detalles que vale la pena entender

- **`useTransition`** (en `VistaExplorar`): mientras llega la respuesta del servidor,
  `cargando` es `true` y la grilla se atenúa en vez de quedar en blanco.
- **`router.push(url, { scroll: false })`**: cambia la URL sin saltar al inicio de la página
  cada vez que se marca un filtro.
- **El control de precio** guarda el valor en un estado local mientras se arrastra, y solo
  cambia la URL al soltar (`onPointerUp`, `onKeyUp`). Si no, se llamaría a la API en cada
  píxel.
- **`key` para reiniciar un componente**: `<ControlPrecio key={filtros.precioMax}>`. Cuando
  "Limpiar" cambia el precio, la `key` cambia y React crea el control de nuevo con el valor
  correcto.
- **El mismo componente dos veces**: `Filtros` se dibuja en la barra lateral (escritorio) y en
  el panel móvil. Para que los `id` de los campos no se repitan se usa `useId()`.
- **`aria-live="polite"`** en "51 eventos coinciden con tus filtros": el lector de pantalla
  anuncia el nuevo total cada vez que se filtra.
- **Detalle de evento**: cada tarjeta enlaza a `/eventos/<slug>`. Esa vista es del sprint 2;
  por ahora muestra la página 404 del proyecto.

#### e) Decisiones y límites conocidos

- **Categoría única:** la API recibe una sola `categoria`, así que se usan _radios_ (dibujados
  como cuadritos para parecerse a Figma) con una opción "Todos".
- **Precio:** la API solo tiene `precioMax`, así que el control tiene un solo extremo (Figma
  muestra dos). El tope de $300.000 es una constante en `filtros.ts`.
- **"Elegir fechas":** no se implementó. La API no trae textos para las etiquetas de los dos
  campos de fecha ("desde"/"hasta"), y escribirlos a mano rompería la regla de los textos.
  Están Hoy, Este fin de semana y Este mes.
- **Título "Explorar eventos":** `paginas.explorar` no tiene título propio en la API; se usa
  `footer.columnas.explora.enlaces.explorar`, que tiene exactamente ese texto en ambos idiomas.

---

### US-TAQ-S1-05 · Cambiar el idioma entre español e inglés

**Rama:** `feat/us-taq-s1-05-idioma`

#### a) Qué pasa cuando se pulsa "EN"

```
1. Clic en EN                       SelectorIdioma (ui) → CambioIdioma (layout)
2. cambiarIdioma("en")              contexto/ProveedorIdioma.tsx
3. GET /textos?idioma=en            ¡desde el NAVEGADOR! (la API permite CORS)
4. setTextos(textosEn)              el estado del contexto cambia…
5. …todos los componentes que usan useIdioma() se vuelven a pintar en inglés
6. useEffect → document.documentElement.lang = "en"     (<html lang>)
7. ¿La persona aceptó las cookies?
      sí → cookie idioma=en  +  router.refresh()  (para que el <title> también cambie)
      no → no se guarda nada
8. Un <p aria-live> invisible anuncia "Language changed to English."
```

No se recarga la página: solo cambian los textos. Por eso, en la historia 02, todo lo que
muestra texto se hizo como componente de cliente que lee `useIdioma()`.

#### b) ¿Y al volver a entrar al sitio?

En `src/lib/textosServidor.ts`, `obtenerIdiomaActual()` lee la cookie `idioma` **en el
servidor** con `cookies()` de `next/headers` (en Next.js 16 es asíncrona: `await cookies()`).

- Si existe → el layout pide los textos en ese idioma y pone `<html lang="en">` desde el
  primer HTML (sin "parpadeo" en español).
- Si no existe → español.

La cookie solo existe si la persona aceptó las cookies (historia 06). Si las rechazó, el idioma
elegido dura mientras navega por el sitio (el estado vive en el layout, que no se desmonta al
cambiar de página), pero al recargar vuelve a español.

#### c) Archivos

| Archivo                                   | Qué hace                                                                                                                                                        |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/contexto/ProveedorIdioma.tsx`        | Ahora tiene estado (`useState`) para `idioma` y `textos`, y la función `cambiarIdioma`. Guarda en un `useRef` los textos ya pedidos para no pedirlos dos veces. |
| `src/lib/cookies.ts`                      | `leerCookie`, `escribirCookie`, `borrarCookie` y `aceptoCookies()` usando `document.cookie`. Nombres de las cookies en constantes.                              |
| `src/lib/textosServidor.ts`               | Lee la cookie `idioma` en el servidor.                                                                                                                          |
| `src/componentes/layout/CambioIdioma.tsx` | Conecta el `SelectorIdioma` (solo visual, historia 01) con el contexto. Está en el encabezado y en el menú móvil (sección "Idioma").                            |

#### d) Conceptos

- **`useState` vs. `useRef`**: los dos guardan valores entre renders, pero cambiar un
  `useState` vuelve a pintar el componente y cambiar un `useRef` no. Los textos visibles van en
  `useState`; el "caché" de textos ya pedidos va en `useRef`.
- **`useEffect`**: sirve para sincronizar React con algo de afuera; aquí, el atributo `lang`
  de `<html>`, que React no controla directamente.
- **`router.refresh()`**: le pide al servidor que vuelva a ejecutar los componentes de
  servidor de la página actual (el layout lee la cookie nueva y `generateMetadata` pone el
  `<title>` en inglés) sin perder el estado de los componentes de cliente.

#### e) Lo que NO se traduce

Los **datos del catálogo** (títulos de eventos, recintos, ciudades, precios) llegan de la API
tal cual y no cambian con el idioma. Lo que sí cambia con el idioma es el **formato** de fechas
y horas (`Sáb 14 nov · 8:00 p. m.` → `Sat Nov 14 · 8:00 PM`), porque es parte de la interfaz.

#### f) Que el inglés no rompa la interfaz

Los textos en inglés pueden ser más largos. Lo que evita que algo se desborde:

- Columnas con `minmax(0, 1fr)` y `min-width: 0` en los hijos de _flex_.
- `overflow-wrap: anywhere` en títulos de tarjetas y categorías.
- Botones con `flex-wrap` en sus filas (`.pie` de la tarjeta).
- Se revisó con el navegador en 390, 768, 1024, 1280 y 1440 px, en ambos idiomas, que
  `document.documentElement.scrollWidth` nunca supere el ancho de la ventana.

---

### US-TAQ-S1-06 · Aceptar o rechazar las cookies

**Rama:** `feat/us-taq-s1-06-cookies`

#### a) Cómo funciona

```
Primera visita (no hay cookie "consentimiento")
  layout.tsx (servidor) ── obtenerConsentimiento() → null
        │
        └─ <ControlCookies mostrarAviso={true} />  →  se ve el aviso

Clic en "Aceptar"                         Clic en "Rechazar"
  consentimiento=aceptado                   consentimiento=rechazado
  idioma=<idioma actual>                    se borra la cookie idioma
        └──────────── el aviso desaparece y no vuelve a salir ────────────┘
```

- La decisión se lee **en el servidor** (`src/lib/cookiesServidor.ts`). Por eso el aviso
  viene en el primer HTML cuando hace falta, y no aparece y desaparece al cargar.
- Rechazar también guarda una cookie (`consentimiento=rechazado`). Es una cookie _necesaria_:
  sin ella, el sitio no sabría que ya preguntó y mostraría el aviso en cada visita.
- Si se rechaza, el sitio **funciona igual**: se puede navegar, filtrar y cambiar de idioma.
  Lo único que cambia es que el idioma no se recuerda al volver (historia 05).

#### b) Archivos

| Archivo                                     | Qué hace                                                            |
| ------------------------------------------- | ------------------------------------------------------------------- |
| `src/componentes/ui/AvisoCookies.tsx`       | Solo lo visual (historia 01): título, texto y dos botones.          |
| `src/componentes/layout/ControlCookies.tsx` | La lógica: muestra u oculta el aviso y escribe o borra las cookies. |
| `src/lib/cookiesServidor.ts`                | `obtenerConsentimiento()`: lee la cookie en el servidor.            |
| `src/lib/cookies.ts`                        | Nombres de las cookies y funciones para el navegador (historia 05). |

#### c) Mismo peso visual y teclado

- "Rechazar" y "Aceptar" usan el mismo componente `Boton`, con la misma altura y el mismo
  ancho mínimo (`--ancho-boton-minimo`). Así ninguno "empuja" a la persona a aceptar.
- El aviso es una `<section aria-labelledby>`: los lectores de pantalla lo anuncian como una
  región con el título "Usamos cookies".
- Está al **inicio del HTML** (justo después de "Saltar al contenido"), aunque con CSS se vea
  abajo. Así, con dos Tab ya se llega a "Rechazar".
- Al decidir, el aviso desaparece y el foco pasa a `<main id="contenido" tabIndex={-1}>`, para
  que quien usa teclado no quede "perdido" al inicio de la página.

#### d) Cómo probarlo

Las cookies se ven en las herramientas del navegador: **F12 → Aplicación → Cookies →
http://localhost:3000**. Para volver a ver el aviso, borra la cookie `consentimiento` y
recarga.

---

## 5. Mapa del proyecto

```
taquilla/
├── .env.example              ← plantilla de NEXT_PUBLIC_API_URL
├── GUIA_DE_ESTUDIO.md        ← esta guía
├── next.config.ts            ← configuración de Next.js
├── eslint.config.mjs         ← reglas de ESLint
├── .prettierrc.json          ← formato del código
└── src/
    ├── app/                          ← RUTAS (cada carpeta = una URL)
    │   ├── layout.tsx                  envuelve todas las páginas
    │   ├── globals.css                 estilos globales
    │   ├── page.tsx                    /            (Inicio)
    │   ├── loading.tsx                 estado de carga
    │   ├── error.tsx                   estado de error
    │   ├── not-found.tsx               página 404
    │   ├── explorar/page.tsx           /explorar
    │   ├── ingresar/page.tsx           /ingresar
    │   └── registro/page.tsx           /registro
    │
    ├── componentes/
    │   ├── ui/                       ← COMPONENTES BASE reutilizables
    │   │   ├── Boton, Campo, Etiqueta, Tarjeta
    │   │   ├── SelectorIdioma, AvisoCookies   (solo visuales)
    │   │   ├── TarjetaEvento, Afiche
    │   │   └── EstadoPagina
    │   ├── layout/                   ← PIEZAS DEL LAYOUT
    │   │   ├── Encabezado, MenuMovil, PieDePagina, Logo
    │   │   ├── BuscadorEncabezado, SaltarAlContenido
    │   │   ├── CambioIdioma, ControlCookies   (conectan lo visual con la lógica)
    │   │   ├── PanelAccesibilidad, OpcionesAccesibilidad
    │   │   └── VistaPendiente, NoEncontrado
    │   ├── inicio/                   ← SECCIONES DE LA VISTA 1
    │   │   └── Hero, ListaCategorias, SeccionEventos
    │   └── explorar/                 ← PIEZAS DE LA VISTA 2
    │       └── VistaExplorar, Filtros, FiltrosActivos, Paginacion, PanelFiltrosMovil
    │
    ├── contexto/                     ← ESTADO COMPARTIDO (React Context)
    │   ├── ProveedorIdioma.tsx         idioma + textos + cambiarIdioma
    │   └── ProveedorAccesibilidad.tsx  opciones del panel de accesibilidad
    │
    ├── lib/                          ← LÓGICA SIN INTERFAZ
    │   ├── api.ts                      llamadas a la API
    │   ├── tipos.ts                    tipos del contrato OpenAPI
    │   ├── textos.ts                   t() y tPlural()
    │   ├── textosServidor.ts           textos e idioma en el servidor
    │   ├── cookies.ts                  cookies en el navegador
    │   ├── cookiesServidor.ts          cookies en el servidor
    │   ├── filtros.ts                  URL ⇄ filtros ⇄ parámetros de la API
    │   ├── formatos.ts                 fechas y precios
    │   └── navegacion.ts               rutas del sitio
    │
    └── styles/
        └── tokens.css                ← TOKENS DE DISEÑO (colores, tipografía, espacios…)
```

**Regla para ubicar un archivo nuevo:**

- ¿Es una URL? → `src/app/`
- ¿Se ve en pantalla y se reutiliza en varias vistas? → `componentes/ui/`
- ¿Es parte de una sola vista? → `componentes/<vista>/`
- ¿Es lógica sin interfaz (cálculos, llamadas, formatos)? → `lib/`
- ¿Es un dato que muchos componentes necesitan a la vez? → `contexto/`

---

## 6. Cómo se hila todo (visión completa)

```
                       ┌──────────────────────────────┐
                       │  API Taquilla (fly.dev)      │
                       │  /textos /categorias /ciudades│
                       │  /eventos /eventos/destacados │
                       └──────────────┬───────────────┘
                                      │ fetch (lib/api.ts)
              ┌───────────────────────┴────────────────────────┐
              │ SERVIDOR (Next.js)                             │
              │                                                │
              │ layout.tsx                                     │
              │  ├ cookie idioma ──► GET /textos?idioma=…       │
              │  ├ cookie consentimiento ──► ¿mostrar aviso?    │
              │  └ <ProveedorIdioma textos>                     │
              │                                                │
              │ page.tsx (/)          explorar/page.tsx         │
              │  └ destacados,          └ searchParams ──►       │
              │    categorías,            leerFiltros ──►        │
              │    ciudades               GET /eventos?...       │
              └───────────────────────┬────────────────────────┘
                                      │ HTML + datos como props
              ┌───────────────────────┴────────────────────────┐
              │ NAVEGADOR (componentes "use client")           │
              │                                                │
              │ useIdioma() → t("…")   en todos los componentes  │
              │                                                │
              │ Selector ES|EN ──► GET /textos (desde el navegador)│
              │                    └► setTextos → todo se repinta │
              │                                                │
              │ Filtros ──► router.push(nueva URL) ──► el servidor│
              │             vuelve a ejecutar explorar/page.tsx │
              │                                                │
              │ Aviso de cookies ──► document.cookie             │
              └────────────────────────────────────────────────┘
```

Tres ideas que lo resumen:

1. **Los datos se piden en el servidor** y bajan como _props_.
2. **Los textos viven en un contexto** para poder cambiar de idioma sin recargar.
3. **Los filtros viven en la URL**, que es la fuente de la verdad de Explorar.

---

## 7. Glosario

| Término                    | Significado                                                                                                                            |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **App Router**             | Sistema de rutas de Next.js basado en carpetas dentro de `src/app`.                                                                    |
| **Componente de servidor** | Se ejecuta en el servidor; puede ser `async` y llamar a la API. No tiene estado ni eventos.                                            |
| **Componente de cliente**  | Empieza con `"use client"`; se ejecuta en el navegador y puede usar `useState`, `onClick`…                                             |
| **Props**                  | Datos que un componente padre le pasa a un hijo.                                                                                       |
| **Estado (`useState`)**    | Dato que, al cambiar, hace que React vuelva a pintar el componente.                                                                    |
| **Contexto**               | Forma de compartir datos con muchos componentes sin pasar _props_ nivel por nivel.                                                     |
| **Hook**                   | Función de React que empieza con `use` (`useState`, `useEffect`, `useIdioma`…).                                                        |
| **Token de diseño**        | Valor de diseño con nombre (`--color-primario`) guardado como variable CSS.                                                            |
| **CSS Modules**            | Archivos `.module.css` cuyas clases solo aplican al componente que los importa.                                                        |
| **searchParams**           | Los parámetros de la URL después del `?`.                                                                                              |
| **Hidratación**            | Cuando React "toma el control" en el navegador del HTML que generó el servidor. El HTML del servidor y el del cliente deben coincidir. |
| **CORS**                   | Permiso que da una API para que la llamen desde páginas de otros dominios.                                                             |
| **Cookie**                 | Dato pequeño que el navegador guarda y envía al servidor en cada petición.                                                             |
| **aria-\***                | Atributos que dan información extra a los lectores de pantalla (`aria-label`, `aria-expanded`, `aria-current`…).                       |
| **Conventional Commits**   | Formato de mensajes de commit: `tipo: descripción`.                                                                                    |

---

## 8. Preguntas para repasar

1. ¿Por qué `src/app/page.tsx` puede usar `await` y `Hero.tsx` no?
2. Si quisieras cambiar el negro de todos los botones, ¿qué archivo tocarías? ¿Por qué solo ese?
3. Explica paso a paso qué pasa desde que marcas "Teatro" en Explorar hasta que ves los
   eventos nuevos.
4. ¿Por qué los filtros están en la URL y no en un `useState`?
5. ¿Qué diferencia hay entre `t("…")` y `tPlural("…", n)`? Da un ejemplo de cada uno.
6. Si una persona rechaza las cookies y cambia a inglés, ¿qué ve al recargar? ¿Por qué?
7. ¿Por qué el menú móvil usa `<dialog>` y no un `<div>`? Nombra tres cosas que da gratis.
8. ¿Qué hace `Promise.all` y por qué es mejor que tres `await` seguidos?
9. ¿Por qué el nombre de un evento no cambia al pasar a inglés, pero "Ver evento" sí?
10. ¿Qué pasaría si `NEXT_PUBLIC_API_URL` no tuviera el prefijo `NEXT_PUBLIC_`?

---

## 9. Pendientes conocidos del sprint 1

- **Despliegue en Vercel:** no se hizo porque el proyecto se mantiene solo en local. Los pasos
  están en la historia 01, sección f.
- **Diseño móvil de Figma:** se construyó a partir de las capturas de escritorio y de los
  paneles móviles; conviene compararlo contra los marcos móviles de Figma.
- **"Elegir fechas"** en Explorar: falta porque la API no trae textos para sus etiquetas.
- **Precio con dos extremos:** la API solo acepta `precioMax`.
- **Enlaces a páginas futuras:** "Términos de uso", "Accesibilidad" y el detalle de cada evento
  (`/eventos/<slug>`) muestran la página 404 hasta que se construyan en otros sprints.
