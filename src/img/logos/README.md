# Logos de clientes

Ubicación de los logos definitivos en SVG. Hoy la sección «Confían en nosotros»
usa placeholders de `dummyimage.com`.

## Cómo reemplazar un placeholder

1. Deja el `.svg` en esta carpeta con el nombre de la marca en minúsculas:
   `talls.svg`, `foodware.svg`, `aulatec.svg`, `h2v-plus.svg`, `chrysalis.svg`.
2. En `index.html`, sección 7, cambia el `src` y borra `width`/`height`:

   ```html
   <!-- antes -->
   <img class="logos__item" src="https://dummyimage.com/200x60/ffffff/949494&text=TALLS"
        alt="TALLS" width="200" height="60" loading="lazy" />

   <!-- después -->
   <img class="logos__item" src="src/img/logos/talls.svg" alt="TALLS" loading="lazy" />
   ```

No hay que tocar el CSS. `.logos__item` fija la altura y deja el ancho en `auto`,
así que logos de proporciones distintas quedan ópticamente parejos solos.

## Qué debe cumplir cada SVG

- **`viewBox` presente**, sin `width`/`height` fijos en la etiqueta `<svg>`.
  Sin `viewBox` el logo no escala y aparecerá en un tamaño arbitrario.
- **Trazos convertidos a contornos** (texto vectorizado). Un `<text>` que dependa
  de una fuente instalada se renderizará distinto en cada equipo.
- **Optimizado**: sin metadatos de Illustrator/Figma. `npx svgo <archivo>` basta.
- **Un color plano o color de marca.** La sección los muestra en escala de grises
  al 50% de opacidad y recupera el color al hover — eso lo hace el CSS, no el
  archivo. No entregues una versión ya gris.
- **Márgenes recortados**: el `viewBox` debe ceñir el logo. Un SVG con aire
  interno se verá más chico que el resto de la fila.

## Por qué gris y no a color

Cinco logos a todo color compiten con el acento rojo de Alkance y rompen la
jerarquía de la página. El gris los vuelve una textura de credibilidad; el color
aparece solo cuando el visitante se detiene en uno.
