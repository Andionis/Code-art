// «¿Por qué es casi imposible aplastar una mosca? Porque para ella, tu mano va en cámara lenta.»
// La mesa de la cocina, una sola cámara.
// - Fotograma 0: la mosca enorme sobre la mesa, de lado, frotándose las patas; la mano ya baja desde arriba, cada
//   vez más rápido, y su sombra oscurece la mesa.
// - «aplastar»: la mosca se agacha y despega justo antes; la mano golpea la mesa (fogonazo, la imagen da un golpe).
//   La mosca queda en el aire, a la derecha, con las alas borrosas.
// - «mosca» → «Porque»: la mano se levanta y se va; la mosca vuelve a posarse donde estaba.
// - «para ella, tu mano va en cámara lenta»: la mano vuelve a bajar, pero despacísimo, dejando fotogramas fantasma
//   detrás; la mosca, tan tranquila, se frota las patas. La mano se para arriba antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { cocina, mosca, mano, golpe } from "../mundo.js";

export const desde = 0;
const { suave: su, tramo: tr, mez, entra, sale } = k;
const f1 = v.frase(1), f2 = v.frase(2);
const Tgolpe = f1.t("aplastar") + 0.04;            // la mano toca la mesa
const Tdespega = Tgolpe - 0.14;                     // la mosca ya se ha ido
const Tsube = Tgolpe + 0.3, Tfuera = Tgolpe + 0.95;  // la mano se levanta
const Tposa0 = f1.fin - 0.1, Tposa1 = f2.inicio + 0.25; // la mosca vuelve
const Tlenta0 = f2.t("tu") - 0.35, Tlenta1 = f2.fin - 0.05; // la mano baja en cámara lenta
export const momentos = { golpe: Tgolpe, despega: Tdespega, posa: Tposa1, lenta: Tlenta0 };

const MX = 520, MY = 1330, MS = 660, SUELO = 1330;
const W0 = 620;
// dónde está la mano (y del centro de la palma, ancho, cuánto se ve de canto)
function manoEn(t) {
  if (t < Tgolpe) {
    const u = tr(t, 0, Tgolpe), e = Math.pow(u, 1.8);
    const W = mez(W0, 760, e), ap = mez(0.62, 0.34, e);
    return { y: mez(-230, SUELO - 1.25 * W * ap + 10, e), W, ap, vel: 1 };
  }
  if (t < Tlenta0) {
    const W = 760, ap0 = 0.34, yG = SUELO - 1.25 * W * ap0 + 10;
    const u = su(tr(t, Tsube, Tfuera));
    return { y: mez(yG, -900, u), W, ap: mez(ap0, 0.62, u), vel: 0 };
  }
  // la cámara lenta: baja despacio y frena hasta pararse arriba de la mosca
  const u = su(tr(t, Tlenta0, Tlenta1));
  return { y: mez(-700, 420, u), W: mez(W0, 680, u), ap: mez(0.62, 0.5, u), vel: 0 };
}

export function dibuja(g, t) {
  // un golpe de la imagen al chocar; si no, la cámara se acerca despacio
  const choque = k.pulso(t, Tgolpe + 0.03, 0.08);
  const z = 1 + 0.05 * su(tr(t, 0, Tgolpe)) + 0.03 * choque - 0.05 * su(tr(t, Tgolpe + 0.2, Tposa1));
  g.save(); g.translate(540, 1150); g.scale(z, z); g.translate(-540, -1150 + 14 * choque);
  cocina(g, 1150);
  // la sombra de la mano, que oscurece la mesa mientras baja
  const m = manoEn(t);
  const cerca = t < Tgolpe ? Math.pow(tr(t, 0, Tgolpe), 1.5) : t < Tlenta0 ? 1 - su(tr(t, Tsube, Tfuera)) : 0.5 * su(tr(t, Tlenta0, Tlenta1));
  if (cerca > 0.01) {
    g.save(); g.translate(540, SUELO); g.scale(1, 0.2);
    const sg = g.createRadialGradient(0, 0, 0, 0, 0, 700); sg.addColorStop(0, `rgba(25,10,2,${0.55 * cerca})`); sg.addColorStop(1, "rgba(25,10,2,0)");
    g.fillStyle = sg; g.beginPath(); g.arc(0, 0, 700, 0, Math.PI * 2); g.fill(); g.restore();
  }
  // la mosca
  const vuela = tr(t, Tdespega, Tdespega + 0.12) * (1 - tr(t, Tposa1 - 0.12, Tposa1));
  let x = MX, y = MY;
  if (t > Tdespega && t < Tposa1) {
    const sube = entra(tr(t, Tdespega, Tdespega + 0.5)), baja = su(tr(t, Tposa0, Tposa1));
    const hx = 700 + 25 * Math.sin(t * 7), hy = 900 + 20 * Math.sin(t * 9.3);
    x = mez(mez(MX, hx, sube), MX, baja); y = mez(mez(MY, hy, sube), MY, baja);
  }
  const agacha = k.pulso(t, Tdespega - 0.06, 0.08) + k.pulso(t, Tposa1, 0.07) * 0.6;
  const frota = (1 - tr(t, Tdespega - 0.25, Tdespega - 0.1)) + tr(t, Tposa1 + 0.3, Tposa1 + 0.6);
  const pintaMosca = () => mosca(g, x, y, MS * (1 + 0.12 * vuela), { t, frota: Math.min(1, frota), alas: vuela > 0.02 ? 1 : 0, aire: vuela, agacha, inclina: -0.25 * vuela, suelo: SUELO });
  if (vuela <= 0.02) pintaMosca();
  // la mano: rápida en el golpe; en cámara lenta, con sus fotogramas fantasma detrás
  if (t >= Tlenta0) {
    for (const [d, a] of [[0.75, 0.14], [0.5, 0.22], [0.25, 0.32]]) {
      const tt = t - d; if (tt < Tlenta0) continue;
      const mg = manoEn(tt); mano(g, 540, mg.y, mg.W, mg.ap, a, Math.PI);
    }
  }
  const vel = t < Tgolpe ? 260 * Math.pow(tr(t, Tgolpe - 0.5, Tgolpe), 2) : t < Tlenta0 && t > Tsube ? 120 * tr(t, Tsube, Tfuera) : 0;
  mano(g, 540, m.y, m.W, m.ap, 1, Math.PI, vel);
  golpe(g, 540, SUELO, tr(t, Tgolpe, Tgolpe + 0.45), 820);
  if (vuela > 0.02) pintaMosca();
  g.restore();
  // un velo suave arriba, para el subtítulo
  const vg = g.createLinearGradient(0, 200, 0, 620); vg.addColorStop(0, "rgba(15,8,4,0.5)"); vg.addColorStop(1, "rgba(15,8,4,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 620);
}
