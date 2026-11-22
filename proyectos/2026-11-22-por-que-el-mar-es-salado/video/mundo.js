// Lo que comparten los planos de este vídeo: el paisaje del mar y el río (el mar delante, la costa, el río que baja
// de las montañas), el cielo con su sol y sus nubes, la lluvia, los granos de sal y el velo de los subtítulos.
import * as k from "#kit";

const { azar, mez, mezRgb, F } = k;

// ---------------------------------------------------------------- la cámara del paisaje
// Una cámara sencilla que mira siempre de frente (hacia +Z, hacia la costa): está en x, a la altura h, en z, y
// sube o baja la mirada moviendo el horizonte (hy: dónde queda el horizonte en la pantalla).
export const camPaisaje = (x, h, z, hy = 900) => ({ x, h, z, hy });
// Un punto del mundo (X, Y, Z) en la pantalla, o null si queda detrás.
export function pp(c, X, Y, Z) {
  const dz = Z - c.z;
  if (dz < 0.25) return null;
  return { x: 540 + (F * (X - c.x)) / dz, y: c.hy + (F * (c.h - Y)) / dz, z: dz, s: F / dz };
}

// ---------------------------------------------------------------- el mundo
export const COSTA = 0;                 // la orilla: Z < 0 es mar; Z > 0, tierra
export const MONTE = 230;               // la cordillera de delante
// el río: su centro y su ancho a cada distancia (baja de la montaña haciendo eses y se abre al llegar al mar)
export const rioX = (Z) => 7 * Math.sin(Z * 0.028 + 0.6) - 4 + 3 * Math.sin(Z * 0.07);
export const rioAncho = (Z) => mez(9, 1.6, Math.min(1, Math.max(0, Z / 150))) + 6 * Math.max(0, 1 - Z / 10);

// las dos cordilleras: puntos [x, alto] de una silueta con picos (la de delante, verde; la de detrás, azulada con nieve)
const cordillera = (sem, n, x0, x1, alto, hueco) => {
  const a = azar(sem), fases = Array.from({ length: 4 }, () => a() * 6.28), l = [];
  for (let i = 0; i <= n; i++) {
    const x = mez(x0, x1, i / n), u = i / n;
    let y = alto * (0.55 + 0.25 * Math.sin(u * 9 + fases[0]) + 0.16 * Math.sin(u * 23 + fases[1]) + 0.08 * Math.sin(u * 61 + fases[2]) + 0.05 * (a() - 0.5));
    y = Math.max(alto * 0.12, y);
    if (hueco && Math.abs(x - rioX(MONTE)) < hueco) y *= 0.2 + 0.8 * Math.pow(Math.abs(x - rioX(MONTE)) / hueco, 1.5);
    l.push([x, y]);
  }
  return l;
};
const CERCA = cordillera(31, 140, -420, 420, 70, 60);
const LEJOS = cordillera(77, 120, -700, 700, 130, 0);

// ---------------------------------------------------------------- el cielo
// o: { oscuro (0-1: nubes de lluvia), sol: [x, y] en pantalla, solAl }
export function cielo(g, c, t, o = {}) {
  const os = o.oscuro || 0, hy = c.hy;
  const gr = g.createLinearGradient(0, hy - 1900, 0, hy);
  gr.addColorStop(0, `rgb(${mezRgb("22,92,196", "34,44,66", os)})`);
  gr.addColorStop(0.6, `rgb(${mezRgb("64,156,232", "70,82,104", os)})`);
  gr.addColorStop(1, `rgb(${mezRgb("190,228,250", "128,140,156", os)})`);
  g.fillStyle = gr; g.fillRect(0, 0, 1080, Math.max(0, hy + 4));
  if (hy < 0) return;
  // el sol, arriba a la izquierda (de ahí viene la luz)
  const sol = o.sol || [250, hy - 1050], sa = (o.solAl ?? 1) * (1 - 0.85 * os);
  if (sa > 0.01) {
    k.brillo(g, sol[0], sol[1], 1300, "255,236,190", 0.55 * sa);
    g.save(); g.globalAlpha = sa;
    const s = g.createRadialGradient(sol[0], sol[1], 0, sol[0], sol[1], 95);
    s.addColorStop(0, "#fffdf2"); s.addColorStop(0.7, "#fff3c4"); s.addColorStop(1, "rgba(255,230,160,0)");
    g.fillStyle = s; g.beginPath(); g.arc(sol[0], sol[1], 95, 0, Math.PI * 2); g.fill(); g.restore();
  }
}

