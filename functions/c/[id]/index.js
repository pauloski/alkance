/**
 * GET /c/:id — vista PÚBLICA y compartible de una cotización.
 *
 * No requiere sesión: el id es un slug aleatorio no adivinable y hace de "clave"
 * del enlace. Renderiza HTML server-side (se ve sin JS y se imprime limpio) con
 * estilos de impresión y un botón "Descargar PDF" que abre el diálogo de imprimir.
 *
 * Hereda el design system del sitio (src/styles/tokens.css) y añade encima un
 * estilo propio de documento pensado para pantalla y para papel A4.
 */
import { clp, escapar, totalDeItems } from "../../api/_lib/http.js";

/** Saneador para el HTML del texto enriquecido guardado desde el panel.
 *  Deja solo una lista blanca de etiquetas, SIN atributos (mata on*, style,
 *  href javascript:, etc.) y elimina el contenido de <script>/<style>. */
const TAGS_RICOS = new Set(["b", "strong", "i", "em", "u", "ul", "ol", "li", "br", "p", "div", "span"]);
function sanitizarRico(html) {
  if (!html) return "";
  let s = String(html)
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, "");
  s = s.replace(/<\/?([a-zA-Z0-9]+)([^>]*)>/g, (m, tag) => {
    const t = tag.toLowerCase();
    if (!TAGS_RICOS.has(t)) return "";
    if (m.startsWith("</")) return `</${t}>`;
    return t === "br" ? "<br>" : `<${t}>`;
  });
  return s;
}

/** Renderiza un campo que puede venir como HTML rico (nuevo) o texto plano
 *  (cotizaciones antiguas): si parece HTML lo sanea; si no, respeta párrafos. */
function renderRico(valor) {
  if (!valor) return "";
  if (Array.isArray(valor)) valor = valor.join("\n\n");
  return /<[a-z][\s\S]*>/i.test(valor) ? sanitizarRico(valor) : parrafos(valor);
}

function parrafos(intro) {
  const arr = Array.isArray(intro)
    ? intro
    : String(intro ?? "").split(/\n{2,}/);
  return arr
    .map((p) => String(p).trim())
    .filter(Boolean)
    .map((p) => `<p>${escapar(p)}</p>`) // saltos simples se respetan con white-space
    .join("");
}

function renderFase(f, i) {
  const puntos = (Array.isArray(f?.puntos) ? f.puntos : [])
    .map((p) => {
      const t = escapar(p?.titulo ?? "");
      const d = escapar(p?.detalle ?? "");
      return `<li>${t ? `<strong>${t}:</strong> ` : ""}${d}</li>`;
    })
    .join("");
  return `
    <section class="fase">
      <h3 class="fase__titulo">${escapar(f?.titulo ?? `Fase ${i + 1}`)}</h3>
      ${f?.dedicacion ? `<p class="fase__dedicacion">${escapar(f.dedicacion)}</p>` : ""}
      ${f?.descripcion ? `<div class="fase__desc rico">${renderRico(f.descripcion)}</div>` : ""}
      ${puntos ? `<ul class="fase__puntos">${puntos}</ul>` : ""}
      ${
        f?.entregable
          ? `<p class="fase__entregable"><strong>Entregable:</strong> ${escapar(
              f.entregable
            )}</p>`
          : ""
      }
      ${
        f?.notas
          ? `<div class="fase__notas rico"><span class="fase__notas-label">Notas:</span> ${renderRico(
              f.notas
            )}</div>`
          : ""
      }
    </section>`;
}

function renderItems(items, moneda) {
  const filas = items
    .map(
      (it) => `
      <tr>
        <td class="item__concepto">${escapar(it?.concepto ?? "")}</td>
        <td class="item__detalle">${escapar(it?.detalle ?? "")}</td>
        <td class="item__monto">${clp(it?.monto)}</td>
      </tr>`
    )
    .join("");
  const total = totalDeItems({ items });
  return `
    <table class="tabla">
      <thead>
        <tr>
          <th>Ítem</th>
          <th>Detalle</th>
          <th class="col-monto">Monto${moneda ? ` (${escapar(moneda)})` : ""}</th>
        </tr>
      </thead>
      <tbody>${filas}</tbody>
      <tfoot>
        <tr>
          <td colspan="2" class="total__label">TOTAL</td>
          <td class="total__monto">${clp(total)}</td>
        </tr>
      </tfoot>
    </table>`;
}

