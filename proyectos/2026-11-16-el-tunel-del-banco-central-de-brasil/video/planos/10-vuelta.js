// «...que le pueda interesar.»
// Vuelta al principio: de la boca del túnel, la cámara sale volando por dentro del túnel, como en el primer
// fotograma del video (así, al repetirse, no se nota el salto).
import { v } from "#voz";
import { dibuja as hook } from "./01-hook.js";

const T0 = v.frase(12).inicio + 1.3;
export const desde = () => T0;
export const entrada = "fundido";

export function dibuja(g, t) {
  hook(g, Math.max(0, (t - T0) * 0.6));
}
