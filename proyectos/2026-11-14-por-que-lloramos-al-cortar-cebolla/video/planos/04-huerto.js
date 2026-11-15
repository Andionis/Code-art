// «Es la defensa de la cebolla, para que ningún animal se la quiera comer.»
// El huerto, cortado como un corte de tierra: la cebolla enterrada con sus hojas fuera. Se entra con un corte en «Es».
// - «defensa»: un halo de gas verde la envuelve un momento, como un escudo.
// - «animal»: un ratón llega por la derecha y la muerde en «se»; «quiera»: le sale una nube verde en la cara;
//   «comer»: salta hacia atrás y se va corriendo.
import * as k from "#kit";
import { v } from "#voz";
import { cebolla, chorro, GAS } from "../mundo.js";

export const desde = (v) => v.frase(8).inicio;
export const entrada = "corte";
const { suave: su, tramo: tr, mez, entra, azar } = k;
const f8 = v.frase(8);
const T0 = f8.inicio, Tdef = f8.t("defensa"), Tani = f8.t("animal"), Tse = f8.t("se"), Tqui = f8.t("quiera"), Tcom = f8.t("comer"), FIN = v.frase(9).inicio;
export const mordisco = Tse, huye = Tcom;
const CX = 380, CY = 1180, S = 250, SUELO = 1000;

const TIERRA = (() => {
  const l = k.lienzo(1080, 1000), c = l.getContext("2d"), az = azar(3);
  const gr = c.createLinearGradient(0, 0, 0, 1000); gr.addColorStop(0, "#6b4426"); gr.addColorStop(0.5, "#4a2d18"); gr.addColorStop(1, "#2a180c");
  c.fillStyle = gr; c.fillRect(0, 0, 1080, 1000);
  c.globalCompositeOperation = "multiply"; c.globalAlpha = 0.35; c.drawImage(k.manchas, 0, 0, 1080, 1000);
  c.globalCompositeOperation = "source-over"; c.globalAlpha = 1;
  for (let i = 0; i < 160; i++) { const x = az() * 1080, y = az() * 1000, r = 4 + az() * 16; const pg = c.createRadialGradient(x - r * 0.3, y - r * 0.3, 1, x, y, r); pg.addColorStop(0, "#b0927a"); pg.addColorStop(1, "#4d3a2c"); c.fillStyle = pg; c.beginPath(); c.ellipse(x, y, r * 1.3, r, az() * 3, 0, 6.283); c.fill(); }
  // raicillas
  c.strokeStyle = "rgba(220,190,150,0.35)"; c.lineWidth = 2;
  for (let i = 0; i < 30; i++) { let x = az() * 1080, y = az() * 300; c.beginPath(); c.moveTo(x, y); for (let j = 0; j < 6; j++) { x += (az() - 0.5) * 40; y += 20 + az() * 20; c.lineTo(x, y); } c.stroke(); }
  return k.fijar(l);
})();
const azH = azar(9);
const HIERBA = Array.from({ length: 70 }, () => ({ x: azH() * 1080, h: 30 + azH() * 60, a: (azH() - 0.5) * 0.5, c: azH() < 0.5 ? "#3d6b2e" : "#557f35" }));

function hojas(g, t) {
  // las hojas de la cebolla: tubos largos, verde oscuro azulado
  for (let i = 0; i < 5; i++) {
    const ang = -0.5 + i * 0.25 + Math.sin(t * 1.3 + i) * 0.03, L = 520 + (i % 2) * 120;
    const x0 = CX + (i - 2) * 12, y0 = CY - 1.2 * S;
    g.strokeStyle = "#2f5e47"; g.lineWidth = 34 - i * 2; g.lineCap = "round";
    g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo(x0 + Math.sin(ang) * L * 0.4, y0 - L * 0.6, x0 + Math.sin(ang) * L, y0 - L * Math.cos(ang) * 0.95); g.stroke();
    g.strokeStyle = "rgba(170,220,190,0.45)"; g.lineWidth = 6;
    g.beginPath(); g.moveTo(x0 - 6, y0); g.quadraticCurveTo(x0 - 6 + Math.sin(ang) * L * 0.4, y0 - L * 0.6, x0 - 6 + Math.sin(ang) * L, y0 - L * Math.cos(ang) * 0.95); g.stroke();
  }
}

