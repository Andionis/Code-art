// La panadería del pueblo: la pared cálida, el horno de ladrillo con su fuego, el mostrador de madera, la pirámide de
// diez panes, los fajos de billetes y el cartel del precio. Se dibuja en coordenadas de pantalla (1080 × 1920) y una
// cámara sencilla (foco y zoom) se mueve por ella. La usan los planos 03, 05, 09-10 y 11-12.
import * as k from "#kit";
import { billeteTex, billete, BW, BH } from "./mundo.js";

const { suave: su, tramo: tr, mez, azar } = k;

export const MOSTRADOR = 1090;                           // la y del borde de atrás del mostrador (lo vemos desde arriba)
// la pirámide de panes: 4-3-2-1, sobre el mostrador, a la izquierda
const PW = 158;
export const PANES = [];
for (let fila = 0; fila < 4; fila++) for (let i = 0; i < 4 - fila; i++) PANES.push({ x: 350 - ((3 - fila) * PW * 1.04) / 2 + i * PW * 1.04, y: 1420 - fila * PW * 0.5, a: ((i + fila) % 3 - 1) * 0.05 });
// los dos fajos
export const FAJOS = [{ x: 790, y: 1560 }, { x: 790, y: 1560 }];
export const CAPA = 15;                                  // lo que sube cada billete del fajo
export const FW = 270;                                   // el ancho de un billete del fajo
// el cartel
export const CARTEL = { x: 330, y: 740, w: 560, h: 290 };
// el horno
export const HORNO = { x: 830, y: 760, rx: 240, ry: 300 };

// ---------------------------------------------------------------- la cámara
export function conCamara(g, cam, fn) {
  g.save(); g.translate(540, 1000); g.scale(cam.z, cam.z); g.translate(-cam.x, -cam.y); fn(); g.restore();
}
export const CAM0 = { x: 540, y: 1000, z: 1 };
export const mezCam = (a, b, u) => ({ x: mez(a.x, b.x, u), y: mez(a.y, b.y, u), z: mez(a.z, b.z, u) });

// ---------------------------------------------------------------- un pan
export function pan(g, x, y, w, ang = 0, al = 1, brillo = 0) {
  if (al <= 0.003) return;
  const h = w * 0.5;
  g.save(); g.globalAlpha *= al; g.translate(x, y); g.rotate(ang);
  // la sombra de contacto
  const sg = g.createRadialGradient(0, h * 0.42, 2, 0, h * 0.42, w * 0.55);
  sg.addColorStop(0, "rgba(40,15,0,0.55)"); sg.addColorStop(1, "rgba(40,15,0,0)");
  g.fillStyle = sg; g.beginPath(); g.ellipse(0, h * 0.42, w * 0.55, h * 0.2, 0, 0, 6.28); g.fill();
  // el cuerpo, con la luz desde arriba a la izquierda
  g.beginPath(); g.ellipse(0, 0, w / 2, h / 2, 0, 0, 6.28);
  const bg = g.createRadialGradient(-w * 0.15, -h * 0.3, w * 0.05, 0, 0, w * 0.55);
  bg.addColorStop(0, "#ffe0a0"); bg.addColorStop(0.35, "#e9a54d"); bg.addColorStop(0.75, "#b5651f"); bg.addColorStop(1, "#6d3510");
  g.fillStyle = bg; g.fill();
  g.save(); g.clip();
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.3; g.drawImage(k.manchas, -w / 2, -h / 2, w, h);
  g.restore();
  // los cortes del panadero
  for (let i = -1; i <= 1; i++) {
    const cx = i * w * 0.24;
    g.save(); g.translate(cx, -h * 0.02); g.rotate(-0.9);
    g.beginPath(); g.ellipse(0, 0, h * 0.34, w * 0.032, 0, 0, 6.28);
    const cg = g.createLinearGradient(0, -w * 0.03, 0, w * 0.03); cg.addColorStop(0, "#8a4513"); cg.addColorStop(0.5, "#f7d48e"); cg.addColorStop(1, "#d9a55a");
    g.fillStyle = cg; g.fill();
    g.restore();
  }
  // el brillo de la corteza
  g.save(); g.globalCompositeOperation = "lighter";
  const rg = g.createRadialGradient(-w * 0.18, -h * 0.28, 1, -w * 0.18, -h * 0.28, w * 0.25);
  rg.addColorStop(0, `rgba(255,240,200,${0.45 + brillo * 0.4})`); rg.addColorStop(1, "rgba(255,240,200,0)");
  g.fillStyle = rg; g.fillRect(-w / 2, -h / 2, w, h);
  g.restore();
  if (brillo > 0.01) k.brillo(g, 0, 0, w * 2.2, "255,200,110", brillo * 0.6);
  g.restore();
}

