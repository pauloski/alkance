/** Respuestas JSON con cabeceras de no-caché, para no servir datos viejos. */
export function json(cuerpo, estado = 200, extra = {}) {
  return new Response(JSON.stringify(cuerpo), {
    status: estado,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...extra,
    },
  });
}

/** Formatea un entero como pesos chilenos: 700000 -> "$700.000". */
export function clp(n) {
  let x = Math.round(Number(n) || 0);
  const neg = x < 0;
  x = Math.abs(x);
  const s = String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return (neg ? "-$" : "$") + s;
}

/** Escapa texto para insertarlo en HTML sin que se interprete como marcado. */
export function escapar(s) {
  return String(s ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
  );
}

/** Firma del estado de ejecución que ve el cliente. Debe construirse IDÉNTICA en
 *  /c/:id (data-firma del body) y en /c/:id/estado (poll), o el portal recargaría
 *  en bucle. Incluye estado, versión, avance y la planificación visible
 *  (fechaInicio + duraciones). Los pagos son internos y NO entran en la firma. */
export function firmaEstado({ estado, version, avance, ejecucion }) {
  const ej = ejecucion && typeof ejecucion === "object" ? ejecucion : {};
  const plan = { fechaInicio: ej.fechaInicio || "", duraciones: ej.duraciones || {} };
  return `${estado}|${version}|${JSON.stringify(avance || {})}|${JSON.stringify(plan)}`;
}

/** Suma los montos de los ítems de una cotización (números, sin decimales). */
export function totalDeItems(data) {
  const items = Array.isArray(data?.items) ? data.items : [];
  return items.reduce((acc, it) => acc + (Math.round(Number(it?.monto) || 0)), 0);
}
