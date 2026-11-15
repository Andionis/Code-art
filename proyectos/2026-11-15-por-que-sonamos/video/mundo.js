// Lo que comparten los planos: el sueño (un cielo violeta con islas flotantes, la luna y la ballena de luz), el cuarto
// de noche con alguien dormido, la burbuja del sueño y el cerebro de luz.
// Todo en 2D, en coordenadas del mundo (px con zoom 1); vista() pone la cámara.
import * as k from "#kit";

const { azar, mez, tramo: tr, suave: su } = k;
export const TAU = Math.PI * 2;

// ---------------------------------------------------------------- la cámara 2D
export function vista(g, Z, cx, cy, rot = 0) {
  const c = Math.cos(rot) * Z, s = Math.sin(rot) * Z;
  g.setTransform(c, s, -s, c, 540 - (c * cx - s * cy), 960 - (s * cx + c * cy));
}
export const sinVista = (g) => g.setTransform(1, 0, 0, 1, 0, 0);
export function camino2D(claves) {
  const Zs = k.claves(claves.map(([t, c]) => [t, Math.log(c[0])])), X = k.claves(claves.map(([t, c]) => [t, c[1]])), Y = k.claves(claves.map(([t, c]) => [t, c[2]]));
  return (t) => [Math.exp(Zs(t)), X(t), Y(t)];
}
export function velo(g, al) {
  if (al <= 0.01) return;
  g.save(); sinVista(g);
  const vg = g.createLinearGradient(0, 160, 0, 700);
  vg.addColorStop(0, `rgba(6,4,14,${al})`); vg.addColorStop(0.6, `rgba(6,4,14,${al * 0.7})`); vg.addColorStop(1, "rgba(6,4,14,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 700); g.restore();
}
export function vineta(g, al = 0.55) {
  g.save(); sinVista(g);
  const vg = g.createRadialGradient(540, 960, 500, 540, 960, 1250);
  vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, `rgba(0,0,0,${al})`);
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 1920); g.restore();
}

// ---------------------------------------------------------------- el sueño
// Se dibuja en coordenadas locales centradas en (0,0): a escala 1 llena la pantalla (±540 × ±960) y todo cabe en un
// círculo de radio RS. avance: lo que ha volado la cámara (en px de la capa más cercana).
export const RS = 1110;
const azS = azar(707);
const ESTRELLAS_S = Array.from({ length: 260 }, () => ({ x: (azS() - 0.5) * 2 * RS, y: (azS() - 0.5) * 2 * RS * 0.8 - 200, r: 0.8 + azS() * 2.4, a: 0.4 + azS() * 0.6 }));
// islas: profundidad p (1 = cerca, 0.25 = lejos); se ordenan de lejos a cerca
const ISLAS = (() => {
  const az = azar(313), l = [];
  for (let i = 0; i < 14; i++) {
    const p = 0.22 + az() * 0.9;
    l.push({ x0: az() * 3600, y: mez(-120, 520, az()) * (0.6 + p * 0.5) + (p > 0.8 ? 120 : 0), tam: 70 + p * 230 * (0.7 + az() * 0.6), p, sem: 1 + Math.floor(az() * 999), arbol: az() < 0.7, cascada: az() < 0.4 });
  }
  return l.sort((a, b) => a.p - b.p);
})();
const NUBES = (() => { const az = azar(91), l = []; for (let i = 0; i < 9; i++) l.push({ x0: az() * 3000, y: -100 + az() * 900, w: 380 + az() * 500, p: 0.15 + az() * 0.5 }); return l; })();

