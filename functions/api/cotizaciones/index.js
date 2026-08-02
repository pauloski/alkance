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

/** Clave estable de una fase, igual que en el panel y en /c/:id. */
const faseKey = (f, i) => (f && f.id) || "idx:" + i;

export async function onRequestGet({ env, request }) {
  const url = new URL(request.url);
  const tablero = url.searchParams.get("tablero");

  // Modo tablero: incluye avance, planificación (ejecucion) y un resumen de las
  // fases, para pintar el kanban interno sin abrir cada cotización una por una.
  if (tablero) {
    const { results } = await env.DB.prepare(
      `SELECT id, titulo, cliente, fecha, estado, version, total, updated_at, data, avance, ejecucion
         FROM cotizaciones
         ORDER BY updated_at DESC`
    ).all();
    const cotizaciones = (results ?? []).map((c) => {
      let data = {}, avance = {}, ejecucion = {};
      try { data = JSON.parse(c.data || "{}"); } catch { data = {}; }
      try { avance = JSON.parse(c.avance || "{}"); } catch { avance = {}; }
      try { ejecucion = JSON.parse(c.ejecucion || "{}"); } catch { ejecucion = {}; }
      const fases = (Array.isArray(data.fases) ? data.fases : []).map((f, i) => ({
        key: faseKey(f, i),
        titulo: (f?.titulo ?? "").toString(),
        dedicacion: (f?.dedicacion ?? "").toString(),
        estimado: f?.estimado && typeof f.estimado === "object" ? f.estimado : null,
        valor: Math.round(Number(f?.valor) || 0),
      }));
      const { data: _omit, ...meta } = c;
      return { ...meta, fases, avance, ejecucion };
    });
    return json({ ok: true, cotizaciones });
  }

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
