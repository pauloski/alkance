# Alkance

Landing de la consultora de estrategia, branding y diseño de innovación.

HTML5, CSS y vanilla JS. Sin frameworks, sin bundler, sin dependencias, sin paso
de build en el deploy. El único script del repo es el que convierte los tokens de
diseño en variables CSS.

```
design/tokens.json       → única fuente de verdad de los estilos
scripts/build-tokens.mjs → los convierte en CSS
src/styles/tokens.css    → GENERADO. Nunca editar a mano.
index.html               → la landing
designsystem.html        → el sistema de diseño, vivo
```

---

## Requisitos

Solo **Node.js 18+**, y únicamente para correr el generador de tokens.
El sitio en sí no necesita Node para funcionar.

```bash
node --version   # v18 o superior
```

---

## Paso a paso: actualizar los tokens

### Opción A — a mano (2 pasos)

**1. Edita `design/tokens.json`.**

Por ejemplo, para oscurecer el rojo de marca, busca el token y cambia su
`$value`:

```json
"accent": {
  "500": { "$value": "#E5241A", "$description": "Primitivo. Rojo de marca..." }
}
```

Reglas al editar:

- Los colores nuevos van en `color.*` (capa primitiva).
- Los roles (`semantic.*`) **no repiten valores**: referencian con alias
  `{color.accent.500}`.
- Los componentes (`component.*`) referencian roles, nunca primitivos.
- Todo token lleva `$description` diciendo a qué capa pertenece y cuándo usarlo.

**2. Regenera el CSS.**

```bash
node scripts/build-tokens.mjs
```

Salida esperada:

```
✓ 131 tokens (34 alias) en 12 grupos
✓ 17 componentes extraídos de components.css
  → src/styles/tokens.css
  → src/js/tokens-manifest.js
  → src/js/css-source.js
```

Listo. Recarga el navegador y el cambio está aplicado en todo el sitio.

### Opción B — con Claude Code (1 paso)

```
/tokens haz el rojo de marca más oscuro
```

El comando edita el JSON, corre el build, verifica el contraste WCAG del color
nuevo y reporta qué partes del sitio cambian. Vive en `.claude/commands/` y no se
sube al repo.

---

## Verificar antes de commitear

```bash
node scripts/build-tokens.mjs --check
```

Sale con código 1 si el CSS quedó desincronizado del JSON. Útil en CI o en un
pre-commit hook. **`tokens.css` se versiona**, así que si editas el JSON tienes
que commitear los dos archivos juntos.

El build también **falla** si `components.css` referencia un `var(--ak-…)` que no
existe. Un token mal escrito rompe el estilo en silencio en el navegador; aquí se
detiene antes.

---

## Ver el sitio

Los `<link>` usan rutas relativas, así que `index.html` abre bien con doble clic.
Pero `designsystem.html` **necesita un servidor** para cargar sus scripts:

```bash
python3 -m http.server 8000
```

- Landing: <http://localhost:8000/index.html>
- Design system: <http://localhost:8000/designsystem.html>

---

## Qué hay en el design system

`designsystem.html` no es documentación escrita a mano: se genera desde los
mismos archivos que se despliegan, así que no puede quedar desactualizada.

- Paleta completa con el **contraste real** de cada color sobre blanco.
- Roles semánticos y a qué primitivo apunta cada uno.
- Escala tipográfica y de espaciado, en vivo.
- Componentes con **render + HTML + el CSS real** extraído de `components.css`.
- Tabla filtrable: token → variable CSS → valor → capa → cuándo usarlo.

---

## Iconos

Librería: **[Lucide](https://lucide.dev/icons/)** — ~1600 iconos SVG de trazo,
licencia ISC, por CDN. Se eligió porque cumple lo que hacía falta: SVG editable
(no PNG), el grosor de trazo se controla desde CSS y el color se hereda con
`currentColor`.

```html
<i data-lucide="rocket" class="icon" aria-hidden="true"></i>
```

El diccionario completo concepto → icono está en **`design/ICONS.md`**, y el
catálogo navegable (con copiar al portapapeles) en la sección «Iconos» del design
system. El catálogo se genera parseando las tablas de `ICONS.md`, así que el
documento y la página no pueden contradecirse.

Antes de traer un icono nuevo, revisa que el concepto no esté ya cubierto: dos
iconos para la misma idea rompen el sistema.

## Estructura

```
design/
  tokens.json          Fuente de verdad. Formato W3C DTCG (importable a Figma).
  DESIGN.md            Las decisiones de diseño y por qué.
scripts/
  build-tokens.mjs     JSON → CSS. Sin dependencias.
src/
  styles/
    tokens.css         GENERADO
    base.css           Reset y tipografía
    layout.css         Contenedores y grillas
    components.css     Componentes
    designsystem.css   Solo para designsystem.html
  js/
    main.js            Header, reveals, tabs
    designsystem.js    Motor del design system
    tokens-manifest.js GENERADO
    css-source.js      GENERADO
  img/logos/           Logos de clientes (ver su README)
index.html
designsystem.html
```

---

## Deploy — Cloudflare Pages

El repo es estático puro. En el dashboard:

| Campo | Valor |
|---|---|
| Framework preset | None |
| Build command | *(vacío)* |
| Build output directory | `/` |

No hay paso de build porque `tokens.css` va versionado. Si prefieres generarlo en
Cloudflare, pon `node scripts/build-tokens.mjs` como build command y agrega
`src/styles/tokens.css` al `.gitignore`.

---

## Pendientes

- **Fuente**: los tokens declaran Inter con fallback al stack del sistema. Falta
  auto-hospedar el `.woff2` en `src/fonts/`. No usar Google Fonts por CDN.
- **Logos**: la sección «Confían en nosotros» usa placeholders de dummyimage.
  Ver `src/img/logos/README.md` para reemplazarlos por los SVG definitivos.
- **Imágenes**: todas las de contenido son placeholders de dummyimage.
