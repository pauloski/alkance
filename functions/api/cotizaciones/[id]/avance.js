/**
 * POST /api/cotizaciones/:id/avance — actualiza el avance de ejecución (Gantt)
 * de una fase, o del proyecto completo. NO sube versión ni crea revisión: solo
 * escribe la columna `avance`, aislada del documento versionado del presupuesto.
 *
 * Body (una de las dos formas):
 *   { faseKey: "f_ab12cd34", estado: "pendiente"|"proceso"|"completado" }
 *   { avance: { "f_ab12cd34": "completado", "idx:1": "proceso", ... } }
 *
 * Las claves son el `id` estable de cada fase; para fases antiguas sin id se usa
 * "idx:<n>" (índice). Protegido por el _middleware.js de /api/cotizaciones.
 */
import { json } from "../../_lib/http.js";

const AVANCES = new Set(["pendiente", "proceso", "completado"]);

export async function onRequestPost({ params, request, env }) {
  const fila = await env.DB.prepare(`SELECT avance FROM cotizaciones WHERE id = ?`)
    .bind(params.id).first();
  if (!fila) return json({ ok: false, error: "Cotización no encontrada." }, 404);

  let body;
  try { body = await request.json(); } catch { return json({ ok: false, error: "Solicitud inválida." }, 400); }

  let mapa = {};
  try { mapa = JSON.parse(fila.avance || "{}"); } catch { mapa = {}; }
  if (typeof mapa !== "object" || mapa === null) mapa = {};

  if (body && typeof body.avance === "object" && body.avance !== null) {
    // Reemplazo completo (validado).
    const nuevo = {};
    for (const [k, v] of Object.entries(body.avance)) {
      if (AVANCES.has(v)) nuevo[k] = v;
    }
    mapa = nuevo;
  } else {
    const faseKey = (body?.faseKey ?? "").toString();
    const estado = (body?.estado ?? "").toString();
    if (!faseKey || !AVANCES.has(estado)) {
      return json({ ok: false, error: "Falta faseKey o el estado de avance es inválido." }, 400);
    }
    mapa[faseKey] = estado;
  }

  await env.DB.prepare(`UPDATE cotizaciones SET avance = ?, updated_at = ? WHERE id = ?`)
    .bind(JSON.stringify(mapa), new Date().toISOString(), params.id)
    .run();

  return json({ ok: true, avance: mapa });
}
