// Lo que comparten los planos de este vídeo:
// - cieloMar(g, t, o): el cielo enorme sobre el mar, con nubes en 3D, el Sol, unas islas y el brillo del Sol en el agua.
//   o.u: 0 mediodía → 1 atardecer (el color del cielo, del Sol, de las nubes y del mar). o.cam: la cámara (k.mira).
//   o.sol: la altura del Sol en grados (0 = tocando el mar). o.nubes: cuántas nubes (0-1).
// - espacio(g, ...): la Tierra desde el espacio con su capa de aire.
// - COLORES: los siete colores de la luz (rojo → violeta), como "r,g,b".
import * as k from "#kit";

const { mez, tramo, suave, azar } = k;

export const COLORES = ["255,60,50", "255,140,30", "255,225,60", "80,220,90", "40,200,255", "60,110,255", "150,80,255"];
export const AZUL = "70,150,255", ROJO = "255,70,55";

// ---------- el cielo ----------
// Colores del cielo en tres alturas (arriba, medio, horizonte), de mediodía a atardecer, pasando por la tarde.
const CIELO = [
  ["#0d3fa8", "#2f7ae0", "#a8d8ff"],
  ["#1d3c8f", "#6a8fd0", "#ffe3a0"],
  ["#3b2470", "#e0606a", "#ffb84a"],
  ["#3a1a5a", "#e8553a", "#ff9a2e"],
];
function tonoCielo(u, i) {
  const s = Math.min(2.999, u * 3), a = Math.floor(s), f = s - a;
  return k.mezColor(CIELO[a][i], CIELO[a + 1][i], f);
}
export const colorCielo = tonoCielo;

// Las nubes: sprites hechos una vez (de día y de atardecer), cada una con su forma.
function hacerNube(sem, dia) {
  const W = 640, H = 300, c = k.lienzo(W, H), x = c.getContext("2d"), az = azar(sem);
  const base = k.lienzo(W, H), b = base.getContext("2d");
  b.save(); b.beginPath(); b.rect(0, 0, W, 250); b.clip();
  const puffs = [];
  for (let i = 0; i < 70; i++) {
    const px = 70 + 500 * az(), cen = Math.max(0, 1 - Math.abs(px - 320) / 260);
    const r = 26 + 74 * cen * (0.5 + 0.5 * az());
    const py = 250 - r * (0.3 + 0.5 * az()) - 80 * cen * az();
    puffs.push({ px, py, r });
  }
  puffs.sort((a, b) => b.py - a.py);
  const luz = dia ? ["#ffffff", "#eef3fb", "#b8c8e2"] : ["#fff1cf", "#ffb877", "#c75a6e"];
  for (const p of puffs) {
    const gr = b.createRadialGradient(p.px - p.r * 0.3, p.py - p.r * 0.5, p.r * 0.05, p.px, p.py, p.r * 1.05);
    gr.addColorStop(0, luz[0]); gr.addColorStop(0.55, luz[1]); gr.addColorStop(1, luz[2]);
    b.fillStyle = gr; b.beginPath(); b.arc(p.px, p.py, p.r, 0, Math.PI * 2); b.fill();
  }
  b.restore();
  b.globalCompositeOperation = "source-atop";
  const sb = b.createLinearGradient(0, 80, 0, 250);
  if (dia) { sb.addColorStop(0, "rgba(150,175,215,0)"); sb.addColorStop(1, "rgba(110,135,190,0.7)"); }
  else { sb.addColorStop(0, "rgba(140,50,100,0)"); sb.addColorStop(1, "rgba(100,35,95,0.8)"); }
  b.fillStyle = sb; b.fillRect(0, 0, W, H);
  b.globalAlpha = 0.22; b.globalCompositeOperation = "source-atop"; b.drawImage(k.manchas, 0, 0, W, H);
  // suavizado: una copia desenfocada debajo y la nítida encima, algo transparente
  x.filter = "blur(10px)"; x.drawImage(base, 0, 0);
  x.filter = "blur(2px)"; x.drawImage(base, 0, 0);
  x.filter = "none";
  return c;
}
export const NUBES_DIA = [1, 2, 3, 4].map((s) => hacerNube(700 + s, true));
const NUBES_TARDE = [1, 2, 3, 4].map((s) => hacerNube(700 + s, false));

