// «Ya mirando al suelo, dobla las patas como resortes para aguantar el golpe.»
// Sigue el cielo: el gato, ya derecho, baja; el pasto sube desde abajo. «dobla»: estira las patas y toca el pasto;
// «resortes»: las patas se doblan como muelles, el cuerpo baja y rebota; «golpe»: un poco de polvo y se queda de pie,
// quieto, antes del corte en «Los».
import * as k from "#kit";
import { v } from "#voz";
import { gato, cielo, pasto, polvo, sombraEnSuelo, veloArriba } from "../mundo.js";
import { CAM, lento } from "./04-imposible.js";

export const desde = "ya";
export const entrada = "sigue";
const { suave: su, tramo: tr, mez, claves } = k;
const f8 = v.frase(8);
const T0 = f8.inicio, Tsue = f8.t("suelo"), Tdob = f8.t("dobla"), Tres = f8.t("resortes"), Tgol = f8.t("golpe");
const Ttoca = Tdob + 0.25;
export const momentos = { toca: Ttoca, rebota: Tres + 0.1, golpe: Tgol };
const c0 = CAM(99);

export function dibuja(g, t) {
  // las nubes siguen subiendo y frenan al tocar el suelo
  const fr = Ttoca - T0, d = Math.min(t - T0, fr);
  const cae = lento(T0) + 260 * d + 1400 * (d * d) / 2 - 1400 * Math.pow(Math.max(0, d - fr * 0.6), 2) * 1.2;
  cielo(g, cae, 0);
  const u = su(tr(t, T0, Ttoca));
  const s = mez(c0.s, 1.15, u), y = mez(c0.y, 980, u), x = mez(c0.x, 500, u);
  const SUELO = 980 + 345;
  const yS = claves([[T0, 2200], [Tsue, 2000], [Ttoca, SUELO]])(Math.min(t, Ttoca));
  pasto(g, yS, t);
  // las patas como muelles: se doblan al tocar, rebotan en «resortes» y se asientan en «golpe»
  const enc = claves([[T0, 0.0], [Ttoca - 0.15, 0.0], [Ttoca + 0.12, 0.6], [Ttoca + 0.4, 0.1], [Tres + 0.05, 0.55], [Tres + 0.3, 0.05], [Tgol, 0.3], [Tgol + 0.3, 0.12], [Tgol + 2, 0.12]])(t);
  const ebInicial = 1 - su(tr(t, T0, T0 + 0.5));
  const bote = claves([[T0, 0], [Ttoca, 0], [Ttoca + 0.12, 70], [Ttoca + 0.4, -10], [Tres + 0.05, 60], [Tres + 0.3, -30], [Tgol, 30], [Tgol + 0.3, 10], [Tgol + 2, 10]])(t);
  if (yS < 1960) sombraEnSuelo(g, 520, yS + 30, 360 * mez(0.5, 1, tr(yS, 2000, SUELO)), su(tr(yS, 1950, SUELO)));
  gato(g, x, y + bote * s, s, 0.03 * Math.sin((t - 15.09) * 1.1) * (1 - u), 0, 2 * Math.PI, enc, Math.max(enc, ebInicial), 0, t * 0.6, {});
  polvo(g, 520, SUELO + 40, tr(t, Ttoca, Ttoca + 0.6));
  polvo(g, 520, SUELO + 40, tr(t, Tgol - 0.05, Tgol + 0.55), 320);
  veloArriba(g, 1);
}
