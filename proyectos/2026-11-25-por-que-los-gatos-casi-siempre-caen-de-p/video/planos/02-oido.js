// «Primero, su oído funciona como...»
// Corte en «Primero»: la cabeza del gato, enorme, cayendo de espaldas entre nubes (a cámara lenta). En «oído» se
// enciende dentro de la cabeza su oído interno: tres anillos turquesa con líquido dentro; el líquido corre hacia el
// lado del suelo (abajo) y una flecha de luz lo señala. Reposa antes del corte en «nivel».
import * as k from "#kit";
import { v } from "#voz";
import { gato, cielo, veloArriba } from "../mundo.js";

export const desde = "primero";
const { suave: su, tramo: tr, mez } = k;
const f3 = v.frase(3);
const T0 = f3.inicio, Toido = f3.t("oido"), Tniv = f3.t("nivel");
export const momentos = { enciende: Toido - 0.05, corre: Toido + 0.3 };

export const AQUA = "90,235,255";
// El oído interno: tres anillos con líquido; `baja` (0-1) junta el líquido del lado de abajo (ang = hacia dónde está el suelo).
export function oidoInterno(g, x, y, s, al, baja, ang = Math.PI / 2, t = 0) {
  if (al <= 0) return;
  g.save(); g.globalAlpha *= al; g.translate(x, y); g.scale(s, s);
  // el fondo: un hueco oscuro dentro de la cabeza
  const gr = g.createRadialGradient(0, 0, 10, 0, 0, 170);
  gr.addColorStop(0, "rgba(10,40,70,0.85)"); gr.addColorStop(1, "rgba(10,40,70,0)");
  g.fillStyle = gr; g.beginPath(); g.arc(0, 0, 170, 0, Math.PI * 2); g.fill();
  g.globalCompositeOperation = "lighter";
  const anillos = [[-38, -20, 62, 40, -0.5], [30, -30, 58, 30, 0.6], [0, 25, 66, 26, 0.05]];
  for (const [ax, ay, rx, ry, rot] of anillos) {
    g.save(); g.translate(ax, ay); g.rotate(rot);
    g.strokeStyle = `rgba(${AQUA},0.35)`; g.lineWidth = 16; g.beginPath(); g.ellipse(0, 0, rx, ry, 0, 0, 6.2); g.stroke();
    g.strokeStyle = `rgba(${AQUA},0.9)`; g.lineWidth = 4; g.shadowColor = `rgba(${AQUA},1)`; g.shadowBlur = 18;
    g.beginPath(); g.ellipse(0, 0, rx, ry, 0, 0, 6.2); g.stroke();
    // el líquido: un arco brillante que se va al lado del suelo
    const a = ang - rot, ancho = mez(2.6, 1.1, baja), centro = mez(a + 1.4 * Math.sin(t * 2), a, baja);
    g.strokeStyle = "rgba(220,255,255,0.95)"; g.lineWidth = 11; g.lineCap = "round";
    g.beginPath(); g.ellipse(0, 0, rx, ry, 0, centro - ancho / 2, centro + ancho / 2); g.stroke();
    g.restore();
  }
  // la piedrita (otolito), que cae hacia el suelo
  const px = Math.cos(ang) * 34 * baja, py = Math.sin(ang) * 34 * baja;
  g.shadowColor = `rgba(${AQUA},1)`; g.shadowBlur = 24; g.fillStyle = "rgba(240,255,255,1)";
  g.beginPath(); g.arc(px, py, 14, 0, Math.PI * 2); g.fill();
  g.restore();
}

export function dibuja(g, t) {
  const u = t - T0;
  // las nubes suben despacio y se paran antes del corte
  const d = Math.min(u, Tniv - 0.15 - T0), fr = Tniv - 0.15 - T0;
  cielo(g, 2000 + 700 * (d - d * d / (2 * fr)), 0);
  const s = mez(2.25, 2.45, su(tr(t, T0, Tniv - 0.15)));
  const ang = 0.08 * Math.sin(Math.min(u, fr) * 1.3);
  // la cabeza en el centro: el gato está del revés (patas arriba)
  const cx = 540, cy = 1020;
  const lx = cx - Math.cos(ang) * 330 * s + Math.sin(ang) * 40 * s, ly = cy - Math.sin(ang) * 330 * s - Math.cos(ang) * 40 * s;
  gato(g, lx, ly, s, ang, Math.PI, Math.PI, 0.3, 0.3, 0, Math.min(t, Tniv - 0.15), { agita: 0.5 * (1 - su(tr(t, Tniv - 0.7, Tniv - 0.15))) });
  const en = su(tr(t, Toido - 0.1, Toido + 0.3));
  const baja = su(tr(t, Toido + 0.25, Toido + 0.75));
  oidoInterno(g, cx - 75, cy + 55, 1.15, en, baja, Math.PI / 2, t);
  // la flecha de luz hacia el suelo
  const fl = su(tr(t, Toido + 0.6, Toido + 0.9));
  if (fl > 0) {
    const x = cx - 75, y0 = cy + 330, y1 = y0 + 230 * fl;
    const flecha = () => { g.beginPath(); g.moveTo(x, y0); g.lineTo(x, y1); g.stroke(); g.beginPath(); g.moveTo(x - 55, y1 - 35); g.lineTo(x, y1 + 35); g.lineTo(x + 55, y1 - 35); g.closePath(); g.fill(); };
    g.save(); g.globalAlpha *= fl; g.lineCap = "round"; g.lineJoin = "round";
    g.strokeStyle = "rgba(10,60,90,0.9)"; g.fillStyle = "rgba(10,60,90,0.9)"; g.lineWidth = 34; flecha();
    g.strokeStyle = `rgb(${AQUA})`; g.fillStyle = `rgb(${AQUA})`; g.lineWidth = 18; g.shadowColor = `rgba(${AQUA},1)`; g.shadowBlur = 25; flecha();
    g.restore();
  }
  veloArriba(g, 1);
}
