// «Pero girar en el aire parece imposible: no tiene nada contra qué empujar. El truco: su espalda es tan flexible que
// se dobla por la mitad, como si fueran dos gatos pegados.»
// Corte en «Pero»: el cielo, a cámara lenta (las nubes suben despacio). El gato, de espaldas y enorme en el centro.
// «empujar»: patalea contra el aire y de sus patas solo salen remolinos de aire que se deshacen: no hay nada.
// «El truco»: la cámara se acerca. «se dobla»: se dobla por la cintura en V. «mitad»: la mitad de delante se ilumina
// en turquesa y la de atrás en naranja; «dos gatos pegados»: una costura de luz brilla en la cintura.
import * as k from "#kit";
import { v } from "#voz";
import { gato, cielo, veloArriba } from "../mundo.js";

export const desde = "pero";
const { suave: su, tramo: tr, mez, claves } = k;
const PI = Math.PI;
const f4 = v.frase(4), f5 = v.frase(5);
const T0 = f4.inicio, Temp = f4.t("nada"), Tfin4 = f4.fin;
const Ttruco = f5.t("truco"), Tdobla = f5.t("dobla"), Tmitad = f5.t("mitad"), Tdos = f5.t("dos"), Tpeg = f5.t("pegados");
export const momentos = { patalea: Temp, dobla: Tdobla, mitad: Tmitad, pegados: Tpeg };

export const CAM = (t) => ({
  s: mez(1.15, 1.3, su(tr(t, Ttruco, Ttruco + 1.2))),
  x: 510, y: mez(1080, 1060, su(tr(t, Ttruco, Ttruco + 1.2))),
});
export const lento = (t) => 3000 + 260 * (t - T0);
export const HALO_F = "70,225,255", HALO_B = "255,70,190";

// remolinos de aire: aparecen donde empuja una pata y se deshacen
function remolino(g, x, y, u, s) {
  if (u <= 0 || u >= 1) return;
  g.save(); g.translate(x, y); g.scale(s, s);
  g.lineCap = "round";
  for (const [col, w] of [["rgba(40,110,200,", 20], ["rgba(255,255,255,", 9]]) {
    g.strokeStyle = col + (0.9 * (1 - u)) + ")"; g.lineWidth = w * (1 - 0.6 * u);
    for (let i = 0; i < 3; i++) {
      const r = 30 + 70 * k.entra(u) + i * 24, a0 = i * 2.1 + u * 4;
      g.beginPath(); g.arc(0, 0, r, a0, a0 + 2.4); g.stroke();
    }
  }
  g.restore();
}
const EMPUJES = [0, 0.35, 0.7, 1.05, 1.4].map((d, i) => ({ t: Temp - 0.55 + d, x: i % 2 ? -230 : 170, dx: i % 2 ? -40 : 50 }));

export function dibuja(g, t) {
  cielo(g, lento(t), 0);
  const c = CAM(t);
  const patalea = su(tr(t, Temp - 0.7, Temp - 0.4)) * (1 - su(tr(t, Ttruco - 0.3, Ttruco)));
  const dobla = -0.7 * su(tr(t, Tdobla - 0.15, Tmitad + 0.1));
  const hal = su(tr(t, Tmitad - 0.05, Tmitad + 0.3));
  const cost = k.pulso(t, Tpeg + 0.1, 0.3);
  gato(g, c.x, c.y, c.s, 0.03 * Math.sin((t - T0) * 1.1), PI, PI, 0.25 + 0.3 * patalea * (0.5 + 0.5 * Math.sin(t * 11)), 0.3 + 0.3 * patalea * (0.5 + 0.5 * Math.sin(t * 11 + 2)), dobla, t * 0.6,
    { agita: 0.25 + 0.9 * patalea, haloF: { c: HALO_F, al: hal }, haloB: { c: HALO_B, al: hal } });
  for (const e of EMPUJES) remolino(g, c.x + e.x * c.s + e.dx * tr(t, e.t, e.t + 0.8), c.y - 330 * c.s - 80 * tr(t, e.t, e.t + 0.8), tr(t, e.t, e.t + 0.8), c.s);
  // la costura de luz en la cintura: «dos gatos pegados»
  const cosA = su(tr(t, Tdos - 0.1, Tdos + 0.2));
  if (cosA > 0) {
    g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha *= cosA;
    g.translate(c.x, c.y); g.scale(c.s, c.s);
    g.strokeStyle = `rgba(255,255,230,${0.6 + 0.4 * cost})`; g.lineWidth = 10 + 10 * cost; g.lineCap = "round"; g.shadowColor = "rgba(255,255,200,1)"; g.shadowBlur = 30;
    g.setLineDash([22, 16]);
    g.beginPath(); g.moveTo(0, -125); g.lineTo(0, 125); g.stroke();
    g.restore();
  }
  veloArriba(g, 1);
}
