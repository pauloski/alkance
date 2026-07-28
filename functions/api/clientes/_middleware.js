/** Puerta de autenticación para /api/clientes/* */
import { guard } from "../_lib/guard.js";
export const onRequest = guard;
