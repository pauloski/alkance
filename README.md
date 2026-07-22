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
functions/api/contacto.js→ endpoint del formulario (Cloudflare Pages Function)
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
✓ 150 tokens (40 alias) en 12 grupos
✓ 24 componentes extraídos de components.css
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

- Paleta completa con el **contraste real** de cada color sobre blanco. Ojo: el
  lienzo del sitio es crema, no blanco, y ahí todo baja ~8% — los ratios que
  mandan están en la tabla de `design/DESIGN.md`.
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
  fonts/               EB Garamond y Outfit auto-hospedadas (.woff2)
  styles/
    tokens.css         GENERADO
    fonts.css          @font-face de las fuentes locales
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
functions/
  api/contacto.js      Endpoint POST del formulario. Pages lo publica solo.
index.html
designsystem.html
```

---

## Formulario de contacto

El `<form>` de la sección `#contacto` hace `POST /api/contacto`, que resuelve
**`functions/api/contacto.js`**, una Cloudflare Pages Function. Basta con que el
archivo exista: Pages detecta la carpeta `functions/` y la publica. Tú sigues sin
correr ningún build.

El correo se envía con **[Resend](https://resend.com)** desde la Function.

### Variables de entorno

En *Pages → Settings → Variables and Secrets*:

| Variable | Tipo | Valor |
|---|---|---|
| `RESEND_API_KEY` | **Secret** | Token de <https://resend.com/api-keys> |
| `CONTACT_TO` | Variable | Correo que recibe los mensajes |
| `CONTACT_FROM` | Variable *(opcional)* | Remitente. Por defecto `onboarding@resend.dev` |

### Mientras no haya dominio propio

Resend, sin un dominio verificado, **solo permite enviar desde
`onboarding@resend.dev` y solo hacia la dirección con la que se creó la cuenta.**
Para un formulario de contacto eso alcanza, porque el destino es siempre el mismo
buzón — pero `CONTACT_TO` **tiene que ser exactamente ese correo**, o Resend
rechaza el envío.

Dos consecuencias mientras dure:

- Los mensajes pueden caer en **spam**, porque el remitente es un dominio
  compartido. Conviene crear un filtro en Gmail para `onboarding@resend.dev`.
- Responder funciona igual: la Function manda `reply_to` con el correo del
  visitante, así que responder desde Gmail le llega a él.

**Cuando `alkance.cl` esté con DNS en Cloudflare:** verifica el dominio en Resend
(añade los registros DKIM/SPF que te dé), y luego pon
`CONTACT_FROM = "Alkance <web@alkance.cl>"`. Ahí desaparece la restricción de
destinatario y mejora mucho la entregabilidad. No hay que tocar código.

### Probar en local

```bash
printf 'RESEND_API_KEY=re_xxx\nCONTACT_TO=tu@gmail.com\n' > .dev.vars
npx wrangler pages dev .
```

`.dev.vars` está en `.gitignore`. Un servidor estático (`python3 -m http.server`)
**no** ejecuta las Functions: el formulario dará 405.

### Anti-spam

Hoy hay un *honeypot* (un campo oculto que solo rellenan los bots) más
validación de largo y formato en el servidor. Es suficiente para el spam
automático básico. Si empieza a llegar basura, el siguiente paso es
[Turnstile](https://developers.cloudflare.com/turnstile/), que es gratis y de
Cloudflare — necesita el dominio configurado.

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

- **Logos**: la sección «Confían en nosotros» usa placeholders de dummyimage.
  Ver `src/img/logos/README.md` para reemplazarlos por los SVG definitivos.
- **Imágenes**: las fotos de los banners «Nuestra forma de trabajar», «Nuestra
  filosofía» y del prefooter son placeholders de dummyimage, a la espera de las
  definitivas del cliente. La del hero (`src/img/herobanner.jpg`) es real, pero
  su fondo es casi blanco (#F7F7F7) y se recorta contra el lienzo crema: al
  reemplazarla, pedir una foto de fondo cálido.