// el ratón, de lado, mirando a la izquierda; (x, y) el centro del cuerpo; boca: 0..1 (abierta)
function raton(g, x, y, s, t, boca, susto) {
  g.save(); g.translate(x, y); g.scale(s, s);
  // la cola
  g.strokeStyle = "#d9a0a0"; g.lineWidth = 9; g.lineCap = "round";
  g.beginPath(); g.moveTo(120, 20); g.bezierCurveTo(220, 10 + Math.sin(t * 8) * 20, 260, -80, 330, -60 + Math.sin(t * 6) * 15); g.stroke();
  // las patas
  g.fillStyle = "#e8b0b0";
  for (const px of [-60, 70]) { g.beginPath(); g.ellipse(px + Math.sin(t * 20) * 6 * susto, 72, 26, 11, 0, 0, 6.283); g.fill(); }
  // el cuerpo
  g.beginPath(); g.ellipse(20, 0, 140, 85, 0, 0, 6.283);
  const bg = g.createRadialGradient(-10, -40, 10, 20, 0, 160); bg.addColorStop(0, "#c9c6cf"); bg.addColorStop(0.6, "#8e8a96"); bg.addColorStop(1, "#4f4b57");
  g.fillStyle = bg; g.fill();
  g.save(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha *= 0.2; g.drawImage(k.red, -130, -90, 300, 180); g.restore();
  g.fillStyle = "rgba(240,235,245,0.55)"; g.beginPath(); g.ellipse(10, 40, 100, 35, 0, 0, 6.283); g.fill(); // la panza
  // la cabeza
  g.save(); g.translate(-120, -25); g.rotate(susto * 0.3);
  g.beginPath(); g.moveTo(40, -55); g.quadraticCurveTo(-60, -50, -115, 5 - 6 * boca); g.quadraticCurveTo(-60, 45, 40, 50); g.closePath();
  const hg = g.createRadialGradient(-10, -25, 5, 0, 0, 110); hg.addColorStop(0, "#d4d1da"); hg.addColorStop(1, "#6e6a77"); g.fillStyle = hg; g.fill();
  if (boca > 0) { g.fillStyle = "#3a1414"; g.beginPath(); g.moveTo(-110, 8); g.lineTo(-60, 14); g.lineTo(-105, 8 + 22 * boca); g.closePath(); g.fill(); g.fillStyle = "#fff"; g.fillRect(-104, 9, 10, 10 * boca + 3); }
  // la oreja
  g.beginPath(); g.ellipse(20, -65, 48, 54, -0.2, 0, 6.283); g.fillStyle = "#8e8a96"; g.fill();
  g.beginPath(); g.ellipse(20, -62, 32, 38, -0.2, 0, 6.283); g.fillStyle = "#f0a8b8"; g.fill();
  // el ojo (cerrado de asco con el gas)
  if (susto > 0.5) { g.strokeStyle = "#111"; g.lineWidth = 5; g.beginPath(); g.moveTo(-50, -22); g.lineTo(-30, -12); g.lineTo(-50, -4); g.stroke(); }
  else { g.fillStyle = "#111"; g.beginPath(); g.arc(-40, -15, 12, 0, 6.283); g.fill(); g.fillStyle = "#fff"; g.beginPath(); g.arc(-44, -19, 4, 0, 6.283); g.fill(); }
  // la nariz y los bigotes
  g.fillStyle = "#f08aa0"; g.beginPath(); g.arc(-114, 2 - 6 * boca, 9, 0, 6.283); g.fill();
  g.strokeStyle = "rgba(40,40,40,0.6)"; g.lineWidth = 2;
  for (const d of [-14, 0, 14]) { g.beginPath(); g.moveTo(-95, 6); g.lineTo(-170, 6 + d * 1.8); g.stroke(); }
  g.restore();
  g.restore();
}

export function dibuja(g, t) {
  // el cielo y el sol de la tarde
  const sg = g.createLinearGradient(0, 0, 0, SUELO); sg.addColorStop(0, "#5aa6e8"); sg.addColorStop(1, "#cfe6f0");
  g.fillStyle = sg; g.fillRect(0, 0, 1080, SUELO);
  k.brillo(g, 880, 260, 500, "amarilla", 0.7);
  hojas(g, t);
  // la tierra, cortada
  g.drawImage(TIERRA, 0, SUELO, 1080, 920);
  g.fillStyle = "rgba(255,230,190,0.25)"; g.fillRect(0, SUELO, 1080, 5);
  for (const h of HIERBA) { g.strokeStyle = h.c; g.lineWidth = 6; g.lineCap = "round"; g.beginPath(); g.moveTo(h.x, SUELO + 6); g.lineTo(h.x + Math.sin(h.a) * h.h, SUELO - h.h); g.stroke(); }
  // el hueco de la cebolla en la tierra
  g.fillStyle = "rgba(20,10,4,0.45)"; g.beginPath(); g.ellipse(CX, CY + 20, S * 1.15, S * 1.1, 0, 0, 6.283); g.fill();
  // el escudo de gas en «defensa»
  const esc = su(tr(t, Tdef - 0.1, Tdef + 0.3)) * (1 - su(tr(t, Tdef + 0.9, Tani - 0.1)));
  if (esc > 0) {
    g.save(); g.globalCompositeOperation = "screen";
    const eg = g.createRadialGradient(CX, CY - 40, S * 0.7, CX, CY - 40, S * 1.7);
    eg.addColorStop(0, `rgba(${GAS},0)`); eg.addColorStop(0.5, `rgba(${GAS},${0.55 * esc})`); eg.addColorStop(1, `rgba(${GAS},0)`);
    g.fillStyle = eg; g.beginPath(); g.arc(CX, CY - 40, S * 1.7, 0, 6.283); g.fill(); g.restore();
  }
  // el mordisco: un hueco en la piel en «se»
  cebolla(g, CX, CY, S);
  // el ratón: llega, muerde y huye
  const llega = entra(tr(t, Tani - 0.6, Tse - 0.05)), salta = tr(t, Tcom - 0.05, Tcom + 0.75);
  const rx = mez(1450, CX + S * 0.95 + 245, llega) + 260 * salta + 500 * salta * salta, ry = 1250 - 220 * Math.sin(Math.min(1, salta * 1.4) * Math.PI) * (salta < 0.72 ? 1 : 0);
  const boca = k.pulso(t, Tse, 0.12), susto = su(tr(t, Tqui, Tqui + 0.15));
  if (rx < 1700) raton(g, rx, ry, 1.6, t, boca, susto);
  // la nube verde en la cara del ratón
  const nube = su(tr(t, Tqui - 0.1, Tqui + 0.15)) * (1 - su(tr(t, Tcom + 0.2, FIN - 0.1)));
  if (nube > 0) {
    g.save(); g.globalCompositeOperation = "screen";
    for (let i = 0; i < 9; i++) {
      const a = i / 9 * 6.283 + t, r = 60 + 110 * nube, x = CX + S + 70 + Math.cos(a) * r * 0.8, y = CY - 70 + Math.sin(a) * r * 0.6 - 60 * (t - Tqui);
      const gr = g.createRadialGradient(x, y, 0, x, y, 110 + 50 * nube); gr.addColorStop(0, `rgba(${GAS},${0.45 * nube})`); gr.addColorStop(1, `rgba(${GAS},0)`);
      g.fillStyle = gr; g.beginPath(); g.arc(x, y, 170, 0, 6.283); g.fill();
    }
    g.restore();
  }
}