function cieloSueno(g) {
  const bg = g.createLinearGradient(0, -RS, 0, RS);
  bg.addColorStop(0, "#120a3a"); bg.addColorStop(0.35, "#3a1670"); bg.addColorStop(0.62, "#a03a8c"); bg.addColorStop(0.8, "#ff8a7a"); bg.addColorStop(1, "#ffc28a");
  g.fillStyle = bg; g.fillRect(-RS, -RS, 2 * RS, 2 * RS);
  g.save(); g.globalCompositeOperation = "screen"; g.globalAlpha *= 0.1; g.drawImage(k.manchas, -RS, -RS, 2 * RS, 2 * RS); g.restore();
  g.save(); g.globalCompositeOperation = "lighter";
  for (const s of ESTRELLAS_S) { if (s.y > 300) continue; g.fillStyle = `rgba(255,240,255,${s.a * 0.8})`; g.beginPath(); g.arc(s.x, s.y, s.r, 0, TAU); g.fill(); }
  g.restore();
}
function luna(g, x, y, r) {
  k.brillo(g, x, y, r * 4.2, "255,220,240", 0.55);
  const lg = g.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r);
  lg.addColorStop(0, "#fffaf0"); lg.addColorStop(0.7, "#f6e2ff"); lg.addColorStop(1, "#c9a8e8");
  g.fillStyle = lg; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
  g.save(); g.beginPath(); g.arc(x, y, r, 0, TAU); g.clip();
  g.globalCompositeOperation = "multiply"; g.globalAlpha *= 0.35; g.drawImage(k.manchas, x - r, y - r, 2 * r, 2 * r);
  g.globalAlpha /= 0.35; g.globalAlpha *= 0.22;
  const az = azar(5);
  for (let i = 0; i < 7; i++) { const a = az() * TAU, d = az() * r * 0.7, rr = r * (0.06 + az() * 0.12); g.fillStyle = "#8a6aa8"; g.beginPath(); g.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, rr, 0, TAU); g.fill(); }
  g.restore();
}
function nube(g, x, y, w, al) {
  g.save(); g.globalAlpha *= al;
  const az = azar(Math.floor(w));
  for (let i = 0; i < 7; i++) {
    const cx = x + (i / 6 - 0.5) * w, cy = y - Math.sin((i / 6) * Math.PI) * w * 0.12 + az() * 20, r = w * (0.14 + az() * 0.1);
    const gr = g.createRadialGradient(cx, cy - r * 0.3, 0, cx, cy, r);
    gr.addColorStop(0, "rgba(255,210,235,0.75)"); gr.addColorStop(0.7, "rgba(230,150,210,0.4)"); gr.addColorStop(1, "rgba(200,120,200,0)");
    g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.fill();
  }
  g.restore();
}
// Una isla flotante: roca colgando (luz de arriba-izquierda), césped arriba, un árbol y quizá una cascada.
const formasIsla = new Map();
function formaIsla(sem) {
  if (formasIsla.has(sem)) return formasIsla.get(sem);
  const az = azar(sem), pts = [];
  const n = 9;
  for (let i = 0; i <= n; i++) { const u = i / n; pts.push([mez(-1, 1, u), 0.1 + Math.sin(u * Math.PI) * (0.9 + az() * 0.6) * (0.75 + 0.25 * az())]); }
  const f = { pts, inclina: (az() - 0.5) * 0.2, arbolX: (az() - 0.5) * 0.8 };
  formasIsla.set(sem, f); return f;
}
export function isla(g, x, y, w, sem, t, { arbol = true, cascada = false, luz = 1 } = {}) {
  const f = formaIsla(sem), h = w * 0.55;
  g.save(); g.translate(x, y + Math.sin(t * 0.9 + sem) * w * 0.03);
  // la roca
  g.beginPath(); g.moveTo(-w, 0);
  for (const [px, py] of f.pts) g.lineTo(px * w, py * h);
  g.lineTo(w, 0); g.closePath();
  const rg = g.createLinearGradient(-w, 0, w * 0.6, h);
  rg.addColorStop(0, "#9a6a7e"); rg.addColorStop(0.45, "#5a3556"); rg.addColorStop(1, "#1e1030");
  g.fillStyle = rg; g.fill();
  g.save(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha *= 0.5; g.drawImage(k.red, -w, 0, 2 * w, h * 1.6); g.restore();
  // borde de luz rosa (la luz del horizonte, de abajo)
  g.save(); g.clip(); const bl = g.createLinearGradient(0, h * 0.5, 0, h * 1.3); bl.addColorStop(0, "rgba(255,140,150,0)"); bl.addColorStop(1, `rgba(255,150,140,${0.55 * luz})`); g.fillStyle = bl; g.fillRect(-w, 0, 2 * w, h * 1.6); g.restore();
  // el césped
  const cg = g.createLinearGradient(0, -h * 0.18, 0, h * 0.12);
  cg.addColorStop(0, "#9cf0a8"); cg.addColorStop(0.5, "#3fbf86"); cg.addColorStop(1, "#1d6a5e");
  g.fillStyle = cg; g.beginPath(); g.ellipse(0, 0, w * 1.02, h * 0.17, f.inclina, 0, TAU); g.fill();
  g.fillStyle = "rgba(255,255,255,0.25)"; g.beginPath(); g.ellipse(-w * 0.2, -h * 0.06, w * 0.6, h * 0.05, f.inclina, 0, TAU); g.fill();
  if (cascada) {
    const cx = w * 0.55, top = h * 0.05;
    const cgr = g.createLinearGradient(0, top, 0, top + h * 2.2);
    cgr.addColorStop(0, "rgba(170,240,255,0.9)"); cgr.addColorStop(1, "rgba(170,240,255,0)");
    g.fillStyle = cgr; g.fillRect(cx - w * 0.05, top, w * 0.1, h * 2.2);
    g.save(); g.globalCompositeOperation = "lighter";
    for (let i = 0; i < 4; i++) { const yy = top + (((t * 0.8 + i / 4) % 1) * h * 2); g.fillStyle = "rgba(220,255,255,0.35)"; g.fillRect(cx - w * 0.04, yy, w * 0.08, h * 0.12); }
    g.restore();
  }
  if (arbol) {
    const tx = f.arbolX * w, th = h * 0.9;
    g.fillStyle = "#4a2a3a"; g.beginPath(); g.moveTo(tx - w * 0.04, 0); g.lineTo(tx - w * 0.015, -th); g.lineTo(tx + w * 0.015, -th); g.lineTo(tx + w * 0.04, 0); g.fill();
    for (const [dx, dy, rr, c] of [[-0.12, -1.0, 0.24, "#e0569a"], [0.13, -1.05, 0.22, "#c43f88"], [0, -1.25, 0.26, "#ff7ab8"]]) {
      const lg = g.createRadialGradient(tx + dx * w - rr * w * 0.3, th * dy - rr * w * 0.4, 0, tx + dx * w, th * dy, rr * w);
      lg.addColorStop(0, "#ffc4e0"); lg.addColorStop(0.5, c); lg.addColorStop(1, "#5a1a4a");
      g.fillStyle = lg; g.beginPath(); g.arc(tx + dx * w, th * dy, rr * w, 0, TAU); g.fill();
    }
  }
  g.restore();
}
// La escalera flotante: bloques que suben en diagonal y se pierden en el cielo.
function escalera(g, x, y, esc, t) {
  for (let i = 0; i < 9; i++) {
    const bx = x + i * 70 * esc, by = y - i * 52 * esc + Math.sin(t * 1.2 + i * 0.6) * 6 * esc, w = 80 * esc, h = 26 * esc;
    const al = 1 - i / 11;
    g.save(); g.globalAlpha *= al;
    g.fillStyle = "#f6e8ff"; g.fillRect(bx, by, w, h * 0.35);
    const sg = g.createLinearGradient(0, by, 0, by + h); sg.addColorStop(0, "#b79ad6"); sg.addColorStop(1, "#4a2a6a");
    g.fillStyle = sg; g.fillRect(bx, by + h * 0.35, w, h * 0.65);
    g.restore();
  }
}
// La ballena de luz: de perfil, mirando a la izquierda, en (x, y), de largo L. aleta: fase de la cola.
export function ballena(g, x, y, L, t) {
  const H = L * 0.26, cola = Math.sin(t * 3) * 0.18;
  g.save(); g.translate(x, y);
  k.brillo(g, 0, 0, L * 1.3, "120,220,255", 0.45);
  g.beginPath();
  g.moveTo(-L * 0.5, H * 0.05);
  g.bezierCurveTo(-L * 0.5, -H * 0.55, -L * 0.15, -H * 0.62, L * 0.15, -H * 0.4);
  g.bezierCurveTo(L * 0.32, -H * 0.28, L * 0.42, -H * 0.08, L * 0.5, -H * 0.02);
  g.lineTo(L * 0.5, H * 0.08);
  g.bezierCurveTo(L * 0.35, H * 0.3, L * 0.05, H * 0.5, -L * 0.25, H * 0.42);
  g.bezierCurveTo(-L * 0.42, H * 0.38, -L * 0.5, H * 0.25, -L * 0.5, H * 0.05);
  const bg = g.createLinearGradient(0, -H * 0.6, 0, H * 0.5);
  bg.addColorStop(0, "rgba(90,200,255,0.95)"); bg.addColorStop(0.55, "rgba(40,110,220,0.92)"); bg.addColorStop(1, "rgba(150,240,255,0.95)");
  g.fillStyle = bg; g.fill();
  g.save(); g.clip();
  g.globalCompositeOperation = "screen"; g.globalAlpha *= 0.35; g.drawImage(k.manchas, -L * 0.5, -H, L, H * 2);
  g.globalAlpha /= 0.35;
  // los pliegues de la garganta
  g.strokeStyle = "rgba(220,250,255,0.5)"; g.lineWidth = L * 0.004;
  for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(-L * 0.45, H * (0.12 + i * 0.05)); g.quadraticCurveTo(-L * 0.15, H * (0.3 + i * 0.03), L * 0.1, H * (0.22 + i * 0.04)); g.stroke(); }
  g.restore();
  // la cola
  g.save(); g.translate(L * 0.5, H * 0.03); g.rotate(cola);
  g.beginPath(); g.moveTo(0, -H * 0.06); g.quadraticCurveTo(L * 0.1, -H * 0.1, L * 0.2, -H * 0.55); g.quadraticCurveTo(L * 0.14, -H * 0.1, L * 0.12, 0);
  g.quadraticCurveTo(L * 0.14, H * 0.1, L * 0.2, H * 0.55); g.quadraticCurveTo(L * 0.1, H * 0.1, 0, H * 0.08); g.closePath();
  g.fillStyle = "rgba(70,170,250,0.9)"; g.fill(); g.restore();
  // la aleta
  g.beginPath(); g.moveTo(-L * 0.18, H * 0.3); g.quadraticCurveTo(-L * 0.05, H * 0.75, L * 0.06, H * 0.8); g.quadraticCurveTo(-L * 0.04, H * 0.45, -L * 0.06, H * 0.3); g.closePath();
  g.fillStyle = "rgba(60,150,240,0.9)"; g.fill();
  // el ojo y las luces
  g.fillStyle = "#0a1a3a"; g.beginPath(); g.arc(-L * 0.36, H * 0.02, L * 0.012, 0, TAU); g.fill();
  g.save(); g.globalCompositeOperation = "lighter";
  const az = azar(77);
  for (let i = 0; i < 26; i++) { const px = -L * 0.4 + az() * L * 0.85, py = -H * 0.35 + az() * H * 0.3 + Math.abs(px / L) * H * 0.2, r = L * (0.004 + az() * 0.006); k.brillo(g, px, py, r * 9, "190,250,255", 0.7); }
  g.restore();
  g.restore();
}
// El sueño entero, volando: avance = lo que se ha movido la capa cercana (px).
export function sueno(g, t, avance) {
  cieloSueno(g);
  luna(g, 260, -430, 230);
  const W = 3600;
  for (const n of NUBES) { const x = ((((n.x0 - avance * n.p) % W) + W) % W) - W / 2; nube(g, x, n.y, n.w, 0.7); }
  escalera(g, -420 - ((avance * 0.3) % 2400), 260, 1.4, t);
  for (const i of ISLAS) {
    const x = ((((i.x0 - avance * i.p) % W) + W) % W) - W / 2;
    if (Math.abs(x) > RS + i.tam) continue;
    g.save(); g.globalAlpha *= mez(0.55, 1, i.p);
    isla(g, x, i.y, i.tam, i.sem, t, { arbol: i.arbol, cascada: i.cascada, luz: i.p });
    g.restore();
  }
  // bruma de abajo
  const bm = g.createLinearGradient(0, 500, 0, RS); bm.addColorStop(0, "rgba(255,170,150,0)"); bm.addColorStop(1, "rgba(255,190,160,0.6)");
  g.fillStyle = bm; g.fillRect(-RS, 500, 2 * RS, RS);
}

