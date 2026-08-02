/**
 * GET /c/:id/estado — JSON público y liviano con el estado de ejecución del
 * proyecto. Lo consulta el portal del cliente cada cierto tiempo para refrescar
 * la línea de tiempo sin recargar toda la página. Solo lectura, sin datos
 * sensibles (no expone montos ni el documento).
 */
import { firmaEstado } from "../../api/_lib/http.js";

export async function onRequestGet({ params, env }) {
  const headers = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" };
  if (!env.DB) return new Response(JSON.stringify({ ok: false }), { status: 404, headers });

  const c = await env.DB.prepare(
    `SELECT version, estado, avance, ejecucion FROM cotizaciones WHERE id = ?`
  ).bind(params.id).first();
  if (!c) return new Response(JSON.stringify({ ok: false }), { status: 404, headers });

  let avance = {};
  try { avance = JSON.parse(c.avance || "{}"); } catch { avance = {}; }
  let ejecucion = {};
  try { ejecucion = JSON.parse(c.ejecucion || "{}"); } catch { ejecucion = {}; }

  // Firma para que el cliente detecte cambios y decida refrescar (misma fórmula
  // que el data-firma del body en /c/:id).
  const firma = firmaEstado({ estado: c.estado, version: c.version, avance, ejecucion });
  return new Response(
    JSON.stringify({ ok: true, estado: c.estado, version: c.version, avance, firma }),
    { headers }
  );
}
