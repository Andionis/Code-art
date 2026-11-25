// «Luego estira esas patas, encoge las de atrás, y gira la otra mitad.»
// Corte en «Luego»: el cielo otra vez; la mitad turquesa ya está patas abajo y la rosa, aún del revés. «estira»: las
// patas de delante se estiran; «encoge las de atrás»: las de atrás se pegan a la panza; «gira la otra mitad»: la mitad
// rosa da media vuelta de golpe (la de delante apenas se mueve). «mitad»: el gato se endereza, deja de doblarse y las
// mitades se apagan: ya mira al suelo.
import * as k from "#kit";
import { v } from "#voz";
import { gato, cielo, veloArriba } from "../mundo.js";
import { CAM, lento, HALO_F, HALO_B } from "./04-imposible.js";
import { VUELTA_B } from "./05-delantera.js";

export const desde = "luego";
const { suave: su, tramo: tr, mez } = k;
const PI = Math.PI;
const f7 = v.frase(7);
const T0 = f7.inicio, Test = f7.t("estira"), Tenc = f7.t("encoge"), Tgira = f7.t("gira"), Tmit = f7.t("mitad");
export const momentos = { estira: Test, encoge: Tenc, gira: Tgira, giraFin: Tgira + 0.55 };

export function dibuja(g, t) {
  cielo(g, lento(T0) + 260 * (t - T0), 0);
  const c = CAM(99);
  const ef = 1 - su(tr(t, Test, Test + 0.45));
  const eb = su(tr(t, Tenc, Tenc + 0.45));
  const gi = su(tr(t, Tgira, Tgira + 0.55));
  const rb = mez(PI + VUELTA_B, 2 * PI, gi);
  const rf = 0.12 * Math.sin(PI * gi);
  const der = su(tr(t, Tmit, Tmit + 0.5));
  const hal = 1 - su(tr(t, Tmit + 0.1, Tmit + 0.5));
  gato(g, c.x, c.y, c.s, 0.03 * Math.sin((t - 15.09) * 1.1), rf, rb, ef, eb, mez(-0.7, 0, der), t * 0.6,
    { haloF: { c: HALO_F, al: hal }, haloB: { c: HALO_B, al: hal } });
  if (gi > 0 && gi < 1) {
    g.save(); g.globalCompositeOperation = "lighter"; g.translate(c.x - 150 * c.s, c.y); g.scale(c.s, c.s);
    g.strokeStyle = `rgba(${HALO_B},${0.8 * Math.sin(PI * gi)})`; g.lineWidth = 20; g.lineCap = "round"; g.shadowColor = `rgba(${HALO_B},1)`; g.shadowBlur = 30;
    g.beginPath(); g.ellipse(0, 0, 70, 230, 0, -PI / 2, -PI / 2 - PI * gi, true); g.stroke();
    g.restore();
  }
  veloArriba(g, 1);
}
