/* Motor de designsystem.html. Todo se genera desde los archivos que emite
 * scripts/build-tokens.mjs — window.AK_TOKENS (tokens) y window.AK_CSS (CSS real
 * de cada componente). Nada está escrito a mano aquí, así que la documentación
 * no puede desincronizarse del código.
 *
 * Los specimens se declaran en el HTML como <template data-spec="Nombre">.
 * El template cumple doble función: se clona para el render y su markup se
 * muestra como código.
 */

const TOKENS = window.AK_TOKENS ?? [];
const CSS = window.AK_CSS ?? [];
const byName = (name) => TOKENS.find((t) => t.name === name);

/* ---------- Contraste WCAG ---------- */

function luminance(hex) {
  const m = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const [r, g, b] = [0, 2, 4]
    .map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [x, y] = [luminance(a), luminance(b)];
  if (x === null || y === null) return null;
  const [hi, lo] = x > y ? [x, y] : [y, x];
  return (hi + 0.05) / (lo + 0.05);
}

/* ---------- Utilidades ---------- */

const el = (tag, props = {}, children = []) => {
  const node = Object.assign(document.createElement(tag), props);
  for (const child of [].concat(children)) {
    if (child) node.append(child.nodeType ? child : document.createTextNode(child));
  }
  return node;
};

const escapeHtml = (s) =>
  s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);

/** Resalta custom properties y comentarios. Opera sobre HTML ya escapado. */
const highlight = (escaped) =>
  escaped
    .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="cmt">$1</span>')
    .replace(/(--ak-[a-z0-9-]+)/g, '<span class="tok">$1</span>');

/** Reindenta el markup de un <template>, que hereda la sangría del HTML fuente. */
function dedent(html) {
  const lines = html.replace(/^\n/, "").replace(/\s+$/, "").split("\n");
  const indent = Math.min(
    ...lines.filter((l) => l.trim()).map((l) => l.match(/^\s*/)[0].length)
  );
  return lines.map((l) => l.slice(indent)).join("\n");
}

/* ---------- 1. Rampas de color ---------- */

function renderRamps() {
  const host = document.querySelector("[data-ramps]");
  if (!host) return;

  const ramps = ["color.ink", "color.accent"];

  for (const prefix of ramps) {
    const steps = TOKENS.filter((t) => t.name.startsWith(prefix + "."));
    if (!steps.length) continue;

    host.append(el("p", { className: "ds-sub", textContent: prefix }));

    const ramp = el("div", { className: "ds-ramp" });
    for (const t of steps) {
      const hex = t.resolved;
      const onWhite = contrast(hex, "#FFFFFF");
      // El texto del chip debe leerse sobre su propio color.
      const readable = contrast(hex, "#FFFFFF") >= 3 ? "#FFFFFF" : "#0A0A0A";

      ramp.append(
        el(
          "div",
          {
            className: "ds-chip",
            style: `background:${hex};color:${readable}`,
            title: t.description,
          },
          [
            el("span", { className: "ds-chip__step", textContent: t.name.split(".").pop() }),
            el("span", { className: "ds-chip__hex", textContent: hex }),
            el("span", {
              className: "ds-chip__ratio",
              textContent: onWhite ? `${onWhite.toFixed(1)}:1` : "",
              title: "Contraste sobre blanco",
            }),
          ]
        )
      );
    }
    host.append(ramp);
  }
}

/* ---------- 2. Roles semánticos ---------- */

function renderRoles() {
  const host = document.querySelector("[data-roles]");
  if (!host) return;

  const groups = ["semantic.bg", "semantic.fg", "semantic.border"];

  for (const prefix of groups) {
    const roles = TOKENS.filter((t) => t.name.startsWith(prefix + "."));
    if (!roles.length) continue;

    host.append(el("p", { className: "ds-sub", textContent: prefix }));
    const grid = el("div", { className: "ds-roles" });

    for (const t of roles) {
      grid.append(
        el("div", { className: "ds-role" }, [
          el("span", { className: "ds-role__swatch", style: `background:${t.resolved}` }),
          el("div", {}, [
            el("div", { className: "ds-role__name", textContent: t.cssVar }),
            el("div", { className: "ds-role__alias", textContent: `→ ${t.aliasOf ?? t.resolved}` }),
            el("p", { className: "ds-role__desc", textContent: t.description }),
          ]),
        ])
      );
    }
    host.append(grid);
  }
}

