// «Encoge las patas de adelante, y la mitad delantera gira rapidísimo, ...»
// Sigue el mismo cielo y la misma cámara. «Encoge»: las patas de delante se pegan al pecho (las de atrás se estiran).
// «gira rapidísimo»: la mitad turquesa da media vuelta de golpe y queda patas abajo, mientras la rosa apenas se mueve
// al revés. La imagen reposa antes del corte en «como».
import * as k from "#kit";
import { v } from "#voz";
import { gato, cielo, veloArriba } from "../mundo.js";
import { CAM, lento, HALO_F, HALO_B, costura } from "./04-imposible.js";

export const desde = "encoge";
export const entrada = "sigue";
const { suave: su, tramo: tr, mez } = k;
const PI = Math.PI;
const f6 = v.frase(6);
const Tenc = f6.t("encoge"), Tgira = f6.t("gira"), Tcomo = f6.t("como");
export const momentos = { encoge: Tenc + 0.05, gira: Tgira, giraFin: Tgira + 0.55 };
export const VUELTA_B = 0.18; // lo que la mitad de atrás gira al revés (unos 10°)

export function dibuja(g, t) {
  // las nubes frenan hasta pararse antes del corte
  const T0 = Tenc, fr = Tcomo - 0.2 - T0, d = Math.min(t - T0, fr);
  cielo(g, lento(T0) + 260 * (d - d * d / (2 * fr)), 0);
  const c = CAM(t);
  const ef = mez(0.25, 1, su(tr(t, Tenc, Tenc + 0.45)));
  const eb = 0.3 * (1 - su(tr(t, Tenc, Tenc + 0.45)));
  const gi = su(tr(t, Tgira, Tgira + 0.55));
  const rf = mez(PI, 0, gi), rb = PI + VUELTA_B * gi;
  const quieto = Math.min(t, Tcomo - 0.2);
  gato(g, c.x, c.y, c.s, 0.03 * Math.sin((quieto - 15.09) * 1.1), rf, rb, ef, eb, -0.7, quieto * 0.6,
    { agita: 0.25 * (1 - su(tr(t, Tenc, Tenc + 0.3))), haloF: { c: HALO_F, al: 1 }, haloB: { c: HALO_B, al: 1 } });
  costura(g, c, 1 - su(tr(t, Tenc, Tenc + 0.5)), 0);
  // la estela del giro: un arco turquesa que barre la mitad de delante
  if (gi > 0 && gi < 1) {
    g.save(); g.globalCompositeOperation = "lighter"; g.translate(c.x + 150 * c.s, c.y); g.scale(c.s, c.s);
    g.strokeStyle = `rgba(${HALO_F},${0.8 * Math.sin(PI * gi)})`; g.lineWidth = 20; g.lineCap = "round"; g.shadowColor = `rgba(${HALO_F},1)`; g.shadowBlur = 30;
    g.beginPath(); g.ellipse(0, 0, 70, 230, 0, -PI / 2, -PI / 2 + PI * gi); g.stroke();
    g.restore();
  }
  veloArriba(g, 1);
}
