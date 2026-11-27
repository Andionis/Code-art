// «Y lo que aplasta es lo mismo de lo que estás hecho tú: átomos. Un átomo está casi vacío: si fuera un estadio...»
// Dentro de la materia: un enjambre de átomos, cada uno con su nube azul, sus electrones girando y su núcleo rojo.
// - «aplasta»: la cámara vuela deprisa entre los átomos, que se aprietan unos contra otros.
// - «átomos»: frena delante de uno, que se queda grande en el centro.
// - «Un átomo está casi vacío»: la cámara entra en él: la nube se abre más allá de la pantalla y el núcleo se queda en
//   un puntito rojo en medio de la nada; en «vacío», un anillo lo señala. Reposa antes del corte a «estadio».
import * as k from "#kit";
import { v } from "#voz";
import { atomo } from "../mundo.js";

export const desde = "aplasta";

const { suave: su, tramo: tr, mez, entra, F, proyecta } = k;
const f5 = v.frase(5), f6 = v.frase(6);
const T0 = f5.t("aplasta"), Tat = f5.t("atomos"), Tun = f6.inicio, Tvac = f6.t("vacio"), Test = f6.t("estadio");

const ZT = -40;                                           // el átomo del centro
// la distancia de la cámara al átomo del centro: lejos y deprisa; frena en «átomos»; entra en «Un átomo»
const dist = (t) => {
  if (t < Tat) return mez(46, (F * 1) / 330, entra(tr(t, T0 - 0.1, Tat)));
  return Math.exp(mez(Math.log((F * 1) / 330), Math.log((F * 1) / 2000), su(tr(t, Tun - 0.05, Tvac + 0.2))));
};
const cam = (t) => k.mira([0, 0, ZT + dist(t)], [0, 0, ZT - 10]);
const az = k.azar(41), ATOMOS = [];
while (ATOMOS.length < 170) {
  const p = [(az() - 0.5) * 16, (az() - 0.5) * 26, ZT - 14 + az() * 58];
  if (Math.hypot(p[0], p[1]) < 2.6) continue;
  ATOMOS.push({ p, s: az() * 10, f: az() * 6 });
}

export function dibuja(g, t) {
  const c = cam(t);
  // fondo: un azul muy oscuro con brillo en el centro
  g.fillStyle = "#040611"; g.fillRect(0, 0, 1080, 1920);
  const fg = g.createRadialGradient(540, 960, 0, 540, 960, 1200);
  fg.addColorStop(0, "rgba(40,60,140,0.45)"); fg.addColorStop(1, "rgba(10,10,40,0)"); g.fillStyle = fg; g.fillRect(0, 0, 1080, 1920);
  // se aprietan: todos se acercan al centro mientras la voz dice «aplasta... hecho tú»
  const apri = mez(1, 0.78, su(tr(t, T0, Tat)));
  const cosas = [];
  for (const q of ATOMOS) {
    const tiembla = 0.12 * Math.sin(t * 9 + q.f);
    const P = proyecta(c, [q.p[0] * apri + tiembla, q.p[1] * apri, q.p[2]]);
    if (!P || P.z < 0.4) continue;
    const R = F / P.z;
    if (P.x < -R || P.x > 1080 + R || P.y < -R || P.y > 1920 + R) continue;
    const al = Math.min(1, (60 - P.z) / 20) * (1 - su(tr(t, Tun, Tvac)));
    cosas.push({ z: P.z, dibuja: () => atomo(g, P.x, P.y, R, t, q.s, { al }) });
  }
  // el del centro: su núcleo se queda en un puntito cuando la cámara entra
  const O = proyecta(c, [0, 0, ZT]);
  if (O) {
    const R = F / O.z, ratio = mez(0.13, 0.0035, su(tr(t, Tun - 0.05, Tvac + 0.2)));
    cosas.push({ z: O.z, dibuja: () => atomo(g, O.x, O.y, R, t, 3.3, { ratio }) });
  }
  k.deLejosACerca(cosas);
  // en «vacío», un anillo señala el núcleo
  const an = tr(t, Tvac - 0.1, Tvac + 0.25);
  if (an > 0 && O) {
    g.strokeStyle = `rgba(255,120,100,${0.9 * an})`; g.lineWidth = 6;
    g.beginPath(); g.arc(O.x, O.y, mez(160, 46, k.entra(an)), 0, Math.PI * 1.98); g.stroke();
  }
}
