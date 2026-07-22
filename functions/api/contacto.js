/**
 * POST /api/contacto — recibe el formulario de contacto y lo reenvía por correo.
 *
 * Es una Cloudflare Pages Function: basta con que el archivo exista en
 * functions/ para que Pages lo publique en esa ruta. NO añade un paso de build
 * al repo — Pages lo compila en su lado, igual que ya sirve los estáticos.
 *
 * Variables de entorno (Pages > Settings > Variables and Secrets):
 *   RESEND_API_KEY  secreto. Token de https://resend.com/api-keys
 *   CONTACT_TO      destinatario(s). Acepta VARIOS correos separados por coma,
 *                   p. ej. "karen@gmail.com, paulo@gmail.com" — llega a todos.
 *                   Con un dominio verificado en Resend entrega a cualquier
 *                   dirección; sin dominio propio Resend solo entrega al correo
 *                   con el que se creó la cuenta.
 *   CONTACT_FROM    opcional. Por defecto onboarding@resend.dev, el único
 *                   remitente permitido sin dominio verificado. Cuando alkance.cl
 *                   esté verificado en Resend, poner aquí algo como
 *                   "Alkance <web@alkance.cl>" y mejora la entregabilidad.
 *
 * En local: copiar esas variables a .dev.vars (ya está en .gitignore) y correr
 *   npx wrangler pages dev .
 */

/** Topes de longitud. Cortan el abuso antes de gastar una llamada a Resend. */
const LIMITES = { nombre: 100, email: 254, empresa: 120, mensaje: 4000 };

/** Validación deliberadamente laxa: algo@algo.algo. Un regex estricto de correo
 *  es imposible de acertar y termina rechazando direcciones válidas. Quien se
 *  equivoque en su correo lo notará porque no recibirá respuesta. */
const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const REMITENTE_POR_DEFECTO = "Alkance web <onboarding@resend.dev>";

/** Evita que el contenido del visitante se interprete como HTML en el correo. */
const escapar = (s) =>
  String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
  );

export async function onRequestPost({ request, env }) {
  // Sin JS el navegador manda el <form> nativo y espera una página, no JSON.
  // Con JS, main.js manda JSON y espera JSON. Se responde en el mismo idioma.
  const tipo = request.headers.get("content-type") ?? "";
  const esFormNativo = tipo.includes("form");

  const responder = (estado, cuerpo) =>
    esFormNativo
      ? // 303 y no 302: obliga al navegador a repetir con GET, así recargar la
        // página de destino no reenvía el formulario.
        Response.redirect(
          new URL(
            `/?envio=${cuerpo.ok ? "ok" : "error"}#contacto`,
            request.url
          ).toString(),
          303
        )
      : Response.json(cuerpo, { status: estado });

  let datos;
  try {
    datos = esFormNativo
      ? Object.fromEntries(await request.formData())
      : await request.json();
  } catch {
    return responder(400, { ok: false, error: "No pudimos leer el formulario." });
  }

  const nombre = (datos.nombre ?? "").toString().trim();
  const email = (datos.email ?? "").toString().trim();
  const empresa = (datos.empresa ?? "").toString().trim();
  const mensaje = (datos.mensaje ?? "").toString().trim();

  // Trampa para bots: es un campo invisible para las personas, así que si viene
  // relleno lo hizo un script. Se responde 200 a propósito —un bot que recibe
  // un error reintenta; uno que recibe éxito se va— pero no se envía nada.
  if ((datos.web ?? "").toString().trim() !== "") {
    return responder(200, { ok: true });
  }

  if (!nombre || !email || !mensaje) {
    return responder(400, {
      ok: false,
      error: "Faltan datos: nombre, correo y mensaje son obligatorios.",
    });
  }
  if (!EMAIL_OK.test(email)) {
    return responder(400, { ok: false, error: "Ese correo no parece válido." });
  }
  for (const [campo, tope] of Object.entries(LIMITES)) {
    if ({ nombre, email, empresa, mensaje }[campo].length > tope) {
      return responder(400, {
        ok: false,
        error: `El campo ${campo} supera los ${tope} caracteres.`,
      });
    }
  }

  // CONTACT_TO puede traer varios correos separados por coma. Se parten en un
  // array porque Resend espera una lista de direcciones, no una sola cadena con
  // comas dentro (eso lo rechaza como correo inválido y no llega nada).
  const destinatarios = (env.CONTACT_TO ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!env.RESEND_API_KEY || destinatarios.length === 0) {
    // Configuración ausente: es culpa nuestra, no del visitante. Se registra
    // para verlo en los logs de Pages y se devuelve un mensaje genérico.
    console.error("Faltan RESEND_API_KEY o CONTACT_TO en el entorno.");
    return responder(500, {
      ok: false,
      error: "El formulario no está disponible ahora. Escríbenos a hola@alkance.cl.",
    });
  }

  const texto = [
    `Nombre:  ${nombre}`,
    `Correo:  ${email}`,
    empresa ? `Empresa: ${empresa}` : null,
    "",
    mensaje,
  ]
    .filter((l) => l !== null)
    .join("\n");

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM || REMITENTE_POR_DEFECTO,
        to: destinatarios,
        subject: `Contacto web — ${nombre}`,
        // reply_to con el correo del visitante: así responder desde Gmail le
        // llega a él y no a onboarding@resend.dev. Es lo que hace usable el
        // formulario mientras no haya dominio propio.
        reply_to: email,
        text: texto,
        html: `<p><strong>Nombre:</strong> ${escapar(nombre)}<br>
<strong>Correo:</strong> ${escapar(email)}${
          empresa ? `<br><strong>Empresa:</strong> ${escapar(empresa)}` : ""
        }</p>
<p style="white-space:pre-wrap">${escapar(mensaje)}</p>`,
      }),
    });

    if (!r.ok) {
      // El detalle de Resend va al log, no al visitante: puede contener el
      // motivo de rechazo de la cuenta y no le sirve a quien escribe.
      console.error("Resend respondió", r.status, await r.text());
      return responder(502, {
        ok: false,
        error: "No pudimos enviar el mensaje. Escríbenos a hola@alkance.cl.",
      });
    }
  } catch (e) {
    console.error("Fallo al llamar a Resend:", e);
    return responder(502, {
      ok: false,
      error: "No pudimos enviar el mensaje. Escríbenos a hola@alkance.cl.",
    });
  }

  return responder(200, { ok: true });
}

/* Sin esto, un GET a /api/contacto no lo maneja nadie y Pages termina sirviendo
   index.html en esa ruta: confuso al depurar y engañoso para cualquiera que la
   abra. onRequestPost tiene prioridad sobre onRequest, así que este bloque solo
   alcanza a los métodos que no son POST. */
export function onRequest() {
  return new Response("Este endpoint solo acepta POST.", {
    status: 405,
    headers: { Allow: "POST", "Content-Type": "text/plain; charset=utf-8" },
  });
}
