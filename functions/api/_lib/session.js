/**
 * Sesión mínima para el panel de cotizaciones. No es "ultra segura" a propósito:
 * una sola contraseña compartida (env PANEL_PASSWORD) protege el panel. El login
 * entrega una cookie firmada con HMAC-SHA256 usando la propia contraseña como
 * llave, así no hace falta un segundo secreto. Cambiar la contraseña invalida
 * todas las sesiones vivas, que es justo lo que se quiere.
 */

const encoder = new TextEncoder();

async function hmacHex(llave, dato) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(llave),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const firma = await crypto.subtle.sign("HMAC", key, encoder.encode(dato));
  return [...new Uint8Array(firma)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Token = "exp.firma", donde firma = HMAC(secreto, exp). */
export async function crearToken(secreto, ttlSegundos = 60 * 60 * 12) {
  const exp = Math.floor(Date.now() / 1000) + ttlSegundos;
  const firma = await hmacHex(secreto, String(exp));
  return `${exp}.${firma}`;
}

export async function tokenValido(secreto, token) {
  if (!secreto || !token || !token.includes(".")) return false;
  const [expStr, firma] = token.split(".");
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return false;
  const esperado = await hmacHex(secreto, expStr);
  return igualdadConstante(firma, esperado);
}

/** Comparación en tiempo constante: no filtra por dónde difieren las firmas. */
function igualdadConstante(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) {
    return false;
  }
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export function leerCookie(request, nombre) {
  const cookie = request.headers.get("Cookie") || "";
  const m = cookie.match(new RegExp(`(?:^|; )${nombre}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : null;
}

export const NOMBRE_COOKIE = "panel_session";
