/** Puerta de autenticación para /api/config/* */
import { guard } from "../_lib/guard.js";
export const onRequest = guard;
