/** POST /api/logout — borra la cookie de sesión. */
import { NOMBRE_COOKIE } from "./_lib/session.js";
import { json } from "./_lib/http.js";

export async function onRequestPost() {
  const cookie = `${NOMBRE_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
  return json({ ok: true }, 200, { "Set-Cookie": cookie });
}