// Dónde están las nubes en el mundo (la cámara vuela por +z; el mar está en y = -60).
const azN = azar(4242);
export const NUBES = Array.from({ length: 110 }, (_, i) => {
  const lado = azN() < 0.5 ? -1 : 1, z = 30 + i * 18 + azN() * 30;
  return {
    x: lado * (14 + 0.07 * z + Math.pow(azN(), 1.5) * 300), y: -35 + azN() * 110, z,
    s: 40 + azN() * 90, v: i % 4,
  };
});

// El brillo del Sol en el agua: unos destellos alargados en columna bajo el Sol.
const azG = azar(5151);
const GLINT = Array.from({ length: 520 }, () => ({ v: azG(), x: (azG() + azG() + azG() - 1.5) * 0.9, f: azG() * 6.28, w: 0.5 + azG() }));

// Las islas del horizonte (siluetas), en coordenadas de ángulo (radianes a la izquierda/derecha del frente).
const ISLAS = [
  { a: -0.62, w: 0.32, h: 0.035 }, { a: -0.38, w: 0.16, h: 0.02 }, { a: 0.48, w: 0.4, h: 0.05 }, { a: 0.78, w: 0.18, h: 0.025 },
];

export function cieloMar(g, t, o = {}) {
  const u = o.u ?? 0, cam = o.cam ?? k.mira([0, 0, 0], [0, 0, 100]), nubes = o.nubes ?? 1;
  const solE = ((o.sol ?? 30) * Math.PI) / 180;
  const P = cam.p;
  const hz = k.proyecta(cam, [P[0], P[1], P[2] + 1e7]);
  const hy = hz ? hz.y : 960;
  // el cielo
  const top = Math.min(0, hy - 1400);
  const gc = g.createLinearGradient(0, top, 0, hy);
  gc.addColorStop(0, tonoCielo(u, 0)); gc.addColorStop(0.62, tonoCielo(u, 1)); gc.addColorStop(1, tonoCielo(u, 2));
  g.fillStyle = gc; g.fillRect(0, 0, 1080, Math.max(0, Math.min(1920, hy + 2)));
  // el Sol
  const sd = [0, Math.sin(solE), Math.cos(solE)];
  const sp = k.proyecta(cam, [P[0] + sd[0] * 1e7, P[1] + sd[1] * 1e7, P[2] + sd[2] * 1e7]);
  const solCol = k.mezRgb("255,250,225", "255,120,40", suave(tramo(u, 0.3, 1)));
  if (sp) {
    g.save(); g.globalCompositeOperation = "lighter";
    k.brillo(g, sp.x, sp.y, 1400 + 700 * u, solCol, 0.35 + 0.3 * u);
    k.brillo(g, sp.x, sp.y, 420, solCol, 0.55);
    g.restore();
    const rs = 78 + 30 * u;
    const gs = g.createRadialGradient(sp.x, sp.y - rs * 0.2, rs * 0.1, sp.x, sp.y, rs);
    gs.addColorStop(0, `rgb(${k.mezRgb("255,255,250", "255,220,140", u)})`); gs.addColorStop(1, `rgb(${k.mezRgb("255,244,200", "255,110,40", u)})`);
    g.fillStyle = gs; g.beginPath(); g.arc(sp.x, sp.y, rs, 0, Math.PI * 2); g.fill();
  }
  // las islas
  const isla = k.mezColor("#6d8fc0", "#3a1f45", suave(u));
  g.fillStyle = isla;
  for (const is of ISLAS) {
    const c = k.proyecta(cam, [P[0] + Math.sin(is.a) * 1e5, P[1], P[2] + Math.cos(is.a) * 1e5]);
    if (!c) continue;
    const w = k.F * Math.tan(is.w / 2), h = k.F * is.h;
    g.beginPath(); g.moveTo(c.x - w, hy + 1);
    for (let i = 0; i <= 16; i++) { const f = i / 16, y = hy - h * Math.sin(f * Math.PI) * (0.8 + 0.2 * Math.sin(f * 17 + is.a * 9)); g.lineTo(c.x - w + 2 * w * f, y); }
    g.lineTo(c.x + w, hy + 1); g.fill();
  }
  // el mar
  if (hy < 1920) {
    const gm = g.createLinearGradient(0, hy, 0, 1920);
    gm.addColorStop(0, k.mezColor("#7fb2e6", "#d9653a", suave(u)));
    gm.addColorStop(0.08, k.mezColor("#2a6cc0", "#7a2f55", suave(u)));
    gm.addColorStop(1, k.mezColor("#08306e", "#1c0c2e", suave(u)));
    g.fillStyle = gm; g.fillRect(0, hy, 1080, 1920 - hy);
    // destellos del Sol en el agua
    if (sp) {
      g.save(); g.globalCompositeOperation = "lighter";
      const col = k.mezRgb("255,255,255", "255,150,60", u);
      for (const gl of GLINT) {
        const y = hy + 4 + (1920 - hy) * Math.pow(gl.v, 1.7);
        const prof = (y - hy) / 900;
        const x = sp.x + gl.x * (40 + 520 * prof) * (0.5 + 0.5 * (1 - Math.min(1, Math.max(0, (hy - sp.y) / 900))));
        const a = (0.25 + 0.75 * Math.max(0, Math.sin(t * 5 + gl.f))) * (0.35 + 0.65 * u) * Math.exp(-gl.x * gl.x);
        g.fillStyle = `rgba(${col},${0.8 * a})`;
        const w = (6 + 60 * prof) * gl.w;
        g.fillRect(x - w / 2, y, w, 2 + 4 * prof);
      }
      g.restore();
    }
    // olas: un rayado suave
    g.save(); g.globalAlpha = 0.12; g.globalCompositeOperation = "multiply";
    for (let i = 0; i < 40; i++) { const f = i / 40, y = hy + (1920 - hy) * f * f; g.fillStyle = "#000"; g.fillRect(0, y, 1080, 1 + 6 * f); }
    g.restore();
  }
  // las nubes (de lejos a cerca)
  if (nubes > 0) {
    const lista = [];
    for (const n of NUBES) {
      const c = k.proyecta(cam, [n.x, n.y, n.z]);
      if (!c || c.z > 1800) continue;
      const w = (k.F * n.s * 2) / c.z;
      if (c.x + w < -100 || c.x - w > 1180) continue;
      lista.push({ z: c.z, dibuja: () => {
        const al = nubes * tramo(c.z, 4, 22) * (1 - tramo(c.z, 1300, 1800));
        if (al <= 0) return;
        const h = w * 0.47;
        g.save(); g.globalAlpha *= al;
        g.drawImage(NUBES_DIA[n.v], c.x - w / 2, c.y - h * 0.84, w, h);
        if (u > 0.01) { g.globalAlpha *= suave(Math.min(1, u * 1.3)); g.drawImage(NUBES_TARDE[n.v], c.x - w / 2, c.y - h * 0.84, w, h); }
        g.restore();
      } });
    }
    k.deLejosACerca(lista);
  }
  // una bruma cálida sobre todo al atardecer
  if (u > 0 && sp) {
    g.save(); g.globalCompositeOperation = "lighter";
    k.brillo(g, sp.x, hy, 2200, "255,110,40", 0.25 * u);
    g.restore();
  }
  return { hy, sol: sp };
}

