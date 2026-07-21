# Iconografía — Alkance

**Librería: [Lucide](https://lucide.dev)** · ~1600 iconos · SVG de trazo · Licencia ISC (uso comercial libre)

Buscador de iconos: <https://lucide.dev/icons/>

## Por qué Lucide

Era el requisito: SVG editable, no PNG, y llamable por CDN.

- **SVG de trazo, no relleno.** El grosor se controla desde CSS
  (`stroke-width`), así que los iconos se afinan para acompañar la tipografía de
  peso `medium` del sistema. Con iconos de relleno eso no se puede.
- **`stroke="currentColor"`.** El icono hereda el color de su contenedor. Un
  icono dentro de `.section--inverse` se vuelve blanco solo. Nunca se le pinta un
  color a mano.
- **ISC.** Uso comercial sin atribución.
- **Un CDN, una línea.** Sin build, sin npm.

Alternativas descartadas: Font Awesome (los buenos son de pago y el free es de
relleno), Heroicons (solo ~300 iconos), Material Icons (lenguaje visual de Google,
choca con la marca).

---

## Implementar

### 1. Cargar la librería (una vez, antes de `</body>`)

```html
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
<script>
  lucide.createIcons();
</script>
```

`createIcons()` recorre el DOM y reemplaza cada `<i data-lucide="…">` por un
`<svg>` inline. Como es SVG real en el documento, se puede estilar con CSS —
que es justamente lo que no permite un PNG.

### 2. Usar un icono

```html
<i data-lucide="rocket" class="icon"></i>
```

Variantes disponibles (todas en `components.css`):

```html
<i data-lucide="rocket" class="icon icon--sm"></i>      <!-- 16px, junto a texto sm -->
<i data-lucide="rocket" class="icon"></i>               <!-- 24px, por defecto -->
<i data-lucide="rocket" class="icon icon--lg"></i>      <!-- 32px, encabezados -->
<i data-lucide="rocket" class="icon icon--accent"></i>  <!-- en rojo de marca -->

<!-- Icono en círculo, para cabecera de tarjeta -->
<span class="icon-badge">
  <i data-lucide="rocket" class="icon"></i>
</span>
```

### 3. Reglas

- **Nunca le des `color` ni `stroke` inline.** Hereda de su contenedor. Si
  necesitas que sea rojo, es `.icon--accent`; si va sobre negro, ya se resuelve
  solo.
- **El tamaño sale de las clases**, no de `width` inline. Son tokens
  (`component.icon.size`).
- **Decorativo → `aria-hidden`.** Un icono junto a un texto que ya dice lo mismo
  no debe leerse dos veces:
  ```html
  <i data-lucide="rocket" class="icon" aria-hidden="true"></i> Lanzamiento
  ```
- **Icono solo → necesita nombre accesible:**
  ```html
  <button class="btn" aria-label="Cerrar">
    <i data-lucide="x" class="icon" aria-hidden="true"></i>
  </button>
  ```
- **Trazo 1.5, no 2.** Es el default de Lucide, pero lo bajamos en
  `component.icon.stroke`. Es la decisión que hace que los iconos se vean de esta
  marca y no genéricos. No lo subas por icono.

---

## Diccionario: concepto → icono

Los conceptos que ya usa el sitio. Antes de traer un icono nuevo, revisa si el
concepto ya está aquí: dos iconos distintos para la misma idea rompen el sistema.

### Servicios

| Concepto | Icono | Nombre Lucide |
|---|---|---|
| Product Discovery Sprint | cohete | `rocket` |
| UX/UI & Design Systems | capas | `layers` |
| Digital Branding | chispa | `sparkles` |
| Digital Growth Strategy | tendencia al alza | `trending-up` |

### Pie del hero

Las cuatro áreas de la banda negra bajo el hero. Van en `accent-400`, no en el
rojo de marca: sobre negro, `accent-500` da 4.34:1 y no pasa AA.

| Concepto | Icono | Nombre Lucide |
|---|---|---|
| Estrategia | bombilla | `lightbulb` |
| Branding | plumilla | `pen-tool` |
| Diseño digital | monitor | `monitor` |
| Acompañamiento | gráfico de barras | `bar-chart-3` |
| Crecimiento (alt.) | diana | `target` |

### Modelo Stingray

| Concepto | Icono | Nombre Lucide |
|---|---|---|
| Entrar o proponer | banderín | `flag` |
| Ideación y conceptualización | cerebro | `brain` |
| Desarrollo de conceptos | caja abierta | `package-open` |
| Validación iterativa | ciclo | `refresh-cw` |
| Informe exhaustivo | documento | `file-text` |
| Análisis profundo | lupa | `search` |
| Experimentación ágil | matraz | `flask-conical` |
| Decisiones inteligentes | ramificación | `git-branch` |
| Capacidad creativa | varita | `wand-2` |
| Inteligencia artificial | chip | `cpu` |

### Metodología

| Concepto | Icono | Nombre Lucide |
|---|---|---|
| Entender | oído / escucha | `ear` |
| Co-crear | usuarios | `users` |
| Definir | mapa | `map` |
| Acompañar | apretón de manos | `handshake` |

### Interfaz y contacto

| Concepto | Icono | Nombre Lucide |
|---|---|---|
| Avanzar / CTA | flecha derecha | `arrow-right` |
| Enlace externo | flecha diagonal | `arrow-up-right` |
| Teléfono | teléfono | `phone` |
| Email | sobre | `mail` |
| Ubicación | pin | `map-pin` |
| Web | globo | `globe` |
| Agendar | calendario | `calendar` |
| Cerrar | equis | `x` |
| Menú | hamburguesa | `menu` |
| Validado | check en círculo | `circle-check` |

---

## Cómo pedir un icono nuevo

1. **Busca en <https://lucide.dev/icons/>.** El nombre que aparece ahí es el que
   va en `data-lucide`, tal cual.
2. **Verifica que el concepto no esté ya en el diccionario.** Si «crecimiento» ya
   es `trending-up`, no traigas `chart-line` para lo mismo.
3. **Agrégalo a la tabla que corresponda**, en la misma línea editorial: el
   concepto en español, la descripción del dibujo, y el nombre exacto.
4. **Si Lucide no lo tiene**, dilo antes de dibujar uno: un SVG a mano tendrá otro
   grosor, otra caja y otras esquinas, y se notará. Si igual hace falta, debe
   respetar el grid de 24×24, `stroke-width` 1.5, extremos redondeados y
   `stroke="currentColor"`, y va a `src/img/icons/`.

Con Claude Code:

```
/section añade iconos a las tarjetas de servicio según design/ICONS.md
```

---

## Producción: cambiar el CDN por un archivo local

El CDN es cómodo para trabajar, pero en producción trae dos costos reales: una
petición a un tercero en el camino crítico, y ~30 KB para usar 15 iconos.

Cuando el sitio esté cerrado, conviene reemplazarlo por un sprite:

1. Copia de <https://lucide.dev/icons/> solo los SVG que estés usando.
2. Únelos en `src/img/icons.svg`, cada uno dentro de `<symbol id="rocket" viewBox="0 0 24 24">`.
3. Cambia el uso:
   ```html
   <svg class="icon" aria-hidden="true"><use href="src/img/icons.svg#rocket"></use></svg>
   ```
4. Borra el `<script>` de Lucide.

Mismo aspecto, mismo CSS, cero JS y cero dependencias externas — que es la línea
del resto del proyecto.