// ---------------------------------------------------------------- un billete tumbado en el fajo
const azF = azar(515);
const DESV = Array.from({ length: 80 }, () => ({ dx: (azF() - 0.5) * 16, a: (azF() - 0.5) * 0.08 }));
export function billeteTumbado(g, x, y, w, ang = 0, al = 1) {
  const h = (w * BH) / BW;
  g.save(); g.globalAlpha *= al; g.translate(x, y); g.rotate(ang); g.scale(1, 0.42);
  g.fillStyle = "#0e3a22"; k.redondo(g, -w / 2, -h / 2 + 10, w, h, 8); g.fill();   // el canto
  g.drawImage(billeteTex(), -w / 2, -h / 2, w, h);
  g.fillStyle = "rgba(255,240,200,0.08)"; g.fillRect(-w / 2, -h / 2, w, h);        // la luz cálida del horno
  g.restore();
}
// Un fajo de n billetes (n puede ser decimal: el último está cayendo y lo dibuja quien lo tira).
export function fajo(g, F, n, i0 = 0, brillo = 0) {
  const sg = g.createRadialGradient(F.x, F.y + 10, 4, F.x, F.y + 10, FW * 0.7);
  if (n > 0.5) { sg.addColorStop(0, "rgba(30,10,0,0.5)"); sg.addColorStop(1, "rgba(30,10,0,0)"); g.fillStyle = sg; g.beginPath(); g.ellipse(F.x, F.y + 10, FW * 0.7, 40, 0, 0, 6.28); g.fill(); }
  for (let i = 0; i < Math.floor(n); i++) { const d = DESV[(i + i0) % DESV.length]; billeteTumbado(g, F.x + d.dx, F.y - i * CAPA, FW, d.a); }
  if (brillo > 0.01 && n > 0.5) k.brillo(g, F.x, F.y - n * CAPA * 0.5, FW * 2.4, "170,255,170", brillo * 0.6);
}
export const cimaFajo = (F, n) => F.y - n * CAPA;

// Un billete que cae desde arriba hasta la cima del fajo entre t0 y t1, aleteando.
export function billeteCae(g, t, t0, t1, F, nivel, sem = 0, desdeX = null) {
  if (t < t0 || t > t1) return;
  const u = tr(t, t0, t1), x0 = desdeX ?? F.x + 160 * Math.sin(sem * 3.1), y0 = -200;
  const x = mez(x0, F.x, su(u)) + 60 * Math.sin(u * 9 + sem) * (1 - u), y = mez(y0, cimaFajo(F, nivel), u * u);
  const flip = mez(sem * 2 + 3, Math.acos(0.42), su(u)), ang = mez(Math.sin(sem * 7) * 0.9, 0, su(u));
  billete(g, x, y, FW, ang, flip);
}

