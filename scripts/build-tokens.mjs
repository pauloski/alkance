#!/usr/bin/env node
/**
 * design/tokens.json (formato W3C DTCG)  ->  src/styles/tokens.css
 *                                        ->  src/js/tokens-manifest.js
 *
 * Sin dependencias: solo node:fs.
 *
 *   node scripts/build-tokens.mjs           genera ambos archivos
 *   node scripts/build-tokens.mjs --check   no escribe; sale 1 si están desactualizados
 *
 * Reglas de traducción:
 *  - Un nodo es token si tiene $value. Los grupos pueden llevar $type y $description,
 *    y $type se hereda hacia abajo.
 *  - Los alias {ruta.al.token} se emiten como var(--ak-ruta-al-token), no como el
 *    valor plano: así cambiar un primitivo en runtime reencamina toda la cascada.
 *  - $extensions['cl.alkance.tokens'].fluid gana sobre $value al emitir CSS. El
 *    $value estático existe para que Figma pueda importar el token.
 *  - px -> rem solo en los grupos de REM_GROUPS (tipografía y espaciado, que deben
 *    escalar con el font-size del usuario). Bordes y radios siguen en px.
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const IN = resolve(ROOT, "design/tokens.json");
const OUT_CSS = resolve(ROOT, "src/styles/tokens.css");
const OUT_MANIFEST = resolve(ROOT, "src/js/tokens-manifest.js");
const OUT_CSS_SOURCE = resolve(ROOT, "src/js/css-source.js");
const OUT_ICONS = resolve(ROOT, "src/js/icons-dict.js");

const NS = "cl.alkance.tokens";
const ALIAS = /^\{([a-z0-9.\-_]+)\}$/i;
const REM_GROUPS = new Set(["font", "space", "size"]);
const MAX_DEPTH = 12;

const json = JSON.parse(readFileSync(IN, "utf8"));
const PREFIX = json.$extensions?.[NS]?.prefix ?? "ak";

const isToken = (node) => node && typeof node === "object" && "$value" in node;
const varName = (path) => `--${PREFIX}-${path.join("-")}`;
const ext = (node) => node.$extensions?.[NS] ?? {};

/** Busca un nodo por ruta con puntos: "color.ink.900". */
function lookup(dotted) {
  return dotted.split(".").reduce((acc, k) => (acc == null ? acc : acc[k]), json);
}

/** Resuelve un alias hasta su valor final, siguiendo cadenas. */
function deref(raw, trail = []) {
  const match = typeof raw === "string" && ALIAS.exec(raw.trim());
  if (!match) return raw;

  const target = match[1];
  if (trail.includes(target)) throw new Error(`Alias circular: ${[...trail, target].join(" -> ")}`);
  if (trail.length >= MAX_DEPTH) throw new Error(`Alias demasiado anidado: ${raw}`);

  const node = lookup(target);
  if (!node) throw new Error(`Alias sin destino: {${target}}`);
  if (!isToken(node)) throw new Error(`Alias {${target}} apunta a un grupo, no a un token`);

  return deref(node.$value, [...trail, target]);
}

const toRem = (value) =>
  String(value).replace(/(-?[\d.]+)px/g, (_, n) =>
    Number(n) === 0 ? "0" : `${+(Number(n) / 16).toFixed(4)}rem`
  );

