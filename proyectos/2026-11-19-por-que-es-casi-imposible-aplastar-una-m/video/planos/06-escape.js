// «Y lo más sorprendente: antes de despegar, planea su escape. Mueve las patas, se inclina hacia el lado contrario de
// tu mano... y salta.»
// Corte en «Y» a la mesa de lado, en cámara lenta: la mano llega despacio desde arriba a la izquierda, con sus
// fotogramas fantasma.
// - «planea su escape»: una flecha de puntos se dibuja desde la mosca hacia arriba a la derecha, lejos de la mano.
// - «Mueve las patas»: las patas del medio se recogen (se iluminan un momento). «se inclina»: el cuerpo se echa hacia
//   la derecha. «contrario de tu mano»: la flecha brilla.
// - «salta»: despega siguiendo la flecha y sale de la imagen; la mano, despacio, llega a la mesa vacía y se para.
import * as k from "#kit";
import { v } from "#voz";
import { cocina, mosca, mano } from "../mundo.js";

export const desde = (vz) => vz.frase(8).inicio;
export const entrada = "corte";
const { suave: su, tramo: tr, mez, entra } = k;
const f8 = v.frase(8), f9 = v.frase(9);
const T0 = f8.inicio, Tpla = f8.t("planea"), Tesc = f8.t("escape"), Tpat = f9.t("patas"), Tinc = f9.t("inclina"), Tcon = f9.t("contrario"), Tsal = f9.t("salta"), Fin = f9.fin;
export const momentos = { flecha: Tpla, patas: Tpat - 0.1, inclina: Tinc, salta: Tsal };

const MX = 500, MY = 1380, MS = 660;
// la flecha: de la mosca hacia arriba a la derecha
const P0 = [MX + 40, MY - 200], P1 = [MX + 280, MY - 560], P2 = [1240, MY - 900];
const bez = (u) => [(1 - u) ** 2 * P0[0] + 2 * (1 - u) * u * P1[0] + u * u * P2[0], (1 - u) ** 2 * P0[1] + 2 * (1 - u) * u * P1[1] + u * u * P2[1]];
// la mano, en cámara lenta
const manoEn = (t) => { const u = su(tr(t, T0 - 1, Fin + 0.3)); return [mez(-300, 120, u), mez(-50, 620, u)]; };

export function dibuja(g, t) {
  cocina(g, 1180, 0.9);
  // la flecha de puntos, que se dibuja en «planea»
  const dib = su(tr(t, Tpla - 0.1, Tesc + 0.35)), brilla = 1 + 0.8 * k.pulso(t, Tcon + 0.1, 0.25);
  let volando = null;
  const vuelo = tr(t, Tsal - 0.05, Tsal + 0.55), apaga = 1 - su(tr(t, Tsal + 0.3, Fin));
  if (dib > 0 && apaga > 0) {
    g.save(); g.globalAlpha = apaga; g.globalCompositeOperation = "lighter";
    g.fillStyle = `rgba(255,214,90,${Math.min(1, 0.75 * brilla)})`;
    for (let u = 0.04; u < dib * 0.96; u += 0.035) { if (u < vuelo) continue; const [x, y] = bez(u); g.beginPath(); g.arc(x, y, 11, 0, Math.PI * 2); g.fill(); }
    if (dib > 0.9) {
      const [x, y] = bez(0.9), [x2, y2] = bez(0.86), a = Math.atan2(y - y2, x - x2);
      g.save(); g.translate(x, y); g.rotate(a); g.beginPath(); g.moveTo(34, 0); g.lineTo(-18, -26); g.lineTo(-18, 26); g.closePath(); g.fill(); g.restore();
    }
    k.brillo(g, P1[0], P1[1], 500, "255,200,80", 0.25 * (brilla - 0.6) * dib);
    g.restore();
  }
  // la mosca: recoge las patas, se inclina y salta por la flecha
  const agacha = su(tr(t, Tpat - 0.15, Tpat + 0.4)) * (1 - tr(t, Tsal, Tsal + 0.1));
  const inclina = 0.14 * su(tr(t, Tinc - 0.1, Tinc + 0.5)) * (1 - tr(t, Tsal, Tsal + 0.15));
  const lado = 24 * su(tr(t, Tinc - 0.1, Tinc + 0.5));
  if (t < Tsal + 0.6) {
    let x = MX + lado, y = MY;
    if (vuelo > 0) { const [bx, by] = bez(Math.min(1, vuelo * 1.05)); x = bx - 40; y = by + 200; }
    const frota = 1 - tr(t, Tpat - 0.5, Tpat - 0.2);
    const pinta = () => mosca(g, x, y, MS, { t, frota, agacha, inclina: vuelo > 0 ? -0.35 : inclina, aire: Math.min(1, vuelo * 5), alas: vuelo > 0 ? 1 : 0, suelo: 1380 });
    if (vuelo <= 0) pinta(); else volando = pinta;
    // las patas del medio, iluminadas un momento
    const luz = k.pulso(t, Tpat + 0.1, 0.3);
    if (luz > 0.02) k.brillo(g, MX + 20, MY - 60, 360, "255,214,90", 0.55 * luz);
  }
  // la mano, con sus fantasmas
  for (const [d, a] of [[0.75, 0.14], [0.5, 0.22], [0.25, 0.32]]) { const [x, y] = manoEn(t - d); mano(g, x, y, 640, 0.6, a, 2.45); }
  const [hx, hy] = manoEn(t); mano(g, hx, hy, 640, 0.6, 1, 2.45);
  if (volando) volando();
  const vg = g.createLinearGradient(0, 200, 0, 600); vg.addColorStop(0, "rgba(15,8,4,0.55)"); vg.addColorStop(1, "rgba(15,8,4,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 600);
}
