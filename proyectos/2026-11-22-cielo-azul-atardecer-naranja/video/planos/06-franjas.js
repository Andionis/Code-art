// «Lo que sí llega son los colores que casi no rebotan: el amarillo, el naranja y el rojo.»
// Corte en «Lo»: el cielo sobre el mar al atardecer, con el Sol en el horizonte; aún pálido. En «amarillo», «naranja»
// y «rojo» el cielo se enciende por franjas, desde el mar hacia arriba. La cámara sube despacio.
import * as k from "#kit";
import { v } from "#voz";
import { cieloMar, camCielo } from "../mundo.js";

const f10 = v.frase(10);
export const desde = () => f10.inicio - 0.03;
const Tam = f10.t("amarillo"), Tna = f10.t("naranja"), Tro = f10.t("rojo"), Tfin = f10.fin;
export const momentos = { amarillo: Tam, naranja: Tna, rojo: Tro };

const { suave: su, tramo: tr, mez } = k;
const azL = k.azar(6060);
const LLEGAN = Array.from({ length: 36 }, (_, i) => ({ t0: f10.inicio - 0.3 + i * 0.09, a: azL() * 6.28, c: ["255,214,70", "255,140,30", "240,60,45"][i % 3], r: 0.4 + azL() * 0.6 }));
const FR = [["255,214,70", Tam], ["255,130,30", Tna], ["235,50,45", Tro]];

export function dibuja(g, t) {
  const sube = su(tr(t, f10.inicio, Tfin + 0.3));
  const cam = camCielo(3000 + 6 * t, mez(2, 7, sube), 0, 0);
  const u = mez(0.62, 0.9, su(tr(t, Tam - 0.3, Tro + 0.4)));
  const { hy, sol } = cieloMar(g, t, { cam, u, sol: 1.2, nubes: 0.8 });
  // los rayos del Sol que giran despacio, y los colores cálidos que llegan hasta la cámara
  if (sol) {
    g.save(); g.globalCompositeOperation = "lighter";
    g.save(); g.beginPath(); g.rect(0, 0, 1080, hy); g.clip();
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2 + t * 0.12, w = 0.045;
      const gr = g.createRadialGradient(sol.x, sol.y, 60, sol.x, sol.y, 1500);
      gr.addColorStop(0, "rgba(255,200,120,0.09)"); gr.addColorStop(1, "rgba(255,160,80,0)");
      g.fillStyle = gr; g.beginPath(); g.moveTo(sol.x, sol.y); g.arc(sol.x, sol.y, 1500, a - w, a + w); g.closePath(); g.fill();
    }
    g.restore();
    for (const p of LLEGAN) {
      const w = t - p.t0; if (w < 0 || w > 1.4) continue;
      const e = Math.pow(w / 1.4, 2.2), d = 40 + 1100 * e * p.r * 1.6;
      const x = sol.x + Math.cos(p.a) * d, y = sol.y + Math.sin(p.a) * d * 0.9;
      const rr = 6 + 50 * e;
      k.brillo(g, x, y, rr * 6, p.c, 0.9 * (1 - tr(w, 1.1, 1.4)));
      g.fillStyle = `rgba(${p.c},${1 - tr(w, 1.1, 1.4)})`; g.beginPath(); g.arc(x, y, rr, 0, Math.PI * 2); g.fill();
    }
    g.restore();
  }
  // las franjas: del mar hacia arriba
  const alto = hy;
  for (let i = 0; i < 3; i++) {
    const [col, tw] = FR[i];
    const a = su(tr(t, tw - 0.15, tw + 0.35));
    if (a <= 0) continue;
    const y1 = hy - alto * (i / 3) + 40, y0 = hy - alto * ((i + 1) / 3) - 40;
    const gr = g.createLinearGradient(0, Math.max(-200, y0 - 160), 0, y1 + 60);
    gr.addColorStop(0, `rgba(${col},0)`); gr.addColorStop(0.3, `rgba(${col},${0.55 * a})`); gr.addColorStop(0.75, `rgba(${col},${0.55 * a})`); gr.addColorStop(1, `rgba(${col},0)`);
    g.save(); g.globalCompositeOperation = "screen"; g.fillStyle = gr; g.fillRect(0, Math.max(-200, y0 - 160), 1080, y1 - y0 + 220); g.restore();
    const fl = k.pulso(t, tw + 0.05, 0.18);
    if (fl > 0.02) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, 540, (y0 + y1) / 2, 1600, col, 0.35 * fl); g.restore(); }
  }
}