/** #RRGGBBAA -> rgba(). Los otros formatos pasan tal cual. */
function cssColor(value) {
  const hex8 = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(String(value));
  if (!hex8) return value;
  const [r, g, b] = hex8.slice(1, 4).map((h) => parseInt(h, 16));
  const a = +(parseInt(hex8[4], 16) / 255).toFixed(3);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/** Traduce un $value ya desreferenciado a sintaxis CSS según su $type. */
function cssValue(value, type, group) {
  switch (type) {
    case "color":
      return cssColor(value);
    case "fontFamily":
      // Envuelve en comillas las familias con espacios; deja las keywords crudas.
      return (Array.isArray(value) ? value : [value])
        .map((f) => (/\s/.test(f) && !/^(-|ui-)/.test(f) ? `'${f}'` : f))
        .join(", ");
    case "cubicBezier":
      return `cubic-bezier(${value.join(", ")})`;
    case "shadow": {
      const list = Array.isArray(value) ? value : [value];
      return list
        .map((s) =>
          [s.offsetX, s.offsetY, s.blur, s.spread, cssColor(deref(s.color))]
            .filter(Boolean)
            .join(" ")
        )
        .join(", ");
    }
    case "dimension":
      return REM_GROUPS.has(group) ? toRem(value) : String(value);
    default:
      return String(value);
  }
}

/** Recorre el árbol y devuelve la lista plana de tokens. */
function collect(node, path = [], inheritedType = null, out = []) {
  const type = node.$type ?? inheritedType;

  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith("$")) continue;
    const nextPath = [...path, key];

    if (isToken(child)) {
      const childType = child.$type ?? type;
      const group = nextPath[0];
      const fluid = ext(child).fluid;
      const raw = child.$value;
      const aliasOf = ALIAS.exec(String(raw))?.[1] ?? null;

      // El alias se emite como var() para preservar la cascada en runtime.
      const css = fluid
        ? REM_GROUPS.has(group)
          ? fluid
          : fluid
        : aliasOf
          ? `var(${varName(aliasOf.split("."))})`
          : cssValue(deref(raw), childType, group);

      out.push({
        name: nextPath.join("."),
        cssVar: varName(nextPath),
        cssValue: css,
        resolved: cssValue(deref(raw), childType, group), // valor literal, para el swatch del design system
        type: childType,
        group,
        aliasOf,
        fluid: fluid ?? null,
        description: child.$description ?? "",
      });
    } else if (child && typeof child === "object") {
      collect(child, nextPath, type, out);
    }
  }
  return out;
}

const tokens = collect(json);

/* ---------- salida 1: tokens.css ---------- */

const byGroup = tokens.reduce((acc, t) => {
  (acc[t.group] ??= []).push(t);
  return acc;
}, {});

const css = [
  "/* GENERADO por scripts/build-tokens.mjs — NO EDITAR A MANO.",
  " * Fuente: design/tokens.json · Regenerar: node scripts/build-tokens.mjs",
  " */",
  "",
  ":root {",
  Object.entries(byGroup)
    .map(([group, list]) => {
      const head = json[group]?.$description?.split(".")[0] ?? group;
      const lines = list.map((t) => `  ${t.cssVar}: ${t.cssValue};`).join("\n");
      return `  /* ${group} — ${head} */\n${lines}`;
    })
    .join("\n\n"),
  "}",
  "",
].join("\n");

/* ---------- salida 2: tokens-manifest.js ---------- */
/* Se emite como JS (no JSON) a propósito: designsystem.html debe poder abrirse
   con file:// y fetch() de un .json local muere por CORS. */

const manifest = [
  "/* GENERADO por scripts/build-tokens.mjs — NO EDITAR A MANO.",
  " * Alimenta designsystem.html: tabla token -> variable CSS -> valor.",
  " */",
  "window.AK_TOKENS = " + JSON.stringify(tokens, null, 2) + ";",
  "window.AK_GROUPS = " +
    JSON.stringify(
      Object.fromEntries(
        Object.keys(byGroup).map((g) => [g, json[g]?.$description ?? ""])
      ),
      null,
      2
    ) +
    ";",
  "",
].join("\n");

/* ---------- salida 3: css-source.js ---------- */
/* Parte components.css por sus marcadores `/* @component Nombre *​/` y expone el
   CSS real de cada bloque. Así designsystem.html muestra el código vigente en
   lugar de una copia escrita a mano que se desincroniza al primer cambio. */

const componentsCss = readFileSync(resolve(ROOT, "src/styles/components.css"), "utf8");
const knownVars = new Set(tokens.map((t) => t.cssVar));

