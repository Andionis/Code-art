// «...como una patinadora que cierra los brazos.»
// Corte en «como»: una pista de hielo bajo un foco. Una patinadora gira despacio con los brazos abiertos; en «cierra»
// los pega al cuerpo y gira rapidísimo, levantando polvo de hielo. Frena con los brazos cerrados y reposa antes del
// corte en «Luego».
import * as k from "#kit";
import { v } from "#voz";
import { veloArriba } from "../mundo.js";

const { suave: su, tramo: tr, mez } = k;
const PI = Math.PI;
const f6 = v.frase(6);
const Tcomo = f6.t("como"), Tcierra = f6.t("cierra"), Tfin = v.frase(7).inicio;
export const desde = () => Tcomo;
export const momentos = { cierra: Tcierra, rapido: Tcierra + 0.15 };
const T1 = Tcierra - 0.05, T2 = Tfin - 0.55; // gira rápido de T1 a T2
// el ángulo de giro: lento con los brazos abiertos, rapidísimo con los brazos cerrados, frena al final
function giro(t) {
  const lentoV = 3.2, rapV = 24;
  const a = Math.min(t, T1) - Tcomo;
  let ang = lentoV * a;
  if (t > T1) { const b = Math.min(t, T2) - T1; ang += lentoV * b + (rapV - lentoV) * (b - Math.min(b, 0.12) / 2); }
  if (t > T2) { const fr = 0.35, b = Math.min(t - T2, fr); ang += rapV * (b - b * b / (2 * fr)); }
  return ang;
}
const vel = (t) => (t < T1 ? 3.2 : t < T2 ? 24 : 24 * (1 - Math.min(1, (t - T2) / 0.35)));

const FONDO = (() => {
  const c = k.lienzo(1080, 1920), g = c.getContext("2d");
  const gr = g.createLinearGradient(0, 0, 0, 1920);
  gr.addColorStop(0, "#0a1a3a"); gr.addColorStop(0.5, "#1d3f7a"); gr.addColorStop(0.62, "#7fb6ea"); gr.addColorStop(1, "#d9f0ff");
  g.fillStyle = gr; g.fillRect(0, 0, 1080, 1920);
  // las gradas con lucecitas
  const az = k.azar(808);
  for (let i = 0; i < 260; i++) { const x = az() * 1080, y = 300 + az() * 780; g.fillStyle = `rgba(${az() < 0.5 ? "255,220,150" : "180,220,255"},${0.25 + az() * 0.5})`; g.beginPath(); g.arc(x, y, 2 + az() * 4, 0, 2 * PI); g.fill(); }
  // la valla de la pista
  g.fillStyle = "#e8f3ff"; g.fillRect(0, 1100, 1080, 60); g.fillStyle = "#3a7fd5"; g.fillRect(0, 1155, 1080, 14);
  // el hielo con rayas de patines
  g.strokeStyle = "rgba(255,255,255,0.5)"; g.lineWidth = 3;
  for (let i = 0; i < 40; i++) { const y = 1250 + az() * 650, x = az() * 1080; g.beginPath(); g.ellipse(x, y, 150 + az() * 300, 20 + az() * 40, 0, az() * 6, az() * 6 + 1.5); g.stroke(); }
  return k.fijar(c);
})();

