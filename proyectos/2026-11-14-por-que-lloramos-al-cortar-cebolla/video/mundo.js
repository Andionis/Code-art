// Lo que comparten los planos de este vídeo: la cocina, la tabla, la cebolla (entera y en mitades), el cuchillo, las
// lágrimas y el gas verde (lo único de ese color en todo el vídeo).
import * as k from "#kit";

const { mez, suave: su, tramo: tr } = k;
export const GAS = "170,255,80";

// La vista: una cámara 2D. (cx, cy) es el punto del mundo que queda en el centro de la pantalla; z, el zoom.
export function vista(g, cx, cy, z) { g.translate(540, 960); g.scale(z, z); g.translate(-cx, -cy); }

// ---------- La cocina, de fondo: pared de azulejos desenfocada, luz cálida y unas luces de fondo ----------
const azF = k.azar(77);
const BOKEH = Array.from({ length: 16 }, () => ({ x: azF() * 1500 - 210, y: 150 + azF() * 750, r: 40 + azF() * 90, c: azF() < 0.6 ? "255,190,120" : "255,230,190", a: 0.12 + azF() * 0.2 }));
const PARED = (() => {
  const l = k.lienzo(1500, 1100), c = l.getContext("2d");
  const gr = c.createRadialGradient(420, 300, 50, 600, 500, 1100);
  gr.addColorStop(0, "#5b3c25"); gr.addColorStop(0.5, "#2c1d14"); gr.addColorStop(1, "#130d09");
  c.fillStyle = gr; c.fillRect(0, 0, 1500, 1100);
  // azulejos, muy suaves (desenfocados)
  c.filter = "blur(6px)";
  for (let y = -40; y < 1100; y += 150) for (let x = -40; x < 1500; x += 150) {
    k.redondo(c, x + 8, y + 8, 134, 134, 14);
    const tg = c.createLinearGradient(x, y, x + 150, y + 150);
    tg.addColorStop(0, "rgba(255,230,200,0.10)"); tg.addColorStop(1, "rgba(0,0,0,0.12)");
    c.fillStyle = tg; c.fill();
  }
  c.filter = "none";
  return k.fijar(l);
})();
export function cocina(g, t, cal = 1) {
  g.drawImage(PARED, -210, -100);
  const eg = g.createLinearGradient(0, 960, 0, 2400);
  eg.addColorStop(0, "#1c120c"); eg.addColorStop(0.1, "#3a2618"); eg.addColorStop(1, "#140c08");
  g.fillStyle = eg; g.fillRect(-400, 960, 1880, 1500);
  g.fillStyle = "rgba(255,200,150,0.25)"; g.fillRect(-400, 960, 1880, 4);
  for (const b of BOKEH) {
    g.save(); g.globalCompositeOperation = "lighter";
    const bg = g.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
    bg.addColorStop(0, `rgba(${b.c},${b.a * cal})`); bg.addColorStop(0.7, `rgba(${b.c},${b.a * 0.6 * cal})`); bg.addColorStop(1, `rgba(${b.c},0)`);
    g.fillStyle = bg; g.beginPath(); g.arc(b.x, b.y, b.r, 0, 6.283); g.fill(); g.restore();
  }
}

