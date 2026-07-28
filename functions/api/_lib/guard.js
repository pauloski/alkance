/** Guard de sesión compartido: exige cookie válida y el binding D1 `DB`.
 *  Cada carpeta protegida lo re-exporta desde su _middleware.js. */
import { tokenValido, leerCookie, NOMBRE_COOKIE } from "./session.js";
import { json } from "./http.js";

export async function guard(context) {
  const { request, env, next } = context;
  const secreto = env.PANEL_PASSWORD;
  if (!secreto) return json({ ok: false, error: "El panel no está configurado." }, 500);
  if (!env.DB) return json({ ok: false, error: "Falta el binding D1 'DB'." }, 500);
  const token = leerCookie(request, NOMBRE_COOKIE);
  if (!(await tokenValido(secreto, token))) {
    return json({ ok: false, error: "No autorizado." }, 401);
  }
  return next();
}