// La patinadora, de frente; `a`: hacia dónde mira (0 = a la cámara); `br`: brazos abiertos (1) o cerrados (0).
function patinadora(g, x, y, a, br, borr) {
  const ca = Math.cos(a), sa = Math.sin(a);
  g.save(); g.translate(x, y); g.scale(0.88, 0.88);
  // el reflejo en el hielo y la sombra
  g.fillStyle = "rgba(40,80,140,0.3)"; g.beginPath(); g.ellipse(0, 20, 170, 34, 0, 0, 2 * PI); g.fill();
  // la pierna y el patín
  g.fillStyle = "#f2c9a8"; k.redondo(g, -26, -470, 52, 450, 24); g.fill();
  g.fillStyle = "#ffffff"; k.redondo(g, -46, -80, 92, 70, 22); g.fill();
  g.fillStyle = "#c9d3de"; g.fillRect(-60, -10, 120, 12);
  // la otra pierna, levantada hacia atrás (gira con ella)
  g.save(); g.globalAlpha *= 0.95; g.fillStyle = "#e6b896";
  const lx = -sa * 150; k.redondo(g, lx - 24 - 0, -520, 48, 300, 22); g.fill(); g.restore();
  // el vestido
  const gv = g.createLinearGradient(-200, -900, 200, -400);
  gv.addColorStop(0, "#ff5fb4"); gv.addColorStop(1, "#8a3cff");
  g.fillStyle = gv;
  const vuelo = 150 + 120 * Math.min(1, borr / 14);
  g.beginPath(); g.moveTo(-70, -900); g.lineTo(70, -900); g.lineTo(vuelo, -470); g.quadraticCurveTo(0, -430, -vuelo, -470); g.closePath(); g.fill();
  g.fillStyle = "rgba(255,255,255,0.25)"; g.beginPath(); g.moveTo(-20 + 50 * sa, -900); g.lineTo(20 + 50 * sa, -900); g.lineTo(60 + 80 * sa, -470); g.lineTo(0 + 80 * sa, -460); g.closePath(); g.fill();
  // el torso
  g.fillStyle = gv; k.redondo(g, -78, -1180, 156, 300, 60); g.fill();
  // los brazos: abiertos, salen a los lados (escorzados por el giro); cerrados, cruzados sobre el pecho
  const L = mez(70, 380, br);
  for (const lado of [-1, 1]) {
    const ex = lado * L * ca, ey = -1120 - 40 * br + (1 - br) * 90, delante = lado * sa < 0;
    g.strokeStyle = "#f2c9a8"; g.lineWidth = 44; g.lineCap = "round";
    g.beginPath(); g.moveTo(lado * 60 * ca, -1130); g.lineTo(ex, ey); g.stroke();
    g.fillStyle = "#f2c9a8"; g.beginPath(); g.arc(ex, ey, 28, 0, 2 * PI); g.fill();
    if (!delante && br > 0.5) { g.strokeStyle = "rgba(0,0,0,0.12)"; g.lineWidth = 44; g.beginPath(); g.moveTo(lado * 60 * ca, -1130); g.lineTo(ex, ey); g.stroke(); }
  }
  // el cuello y la cabeza
  g.fillStyle = "#f2c9a8"; g.fillRect(-24, -1240, 48, 70);
  g.fillStyle = "#f6d2b3"; g.beginPath(); g.ellipse(0, -1300, 82, 96, 0, 0, 2 * PI); g.fill();
  // el pelo con su moño (el moño gira con ella)
  g.fillStyle = "#5a2e16"; g.beginPath(); g.ellipse(0, -1340, 88, 66, 0, PI, 2 * PI); g.fill();
  const mx = -sa * 70, mz = -ca;
  if (mz > -0.2) { g.fillStyle = "#5a2e16"; g.beginPath(); g.arc(mx, -1390, 50, 0, 2 * PI); g.fill(); }
  // la cara, solo si mira a la cámara
  if (ca > 0) {
    g.save(); g.globalAlpha *= Math.min(1, ca * 2);
    g.fillStyle = "#2a1a10"; for (const s of [-1, 1]) { g.beginPath(); g.ellipse(sa * 60 + s * 28 * ca, -1300, 9, 12, 0, 0, 2 * PI); g.fill(); }
    g.strokeStyle = "#c0485a"; g.lineWidth = 6; g.beginPath(); g.arc(sa * 60, -1265, 22 * ca, 0.2, PI - 0.2); g.stroke();
    g.restore();
  } else { g.fillStyle = "#5a2e16"; g.beginPath(); g.ellipse(sa * 30, -1300, 86, 92, 0, 0, 2 * PI); g.fill(); }
  if (mz <= -0.2) { g.fillStyle = "#5a2e16"; g.beginPath(); g.arc(mx, -1390, 50, 0, 2 * PI); g.fill(); }
  g.restore();
}

export function dibuja(g, t) {
  g.drawImage(FONDO, 0, 0);
  k.brillo(g, 540, 300, 1400, "200,230,255", 0.5);
  // el foco sobre ella
  const gf = g.createLinearGradient(0, 0, 0, 1800); gf.addColorStop(0, "rgba(255,255,240,0.0)"); gf.addColorStop(1, "rgba(255,255,240,0.28)");
  g.fillStyle = gf; g.beginPath(); g.moveTo(470, 0); g.lineTo(610, 0); g.lineTo(860, 1780); g.lineTo(220, 1780); g.closePath(); g.fill();
  const a = giro(t), w = vel(t);
  const br = 1 - su(tr(t, Tcierra - 0.05, Tcierra + 0.25));
  // anillos de velocidad alrededor cuando gira rápido
  const rap = Math.min(1, Math.max(0, (w - 4) / 14));
  if (rap > 0) {
    g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
    for (let i = 0; i < 4; i++) {
      const y = 1780 - 280 - i * 230, r = 230 + i * 10, a0 = a * 1.0 + i * 1.3;
      g.strokeStyle = `rgba(200,240,255,${0.55 * rap})`; g.lineWidth = 10;
      g.beginPath(); g.ellipse(540, y, r, 50, 0, a0 % (2 * PI), a0 % (2 * PI) + 2.4); g.stroke();
    }
    g.restore();
    // polvo de hielo
    const az = k.azar(Math.floor(t * 30));
    for (let i = 0; i < 30; i++) { const ang = az() * 2 * PI, r = 140 + az() * 260; g.fillStyle = `rgba(240,250,255,${0.7 * rap})`; g.beginPath(); g.arc(540 + Math.cos(ang) * r, 1780 + Math.sin(ang) * r * 0.2 - az() * 40, 3 + az() * 5, 0, 2 * PI); g.fill(); }
  }
  patinadora(g, 540, 1780, a, br, w);
  veloArriba(g, 0.8);
}