/* ---------- 3. Escala tipográfica ---------- */

function renderType() {
  const host = document.querySelector("[data-type]");
  if (!host) return;

  const sizes = TOKENS.filter((t) => t.name.startsWith("font.size."));

  for (const t of sizes.reverse()) {
    const key = t.name.split(".").pop();
    host.append(
      el("div", { className: "ds-type" }, [
        el("div", { className: "ds-type__meta" }, [
          el("div", { textContent: key }),
          el("div", { textContent: `${t.resolved} @desktop` }),
          el("div", { textContent: t.fluid ? "fluido · clamp()" : "fijo" }),
        ]),
        el("div", {
          className: "ds-type__sample",
          style: `font-size:var(${t.cssVar})`,
          textContent: "Marcas que crecen",
          title: t.description,
        }),
      ])
    );
  }
}

/* ---------- 4. Escala de espaciado ---------- */

function renderSpace() {
  const host = document.querySelector("[data-space]");
  if (!host) return;

  const spaces = TOKENS.filter((t) => t.name.startsWith("space.") && !t.fluid);

  for (const t of spaces) {
    host.append(
      el("div", { className: "ds-space" }, [
        el("span", { className: "ds-space__bar", style: `width:var(${t.cssVar})` }),
        el("span", {
          className: "ds-space__label",
          textContent: `${t.name}  ·  ${t.resolved}  ·  ${t.cssValue}`,
        }),
      ])
    );
  }
}

/* ---------- 5. Specimens de componente ---------- */
/* Cada <template data-spec="X"> se clona para el render, su markup se muestra
   como HTML, y el CSS sale de window.AK_CSS (el archivo real). */

function renderSpecs() {
  for (const tpl of document.querySelectorAll("template[data-spec]")) {
    const name = tpl.dataset.spec;
    const source = CSS.find((c) => c.name === name);
    const markup = dedent(tpl.innerHTML);

    const render = el("div", {
      className: `ds-spec__render ${tpl.dataset.render ? `ds-spec__render--${tpl.dataset.render}` : ""}`,
    });
    render.append(tpl.content.cloneNode(true));

    const panels = [
      { id: "html", label: "HTML", body: highlight(escapeHtml(markup)) },
      {
        id: "css",
        label: "CSS",
        body: source ? highlight(escapeHtml(source.css)) : "<span class='cmt'>/* sin CSS propio */</span>",
      },
      {
        id: "tokens",
        label: `Tokens (${source?.tokens.length ?? 0})`,
        body: source?.tokens.length
          ? highlight(escapeHtml(source.tokens.map((v) => `${v}: ${byName(varToName(v))?.resolved ?? ""};`).join("\n")))
          : "<span class='cmt'>/* no consume tokens */</span>",
      },
    ];

    const tabs = el("div", { className: "ds-tabs", role: "tablist" });
    const bodies = panels.map((p, i) => {
      const pre = el("pre", { className: "ds-code", id: `${slug(name)}-${p.id}`, hidden: i !== 0 });
      pre.innerHTML = `<code>${p.body}</code>`;
      return pre;
    });

    panels.forEach((p, i) => {
      const tab = el("button", {
        className: "ds-tab",
        type: "button",
        role: "tab",
        textContent: p.label,
      });
      tab.setAttribute("aria-selected", String(i === 0));
      tab.setAttribute("aria-controls", `${slug(name)}-${p.id}`);
      tab.addEventListener("click", () => {
        tabs.querySelectorAll(".ds-tab").forEach((t, j) => {
          t.setAttribute("aria-selected", String(j === i));
          bodies[j].hidden = j !== i;
        });
      });
      tabs.append(tab);
    });

    const copy = el("button", { className: "ds-copy", type: "button", textContent: "Copiar" });
    copy.addEventListener("click", async () => {
      const visible = bodies.find((b) => !b.hidden);
      await navigator.clipboard.writeText(visible.textContent);
      copy.textContent = "Copiado";
      setTimeout(() => (copy.textContent = "Copiar"), 1200);
    });

    const spec = el("div", { className: "ds-spec" }, [
      el("div", { className: "ds-spec__head" }, [
        el("span", { className: "ds-spec__name", textContent: name }),
        el("div", { className: "ds-spec__actions" }, [tabs, copy]),
      ]),
      render,
      ...bodies,
    ]);

    tpl.replaceWith(spec);
  }
}

