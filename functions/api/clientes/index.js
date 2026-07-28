/**
 * /api/clientes
 *   GET  — lista los clientes.
 *   POST — crea un cliente a partir de { cliente } y devuelve su id.
 * Protegido por _middleware.js.
 */
import { json } from "../_lib/http.js";

function nuevoId() {
  const abc = "abcdefghijkmnpqrstuvwxyz23456789";
  const buf = crypto.getRandomValues(new Uint8Array(8));
  return "cl_" + [...buf].map((b) => abc[b % abc.length]).join("");
}

const CAMPOS = ["nombre", "empresa", "rut", "email", "telefono", "direccion", "notas"];

export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare(
    `SELECT * FROM clientes ORDER BY nombre COLLATE NOCASE ASC`
  ).all();
  return json({ ok: true, clientes: results ?? [] });
}

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Solicitud inválida." }, 400);
  }
  const c = body?.cliente ?? {};
  if (!(c.nombre ?? "").toString().trim() && !(c.empresa ?? "").toString().trim()) {
    return json({ ok: false, error: "Indica al menos nombre o empresa." }, 400);
  }
  const ahora = new Date().toISOString();
  const id = nuevoId();
  const vals = CAMPOS.map((k) => (c[k] ?? "").toString().trim());
  await env.DB.prepare(
    `INSERT INTO clientes (id, nombre, empresa, rut, email, telefono, direccion, notas, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(id, ...vals, ahora, ahora)
    .run();
  return json({ ok: true, id }, 201);
}
