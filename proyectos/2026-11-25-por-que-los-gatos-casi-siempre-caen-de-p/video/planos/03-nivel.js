// «...el nivel de burbuja de un albañil: le dice al instante dónde está el suelo.»
// Corte en «nivel»: una pared de ladrillos recién puesta, con su mezcla; encima, un nivel de burbuja amarillo, grande,
// con la burbuja dentro del líquido turquesa. «albañil»: la llana deja la última pasada de mezcla y el nivel se inclina
// a un lado (la burbuja corre) y al otro. «al instante»: se endereza; en «suelo» la burbuja queda en el centro, entre
// sus dos rayas, y brilla. Reposa antes del corte en «Pero».
import * as k from "#kit";
import { v } from "#voz";
import { AQUA } from "./02-oido.js";
import { veloArriba } from "../mundo.js";

export const desde = "nivel";
const { suave: su, tramo: tr, mez, claves } = k;
const f3 = v.frase(3);
const Tniv = f3.t("nivel"), Talb = f3.t("albanil"), Tins = f3.t("instante"), Tsue = f3.t("suelo");
export const momentos = { inclina: Talb - 0.3, otro: Talb + 0.7, recto: Tsue - 0.05 };

const LAD = (() => {
  const c = k.lienzo(1080, 1920), g = c.getContext("2d"), az = k.azar(303);
  g.fillStyle = "#cfc3b0"; g.fillRect(0, 0, 1080, 1920);
  const h = 120, w = 260;
  for (let f = 0; f < 17; f++) for (let i = -1; i < 6; i++) {
    const x = i * w + (f % 2 ? w / 2 : 0) + 6, y = f * h + 6;
    const base = [196 + az() * 30, 82 + az() * 25, 52 + az() * 15];
    const gr = g.createLinearGradient(x, y, x, y + h - 12);
    gr.addColorStop(0, `rgb(${base[0] + 20},${base[1] + 18},${base[2] + 10})`); gr.addColorStop(1, `rgb(${base[0] - 40},${base[1] - 25},${base[2] - 15})`);
    g.fillStyle = gr; k.redondo(g, x, y, w - 12, h - 12, 10); g.fill();
  }
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.12; g.fillStyle = g.createPattern(k.red, "repeat"); g.fillRect(0, 0, 1080, 1920);
  return k.fijar(c);
})();

function nivel(g, x, y, ang, brillo) {
  const L = 980, H = 170;
  g.save(); g.translate(x, y); g.rotate(ang);
  // sombra en la pared
  g.fillStyle = "rgba(40,15,5,0.35)"; k.redondo(g, -L / 2 + 14, -H / 2 + 22, L, H, 22); g.fill();
  // el cuerpo de aluminio amarillo
  const gr = g.createLinearGradient(0, -H / 2, 0, H / 2);
  gr.addColorStop(0, "#fff07a"); gr.addColorStop(0.18, "#ffd21f"); gr.addColorStop(0.8, "#e0a800"); gr.addColorStop(1, "#9c6f00");
  g.fillStyle = gr; k.redondo(g, -L / 2, -H / 2, L, H, 20); g.fill();
  g.fillStyle = "rgba(255,255,255,0.4)"; k.redondo(g, -L / 2 + 16, -H / 2 + 10, L - 32, 14, 7); g.fill();
  // tapas negras de los extremos
  for (const sx of [-1, 1]) { g.fillStyle = "#222"; k.redondo(g, sx < 0 ? -L / 2 : L / 2 - 46, -H / 2, 46, H, 14); g.fill(); }
  // la ventana con el tubo
  g.fillStyle = "#3a2a00"; k.redondo(g, -170, -50, 340, 100, 18); g.fill();
  const gt = g.createLinearGradient(0, -36, 0, 36);
  gt.addColorStop(0, "rgb(170,255,240)"); gt.addColorStop(0.5, `rgb(${AQUA})`); gt.addColorStop(1, "rgb(20,150,170)");
  g.fillStyle = gt; k.redondo(g, -150, -34, 300, 68, 34); g.fill();
  // la burbuja: corre hacia el lado alto
  const bx = Math.max(-100, Math.min(100, -Math.sin(ang) * 900));
  const gb = g.createRadialGradient(bx - 12, -12, 3, bx, 0, 46);
  gb.addColorStop(0, "rgba(255,255,255,1)"); gb.addColorStop(0.6, "rgba(230,255,255,0.85)"); gb.addColorStop(1, "rgba(200,255,255,0.4)");
  g.fillStyle = gb; g.beginPath(); g.ellipse(bx, 0, 46, 26, 0, 0, Math.PI * 2); g.fill();
  // las dos rayas del centro
  g.strokeStyle = "#102020"; g.lineWidth = 6;
  for (const sx of [-54, 54]) { g.beginPath(); g.moveTo(sx, -34); g.lineTo(sx, 34); g.stroke(); }
  // reflejo del vidrio
  g.fillStyle = "rgba(255,255,255,0.45)"; k.redondo(g, -140, -28, 280, 12, 6); g.fill();
  if (brillo > 0) { g.globalCompositeOperation = "lighter"; k.brillo(g, 0, 0, 420, AQUA, brillo); }
  g.restore();
}

export function dibuja(g, t) {
  const z = mez(1, 1.1, su(tr(t, Tniv, Tsue + 0.6)));
  g.save(); g.translate(540, 1020); g.scale(z, z); g.translate(-540, -1020);
  g.drawImage(LAD, 0, 0);
  // luz cálida desde arriba a la izquierda, rincones más oscuros
  k.brillo(g, 260, 500, 1500, "255,220,170", 0.35);
  const vi = g.createRadialGradient(540, 1000, 500, 540, 1000, 1300); vi.addColorStop(0, "rgba(0,0,0,0)"); vi.addColorStop(1, "rgba(30,10,0,0.55)");
  g.fillStyle = vi; g.fillRect(0, 0, 1080, 1920);
  const ang = claves([[Tniv, -0.13], [Talb - 0.3, -0.13], [Talb + 0.2, 0.14], [Talb + 0.7, 0.14], [Tins, -0.08], [Tins + 0.35, -0.08], [Tsue - 0.05, 0], [Tsue + 2, 0]])(t);
  const ent = k.entra(tr(t, Tniv - 0.03, Tniv + 0.35));
  nivel(g, 540, mez(1150, 1020, ent), ang, 0.8 * su(tr(t, Tsue - 0.05, Tsue + 0.25)) * (1 - 0.4 * su(tr(t, Tsue + 0.4, Tsue + 0.8))));
  g.restore();
  veloArriba(g, 0.6);
}