const slug = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-");

/** --ak-color-ink-900 -> color.ink.900, resolviendo contra los nombres reales. */
function varToName(cssVar) {
  const match = TOKENS.find((t) => t.cssVar === cssVar);
  return match?.name ?? "";
}

/* ---------- 5b. Catálogo de iconos ---------- */
/* Se genera desde window.AK_ICONS, que el build extrae de design/ICONS.md: el
   catálogo no puede contradecir al documento que la gente lee.
   Los <i data-lucide> los sustituye Lucide por <svg> al final de la página. */

function renderIcons() {
  const host = document.querySelector("[data-icons]");
  if (!host) return;

  for (const group of window.AK_ICONS ?? []) {
    host.append(el("p", { className: "ds-sub", textContent: group.title }));
    const grid = el("div", { className: "ds-icons" });

    for (const icon of group.icons) {
      const cell = el("div", { className: "ds-icon", title: `${icon.concept} · ${icon.drawing}` });
      const glyph = el("i", { className: "icon icon--lg" });
      glyph.setAttribute("data-lucide", icon.name);
      glyph.setAttribute("aria-hidden", "true");

      const copy = el("button", {
        className: "ds-icon__name",
        type: "button",
        textContent: icon.name,
        title: "Copiar el markup",
      });
      copy.addEventListener("click", async () => {
        await navigator.clipboard.writeText(`<i data-lucide="${icon.name}" class="icon" aria-hidden="true"></i>`);
        const prev = copy.textContent;
        copy.textContent = "copiado";
        setTimeout(() => (copy.textContent = prev), 1200);
      });

      cell.append(glyph, copy, el("span", { className: "ds-icon__concept", textContent: icon.concept }));
      grid.append(cell);
    }
    host.append(grid);
  }
}

/* ---------- 6. Tabla token -> variable -> valor ---------- */

function layerOf(description) {
  const d = description.toLowerCase();
  if (d.startsWith("componente")) return "componente";
  if (d.startsWith("semántico")) return "semantico";
  return "primitivo";
}

const LAYER_LABEL = { primitivo: "Primitivo", semantico: "Semántico", componente: "Componente" };

function renderTable() {
  const body = document.querySelector("[data-table]");
  const search = document.querySelector("[data-search]");
  const count = document.querySelector("[data-count]");
  if (!body) return;

  const rows = TOKENS.map((t) => {
    const layer = layerOf(t.description);
    const isColor = t.type === "color";

    const tr = el("tr", {}, [
      el("td", {}, [el("code", { textContent: t.name })]),
      el("td", {}, [el("code", { textContent: t.cssVar })]),
      el("td", {}, [
        isColor ? el("span", { className: "ds-dot", style: `background:${t.resolved}` }) : null,
        el("code", { textContent: t.fluid ?? t.resolved }),
      ]),
      el("td", {}, [
        el("span", {
          className: `ds-layer ds-layer--${layer}`,
          textContent: LAYER_LABEL[layer],
        }),
      ]),
      el("td", { className: "ds-table__desc", textContent: t.description }),
    ]);

    return { tr, haystack: `${t.name} ${t.cssVar} ${t.resolved} ${t.description}`.toLowerCase() };
  });

  body.append(...rows.map((r) => r.tr));

  const update = () => {
    const q = (search?.value ?? "").trim().toLowerCase();
    let visible = 0;
    for (const r of rows) {
      const show = !q || r.haystack.includes(q);
      r.tr.hidden = !show;
      if (show) visible++;
    }
    if (count) count.textContent = `${visible} / ${TOKENS.length} tokens`;
  };

  search?.addEventListener("input", update);
  update();
}

/* ---------- Arranque ---------- */

renderRamps();
renderRoles();
renderType();
renderSpace();
renderSpecs();
renderIcons();
renderTable();
