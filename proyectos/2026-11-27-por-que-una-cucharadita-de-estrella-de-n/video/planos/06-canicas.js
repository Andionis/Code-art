// «...como canicas en un frasco apretado.»
// Otro sitio: un frasco de cristal sobre una mesa, lleno de canicas de colores. Se entra con un corte en «canicas».
// - Fotograma 0: el frasco casi lleno; las últimas canicas caen dentro, una tras otra, y encajan.
// - «apretado»: la tapa baja y aprieta; las canicas se hunden un poco, sin un hueco. Reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";

export const desde = "canicas";

const { suave: su, tramo: tr, mez, entra, azar } = k;
const f8 = v.frase(8);
const T0 = f8.t("canicas"), Tapr = f8.t("apretado");
export const tapa = Tapr - 0.05;                          // cuándo cierra (para el sonido)

const X0 = 262, X1 = 818, Y0 = 640, Y1 = 1400, RC = 46;  // el interior del frasco y el radio de cada canica
const COLS = ["#ff4a4a", "#3a8bff", "#ffd23a", "#3ad17a", "#b45cff", "#ff8a2a", "#28d6e6"];
const az = azar(19), CAN = [];
for (let r = 0; ; r++) {
  const y = Y1 - RC - r * RC * 1.74;
  if (y < Y0 + RC) break;
  const off = r % 2 ? RC : 0;
  for (let x = X0 + RC + off; x <= X1 - RC; x += RC * 2.02) CAN.push({ x, y, c: COLS[Math.floor(az() * COLS.length)], g: az() * 6, fila: r });
}
// las de la fila de arriba caen al principio, una tras otra
const ultima = Math.max(...CAN.map((c) => c.fila));
let n = 0;
for (const c of CAN) if (c.fila === ultima) c.cae = T0 - 0.15 + 0.09 * n++;
export const caidas = CAN.filter((c) => c.cae).map((c) => c.cae + 0.38);

function canica(g, x, y, r, col, giro) {
  const gr = g.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.1, x, y, r);
  gr.addColorStop(0, "#ffffff"); gr.addColorStop(0.18, col); gr.addColorStop(0.8, col); gr.addColorStop(1, "#0b0b18");
  g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
  // el remolino de dentro
  g.save(); g.beginPath(); g.arc(x, y, r * 0.92, 0, Math.PI * 2); g.clip();
  g.strokeStyle = "rgba(255,255,255,0.45)"; g.lineWidth = r * 0.14;
  g.beginPath(); g.ellipse(x, y, r * 0.7, r * 0.25, giro, 0.3, 2.6); g.stroke();
  g.restore();
  g.fillStyle = "rgba(255,255,255,0.85)"; g.beginPath(); g.ellipse(x - r * 0.38, y - r * 0.42, r * 0.2, r * 0.12, -0.6, 0, Math.PI * 2); g.fill();
}

export function dibuja(g, t) {
  // la mesa y la pared, con una luz cálida
  const pg = g.createLinearGradient(0, 0, 0, 1460);
  pg.addColorStop(0, "#1a1430"); pg.addColorStop(1, "#3b2a4a"); g.fillStyle = pg; g.fillRect(0, 0, 1080, 1460);
  const mg = g.createLinearGradient(0, 1430, 0, 1920);
  mg.addColorStop(0, "#8a5a36"); mg.addColorStop(1, "#3a2414"); g.fillStyle = mg; g.fillRect(0, 1430, 1080, 490);
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.4; g.drawImage(k.red, 0, 1430, 1080, 490); g.restore();
  k.brillo(g, 540, 900, 1700, "naranja", 0.35);
  g.fillStyle = "rgba(0,0,0,0.4)"; g.beginPath(); g.ellipse(540, 1445, 340, 34, 0, 0, Math.PI * 2); g.fill();
  // las canicas: la tapa, al bajar, las aprieta un poco
  const baja = entra(tr(t, Tapr - 0.25, Tapr + 0.15)), hunde = 10 * baja;
  for (const c of CAN) {
    let y = c.y + hunde * (1 - (c.y - Y0) / (Y1 - Y0));
    if (c.cae) {
      const u = tr(t, c.cae, c.cae + 0.4);
      if (u <= 0) continue;
      y = mez(-80, y, u * u) - 22 * Math.sin(tr(t, c.cae + 0.4, c.cae + 0.6) * Math.PI);
    }
    canica(g, c.x, y, RC * 0.98, c.c, c.g);
  }
  // el frasco de cristal
  k.redondo(g, X0 - 22, Y0 - 50, X1 - X0 + 44, Y1 - Y0 + 72, 60);
  k.vidrio(g, X0 - 22, X1 + 22);
  k.reflejo(g, X0 + 30, Y0, 26, Y1 - Y0 - 60, 0.4);
  k.reflejo(g, X1 - 60, Y0 + 40, 12, Y1 - Y0 - 140, 0.3);
  // la tapa de metal: llega desde arriba y cierra en «apretado»
  const ty = mez(-120, Y0 - 92, baja);
  k.redondo(g, X0 - 36, ty, X1 - X0 + 72, 76, 16);
  k.metal(g, X0 - 36, X1 + 36, ["#8a6a2a", "#f4d98a", "#b8902e", "#fff2c0", "#6e5220"]);
  g.strokeStyle = "rgba(60,40,10,0.5)"; g.lineWidth = 3;
  for (let i = 1; i < 6; i++) { g.beginPath(); g.moveTo(X0 - 36, ty + i * 12.6); g.lineTo(X1 + 36, ty + i * 12.6); g.stroke(); }
}
