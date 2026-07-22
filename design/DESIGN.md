# Sistema de diseño — Alkance

Landing de consultora de branding y diseño estratégico.
Registro editorial: lienzo crema, pareja tipográfica Garamond/Outfit, banners
partidos a sangre y mucho vacío.
**El rojo es el color de acción y el acento de marca**, heredado del logo; el
negro es texto y secciones invertidas.

---

## 1. Cómo fluye un estilo

```
design/tokens.json          ← única fuente de verdad. Aquí se edita.
        │
        │  node scripts/build-tokens.mjs
        ▼
src/styles/tokens.css       ← GENERADO. Nunca editar a mano.
        │
        ▼
base.css → layout.css → components.css → index.html
```

`tokens.css` se versiona en git aunque sea generado: así Cloudflare Pages
despliega el repo tal cual, sin paso de build. Después de tocar `tokens.json`,
**corre el build y commitea ambos archivos juntos**.

Verificar que no quedó desincronizado (útil en CI):

```bash
node scripts/build-tokens.mjs --check
```

---

## 2. Anatomía de `tokens.json`

Cada grupo de primer nivel se vuelve un bloque de custom properties con prefijo
`--ak-`. La ruta anidada se aplana con guiones:

```json
{ "color": { "accent": { "500": "#E5241A" } } }
```
```css
--ak-color-accent-500: #E5241A;
```

### Alias

`semantic.*` no repite valores: los referencia con `{ruta.al.token}`. El build
los resuelve en cascada.

```json
{ "semantic": { "bg": { "accent": "{color.accent.500}" } } }
```
```css
--ak-semantic-bg-accent: #E5241A;
```

Cambiar `color.accent.500` reencamina todo lo que dependa de él. Los alias
circulares fallan el build con un error explícito.

Las claves que empiezan con `$` (`$meta`, `$comment`) son documentación y no
generan CSS.

### Las dos capas de color

| Capa | Ejemplo | Para qué |
|---|---|---|
| Base | `--ak-color-ink-900` | La paleta cruda. **No usar en componentes.** |
| Semántica | `--ak-semantic-fg-default` | El rol. **Esto es lo que se usa.** |

Un componente que pide `--ak-color-accent-500` en vez de
`--ak-semantic-bg-accent` rompe la indirección: el día que el acento cambie de
rol, ese componente queda huérfano.

---

## 3. Decisiones de marca

### Color

- **Crema** (`bg-canvas` = `cream-100`, `#F7F5F1`) domina. Es el lienzo, no un
  fondo alterno: no existe una sección "blanca" a la que volver. Lo que se
  levanta del lienzo sube medio escalón a `cream-50`, nunca a blanco puro.
- **Negro** (`ink-900`, no `#000`) es texto y secciones invertidas. Ya **no** hay
  botones negros.
- **Rojo** (`accent-600`) es acción y puntuación a la vez: el CTA primario, el
  eyebrow, y la palabra en cursiva del titular. Sube de `accent-500` a `600`
  porque sobre crema el 500 baja de 4.5:1 y el eyebrow es texto pequeño.

Regla práctica: si el rojo ocupa más del ~5% de una pantalla, es demasiado.

### Tipografía

Pareja **serif / sans**. El contraste entre las dos es el gesto principal de la
marca; usar una sola familia colapsa el diseño.

- **Serif** (`family-serif`) titula, y solo titula: `h1`–`h3`, `.display`,
  `.split__title`, `.prefooter__title`. Va en `weight-regular` y
  `tracking-tight`, no en medium ni en `tracking-tighter`: una serif de estilo
  antiguo ya trae su propio contraste de trazo, y apretarla le come las serifas.
- **Cursiva + rojo** es el par que marca la palabra clave de cada titular
  (`<em>` dentro de un encabezado, ya estilado en `base.css`). El color destaca;
  la cursiva cambia el tono. Nunca uno sin el otro.
- **Sans** (`family-sans`) es cuerpo, eyebrows y botones. Nunca titula.
- Cuerpo editorial (`.prose`): `size-base` (18px) + `leading-normal`. El salto de
  escala contra el titular lo da el titular, que ya es el doble de grande; no hay
  que cobrárselo al párrafo achicándolo. Estuvo en `size-sm` y el resultado era
  texto de 15px gris sobre crema, incómodo de leer.
- Eyebrow: `size-xs` + `tracking-widest` + mayúsculas + `fg-accent`, sin adorno.
  `size-xs` (13px) es para texto que se **reconoce**, no que se lee: eyebrows,
  metadatos, el legal del pie. Una frase completa nunca va en `xs`.

La escala usa `clamp()`: no hay media queries de tipografía.

**Las familias:** **EB Garamond** titula y **Outfit** lee. Ambas van
auto-hospedadas en `src/fonts/`, declaradas en `src/styles/fonts.css`. No se
cargan por CDN: Google Fonts mete un tercero en el camino crítico y una petición
a otro dominio antes de poder pintar texto.

- De la Garamond se hospedan **romana y cursiva**, porque la cursiva roja del
  `<em>` es parte del diseño, no un adorno que el navegador pueda inclinar solo.
- La Outfit va como **fuente variable** en el rango 400–600: un archivo cubre los
  tres pesos del sistema (31 KB contra los 94 KB de tres estáticas).
- `unicode-range` separa `latin` de `latin-ext`, así que una página en español
  solo descarga los tres archivos `latin` (~80 KB). Los `latin-ext` quedan en
  disco sin pedirse nunca.
- `font-display: swap` en todas: el texto se pinta de inmediato con la de
  respaldo. Nunca hay texto invisible.
