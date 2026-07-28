/**
 * /api/clientes/:id
 *   GET    — devuelve un cliente.
 *   PUT    — actualiza sus datos.
 *   DELETE — lo elimina de la agenda (no toca las cotizaciones ya emitidas,
 *            que guardan su propia copia de los datos del cliente).
 * Protegido por _middleware.js.
 */
import { json } from "../_lib/http.js";

const CAMPOS = ["nombre", "empresa", "rut", "email", "telefono", "direccion", "notas"];

export async function onRequestGet({ params, env }) {
  const c = await env.DB.prepare(`SELECT * FROM clientes WHERE id = ?`).bind(params.id).first();
  if (!c) return json({ ok: false, error: "Cliente no encontrado." }, 404);
  return json({ ok: true, cliente: c });
}

export async function onRequestPut({ params, request, env }) {
  const existe = await env.DB.prepare(`SELECT id FROM clientes WHERE id = ?`).bind(params.id).first();
  if (!existe) return json({ ok: false, error: "Cliente no encontrado." }, 404);
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Solicitud inválida." }, 400);
  }
  const c = body?.cliente ?? {};
  const ahora = new Date().toISOString();
  const vals = CAMPOS.map((k) => (c[k] ?? "").toString().trim());
  await env.DB.prepare(
    `UPDATE clientes SET nombre=?, empresa=?, rut=?, email=?, telefono=?, direccion=?, notas=?, updated_at=?
     WHERE id = ?`
  )
    .bind(...vals, ahora, params.id)
    .run();
  return json({ ok: true, id: params.id });
}

export async function onRequestDelete({ params, env }) {
  const r = await env.DB.prepare(`DELETE FROM clientes WHERE id = ?`).bind(params.id).run();
  return json({ ok: true, borrados: r.meta?.changes ?? 0 });
}