function renderCliente(info, nombreFallback) {
  const ci = info || {};
  const nombre = ci.nombre || nombreFallback || "";
  if (!nombre && !ci.empresa) return "";
  const linea2 = [ci.empresa, ci.rut].filter(Boolean).join(" · ");
  const linea3 = [ci.email, ci.telefono].filter(Boolean).join(" · ");
  return `
    <div class="cliente">
      <span class="cliente__label">Preparado para</span>
      <p class="cliente__nombre">${escapar(nombre || ci.empresa)}</p>
      ${linea2 ? `<p class="cliente__meta">${escapar(linea2)}</p>` : ""}
      ${linea3 ? `<p class="cliente__meta">${escapar(linea3)}</p>` : ""}
      ${ci.direccion ? `<p class="cliente__meta">${escapar(ci.direccion)}</p>` : ""}
    </div>`;
}

function renderFooter(footer) {
  if (!footer) return "";
  const campos = [
    ["Titular", footer.titular],
    ["RUT", footer.rut],
    ["Banco", footer.banco],
    ["Tipo de cuenta", footer.tipoCuenta],
    ["Cuenta", footer.cuenta],
    ["Email", footer.email],
    ["Teléfono", footer.telefono],
  ].filter(([, v]) => v);
  if (!campos.length && !footer.notas) return "";
  const lineas = campos
    .map(([k, v]) => `<p><strong>${escapar(k)}:</strong> ${escapar(v)}</p>`)
    .join("");
  return `
    <footer class="doc-footer">
      ${campos.length ? `<h3>Datos para transferencia</h3><div class="datos">${lineas}</div>` : ""}
      ${footer.notas ? `<div class="notas rico">${renderRico(footer.notas)}</div>` : ""}
    </footer>`;
}

const ETIQUETA_AVANCE = { pendiente: "Pendiente", proceso: "En proceso", completado: "Completado" };
const faseKey = (f, i) => (f && f.id) || "idx:" + i;

/** Datos de contacto con valores por defecto (editables en el panel > Emisor). */
function contactoConDefaults(contacto) {
  return {
    sitioWeb: contacto.sitioWeb || "www.alkancedigital.cl",
    email: contacto.email || "contacto@alkancedigital.cl",
    instagram: contacto.instagram || "@alkance_consultora",
    instagramUrl: contacto.instagramUrl || "https://instagram.com/alkancedigital.cl",
  };
}

