/**
 * POST /api/login — recibe { password } y, si coincide con PANEL_PASSWORD,
 * entrega una cookie de sesión firmada. GET /api/login informa si hay sesión.
 *
 * Variables de entorno (Pages > Settings > Variables and Secrets):
 *   PANEL_PASSWORD  secreto. Contraseña única del panel de cotizaciones.
 */
import { crearToken, tokenValido, leerCookie, NOMBRE_COOKIE } from "./_lib/session.js";
import { json } from "./_lib/http.js";

function cookieSesion(token, maxAge) {
  const partes = [
    `${NOMBRE_COOKIE}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
  ];
  return partes.join("; ");
}

export async function onRequestGet({ request, env }) {
  const secreto = env.PANEL_PASSWORD;
  const token = leerCookie(request, NOMBRE_COOKIE);
  const auth = await tokenValido(secreto, token);
  return json({ ok: true, auth, configurado: Boolean(secreto) });
}

export async function onRequestPost({ request, env }) {
  const secreto = env.PANEL_PASSWORD;
  if (!secreto) {
    console.error("Falta PANEL_PASSWORD en el entorno.");
    return json({ ok: false, error: "El panel no está configurado." }, 500);
  }

  let datos;
  try {
    datos = await request.json();
  } catch {
    return json({ ok: false, error: "Solicitud inválida." }, 400);
  }

  const password = (datos?.password ?? "").toString();
  if (password !== secreto) {
    return json({ ok: false, error: "Contraseña incorrecta." }, 401);
  }

  const ttl = 60 * 60 * 12; // 12 horas
  const token = await crearToken(secreto, ttl);
  return json({ ok: true }, 200, { "Set-Cookie": cookieSesion(token, ttl) });
}