// ---------------------------------------------------------------- la burbuja del sueño
// En (x, y) del mundo, de radio r. contenido(g): dibuja en coordenadas locales del sueño (±RS). al: opacidad.
export function burbuja(g, x, y, r, contenido, al = 1, brillo = 1) {
  if (al <= 0.003 || r < 1) return;
  g.save(); g.globalAlpha *= al;
  k.brillo(g, x, y, r * 2.6, "200,160,255", 0.35 * brillo);
  g.save(); g.beginPath(); g.arc(x, y, r, 0, TAU); g.clip();
  g.translate(x, y); g.scale(r / RS, r / RS); contenido(g); g.restore();
  // el borde: un anillo de luz, más claro arriba a la izquierda
  const bg = g.createRadialGradient(x, y, r * 0.86, x, y, r);
  bg.addColorStop(0, "rgba(255,255,255,0)"); bg.addColorStop(1, `rgba(235,215,255,${0.55 * brillo})`);
  g.fillStyle = bg; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
  g.strokeStyle = `rgba(255,240,255,${0.8 * brillo})`; g.lineWidth = Math.max(1.5, r * 0.012); g.beginPath(); g.arc(x, y, r, 0, TAU); g.stroke();
  k.reflejo(g, x - r * 0.62, y - r * 0.5, r * 0.08, r * 0.38, 0.35);
  g.restore();
}