function renderContacto(cont) {
  const web = cont.sitioWeb.replace(/^https?:\/\//, "");
  return `<div class="contacto">
    <a href="https://${escapar(web)}">${escapar(cont.sitioWeb)}</a>
    <span aria-hidden="true">·</span>
    <a href="mailto:${escapar(cont.email)}">${escapar(cont.email)}</a>
    <span aria-hidden="true">·</span>
    <a href="${escapar(cont.instagramUrl)}">${escapar(cont.instagram)} (Instagram)</a>
  </div>`;
}

/** Línea de tiempo vertical (Gantt). Fase 0 = evaluación del presupuesto (con los
 *  hitos de versión); luego las fases del proyecto, bloqueadas hasta aprobar. */
function renderTimeline({ estado, version, revisiones, fases, avance }) {
  const aprobado = estado === "aprobada";
  const F0 = {
    borrador: { c: "borrador", l: "En preparación" },
    enviada: { c: "proceso", l: "En evaluación" },
    ajustes: { c: "proceso", l: "Ajustes solicitados" },
    aprobada: { c: "completado", l: "Aprobado" },
    rechazada: { c: "rechazada", l: "Rechazado" },
    cancelada: { c: "rechazada", l: "Cerrada sin respuesta" },
  };
  const f0info = F0[estado] || F0.borrador;
  const f0 = f0info.c;
  const f0Label = f0info.l;

  const versionActual = `<li><strong>Presupuesto v${version}</strong> · ${escapar(f0Label)}</li>`;
  const pasadas = (revisiones || [])
    .map((r) => `<li>Presupuesto v${r.version} · <span class="sustituido">Sustituido</span></li>`)
    .join("");

  const total = fases.length;
  const completadas = fases.filter((f, i) => avance[faseKey(f, i)] === "completado").length;
  const pct = total ? Math.round((completadas / total) * 100) : 0;

  const pasos = fases
    .map((f, i) => {
      const k = faseKey(f, i);
      const av = aprobado ? avance[k] || "pendiente" : "bloqueada";
      const etiqueta = aprobado ? ETIQUETA_AVANCE[av] || "Pendiente" : "En espera de aprobación";
      return `<li class="paso paso--${av}" data-fase-key="${escapar(k)}">
        <span class="paso__punto"></span>
        <div class="paso__cuerpo">
          <div class="paso__top">
            <strong>${escapar(f.titulo || "Fase " + (i + 1))}</strong>
            <span class="paso__chip chip--${av}">${escapar(etiqueta)}</span>
          </div>
          ${f.dedicacion ? `<span class="paso__meta">${escapar(f.dedicacion)}</span>` : ""}
          ${f.entregable ? `<span class="paso__meta">Entregable: ${escapar(f.entregable)}</span>` : ""}
        </div>
      </li>`;
    })
    .join("");

  return `
    <div class="tl">
      <div class="tl__f0 f0--${f0}">
        <div class="tl__f0-head">
          <span class="paso__punto"></span>
          <div>
            <strong>Fase 0 · Evaluación del presupuesto</strong>
            <span class="paso__chip chip--${f0}">${escapar(f0Label)}</span>
          </div>
        </div>
        <ul class="tl__hitos">${versionActual}${pasadas}</ul>
      </div>

      ${
        aprobado
          ? `<div class="tl__prog"><div class="tl__prog-bar"><span style="width:${pct}%"></span></div><span class="tl__prog-num">${completadas}/${total} fases · ${pct}%</span></div>`
          : `<p class="tl__nota">Las fases del proyecto se activan cuando el presupuesto queda <strong>aprobado</strong>.</p>`
      }

      ${total ? `<ul class="pasos">${pasos}</ul>` : `<p class="tl__nota">Aún no hay fases definidas.</p>`}
    </div>`;
}

function paginaNoEncontrada() {
  return new Response(
    `<!doctype html><meta charset="utf-8"><title>No encontrada</title>
     <body style="font-family:system-ui;max-width:32rem;margin:15vh auto;padding:0 1.5rem;text-align:center">
     <h1>Cotización no encontrada</h1>
     <p>El enlace no existe o fue eliminado.</p></body>`,
    { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

export async function onRequestGet({ params, env }) {
  if (!env.DB) return paginaNoEncontrada();
  const c = await env.DB.prepare(
    `SELECT id, version, estado, updated_at, data, avance FROM cotizaciones WHERE id = ?`
  )
    .bind(params.id)
    .first();
  if (!c) return paginaNoEncontrada();

  let data;
  try {
    data = JSON.parse(c.data);
  } catch {
    data = {};
  }
  let avance = {};
  try { avance = JSON.parse(c.avance || "{}"); } catch { avance = {}; }

  // Historial de versiones (para los hitos de la línea de tiempo) y datos de
  // contacto de la empresa (config 'contacto').
  const { results: revisiones } = await env.DB.prepare(
    `SELECT version FROM revisiones WHERE cotizacion_id = ? ORDER BY version DESC`
  ).bind(params.id).all();
  const cfgContacto = await env.DB.prepare(`SELECT valor FROM config WHERE clave = 'contacto'`).first();
  let contacto = {};
  try { contacto = cfgContacto ? JSON.parse(cfgContacto.valor) : {}; } catch { contacto = {}; }

  // Datos del cliente: se prefiere la ficha VIVA (por clienteId) para que
  // correcciones en la pestaña Clientes (p. ej. borrar un RUT) se reflejen al
  // instante. El snapshot guardado (clienteInfo) es solo respaldo si el cliente
  // fue eliminado de la agenda.
  let clienteInfo = data.clienteInfo || null;
  if (data.clienteId) {
    const vivo = await env.DB.prepare(
      `SELECT nombre, empresa, rut, email, telefono, direccion FROM clientes WHERE id = ?`
    ).bind(data.clienteId).first();
    if (vivo) clienteInfo = vivo;
  }

  const items = Array.isArray(data.items) ? data.items : [];
  const fases = Array.isArray(data.fases) ? data.fases : [];
  const titulo = data.titulo || "Propuesta";
  const cont = contactoConDefaults(contacto);
  const fechaFmt = data.fecha
    ? new Date(data.fecha + "T00:00:00").toLocaleDateString("es-CL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>${escapar(titulo)}</title>
  <link rel="stylesheet" href="/src/styles/tokens.css">
  <link rel="stylesheet" href="/src/styles/fonts.css">
  <style>
    :root { --doc-max: 820px; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--ak-color-ink-100, #e4e4e4);
      color: var(--ak-semantic-fg-default, #0a0a0a);
      font-family: var(--ak-font-family-sans, system-ui);
      font-size: 15px;
      line-height: 1.55;
      -webkit-font-smoothing: antialiased;
    }
    .barra {
      position: sticky; top: 0; z-index: 10;
      display: flex; gap: .75rem; justify-content: flex-end; align-items: center;
      padding: .75rem 1.25rem;
      background: var(--ak-color-ink-900, #0a0a0a);
      color: #fff;
    }
    .barra span { margin-right: auto; font-size: 13px; opacity: .8; }
    .btn {
      font: inherit; font-size: 14px; font-weight: 600; cursor: pointer;
      padding: .55rem 1.1rem; border-radius: 4px; border: 1px solid transparent;
      background: var(--ak-color-accent-500, #e5241a); color: #fff;
    }
    .btn:hover { background: var(--ak-color-accent-600, #b8170d); }
    .btn--ghost { background: transparent; border-color: rgba(255,255,255,.35); color: #fff; }
    .doc {
      max-width: var(--doc-max); margin: 2rem auto; padding: 3.5rem 3rem;
      background: #fff; box-shadow: 0 4px 30px rgba(0,0,0,.12);
    }
    .doc-head {
      display: flex; justify-content: space-between; align-items: flex-start;
      gap: 1rem; padding-bottom: 1.25rem; margin-bottom: 1.75rem;
      border-bottom: 2px solid var(--ak-color-accent-500, #e5241a);
    }
    .doc-head img { height: 40px; width: auto; }
    .doc-head .fecha { font-size: 14px; text-align: right; }
    .doc-head .fecha strong { display: block; }
    .doc h1 {
      font-size: 26px; line-height: 1.2; margin: 0 0 1.25rem;
      color: var(--ak-color-accent-600, #b8170d);
    }
    .cliente { margin: -0.5rem 0 1.75rem; }
    .cliente__label { font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: var(--ak-color-ink-350, #8a8a8a); }
    .cliente__nombre { font-size: 17px; font-weight: 600; margin: .15rem 0 .1rem; }
    .cliente__meta { font-size: 13px; color: var(--ak-color-ink-400, #6b6b6b); margin: 0; }
    .intro {
      background: var(--ak-color-cream-100, #f7f5f1);
      border-left: 4px solid var(--ak-color-accent-500, #e5241a);
      padding: 1.25rem 1.5rem; margin-bottom: 2rem;
    }
    .intro p { margin: 0 0 .75rem; white-space: pre-line; }
    .intro p:last-child { margin-bottom: 0; }
    /* Contenido de texto enriquecido (negritas y viñetas del panel). */
    .rico ul, .rico ol { padding-left: 1.35rem; margin: .5rem 0; }
    .rico ul { list-style: disc; }
    .rico ol { list-style: decimal; }
    .rico li { margin: .25rem 0; }
    .rico > div, .rico > p { margin: 0 0 .6rem; }
    .rico > div:last-child, .rico > p:last-child { margin-bottom: 0; }
    .rico strong, .rico b { font-weight: 700; }
    .rico em, .rico i { font-style: italic; }
    .fase {
      border: 1px solid var(--ak-color-cream-300, #e4e0d7); border-radius: 8px;
      padding: 1.25rem 1.5rem; margin-bottom: 1.25rem;
      break-inside: avoid;
    }
    .fase__titulo {
      font-size: 16px; text-transform: uppercase; letter-spacing: .01em;
      color: var(--ak-color-accent-600, #b8170d); margin: 0 0 .25rem;
    }
    .fase__dedicacion { font-weight: 600; color: var(--ak-color-ink-400, #6b6b6b); margin: 0 0 .75rem; font-size: 14px; }
    .fase__desc { margin: 0 0 .75rem; white-space: pre-line; }
    .fase__puntos { margin: 0 0 .5rem; padding-left: 1.1rem; list-style: disc; }
    .fase__puntos li { margin-bottom: .4rem; }
    .fase__entregable { margin: .5rem 0 0; }
    .fase__notas { margin: .6rem 0 0; font-size: 13px; color: var(--ak-color-ink-400, #6b6b6b); }
    .fase__notas-label { font-weight: 700; }
    h2.seccion { font-size: 18px; margin: 2rem 0 1rem; break-after: avoid; }
    /* El pie con la URL, fijo abajo: en impresión se repite en cada página. */
    .pie-web { display: none; }
    .tabla { width: 100%; border-collapse: collapse; font-size: 14px; }
    .tabla th {
      background: var(--ak-color-ink-900, #0a0a0a); color: #fff;
      text-align: left; padding: .7rem .85rem; font-size: 13px;
    }
    .tabla th.col-monto, .tabla td.item__monto, .tabla .total__monto { text-align: right; white-space: nowrap; }
    .tabla td { padding: .7rem .85rem; border-bottom: 1px solid var(--ak-color-cream-300, #e4e0d7); vertical-align: top; }
    .tabla tbody tr:nth-child(even) { background: var(--ak-color-cream-50, #fbf9f6); }
    .item__concepto { font-weight: 600; }
    .tabla tfoot td { border-top: 2px solid var(--ak-color-ink-900, #0a0a0a); border-bottom: none; font-weight: 700; font-size: 15px; padding-top: .85rem; }
    .doc-footer { margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid var(--ak-color-cream-300, #e4e0d7); }
    .doc-footer h3 { font-size: 15px; margin: 0 0 .5rem; }
    .doc-footer .datos p { margin: 0 0 .2rem; font-size: 14px; }
    .doc-footer .notas { margin-top: 1rem; font-size: 13px; color: var(--ak-color-ink-400, #6b6b6b); white-space: pre-line; }
    .sello { margin-top: 2rem; font-size: 12px; color: var(--ak-color-ink-350, #8a8a8a); }
    .oculto { display: none !important; }

    /* Pestañas */
    .tabs { display: flex; gap: .25rem; margin-right: auto; }
    .tab { color: rgba(255,255,255,.7); font-size: 14px; font-weight: 600; padding: .4rem .8rem; border-radius: 6px; }
    .tab:hover { color: #fff; background: rgba(255,255,255,.08); }
    .tab.activa { color: #fff; background: rgba(255,255,255,.16); }

    /* Contacto */
    .doc-contacto { margin-top: 2rem; padding-top: 1.25rem; border-top: 1px solid var(--ak-color-cream-300, #e4e0d7); }
    .contacto { display: flex; flex-wrap: wrap; gap: .5rem; font-size: 13px; color: var(--ak-color-ink-400, #6b6b6b); }
    .contacto a { color: var(--ak-color-accent-600, #b8170d); text-decoration: none; }

    /* Línea de tiempo (Gantt vertical) */
    .doc--tl h1 { margin-bottom: .25rem; }
    .tl__sub { color: var(--ak-color-ink-400, #6b6b6b); margin: 0 0 1.75rem; }
    .tl__f0 { background: var(--ak-color-cream-100, #f7f5f1); border-left: 4px solid var(--ak-color-accent-500, #e5241a); border-radius: 8px; padding: 1.1rem 1.25rem; margin-bottom: 1.5rem; }
    .tl__f0.f0--completado { border-left-color: var(--ak-color-state-success, #0f7b4f); }
    .tl__f0.f0--rechazada { border-left-color: var(--ak-color-state-danger, #b8170d); }
    .tl__f0.f0--borrador { border-left-color: var(--ak-color-cream-400, #cfc8ba); }
    .tl__f0-head { display: flex; align-items: flex-start; gap: .9rem; }
    .tl__f0-head strong { display: block; font-size: 16px; margin-bottom: .3rem; }
    .tl__hitos { list-style: none; margin: .75rem 0 0 2rem; padding: 0; font-size: 13px; color: var(--ak-color-ink-400, #6b6b6b); }
    .tl__hitos li { margin-bottom: .2rem; }
    .sustituido { color: var(--ak-color-ink-350, #8a8a8a); }
    .tl__prog { display: flex; align-items: center; gap: .8rem; margin: 0 0 1.5rem; }
    .tl__prog-bar { flex: 1; height: 8px; border-radius: 999px; background: var(--ak-color-cream-300, #e4e0d7); overflow: hidden; }
    .tl__prog-bar span { display: block; height: 100%; background: var(--ak-color-state-success, #0f7b4f); }
    .tl__prog-num { font-size: 13px; font-weight: 600; color: var(--ak-color-ink-500, #454545); white-space: nowrap; }
    .tl__nota { font-size: 13px; color: var(--ak-color-ink-400, #6b6b6b); margin: 0 0 1.5rem; }
    .pasos { list-style: none; margin: 0; padding: 0; }
    .paso { position: relative; display: flex; gap: .9rem; padding-bottom: 1.35rem; }
    .paso:not(:last-child)::before { content: ""; position: absolute; left: 6px; top: 16px; bottom: 0; width: 2px; background: var(--ak-color-cream-300, #e4e0d7); }
    .paso__punto { flex: none; width: 14px; height: 14px; margin-top: 3px; border-radius: 50%; background: var(--ak-color-cream-400, #cfc8ba); box-shadow: 0 0 0 3px #fff; position: relative; z-index: 1; }
    .paso--completado .paso__punto, .tl__f0.f0--completado .paso__punto { background: var(--ak-color-state-success, #0f7b4f); }
    .paso--proceso .paso__punto, .tl__f0.f0--proceso .paso__punto { background: #d98a00; }
    .tl__f0.f0--rechazada .paso__punto { background: var(--ak-color-state-danger, #b8170d); }
    .paso__cuerpo { flex: 1; min-width: 0; }
    .paso__top { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem; }
    .paso__top strong { font-size: 15px; }
    .paso__meta { display: block; font-size: 13px; color: var(--ak-color-ink-400, #6b6b6b); margin-top: .15rem; }
    .paso__chip { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .03em; padding: .12rem .55rem; border-radius: 999px; background: var(--ak-color-cream-200, #efede8); color: var(--ak-color-ink-500, #454545); }
    .chip--completado { background: #e6f4ec; color: var(--ak-color-state-success, #0f7b4f); }
    .chip--proceso { background: #fdf0dc; color: #8a5a00; }
    .chip--rechazada { background: var(--ak-color-accent-50, #fef3f1); color: var(--ak-color-state-danger, #b8170d); }
    .paso--bloqueada .paso__cuerpo { opacity: .55; }

    @media (max-width: 640px) {
      .doc { margin: 0; padding: 1.75rem 1.25rem; box-shadow: none; }
      .doc-head { flex-direction: column; }
    }

    @media print {
      .barra { display: none !important; }
      /* El PDF es siempre el presupuesto, sin importar la pestaña en pantalla. */
      #tab-seguimiento { display: none !important; }
      #tab-presupuesto { display: block !important; }
      body { background: #fff; }
      .doc { max-width: none; margin: 0; padding: 0; box-shadow: none; }
      .fase, tr, .doc-footer { break-inside: avoid; }
      a[href]:after { content: ""; }
      /* "Alcance del proyecto" siempre arranca en página nueva. */
      .seccion--fases { break-before: page; }
      /* Pie con la URL repetido en cada página impresa. */
      .pie-web {
        display: block; position: fixed; bottom: 6mm; left: 0; right: 0;
        text-align: center; font-size: 10px; letter-spacing: .04em;
        color: var(--ak-color-ink-350, #8a8a8a);
      }
      @page { margin: 16mm 14mm 20mm; }
    }
  </style>
</head>
<body data-firma="${escapar(`${c.estado}|${c.version}|${JSON.stringify(avance)}`)}">
  <div class="barra">
    <nav class="tabs">
      <a class="tab" href="#presupuesto" data-tab="presupuesto">Presupuesto</a>
      <a class="tab" href="#seguimiento" data-tab="seguimiento">Seguimiento</a>
    </nav>
    <button class="btn btn--ghost" onclick="window.print()">Imprimir</button>
    <button class="btn" onclick="window.print()">Descargar PDF</button>
  </div>

  <section id="tab-presupuesto" class="tab-panel">
    <article class="doc">
      <header class="doc-head">
        <img src="/src/img/logos/logo.svg" alt="Alkance" onerror="this.style.display='none'">
        ${fechaFmt ? `<div class="fecha"><strong>Fecha:</strong> ${escapar(fechaFmt)}</div>` : ""}
      </header>

      <h1>${escapar(titulo)}</h1>

      ${renderCliente(clienteInfo, data.cliente)}

      ${data.intro ? `<div class="intro rico">${renderRico(data.intro)}</div>` : ""}

      ${
        fases.length
          ? `<h2 class="seccion seccion--fases">Alcance del proyecto</h2>${fases.map(renderFase).join("")}`
          : ""
      }

      ${
        items.length
          ? `<h2 class="seccion">${escapar(data.tituloTabla || "Consolidado y forma de pago")}</h2>${renderItems(
              items,
              data.moneda
            )}`
          : ""
      }

      ${renderFooter(data.footer)}

      <div class="doc-contacto">${renderContacto(cont)}</div>
    </article>
  </section>

  <section id="tab-seguimiento" class="tab-panel">
    <article class="doc doc--tl">
      <header class="doc-head">
        <img src="/src/img/logos/logo.svg" alt="Alkance" onerror="this.style.display='none'">
      </header>
      <h1>Seguimiento del proyecto</h1>
      <p class="tl__sub">${escapar(titulo)}</p>
      ${renderTimeline({ estado: c.estado, version: c.version, revisiones, fases, avance })}
      <div class="doc-contacto">${renderContacto(cont)}</div>
    </article>
  </section>

  <div class="pie-web">${escapar(cont.sitioWeb)} · ${escapar(cont.email)} · ${escapar(cont.instagram)}</div>

  <script>
    (function () {
      var tabs = ["presupuesto", "seguimiento"];
      function activa() {
        var h = (location.hash || "").replace("#", "");
        return tabs.indexOf(h) >= 0 ? h : "presupuesto";
      }
      function pintar() {
        var a = activa();
        tabs.forEach(function (t) {
          document.getElementById("tab-" + t).classList.toggle("oculto", t !== a);
          var lnk = document.querySelector('.tab[data-tab="' + t + '"]');
          if (lnk) lnk.classList.toggle("activa", t === a);
        });
      }
      window.addEventListener("hashchange", pintar);
      pintar();

      // Auto-refresco: si el estado/avance cambió en el panel, recarga (conserva
      // la pestaña por el hash). Cada 25s y al volver a la pestaña del navegador.
      var firma = document.body.getAttribute("data-firma");
      function chequear() {
        fetch(location.pathname.replace(/\\/$/, "") + "/estado", { cache: "no-store" })
          .then(function (r) { return r.json(); })
          .then(function (d) { if (d && d.ok && d.firma && d.firma !== firma) location.reload(); })
          .catch(function () {});
      }
      setInterval(chequear, 25000);
      document.addEventListener("visibilitychange", function () { if (!document.hidden) chequear(); });
    })();
  </script>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
