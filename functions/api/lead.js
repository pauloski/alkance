/**
 * POST /api/lead — recibe el formulario de una landing y lo reenvía por correo.
 * Reutiliza la config de Resend del formulario de contacto; agrega el plan
 * elegido y los parámetros de marcaje/UTM de la URL para atribución.
 *
 * Variables de entorno (Pages > Settings > Variables and Secrets):
 *   RESEND_API_KEY   secreto (obligatorio).
 *   CONTACT_FROM     remitente (opcional; por defecto onboarding@resend.dev).
 *   LEADS_TO         destinatario(s) coma-separados. Si falta, usa CONTACT_TO.
 */

const LIMITES = { nombre: 100, email: 254, empresa: 120, telefono: 40, mensaje: 4000, plan: 120 };
const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const REMITENTE_POR_DEFECTO = "Alkance web <onboarding@resend.dev>";

const escapar = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const json = (cuerpo, estado = 200) =>
  new Response(JSON.stringify(cuerpo), {
    status: estado,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });

export async function onRequestPost({ request, env }) {
  let datos;
  try {
    datos = await request.json();
  } catch {
    return json({ ok: false, error: "No pudimos leer el formulario." }, 400);
  }

  // Honeypot: campo invisible relleno = bot. Responde 200 pero no envía.
  if ((datos.web ?? "").toString().trim() !== "") return json({ ok: true });

  const nombre = (datos.nombre ?? "").toString().trim();
  const email = (datos.email ?? "").toString().trim();
  const empresa = (datos.empresa ?? "").toString().trim();
  const telefono = (datos.telefono ?? "").toString().trim();
  const mensaje = (datos.mensaje ?? "").toString().trim();
  const plan = (datos.plan ?? "").toString().trim();
  const marcaje = datos.marcaje && typeof datos.marcaje === "object" ? datos.marcaje : {};

  if (!nombre || !email) return json({ ok: false, error: "Faltan datos: nombre y correo." }, 400);
  if (!EMAIL_OK.test(email)) return json({ ok: false, error: "Ese correo no parece válido." }, 400);
  for (const [campo, tope] of Object.entries(LIMITES)) {
    if ({ nombre, email, empresa, telefono, mensaje, plan }[campo]?.length > tope) {
      return json({ ok: false, error: `El campo ${campo} supera los ${tope} caracteres.` }, 400);
    }
  }

  const destinatarios = (env.LEADS_TO ?? env.CONTACT_TO ?? "")
    .split(",").map((s) => s.trim()).filter(Boolean);

  if (!env.RESEND_API_KEY || destinatarios.length === 0) {
    console.error("Faltan RESEND_API_KEY o LEADS_TO/CONTACT_TO en el entorno.");
    return json({ ok: false, error: "El formulario no está disponible ahora. Escríbenos a contacto@alkancedigital.cl." }, 500);
  }

  // Marcaje/UTM: solo claves conocidas, saneadas.
  const CLAVES = ["landing", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid", "ref", "marcaje", "referrer", "url"];
  const marcajeLimpio = CLAVES
    .filter((k) => marcaje[k])
    .map((k) => [k, String(marcaje[k]).slice(0, 300)]);

  const filasMarcaje = marcajeLimpio.map(([k, v]) => `${k}: ${v}`).join("\n");
  const filasMarcajeHtml = marcajeLimpio
    .map(([k, v]) => `<tr><td style="color:#6b6b6b;padding:2px 10px 2px 0">${escapar(k)}</td><td>${escapar(v)}</td></tr>`)
    .join("");

  const texto = [
    `Nuevo lead — Landing`,
    plan ? `Plan:    ${plan}` : null,
    `Nombre:  ${nombre}`,
    `Correo:  ${email}`,
    telefono ? `Teléfono: ${telefono}` : null,
    empresa ? `Empresa: ${empresa}` : null,
    "",
    mensaje || "(sin mensaje)",
    "",
    "— Marcaje —",
    filasMarcaje || "(sin parámetros)",
  ].filter((l) => l !== null).join("\n");

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#0a0a0a;font-size:15px;line-height:1.6">
      <p style="margin:0 0 4px"><strong>Nuevo lead desde la landing</strong></p>
      ${plan ? `<p style="margin:0 0 12px"><span style="background:#FFF3E6;color:#C24E00;font-weight:600;padding:3px 10px;border-radius:999px">${escapar(plan)}</span></p>` : ""}
      <p style="margin:0">
        <strong>Nombre:</strong> ${escapar(nombre)}<br>
        <strong>Correo:</strong> ${escapar(email)}${telefono ? `<br><strong>Teléfono:</strong> ${escapar(telefono)}` : ""}${empresa ? `<br><strong>Empresa:</strong> ${escapar(empresa)}` : ""}
      </p>
      <p style="white-space:pre-wrap;margin:14px 0">${escapar(mensaje) || "<em>(sin mensaje)</em>"}</p>
      ${filasMarcajeHtml ? `<hr style="border:none;border-top:1px solid #e4e0d7;margin:16px 0"><p style="font-size:13px;color:#6b6b6b;margin:0 0 6px">Marcaje / atribución</p><table style="font-size:13px">${filasMarcajeHtml}</table>` : ""}
    </div>`;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: env.CONTACT_FROM || REMITENTE_POR_DEFECTO,
        to: destinatarios,
        reply_to: email,
        subject: `Lead landing e-commerce — ${nombre}${plan ? ` · ${plan}` : ""}`,
        text: texto,
        html,
      }),
    });
    if (!r.ok) {
      console.error("Resend respondió", r.status, await r.text());
      return json({ ok: false, error: "No pudimos enviar el mensaje. Escríbenos a contacto@alkancedigital.cl." }, 502);
    }
  } catch (e) {
    console.error("Fallo al llamar a Resend:", e);
    return json({ ok: false, error: "No pudimos enviar el mensaje." }, 502);
  }

  return json({ ok: true });
}

export function onRequest() {
  return new Response("Este endpoint solo acepta POST.", {
    status: 405,
    headers: { Allow: "POST", "Content-Type": "text/plain; charset=utf-8" },
  });
}