// ---------- La tabla de cortar, de madera, en perspectiva ----------
const VETAS = (() => {
  const l = k.lienzo(1600, 800), c = l.getContext("2d"), az = k.azar(5);
  const gr = c.createLinearGradient(0, 0, 0, 800);
  gr.addColorStop(0, "#b77a45"); gr.addColorStop(1, "#d89a5c");
  c.fillStyle = gr; c.fillRect(0, 0, 1600, 800);
  for (let i = 0; i < 110; i++) {
    const y0 = az() * 800, amp = 4 + az() * 14, fr = 0.002 + az() * 0.006, ph = az() * 6;
    c.strokeStyle = `rgba(${az() < 0.5 ? "110,60,25" : "240,190,130"},${0.12 + az() * 0.25})`; c.lineWidth = 1 + az() * 3.5;
    c.beginPath();
    for (let x = 0; x <= 1600; x += 20) { const y = y0 + Math.sin(x * fr + ph) * amp + Math.sin(x * fr * 3.1 + ph) * amp * 0.3; x ? c.lineTo(x, y) : c.moveTo(x, y); }
    c.stroke();
  }
  // un nudo
  c.strokeStyle = "rgba(100,55,20,0.35)"; c.lineWidth = 3;
  for (let r = 8; r < 60; r += 9) { c.beginPath(); c.ellipse(1150, 420, r * 2.2, r, 0.05, 0, 6.2); c.stroke(); }
  return k.fijar(l);
})();
export const TABLA = { yF: 1060, yN: 1760, xF: 470, xN: 760 }; // borde de atrás, borde de delante, medio ancho atrás/delante
export function tabla(g) {
  const { yF, yN, xF, xN } = TABLA;
  const path = () => { g.beginPath(); g.moveTo(540 - xF, yF); g.lineTo(540 + xF, yF); g.lineTo(540 + xN, yN); g.lineTo(540 - xN, yN); g.closePath(); };
  // el canto de delante
  g.fillStyle = "#7a4a24"; g.beginPath(); g.moveTo(540 - xN, yN); g.lineTo(540 + xN, yN); g.lineTo(540 + xN, yN + 70); g.lineTo(540 - xN, yN + 70); g.fill();
  const cg = g.createLinearGradient(0, yN, 0, yN + 70); cg.addColorStop(0, "rgba(255,200,140,0.35)"); cg.addColorStop(1, "rgba(0,0,0,0.4)");
  g.fillStyle = cg; g.fillRect(540 - xN, yN, 2 * xN, 70);
  // la cara de arriba con sus vetas
  g.save(); path(); g.clip();
  g.drawImage(VETAS, 540 - xN - 40, yF, 2 * xN + 80, yN - yF);
  const lg = g.createLinearGradient(0, yF, 0, yN);
  lg.addColorStop(0, "rgba(40,20,8,0.55)"); lg.addColorStop(0.35, "rgba(0,0,0,0)"); lg.addColorStop(1, "rgba(30,15,5,0.25)");
  g.fillStyle = lg; g.fillRect(0, yF, 1080, yN - yF);
  const sg = g.createRadialGradient(330, 1200, 20, 330, 1200, 700);
  sg.addColorStop(0, "rgba(255,220,170,0.28)"); sg.addColorStop(1, "rgba(255,220,170,0)");
  g.fillStyle = sg; g.fillRect(0, yF, 1080, yN - yF);
  g.restore();
  g.strokeStyle = "rgba(255,210,160,0.45)"; g.lineWidth = 3; g.beginPath(); g.moveTo(540 - xN, yN); g.lineTo(540 + xN, yN); g.stroke();
}

// ---------- La cebolla ----------
// En coordenadas propias: radio 1 de ancho; la punta arriba en y = -1.3, la base en y = 0.85.
function siluetaD(g, sx = 1) { // el lado derecho, de la punta a la base
  g.bezierCurveTo(0.12 * sx, -1.05, 0.55 * sx, -0.8, 0.86 * sx, -0.35);
  g.bezierCurveTo(1.08 * sx, 0.0, 1.05 * sx, 0.5, 0.72 * sx, 0.74);
  g.bezierCurveTo(0.5 * sx, 0.9, 0.2 * sx, 0.9, 0, 0.88);
}
function siluetaI(g, sx = 1) { // el izquierdo, de la base a la punta
  g.bezierCurveTo(-0.2 * sx, 0.9, -0.5 * sx, 0.9, -0.72 * sx, 0.74);
  g.bezierCurveTo(-1.05 * sx, 0.5, -1.08 * sx, 0.0, -0.86 * sx, -0.35);
  g.bezierCurveTo(-0.55 * sx, -0.8, -0.12 * sx, -1.05, 0, -1.3);
}
function silueta(g, sx = 1) { g.beginPath(); g.moveTo(0, -1.3); siluetaD(g, sx); siluetaI(g, sx); g.closePath(); }

