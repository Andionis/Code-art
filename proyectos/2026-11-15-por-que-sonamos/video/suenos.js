// Los otros dos sueños, en coordenadas locales del sueño (a escala 1 llenan la pantalla: ±540 × ±960; todo cabe en
// un círculo de radio RS): la pesadilla de la calle (te persiguen, te caes) y el sueño en calma (el cielo azul).
import * as k from "#kit";
import { RS, TAU, corredor } from "./mundo.js";

const { azar, mez, tramo: tr, suave: su } = k;
export const SUELO = 330;

// ---------------------------------------------------------------- la pesadilla: una calle de noche, de lado
const azC = azar(222);
const LEJOS = Array.from({ length: 30 }, (_, i) => ({ x: i * 160 + azC() * 60, w: 120 + azC() * 120, h: 300 + azC() * 500 }));
const CERCA = Array.from({ length: 14 }, (_, i) => ({ x: i * 340, w: 300 + azC() * 30, h: 650 + azC() * 450, tono: azC(), sem: 1 + Math.floor(azC() * 99) }));
const W_L = 30 * 160, W_C = 14 * 340, W_F = 900;
const rep = (x, W) => ((((x % W) + W) % W) - W / 2);

function edificio(g, x, w, h, b) {
  const y0 = SUELO - h;
  const eg = g.createLinearGradient(x, 0, x + w, 0);
  eg.addColorStop(0, k.mezColor("#2a0f2a", "#3a1430", b.tono)); eg.addColorStop(1, k.mezColor("#14060f", "#1e0818", b.tono));
  g.fillStyle = eg; g.fillRect(x, y0, w, h);
  g.fillStyle = "rgba(255,120,90,0.25)"; g.fillRect(x, y0, w, 6);
  const az = azar(b.sem);
  for (let yy = y0 + 40; yy < SUELO - 60; yy += 70) for (let xx = x + 26; xx < x + w - 40; xx += 62) {
    const on = az() < 0.35;
    g.fillStyle = on ? "rgba(255,190,110,0.9)" : "rgba(10,4,12,0.8)"; g.fillRect(xx, yy, 34, 42);
    if (on) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, xx + 17, yy + 21, 70, "255,170,90", 0.25); g.restore(); }
  }
  g.save(); g.beginPath(); g.rect(x, y0, w, h); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha *= 0.35; g.drawImage(k.red2, x, y0, w, h); g.restore();
}
function farola(g, x) {
  g.fillStyle = "#1a0a14"; g.fillRect(x - 7, SUELO - 520, 14, 520);
  g.beginPath(); g.moveTo(x, SUELO - 520); g.quadraticCurveTo(x + 10, SUELO - 560, x + 60, SUELO - 555); g.lineWidth = 12; g.strokeStyle = "#1a0a14"; g.stroke();
  g.fillStyle = "#ffd6a0"; g.beginPath(); g.ellipse(x + 64, SUELO - 545, 22, 9, 0, 0, TAU); g.fill();
  g.save(); g.globalCompositeOperation = "lighter";
  k.brillo(g, x + 64, SUELO - 540, 260, "255,170,90", 0.55);
  const cg = g.createLinearGradient(0, SUELO - 540, 0, SUELO); cg.addColorStop(0, "rgba(255,180,110,0.22)"); cg.addColorStop(1, "rgba(255,180,110,0)");
  g.fillStyle = cg; g.beginPath(); g.moveTo(x + 50, SUELO - 540); g.lineTo(x + 78, SUELO - 540); g.lineTo(x + 200, SUELO); g.lineTo(x - 70, SUELO); g.closePath(); g.fill();
  g.restore();
}
// El fondo de la calle: av = lo que ha corrido (px de la capa cercana). grieta: 0-1, el suelo que se rompe bajo xg.
export function fondoCalle(g, t, av, { grieta = 0, xg = 150 } = {}) {
  const sg = g.createLinearGradient(0, -RS, 0, SUELO);
  sg.addColorStop(0, "#0a0210"); sg.addColorStop(0.55, "#3a0818"); sg.addColorStop(1, "#8a1a1a");
  g.fillStyle = sg; g.fillRect(-RS, -RS, 2 * RS, RS + SUELO);
  k.brillo(g, -260, -420, 620, "255,60,60", 0.35);
  g.fillStyle = "#e8d0d0"; g.beginPath(); g.arc(-260, -420, 85, 0, TAU); g.fill(); // la luna, pálida
  g.fillStyle = "rgba(60,0,10,0.5)"; g.beginPath(); g.arc(-235, -432, 80, 0, TAU); g.fill();
  for (const b of LEJOS) { const x = rep(b.x - av * 0.25, W_L); g.fillStyle = "#1a0614"; g.fillRect(x, SUELO - b.h, b.w, b.h); }
  for (const b of CERCA) { const x = rep(b.x - av * 0.6, W_C); if (x > -RS - 400 && x < RS) edificio(g, x, b.w, b.h, b); }
  // la acera y la calle, mojadas
  const ag = g.createLinearGradient(0, SUELO, 0, RS);
  ag.addColorStop(0, "#3a1a26"); ag.addColorStop(0.15, "#1e0a14"); ag.addColorStop(1, "#08020a");
  g.fillStyle = ag; g.fillRect(-RS, SUELO, 2 * RS, RS - SUELO);
  g.fillStyle = "rgba(255,150,120,0.35)"; g.fillRect(-RS, SUELO, 2 * RS, 5);
  g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = "rgba(255,150,90,0.12)";
  for (let x = rep(-av, 240) - RS; x < RS; x += 240) g.fillRect(x, SUELO + 40, 110, 8);
  g.restore();
  for (let i = -3; i <= 3; i++) farola(g, rep(i * W_F / 2 - av, W_F * 3.5));
  if (grieta > 0) grietaSuelo(g, xg, grieta);
}
// el suelo que se abre: un agujero negro con el borde roto que crece
function grietaSuelo(g, x, u) {
  const w = 380 * su(Math.min(1, u * 1.4));
  const az = azar(17);
  g.save();
  g.beginPath(); g.moveTo(x - w, SUELO);
  for (let i = 1; i < 10; i++) g.lineTo(x - w + (2 * w * i) / 10, SUELO + (az() - 0.5) * 30 * u);
  g.lineTo(x + w, SUELO); g.lineTo(x + w * 0.8, RS); g.lineTo(x - w * 0.8, RS); g.closePath();
  const hg = g.createLinearGradient(0, SUELO, 0, SUELO + 500); hg.addColorStop(0, "#000"); hg.addColorStop(1, "#120208");
  g.fillStyle = hg; g.fill();
  g.strokeStyle = "rgba(255,120,80,0.6)"; g.lineWidth = 4; g.stroke();
  g.restore();
}
// La sombra que persigue: una figura de humo enorme con ojos rojos, de pie en (x, SUELO), de alto h. cerca: 0-1.
export function sombra(g, x, h, t, al = 1) {
  if (al <= 0.01) return;
  g.save(); g.globalAlpha *= al; g.translate(x, SUELO);
  const az = azar(5);
  for (let i = 0; i < 26; i++) {
    const yy = -h * (i / 26), ww = h * (0.18 + 0.12 * Math.sin((i / 26) * Math.PI)) * (i > 20 ? 0.75 : 1), off = Math.sin(t * 2.2 + i * 0.5) * h * 0.03;
    const gr = g.createRadialGradient(off, yy, 0, off, yy, ww);
    gr.addColorStop(0, "rgba(6,0,6,0.9)"); gr.addColorStop(0.7, "rgba(10,0,10,0.6)"); gr.addColorStop(1, "rgba(10,0,10,0)");
    g.fillStyle = gr; g.beginPath(); g.arc(off, yy, ww, 0, TAU); g.fill();
  }
  // los brazos que se estiran hacia delante
  for (const [dy, fase] of [[-0.62, 0], [-0.55, 1.3]]) {
    g.strokeStyle = "rgba(8,0,8,0.85)"; g.lineWidth = h * 0.06; g.lineCap = "round";
    g.beginPath(); g.moveTo(0, h * dy); g.quadraticCurveTo(h * 0.25, h * (dy - 0.05 + 0.03 * Math.sin(t * 3 + fase)), h * 0.42, h * (dy + 0.02 + 0.04 * Math.sin(t * 2.4 + fase))); g.stroke();
  }
  // los ojos
  for (const dx of [0.02, 0.1]) { k.brillo(g, h * dx, -h * 0.86, h * 0.12, "255,40,40", 0.9); g.fillStyle = "#ffd0c0"; g.beginPath(); g.ellipse(h * dx, -h * 0.86, h * 0.022, h * 0.012, -0.2, 0, TAU); g.fill(); }
  g.restore();
}
// La pesadilla entera, pequeña (para la burbuja): él corre y la sombra le sigue.
export function calle(g, t) {
  const av = t * 520;
  fondoCalle(g, t, av);
  sombra(g, -330, 1050, t);
  corredor(g, 160, SUELO, 520, t * 1.9, { miedo: 1 });
}

