/** Puerta de autenticación para /api/cotizaciones/* */
import { guard } from "../_lib/guard.js";
export const onRequest = guard;
