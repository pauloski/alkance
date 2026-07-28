/**
 * /api/cotizaciones/:id
 *   GET               — devuelve la cotización completa + lista de revisiones.
 *   GET  ?rev=N       — devuelve el snapshot de la versión N (para el histórico).
 *   PUT               — guarda cambios. Sube la versión y archiva un snapshot de
 *                       la versión anterior en `revisiones`.
 *   DELETE            — elimina la cotización (y sus revisiones, por CASCADE).
 *
 * Protegido por _middleware.js. Usa el binding D1 `DB`.
 */
import { json, totalDeItems } from "../../_lib/http.js";

async function traer(env, id) {
  return env.DB.prepare(`SELECT * FROM cotizaciones WHERE id = ?`).bind(id).first();
}

export async function onRequestGet({ params, env, request }) {
  const id = params.id;
  const url = new URL(request.url);
  const rev = url.searchParams.get("rev");

  if (rev) {
    const fila = await env.DB.prepare(
      `SELECT version, total, data, created_at
         FROM revisiones WHERE cotizacion_id = ? AND version = ?`
    )
      .bind(id, Number(rev))
      .first();
    if (!fila) return json({ ok: false, error: "Versión no encontrada." }, 404);
    return json({
      ok: true,
      revision: { ...fila, data: JSON.parse(fila.data) },
    });
  }

  const c = await traer(env, id);
  if (!c) return json({ ok: false, error: "Cotización no encontrada." }, 404);

  const { results: revisiones } = await env.DB.prepare(
    `SELECT version, total, created_at
       FROM revisiones WHERE cotizacion_id = ? ORDER BY version DESC`
  )
    .bind(id)
    .all();

  let avance = {};
  try { avance = JSON.parse(c.avance || "{}"); } catch { avance = {}; }

  return json({
    ok: true,
    cotizacion: { ...c, data: JSON.parse(c.data), avance },
    revisiones: revisiones ?? [],
  });
}

export async function onRequestPut({ params, request, env }) {
  const id = params.id;
  const actual = await traer(env, id);
  if (!actual) return json({ ok: false, error: "Cotización no encontrada." }, 404);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Solicitud inválida." }, 400);
  }

  const data = body?.data ?? {};
  const ahora = new Date().toISOString();
  const total = totalDeItems(data);

  // Versionado por estado, para no ensuciar con cada guardado de borrador:
  //  - borrador / rechazada  → se sobrescribe EN SITIO: no sube versión ni crea
  //    revisión. Todos los guardados de trabajo quedan en la misma versión.
  //  - enviada / aprobada (el cliente ya lo vio) → editar genera una versión
  //    nueva: se archiva la anterior (Sustituida) y vuelve a "En evaluación".
  // Solo se versiona lo que el cliente llega a ver.
  const clienteFacing = actual.estado === "aprobada" || actual.estado === "enviada";
  const versionar = body?.estado === undefined && clienteFacing;

  let estado = (body?.estado ?? actual.estado ?? "borrador").toString();
  let nuevaVersion = actual.version;

  if (versionar) {
    // Archiva la versión que el cliente tenía antes de generar la nueva.
    await env.DB.prepare(
      `INSERT INTO revisiones (cotizacion_id, version, total, data, created_at)
       VALUES (?, ?, ?, ?, ?)`
    )
      .bind(id, actual.version, actual.total, actual.data, ahora)
      .run();
    nuevaVersion = actual.version + 1;
    estado = "enviada"; // nueva versión = vuelve a evaluación del cliente
  }

  await env.DB.prepare(
    `UPDATE cotizaciones
        SET titulo = ?, cliente = ?, fecha = ?, estado = ?, version = ?,
            total = ?, data = ?, updated_at = ?
      WHERE id = ?`
  )
    .bind(
      (data.titulo ?? "").toString(),
      (data.cliente ?? "").toString(),
      (data.fecha ?? "").toString(),
      estado,
      nuevaVersion,
      total,
      JSON.stringify(data),
      ahora,
      id
    )
    .run();

  return json({ ok: true, id, version: nuevaVersion, total });
}

export async function onRequestDelete({ params, env }) {
  const id = params.id;
  const r = await env.DB.prepare(`DELETE FROM cotizaciones WHERE id = ?`).bind(id).run();
  // Por si la base no tiene las FK activas, limpia las revisiones a mano.
  await env.DB.prepare(`DELETE FROM revisiones WHERE cotizacion_id = ?`).bind(id).run();
  return json({ ok: true, borradas: r.meta?.changes ?? 0 });
}
