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
import { clp, escapar, totalDeItems } from "../api/_lib/http.js";

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
      ${f?.descripcion ? `<p class="fase__desc">${escapar(f.descripcion)}</p>` : ""}
      ${puntos ? `<ul class="fase__puntos">${puntos}</ul>` : ""}
      ${
        f?.entregable
          ? `<p class="fase__entregable"><strong>Entregable:</strong> ${escapar(
              f.entregable
            )}</p>`
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

function renderCliente(data) {
  const ci = data?.clienteInfo || {};
  const nombre = ci.nombre || data?.cliente || "";
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
      ${footer.notas ? `<p class="notas">${escapar(footer.notas)}</p>` : ""}
    </footer>`;
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
    `SELECT id, version, updated_at, data FROM cotizaciones WHERE id = ?`
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

  const items = Array.isArray(data.items) ? data.items : [];
  const fases = Array.isArray(data.fases) ? data.fases : [];
  const titulo = data.titulo || "Propuesta";
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
    h2.seccion { font-size: 18px; margin: 2rem 0 1rem; }
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

    @media (max-width: 640px) {
      .doc { margin: 0; padding: 1.75rem 1.25rem; box-shadow: none; }
      .doc-head { flex-direction: column; }
    }

    @media print {
      .barra { display: none !important; }
      body { background: #fff; }
      .doc { max-width: none; margin: 0; padding: 0; box-shadow: none; }
      .fase, tr, .doc-footer { break-inside: avoid; }
      a[href]:after { content: ""; }
      @page { margin: 16mm 14mm; }
    }
  </style>
</head>
<body>
  <div class="barra">
    <span>Versión ${escapar(c.version)}</span>
    <button class="btn btn--ghost" onclick="window.print()">Imprimir</button>
    <button class="btn" onclick="window.print()">Descargar PDF</button>
  </div>

  <article class="doc">
    <header class="doc-head">
      <img src="/src/img/logos/logo.svg" alt="Alkance" onerror="this.style.display='none'">
      ${fechaFmt ? `<div class="fecha"><strong>Fecha:</strong> ${escapar(fechaFmt)}</div>` : ""}
    </header>

    <h1>${escapar(titulo)}</h1>

    ${renderCliente(data)}

    ${data.intro ? `<div class="intro">${parrafos(data.intro)}</div>` : ""}

    ${
      fases.length
        ? `<h2 class="seccion">Alcance del proyecto</h2>${fases.map(renderFase).join("")}`
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

    <p class="sello">Cotización ${escapar(c.id)} · versión ${escapar(c.version)}</p>
  </article>
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