- `index.html` precarga los dos archivos del primer render (Garamond romana y
  Outfit); sin eso el navegador no los descubre hasta parsear `fonts.css`.

**Ojo con la escala:** la Garamond tiene la altura de x muy baja y a igual
`font-size` se ve bastante más pequeña que una sans. Si cambias la serif por otra
de altura de x normal, los tamaños de titular quedarán grandes.

### Movimiento

Alta interacción, pero disciplinada. Nada anima fuera de
`--ak-motion-duration-*` y `--ak-motion-ease-*`.

- `ease-entrance` para lo que aparece, `ease-exit` para lo que se va.
- `ease-spring` solo en respuesta directa al cursor (`:active`).
- `duration-reveal` (900ms) solo para entradas en viewport.
- `base.css` anula toda animación bajo `prefers-reduced-motion: reduce`.

---

## 4. Piezas disponibles

Antes de escribir CSS nuevo, revisa qué ya existe.

**layout.css** — `.container` (`--narrow`, `--wide`), `.section` (`--inverse`,
`--subtle`), `.stack` (`--tight`, `--loose`), `.cluster`, `.grid`, `.grid-auto`,
`.divider`.

**components.css** — `.btn` (`--primary`, `--line`, `--ghost`, `--inverse`),
`.link`, `.link-arrow`, `.eyebrow`, `.prose`, `.card`, `.accent`, `.header`,
`.reveal`, `.form` + `.field`.

**Formularios** — los campos no llevan caja: solo el filete inferior, igual que
el CTA `.btn--line`. En una página donde nada tiene borde de cuatro lados salvo
las tarjetas, un input con marco se lee como pegado de otra web. El estado
inválido usa `:user-invalid` y no `:invalid`, que pintaría de rojo los campos
vacíos antes de que nadie escriba nada.

**Estructura de página** — `.split` (`--reverse`, `--compact`) es el banner
partido que gobierna la portada: media pantalla de texto contra media de foto a
sangre. Cuatro secciones lo usan; alterna `--reverse` para dar ritmo al scroll.
`.capabilities` es la fila de siete columnas con filetes, y `.prefooter` el
cierre sobre crema profunda. Ninguno lleva `.section`: su padding es propio
porque la columna de imagen tiene que llegar al filo del bloque.

Ritmo vertical: todas las secciones usan `--ak-space-section`; el margen lateral,
`--ak-space-gutter`. Ambos con `clamp()`, así que responden solos.

---

## 5. Convenciones de código

- **Sin librerías.** HTML5, CSS, vanilla JS. Sin build, sin bundler, sin CDN.
- **Sin literales en CSS.** Ni hex, ni px, ni ms. Si falta un valor, es un token
  que falta.
- **JS solo maneja estado.** Añade y quita clases (`.is-visible`, `.is-scrolled`);
  la apariencia vive en CSS. Ganchos con `data-*`, no con clases de estilo.
- **Degradación.** Sin JS el sitio debe leerse **y funcionar** completo.
  `.reveal` se muestra igual sin JS y bajo `prefers-reduced-motion`. El
  formulario de contacto hace `POST` nativo y la Function responde con un `303`
  a `/?envio=ok`; el JS solo evita la recarga. Nada del sitio queda inservible
  con JavaScript desactivado.
- **Contraste AA.** 4.5:1 texto normal, 3:1 para ≥24px. Ratios medidos sobre el
  **lienzo crema** (`cream-100`), que es el fondo real del sitio — no sobre
  blanco. Todo baja ~8% respecto de blanco, y eso mueve dos umbrales:

  | Token | Sobre crema | Sobre blanco | Uso |
  |---|---|---|---|
  | `ink-900` | 18.18:1 | 19.80:1 | Texto por defecto |
  | `accent-600` | 6.09:1 | 6.63:1 | Rojo de texto y CTA (`fg-accent`) |
  | `ink-400` | 4.89:1 | 5.33:1 | Texto secundario (`fg-muted`) |
  | `accent-500` | **4.19:1** | 4.57:1 | ✗ **No usar en texto** sobre crema |
  | `ink-350` | 3.17:1 | 3.46:1 | Solo ≥24px (`fg-subtle`) |
  | `ink-300` | **2.79:1** | 3.03:1 | ✗ Sobre crema, ni para texto grande |

  Las dos trampas del lienzo crema: `accent-500` deja de pasar AA para texto
  pequeño (por eso `fg-accent` apunta a `accent-600`) y `ink-300` deja de dar
  3:1 (por eso existe `ink-350`). Sobre negro se invierte el problema:
  `accent-500` da 4.34:1, así que en secciones invertidas el acento va en
  `accent-400` (`fg-accent-inverse`).

  El texto blanco del CTA primario da 6.63:1 sobre `accent-600` y 9.40:1 sobre
  `accent-700` (hover): el botón mejora al interactuar, nunca empeora.

---

## 6. Comandos

| Comando | Para qué |
|---|---|
| `/tokens <cambio>` | Editar tokens y regenerar el CSS |
| `/section <nombre>` | Construir una sección respetando el sistema |

Viven en `.claude/commands/` y están en `.gitignore` — son instrucciones locales
para el agente, no parte del sitio desplegado.

---

## 7. Deploy — Cloudflare Pages

El repo es estático puro. En el dashboard:

- **Framework preset:** None
- **Build command:** *(vacío)*
- **Build output directory:** `/`

Sin paso de build porque `tokens.css` va versionado. Si prefieres generarlo en
Cloudflare, pon `node scripts/build-tokens.mjs` como build command y agrega
`src/styles/tokens.css` al `.gitignore`.
