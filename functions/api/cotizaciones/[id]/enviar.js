/**
 * POST /api/cotizaciones/:id/enviar — envía la cotización al cliente por correo
 * (con respaldo a la empresa) y marca la cotización como "enviada".
 *
 * Body opcional: { to?: string, mensaje?: string }
 *   to      destinatario. Si falta, usa el email del cliente guardado.
 *   mensaje texto breve que se antepone al correo.
 *
 * Reutiliza la config de Resend del formulario de contacto:
 *   RESEND_API_KEY  secreto (obligatorio)
 *   CONTACT_FROM    remitente (opcional; por defecto onboarding@resend.dev)
 *   COTIZACIONES_BCC o CONTACT_TO  respaldo(s) a la empresa (coma-separado)
 *
 * Protegido por el _middleware.js de /api/cotizaciones.
 */
import { json, clp, escapar, totalDeItems } from "../../_lib/http.js";

const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const REMITENTE_POR_DEFECTO = "Alkance <onboarding@resend.dev>";

export async function onRequestPost({ params, request, env }) {
  const id = params.id;
  const c = await env.DB.prepare(
    `SELECT id, version, data FROM cotizaciones WHERE id = ?`
  ).bind(id).first();
  if (!c) return json({ ok: false, error: "Cotización no encontrada." }, 404);

  let data;
  try { data = JSON.parse(c.data); } catch { data = {}; }

  let body = {};
  try { body = await request.json(); } catch {}

  const to = ((body.to ?? data.clienteInfo?.email ?? "").toString()).trim();
  const mensaje = (body.mensaje ?? "").toString().trim();

  if (!EMAIL_OK.test(to)) {
    return json({ ok: false, error: "Falta un correo de destino válido para el cliente." }, 400);
  }
  if (!env.RESEND_API_KEY) {
    console.error("Falta RESEND_API_KEY para enviar cotizaciones.");
    return json({ ok: false, error: "El envío por correo no está configurado (RESEND_API_KEY)." }, 500);
  }

  const respaldo = (env.COTIZACIONES_BCC ?? env.CONTACT_TO ?? "")
    .split(",").map((s) => s.trim()).filter(Boolean);

  const origen = new URL(request.url).origin;
  const enlace = `${origen}/c/${id}`;
  const titulo = data.titulo || "Propuesta";
  const total = totalDeItems(data);
  const cliente = data.clienteInfo?.nombre || data.cliente || "";

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#0a0a0a;font-size:15px;line-height:1.6">
      ${cliente ? `<p>Hola ${escapar(cliente)},</p>` : "<p>Hola,</p>"}
      ${mensaje ? `<p style="white-space:pre-wrap">${escapar(mensaje)}</p>` : ""}
      <p>Te compartimos la cotización <strong>${escapar(titulo)}</strong>${
        total ? ` por un total de <strong>${clp(total)}</strong>` : ""
      }.</p>
      <p style="margin:24px 0">
        <a href="${enlace}" style="background:#b8170d;color:#fff;text-decoration:none;padding:12px 22px;border-radius:6px;font-weight:600;display:inline-block">Ver la cotización</a>
      </p>
      <p style="font-size:13px;color:#6b6b6b">O copia este enlace: <br><a href="${enlace}">${enlace}</a></p>
      <p style="font-size:13px;color:#6b6b6b">Desde el enlace puedes descargar el PDF.</p>
      <hr style="border:none;border-top:1px solid #e4e0d7;margin:20px 0">
      <p style="font-size:13px;color:#6b6b6b">Alkance · Estrategia, Branding y Diseño</p>
    </div>`;

  const texto = [
    cliente ? `Hola ${cliente},` : "Hola,",
    mensaje || "",
    `Te compartimos la cotización "${titulo}"${total ? ` por un total de ${clp(total)}` : ""}.`,
    `Ver / descargar PDF: ${enlace}`,
    "",
    "Alkance · Estrategia, Branding y Diseño",
  ].filter((l) => l !== "").join("\n");

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: env.CONTACT_FROM || REMITENTE_POR_DEFECTO,
        to: [to],
        bcc: respaldo.length ? respaldo : undefined,
        subject: `Cotización — ${titulo}`,
        html,
        text: texto,
      }),
    });
    if (!r.ok) {
      console.error("Resend respondió", r.status, await r.text());
      return json({ ok: false, error: "No pudimos enviar el correo. Revisa la configuración de Resend." }, 502);
    }
  } catch (e) {
    console.error("Fallo al enviar cotización:", e);
    return json({ ok: false, error: "No pudimos enviar el correo." }, 502);
  }

  // Marca como enviada (sin subir versión ni crear revisión).
  const ahora = new Date().toISOString();
  data.enviadaEl = ahora;
  data.enviadaA = to;
  await env.DB.prepare(
    `UPDATE cotizaciones SET estado = 'enviada', data = ?, updated_at = ? WHERE id = ?`
  ).bind(JSON.stringify(data), ahora, id).run();

  return json({ ok: true, estado: "enviada", enviadaA: to });
}
