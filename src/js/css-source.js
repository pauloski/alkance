/* GENERADO por scripts/build-tokens.mjs — NO EDITAR A MANO.
 * CSS real de cada componente, extraído de src/styles/components.css.
 */
window.AK_CSS = [
  {
    "name": "Botón",
    "css": ".btn {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: var(--ak-space-2);\n  min-height: var(--ak-size-tap);\n  padding: var(--ak-space-4) var(--ak-space-6);\n  border-radius: var(--ak-component-button-radius);\n  font-family: var(--ak-font-family-sans);\n  font-size: var(--ak-font-size-xs);\n  font-weight: var(--ak-font-weight-medium);\n  letter-spacing: var(--ak-font-tracking-widest);\n  text-transform: uppercase;\n  white-space: nowrap;\n  transition: background var(--ak-motion-duration-fast) var(--ak-motion-ease-standard),\n    color var(--ak-motion-duration-fast) var(--ak-motion-ease-standard),\n    box-shadow var(--ak-motion-duration-fast) var(--ak-motion-ease-standard),\n    transform var(--ak-motion-duration-instant) var(--ak-motion-ease-spring);\n}\n\n.btn:active {\n  transform: scale(0.97);\n}\n\n/* En móvil el nowrap es insostenible: \"Agendar una sesión estratégica\" en\n   versalitas con tracking widest mide ~390px y desborda el viewport entero (y\n   el overflow-x:hidden del body lo esconde en vez de avisar). Aquí la etiqueta\n   se parte en dos líneas y el botón pasa a ocupar el ancho de la columna. */\n@media (max-width: 520px) {\n  .btn {\n    white-space: normal;\n    text-align: center;\n    padding-inline: var(--ak-space-5);\n  }\n\n  .btn--line {\n    min-width: 0;\n    text-align: start;\n  }\n}\n\n.btn--primary {\n  background: var(--ak-component-button-primary-bg);\n  color: var(--ak-component-button-primary-fg);\n}\n\n.btn--primary:hover {\n  background: var(--ak-component-button-primary-bg-hover);\n  box-shadow: var(--ak-shadow-accent);\n}\n\n/* CTA secundario: no es un botón con caja, es una línea. La regla inferior\n   ocupa todo el ancho y la flecha se separa del texto con margin-inline-start\n   auto, así el gesto es \"seguir leyendo hacia allá\", no \"pulsar aquí\". */\n.btn--line {\n  justify-content: flex-start;\n  gap: var(--ak-space-4);\n  /* Suelto ocupa un ancho fijo para que la regla no se encoja hasta el texto;\n     dentro de .split__actions, el flex de ahí lo estira al resto de la fila. */\n  min-width: 240px;\n  padding-inline: 0;\n  padding-block: var(--ak-space-3);\n  color: var(--ak-semantic-fg-default);\n  border-bottom: var(--ak-border-hairline) solid var(--ak-semantic-border-default);\n  transition: border-color var(--ak-motion-duration-fast) var(--ak-motion-ease-standard),\n    color var(--ak-motion-duration-fast) var(--ak-motion-ease-standard);\n}\n\n.btn--line .btn__arrow {\n  margin-inline-start: auto;\n}\n\n.btn--line:hover {\n  border-bottom-color: var(--ak-semantic-border-accent);\n  color: var(--ak-semantic-fg-accent);\n}\n\n/* La flecha del CTA avanza al hover. Es la misma microinteracción de\n   .link-arrow, reutilizada aquí para que todo lo accionable se comporte igual. */\n.btn__arrow {\n  transition: transform var(--ak-motion-duration-base) var(--ak-motion-ease-entrance);\n}\n\n.btn:hover .btn__arrow {\n  transform: translateX(var(--ak-space-2));\n}\n\n.btn--ghost {\n  color: var(--ak-component-button-ghost-fg);\n  box-shadow: inset 0 0 0 var(--ak-border-hairline) var(--ak-component-button-ghost-border);\n}\n\n.btn--ghost:hover {\n  box-shadow: inset 0 0 0 var(--ak-border-thick) var(--ak-semantic-border-strong);\n}\n\n/* Sobre fondo negro se invierte: blanco es la acción. */\n.btn--inverse {\n  background: var(--ak-semantic-bg-canvas);\n  color: var(--ak-semantic-fg-default);\n}\n\n.btn--inverse:hover {\n  background: var(--ak-semantic-bg-accent);\n  color: var(--ak-semantic-fg-on-accent);\n}\n\n.btn--lg {\n  padding: var(--ak-space-5) var(--ak-space-7);\n  font-size: var(--ak-font-size-base);\n}",
    "tokens": [
      "--ak-border-hairline",
      "--ak-border-thick",
      "--ak-component-button-ghost-border",
      "--ak-component-button-ghost-fg",
      "--ak-component-button-primary-bg",
      "--ak-component-button-primary-bg-hover",
      "--ak-component-button-primary-fg",
      "--ak-component-button-radius",
      "--ak-font-family-sans",
      "--ak-font-size-base",
      "--ak-font-size-xs",
      "--ak-font-tracking-widest",
      "--ak-font-weight-medium",
      "--ak-motion-duration-base",
      "--ak-motion-duration-fast",
      "--ak-motion-duration-instant",
      "--ak-motion-ease-entrance",
      "--ak-motion-ease-spring",
      "--ak-motion-ease-standard",
      "--ak-semantic-bg-accent",
      "--ak-semantic-bg-canvas",
      "--ak-semantic-border-accent",
      "--ak-semantic-border-default",
      "--ak-semantic-border-strong",
      "--ak-semantic-fg-accent",
      "--ak-semantic-fg-default",
      "--ak-semantic-fg-on-accent",
      "--ak-shadow-accent",
      "--ak-size-tap",
      "--ak-space-2",
      "--ak-space-3",
      "--ak-space-4",
      "--ak-space-5",
      "--ak-space-6",
      "--ak-space-7"
    ]
  },
  {
    "name": "Enlace",
    "css": ".link {\n  position: relative;\n  font-weight: var(--ak-font-weight-medium);\n}\n\n.link::after {\n  content: \"\";\n  position: absolute;\n  inset-inline: 0;\n  bottom: -0.15em;\n  height: var(--ak-border-thick);\n  background: var(--ak-semantic-bg-accent);\n  transform: scaleX(0);\n  transform-origin: right;\n  transition: transform var(--ak-motion-duration-base) var(--ak-motion-ease-entrance);\n}\n\n.link:hover::after {\n  transform: scaleX(1);\n  transform-origin: left;\n}\n\n/* Enlace con flecha que se desplaza al hover. */\n.link-arrow {\n  display: inline-flex;\n  align-items: center;\n  gap: var(--ak-space-3);\n  font-size: var(--ak-font-size-lg);\n  font-weight: var(--ak-font-weight-medium);\n  color: var(--ak-semantic-fg-accent);\n}\n\n.link-arrow::after {\n  content: \"→\";\n  transition: transform var(--ak-motion-duration-base) var(--ak-motion-ease-entrance);\n}\n\n.link-arrow:hover::after {\n  transform: translateX(var(--ak-space-2));\n}",
    "tokens": [
      "--ak-border-thick",
      "--ak-font-size-lg",
      "--ak-font-weight-medium",
      "--ak-motion-duration-base",
      "--ak-motion-ease-entrance",
      "--ak-semantic-bg-accent",
      "--ak-semantic-fg-accent",
      "--ak-space-2",
      "--ak-space-3"
    ]
  },
  {
    "name": "Eyebrow",
    "css": "/* Rótulo de sección: rojo, en versalitas muy espaciadas y sin ningún adorno.\n   Antes llevaba un punto rojo delante; se quitó porque ahora el rojo está en la\n   propia palabra y el punto sumaba un segundo acento a dos centímetros del\n   primero. En este diseño el eyebrow es el ÚNICO texto rojo pequeño. */\n.eyebrow {\n  display: inline-flex;\n  align-items: center;\n  gap: var(--ak-space-2);\n  font-family: var(--ak-font-family-sans);\n  font-size: var(--ak-font-size-xs);\n  font-weight: var(--ak-font-weight-semibold);\n  letter-spacing: var(--ak-font-tracking-widest);\n  text-transform: uppercase;\n  color: var(--ak-semantic-fg-accent);\n}\n\n.eyebrow--inverse {\n  color: var(--ak-semantic-fg-accent-inverse);\n}",
    "tokens": [
      "--ak-font-family-sans",
      "--ak-font-size-xs",
      "--ak-font-tracking-widest",
      "--ak-font-weight-semibold",
      "--ak-semantic-fg-accent",
      "--ak-semantic-fg-accent-inverse",
      "--ak-space-2"
    ]
  },
  {
    "name": "Tarjeta",
    "css": ".card {\n  display: flex;\n  flex-direction: column;\n  gap: var(--ak-space-4);\n  padding: var(--ak-space-6);\n  border-radius: var(--ak-radius-lg);\n  background: var(--ak-component-card-bg);\n  box-shadow: inset 0 0 0 var(--ak-border-hairline) var(--ak-component-card-border);\n  transition: box-shadow var(--ak-motion-duration-base) var(--ak-motion-ease-standard),\n    transform var(--ak-motion-duration-base) var(--ak-motion-ease-standard);\n}\n\n.card:hover {\n  transform: translateY(calc(var(--ak-space-1) * -1));\n  box-shadow: inset 0 0 0 var(--ak-border-hairline) var(--ak-component-card-border-hover),\n    var(--ak-shadow-md);\n}\n\n.card__media {\n  margin: calc(var(--ak-space-6) * -1) calc(var(--ak-space-6) * -1) 0;\n  border-radius: var(--ak-radius-lg) var(--ak-radius-lg) 0 0;\n  overflow: hidden;\n}\n\n.card__media img {\n  width: 100%;\n  transition: transform var(--ak-motion-duration-slow) var(--ak-motion-ease-standard);\n}\n\n.card:hover .card__media img {\n  transform: scale(1.04);\n}\n\n.card__body {\n  display: flex;\n  flex-direction: column;\n  gap: var(--ak-space-3);\n  flex: 1;\n}\n\n.card__foot {\n  margin-top: auto;\n  padding-top: var(--ak-space-4);\n}",
    "tokens": [
      "--ak-border-hairline",
      "--ak-component-card-bg",
      "--ak-component-card-border",
      "--ak-component-card-border-hover",
      "--ak-motion-duration-base",
      "--ak-motion-duration-slow",
      "--ak-motion-ease-standard",
      "--ak-radius-lg",
      "--ak-shadow-md",
      "--ak-space-1",
      "--ak-space-3",
      "--ak-space-4",
      "--ak-space-6"
    ]
  },
  {
    "name": "Badge",
    "css": ".badge {\n  display: inline-block;\n  align-self: flex-start;\n  padding: var(--ak-space-1) var(--ak-space-3);\n  border-radius: var(--ak-radius-pill);\n  background: var(--ak-semantic-bg-accent);\n  color: var(--ak-semantic-fg-on-accent);\n  font-size: var(--ak-font-size-xs);\n  font-weight: var(--ak-font-weight-medium);\n  letter-spacing: var(--ak-font-tracking-wide);\n  text-transform: uppercase;\n}",
    "tokens": [
      "--ak-font-size-xs",
      "--ak-font-tracking-wide",
      "--ak-font-weight-medium",
      "--ak-radius-pill",
      "--ak-semantic-bg-accent",
      "--ak-semantic-fg-on-accent",
      "--ak-space-1",
      "--ak-space-3"
    ]
  },
  {
    "name": "Acento tipográfico",
    "css": ".accent {\n  color: var(--ak-semantic-fg-accent);\n}\n\n/* Sobre fondo oscuro hay que subir un escalón de la rampa. fg-accent es\n   accent-600, calibrado contra el lienzo crema: sobre negro da 2.99:1 y no pasa\n   ni el umbral de texto grande. accent-400 (fg-accent-inverse) da 5.43:1.\n   Sin esta regla, el \"marca\" rojo del titular del pie es ilegible. */\n.section--inverse .accent {\n  color: var(--ak-semantic-fg-accent-inverse);\n}\n\n.display {\n  font-family: var(--ak-font-family-serif);\n  font-size: var(--ak-font-size-5xl);\n  font-weight: var(--ak-font-weight-regular);\n  line-height: var(--ak-font-leading-snug);\n  letter-spacing: var(--ak-font-tracking-tight);\n  text-wrap: balance;\n}\n\n.lead {\n  font-size: var(--ak-font-size-lg);\n  color: var(--ak-semantic-fg-muted);\n  line-height: var(--ak-font-leading-normal);\n}\n\n/* Cuerpo de las secciones editoriales.\n   Va en size-base (18px), que es EL token de cuerpo del sistema: nació con la\n   nota \"18px, no 16px, porque el minimalismo exige que lo poco que hay se lea\n   cómodo\". Estuvo un tiempo en size-sm buscando el contraste de escala contra el\n   titular serif, y el resultado fue texto de 15px gris sobre crema: el salto lo\n   da igual el titular, que es el doble de grande, sin cobrarle la legibilidad al\n   párrafo.\n   El interlineado baja de relaxed (1.7) a normal (1.5) al subir el tamaño: son\n   la misma altura de línea en píxeles, y a 18px el 1.7 desarma el párrafo en\n   líneas sueltas.\n   La medida de 54ch se mantiene: a 18px son ~600px, dentro del rango cómodo de\n   45-75 caracteres. */\n.prose {\n  display: flex;\n  flex-direction: column;\n  gap: var(--ak-space-5);\n  font-size: var(--ak-font-size-base);\n  line-height: var(--ak-font-leading-normal);\n  color: var(--ak-semantic-fg-muted);\n  max-width: 54ch;\n}\n\n.prose p {\n  max-width: none;\n}\n\n.prose strong {\n  font-weight: var(--ak-font-weight-semibold);\n  color: var(--ak-semantic-fg-default);\n}\n\n.section--inverse .lead {\n  color: var(--ak-semantic-fg-inverse-muted);\n}",
    "tokens": [
      "--ak-font-family-serif",
      "--ak-font-leading-normal",
      "--ak-font-leading-snug",
      "--ak-font-size-5xl",
      "--ak-font-size-base",
      "--ak-font-size-lg",
      "--ak-font-tracking-tight",
      "--ak-font-weight-regular",
      "--ak-font-weight-semibold",
      "--ak-semantic-fg-accent",
      "--ak-semantic-fg-accent-inverse",
      "--ak-semantic-fg-default",
      "--ak-semantic-fg-inverse-muted",
      "--ak-semantic-fg-muted",
      "--ak-space-5"
    ]
  },
  {
    "name": "Header",
    "css": ".header {\n  position: sticky;\n  top: 0;\n  z-index: var(--ak-layer-sticky);\n  background: color-mix(in srgb, var(--ak-semantic-bg-canvas) 80%, transparent);\n  backdrop-filter: blur(12px);\n  border-bottom: var(--ak-border-hairline) solid transparent;\n  transition: border-color var(--ak-motion-duration-base) var(--ak-motion-ease-standard);\n}\n\n/* .is-scrolled lo aplica src/js/main.js */\n.header.is-scrolled {\n  border-bottom-color: var(--ak-component-header-border-scrolled);\n}\n\n.header__inner {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: var(--ak-space-5);\n  min-height: var(--ak-space-8);\n  padding-block: var(--ak-space-3);\n}\n\n.header__brand {\n  font-size: var(--ak-font-size-lg);\n  font-weight: var(--ak-font-weight-semibold);\n  letter-spacing: var(--ak-font-tracking-tight);\n}\n\n.header__nav {\n  display: flex;\n  align-items: center;\n  gap: var(--ak-space-6);\n}\n\n@media (max-width: 768px) {\n  .header__nav .link {\n    display: none;\n  }\n}",
    "tokens": [
      "--ak-border-hairline",
      "--ak-component-header-border-scrolled",
      "--ak-font-size-lg",
      "--ak-font-tracking-tight",
      "--ak-font-weight-semibold",
      "--ak-layer-sticky",
      "--ak-motion-duration-base",
      "--ak-motion-ease-standard",
      "--ak-semantic-bg-canvas",
      "--ak-space-3",
      "--ak-space-5",
      "--ak-space-6",
      "--ak-space-8"
    ]
  },
  {
    "name": "Banner partido",
    "css": "/* La estructura que gobierna la página: media pantalla de texto contra media\n   pantalla de foto, a sangre y sin contenedor. Es lo que hace que el sitio se\n   lea como una revista y no como una landing de producto.\n   Reglas del componente:\n   · la foto SIEMPRE llega a sangre al borde exterior — cover, sin marco ni\n     sombra ni radio; el corte lo hace ella, no una línea;\n   · el texto NO se pega al borde: se alinea con el eje del .container del resto\n     del sitio, aunque su columna mida media pantalla;\n   · .split--reverse alterna el lado de la foto para que el scroll tenga ritmo.\n   No lleva .section a propósito: el padding vertical vive en .split__body,\n   porque la columna de imagen tiene que llegar hasta el filo del bloque. */\n.split {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  align-items: center;\n  background: var(--ak-component-hero-bg);\n}\n\n/* Invierte el lado de la foto cambiando el orden VISUAL, no el del DOM: así el\n   texto sigue leyéndose primero con lector de pantalla y al colapsar a una\n   columna no hay que reordenar nada. */\n.split--reverse .split__media {\n  order: -1;\n}\n\n.split__body {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  gap: var(--ak-space-6);\n  width: 100%;\n  max-width: calc(var(--ak-size-container) / 2);\n  padding: var(--ak-space-9) var(--ak-space-gutter);\n}\n\n/* Con la foto a la derecha, el texto se empuja hacia el centro para caer sobre\n   el eje del contenedor. Con la foto a la izquierda ya nace ahí y no hace falta. */\n.split:not(.split--reverse) .split__body {\n  margin-inline-start: auto;\n}\n\n.split__media {\n  align-self: stretch;\n  overflow: hidden;\n}\n\n/* min-height y no aspect-ratio: la altura del bloque la fija el texto, y la\n   foto se estira para acompañarlo. El mínimo evita que un texto corto deje una\n   franja de imagen demasiado baja para leerse. */\n.split__media img {\n  width: 100%;\n  height: 100%;\n  min-height: 440px;\n  object-fit: cover;\n}\n\n.split__title {\n  font-size: var(--ak-font-size-3xl);\n  max-width: 13ch;\n}\n\n/* Los banners que no son el hero titulan un escalón más abajo: a igual tamaño\n   competirían con el h1 y la página perdería su punto de entrada. */\n.split--compact .split__title {\n  font-size: var(--ak-font-size-2xl);\n  max-width: 24ch;\n}\n\n/* Los dos CTA comparten fila cuando caben y se apilan cuando no.\n   Cuándo NO caben: juntos piden ~660px y media columna con el margen del\n   contenedor deja 512px a 1440px de ancho. La maqueta los pone en línea porque\n   su tipografía de botón es ~11px; la nuestra es de 13px (font-size-xs, el piso\n   de la escala) y bajar de ahí rompería el eyebrow, el badge y el pie, que\n   comparten ese token. Se prefiere apilar antes que introducir un tamaño fuera\n   de la escala: apilados, el rectángulo rojo y la regla larga siguen leyéndose\n   como el par primario/secundario del diseño. */\n.split__actions {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: var(--ak-space-5);\n  width: 100%;\n  margin-top: var(--ak-space-2);\n}\n\n/* El CTA de línea se come el resto de la fila —o la fila entera si bajó— para\n   que su regla inferior llegue hasta el filo de la columna, como en la maqueta. */\n.split__actions .btn--line {\n  flex: 1 1 240px;\n  min-width: 0;\n}\n\n@media (max-width: 900px) {\n  .split {\n    grid-template-columns: 1fr;\n  }\n\n  /* En una columna la foto va primero en los dos sentidos: entrega el impacto\n     visual antes de pedir lectura. */\n  .split__media,\n  .split--reverse .split__media {\n    order: -1;\n  }\n\n  .split__media img {\n    min-height: 0;\n    aspect-ratio: 4 / 3;\n  }\n\n  .split__body {\n    max-width: none;\n    margin-inline-start: 0;\n    padding-block: var(--ak-space-8);\n  }\n}",
    "tokens": [
      "--ak-component-hero-bg",
      "--ak-font-size-2xl",
      "--ak-font-size-3xl",
      "--ak-size-container",
      "--ak-space-2",
      "--ak-space-5",
      "--ak-space-6",
      "--ak-space-8",
      "--ak-space-9",
      "--ak-space-gutter"
    ]
  },
  {
    "name": "Caja de destaque",
    "css": ".highlight {\n  padding: var(--ak-space-7);\n  border-radius: var(--ak-radius-lg);\n  background: var(--ak-semantic-bg-accent-subtle);\n  border-inline-start: var(--ak-border-heavy) solid var(--ak-semantic-border-accent);\n}\n\n.highlight__title {\n  font-size: var(--ak-font-size-xl);\n  font-weight: var(--ak-font-weight-medium);\n  letter-spacing: var(--ak-font-tracking-tight);\n  margin-bottom: var(--ak-space-4);\n}",
    "tokens": [
      "--ak-border-heavy",
      "--ak-font-size-xl",
      "--ak-font-tracking-tight",
      "--ak-font-weight-medium",
      "--ak-radius-lg",
      "--ak-semantic-bg-accent-subtle",
      "--ak-semantic-border-accent",
      "--ak-space-4",
      "--ak-space-7"
    ]
  },
  {
    "name": "Tarjeta de servicio",
    "css": "/* Grilla de servicios. Una sola tarjeta lleva --featured: es el ancla comercial,\n   y el resto queda en gris para que el ojo caiga primero en ella. */\n.service-card {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  gap: var(--ak-space-5);\n  padding: var(--ak-space-7);\n  border-radius: var(--ak-radius-xl);\n  background: var(--ak-component-service-card-bg);\n  box-shadow: inset 0 0 0 var(--ak-border-hairline) var(--ak-component-service-card-border);\n  transition: transform var(--ak-motion-duration-base) var(--ak-motion-ease-standard),\n    box-shadow var(--ak-motion-duration-base) var(--ak-motion-ease-standard);\n}\n\n.service-card:hover {\n  transform: translateY(calc(var(--ak-space-2) * -1));\n  box-shadow: inset 0 0 0 var(--ak-border-hairline) var(--ak-semantic-border-default),\n    var(--ak-shadow-md);\n}\n\n.service-card--featured {\n  background: var(--ak-component-service-card-bg-featured);\n  box-shadow: inset 0 0 0 var(--ak-border-thick) var(--ak-component-service-card-border-featured);\n}\n\n.service-card--featured:hover {\n  box-shadow: inset 0 0 0 var(--ak-border-thick) var(--ak-component-service-card-border-featured),\n    var(--ak-shadow-accent);\n}\n\n/* Cabalga sobre el borde superior, como una pestaña cosida a la tarjeta. */\n.service-card__badge {\n  position: absolute;\n  top: 0;\n  inset-inline-end: var(--ak-space-6);\n  transform: translateY(-50%);\n}\n\n.service-card__name {\n  font-size: var(--ak-font-size-xl);\n  font-weight: var(--ak-font-weight-medium);\n  letter-spacing: var(--ak-font-tracking-tight);\n}\n\n.service-card__text {\n  font-size: var(--ak-font-size-sm);\n  color: var(--ak-semantic-fg-muted);\n  line-height: var(--ak-font-leading-relaxed);\n  max-width: none;\n}\n\n.service-card__list {\n  display: flex;\n  flex-direction: column;\n  gap: var(--ak-space-4);\n  margin-top: auto;\n  padding-top: var(--ak-space-5);\n  border-top: var(--ak-border-hairline) solid var(--ak-semantic-border-subtle);\n}\n\n.service-card__list li {\n  display: flex;\n  gap: var(--ak-space-3);\n  align-items: baseline;\n  font-size: var(--ak-font-size-sm);\n}\n\n.service-card__list li::before {\n  content: \"→\";\n  color: var(--ak-semantic-fg-accent);\n  flex: none;\n  transition: transform var(--ak-motion-duration-fast) var(--ak-motion-ease-entrance);\n}\n\n.service-card__list li:hover::before {\n  transform: translateX(var(--ak-space-1));\n}\n\n@media (max-width: 768px) {\n  .service-card {\n    padding: var(--ak-space-6);\n  }\n}",
    "tokens": [
      "--ak-border-hairline",
      "--ak-border-thick",
      "--ak-component-service-card-bg",
      "--ak-component-service-card-bg-featured",
      "--ak-component-service-card-border",
      "--ak-component-service-card-border-featured",
      "--ak-font-leading-relaxed",
      "--ak-font-size-sm",
      "--ak-font-size-xl",
      "--ak-font-tracking-tight",
      "--ak-font-weight-medium",
      "--ak-motion-duration-base",
      "--ak-motion-duration-fast",
      "--ak-motion-ease-entrance",
      "--ak-motion-ease-standard",
      "--ak-radius-xl",
      "--ak-semantic-border-default",
      "--ak-semantic-border-subtle",
      "--ak-semantic-fg-accent",
      "--ak-semantic-fg-muted",
      "--ak-shadow-accent",
      "--ak-shadow-md",
      "--ak-space-1",
      "--ak-space-2",
      "--ak-space-3",
      "--ak-space-4",
      "--ak-space-5",
      "--ak-space-6",
      "--ak-space-7"
    ]
  },
  {
    "name": "Marquee",
    "css": "/* Cinta infinita, sin JS. El track contiene DOS grupos idénticos (el segundo con\n   aria-hidden) y se desplaza exactamente el ancho de un grupo más un gap: en ese\n   punto el grupo 2 ocupa la posición donde arrancó el grupo 1 y el reinicio es\n   invisible.\n   La cuenta: ancho total = 2·grupo + gap, luego 50% = grupo + gap/2. Falta gap/2\n   para completar un grupo entero, de ahí el `- gap/2` extra en la traslación.\n   Sin ese ajuste el bucle da un salto visible en cada vuelta. */\n.marquee {\n  --marquee-gap: var(--ak-space-7);\n  overflow: hidden;\n  padding-block: var(--ak-space-6);\n  border-block: var(--ak-border-hairline) solid var(--ak-semantic-border-subtle);\n  /* Desvanece los extremos para que las palabras no se corten de golpe. */\n  mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);\n}\n\n.marquee__track {\n  display: flex;\n  align-items: center;\n  gap: var(--marquee-gap);\n  width: max-content;\n  animation: marquee-scroll var(--ak-component-marquee-duration) linear infinite;\n}\n\n.marquee__group {\n  display: flex;\n  align-items: center;\n  gap: var(--marquee-gap);\n  flex: none;\n}\n\n/* Pausa al pasar el cursor: si algo te interesó, puedes leerlo. */\n.marquee:hover .marquee__track {\n  animation-play-state: paused;\n}\n\n.marquee__item {\n  font-size: var(--ak-font-size-2xl);\n  font-weight: var(--ak-font-weight-medium);\n  letter-spacing: var(--ak-font-tracking-tight);\n  white-space: nowrap;\n}\n\n.marquee__dot {\n  width: var(--ak-space-2);\n  height: var(--ak-space-2);\n  border-radius: var(--ak-radius-pill);\n  background: var(--ak-component-marquee-separator);\n  flex: none;\n}\n\n@keyframes marquee-scroll {\n  to {\n    transform: translateX(calc(-50% - var(--marquee-gap) / 2));\n  }\n}\n\n/* Detenida muestra el primer grupo como una fila estática legible. */\n@media (prefers-reduced-motion: reduce) {\n  .marquee__track {\n    animation: none;\n  }\n}",
    "tokens": [
      "--ak-border-hairline",
      "--ak-component-marquee-duration",
      "--ak-component-marquee-separator",
      "--ak-font-size-2xl",
      "--ak-font-tracking-tight",
      "--ak-font-weight-medium",
      "--ak-radius-pill",
      "--ak-semantic-border-subtle",
      "--ak-space-2",
      "--ak-space-6",
      "--ak-space-7"
    ]
  },
  {
    "name": "Flujo numerado",
    "css": ".flow {\n  counter-reset: flow;\n}\n\n.flow__item {\n  counter-increment: flow;\n  display: grid;\n  grid-template-columns: auto 1fr;\n  gap: var(--ak-space-5);\n  padding-block: var(--ak-space-5);\n  border-top: var(--ak-border-hairline) solid var(--ak-semantic-border-inverse);\n  transition: padding-inline-start var(--ak-motion-duration-base) var(--ak-motion-ease-standard);\n}\n\n.flow__item:hover {\n  padding-inline-start: var(--ak-space-4);\n}\n\n.flow__item::before {\n  content: counter(flow, decimal-leading-zero);\n  font-size: var(--ak-font-size-sm);\n  font-variant-numeric: tabular-nums;\n  color: var(--ak-semantic-fg-accent);\n}\n\n.flow__name {\n  font-size: var(--ak-font-size-lg);\n  font-weight: var(--ak-font-weight-medium);\n}\n\n.flow__text {\n  font-size: var(--ak-font-size-sm);\n  color: var(--ak-semantic-fg-inverse-muted);\n  margin-top: var(--ak-space-2);\n}",
    "tokens": [
      "--ak-border-hairline",
      "--ak-font-size-lg",
      "--ak-font-size-sm",
      "--ak-font-weight-medium",
      "--ak-motion-duration-base",
      "--ak-motion-ease-standard",
      "--ak-semantic-border-inverse",
      "--ak-semantic-fg-accent",
      "--ak-semantic-fg-inverse-muted",
      "--ak-space-2",
      "--ak-space-4",
      "--ak-space-5"
    ]
  },
  {
    "name": "Pestañas",
    "css": ".tabs {\n  display: flex;\n  gap: var(--ak-space-2);\n  padding: var(--ak-space-1);\n  border-radius: var(--ak-radius-pill);\n  background: var(--ak-semantic-bg-inverse-raised);\n  align-self: flex-start;\n}\n\n.tab {\n  padding: var(--ak-space-3) var(--ak-space-5);\n  border-radius: var(--ak-radius-pill);\n  font-size: var(--ak-font-size-sm);\n  color: var(--ak-semantic-fg-inverse-muted);\n  transition: background var(--ak-motion-duration-fast) var(--ak-motion-ease-standard),\n    color var(--ak-motion-duration-fast) var(--ak-motion-ease-standard);\n}\n\n.tab:hover {\n  color: var(--ak-semantic-fg-inverse);\n}\n\n.tab[aria-selected=\"true\"] {\n  background: var(--ak-semantic-bg-accent);\n  color: var(--ak-semantic-fg-on-accent);\n}",
    "tokens": [
      "--ak-font-size-sm",
      "--ak-motion-duration-fast",
      "--ak-motion-ease-standard",
      "--ak-radius-pill",
      "--ak-semantic-bg-accent",
      "--ak-semantic-bg-inverse-raised",
      "--ak-semantic-fg-inverse",
      "--ak-semantic-fg-inverse-muted",
      "--ak-semantic-fg-on-accent",
      "--ak-space-1",
      "--ak-space-2",
      "--ak-space-3",
      "--ak-space-5"
    ]
  },
  {
    "name": "Muro de logos",
    "css": "/* Los logos van en gris y recuperan su color al hover: cinco marcas a todo color\n   competirían con el acento rojo y romperían la jerarquía de la página.\n   Preparado para SVG: la altura manda y el ancho se acomoda, así que logos de\n   proporciones distintas quedan ópticamente parejos sin ajustes individuales. */\n.logos {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: center;\n  gap: var(--ak-space-6) var(--ak-space-8);\n}\n\n.logos__item {\n  height: var(--ak-space-7);\n  width: auto;\n  max-width: var(--ak-space-10);\n  object-fit: contain;\n  /* 0.55 y no menos: por debajo, un logo gris sobre blanco deja de leerse. */\n  opacity: 0.55;\n  filter: grayscale(1);\n  transition: opacity var(--ak-motion-duration-base) var(--ak-motion-ease-standard),\n    filter var(--ak-motion-duration-base) var(--ak-motion-ease-standard);\n}\n\n.logos__item:hover {\n  opacity: 1;\n  filter: grayscale(0);\n}\n\n/* Los logos dentro de la cinta: más grandes y menos apagados que en la rejilla\n   estática, porque pasan de largo y solo se ven un momento. El max-width de\n   .logos no aplica aquí — con la cinta manda la altura y el ancho se acomoda,\n   si no, un wordmark alargado como Foodware quedaría aplastado. */\n.marquee--logos {\n  --marquee-gap: var(--ak-space-8);\n  padding-block: var(--ak-space-6);\n}\n\n.marquee--logos .logos__item {\n  height: var(--ak-space-7);\n  max-width: none;\n  opacity: 0.72;\n  flex: none;\n}\n\n.marquee--logos .logos__item:hover {\n  opacity: 1;\n}",
    "tokens": [
      "--ak-motion-duration-base",
      "--ak-motion-ease-standard",
      "--ak-space-10",
      "--ak-space-6",
      "--ak-space-7",
      "--ak-space-8"
    ]
  },
  {
    "name": "Icono",
    "css": "/* Iconografía Lucide (https://lucide.dev) — SVG de trazo, ISC, ~1600 iconos.\n   El SVG usa stroke=\"currentColor\", así que el icono toma el color de su\n   contenedor: nunca se le pinta un color a mano.\n   Ver design/ICONS.md para el diccionario concepto -> icono. */\n.icon {\n  width: var(--ak-component-icon-size);\n  height: var(--ak-component-icon-size);\n  stroke-width: var(--ak-component-icon-stroke);\n  flex: none;\n  vertical-align: middle;\n}\n\n.icon--sm {\n  width: var(--ak-component-icon-size-sm);\n  height: var(--ak-component-icon-size-sm);\n}\n\n.icon--lg {\n  width: var(--ak-component-icon-size-lg);\n  height: var(--ak-component-icon-size-lg);\n}\n\n.icon--xl {\n  width: var(--ak-component-icon-size-xl);\n  height: var(--ak-component-icon-size-xl);\n}\n\n.icon--accent {\n  color: var(--ak-semantic-fg-accent);\n}\n\n/* Icono dentro de un círculo, para encabezados de tarjeta. */\n.icon-badge {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: var(--ak-space-8);\n  height: var(--ak-space-8);\n  border-radius: var(--ak-radius-pill);\n  background: var(--ak-semantic-bg-accent-subtle);\n  color: var(--ak-semantic-fg-accent);\n  flex: none;\n}\n\n/* Reserva el hueco mientras Lucide sustituye el <i> por el <svg>, para que no\n   salte el layout.\n   OJO con el selector: tiene que ser `i[data-lucide]`, no `[data-lucide]`.\n   Lucide conserva el atributo data-lucide en el <svg> que genera, así que un\n   `[data-lucide]` suelto también alcanza al icono ya renderizado y, al tener la\n   misma especificidad que .icon--sm/--lg/--xl pero ir después, les gana y deja\n   todos los iconos clavados en 24px. Con `i[...]` la regla muere en cuanto el\n   <i> desaparece, que es justo lo que se busca. */\ni[data-lucide] {\n  display: inline-block;\n  width: var(--ak-component-icon-size);\n  height: var(--ak-component-icon-size);\n}",
    "tokens": [
      "--ak-component-icon-size",
      "--ak-component-icon-size-lg",
      "--ak-component-icon-size-sm",
      "--ak-component-icon-size-xl",
      "--ak-component-icon-stroke",
      "--ak-radius-pill",
      "--ak-semantic-bg-accent-subtle",
      "--ak-semantic-fg-accent",
      "--ak-space-8"
    ]
  },
  {
    "name": "Media",
    "css": ".media {\n  border-radius: var(--ak-radius-lg);\n  overflow: hidden;\n}\n\n.media img {\n  width: 100%;\n}",
    "tokens": [
      "--ak-radius-lg"
    ]
  },
  {
    "name": "Reveal",
    "css": "/* .reveal parte oculto; main.js añade .is-visible vía IntersectionObserver. */\n.reveal {\n  opacity: 0;\n  transform: translateY(var(--ak-space-5));\n  transition: opacity var(--ak-motion-duration-reveal) var(--ak-motion-ease-entrance),\n    transform var(--ak-motion-duration-reveal) var(--ak-motion-ease-entrance);\n}\n\n.reveal.is-visible {\n  opacity: 1;\n  transform: none;\n}\n\n/* Escalona hijos: cada uno entra --ak-motion-duration-instant después del anterior. */\n.reveal-stagger > * {\n  opacity: 0;\n  transform: translateY(var(--ak-space-5));\n  transition: opacity var(--ak-motion-duration-reveal) var(--ak-motion-ease-entrance),\n    transform var(--ak-motion-duration-reveal) var(--ak-motion-ease-entrance);\n  transition-delay: calc(var(--ak-motion-duration-instant) * var(--i, 0));\n}\n\n.reveal-stagger.is-visible > * {\n  opacity: 1;\n  transform: none;\n}\n\n/* Sin JS o con motion reducido, el contenido debe verse igual. */\n@media (prefers-reduced-motion: reduce) {\n  .reveal,\n  .reveal-stagger > * {\n    opacity: 1;\n    transform: none;\n  }\n}",
    "tokens": [
      "--ak-motion-duration-instant",
      "--ak-motion-duration-reveal",
      "--ak-motion-ease-entrance",
      "--ak-space-5"
    ]
  },
  {
    "name": "Logo del header",
    "css": "/* El SVG trae su color: negro + acento rojo. Manda la altura, como en los\n   logos de cliente, para que el ancho se acomode solo. */\n.header__logo {\n  height: var(--ak-component-header-logo-height);\n  width: auto;\n  display: block;\n}\n\n@media (max-width: 768px) {\n  .header__logo {\n    height: var(--ak-component-header-logo-height-sm);\n  }\n}",
    "tokens": [
      "--ak-component-header-logo-height",
      "--ak-component-header-logo-height-sm"
    ]
  },
  {
    "name": "Cabecera de prueba social",
    "css": ".clientes-logos__head {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: var(--ak-space-3);\n  text-align: center;\n  margin-bottom: var(--ak-space-7);\n}\n\n.clientes-logos__title {\n  font-size: var(--ak-font-size-2xl);\n}",
    "tokens": [
      "--ak-font-size-2xl",
      "--ak-space-3",
      "--ak-space-7"
    ]
  },
  {
    "name": "Pie de conversión",
    "css": "/* Pie corto a propósito. El prefooter que va justo encima ya cierra la venta con\n   su propio titular y su CTA rojo; este bloque solo repite el llamado y deja el\n   correo. Por eso el padding baja a space-8 fijo en vez del clamp que llegaba a\n   space-9: un pie alto tras un prefooter alto hacía dos pantallas de cierre. */\n.footer {\n  padding-block: var(--ak-space-8) var(--ak-space-6);\n}\n\n/* El llamado a la izquierda y el correo al costado: apilados, tres líneas de\n   contacto ocupaban una pantalla entera. */\n.footer__top {\n  display: grid;\n  grid-template-columns: 1.4fr 1fr;\n  gap: var(--ak-space-8);\n  align-items: start;\n}\n\n.footer__cta {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  gap: var(--ak-space-6);\n}\n\n.footer__title {\n  font-size: var(--ak-font-size-2xl);\n  max-width: 20ch;\n}\n\n.footer__meta {\n  display: grid;\n  gap: var(--ak-space-5);\n  align-content: start;\n}\n\n/* Rótulo del dato de contacto. Tenía su estilo prestado de la banda negra del\n   hero, que ya no existe; ahora es suyo. */\n.footer__label {\n  font-size: var(--ak-font-size-sm);\n  font-weight: var(--ak-font-weight-medium);\n  letter-spacing: var(--ak-font-tracking-wide);\n  text-transform: uppercase;\n  color: var(--ak-semantic-fg-inverse);\n}\n\n.footer__legal {\n  margin-top: var(--ak-space-6);\n  padding-top: var(--ak-space-5);\n  border-top: var(--ak-border-hairline) solid var(--ak-semantic-border-inverse);\n  font-size: var(--ak-font-size-xs);\n  color: var(--ak-semantic-fg-inverse-muted);\n  /* base.css limita los <p> a 68ch: sin esto el filete se corta a media caja. */\n  max-width: none;\n}\n\n@media (max-width: 860px) {\n  .footer__top {\n    grid-template-columns: 1fr;\n    gap: var(--ak-space-7);\n  }\n\n  .footer__meta {\n    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));\n  }\n}",
    "tokens": [
      "--ak-border-hairline",
      "--ak-font-size-2xl",
      "--ak-font-size-sm",
      "--ak-font-size-xs",
      "--ak-font-tracking-wide",
      "--ak-font-weight-medium",
      "--ak-semantic-border-inverse",
      "--ak-semantic-fg-inverse",
      "--ak-semantic-fg-inverse-muted",
      "--ak-space-5",
      "--ak-space-6",
      "--ak-space-7",
      "--ak-space-8"
    ]
  },
  {
    "name": "Fila de capacidades",
    "css": "/* Siete columnas separadas por filetes verticales. No son tarjetas: no hay\n   caja, ni fondo, ni sombra, ni hover — solo la línea que las separa, como las\n   columnas de un periódico.\n   Siete y no cuatro porque el número ES el mensaje (\"todo esto hacemos junto a\n   ti\"): la fila prioriza caber entera de un vistazo sobre que cada celda\n   respire, y por eso el texto baja a font-size xs. */\n.capabilities {\n  display: grid;\n  grid-template-columns: repeat(7, 1fr);\n  border-bottom: var(--ak-border-hairline) solid var(--ak-semantic-border-subtle);\n}\n\n.capabilities__item {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: var(--ak-space-5);\n  padding: var(--ak-space-6) var(--ak-space-4);\n  text-align: center;\n  /* Filete solo ENTRE columnas: no toca los extremos de la fila. */\n  border-inline-start: var(--ak-border-hairline) solid var(--ak-semantic-border-subtle);\n}\n\n.capabilities__item:first-child {\n  border-inline-start: none;\n}\n\n/* El icono manda sobre el texto: va grande, en negro y con el trazo fino del\n   sistema. Es lo único que se ve al pasar la vista rápido por la fila. */\n.capabilities__icon {\n  color: var(--ak-semantic-fg-default);\n}\n\n/* size-sm y no xs: xs (13px) es el tamaño de eyebrows y metadatos —texto que se\n   reconoce, no que se lee—, y estas siete celdas son frases completas. Sube a\n   15px, que sigue siendo el escalón por debajo del cuerpo y mantiene la fila\n   compacta. */\n.capabilities__text {\n  font-size: var(--ak-font-size-sm);\n  line-height: var(--ak-font-leading-relaxed);\n  color: var(--ak-semantic-fg-muted);\n  max-width: 20ch;\n}\n\n/* Al reflowear, el filete izquierdo se reasigna a la primera celda de cada\n   fila y aparece un filete superior a partir de la segunda: el patrón de\n   separadores tiene que seguir a la rejilla, no quedarse en la de 7. */\n@media (max-width: 1100px) {\n  .capabilities {\n    grid-template-columns: repeat(4, 1fr);\n  }\n  .capabilities__item {\n    border-inline-start: var(--ak-border-hairline) solid var(--ak-semantic-border-subtle);\n  }\n  .capabilities__item:nth-child(4n + 1) {\n    border-inline-start: none;\n  }\n  .capabilities__item:nth-child(n + 5) {\n    border-top: var(--ak-border-hairline) solid var(--ak-semantic-border-subtle);\n  }\n}\n\n@media (max-width: 640px) {\n  .capabilities {\n    grid-template-columns: repeat(2, 1fr);\n  }\n  .capabilities__item,\n  .capabilities__item:nth-child(4n + 1) {\n    border-inline-start: var(--ak-border-hairline) solid var(--ak-semantic-border-subtle);\n  }\n  .capabilities__item:nth-child(odd) {\n    border-inline-start: none;\n  }\n  .capabilities__item:nth-child(n + 3) {\n    border-top: var(--ak-border-hairline) solid var(--ak-semantic-border-subtle);\n  }\n}",
    "tokens": [
      "--ak-border-hairline",
      "--ak-font-leading-relaxed",
      "--ak-font-size-sm",
      "--ak-semantic-border-subtle",
      "--ak-semantic-fg-default",
      "--ak-semantic-fg-muted",
      "--ak-space-4",
      "--ak-space-5",
      "--ak-space-6"
    ]
  },
  {
    "name": "Formulario de contacto",
    "css": "/* Campos sin caja: solo una línea inferior, como el CTA .btn--line. En una\n   página donde nada tiene borde completo salvo las tarjetas, un input con marco\n   de cuatro lados se lee como un elemento pegado de otra web.\n   El texto a la izquierda y el formulario a la derecha: el argumento ya se dio\n   en el prefooter, aquí solo queda pedir los datos. */\n.contacto {\n  display: grid;\n  grid-template-columns: 1fr 1.1fr;\n  gap: var(--ak-space-8);\n  align-items: start;\n}\n\n.contacto__title {\n  font-size: var(--ak-font-size-2xl);\n  max-width: 14ch;\n}\n\n.form {\n  display: flex;\n  flex-direction: column;\n  gap: var(--ak-space-6);\n}\n\n/* Nombre y correo comparten fila: son cortos y pedirlos apilados alarga el\n   formulario sin ganar nada. El mensaje va siempre a lo ancho. */\n.form__row {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: var(--ak-space-5);\n}\n\n.field {\n  display: flex;\n  flex-direction: column;\n  gap: var(--ak-space-2);\n}\n\n.field__label {\n  font-family: var(--ak-font-family-sans);\n  font-size: var(--ak-font-size-xs);\n  font-weight: var(--ak-font-weight-semibold);\n  letter-spacing: var(--ak-font-tracking-widest);\n  text-transform: uppercase;\n  color: var(--ak-semantic-fg-muted);\n}\n\n.field__opcional {\n  font-weight: var(--ak-font-weight-regular);\n  letter-spacing: var(--ak-font-tracking-wide);\n  text-transform: none;\n}\n\n/* font: inherit lo pone base.css; aquí solo se fija el tamaño de cuerpo para\n   que escribir en el campo se lea igual que el resto de la página. */\n.field__input {\n  width: 100%;\n  padding-block: var(--ak-space-3);\n  font-size: var(--ak-font-size-base);\n  color: var(--ak-semantic-fg-default);\n  background: transparent;\n  border-bottom: var(--ak-border-hairline) solid var(--ak-semantic-border-default);\n  border-radius: var(--ak-radius-none);\n  transition: border-color var(--ak-motion-duration-fast) var(--ak-motion-ease-standard);\n}\n\n.field__input:hover {\n  border-bottom-color: var(--ak-semantic-border-strong);\n}\n\n.field__input:focus {\n  outline: none;\n  border-bottom-color: var(--ak-semantic-border-accent);\n}\n\n/* El foco por teclado sí lleva anillo: el cambio de color del filete solo no\n   basta para cumplir el contraste de indicador de foco. */\n.field__input:focus-visible {\n  outline: var(--ak-border-thick) solid var(--ak-color-state-focus);\n  outline-offset: var(--ak-space-1);\n}\n\n/* :user-invalid y no :invalid — :invalid pinta de rojo los campos vacíos desde\n   que carga la página, antes de que nadie haya escrito nada. */\n.field__input:user-invalid {\n  border-bottom-color: var(--ak-color-state-danger);\n}\n\n.field__input--area {\n  resize: vertical;\n  min-height: 8ch;\n  line-height: var(--ak-font-leading-normal);\n}\n\n/* Fuera de la pantalla en vez de display:none: algunos bots ignoran los campos\n   ocultos con display, pero rellenan los que existen en el layout. */\n.form__trampa {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  overflow: hidden;\n  clip-path: inset(50%);\n  white-space: nowrap;\n}\n\n.form__pie {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: var(--ak-space-5);\n  margin-top: var(--ak-space-2);\n}\n\n/* Es una live region (role=status): tiene que existir en el árbol de\n   accesibilidad DESDE LA CARGA para que el lector de pantalla anuncie su\n   contenido al aparecer. Por eso NO lleva `:empty { display: none }` — eso lo\n   sacaría del árbol y el anuncio se perdería. Vacío mide cero y no se ve. */\n.form__estado {\n  font-size: var(--ak-font-size-sm);\n  max-width: 40ch;\n}\n\n.form__estado[data-estado=\"ok\"] {\n  color: var(--ak-color-state-success);\n}\n\n.form__estado[data-estado=\"error\"] {\n  color: var(--ak-color-state-danger);\n}\n\n/* Mientras se envía: el botón queda inerte y lo dice. */\n.form[data-enviando] .btn {\n  opacity: 0.6;\n  pointer-events: none;\n}\n\n@media (max-width: 900px) {\n  .contacto {\n    grid-template-columns: 1fr;\n    gap: var(--ak-space-7);\n  }\n\n  .contacto__title {\n    max-width: none;\n  }\n}\n\n@media (max-width: 560px) {\n  .form__row {\n    grid-template-columns: 1fr;\n  }\n}",
    "tokens": [
      "--ak-border-hairline",
      "--ak-border-thick",
      "--ak-color-state-danger",
      "--ak-color-state-focus",
      "--ak-color-state-success",
      "--ak-font-family-sans",
      "--ak-font-leading-normal",
      "--ak-font-size-2xl",
      "--ak-font-size-base",
      "--ak-font-size-sm",
      "--ak-font-size-xs",
      "--ak-font-tracking-wide",
      "--ak-font-tracking-widest",
      "--ak-font-weight-regular",
      "--ak-font-weight-semibold",
      "--ak-motion-duration-fast",
      "--ak-motion-ease-standard",
      "--ak-radius-none",
      "--ak-semantic-border-accent",
      "--ak-semantic-border-default",
      "--ak-semantic-border-strong",
      "--ak-semantic-fg-default",
      "--ak-semantic-fg-muted",
      "--ak-space-1",
      "--ak-space-2",
      "--ak-space-3",
      "--ak-space-5",
      "--ak-space-6",
      "--ak-space-7",
      "--ak-space-8"
    ]
  },
  {
    "name": "Prefooter de cierre",
    "css": "/* Último argumento antes del pie. Va sobre la crema profunda para separarse del\n   lienzo sin usar un borde, y es la única sección donde el titular convive con\n   el CTA rojo en la misma pantalla: es el punto de conversión de la página.\n   La rejilla exterior reserva una columna a sangre para la foto ornamental, que\n   se corta contra el borde derecho del viewport. */\n.prefooter {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) clamp(160px, 18%, 320px);\n  background: var(--ak-semantic-bg-subtle);\n}\n\n.prefooter__inner {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: var(--ak-space-8);\n  align-items: start;\n  padding: var(--ak-space-9) var(--ak-space-gutter);\n}\n\n.prefooter__title {\n  font-size: var(--ak-font-size-2xl);\n  max-width: 16ch;\n}\n\n.prefooter__body {\n  display: flex;\n  flex-direction: column;\n  gap: var(--ak-space-7);\n}\n\n/* La pregunta y el botón comparten fila: la pregunta abre y el CTA responde.\n   Apilados, el botón se lee como un elemento suelto y pierde ese diálogo. */\n.prefooter__cta {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: var(--ak-space-6);\n}\n\n.prefooter__question {\n  font-size: var(--ak-font-size-sm);\n  font-weight: var(--ak-font-weight-semibold);\n  max-width: none;\n}\n\n.prefooter__ornament {\n  overflow: hidden;\n}\n\n.prefooter__ornament img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n\n@media (max-width: 1024px) {\n  /* La foto ornamental es respiración, no información: al estrecharse queda en\n     una tira demasiado angosta para leerse y se retira entera. */\n  .prefooter {\n    grid-template-columns: 1fr;\n  }\n  .prefooter__ornament {\n    display: none;\n  }\n}\n\n@media (max-width: 860px) {\n  .prefooter__inner {\n    grid-template-columns: 1fr;\n    gap: var(--ak-space-7);\n    padding-block: var(--ak-space-8);\n  }\n  .prefooter__title {\n    max-width: none;\n  }\n}",
    "tokens": [
      "--ak-font-size-2xl",
      "--ak-font-size-sm",
      "--ak-font-weight-semibold",
      "--ak-semantic-bg-subtle",
      "--ak-space-6",
      "--ak-space-7",
      "--ak-space-8",
      "--ak-space-9",
      "--ak-space-gutter"
    ]
  }
];