// ---------------------------------------------------------------- el fondo, el horno y el mostrador
const azP = azar(88);
const HARINA = Array.from({ length: 90 }, () => ({ x: azP() * 1080, y: azP() * 1920, s: 1 + azP() * 3, f: azP() * 6.28, v: 6 + azP() * 14 }));
let texPared = null, texMadera = null;
function hacerMadera() {
  const l = k.lienzo(1080, 1000), c = l.getContext("2d");
  // la superficie (0 → 600) y el canto (600 → 680), y el frente oscuro debajo
  const bg = c.createLinearGradient(0, 0, 0, 600);
  bg.addColorStop(0, "#7a4a22"); bg.addColorStop(0.5, "#b57a40"); bg.addColorStop(1, "#d29a5c");
  c.fillStyle = bg; c.fillRect(0, 0, 1080, 600);
  const az = azar(31);
  c.lineWidth = 2;
  for (let i = 0; i < 60; i++) {
    const y0 = az() * 600, a = 3 + az() * 9, f = 0.002 + az() * 0.006, ph = az() * 6;
    c.strokeStyle = `rgba(${az() < 0.55 ? "70,35,10" : "240,190,120"},${0.12 + az() * 0.18})`;
    c.lineWidth = 1 + (y0 / 600) * 2.5;
    c.beginPath(); for (let x = 0; x <= 1080; x += 12) { const y = y0 + a * Math.sin(x * f + ph) + 2 * Math.sin(x * 0.03 + i); x ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke();
  }
  for (const y of [150, 330, 520]) { c.fillStyle = "rgba(40,18,4,0.35)"; c.fillRect(0, y, 1080, 3 + y / 200); }
  const cg = c.createLinearGradient(0, 600, 0, 680); cg.addColorStop(0, "#f0b878"); cg.addColorStop(0.2, "#8a5226"); cg.addColorStop(1, "#4a2610");
  c.fillStyle = cg; c.fillRect(0, 600, 1080, 80);
  const fg = c.createLinearGradient(0, 680, 0, 1000); fg.addColorStop(0, "#3a1d0a"); fg.addColorStop(1, "#140803");
  c.fillStyle = fg; c.fillRect(0, 680, 1080, 320);
  c.fillStyle = "rgba(255,220,170,0.6)"; c.fillRect(0, 0, 1080, 3);
  return l;
}
function hacerPared() {
  const l = k.lienzo(1080, 1300), c = l.getContext("2d");
  const bg = c.createLinearGradient(0, 0, 0, 1300);
  bg.addColorStop(0, "#5a2c14"); bg.addColorStop(0.5, "#a65a26"); bg.addColorStop(1, "#6d3415");
  c.fillStyle = bg; c.fillRect(0, 0, 1080, 1300);
  c.globalCompositeOperation = "multiply"; c.globalAlpha = 0.35; c.drawImage(k.manchas, 0, 0, 1080, 1300);
  c.globalAlpha = 1; c.globalCompositeOperation = "source-over";
  // una franja de azulejos
  for (let x = 0; x < 1080; x += 90) for (let r = 0; r < 2; r++) {
    const y = 1020 + r * 90, tg = c.createLinearGradient(x, y, x + 90, y + 90);
    tg.addColorStop(0, (x / 90 + r) % 2 ? "#e9d6a8" : "#2f7a8a"); tg.addColorStop(1, (x / 90 + r) % 2 ? "#c9a970" : "#1d5260");
    c.fillStyle = tg; c.fillRect(x + 3, y + 3, 84, 84);
  }
  return l;
}
function horno(g, t, abre, fuego) {
  const { x, y, rx, ry } = HORNO;
  // el arco de ladrillo
  g.save();
  g.beginPath(); g.ellipse(x, y + ry * 0.45, rx, ry, 0, Math.PI, 0); g.lineTo(x + rx, y + ry * 0.45 + 200); g.lineTo(x - rx, y + ry * 0.45 + 200); g.closePath();
  const bg = g.createRadialGradient(x - rx * 0.3, y - ry * 0.3, 20, x, y, rx * 1.3);
  bg.addColorStop(0, "#d9774a"); bg.addColorStop(0.6, "#9a4425"); bg.addColorStop(1, "#4a1d0e");
  g.fillStyle = bg; g.fill(); g.clip();
  g.strokeStyle = "rgba(60,20,8,0.55)"; g.lineWidth = 5;
  for (let r = 0; r < 14; r++) {
    const yy = y - ry * 0.6 + r * 46; g.beginPath(); g.moveTo(x - rx, yy); g.lineTo(x + rx, yy); g.stroke();
    for (let cI = 0; cI < 7; cI++) { const xx = x - rx + ((cI + (r % 2) * 0.5) * rx * 2) / 6; g.beginPath(); g.moveTo(xx, yy); g.lineTo(xx, yy + 46); g.stroke(); }
  }
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.25; g.drawImage(k.manchas, x - rx, y - ry, rx * 2, ry * 2);
  g.restore();
  // la boca, con el fuego
  const mx = x, my = y + 150, mw = 150, mh = 150;
  g.save();
  g.beginPath(); g.ellipse(mx, my, mw, mh, 0, Math.PI, 0); g.lineTo(mx + mw, my + 70); g.lineTo(mx - mw, my + 70); g.closePath();
  const fg = g.createRadialGradient(mx, my + 60, 10, mx, my, mw * 1.3);
  fg.addColorStop(0, `rgba(255,${200 + 40 * fuego},120,1)`); fg.addColorStop(0.4, "#ff7a1a"); fg.addColorStop(1, "#5a1004");
  g.fillStyle = fg; g.fill(); g.clip();
  for (let i = 0; i < 9; i++) {
    const fx = mx - mw + (i + 0.5) * (mw * 2) / 9, fh = 60 + 40 * Math.sin(t * 9 + i * 1.7) + 30 * fuego;
    const lg = g.createLinearGradient(0, my + 70, 0, my + 70 - fh);
    lg.addColorStop(0, "rgba(255,240,180,0.9)"); lg.addColorStop(1, "rgba(255,120,20,0)");
    g.fillStyle = lg; g.beginPath(); g.moveTo(fx - 22, my + 70); g.quadraticCurveTo(fx + 10 * Math.sin(t * 7 + i), my + 70 - fh * 0.6, fx, my + 70 - fh); g.quadraticCurveTo(fx + 8, my + 70 - fh * 0.5, fx + 22, my + 70); g.fill();
  }
  // la puerta de hierro: sube cuando se abre
  const dy = -abre * (mh + 90);
  const dg = g.createLinearGradient(mx - mw, 0, mx + mw, 0);
  dg.addColorStop(0, "#1c1c20"); dg.addColorStop(0.45, "#55585f"); dg.addColorStop(0.55, "#6b6e75"); dg.addColorStop(1, "#18181b");
  g.fillStyle = dg; g.beginPath(); g.ellipse(mx, my + dy, mw, mh, 0, Math.PI, 0); g.lineTo(mx + mw, my + 70 + dy); g.lineTo(mx - mw, my + 70 + dy); g.closePath(); g.fill();
  g.fillStyle = "#c9a35a"; k.redondo(g, mx - 50, my + 10 + dy, 100, 22, 11); g.fill();
  g.restore();
  k.brillo(g, mx, my + 20, 700 + 300 * fuego, "255,150,60", 0.45 + 0.4 * abre + 0.15 * Math.sin(t * 5));
}
function cartel(g, t, giro, sube, al = 1) {
  const { x, y, w, h } = CARTEL;
  g.save(); g.globalAlpha *= al;
  // los cordeles
  g.strokeStyle = "rgba(230,200,150,0.8)"; g.lineWidth = 4;
  g.beginPath(); g.moveTo(x - w * 0.35, y - h / 2); g.lineTo(x, y - h / 2 - 110); g.lineTo(x + w * 0.35, y - h / 2); g.stroke();
  const bal = Math.sin(t * 1.6) * 0.015 + sube * Math.sin(t * 30) * 0.02;
  g.translate(x, y); g.rotate(bal);
  const c = Math.cos(giro * Math.PI), lado = c >= 0 ? 1 : 2;
  g.scale(1, Math.max(0.02, Math.abs(c)));
  // el marco de madera y la pizarra
  g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 30; g.shadowOffsetY = 18;
  g.fillStyle = "#7a4a22"; k.redondo(g, -w / 2, -h / 2, w, h, 18); g.fill();
  g.shadowColor = "rgba(0,0,0,0)";
  const pg = g.createLinearGradient(0, -h / 2, 0, h / 2); pg.addColorStop(0, "#2c3a33"); pg.addColorStop(1, "#18211c");
  g.fillStyle = pg; k.redondo(g, -w / 2 + 22, -h / 2 + 22, w - 44, h - 44, 10); g.fill();
  g.save(); g.globalCompositeOperation = "screen"; g.globalAlpha = 0.12; g.drawImage(k.manchas, -w / 2, -h / 2, w, h); g.restore();
  // el texto de tiza
  g.fillStyle = "#f4f1e6"; g.textAlign = "center"; g.textBaseline = "middle";
  g.shadowColor = "rgba(255,255,255,0.4)"; g.shadowBlur = 8;
  g.font = "800 62px Figtree"; g.fillText("1 PAN =", 0, -48);
  g.font = "900 84px Figtree";
  g.fillStyle = lado === 1 ? "#f4f1e6" : "#ffd36a";
  g.fillText(lado === 1 ? "1 billete" : "2 billetes", 0, 48);
  g.restore();
  // la flecha roja de «sube»
  if (sube > 0.01) {
    const ax = x + w / 2 + 70, ay = y + 40 - 60 * su(sube);
    g.save(); g.globalAlpha *= Math.min(1, sube * 2) * al; g.translate(ax, ay);
    g.fillStyle = "#ff3b30"; g.shadowColor = "rgba(255,59,48,0.8)"; g.shadowBlur = 30;
    g.beginPath(); g.moveTo(0, -90); g.lineTo(55, -20); g.lineTo(20, -20); g.lineTo(20, 70); g.lineTo(-20, 70); g.lineTo(-20, -20); g.lineTo(-55, -20); g.closePath(); g.fill();
    g.restore();
  }
}

// La escena entera. e = { panes (0-10, cuántos han llegado; decimal: el último cayendo), tPanes: [t de cada pan],
// fajo1, fajo2 (n), abre (puerta), fuego, giro (0 → 1: el cartel da la vuelta), sube, cartelAl, brilloPanes,
// brilloFajos, extra(g) (lo que se dibuja encima, dentro de la cámara) }
export function escena(g, t, cam, e) {
  texPared ??= hacerPared(); texMadera ??= hacerMadera();
  g.fillStyle = "#1a0a04"; g.fillRect(0, 0, 1080, 1920);
  conCamara(g, cam, () => {
    g.drawImage(texPared, -300, -100, 1680, 1400);
    // la luz cálida del horno sobre la pared
    k.brillo(g, HORNO.x, HORNO.y + 100, 1900, "255,150,70", 0.35);
    k.brillo(g, 540, 1350, 1600, "255,190,110", 0.22);
    horno(g, t, e.abre ?? 0, e.fuego ?? 0);
    if (e.antesMostrador) e.antesMostrador(g);
    if ((e.cartelAl ?? 1) > 0) { g.save(); g.translate(0, e.cartelDy ?? 0); cartel(g, t, e.giro ?? 0, e.sube ?? 0, e.cartelAl ?? 1); g.restore(); }
    g.drawImage(texMadera, -300, MOSTRADOR, 1680, 1000);
    // los panes
    const tp = e.tPanes || [];
    PANES.forEach((p, i) => {
      if (i >= (e.panes ?? 10)) return;
      const t0 = tp[i];
      let y = p.y, a = p.a, al = 1;
      if (t0 != null && t < t0 + 0.28) { const u = tr(t, t0, t0 + 0.28); y = mez(p.y - 520, p.y, u * u); a = p.a + (1 - u) * 0.8; al = Math.min(1, u * 4); if (t < t0) return; }
      const bote = t0 != null ? -14 * Math.exp(-(t - t0 - 0.28) * 12) * Math.sin(Math.max(0, t - t0 - 0.28) * 30) : 0;
      pan(g, p.x, y + bote, PW, a, al, e.brilloPanes ?? 0);
    });
    fajo(g, FAJOS[0], e.fajo1 ?? 0, 0, e.brilloFajos ?? 0);
    fajo(g, FAJOS[1], e.fajo2 ?? 0, 20, e.brilloFajos ?? 0);
    if (e.extra) e.extra(g);
    for (const m of HARINA) { const yy = (((m.y - t * m.v) % 1920) + 1920) % 1920; g.fillStyle = `rgba(255,235,200,${0.18 + 0.15 * Math.sin(t * 2 + m.f)})`; g.fillRect(m.x + 6 * Math.sin(t + m.f), yy, m.s, m.s); }
  });
  // el velo del subtítulo
  const vg = g.createLinearGradient(0, 180, 0, 640); vg.addColorStop(0, "rgba(20,8,2,0.55)"); vg.addColorStop(1, "rgba(20,8,2,0)"); g.fillStyle = vg; g.fillRect(0, 0, 1080, 640);
}