function piel(g, frio = 0) {
  const gr = g.createRadialGradient(-0.4, -0.35, 0.05, -0.1, 0.05, 1.25);
  gr.addColorStop(0, "#ffd58a"); gr.addColorStop(0.35, "#e39a45"); gr.addColorStop(0.75, "#a85a22"); gr.addColorStop(1, "#4f2510");
  g.fillStyle = gr; g.fill();
  if (frio > 0) { g.save(); g.globalAlpha *= frio * 0.75; const fg = g.createRadialGradient(-0.3, -0.3, 0.05, 0, 0, 1.2); fg.addColorStop(0, "#f4fbff"); fg.addColorStop(1, "#9fc4e6"); g.fillStyle = fg; g.fill(); g.restore(); }
}
function vetas(g, sx, ancho) { // las líneas de la piel, de la punta a la base
  g.save(); g.clip();
  for (let i = -6; i <= 6; i++) {
    const f = i / 6.5;
    g.strokeStyle = i % 2 ? "rgba(90,40,12,0.38)" : "rgba(255,210,140,0.22)"; g.lineWidth = ancho * (i % 2 ? 0.018 : 0.012);
    g.beginPath(); g.moveTo(0, -1.28); g.bezierCurveTo(f * 0.8 * sx, -0.9, f * 1.25 * sx, 0.1, f * 0.55 * sx, 0.87); g.stroke();
  }
  g.restore();
}
const brillo3 = (g, al = 1) => {
  g.save(); g.globalCompositeOperation = "screen"; g.globalAlpha *= al;
  const hg = g.createRadialGradient(-0.45, -0.4, 0, -0.45, -0.4, 0.45);
  hg.addColorStop(0, "rgba(255,245,220,0.75)"); hg.addColorStop(1, "rgba(255,245,220,0)");
  g.fillStyle = hg; g.beginPath(); g.ellipse(-0.45, -0.4, 0.3, 0.42, -0.5, 0, 6.283); g.fill(); g.restore();
};
function puntaYRaices(g) {
  // la punta seca, retorcida
  g.fillStyle = "#8a5426"; g.beginPath(); g.moveTo(-0.05, -1.24); g.quadraticCurveTo(-0.02, -1.45, 0.08, -1.58); g.quadraticCurveTo(0.03, -1.42, 0.06, -1.24); g.fill();
  g.strokeStyle = "rgba(60,30,10,0.6)"; g.lineWidth = 0.012; g.stroke();
  // las raíces
  g.strokeStyle = "rgba(225,200,160,0.85)"; g.lineWidth = 0.014; g.lineCap = "round";
  for (let i = 0; i < 11; i++) { const x = -0.16 + i * 0.032, a = (i - 5) * 0.18; g.beginPath(); g.moveTo(x, 0.86); g.quadraticCurveTo(x + a * 0.15, 0.95, x + a * 0.2, 1.0 + (i % 3) * 0.02); g.stroke(); }
}

// La cebolla entera en (x, y) (su centro), de radio s px.
export function cebolla(g, x, y, s, op = {}) {
  g.save(); g.translate(x, y); g.scale(s, s); if (op.ang) g.rotate(op.ang);
  puntaYRaices(g);
  silueta(g); piel(g, op.frio || 0);
  silueta(g); vetas(g, 1, 1);
  brillo3(g);
  // borde de luz por la derecha
  silueta(g); g.save(); g.clip(); g.strokeStyle = "rgba(255,190,110,0.5)"; g.lineWidth = 0.05; g.translate(0.03, 0); silueta(g); g.stroke(); g.restore();
  if (op.frio) escarcha(g, op.frio, 1);
  g.restore();
}