// ---------------------------------------------------------------- el cuarto de noche
// Cabeza en CAB, sobre la almohada; la cama de x 150 a 1060. La luz de la luna entra por la ventana de la derecha.
export const CAB = [330, 1210], RCAB = 70;
export const RELOJ = [118, 1052], RRELOJ = 62;
const azC = azar(55);
const POLVO = Array.from({ length: 60 }, () => ({ x: 520 + azC() * 520, y: 300 + azC() * 1000, r: 1 + azC() * 2.5, f: azC() * TAU }));
export function cuarto(g, t, { luz = 1 } = {}) {
  // la pared
  const pg = g.createLinearGradient(0, 0, 0, 1920);
  pg.addColorStop(0, "#0d1030"); pg.addColorStop(0.6, "#1a1c4a"); pg.addColorStop(1, "#0b0c22");
  g.fillStyle = pg; g.fillRect(-600, -600, 2300, 3200);
  g.save(); g.globalCompositeOperation = "screen"; g.globalAlpha *= 0.07; g.drawImage(k.manchas, -600, -600, 2300, 3200); g.restore();
  // la ventana, con la luna fuera
  g.save();
  g.beginPath(); g.rect(640, 560, 420, 520); g.clip();
  const vg = g.createLinearGradient(0, 560, 0, 1080); vg.addColorStop(0, "#14205a"); vg.addColorStop(1, "#3a3a8a");
  g.fillStyle = vg; g.fillRect(640, 560, 420, 520);
  k.brillo(g, 900, 700, 400, "200,210,255", 0.6);
  g.fillStyle = "#f2f0ff"; g.beginPath(); g.arc(900, 700, 52, 0, TAU); g.fill();
  g.fillStyle = "#1a2050"; for (const [x, w, h] of [[640, 90, 160], [740, 70, 230], [820, 110, 130], [940, 80, 200], [1010, 60, 150]]) g.fillRect(x, 1080 - h, w, h);
  g.fillStyle = "rgba(255,220,140,0.8)"; const az = azar(8); for (let i = 0; i < 18; i++) { const x = 650 + az() * 400, y = 930 + az() * 140; g.fillRect(x, y, 8, 10); }
  g.restore();
  g.strokeStyle = "#2a2c5c"; g.lineWidth = 18; g.strokeRect(640, 560, 420, 520);
  g.beginPath(); g.moveTo(850, 560); g.lineTo(850, 1080); g.moveTo(640, 820); g.lineTo(1060, 820); g.lineWidth = 10; g.stroke();
  // el haz de la luna que cae sobre la cama
  g.save(); g.globalCompositeOperation = "lighter";
  const hg = g.createLinearGradient(900, 700, 600, 1300);
  hg.addColorStop(0, `rgba(160,180,255,${0.16 * luz})`); hg.addColorStop(1, "rgba(160,180,255,0)");
  g.fillStyle = hg; g.beginPath(); g.moveTo(640, 580); g.lineTo(1060, 580); g.lineTo(900, 1420); g.lineTo(300, 1420); g.closePath(); g.fill();
  for (const p of POLVO) { const a = 0.25 + 0.2 * Math.sin(t * 0.8 + p.f); g.fillStyle = `rgba(210,220,255,${a * luz})`; g.beginPath(); g.arc(p.x + Math.sin(t * 0.3 + p.f) * 12, p.y - ((t * 8 + p.f * 30) % 60), p.r, 0, TAU); g.fill(); }
  g.restore();
  // la mesita y el reloj
  const mg = g.createLinearGradient(20, 0, 220, 0); mg.addColorStop(0, "#3a2440"); mg.addColorStop(1, "#24142a");
  g.fillStyle = mg; g.fillRect(10, 1118, 215, 330);
  g.fillStyle = "#4a3050"; g.fillRect(0, 1108, 235, 20);
  g.fillStyle = "rgba(0,0,0,0.3)"; g.fillRect(30, 1170, 175, 4); g.fillStyle = "#c9a060"; g.beginPath(); g.arc(118, 1200, 7, 0, TAU); g.fill();
}
// El reloj de la mesita: horas h (0-12) que corren.
export function reloj(g, h, brilla = 0) {
  const [x, y] = RELOJ, r = RRELOJ;
  g.fillStyle = "#2a1a30"; g.fillRect(x - 40, y + r * 0.8, 80, 18);
  if (brilla > 0) k.brillo(g, x, y, r * 4, "255,210,140", 0.5 * brilla);
  const cg = g.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r * 1.12);
  cg.addColorStop(0, "#ffd890"); cg.addColorStop(1, "#a0602a");
  g.fillStyle = cg; g.beginPath(); g.arc(x, y, r * 1.12, 0, TAU); g.fill();
  const fg = g.createRadialGradient(x - r * 0.2, y - r * 0.2, 0, x, y, r);
  fg.addColorStop(0, "#fffaf0"); fg.addColorStop(1, "#e8dcc8");
  g.fillStyle = fg; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
  g.strokeStyle = "#3a2a20";
  for (let i = 0; i < 12; i++) { const a = (i / 12) * TAU; g.lineWidth = i % 3 ? 2 : 4; g.beginPath(); g.moveTo(x + Math.sin(a) * r * 0.78, y - Math.cos(a) * r * 0.78); g.lineTo(x + Math.sin(a) * r * 0.9, y - Math.cos(a) * r * 0.9); g.stroke(); }
  const ah = (h / 12) * TAU, am = (h % 1) * TAU;
  g.lineCap = "round";
  g.lineWidth = 6; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.sin(ah) * r * 0.5, y - Math.cos(ah) * r * 0.5); g.stroke();
  g.lineWidth = 4; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.sin(am) * r * 0.75, y - Math.cos(am) * r * 0.75); g.stroke();
  g.fillStyle = "#c03030"; g.beginPath(); g.arc(x, y, 5, 0, TAU); g.fill();
  k.reflejo(g, x - r * 0.5, y - r * 0.45, r * 0.12, r * 0.5, 0.3);
}
// La cama, la almohada y la persona dormida, boca arriba, con la cabeza a la izquierda (de perfil, mirando arriba).
// manta: 1 = tapa; 0 = transparente (se ve el cuerpo de luz). musculos(i, u): encendido 0-1 de cada músculo, u =
// posición de 0 (cabeza) a 1 (pies). pierna: 0-1, la rodilla que se levanta. cerebro: 0-1, encendido.
export function cama(g, t, { manta = 1, musculos = null, pierna = 0, cerebro = 0, frio = 0, ojos = 0 } = {}) {
  // el cabecero
  const cb = g.createLinearGradient(150, 0, 230, 0); cb.addColorStop(0, "#6a3a2a"); cb.addColorStop(1, "#3a1e16");
  g.fillStyle = cb; k.redondo(g, 150, 1050, 70, 400, 18); g.fill();
  g.save(); k.redondo(g, 150, 1050, 70, 400, 18); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha *= 0.3; g.drawImage(k.red2, 150, 1050, 70, 400); g.restore();
  // el colchón y la sábana
  const cg = g.createLinearGradient(0, 1290, 0, 1460); cg.addColorStop(0, "#c8d0ff"); cg.addColorStop(1, "#5a5f9e");
  g.fillStyle = cg; k.redondo(g, 200, 1290, 900, 170, 30); g.fill();
  const resp = Math.sin(t * 1.4) * 3; // la respiración
  // la almohada
  const ag = g.createRadialGradient(300, 1250, 10, 320, 1270, 140); ag.addColorStop(0, "#ffffff"); ag.addColorStop(1, "#9aa4e0");
  g.fillStyle = ag; g.beginPath(); g.ellipse(320, 1272, 135, 42, -0.05, 0, TAU); g.fill();
  // el cuerpo de luz (debajo de la manta)
  if (manta < 1) cuerpoDeLuz(g, t, 1 - manta, musculos, pierna, frio);
  // la manta: un bulto del cuello a los pies, con la rodilla si se levanta
  if (manta > 0) {
    g.save(); g.globalAlpha *= manta;
    const rod = pierna * 70;
    g.beginPath(); g.moveTo(395, 1300);
    g.bezierCurveTo(420, 1200 - resp, 560, 1190 - resp, 640, 1215);
    g.bezierCurveTo(700, 1232, 740, 1232 - rod * 0.5, 780, 1222 - rod);
    g.bezierCurveTo(830, 1214 - rod, 870, 1230 - rod * 0.4, 920, 1240);
    g.bezierCurveTo(970, 1215, 1010, 1215, 1030, 1250);
    g.lineTo(1060, 1330); g.lineTo(395, 1330); g.closePath();
    const mg = g.createLinearGradient(0, 1190, 0, 1330); mg.addColorStop(0, "#7a6ae0"); mg.addColorStop(0.5, "#4a3cb0"); mg.addColorStop(1, "#2a2070");
    g.fillStyle = mg; g.fill();
    g.save(); g.clip(); g.globalCompositeOperation = "screen"; g.globalAlpha *= 0.12; g.drawImage(k.manchas, 395, 1180, 670, 160);
    g.globalAlpha /= 0.12; g.globalCompositeOperation = "source-over";
    g.strokeStyle = "rgba(20,10,60,0.35)"; g.lineWidth = 4; for (const x of [520, 700, 880]) { g.beginPath(); g.moveTo(x, 1215); g.quadraticCurveTo(x + 30, 1270, x - 10, 1330); g.stroke(); }
    g.fillStyle = "rgba(200,210,255,0.25)"; g.fillRect(395, 1180, 670, 22);
    g.restore();
    // el borde doblado de la manta
    g.fillStyle = "#c8ccf0"; g.beginPath(); g.ellipse(402, 1268, 14, 48, 0.12, 0, TAU); g.fill();
    g.restore();
  }
  cabeza(g, t, cerebro, ojos);
}
// La cabeza de perfil, boca arriba, mirando al techo (la nariz arriba), apoyada en la almohada. La coronilla, a la
// izquierda; la barbilla, a la derecha. cerebro: 0-1, el cerebro de luz que se enciende dentro. ojos: 0-1, se mueven.
const CRANEO = [-0.18, -0.38, 0.78, 0.6];
export function cabeza(g, t, cerebro = 0, ojos = 0) {
  const [x, y] = CAB, r = RCAB, [cx, cy, rx, ry] = CRANEO;
  g.save(); g.translate(x, y);
  // el pelo, sobre la almohada
  const pg = g.createRadialGradient(-r * 0.5, -r * 0.3, 0, -r * 0.4, -r * 0.2, r);
  pg.addColorStop(0, "#5a3438"); pg.addColorStop(1, "#1e1014");
  g.fillStyle = pg; g.beginPath(); g.ellipse(-r * 0.42, -r * 0.18, r * 0.82, r * 0.62, 0.15, 0, TAU); g.fill();
  // la cara y el cráneo
  const piel = () => {
    g.beginPath();
    g.ellipse(cx * r, cy * r, rx * r, ry * r, 0, Math.PI * 0.95, Math.PI * 2.02);
    g.quadraticCurveTo(r * 0.5, -r * 0.82, r * 0.42, -r * 0.92);   // el entrecejo
    g.quadraticCurveTo(r * 0.55, -r * 1.12, r * 0.66, -r * 1.06);  // la nariz
    g.quadraticCurveTo(r * 0.68, -r * 0.96, r * 0.64, -r * 0.92);
    g.quadraticCurveTo(r * 0.76, -r * 0.88, r * 0.78, -r * 0.8);   // los labios
    g.quadraticCurveTo(r * 0.84, -r * 0.74, r * 0.8, -r * 0.68);
    g.quadraticCurveTo(r * 0.98, -r * 0.6, r * 0.98, -r * 0.42);   // la barbilla
    g.quadraticCurveTo(r * 0.9, -r * 0.2, r * 0.7, -r * 0.12);
    g.lineTo(r * 0.95, r * 0.35); g.lineTo(-r * 0.1, r * 0.35); g.closePath();
  };
  piel();
  const sg = g.createLinearGradient(0, -r * 1.1, 0, r * 0.3);
  sg.addColorStop(0, "#f6cbb0"); sg.addColorStop(0.55, "#d0927a"); sg.addColorStop(1, "#7a4a4a");
  g.fillStyle = sg; g.fill();
  g.save(); piel(); g.clip();
  g.fillStyle = "rgba(170,190,255,0.22)"; g.fillRect(-r, -r * 1.2, r * 2.2, r * 0.32);
  g.fillStyle = "rgba(230,120,120,0.25)"; g.beginPath(); g.ellipse(r * 0.42, -r * 0.62, r * 0.18, r * 0.12, 0, 0, TAU); g.fill();
  g.restore();
  // el ojo cerrado (y, en REM, se mueve debajo del párpado)
  const mov = ojos * (Math.sin(t * 9) * 0.6 + Math.sin(t * 13.7) * 0.4);
  const ex = r * 0.28 + mov * r * 0.06;
  g.fillStyle = "rgba(150,80,80,0.35)"; g.beginPath(); g.ellipse(ex, -r * 0.84, r * 0.13, r * 0.07, 0, Math.PI, TAU); g.fill();
  g.strokeStyle = "#5a2e2a"; g.lineWidth = Math.max(2, r * 0.04); g.lineCap = "round";
  g.beginPath(); g.moveTo(r * 0.16, -r * 0.83); g.quadraticCurveTo(r * 0.28, -r * 0.76, r * 0.4, -r * 0.84); g.stroke();
  g.lineWidth = Math.max(1.5, r * 0.025); for (const d of [0.2, 0.28, 0.36]) { g.beginPath(); g.moveTo(r * d, -r * 0.8); g.lineTo(r * (d - 0.02), -r * 0.74); g.stroke(); }
  // la oreja
  g.fillStyle = "#c98670"; g.beginPath(); g.ellipse(-r * 0.12, -r * 0.3, r * 0.15, r * 0.2, 0.3, 0, TAU); g.fill();
  g.strokeStyle = "rgba(110,50,50,0.5)"; g.beginPath(); g.ellipse(-r * 0.12, -r * 0.3, r * 0.08, r * 0.12, 0.3, 0.5, 4.5); g.stroke();
  // el pelo de la coronilla y el flequillo
  g.fillStyle = "#3a2026"; g.beginPath(); g.moveTo(-r * 0.95, -r * 0.2);
  g.bezierCurveTo(-r * 1.0, -r * 0.9, -r * 0.3, -r * 1.12, r * 0.12, -r * 0.92);
  g.bezierCurveTo(-r * 0.15, -r * 0.82, -r * 0.4, -r * 0.6, -r * 0.42, -r * 0.3);
  g.bezierCurveTo(-r * 0.6, -r * 0.25, -r * 0.8, -r * 0.1, -r * 0.95, -r * 0.2); g.fill();
  // el cerebro de luz, dentro del cráneo
  if (cerebro > 0) {
    g.save(); g.globalAlpha *= cerebro;
    k.brillo(g, cx * r, cy * r, r * 5, "255,120,220", 0.4);
    g.beginPath(); g.ellipse(cx * r, cy * r, rx * r * 0.98, ry * r * 0.98, 0, 0, TAU);
    g.fillStyle = "rgba(60,10,70,0.55)"; g.fill();
    g.save(); g.clip();
    g.translate(cx * r - r * 0.02, cy * r - r * 0.02); g.rotate(-Math.PI / 2 + 0.25);
    cerebro_(g, 0, 0, r * 0.5, t, cerebro);
    g.restore();
    k.brillo(g, cx * r, cy * r, r * 1.6, "255,220,255", 0.12);
    g.restore();
  }
  g.restore();
}
// ---------------------------------------------------------------- el cuerpo de luz
// Silueta tumbada, de la cabeza (x 395) a los pies (x 1040); los músculos, naranjas, se apagan a azul.
const MUSCULOS = [
  { u: 0.05, x: 470, y: 1250, rx: 55, ry: 26 },  // el pecho
  { u: 0.15, x: 560, y: 1262, rx: 55, ry: 22 },  // la barriga
  { u: 0.1, x: 520, y: 1290, rx: 70, ry: 12 },   // el brazo
  { u: 0.3, x: 640, y: 1290, rx: 50, ry: 11 },   // el antebrazo
  { u: 0.55, x: 740, y: 1262, rx: 85, ry: 22, pierna: 1 }, // el muslo
  { u: 0.8, x: 900, y: 1262, rx: 80, ry: 17, pierna: 2 },  // la pantorrilla
];
export function cuerpoDeLuz(g, t, al, musculos, pierna = 0, frio = 0) {
  g.save(); g.globalAlpha *= al;
  // la silueta (una sola forma, con la rodilla que sube)
  const rod = pierna * 70;
  const forma = () => {
    g.beginPath(); g.moveTo(398, 1232);
    g.bezierCurveTo(415, 1205, 450, 1200, 480, 1206);      // el hombro y el pecho
    g.bezierCurveTo(530, 1214, 580, 1226, 640, 1238);      // la barriga
    g.quadraticCurveTo(700, 1236 - rod * 0.6, 775, 1228 - rod); // el muslo hasta la rodilla
    g.quadraticCurveTo(840, 1236 - rod * 0.6, 900, 1252);  // la espinilla
    g.lineTo(975, 1256); g.quadraticCurveTo(990, 1210, 1010, 1212); g.quadraticCurveTo(1024, 1240, 1022, 1292); // el pie
    g.lineTo(905, 1294); g.quadraticCurveTo(835, 1292 - rod * 0.3, 778, 1272 - rod * 0.6); g.quadraticCurveTo(715, 1292 - rod * 0.2, 650, 1300);
    g.bezierCurveTo(560, 1306, 460, 1306, 410, 1296); g.closePath();
  };
  forma();
  const sg = g.createLinearGradient(0, 1210, 0, 1300);
  const c = k.mezRgb("255,170,110", "120,200,255", frio);
  sg.addColorStop(0, `rgba(${c},0.35)`); sg.addColorStop(1, `rgba(${c},0.18)`);
  g.fillStyle = sg; g.fill();
  g.strokeStyle = `rgba(${k.mezRgb("255,220,180", "200,240,255", frio)},0.9)`; g.lineWidth = 3; g.stroke();
  // los músculos
  g.save(); forma(); g.clip(); g.globalCompositeOperation = "lighter";
  for (const [i, m] of MUSCULOS.entries()) {
    const on = musculos ? musculos(i, m.u) : 1;
    let { x, y } = m; let ang = 0;
    if (m.pierna === 1) { x = 715 + pierna * 10; y = 1262 - rod * 0.55; ang = -pierna * 0.45; }
    if (m.pierna === 2) { x = 850 - pierna * 15; y = 1262 - rod * 0.55; ang = pierna * 0.45; }
    const col = k.mezRgb("120,200,255", "255,140,60", on);
    const gr = g.createRadialGradient(x, y, 0, x, y, m.rx);
    gr.addColorStop(0, `rgba(${col},${0.55 + 0.4 * on})`); gr.addColorStop(1, `rgba(${col},0)`);
    g.save(); g.translate(x, y); g.rotate(ang); g.scale(1, m.ry / m.rx); g.translate(-x, -y);
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, m.rx, 0, TAU); g.fill();
    // las fibras
    g.strokeStyle = `rgba(${col},${0.25 + 0.45 * on})`; g.lineWidth = 2;
    for (let j = -3; j <= 3; j++) { g.beginPath(); g.moveTo(x - m.rx * 0.8, y + j * m.rx * 0.12); g.quadraticCurveTo(x, y + j * m.rx * 0.18, x + m.rx * 0.8, y + j * m.rx * 0.12); g.stroke(); }
    g.restore();
  }
  g.restore();
  g.restore();
}