// Una nube: un montón de bolas, con luz arriba a la izquierda y sombra abajo. os (0-1) la vuelve de lluvia.
const NUBES = new Map();
function formaNube(sem) {
  if (NUBES.has(sem)) return NUBES.get(sem);
  const a = azar(sem), l = [];
  for (let i = 0; i < 34; i++) {
    const u = a(), x = (u - 0.5) * 0.95;
    const alto = Math.sin(Math.PI * u);
    l.push({ x, y: -0.06 - alto * 0.2 * Math.pow(a(), 0.7), r: 0.07 + 0.12 * alto * (0.5 + 0.7 * a()) });
  }
  l.sort((p, q) => p.y - q.y);
  NUBES.set(sem, l);
  return l;
}
export function nube(g, x, y, w, os = 0, al = 1, sem = 1) {
  if (al <= 0.01 || w < 4) return;
  const l = formaNube(sem);
  g.save(); g.globalAlpha *= al;
  // la sombra de abajo, ancha y difusa
  const sb = g.createRadialGradient(x, y - w * 0.02, 0, x, y - w * 0.02, w * 0.55);
  sb.addColorStop(0, `rgba(${mezRgb("170,186,210", "40,46,58", os)},0.85)`); sb.addColorStop(1, `rgba(${mezRgb("170,186,210", "40,46,58", os)},0)`);
  g.save(); g.translate(x, y - w * 0.02); g.scale(1, 0.32); g.translate(-x, -(y - w * 0.02)); g.fillStyle = sb; g.beginPath(); g.arc(x, y - w * 0.02, w * 0.55, 0, Math.PI * 2); g.fill(); g.restore();
  for (const b of l) {
    const bx = x + b.x * w, by = y + b.y * w, r = b.r * w;
    const luz = Math.min(1, Math.max(0, 0.5 - b.y * 2.2));
    const col = mezRgb(mezRgb("176,192,216", "255,255,255", luz), mezRgb("58,64,80", "150,158,174", luz), os);
    const gr = g.createRadialGradient(bx - r * 0.25, by - r * 0.3, 0, bx, by, r);
    gr.addColorStop(0, `rgba(${col},0.95)`); gr.addColorStop(0.55, `rgba(${col},0.8)`); gr.addColorStop(1, `rgba(${col},0)`);
    g.fillStyle = gr; g.beginPath(); g.arc(bx, by, r, 0, Math.PI * 2); g.fill();
  }
  g.restore();
}

