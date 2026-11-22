// «¿Por qué el cielo es azul, pero al atardecer se pone naranja?»
// Fotograma 0: la cámara vuela a toda velocidad entre nubes enormes, en un cielo azul intenso, con el Sol arriba.
// «azul»: frena; queda el cielo abierto sobre el mar, con las nubes a los lados.
// «atardecer»: el Sol se desploma hacia el horizonte y el cielo arde de amarillo a naranja; «naranja»: el Sol toca el
// mar y todo es naranja. Reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { cieloMar, camCielo } from "../mundo.js";

export const desde = 0;
const f1 = v.frase(1);
const Tazul = f1.t("azul"), Tat = f1.t("atardecer"), Tnar = f1.t("naranja");
export const momentos = { azul: Tazul, atardecer: Tat, naranja: Tnar };

// el vuelo: muy rápido al empezar, frena en «azul» y sigue despacio
const z = (t) => 1100 * (1 - Math.exp(-t * 1.6)) + 30 * t;
const caer = (t) => k.suave(k.tramo(t, Tat - 0.1, Tnar + 0.25));

export function dibuja(g, t) {
  const c = caer(t);
  const incl = k.mez(7, 1.5, c);
  const cam = camCielo(z(t), incl, 0, k.mez(0, 6, c));
  cieloMar(g, t, { cam, u: c, sol: k.mez(17, -0.6, c) });
}