// ---------------------------------------------------------------- el cerebro de luz
// De lado, la frente a la derecha, centrado en (x, y), de radio r (lo largo ≈ 2r). u: encendido.
const azB = azar(404);
const SURCOS = (() => {
  const l = [];
  for (let gy = -0.85; gy < 0.55; gy += 0.14) for (let gx = -1.0; gx < 1.0; gx += 0.2) {
    let px = gx + (azB() - 0.5) * 0.12, py = gy + (azB() - 0.5) * 0.08, ang = (azB() - 0.5) * 1.2 + (azB() < 0.3 ? Math.PI / 2 : 0);
    const pts = [[px, py]], n = 10, paso = 0.028 + azB() * 0.012;
    let giro = (azB() - 0.5) * 0.6;
    for (let i = 0; i < n; i++) { giro += (azB() - 0.5) * 0.5; ang += giro; px += Math.cos(ang) * paso; py += Math.sin(ang) * paso; pts.push([px, py]); }
    l.push({ pts });
  }
  return l;
})();
const CHISPAS = Array.from({ length: 40 }, () => ({ a: azB() * TAU, d: azB() * 0.75, f: azB() * TAU, v: 0.6 + azB() * 1.2 }));
function contornoCerebro(g, x, y, r) {
  g.beginPath();
  g.moveTo(x + r * 0.95, y + r * 0.05);
  g.bezierCurveTo(x + r * 1.05, y - r * 0.55, x + r * 0.55, y - r * 0.92, x + r * 0.05, y - r * 0.88);
  g.bezierCurveTo(x - r * 0.45, y - r * 0.92, x - r * 1.0, y - r * 0.6, x - r * 1.0, y - r * 0.05);
  g.bezierCurveTo(x - r * 1.02, y + r * 0.35, x - r * 0.8, y + r * 0.5, x - r * 0.5, y + r * 0.5);
  g.bezierCurveTo(x - r * 0.2, y + r * 0.6, x + r * 0.1, y + r * 0.42, x + r * 0.3, y + r * 0.5);
  g.bezierCurveTo(x + r * 0.6, y + r * 0.55, x + r * 0.9, y + r * 0.4, x + r * 0.95, y + r * 0.05);
  g.closePath();
}
export const cerebro = (...a) => cerebro_(...a);
function cerebro_(g, x, y, r, t, u = 1, { tono = ["255,120,220", "255,200,250"], chispas = 1 } = {}) {
  // el tronco y el cerebelo (detrás, abajo)
  const tg = g.createLinearGradient(x - r * 0.3, 0, x - r * 0.1, 0); tg.addColorStop(0, `rgba(${k.mezRgb(tono[0], "60,10,70", 0.5)},0.95)`); tg.addColorStop(1, `rgba(${tono[0]},0.9)`);
  g.fillStyle = tg; g.beginPath(); g.moveTo(x - r * 0.05, y + r * 0.4); g.quadraticCurveTo(x - r * 0.05, y + r * 0.85, x - r * 0.16, y + r * 1.08); g.lineTo(x - r * 0.36, y + r * 1.04); g.quadraticCurveTo(x - r * 0.28, y + r * 0.7, x - r * 0.36, y + r * 0.4); g.fill();
  g.save(); g.beginPath(); g.ellipse(x - r * 0.58, y + r * 0.5, r * 0.36, r * 0.24, 0.15, 0, TAU);
  const ceg = g.createRadialGradient(x - r * 0.62, y + r * 0.4, 0, x - r * 0.58, y + r * 0.5, r * 0.38); ceg.addColorStop(0, `rgba(${tono[1]},0.95)`); ceg.addColorStop(1, `rgba(${k.mezRgb(tono[0], "60,10,70", 0.5)},0.95)`);
  g.fillStyle = ceg; g.fill(); g.clip();
  g.strokeStyle = `rgba(${k.mezRgb(tono[0], "40,0,50", 0.6)},0.7)`; g.lineWidth = r * 0.025;
  for (let i = -4; i <= 4; i++) { g.beginPath(); g.ellipse(x - r * 0.58, y + r * 0.5 + i * r * 0.05, r * 0.4, r * 0.1, 0.15, 0, Math.PI); g.stroke(); }
  g.restore();
  contornoCerebro(g, x, y, r);
  const bg = g.createRadialGradient(x - r * 0.2, y - r * 0.35, r * 0.1, x, y, r * 1.05);
  bg.addColorStop(0, `rgba(${tono[1]},${0.5 + 0.45 * u})`); bg.addColorStop(0.6, `rgba(${tono[0]},${0.4 + 0.4 * u})`); bg.addColorStop(1, `rgba(${k.mezRgb(tono[0], "40,10,60", 0.5)},0.7)`);
  g.fillStyle = bg; g.fill();
  g.save(); contornoCerebro(g, x, y, r); g.clip();
  g.globalCompositeOperation = "multiply"; g.globalAlpha *= 0.35; g.drawImage(k.red, x - r, y - r, 2 * r, 2 * r); g.globalAlpha /= 0.35;
  g.globalCompositeOperation = "source-over";
  // las circunvoluciones: «salchichas» gruesas y redondeadas, muy juntas; el oscuro entre ellas son los surcos
  g.fillStyle = `rgba(${k.mezRgb(tono[0], "40,0,50", 0.6)},0.85)`; g.fillRect(x - r * 1.1, y - r, r * 2.2, r * 2);
  const gusanos = (dy, col, w) => {
    g.strokeStyle = col; g.lineWidth = w; g.lineCap = "round"; g.lineJoin = "round";
    for (const s of SURCOS) { g.beginPath(); s.pts.forEach(([px, py], i) => (i ? g.lineTo(x + px * r, y + py * r + dy) : g.moveTo(x + px * r, y + py * r + dy))); g.stroke(); }
  };
  gusanos(0, `rgba(${k.mezRgb(tono[0], "255,255,255", 0.1)},1)`, r * 0.13);
  gusanos(-r * 0.022, `rgba(${k.mezRgb(tono[1], "255,255,255", 0.3)},${0.55 + 0.3 * u})`, r * 0.05);
  // la cisura lateral, de delante abajo hacia atrás
  g.strokeStyle = `rgba(${k.mezRgb(tono[0], "30,0,40", 0.7)},0.9)`; g.lineWidth = r * 0.07;
  g.beginPath(); g.moveTo(x + r * 0.55, y + r * 0.32); g.bezierCurveTo(x + r * 0.2, y + r * 0.08, x - r * 0.1, y + r * 0.04, x - r * 0.45, y - r * 0.1); g.stroke();
  g.globalCompositeOperation = "multiply"; g.globalAlpha *= 0.3; g.drawImage(k.red, x - r, y - r, 2 * r, 2 * r); g.globalAlpha /= 0.3; g.globalCompositeOperation = "source-over";
  // luz por arriba, sombra por abajo
  const sh = g.createLinearGradient(0, y - r, 0, y + r * 0.6); sh.addColorStop(0, "rgba(255,240,255,0.18)"); sh.addColorStop(0.6, "rgba(0,0,0,0)"); sh.addColorStop(1, "rgba(30,0,40,0.4)");
  g.fillStyle = sh; g.fillRect(x - r * 1.1, y - r, r * 2.2, r * 2);
  // las chispas que corren
  if (chispas > 0) {
    g.globalCompositeOperation = "lighter";
    for (const c of CHISPAS) {
      const a = c.a + t * c.v * 0.6, px = x + Math.cos(a) * c.d * r, py = y + Math.sin(a) * c.d * r * 0.6 - r * 0.1;
      const al = u * chispas * (0.5 + 0.5 * Math.sin(t * 3 * c.v + c.f));
      k.brillo(g, px, py, r * 0.18, "255,255,255", 0.8 * al);
    }
  }
  g.restore();
  // borde de luz
  contornoCerebro(g, x, y, r); g.strokeStyle = `rgba(${tono[1]},${0.6 + 0.4 * u})`; g.lineWidth = Math.max(1.5, r * 0.025); g.stroke();
}