// ---------------------------------------------------------------- las montañas
function sierra(g, c, picos, Z, colLuz, colSombra, nieve, bruma) {
  const P = picos.map(([x, y]) => pp(c, x, y, Z)), B = pp(c, 0, 0, Z);
  if (!B) return;
  const base = B.y + 2, top = Math.min(...P.map((q) => q.y));
  const silueta = () => { g.beginPath(); g.moveTo(P[0].x, base); for (const q of P) g.lineTo(q.x, q.y); g.lineTo(P[P.length - 1].x, base); g.closePath(); };
  const gr = g.createLinearGradient(0, top, 0, base);
  gr.addColorStop(0, colSombra[0]); gr.addColorStop(1, colSombra[1]);
  silueta(); g.fillStyle = gr; g.fill();
  g.save(); silueta(); g.clip();
  // la luz del sol desde la izquierda, y un borde de luz en la cresta
  const gl = g.createLinearGradient(0, 0, 1080, 0);
  gl.addColorStop(0, colLuz[0]); gl.addColorStop(1, "rgba(0,0,0,0)");
  g.globalAlpha = 0.55; g.fillStyle = gl; g.fillRect(0, top, 1080, base - top); g.globalAlpha = 1;
  g.strokeStyle = "rgba(255,255,240,0.35)"; g.lineWidth = 3;
  g.beginPath(); P.forEach((q, i) => (i ? g.lineTo(q.x, q.y + 1.5) : g.moveTo(q.x, q.y + 1.5))); g.stroke();
  // la nieve en lo más alto
  if (nieve) {
    const lim = mez(top, base, 0.28);
    g.fillStyle = "rgba(248,252,255,0.9)";
    g.beginPath(); g.moveTo(P[0].x, lim);
    for (const q of P) g.lineTo(q.x, Math.min(q.y, lim) );
    for (let i = P.length - 1; i >= 0; i--) g.lineTo(P[i].x, Math.min(P[i].y + 18 + 14 * Math.sin(i * 1.7), lim));
    g.closePath(); g.fill();
  }
  // la textura de la roca y la hierba
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.4; g.drawImage(k.manchas, -100, top - 50, 1280, Math.max(200, base - top + 100));
  g.globalAlpha = 0.22; g.drawImage(k.red, -100, top - 50, 1280, Math.max(200, base - top + 100));
  g.restore();
  // la bruma de la distancia, abajo
  const br = g.createLinearGradient(0, base - 160, 0, base);
  br.addColorStop(0, `rgba(${bruma},0)`); br.addColorStop(1, `rgba(${bruma},0.55)`);
  g.fillStyle = br; g.fillRect(0, base - 160, 1080, 160);
}

// ---------------------------------------------------------------- la tierra, el río y el mar
const az0 = azar(909);
// brillos del agua (puntos que centellean despacio, siempre los mismos)
const BRILLOS = Array.from({ length: 260 }, () => ({ x: (az0() - 0.5) * 120, z: -az0() * 70, f: az0() * 6.28, v: 1 + az0() * 2 }));
const BRILLOS_RIO = Array.from({ length: 120 }, () => ({ u: (az0() - 0.5) * 0.9, z: az0() * MONTE, f: az0() * 6.28 }));
// los granos de sal que bajan por el río (o: { sal }): cada uno tiene su sitio y su velocidad
const GRANOS_RIO = Array.from({ length: 70 }, () => ({ u: (az0() - 0.5) * 0.7, z0: az0() * 200, v: 5 + az0() * 4, sem: Math.floor(az0() * 1e5) }));