// La cara cortada: anillos concéntricos, húmedos y brillantes. En coordenadas de la cebolla, aplastada en x por sx.
function anillos(g, sx, brillo = 1, frio = 0) {
  silueta(g, sx);
  const fg = g.createRadialGradient(0, 0.1, 0.02, 0, 0.1, 1.15);
  fg.addColorStop(0, "#fffbe6"); fg.addColorStop(0.45, "#f3efc4"); fg.addColorStop(0.85, "#e2e2a0"); fg.addColorStop(1, "#c9b27a");
  g.fillStyle = fg; g.fill();
  g.save(); silueta(g, sx); g.clip();
  for (let i = 1; i <= 8; i++) {
    const e = 1 - i * 0.11;
    g.save(); g.translate(0, 0.12 * (1 - e)); g.scale(e, e);
    silueta(g, sx);
    g.strokeStyle = "rgba(150,165,80,0.7)"; g.lineWidth = 0.04 / e; g.stroke();
    g.strokeStyle = "rgba(255,255,255,0.7)"; g.lineWidth = 0.012 / e; g.translate(-0.012, -0.012); silueta(g, sx); g.stroke();
    g.restore();
  }
  // el centro
  g.fillStyle = "rgba(200,220,140,0.9)"; g.beginPath(); g.ellipse(0, 0.08, 0.06 * sx, 0.12, 0, 0, 6.283); g.fill();
  // la piel, en el borde
  silueta(g, sx); g.strokeStyle = "#a4561f"; g.lineWidth = 0.09; g.stroke();
  silueta(g, sx); g.strokeStyle = "rgba(230,140,60,0.8)"; g.lineWidth = 0.03; g.stroke();
  const sombra = g.createRadialGradient(0, 0.1, 0.4, 0, 0.1, 1.2); sombra.addColorStop(0, "rgba(90,70,20,0)"); sombra.addColorStop(1, "rgba(90,70,20,0.35)"); g.fillStyle = sombra; silueta(g, sx); g.fill();
  // mojada: el reflejo
  g.globalCompositeOperation = "screen";
  const rg = g.createLinearGradient(-0.6 * sx, -0.8, 0.4 * sx, 0.4);
  rg.addColorStop(0, `rgba(255,255,255,${0.55 * brillo})`); rg.addColorStop(0.45, "rgba(255,255,255,0)");
  g.fillStyle = rg; g.fillRect(-1.2, -1.4, 2.4, 2.4);
  g.restore();
  if (frio) { g.save(); silueta(g, sx); g.clip(); g.globalAlpha *= frio * 0.5; g.fillStyle = "#d6ecff"; g.fill(); g.restore(); }
}

// Media cebolla. lado: -1 la izquierda, 1 la derecha. gira: 0 (recién cortada, la cara de lado) a 1 (la cara de frente).
export function mitad(g, x, y, s, lado, gira, op = {}) {
  const a = gira * 0.9, sa = Math.sin(a), ca = Math.cos(a);
  g.save(); g.translate(x, y); g.scale(s, s); if (op.ang) g.rotate(op.ang);
  // la cúpula de piel: la mitad de la silueta, aplastada por el giro, detrás de la cara
  g.save(); g.scale(lado, 1);
  g.beginPath(); g.moveTo(0, -1.3); siluetaD(g, 1); g.closePath();
  piel(g, op.frio || 0);
  g.beginPath(); g.moveTo(0, -1.3); siluetaD(g, 1); g.closePath(); vetas(g, 1, 1);
  g.restore();
  // la cara cortada, mirando hacia el centro
  if (sa > 0.02) { g.save(); g.translate(-lado * 0.2 * sa, 0); anillos(g, sa * 0.82, op.brillo ?? 1, op.frio || 0); g.restore(); }
  if (op.frio) escarcha(g, op.frio, sa);
  g.restore();
}

// La escarcha: cristalitos blancos sobre la cebolla (en sus coordenadas).
const azE = k.azar(31);
const CRIST = Array.from({ length: 120 }, () => ({ x: (azE() - 0.5) * 1.9, y: -1.1 + azE() * 1.95, r: 0.015 + azE() * 0.035, a: azE() * 3, u: azE() }));
function escarcha(g, f, sx) {
  g.save(); silueta(g, Math.max(0.3, sx)); g.clip();
  g.strokeStyle = "rgba(240,250,255,0.9)"; g.lineWidth = 0.008; g.lineCap = "round";
  for (const c of CRIST) {
    if (c.u > f) continue;
    g.save(); g.translate(c.x * Math.max(0.3, sx), c.y); g.rotate(c.a);
    for (let i = 0; i < 3; i++) { g.rotate(Math.PI / 3); g.beginPath(); g.moveTo(-c.r, 0); g.lineTo(c.r, 0); g.stroke(); }
    g.restore();
  }
  g.restore();
}

