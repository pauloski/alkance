#!/usr/bin/env node
/**
 * Conversor GENÉRICO de tokens (formato W3C DTCG) -> variables CSS.
 * Sirve para el design system del sitio o para el token propio de CADA landing.
 * Sin dependencias: solo node:fs.
 *
 *   node scripts/tokens-to-css.mjs <entrada.json> <salida.css> [--prefix p] [--check]
 *
 * Ejemplos:
 *   node scripts/tokens-to-css.mjs landings/ecommerce/tokens.json landings/ecommerce/tokens.css --prefix lp
 *   node scripts/tokens-to-css.mjs design/tokens.json src/styles/tokens.css --prefix ak
 *
 * Reglas (idénticas a scripts/build-tokens.mjs, en versión portátil):
 *  - Un nodo es token si tiene $value. $type se hereda hacia abajo.
 *  - Los alias {ruta.al.token} se emiten como var(--<prefix>-ruta-al-token), para
 *    que cambiar un primitivo en runtime reencamine toda la cascada.
 *  - $extensions[NS].fluid gana sobre $value (para clamp() responsivos).
 *  - px -> rem solo en grupos tipográficos/espaciales (font, space, size).
 *  - El prefijo sale de --prefix, o de $extensions[NS].prefix, o "ak".
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const NS = "cl.alkance.tokens";
const ALIAS = /^\{([a-z0-9.\-_]+)\}$/i;
const REM_GROUPS = new Set(["font", "space", "size"]);
const MAX_DEPTH = 12;

// ---- argumentos ----
const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("--")));
const posic = args.filter((a) => !a.startsWith("--"));
const prefixArg = (() => {
  const i = args.indexOf("--prefix");
  return i >= 0 ? args[i + 1] : null;
})();
const [inPath, outPath] = posic.filter((a) => a !== prefixArg);

if (!inPath || !outPath) {
  console.error("Uso: node scripts/tokens-to-css.mjs <entrada.json> <salida.css> [--prefix p] [--check]");
  process.exit(2);
}

const IN = resolve(process.cwd(), inPath);
const OUT = resolve(process.cwd(), outPath);
const json = JSON.parse(readFileSync(IN, "utf8"));
const PREFIX = prefixArg ?? json.$extensions?.[NS]?.prefix ?? "ak";

const isToken = (node) => node && typeof node === "object" && "$value" in node;
const varName = (path) => `--${PREFIX}-${path.join("-")}`;
const ext = (node) => node.$extensions?.[NS] ?? {};
const lookup = (dotted) => dotted.split(".").reduce((acc, k) => (acc == null ? acc : acc[k]), json);

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
  String(value).replace(/(-?[\d.]+)px/g, (_, n) => (Number(n) === 0 ? "0" : `${+(Number(n) / 16).toFixed(4)}rem`));

function cssColor(value) {
  const hex8 = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(String(value));
  if (!hex8) return value;
  const [r, g, b] = hex8.slice(1, 4).map((h) => parseInt(h, 16));
  const a = +(parseInt(hex8[4], 16) / 255).toFixed(3);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function cssValue(value, type, group) {
  switch (type) {
    case "color":
      return cssColor(value);
    case "fontFamily":
      return (Array.isArray(value) ? value : [value])
        .map((f) => (/\s/.test(f) && !/^(-|ui-)/.test(f) ? `'${f}'` : f))
        .join(", ");
    case "cubicBezier":
      return `cubic-bezier(${value.join(", ")})`;
    case "shadow": {
      const list = Array.isArray(value) ? value : [value];
      return list
        .map((s) => [s.offsetX, s.offsetY, s.blur, s.spread, cssColor(deref(s.color))].filter(Boolean).join(" "))
        .join(", ");
    }
    case "dimension":
      return REM_GROUPS.has(group) ? toRem(value) : String(value);
    default:
      return String(value);
  }
}

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
      const css = fluid
        ? fluid
        : aliasOf
          ? `var(${varName(aliasOf.split("."))})`
          : cssValue(deref(raw), childType, group);
      out.push({ cssVar: varName(nextPath), cssValue: css, group });
    } else if (child && typeof child === "object") {
      collect(child, nextPath, type, out);
    }
  }
  return out;
}

const tokens = collect(json);
const byGroup = tokens.reduce((acc, t) => ((acc[t.group] ??= []).push(t), acc), {});

const css = [
  `/* GENERADO por scripts/tokens-to-css.mjs — NO EDITAR A MANO.`,
  ` * Fuente: ${inPath} · Prefijo: --${PREFIX}-`,
  ` * Regenerar: node scripts/tokens-to-css.mjs ${inPath} ${outPath} --prefix ${PREFIX}`,
  ` */`,
  "",
  ":root {",
  Object.entries(byGroup)
    .map(([group, list]) => {
      const head = json[group]?.$description?.split(".")[0] ?? group;
      return `  /* ${group} — ${head} */\n${list.map((t) => `  ${t.cssVar}: ${t.cssValue};`).join("\n")}`;
    })
    .join("\n\n"),
  "}",
  "",
].join("\n");

if (flags.has("--check")) {
  let actual = "";
  try { actual = readFileSync(OUT, "utf8"); } catch {}
  if (actual !== css) {
    console.error(`✗ ${outPath} desactualizado. Ejecuta: node scripts/tokens-to-css.mjs ${inPath} ${outPath} --prefix ${PREFIX}`);
    process.exit(1);
  }
  console.log(`✓ ${outPath} al día`);
  process.exit(0);
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, css);
const aliases = tokens.filter((t) => /var\(--/.test(t.cssValue)).length;
console.log(`✓ ${tokens.length} tokens (${aliases} alias) en ${Object.keys(byGroup).length} grupos con prefijo --${PREFIX}-\n  → ${outPath}`);