// ---------------------------------------------------------------- el sueño en calma: cielo azul y agua quieta
const azN = azar(818);
const NUBES = Array.from({ length: 8 }, () => ({ x: (azN() - 0.5) * 2000, y: -700 + azN() * 700, w: 300 + azN() * 400 }));
export function calma(g, t, { sol = 0.6 } = {}) {
  const sg = g.createLinearGradient(0, -RS, 0, 200);
  sg.addColorStop(0, "#1a5ab8"); sg.addColorStop(0.6, "#5ab0f0"); sg.addColorStop(1, "#c8ecff");
  g.fillStyle = sg; g.fillRect(-RS, -RS, 2 * RS, RS + 200);
  k.brillo(g, 120, -150, 900 * sol + 300, "255,240,200", 0.7);
  g.fillStyle = "#fff8e0"; g.beginPath(); g.arc(120, -150, 95, 0, TAU); g.fill();
  for (const n of NUBES) {
    const x = n.x + t * 12;
    for (let i = 0; i < 6; i++) { const cx = x + (i - 2.5) * n.w * 0.16, cy = n.y - Math.sin((i / 5) * Math.PI) * n.w * 0.14, r = n.w * (0.2 + 0.08 * Math.sin(i * 2.1)); const gr = g.createRadialGradient(cx, cy - r * 0.3, 0, cx, cy, r); gr.addColorStop(0, "rgba(255,255,255,0.95)"); gr.addColorStop(1, "rgba(220,240,255,0)"); g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.fill(); }
  }
  // el agua, con el reflejo del sol
  const ag = g.createLinearGradient(0, 200, 0, RS); ag.addColorStop(0, "#7ac8f0"); ag.addColorStop(1, "#0a4a8a");
  g.fillStyle = ag; g.fillRect(-RS, 200, 2 * RS, RS);
  g.save(); g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 18; i++) { const y = 215 + i * i * 2.6, w = 30 + i * 9, x = 120 + Math.sin(t * 1.5 + i) * 10; g.fillStyle = `rgba(255,245,210,${0.5 - i * 0.025})`; g.fillRect(x - w, y, 2 * w, 3 + i * 0.4); }
  g.restore();
}