// ---------------------------------------------------------------- alguien que corre
// De perfil, corriendo hacia la derecha, con los pies en (x, y), de alto h. fase: el paso (en vueltas). ropa: colores.
export function corredor(g, x, y, h, fase, { camiseta = "#ff5a5a", pantalon = "#3a4aa8", piel = "#f0b896", pelo = "#2a1a1e", miedo = 0 } = {}) {
  const a = fase * TAU, s = h / 100;
  g.save(); g.translate(x, y); g.scale(s, s);
  const bote = Math.abs(Math.sin(a)) * 4;
  g.translate(0, -bote);
  const miembro = (x0, y0, a1, l1, a2, l2, w, col, oscuro) => {
    const x1 = x0 + Math.sin(a1) * l1, y1 = y0 + Math.cos(a1) * l1, x2 = x1 + Math.sin(a2) * l2, y2 = y1 + Math.cos(a2) * l2;
    g.strokeStyle = oscuro ? k.mezColor(col, "#000000", 0.35) : col; g.lineWidth = w; g.lineCap = "round"; g.lineJoin = "round";
    g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.lineTo(x2, y2); g.stroke();
    return [x2, y2];
  };
  const cad = [0, -50];
  // pierna y brazo de atrás (más oscuros)
  const pierna = (ph, osc) => { const m = Math.sin(ph); const muslo = m * 0.75, rod = muslo - 0.2 - Math.max(0, -Math.cos(ph)) * 1.3; const [px, py] = miembro(cad[0], cad[1], muslo, 26, rod, 26, 11, pantalon, osc); g.fillStyle = osc ? "#222" : "#f4f4f4"; g.beginPath(); g.ellipse(px + 4, py + 2, 8, 4, 0, 0, TAU); g.fill(); };
  const brazo = (ph, osc) => { const m = -Math.sin(ph) * 0.9; miembro(2, -84, m + 0.25 * miedo, 17, m - 1.2 - 0.6 * miedo, 16, 8, osc ? camiseta : camiseta, osc); };
  pierna(a + Math.PI, true); brazo(a + Math.PI, true);
  // el cuerpo, inclinado hacia delante
  g.save(); g.translate(cad[0], cad[1]); g.rotate(0.22);
  const tg = g.createLinearGradient(-12, 0, 12, 0); tg.addColorStop(0, k.mezColor(camiseta, "#000000", 0.3)); tg.addColorStop(0.6, camiseta); tg.addColorStop(1, k.mezColor(camiseta, "#ffffff", 0.25));
  g.fillStyle = tg; k.redondo(g, -12, -40, 24, 44, 10); g.fill();
  // la cabeza
  g.fillStyle = piel; g.beginPath(); g.arc(3, -52, 11, 0, TAU); g.fill();
  g.fillStyle = pelo; g.beginPath(); g.arc(1, -55, 11, Math.PI * 0.9, Math.PI * 2.05); g.fill();
  g.fillStyle = "#2a1a1e"; g.beginPath(); g.arc(9, -53, 1.6, 0, TAU); g.fill();
  if (miedo > 0) { g.strokeStyle = "#5a2a2a"; g.lineWidth = 1.5; g.beginPath(); g.ellipse(10, -46, 2, 2.5 * miedo, 0, 0, TAU); g.stroke(); }
  g.restore();
  pierna(a, false); brazo(a, false);
  g.restore();
}