// ---------- El cuchillo de cocina, de lado: la hoja apunta a la izquierda, el filo abajo ----------
// (x, y): el punto del filo bajo el talón; s: escala (1 = hoja de 900 px).
export function cuchillo(g, x, y, s = 1, ang = 0) {
  g.save(); g.translate(x, y); g.rotate(ang); g.scale(s, s);
  // la hoja
  g.beginPath(); g.moveTo(80, 0); g.lineTo(-560, 0); g.quadraticCurveTo(-820, -20, -900, -150); g.lineTo(-560, -210); g.lineTo(80, -215); g.closePath();
  const hg = g.createLinearGradient(0, -215, 0, 0);
  hg.addColorStop(0, "#5f6670"); hg.addColorStop(0.12, "#dfe5ec"); hg.addColorStop(0.45, "#9aa4b0"); hg.addColorStop(0.7, "#eef2f6"); hg.addColorStop(0.86, "#b8c1cc"); hg.addColorStop(1, "#ffffff");
  g.fillStyle = hg; g.fill();
  g.save(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha *= 0.08; g.drawImage(k.red2, -900, -220, 1000, 240); g.restore();
  // el bisel del filo
  g.fillStyle = "rgba(255,255,255,0.55)"; g.beginPath(); g.moveTo(80, -2); g.lineTo(-560, -2); g.quadraticCurveTo(-815, -22, -895, -150); g.lineTo(-870, -150); g.quadraticCurveTo(-790, -45, -560, -34); g.lineTo(80, -34); g.closePath(); g.fill();
  // un destello
  g.save(); g.globalCompositeOperation = "screen";
  const dg = g.createLinearGradient(-500, 0, -200, 0); dg.addColorStop(0, "rgba(255,255,255,0)"); dg.addColorStop(0.5, "rgba(255,255,255,0.6)"); dg.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = dg; g.fillRect(-520, -205, 340, 200); g.restore();
  g.strokeStyle = "rgba(40,45,55,0.6)"; g.lineWidth = 3; g.beginPath(); g.moveTo(80, -215); g.lineTo(-560, -210); g.lineTo(-900, -150); g.stroke();
  // el mango negro con sus remaches
  k.redondo(g, 70, -190, 400, 130, 50);
  const mg = g.createLinearGradient(0, -190, 0, -60);
  mg.addColorStop(0, "#3b3530"); mg.addColorStop(0.3, "#1a1715"); mg.addColorStop(1, "#090807");
  g.fillStyle = mg; g.fill();
  k.reflejo(g, 110, -178, 320, 14, 0.25);
  for (const rx of [150, 270, 390]) { g.beginPath(); g.arc(rx, -125, 13, 0, 6.283); k.metal(g, rx - 13, rx + 13); }
  g.restore();
}

// ---------- Una lágrima: una gota de agua brillante. (x, y) el centro de la parte redonda; r el radio; estira: 1 a 2 ----------
export function lagrima(g, x, y, r, estira = 1.4, al = 1) {
  if (al <= 0.01) return;
  g.save(); g.translate(x, y); g.globalAlpha *= al;
  const h = r * estira * 1.6;
  const path = () => { g.beginPath(); g.moveTo(0, -r - h); g.bezierCurveTo(r * 0.25, -r - h * 0.5, r, -r * 0.6, r, 0); g.arc(0, 0, r, 0, Math.PI); g.bezierCurveTo(-r, -r * 0.6, -r * 0.25, -r - h * 0.5, 0, -r - h); g.closePath(); };
  path();
  const gr = g.createRadialGradient(-r * 0.2, r * 0.2, r * 0.1, 0, 0, r * 1.6);
  gr.addColorStop(0, "rgba(220,240,255,0.55)"); gr.addColorStop(0.6, "rgba(120,180,240,0.45)"); gr.addColorStop(1, "rgba(40,90,170,0.75)");
  g.fillStyle = gr; g.fill();
  g.strokeStyle = "rgba(230,245,255,0.8)"; g.lineWidth = Math.max(1.5, r * 0.06); g.stroke();
  // el brillo
  g.fillStyle = "rgba(255,255,255,0.92)"; g.beginPath(); g.ellipse(-r * 0.38, -r * 0.3, r * 0.16, r * 0.32, 0.4, 0, 6.283); g.fill();
  g.fillStyle = "rgba(255,255,255,0.6)"; g.beginPath(); g.arc(r * 0.35, r * 0.45, r * 0.09, 0, 6.283); g.fill();
  g.restore();
}

// El golpe de una gota en la tabla: una corona de gotitas que se abre y cae (u: segundos desde que llega).
export function salpica(g, x, y, r, u, semilla = 1) {
  if (u < 0 || u > 0.7) return;
  const az = k.azar(semilla), n = 12;
  g.save();
  const e = k.entra(Math.min(1, u / 0.35)), f = 1 - tr(u, 0.35, 0.7);
  g.globalAlpha *= f;
  g.strokeStyle = "rgba(200,230,255,0.7)"; g.lineWidth = 4;
  g.beginPath(); g.ellipse(x, y, r * (0.8 + 2.4 * e), r * (0.25 + 0.7 * e), 0, 0, 6.283); g.stroke();
  for (let i = 0; i < n; i++) {
    const a = Math.PI + (i + az() * 0.6) / n * Math.PI, v = 0.8 + az() * 0.8;
    const dx = Math.cos(a) * r * 3.2 * v * u / 0.35, dy = -Math.abs(Math.sin(a)) * r * 5 * v * u + 1400 * u * u * (r / 40);
    lagrima(g, x + dx * 0.9, y + dy * 0.6, r * (0.16 + az() * 0.12), 0.6, 0.9);
  }
  g.restore();
}

// ---------- El gas: hilos verdes que suben y se enroscan ----------
// Un hilo que nace en (x0, y0) en el segundo t0 y sube durante dur; ancho w; deriva dx (px, hacia dónde se va).
const azG = k.azar(91);
export function hilo(g, t, x0, y0, t0, dur, w = 60, dx = 0, alto = 700, al = 1, semilla = 1, modo = "screen") {
  const u = (t - t0) / dur; if (u <= 0) return;
  const fase = semilla * 1.7;
  g.save(); g.globalCompositeOperation = modo;
  const N = 26;
  for (let i = 0; i < N; i++) {
    const q = i / N; // a lo largo del hilo (0 = la cabeza, 1 = la cola)
    const p = u - q * 0.8; if (p < 0 || p > 1.6) continue;
    const yy = y0 - alto * p;
    const xx = x0 + dx * p + Math.sin(p * 5 + fase + t * 2) * w * 0.9 * p;
    const ww = w * (0.5 + p * 1.2);
    const a = al * 0.42 * Math.min(1, p * 4) * (1 - tr(p, 0.6, 1.3)) * (1 - q * 0.5);
    if (a <= 0.003) continue;
    const gr = g.createRadialGradient(xx, yy, 0, xx, yy, ww);
    gr.addColorStop(0, `rgba(${GAS},${a})`); gr.addColorStop(0.5, `rgba(${GAS},${a * 0.45})`); gr.addColorStop(1, `rgba(${GAS},0)`);
    g.fillStyle = gr; g.beginPath(); g.arc(xx, yy, ww, 0, 6.283); g.fill();
  }
  g.restore();
}

// Una nube de gas que llena la pantalla (u: 0..1 de fuerza).
export function nubeGas(g, t, u, cx = 540, cy = 960) {
  if (u <= 0.003) return;
  g.save(); g.globalCompositeOperation = "source-over";
  for (let i = 0; i < 9; i++) {
    const a = i * 0.7 + t * 0.6, r = 260 + i * 80;
    const x = cx + Math.cos(a) * 160 * (i % 3), y = cy + Math.sin(a * 1.3) * 200 * (i % 3);
    const gr = g.createRadialGradient(x, y, 0, x, y, r * (0.6 + u));
    gr.addColorStop(0, `rgba(80,180,30,${0.09 * u})`); gr.addColorStop(1, `rgba(80,180,30,0)`);
    g.fillStyle = gr; g.fillRect(0, 0, 1080, 1920);
  }
  g.restore();
}

// El velo de arriba, detrás del subtítulo, cuando el fondo es claro.
export function velo(g, al = 0.4) {
  const vg = g.createLinearGradient(0, 230, 0, 600);
  vg.addColorStop(0, `rgba(0,0,0,0)`); vg.addColorStop(0.3, `rgba(0,0,0,${al})`); vg.addColorStop(0.7, `rgba(0,0,0,${al})`); vg.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = vg; g.fillRect(0, 230, 1080, 370);
}

// Un chorro de gas que sale de (x, y) hacia la cámara en el segundo t0: bocanadas que crecen y se abren.
const CHORRO = Array.from({ length: 60 }, (_, i) => ({ d: i / 36 * 0.35, a: azG() * 6.283, v: 0.3 + azG() * 0.9, r: 0.7 + azG() * 0.6 }));
export function chorro(g, t, x, y, t0, al = 1) {
  const u0 = t - t0; if (u0 < 0 || u0 > 1.6) return;
  g.save();
  for (const b of CHORRO) {
    const u = u0 - b.d; if (u < 0) continue;
    const e = k.entra(Math.min(1, u / 0.7));
    const xx = x + Math.cos(b.a) * 700 * b.v * e, yy = y - 350 * e + Math.sin(b.a) * 800 * b.v * e;
    const R = (60 + 380 * e) * b.r, a = al * 0.26 * (1 - tr(u, 0.3, 1.0));
    if (a <= 0.003) continue;
    const gr = g.createRadialGradient(xx, yy, 0, xx, yy, R);
    gr.addColorStop(0, `rgba(190,255,90,${a})`); gr.addColorStop(0.5, `rgba(110,210,40,${a * 0.6})`); gr.addColorStop(1, `rgba(60,150,20,0)`);
    g.fillStyle = gr; g.beginPath(); g.arc(xx, yy, R, 0, 6.283); g.fill();
  }
  g.restore();
}

// ---------- La mano que agarra el mango del cuchillo (en las coordenadas del cuchillo: mango de x 70 a 470) ----------
function piel2(g, x0, y0, x1, y1) {
  const gr = g.createLinearGradient(x0, y0, x1, y1);
  gr.addColorStop(0, "#ffd9b8"); gr.addColorStop(0.45, "#eab08a"); gr.addColorStop(1, "#a8664a");
  return gr;
}
export function manoCuchillo(g, x, y, s = 1, ang = 0) {
  g.save(); g.translate(x, y); g.rotate(ang); g.scale(s, s);
  // el antebrazo, que sale hacia la derecha, con su manga
  g.beginPath(); g.moveTo(330, -250); g.quadraticCurveTo(700, -270, 1100, -230); g.lineTo(1100, 40); g.quadraticCurveTo(700, 20, 360, -20); g.closePath();
  g.fillStyle = piel2(g, 0, -260, 0, 30); g.fill();
  g.beginPath(); g.moveTo(760, -275); g.lineTo(1150, -260); g.lineTo(1150, 60); g.lineTo(760, 40); g.closePath();
  const mg = g.createLinearGradient(0, -275, 0, 60); mg.addColorStop(0, "#5d7fd0"); mg.addColorStop(0.5, "#34539e"); mg.addColorStop(1, "#1b2c5a");
  g.fillStyle = mg; g.fill();
  g.strokeStyle = "rgba(255,255,255,0.25)"; g.lineWidth = 6; g.beginPath(); g.moveTo(762, -270); g.lineTo(762, 38); g.stroke();
  // el dorso de la mano, sobre el mango
  g.beginPath(); g.moveTo(150, -215); g.quadraticCurveTo(160, -275, 260, -280); g.quadraticCurveTo(380, -285, 420, -230); g.lineTo(420, -40); g.quadraticCurveTo(300, -10, 160, -50); g.closePath();
  g.fillStyle = piel2(g, 0, -285, 0, -20); g.fill();
  // los cuatro dedos, que rodean el mango por delante, de canto
  for (let i = 0; i < 4; i++) {
    const fx = 165 + i * 62, fy = -165 + i * 4;
    k.redondo(g, fx, fy, 60, 150 - i * 6, 28);
    g.fillStyle = piel2(g, fx, fy, fx + 60, fy + 150); g.fill();
    g.strokeStyle = "rgba(120,60,40,0.55)"; g.lineWidth = 3; g.stroke();
    // el nudillo del medio y su pliegue
    g.strokeStyle = "rgba(140,70,45,0.45)"; g.lineWidth = 2.5;
    g.beginPath(); g.moveTo(fx + 12, fy + 70); g.quadraticCurveTo(fx + 30, fy + 64, fx + 48, fy + 70); g.stroke();
    g.fillStyle = "rgba(255,240,225,0.45)"; g.beginPath(); g.ellipse(fx + 22, fy + 30, 10, 18, 0, 0, 6.283); g.fill();
  }
  // el pulgar, encima del mango, estirado hacia la hoja
  g.beginPath(); g.moveTo(240, -250); g.quadraticCurveTo(150, -262, 95, -232); g.quadraticCurveTo(70, -212, 100, -198); g.quadraticCurveTo(170, -196, 250, -200); g.closePath();
  g.fillStyle = piel2(g, 0, -265, 0, -195); g.fill();
  g.strokeStyle = "rgba(120,60,40,0.5)"; g.lineWidth = 3; g.stroke();
  g.fillStyle = "rgba(255,235,220,0.8)"; g.beginPath(); g.ellipse(108, -222, 16, 9, -0.2, 0, 6.283); g.fill(); // la uña
  g.restore();
}

// La otra mano, sujetando la cebolla por encima, con los dedos doblados (vista de lado, desde la izquierda).
export function manoSujeta(g, x, y, s = 1, al = 1) {
  if (al <= 0.01) return;
  g.save(); g.translate(x, y); g.scale(s, s); g.globalAlpha *= al;
  // el brazo, que llega desde la izquierda y arriba
  g.beginPath(); g.moveTo(-700, -520); g.lineTo(-260, -230); g.lineTo(-170, -80); g.lineTo(-640, -300); g.closePath();
  g.fillStyle = piel2(g, -700, -520, -500, -200); g.fill();
  g.beginPath(); g.moveTo(-900, -640); g.lineTo(-560, -430); g.lineTo(-500, -250); g.lineTo(-900, -420); g.closePath();
  const mg = g.createLinearGradient(-900, -640, -600, -300); mg.addColorStop(0, "#5d7fd0"); mg.addColorStop(1, "#1b2c5a"); g.fillStyle = mg; g.fill();
  // la palma, encima de la cebolla
  g.beginPath(); g.moveTo(-290, -250); g.quadraticCurveTo(-120, -300, 30, -220); g.quadraticCurveTo(80, -170, 60, -100); g.lineTo(-200, -60); g.quadraticCurveTo(-280, -120, -290, -250); g.closePath();
  g.fillStyle = piel2(g, -200, -300, -100, -60); g.fill();
  // los dedos doblados, apoyados en la cebolla
  for (let i = 0; i < 3; i++) {
    const fx = -40 + i * 18, fy = -150 + i * 40;
    g.beginPath(); g.ellipse(fx, fy, 75, 30, 0.5, 0, 6.283);
    g.fillStyle = piel2(g, fx - 70, fy - 30, fx + 70, fy + 30); g.fill();
    g.strokeStyle = "rgba(120,60,40,0.5)"; g.lineWidth = 3; g.stroke();
  }
  g.restore();
}
