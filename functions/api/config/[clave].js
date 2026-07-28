/**
 * /api/config/:clave
 *   GET — devuelve el valor JSON guardado (o null si no existe).
 *   PUT — guarda { valor } (objeto JSON) bajo esa clave.
 * Hoy se usa la clave "emisor" (datos de transferencia por defecto).
 * Protegido por _middleware.js.
 */
import { json } from "../_lib/http.js";

export async function onRequestGet({ params, env }) {
  const fila = await env.DB.prepare(`SELECT valor FROM config WHERE clave = ?`)
    .bind(params.clave)
    .first();
  let valor = null;
  if (fila) {
    try { valor = JSON.parse(fila.valor); } catch { valor = null; }
  }
  return json({ ok: true, clave: params.clave, valor });
}

export async function onRequestPut({ params, request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Solicitud inválida." }, 400);
  }
  const valor = JSON.stringify(body?.valor ?? {});
  const ahora = new Date().toISOString();
  await env.DB.prepare(
    `INSERT INTO config (clave, valor, updated_at) VALUES (?, ?, ?)
     ON CONFLICT(clave) DO UPDATE SET valor = excluded.valor, updated_at = excluded.updated_at`
  )
    .bind(params.clave, valor, ahora)
    .run();
  return json({ ok: true, clave: params.clave });
}