// o: { oscuro, sal (0-1: granos que bajan por el río), salMar (0-1: granos que se quedan en el mar), olas (alto), velRio }
export function paisaje(g, c, t, o = {}) {
  const os = o.oscuro || 0;
  cielo(g, c, t, o);
  // las nubes del cielo, lejos sobre las montañas
  for (const n of o.nubes || []) {
    const P = pp(c, n[0], n[1], n[2]);
    if (P) nube(g, P.x, P.y, P.s * n[3], n[4] ?? os, n[5] ?? 1, n[6] ?? 1);
  }
  sierra(g, c, LEJOS, 520, [mezColor3("#b9cbe6", os), mezColor3("#8fa9cf", os)], [mezColor3("#7f97bf", os), mezColor3("#6f88b2", os)], true, mezRgb("190,214,240", "120,130,146", os));
  sierra(g, c, CERCA, MONTE, [mezColor3("#7fae5a", os), mezColor3("#3d7a3a", os)], [mezColor3("#4b7a43", os), mezColor3("#2b5a33", os)], false, mezRgb("170,200,190", "100,112,120", os));

  // la tierra: franjas de lejos a cerca, con el río en medio
  const Zlejos = MONTE, Zcerca = Math.max(COSTA, c.z + 0.6);
  const N = 90;
  const zs = [];
  for (let i = 0; i <= N; i++) zs.push(Zcerca + (Zlejos - Zcerca) * Math.pow(1 - i / N, 2.2));
  const H = pp(c, 0, 0, Zlejos);
  for (let i = N; i > 0; i--) {
    const z0 = zs[i], z1 = zs[i - 1];
    const a = pp(c, 0, 0, z0), b = pp(c, 0, 0, z1);
    if (!a || !b) continue;
    const lej = Math.min(1, (z0 - Zcerca) / 120);
    g.fillStyle = `rgb(${mezRgb(mezRgb("88,168,70", "142,186,140", lej), "60,78,60", os * 0.7)})`;
    g.fillRect(0, b.y - 0.5, 1080, a.y - b.y + 1.5);
    // el río en esta franja
    const ra = pp(c, rioX(z0) - rioAncho(z0) / 2, 0, z0), rb = pp(c, rioX(z0) + rioAncho(z0) / 2, 0, z0);
    const rc = pp(c, rioX(z1) - rioAncho(z1) / 2, 0, z1), rd = pp(c, rioX(z1) + rioAncho(z1) / 2, 0, z1);
    // la orilla de arena
    const ex = 3 / Math.max(1, z0 * 0.02);
    g.fillStyle = `rgb(${mezRgb("214,196,140", "120,116,100", os)})`;
    g.beginPath(); g.moveTo(ra.x - ex * a.s * 0.05, ra.y); g.lineTo(rb.x + ex * a.s * 0.05, rb.y); g.lineTo(rd.x + ex * b.s * 0.05, rd.y); g.lineTo(rc.x - ex * b.s * 0.05, rc.y); g.closePath(); g.fill();
    g.fillStyle = `rgb(${mezRgb(mezRgb("70,170,235", "150,200,235", lej), "70,96,120", os)})`;
    g.beginPath(); g.moveTo(ra.x, ra.y); g.lineTo(rb.x, rb.y); g.lineTo(rd.x, rd.y); g.lineTo(rc.x, rc.y); g.closePath(); g.fill();
    // la corriente: rayas de luz que bajan hacia el mar
    const fase = (z0 + t * (o.velRio ?? 6)) * 0.5;
    if (Math.sin(fase) > 0.75 && z0 < 140 && z0 - c.z > 6) {
      g.strokeStyle = `rgba(230,248,255,${0.35 * (1 - lej)})`; g.lineWidth = Math.max(1, a.s * 0.12);
      g.beginPath(); g.moveTo(mez(ra.x, rb.x, 0.3), ra.y); g.lineTo(mez(ra.x, rb.x, 0.62), ra.y); g.stroke();
    }
  }
  // la textura de la hierba, encima de la tierra (sin tapar el cielo)
  if (H) {
    const yH = H.y, yC = pp(c, 0, 0, Zcerca)?.y ?? 1920;
    g.save(); g.beginPath(); g.rect(0, yH, 1080, Math.min(1920, yC) - yH); g.clip();
    g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.35; g.drawImage(k.manchas, -200, yH - 100, 1480, 1400);
    g.restore();
  }
  // los árboles de las orillas, de lejos a cerca
  for (const a of ARBOLES) {
    if (a.z < Zcerca + 0.5) continue;
    const X = rioX(a.z) + a.lado * (rioAncho(a.z) / 2 + a.d);
    const P = pp(c, X, 0, a.z);
    if (!P || P.y > 1990) continue;
    const tam = P.s * a.t;
    if (tam > 260) continue;
    arbol(g, P.x, P.y, tam, os, Math.min(1, (MONTE - a.z) / 30) * Math.min(1, (260 - tam) / 80));
  }
  // los brillos del río y los granos de sal que bajan
  g.save(); g.globalCompositeOperation = "lighter";
  for (const q of BRILLOS_RIO) {
    if (q.z < Zcerca) continue;
    const P = pp(c, rioX(q.z) + q.u * rioAncho(q.z), 0, q.z);
    if (!P) continue;
    const al = 0.5 * (0.5 + 0.5 * Math.sin(t * 3 + q.f)) * (1 - os);
    k.brillo(g, P.x, P.y, Math.max(6, P.s * 0.5), "235,250,255", al);
  }
  g.restore();
  if (o.sal > 0) for (const [iq, q] of GRANOS_RIO.entries()) {
    if (iq / GRANOS_RIO.length >= (o.nSal ?? 1)) continue;
    let z = (q.z0 * 0.4 - t * q.v * (o.velSal ?? 1)) % 80; if (z < 0) z += 80;
    z += Math.max(COSTA, c.z) + 1;
    if (z < Zcerca) continue;
    const P = pp(c, rioX(z) + q.u * rioAncho(z), 0.1, z);
    if (!P) continue;
    grano(g, P.x, P.y, Math.min(60, Math.max(3, P.s * 0.3)), t, q.sem, o.sal * Math.min(1, (z - c.z - 0.6) / 1.5) * Math.min(1, (80 - (z - Math.max(COSTA, c.z))) / 15));
  }

  // el mar, delante de la costa
  const C = pp(c, 0, 0, COSTA);
  if (C && C.y < 1920 + 10) mar(g, c, t, C.y, o);
}
const ARBOLES = (() => { const a = azar(5150), l = []; for (let i = 0; i < 110; i++) l.push({ z: 4 + Math.pow(a(), 1.6) * 200, lado: a() < 0.5 ? -1 : 1, d: 1 + a() * 22, t: 1.2 + a() * 1.4 }); return l.sort((p, q) => q.z - p.z); })();
function arbol(g, x, y, r, os, al) {
  if (r < 1.5) return;
  g.save(); g.globalAlpha *= al;
  g.fillStyle = "rgba(20,40,10,0.35)"; g.beginPath(); g.ellipse(x + r * 0.4, y, r * 0.8, r * 0.22, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = "#4a3420"; g.fillRect(x - r * 0.08, y - r * 0.7, r * 0.16, r * 0.7);
  const gr = g.createRadialGradient(x - r * 0.3, y - r * 1.4, r * 0.1, x, y - r * 1.1, r * 0.95);
  gr.addColorStop(0, mezColor3("#8fd26a", os)); gr.addColorStop(0.6, mezColor3("#3f8a36", os)); gr.addColorStop(1, mezColor3("#1d4d22", os));
  g.fillStyle = gr; g.beginPath(); g.arc(x, y - r * 1.1, r * 0.8, 0, Math.PI * 2); g.fill();
  g.restore();
}
const mezColor3 = (col, os) => k.mezColor(col, "#4b5462", os * 0.75);

// el mar, de la costa (y0 en pantalla) hacia la cámara
function mar(g, c, t, y0, o) {
  const os = o.oscuro || 0;
  const gr = g.createLinearGradient(0, y0, 0, 1920);
  gr.addColorStop(0, `rgb(${mezRgb("80,214,212", "84,120,128", os)})`);
  gr.addColorStop(0.25, `rgb(${mezRgb("22,160,190", "46,86,104", os)})`);
  gr.addColorStop(1, `rgb(${mezRgb("6,70,120", "18,38,58", os)})`);
  g.fillStyle = gr; g.fillRect(0, y0, 1080, 1920 - y0);
  // la espuma de la orilla
  g.fillStyle = "rgba(250,255,255,0.85)";
  for (let x = 0; x < 1080; x += 8) {
    const Z = COSTA - 0.6 - 0.4 * Math.sin(x * 0.03 + t * 2), P = pp(c, c.x + ((x - 540) * (Z - c.z)) / F, 0, Z);
    if (P) g.fillRect(x, P.y - 1, 9, Math.max(2, P.s * 0.06));
  }
  // la desembocadura: el agua dulce del río, más clara, que se abre en el mar
  for (let i = 0; i < 12; i++) {
    const z = COSTA - i * 1.2;
    const P = pp(c, rioX(0), 0, z);
    if (!P) continue;
    const w = (rioAncho(0) + i * 1.6) * P.s;
    g.fillStyle = `rgba(${mezRgb("150,226,250", "110,140,150", os)},${0.32 * (1 - i / 12)})`;
    g.beginPath(); g.ellipse(P.x, P.y, w / 2, Math.max(2, P.s * 0.8), 0, 0, Math.PI * 2); g.fill();
  }
  // las olas: crestas que van hacia la costa
  const alto = o.olas ?? 1, esp = 5, mov = (t * 3.2) % esp;
  for (let n = 30; n >= 0; n--) {
    const z = COSTA - 1 - n * esp + mov;
    if (z - c.z < 0.4) continue;
    const P = pp(c, 0, 0, z);
    if (!P || P.y < y0) continue;
    const s = P.s;
    g.save();
    // el lomo de la ola: un poco más oscuro detrás de la cresta y luz arriba
    g.fillStyle = `rgba(4,60,96,${0.18 * Math.min(1.5, alto)})`;
    g.beginPath(); g.moveTo(-10, P.y);
    for (let x = -10; x <= 1090; x += 30) g.lineTo(x, P.y - Math.min(90, s * 0.12) * alto * (1 + 0.5 * Math.sin(x / (120 + s * 0.35) + n * 1.7 + t)));
    g.lineTo(1090, P.y + Math.min(160, s * 0.25)); g.lineTo(-10, P.y + Math.min(160, s * 0.25)); g.closePath(); g.fill();
    g.strokeStyle = `rgba(235,252,255,${Math.min(0.75, 0.25 + s * 0.004) * alto})`; g.lineWidth = Math.min(10, Math.max(1, s * 0.05 * alto));
    g.beginPath();
    for (let x = -10; x <= 1090; x += 30) { const yy = P.y - Math.min(90, s * 0.12) * alto * (1 + 0.5 * Math.sin(x / (120 + s * 0.35) + n * 1.7 + t)); x < 0 ? g.moveTo(x, yy) : g.lineTo(x, yy); }
    g.stroke(); g.restore();
  }
  // la textura del agua
  g.save(); g.beginPath(); g.rect(0, y0, 1080, 1920 - y0); g.clip();
  g.globalCompositeOperation = "screen"; g.globalAlpha = 0.16 * (1 - os * 0.6);
  g.drawImage(k.causticas, -300 + 40 * Math.sin(t * 0.7), y0 - 100, 1680, 2300);
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.25; g.drawImage(k.manchas, -200, y0 - 50, 1480, 2100);
  g.restore();
  // los brillos del sol en el agua y, si hay, los granos de sal que se quedan en el mar
  g.save(); g.globalCompositeOperation = "lighter";
  for (const q of BRILLOS) {
    const P = pp(c, q.x + c.x, 0, q.z + COSTA);
    if (!P || P.y < y0) continue;
    const al = Math.max(0, Math.sin(t * q.v + q.f)) * 0.6 * (1 - os) * Math.min(1, (P.y - y0) / 40);
    if (al > 0.02) k.brillo(g, P.x, P.y, Math.max(8, P.s * 0.6), "255,250,225", al);
  }
  g.restore();
  if (o.salMar > 0) {
    const a = azar(4141);
    for (let i = 0; i < 90; i++) {
      const X = (a() - 0.5) * 60 + c.x, Z = COSTA - 3 - a() * 60, d = a();
      if (d > o.salMar) continue;
      const P = pp(c, X, -0.2, Z);
      if (!P || P.y < y0 + 4) continue;
      grano(g, P.x, P.y, Math.min(40, Math.max(3, P.s * 0.4)), t, i * 13, Math.min(1, (o.salMar - d) * 6) * (o.salMarAl ?? 1));
    }
  }
}

// ---------------------------------------------------------------- la sal
// Un cristal de sal: un cubito blanco translúcido con su cara de luz, su cara de sombra y un destello que gira.
export function grano(g, x, y, r, t, sem = 1, al = 1, destello = 1) {
  if (al <= 0.01 || r < 0.8) return;
  const a = azar(sem), giro = a() * 6.28 + t * (a() - 0.5) * 1.2;
  g.save(); g.globalAlpha *= al; g.translate(x, y); g.rotate(giro * 0.3);
  const s = r;
  // tres caras de un cubo en isométrica
  g.fillStyle = "#ffffff";
  g.beginPath(); g.moveTo(0, -s); g.lineTo(s * 0.87, -s * 0.5); g.lineTo(0, 0); g.lineTo(-s * 0.87, -s * 0.5); g.closePath(); g.fill();
  g.fillStyle = "#d8e8f4";
  g.beginPath(); g.moveTo(-s * 0.87, -s * 0.5); g.lineTo(0, 0); g.lineTo(0, s); g.lineTo(-s * 0.87, s * 0.5); g.closePath(); g.fill();
  g.fillStyle = "#9fbdd6";
  g.beginPath(); g.moveTo(s * 0.87, -s * 0.5); g.lineTo(0, 0); g.lineTo(0, s); g.lineTo(s * 0.87, s * 0.5); g.closePath(); g.fill();
  g.restore();
  if (destello > 0) {
    const d = Math.max(0, Math.sin(t * 2.2 + sem)) * destello * al;
    if (d > 0.05) {
      g.save(); g.globalCompositeOperation = "lighter";
      k.brillo(g, x - r * 0.3, y - r * 0.5, r * 5, "255,255,255", 0.55 * d);
      g.strokeStyle = `rgba(255,255,255,${0.8 * d})`; g.lineWidth = Math.max(1, r * 0.12);
      const L = r * 2.6 * d;
      g.beginPath(); g.moveTo(x - r * 0.3 - L, y - r * 0.5); g.lineTo(x - r * 0.3 + L, y - r * 0.5); g.moveTo(x - r * 0.3, y - r * 0.5 - L); g.lineTo(x - r * 0.3, y - r * 0.5 + L); g.stroke();
      g.restore();
    }
  }
}

// ---------------------------------------------------------------- la lluvia
const GOTAS = Array.from({ length: 220 }, (_, i) => { const a = azar(700 + i); return { x: a() * 1300 - 110, y0: a() * 2400, v: 2300 + a() * 900, l: 50 + a() * 90, w: 1.5 + a() * 2.5 }; });
// al: cuánta lluvia (0-1); se ven caer las rayas inclinadas, más largas y gruesas las de delante.
export function lluvia(g, t, al = 1, desde = 0) {
  if (al <= 0.01) return;
  g.save(); g.lineCap = "round";
  GOTAS.forEach((q, i) => {
    if (i / GOTAS.length > al) return;
    const y = ((q.y0 + (t - desde) * q.v) % 2400) - 240, x = q.x - (y * 0.12);
    const gr = g.createLinearGradient(x, y - q.l, x, y);
    gr.addColorStop(0, "rgba(210,230,255,0)"); gr.addColorStop(1, "rgba(225,240,255,0.75)");
    g.strokeStyle = gr; g.lineWidth = q.w;
    g.beginPath(); g.moveTo(x + q.l * 0.12, y - q.l); g.lineTo(x, y); g.stroke();
  });
  g.restore();
}

// ---------------------------------------------------------------- el subtítulo
// Un velo oscuro suave detrás del subtítulo (arriba), para que se lea sobre el cielo claro.
export function velo(g, al = 0.5) {
  const gr = g.createLinearGradient(0, 0, 0, 660);
  gr.addColorStop(0, `rgba(4,16,34,${al * 0.5})`); gr.addColorStop(0.6, `rgba(4,16,34,${al})`); gr.addColorStop(1, "rgba(4,16,34,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 1080, 660);
}
