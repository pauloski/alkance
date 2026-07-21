# Sistema de diseño — Alkance

Landing de consultora de branding y diseño estratégico.
Blanco, minimalista, tipografía grande, alta interacción.
**Negro es el color de acción. El rojo es el acento de marca**, heredado del logo.

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

- **Blanco** (`bg-canvas`) domina. El espacio en blanco es el material principal.
- **Negro** (`ink-900`, no `#000`) es acción: botones primarios, bordes fuertes,
  secciones invertidas.
- **Rojo** (`accent-500`) es puntuación, no superficie. Aparece en el punto del
  logotipo, el eyebrow, el subrayado de enlaces, el foco, y en el **hover del
  botón primario** — el único lugar donde negro y rojo se tocan.

Regla práctica: si el rojo ocupa más del ~5% de una pantalla, es demasiado.

### Tipografía

Sans moderna, pesos bajos en tamaños grandes, tracking negativo agresivo.
`font-size-5xl` va de 60px a 144px según viewport — el display es el gesto.

- Titulares: `weight-medium` + `tracking-tighter` + `leading-tight`.
- Cuerpo: `size-base`, `leading-normal`, `max-width: 68ch`.
- Eyebrow: `size-xs` + `tracking-widest` + mayúsculas.

La escala usa `clamp()`: no hay media queries de tipografía.

**Pendiente:** los tokens declaran `Inter Variable` con fallback al stack del
sistema. Para fijar la identidad hay que auto-hospedar el `.woff2` en
`src/fonts/` y declarar el `@font-face` con `font-display: swap`. No usar
Google Fonts por CDN: es una dependencia externa y un tercero en el crítico.

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

**components.css** — `.btn` (`--primary`, `--ghost`), `.link`, `.eyebrow`,
`.card`, `.accent`, `.header`, `.reveal`.

Ritmo vertical: todas las secciones usan `--ak-space-section`; el margen lateral,
`--ak-space-gutter`. Ambos con `clamp()`, así que responden solos.

---

## 5. Convenciones de código

- **Sin librerías.** HTML5, CSS, vanilla JS. Sin build, sin bundler, sin CDN.
- **Sin literales en CSS.** Ni hex, ni px, ni ms. Si falta un valor, es un token
  que falta.
- **JS solo maneja estado.** Añade y quita clases (`.is-visible`, `.is-scrolled`);
  la apariencia vive en CSS. Ganchos con `data-*`, no con clases de estilo.
- **Degradación.** Sin JS el sitio debe leerse completo. `.reveal` es la única
  pieza que depende de JS, y bajo `prefers-reduced-motion` se muestra igual.
- **Contraste AA.** 4.5:1 texto normal, 3:1 para ≥24px. Ratios medidos sobre
  blanco:

  | Token | Ratio | Uso |
  |---|---|---|
  | `ink-900` | 19.80:1 | Texto por defecto |
  | `accent-600` | 6.63:1 | Rojo sobre texto pequeño |
  | `ink-400` | 5.33:1 | Texto secundario (`fg-muted`) |
  | `accent-500` | 4.57:1 | Rojo de marca — pasa AA, con poco margen |
  | `ink-300` | 3.03:1 | **Solo ≥24px o elementos no textuales** |

  `accent-500` sobre `ink-900` da 4.34:1: **no usar rojo sobre negro para texto
  pequeño**; en secciones invertidas, el acento va en display o en fondos.
  `fg-subtle` (`ink-300`) no sirve para cuerpo de texto.

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