const sections = componentsCss
  .split(/\/\*\s*@component\s+(.+?)\s*\*\//)
  .slice(1) // el primer trozo es la cabecera del archivo
  .reduce((acc, part, i, arr) => {
    if (i % 2 !== 0) return acc;
    const body = arr[i + 1].trim();
    const used = [...new Set(body.match(/--[a-z0-9-]+/g) ?? [])].filter((v) => knownVars.has(v));
    acc.push({ name: part, css: body, tokens: used.sort() });
    return acc;
  }, []);

// Un var() que no exista en tokens.css rompe el estilo en silencio: falla el build.
const orphans = [...new Set(componentsCss.match(/var\((--ak-[a-z0-9-]+)/g) ?? [])]
  .map((m) => m.slice(4))
  .filter((v) => !knownVars.has(v));

if (orphans.length) {
  console.error(`✗ components.css referencia tokens inexistentes:\n${orphans.map((v) => `  · var(${v})`).join("\n")}`);
  process.exit(1);
}

const cssSource = [
  "/* GENERADO por scripts/build-tokens.mjs — NO EDITAR A MANO.",
  " * CSS real de cada componente, extraído de src/styles/components.css.",
  " */",
  "window.AK_CSS = " + JSON.stringify(sections, null, 2) + ";",
  "",
].join("\n");

/* ---------- salida 4: icons-dict.js ---------- */
/* Extrae el diccionario concepto -> icono de las tablas de design/ICONS.md, que
   es donde se documenta y por tanto la única fuente. Así el catálogo del design
   system no puede contradecir al documento que la gente lee. */

const iconsMd = readFileSync(resolve(ROOT, "design/ICONS.md"), "utf8");
const iconGroups = [];

for (const block of iconsMd.split(/^### /m).slice(1)) {
  const title = block.split("\n")[0].trim();
  const rows = [...block.matchAll(/^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*`([a-z0-9-]+)`\s*\|/gm)].map(
    ([, concept, drawing, name]) => ({ concept, drawing, name })
  );
  if (rows.length) iconGroups.push({ title, icons: rows });
}

const iconCount = iconGroups.reduce((n, g) => n + g.icons.length, 0);

const iconsDict = [
  "/* GENERADO por scripts/build-tokens.mjs — NO EDITAR A MANO.",
  " * Diccionario concepto -> icono, extraído de las tablas de design/ICONS.md.",
  " */",
  "window.AK_ICONS = " + JSON.stringify(iconGroups, null, 2) + ";",
  "",
].join("\n");

/* ---------- escritura ---------- */

const outputs = [
  [OUT_CSS, css],
  [OUT_MANIFEST, manifest],
  [OUT_CSS_SOURCE, cssSource],
  [OUT_ICONS, iconsDict],
];

if (process.argv.includes("--check")) {
  const stale = outputs.filter(([path, content]) => {
    try {
      return readFileSync(path, "utf8") !== content;
    } catch {
      return true;
    }
  });
  if (stale.length) {
    console.error(
      `✗ Desactualizado:\n${stale.map(([p]) => `  · ${p.replace(ROOT + "/", "")}`).join("\n")}\n` +
        `  Ejecuta: node scripts/build-tokens.mjs`
    );
    process.exit(1);
  }
  console.log("✓ tokens.css y tokens-manifest.js al día");
  process.exit(0);
}

for (const [path, content] of outputs) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

const aliases = tokens.filter((t) => t.aliasOf).length;
console.log(
  `✓ ${tokens.length} tokens (${aliases} alias) en ${Object.keys(byGroup).length} grupos\n` +
    `✓ ${sections.length} componentes extraídos de components.css\n` +
    `✓ ${iconCount} iconos en ${iconGroups.length} grupos desde ICONS.md\n` +
    `  → src/styles/tokens.css\n  → src/js/tokens-manifest.js\n  → src/js/css-source.js\n  → src/js/icons-dict.js`
);
