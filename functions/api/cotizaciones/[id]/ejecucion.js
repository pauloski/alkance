/**
 * POST /api/cotizaciones/:id/ejecucion — actualiza la planificación interna del
 * proyecto (fecha de inicio, duración en días por fase y estructura de pagos).
 * NO sube versión ni crea revisión: solo escribe la columna `ejecucion`, aislada
 * del documento versionado del presupuesto. Es dato de gestión interna.
 *
 * Body: merge parcial de cualquiera de estas claves (las que vengan se reemplazan):
 *   { fechaInicio: "2026-08-15" }                      // "" para limpiar
 *   { duraciones: { "f_ab12cd34": 7, "idx:1": 10 } }   // días por fase (reemplazo total)
 *   { pagos: [ { id, concepto, monto, estado, fecha } ] }  // hitos (reemplazo total)
 *
 * Las claves de `duraciones` son el `faseKey` estable (id de fase o "idx:<n>"),
 * el mismo que usa `avance`. Protegido por el _middleware.js de /api/cotizaciones.
 */
import { json } from "../../_lib/http.js";

const ESTADOS_PAGO = new Set(["pendiente", "pagado"]);

/** Normaliza la lista de pagos a una forma segura y consistente. */
function sanearPagos(lista) {
  if (!Array.isArray(lista)) return [];
  return lista.map((p, i) => ({
    id: (p?.id ?? "").toString() || "p" + (i + 1),
    concepto: (p?.concepto ?? "").toString().slice(0, 200),
    monto: Math.round(Number(p?.monto) || 0),
    estado: ESTADOS_PAGO.has(p?.estado) ? p.estado : "pendiente",
    fecha: (p?.fecha ?? "").toString(),
  }));
}

/** Normaliza el mapa de duraciones: faseKey -> entero de días (>= 0). */
function sanearDuraciones(mapa) {
  const out = {};
  if (mapa && typeof mapa === "object") {
    for (const [k, v] of Object.entries(mapa)) {
      const dias = Math.round(Number(v) || 0);
      if (dias > 0) out[k.toString()] = dias;
    }
  }
  return out;
}

export async function onRequestPost({ params, request, env }) {
  const fila = await env.DB.prepare(`SELECT ejecucion FROM cotizaciones WHERE id = ?`)
    .bind(params.id).first();
  if (!fila) return json({ ok: false, error: "Cotización no encontrada." }, 404);

  let body;
  try { body = await request.json(); } catch { return json({ ok: false, error: "Solicitud inválida." }, 400); }

  let ej = {};
  try { ej = JSON.parse(fila.ejecucion || "{}"); } catch { ej = {}; }
  if (typeof ej !== "object" || ej === null) ej = {};

  if (Object.prototype.hasOwnProperty.call(body, "fechaInicio")) {
    ej.fechaInicio = (body.fechaInicio ?? "").toString();
  }
  if (Object.prototype.hasOwnProperty.call(body, "duraciones")) {
    ej.duraciones = sanearDuraciones(body.duraciones);
  }
  if (Object.prototype.hasOwnProperty.call(body, "pagos")) {
    ej.pagos = sanearPagos(body.pagos);
  }

  await env.DB.prepare(`UPDATE cotizaciones SET ejecucion = ?, updated_at = ? WHERE id = ?`)
    .bind(JSON.stringify(ej), new Date().toISOString(), params.id)
    .run();

  return json({ ok: true, ejecucion: ej });
}
