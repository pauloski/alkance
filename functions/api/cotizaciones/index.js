/**
 * /api/cotizaciones
 *   GET  — lista las cotizaciones (sin el JSON completo, para el panel).
 *   POST — crea una cotización nueva a partir de { data } y devuelve su id.
 *
 * Protegido por _middleware.js (requiere sesión). Usa el binding D1 `DB`.
 */
import { json, totalDeItems } from "../_lib/http.js";

/** Slug corto y legible para la URL pública. Evita caracteres ambiguos. */
function nuevoId() {
  const abc = "abcdefghijkmnpqrstuvwxyz23456789";
  const buf = crypto.getRandomValues(new Uint8Array(8));
  return [...buf].map((b) => abc[b % abc.length]).join("");
}

export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare(
    `SELECT id, titulo, cliente, fecha, estado, version, total, updated_at
       FROM cotizaciones
       ORDER BY updated_at DESC`
  ).all();
  return json({ ok: true, cotizaciones: results ?? [] });
}

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Solicitud inválida." }, 400);
  }

  const data = body?.data ?? {};
  const ahora = new Date().toISOString();
  const id = nuevoId();
  const total = totalDeItems(data);

  await env.DB.prepare(
    `INSERT INTO cotizaciones
       (id, titulo, cliente, fecha, estado, version, total, data, created_at, updated_at)
     VALUES (?, ?, ?, ?, 'borrador', 1, ?, ?, ?, ?)`
  )
    .bind(
      id,
      (data.titulo ?? "").toString(),
      (data.cliente ?? "").toString(),
      (data.fecha ?? "").toString(),
      total,
      JSON.stringify(data),
      ahora,
      ahora
    )
    .run();

  return json({ ok: true, id, version: 1 }, 201);
}
