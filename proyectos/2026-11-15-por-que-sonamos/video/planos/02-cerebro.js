// «¿Para qué tanto trabajo? La ciencia todavía no lo sabe del todo, pero tiene dos ideas fuertes.»
// + «La primera: un simulacro.» (la cámara entra en la burbuja roja)
// El cerebro de luz, enorme, flotando en la oscuridad.
// - «¿Para qué»: el cerebro, de cerca, con sus chispas; la cámara se aleja despacio.
// - «no lo sabe del todo»: ondas de luz salen del cerebro y se pierden en la oscuridad (busca, no encuentra).
// - «dos»: de arriba salen dos burbujas de sueño, una roja (una calle de noche) y una azul (un cielo en calma), y se
//   quedan a cada lado.
// - «simulacro»: la cámara se lanza dentro de la roja.
import * as k from "#kit";
import { v } from "#voz";
import { RS, TAU, burbuja, camino2D, cerebro, velo, vineta, vista } from "../mundo.js";
import { calle, calma } from "../suenos.js";

const f4 = v.frase(4), f5 = v.frase(5);
export const desde = (vv) => vv.frase(4).inicio;
const { suave: su, tramo: tr, mez, azar } = k;
const T0 = f4.inicio, Tcien = f4.t("ciencia"), Tsabe = f4.t("sabe"), Tdos = f4.t("dos"), Tideas = f4.t("ideas");
const Tprim = f5.t("primera"), Tsim = f5.t("simulacro");

// las dos burbujas, en el mundo
export const BR = [-250, -250], BA = [250, -250], RBb = 200;
const cam = camino2D([
  [T0 - 0.05, [2.1, 0, 0]],
  [Tdos - 0.2, [1.45, 0, -40]],
  [Tideas + 0.4, [1.2, 0, -100]],
  [Tprim + 0.1, [1.22, -20, -110]],
  [Tsim + 0.05, [RS / RBb, BR[0], BR[1]]],
]);
const azO = azar(12);
const ONDAS = [0, 0.45, 0.9].map((d) => Tcien + d);
const PUNTOS = Array.from({ length: 160 }, () => ({ x: (azO() - 0.5) * 2600, y: (azO() - 0.5) * 3600, r: 0.6 + azO() * 1.8, a: 0.2 + azO() * 0.6 }));

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  // la oscuridad, con un poco de polvo de luz
  g.fillStyle = "#07030e"; g.fillRect(cx - 2000, cy - 3000, 4000, 6000);
  const fg = g.createRadialGradient(0, 0, 50, 0, 0, 900); fg.addColorStop(0, "rgba(120,30,130,0.55)"); fg.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = fg; g.fillRect(-1200, -1200, 2400, 2400);
  for (const p of PUNTOS) { g.fillStyle = `rgba(230,200,255,${p.a})`; g.beginPath(); g.arc(p.x, p.y, p.r, 0, TAU); g.fill(); }
  // las ondas que salen a buscar
  g.save(); g.globalCompositeOperation = "lighter";
  for (const o of ONDAS) {
    const w = t - o; if (w < 0 || w > 1.8) continue;
    const r = 260 + w * 520, al = (1 - w / 1.8) * 0.6;
    g.strokeStyle = `rgba(255,170,240,${al})`; g.lineWidth = 6 + w * 6; g.beginPath(); g.ellipse(0, 20, r, r * 0.8, 0, 0, TAU); g.stroke();
  }
  g.restore();
  // el cerebro, que se mece despacio
  g.save(); g.translate(0, 20 + Math.sin(t * 1.1) * 8); g.rotate(Math.sin(t * 0.7) * 0.04);
  k.brillo(g, 0, 0, 900, "255,110,220", 0.45);
  const trab = k.pulso(t, f4.t("trabajo") + 0.2, 0.3);
  if (trab > 0.02) k.brillo(g, 0, -20, 700, "255,200,255", 0.5 * trab);
  cerebro(g, 0, 0, 230, t * (1 + 0.8 * trab), 1);
  g.restore();
  // las dos burbujas, que salen de arriba del cerebro en «dos»
  const u = k.entra(tr(t, Tdos - 0.1, Tdos + 0.75));
  if (u > 0) {
    for (const [P, dibujo, col, fase] of [[BR, calle, "255,90,90", 0], [BA, calma, "120,200,255", 0.12]]) {
      const uu = k.entra(tr(t, Tdos - 0.1 + fase, Tdos + 0.75 + fase));
      const x = mez(0, P[0], uu), y = mez(-120, P[1], uu) + Math.sin(t * 1.3 + fase * 20) * 6 * uu * (1 - su(tr(t, Tprim, Tsim - 0.2)));
      g.save(); k.brillo(g, x, y, RBb * 3, col, 0.5 * uu); g.restore();
      burbuja(g, x, y, RBb * mez(0.15, 1, uu), (gg) => dibujo(gg, t), Math.min(1, uu * 2.5), 1.1 * (1 - su(tr(t, Tsim - 0.35, Tsim))));
    }
  }
  vineta(g, 0.5);
  velo(g, 0.35);
}
