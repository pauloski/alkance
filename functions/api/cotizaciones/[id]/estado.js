/**
 * POST /api/cotizaciones/:id/estado — cambia el estado de la cotización sin
 * subir versión ni crear revisión. El usuario lo mueve a mano desde el listado.
 * Body: { estado: "borrador" | "enviada" | "aprobada" | "rechazada" }
 * Protegido por el _middleware.js de /api/cotizaciones.
 */
import { json } from "../../_lib/http.js";

const ESTADOS = new Set(["borrador", "enviada", "aprobada", "rechazada"]);

export async function onRequestPost({ params, request, env }) {
  let body;
  try { body = await request.json(); } catch { body = {}; }
  const estado = (body?.estado ?? "").toString();
  if (!ESTADOS.has(estado)) {
    return json({ ok: false, error: "Estado inválido." }, 400);
  }
  const existe = await env.DB.prepare(`SELECT id FROM cotizaciones WHERE id = ?`)
    .bind(params.id).first();
  if (!existe) return json({ ok: false, error: "Cotización no encontrada." }, 404);

  await env.DB.prepare(
    `UPDATE cotizaciones SET estado = ?, updated_at = ? WHERE id = ?`
  ).bind(estado, new Date().toISOString(), params.id).run();

  return json({ ok: true, estado });
}