// Una cámara para el cielo: en z, mirando adelante con una inclinación (grados, + arriba).
export function camCielo(z, incl = 0, x = 0, y = 0) {
  const a = (incl * Math.PI) / 180;
  return k.mira([x, y, z], [x, y + Math.sin(a) * 100, z + Math.cos(a) * 100]);
}

// ---------- el espacio: la Tierra con su capa de aire ----------
const ESTRELLAS = (() => { const az = azar(99), l = []; for (let i = 0; i < 500; i++) l.push({ x: az() * 1080, y: az() * 1920, r: 0.6 + az() * 1.8, a: 0.3 + az() * 0.7 }); return l; })();
export function fondoEspacio(g, t, dx = 0, dy = 0) {
  const gr = g.createRadialGradient(540, 700, 100, 540, 960, 1400);
  gr.addColorStop(0, "#0b1230"); gr.addColorStop(1, "#02030a");
  g.fillStyle = gr; g.fillRect(0, 0, 1080, 1920);
  for (const s of ESTRELLAS) {
    const x = (((s.x + dx * s.r) % 1080) + 1080) % 1080, y = (((s.y + dy * s.r) % 1920) + 1920) % 1920;
    g.fillStyle = `rgba(255,255,255,${s.a * (0.7 + 0.3 * Math.sin(t * 3 + s.x))})`;
    g.fillRect(x, y, s.r, s.r);
  }
}

