/* GENERADO por scripts/build-tokens.mjs — NO EDITAR A MANO.
 * CSS real de cada componente, extraído de src/styles/components.css.
 */
window.AK_CSS = [
  {
    "name": "Botón",
    "css": ".btn {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: var(--ak-space-2);\n  min-height: var(--ak-size-tap);\n  padding: var(--ak-space-3) var(--ak-space-5);\n  border-radius: var(--ak-radius-pill);\n  font-size: var(--ak-font-size-sm);\n  font-weight: var(--ak-font-weight-medium);\n  letter-spacing: var(--ak-font-tracking-wide);\n  text-transform: uppercase;\n  white-space: nowrap;\n  transition: background var(--ak-motion-duration-fast) var(--ak-motion-ease-standard),\n    color var(--ak-motion-duration-fast) var(--ak-motion-ease-standard),\n    box-shadow var(--ak-motion-duration-fast) var(--ak-motion-ease-standard),\n    transform var(--ak-motion-duration-instant) var(--ak-motion-ease-spring);\n}\n\n.btn:active {\n  transform: scale(0.97);\n}\n\n.btn--primary {\n  background: var(--ak-component-button-primary-bg);\n  color: var(--ak-component-button-primary-fg);\n}\n\n/* El único punto del sistema donde negro y rojo se tocan. */\n.btn--primary:hover {\n  background: var(--ak-component-button-primary-bg-hover);\n  box-shadow: var(--ak-shadow-accent);\n}\n\n.btn--ghost {\n  color: var(--ak-component-button-ghost-fg);\n  box-shadow: inset 0 0 0 var(--ak-border-hairline) var(--ak-component-button-ghost-border);\n}\n\n.btn--ghost:hover {\n  box-shadow: inset 0 0 0 var(--ak-border-thick) var(--ak-semantic-border-strong);\n}\n\n/* Sobre fondo negro se invierte: blanco es la acción. */\n.btn--inverse {\n  background: var(--ak-semantic-bg-canvas);\n  color: var(--ak-semantic-fg-default);\n}\n\n.btn--inverse:hover {\n  background: var(--ak-semantic-bg-accent);\n  color: var(--ak-semantic-fg-on-accent);\n}\n\n.btn--lg {\n  padding: var(--ak-space-5) var(--ak-space-7);\n  font-size: var(--ak-font-size-base);\n}",
    "tokens": [
      "--ak-border-hairline",
      "--ak-border-thick",
      "--ak-component-button-ghost-border",
      "--ak-component-button-ghost-fg",
      "--ak-component-button-primary-bg",
      "--ak-component-button-primary-bg-hover",
      "--ak-component-button-primary-fg",
      "--ak-font-size-base",
      "--ak-font-size-sm",
      "--ak-font-tracking-wide",
      "--ak-font-weight-medium",
      "--ak-motion-duration-fast",
      "--ak-motion-duration-instant",
      "--ak-motion-ease-spring",
      "--ak-motion-ease-standard",
      "--ak-radius-pill",
      "--ak-semantic-bg-accent",
      "--ak-semantic-bg-canvas",
      "--ak-semantic-border-strong",
      "--ak-semantic-fg-default",
      "--ak-semantic-fg-on-accent",
      "--ak-shadow-accent",
      "--ak-size-tap",
      "--ak-space-2",
      "--ak-space-3",
      "--ak-space-5",
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
    "css": ".eyebrow {\n  display: inline-flex;\n  align-items: center;\n  gap: var(--ak-space-2);\n  font-size: var(--ak-font-size-xs);\n  font-weight: var(--ak-font-weight-medium);\n  letter-spacing: var(--ak-font-tracking-widest);\n  text-transform: uppercase;\n  color: var(--ak-semantic-fg-muted);\n}\n\n.eyebrow::before {\n  content: \"\";\n  width: var(--ak-space-2);\n  height: var(--ak-space-2);\n  border-radius: var(--ak-radius-pill);\n  background: var(--ak-semantic-bg-accent);\n  flex: none;\n}\n\n.eyebrow--inverse {\n  color: var(--ak-semantic-fg-inverse-muted);\n}",
    "tokens": [
      "--ak-font-size-xs",
      "--ak-font-tracking-widest",
      "--ak-font-weight-medium",
      "--ak-radius-pill",
      "--ak-semantic-bg-accent",
      "--ak-semantic-fg-inverse-muted",
      "--ak-semantic-fg-muted",
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
    "css": ".accent {\n  color: var(--ak-semantic-fg-accent);\n}\n\n.display {\n  font-size: var(--ak-font-size-5xl);\n  font-weight: var(--ak-font-weight-medium);\n  line-height: var(--ak-font-leading-tight);\n  letter-spacing: var(--ak-font-tracking-tighter);\n  text-wrap: balance;\n}\n\n.lead {\n  font-size: var(--ak-font-size-lg);\n  color: var(--ak-semantic-fg-muted);\n  line-height: var(--ak-font-leading-normal);\n}\n\n.section--inverse .lead {\n  color: var(--ak-semantic-fg-inverse-muted);\n}",
    "tokens": [
      "--ak-font-leading-normal",
      "--ak-font-leading-tight",
      "--ak-font-size-5xl",
      "--ak-font-size-lg",
      "--ak-font-tracking-tighter",
      "--ak-font-weight-medium",
      "--ak-semantic-fg-accent",
      "--ak-semantic-fg-inverse-muted",
      "--ak-semantic-fg-muted"
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
    "name": "Hero",
    "css": "/* Layout partido: texto a la izquierda, imagen a la derecha.\n   La foto es un mockup 16:9 sobre fondo de estudio plano (#F7F7F7). El hero usa\n   ESE MISMO color, así que las dos mitades son una sola superficie continua y la\n   imagen se funde sin costura: no necesita marco, ni sombra, ni recorte.\n   Por eso NO se usa object-fit:cover — la columna es casi cuadrada y un cover\n   sobre una foto 16:9 se comería la taza y parte del laptop. */\n.hero {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  align-items: center;\n  min-height: 62vh;\n  background: var(--ak-component-hero-bg);\n}\n\n.hero__content {\n  display: flex;\n  flex-direction: column;\n  gap: var(--ak-space-6);\n  padding: var(--ak-space-7) var(--ak-space-gutter);\n  /* Alinea el texto con el .container del resto del sitio en vez de pegarlo al\n     borde: la columna mide media pantalla, pero el margen sigue el mismo eje. */\n  margin-inline-start: auto;\n  max-width: calc(var(--ak-size-container) / 2);\n  width: 100%;\n}\n\n.hero__media {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  align-self: center;\n  height: 100%;\n  padding-block: var(--ak-space-6);\n}\n\n/* Sin recorte: la foto se muestra entera y su fondo continúa en el del hero.\n   El contenido de la imagen está descentrado —vive entre el 29% y el 88% de su\n   ancho, con el centro óptico en el 59%—, así que centrada dejaría un vacío\n   entre el texto y el laptop. El -8% corrige ese descentrado y el 110% la\n   agranda; el contenido llega hasta el 89% del ancho de la columna, o sea que\n   nada se corta. Como el fondo se funde, el desplazamiento es invisible.\n   Tope en 1024px: es el ancho nativo del JPG y ampliarlo más lo vuelve borroso. */\n.hero__media img {\n  width: 110%;\n  max-width: 1024px;\n  height: auto;\n  max-height: 100%;\n  margin-inline-start: -8%;\n  object-fit: contain;\n}\n\n@media (max-width: 900px) {\n  .hero {\n    grid-template-columns: 1fr;\n    min-height: 0;\n  }\n\n  /* En móvil la imagen va primero: entrega el impacto visual antes del scroll. */\n  .hero__media {\n    order: -1;\n    padding-block: 0;\n  }\n\n  /* Anula el 110%/-8% del layout de dos columnas. Aquí la columna ocupa todo el\n     viewport, así que la imagen sobresaldría y el overflow-x:hidden del body la\n     recortaría por la derecha, comiéndose la taza. */\n  .hero__media img {\n    width: 100%;\n    margin-inline-start: 0;\n  }\n\n  .hero__content {\n    max-width: none;\n    padding-block: var(--ak-space-7);\n  }\n}",
    "tokens": [
      "--ak-component-hero-bg",
      "--ak-size-container",
      "--ak-space-6",
      "--ak-space-7",
      "--ak-space-gutter"
    ]
  },
  {
    "name": "Banner de soporte",
    "css": "/* Pie del hero: banda negra a ancho completo, pegada al hero sin separación.\n   Es la primera transición de la página —claro a negro— y el corte debe ser\n   seco: cualquier margen entre medio rompe el efecto.\n   Color: el título va en BLANCO y el acento se traslada al icono. El rojo de\n   marca (accent.500) sobre negro da 4.34:1 y no pasa AA para texto; por eso el\n   icono usa fg.accent-inverse (accent.400, 5.43:1). Ver design/DESIGN.md. */\n.support {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  background: var(--ak-semantic-bg-inverse);\n  color: var(--ak-semantic-fg-inverse);\n}\n\n@media (max-width: 900px) {\n  .support {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}\n\n@media (max-width: 520px) {\n  .support {\n    grid-template-columns: 1fr;\n  }\n}\n\n.support__item {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: var(--ak-space-3);\n  padding: var(--ak-space-7) var(--ak-space-5);\n  text-align: center;\n  /* Separador solo entre columnas: no toca los bordes de la banda. */\n  border-inline-start: var(--ak-border-hairline) solid var(--ak-semantic-border-inverse);\n  transition: background var(--ak-motion-duration-base) var(--ak-motion-ease-standard);\n}\n\n.support__item:first-child {\n  border-inline-start: none;\n}\n\n@media (max-width: 900px) {\n  /* Al pasar a 2 columnas, el separador izquierdo cae en la 1ª de cada fila. */\n  .support__item:nth-child(odd) {\n    border-inline-start: none;\n  }\n  .support__item:nth-child(n + 3) {\n    border-top: var(--ak-border-hairline) solid var(--ak-semantic-border-inverse);\n  }\n}\n\n@media (max-width: 520px) {\n  .support__item {\n    border-inline-start: none;\n  }\n  .support__item + .support__item {\n    border-top: var(--ak-border-hairline) solid var(--ak-semantic-border-inverse);\n  }\n}\n\n.support__item:hover {\n  background: var(--ak-semantic-bg-inverse-raised);\n}\n\n/* El único punto de color de la banda. Sobre negro, accent.400 y no accent.500. */\n.support__icon {\n  color: var(--ak-semantic-fg-accent-inverse);\n  margin-bottom: var(--ak-space-2);\n}\n\n.support__title {\n  font-size: var(--ak-font-size-sm);\n  font-weight: var(--ak-font-weight-medium);\n  letter-spacing: var(--ak-font-tracking-wide);\n  text-transform: uppercase;\n  color: var(--ak-semantic-fg-inverse);\n}\n\n.support__text {\n  font-size: var(--ak-font-size-sm);\n  color: var(--ak-semantic-fg-inverse-muted);\n  line-height: var(--ak-font-leading-relaxed);\n  max-width: 28ch;\n}",
    "tokens": [
      "--ak-border-hairline",
      "--ak-font-leading-relaxed",
      "--ak-font-size-sm",
      "--ak-font-tracking-wide",
      "--ak-font-weight-medium",
      "--ak-motion-duration-base",
      "--ak-motion-ease-standard",
      "--ak-semantic-bg-inverse",
      "--ak-semantic-bg-inverse-raised",
      "--ak-semantic-border-inverse",
      "--ak-semantic-fg-accent-inverse",
      "--ak-semantic-fg-inverse",
      "--ak-semantic-fg-inverse-muted",
      "--ak-space-2",
      "--ak-space-3",
      "--ak-space-5",
      "--ak-space-7"
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
    "name": "Paso de metodología",
    "css": ".step {\n  display: flex;\n  flex-direction: column;\n  gap: var(--ak-space-3);\n  padding-top: var(--ak-space-5);\n  border-top: var(--ak-border-thick) solid var(--ak-semantic-border-strong);\n}\n\n.step__num {\n  font-size: var(--ak-font-size-sm);\n  font-variant-numeric: tabular-nums;\n  color: var(--ak-semantic-fg-accent);\n}\n\n.step__name {\n  display: flex;\n  align-items: center;\n  gap: var(--ak-space-3);\n  font-size: var(--ak-font-size-xl);\n  font-weight: var(--ak-font-weight-medium);\n  letter-spacing: var(--ak-font-tracking-tight);\n}\n\n.step__text {\n  font-size: var(--ak-font-size-sm);\n  color: var(--ak-semantic-fg-muted);\n}",
    "tokens": [
      "--ak-border-thick",
      "--ak-font-size-sm",
      "--ak-font-size-xl",
      "--ak-font-tracking-tight",
      "--ak-font-weight-medium",
      "--ak-semantic-border-strong",
      "--ak-semantic-fg-accent",
      "--ak-semantic-fg-muted",
      "--ak-space-3",
      "--ak-space-5"
    ]
  },
  {
    "name": "Muro de logos",
    "css": "/* Los logos van en gris y recuperan su color al hover: cinco marcas a todo color\n   competirían con el acento rojo y romperían la jerarquía de la página.\n   Preparado para SVG: la altura manda y el ancho se acomoda, así que logos de\n   proporciones distintas quedan ópticamente parejos sin ajustes individuales. */\n.logos {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: center;\n  gap: var(--ak-space-6) var(--ak-space-8);\n}\n\n.logos__item {\n  height: var(--ak-space-7);\n  width: auto;\n  max-width: var(--ak-space-10);\n  object-fit: contain;\n  /* 0.55 y no menos: por debajo, un logo gris sobre blanco deja de leerse. */\n  opacity: 0.55;\n  filter: grayscale(1);\n  transition: opacity var(--ak-motion-duration-base) var(--ak-motion-ease-standard),\n    filter var(--ak-motion-duration-base) var(--ak-motion-ease-standard);\n}\n\n.logos__item:hover {\n  opacity: 1;\n  filter: grayscale(0);\n}",
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
  }
];