// La Tierra en (x, y) con radio R, la luz desde (lx, ly), y su aire: un anillo azul de grosor aire·R.
export function tierraConAire(g, t, x, y, R, lx, ly, aire = 0.09) {
  const Ra = R * (1 + aire);
  // el aire: brillo azul por fuera
  const ga = g.createRadialGradient(x, y, R * 0.98, x, y, Ra * 1.06);
  ga.addColorStop(0, "rgba(120,190,255,0.95)"); ga.addColorStop(0.45, "rgba(70,150,255,0.55)"); ga.addColorStop(1, "rgba(40,100,255,0)");
  g.fillStyle = ga; g.beginPath(); g.arc(x, y, Ra * 1.06, 0, Math.PI * 2); g.fill();
  k.tierra(g, x, y, R, t * 0.03, lx, ly);
  // un velo azul sobre el borde del planeta
  const gv = g.createRadialGradient(x, y, R * 0.75, x, y, R);
  gv.addColorStop(0, "rgba(90,170,255,0)"); gv.addColorStop(1, "rgba(110,185,255,0.55)");
  g.fillStyle = gv; g.beginPath(); g.arc(x, y, R, 0, Math.PI * 2); g.fill();
}

// Una persona pequeña de pie (silueta clara), con los pies en (x, y), girada ang (radianes; 0 = de pie hacia arriba).
export function persona(g, x, y, h, ang = 0, col = "#ffffff") {
  g.save(); g.translate(x, y); g.rotate(ang); g.fillStyle = col; g.strokeStyle = col; g.lineCap = "round";
  g.lineWidth = h * 0.13;
  g.beginPath(); g.moveTo(-h * 0.12, 0); g.lineTo(0, -h * 0.45); g.lineTo(h * 0.12, 0); g.stroke();
  g.beginPath(); g.moveTo(0, -h * 0.45); g.lineTo(0, -h * 0.8); g.stroke();
  g.beginPath(); g.moveTo(-h * 0.2, -h * 0.55); g.lineTo(0, -h * 0.75); g.lineTo(h * 0.2, -h * 0.55); g.stroke();
  g.beginPath(); g.arc(0, -h * 0.9, h * 0.11, 0, Math.PI * 2); g.fill();
  g.restore();
}

// Un rayo de luz de A a B (pantalla), con un color que puede cambiar por el camino (lista de "r,g,b" en orden).
export function rayo(g, x0, y0, x1, y1, cols, ancho = 26, al = 1) {
  const gr = g.createLinearGradient(x0, y0, x1, y1);
  cols.forEach((c, i) => gr.addColorStop(cols.length === 1 ? 0 : i / (cols.length - 1), `rgba(${c},${al})`));
  if (cols.length === 1) gr.addColorStop(1, `rgba(${cols[0]},${al})`);
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
  g.strokeStyle = gr; g.globalAlpha = 0.35; g.lineWidth = ancho * 3; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
  g.globalAlpha = 1; g.lineWidth = ancho; g.stroke();
  g.strokeStyle = `rgba(255,255,255,${0.7 * al})`; g.lineWidth = ancho * 0.3; g.stroke();
  g.restore();
}
