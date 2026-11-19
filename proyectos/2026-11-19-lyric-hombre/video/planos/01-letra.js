// Toda la letra, de «Rompe» a «verde»: la ciudad de noche bajo la lluvia, con neón que cambia de color en cada línea y
// late con el beat; la letra grande en el centro, palabra a palabra, y la palabra clave enorme en el color de la línea.
import * as k from "#kit";
import { v } from "#voz";
import { beat, colorEn, capas, gotas, humos, grietas } from "../mundo.js";

export const desde = 0;

const CX = 515, ANCHO_MAX = 870;
const GRIETAS = grietas(3);
const rgb = (c, a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

// --- el fondo: cielo con neón, ciudad en tres capas, lluvia, calle mojada
function fondo(g, t, col, b) {
  const zoom = 1 + 0.08 * (t / v.duracion) + 0.018 * b;
  g.save();
  g.translate(540, 960); g.scale(zoom, zoom); g.translate(-540, -960);
  const cielo = g.createLinearGradient(0, 0, 0, 1920);
  cielo.addColorStop(0, "#04030a");
  cielo.addColorStop(0.45, rgb(col.map((x) => x * 0.22)));
  cielo.addColorStop(0.62, rgb(col.map((x) => x * 0.45)));
  cielo.addColorStop(0.7, "#05040c");
  cielo.addColorStop(1, "#020206");
  g.fillStyle = cielo; g.fillRect(-100, -100, 1280, 2120);
  // el resplandor de la ciudad
  g.globalCompositeOperation = "lighter";
  const hal = g.createRadialGradient(540, 1330, 50, 540, 1330, 900);
  hal.addColorStop(0, rgb(col, 0.35 + 0.25 * b)); hal.addColorStop(1, rgb(col, 0));
  g.fillStyle = hal; g.fillRect(-100, 300, 1280, 1700);
  g.globalCompositeOperation = "source-over";
  // los edificios: la capa de atrás más clara y lenta
  const suelo = 1360;
  capas.slice().reverse().forEach((eds, ci) => {
    const c = 2 - ci, par = (c + 1) * 14 * Math.sin(t * 0.25);
    const tono = [8 + c * 2, 7 + c * 2, 16 + c * 4];
    for (const e of eds) {
      const x = e.x + par, y = suelo - e.h;
      const lad = g.createLinearGradient(x, 0, x + e.w, 0);
      lad.addColorStop(0, rgb(tono)); lad.addColorStop(1, rgb(tono.map((q) => q * 0.6)));
      g.fillStyle = lad; g.fillRect(x, y, e.w, e.h);
      // el borde de neón que le da la luz de la calle
      g.fillStyle = rgb(col, 0.25 + 0.2 * b); g.fillRect(x, y, e.w, 3);
      if (e.antena) { g.fillStyle = rgb(tono); g.fillRect(x + e.w / 2 - 2, y - 60, 4, 60); g.fillStyle = `rgba(255,60,60,${0.5 + 0.5 * Math.sin(t * 3 + e.x)})`; g.beginPath(); g.arc(x + e.w / 2, y - 62, 5, 0, 6.28); g.fill(); }
      for (const [vx, vy, r] of e.ventanas) {
        const enc = r < 0.5 ? 0.85 : 0.25 + 0.5 * b * (r > 0.85 ? 1 : 0);
        g.fillStyle = r < 0.25 ? `rgba(255,214,150,${enc})` : rgb(col.map((q) => 120 + q * 0.5), enc * 0.7);
        g.fillRect(x + vx, y + vy, 12, 16);
      }
    }
  });
  // la calle mojada: el reflejo del neón
  const calle = g.createLinearGradient(0, suelo, 0, 1920);
  calle.addColorStop(0, rgb(col.map((x) => x * 0.35))); calle.addColorStop(0.15, "#06050c"); calle.addColorStop(1, "#020205");
  g.fillStyle = calle; g.fillRect(-100, suelo, 1280, 700);
  g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 9; i++) {
    const rx = 60 + i * 120 + 20 * Math.sin(i * 7.1);
    const re = g.createLinearGradient(0, suelo, 0, suelo + 420);
    re.addColorStop(0, rgb(col, 0.28 + 0.2 * b)); re.addColorStop(1, rgb(col, 0));
    g.fillStyle = re; g.fillRect(rx, suelo, 10 + (i % 3) * 8, 420);
  }
  // la lluvia
  g.strokeStyle = "rgba(200,210,255,0.22)"; g.lineWidth = 2;
  g.beginPath();
  for (const [x0, y0, vel, r] of gotas) {
    const y = ((y0 + t * 1400 * vel) % 2200) - 140, x = x0 - y * 0.12;
    g.moveTo(x, y); g.lineTo(x - 6, y + 40 + r * 30);
  }
  g.stroke();
  g.globalCompositeOperation = "source-over";
  g.restore();
  // viñeta
  const vi = g.createRadialGradient(540, 900, 300, 540, 960, 1250);
  vi.addColorStop(0, "rgba(0,0,0,0)"); vi.addColorStop(1, "rgba(0,0,0,0.7)");
  g.fillStyle = vi; g.fillRect(0, 0, 1080, 1920);
}

// --- la letra
const fuente = (tam) => `800 ${tam}px Figtree`;
const cache = new Map();
function maqueta(g, f) {
  if (cache.has(f.n)) return cache.get(f.n);
  const filas = [];
  let fila = null;
  const TAM = 104;
  for (const w of f.palabras) {
    const texto = w.texto.replace(/[.,:"]/g, "").toUpperCase();
    if (w.clave) {
      let tam = 230; g.font = fuente(tam);
      while (g.measureText(texto).width > ANCHO_MAX && tam > 120) { tam -= 6; g.font = fuente(tam); }
      filas.push({ tam, palabras: [{ w, texto, ancho: g.measureText(texto).width, clave: true }] });
      fila = null; continue;
    }
    g.font = fuente(TAM);
    const ancho = g.measureText(texto).width, hueco = 24;
    if (!fila || fila.ancho + hueco + ancho > ANCHO_MAX) { fila = { tam: TAM, palabras: [], ancho: -hueco }; filas.push(fila); }
    fila.palabras.push({ w, texto, ancho }); fila.ancho += hueco + ancho;
  }
  const alto = filas.reduce((s, r) => s + r.tam * 1.08, 0);
  let y = 900 - alto / 2;
  for (const r of filas) {
    const total = r.palabras.reduce((s, p) => s + p.ancho, 0) + 24 * (r.palabras.length - 1);
    let x = CX - total / 2;
    r.y = y + r.tam * 0.8;
    for (const p of r.palabras) { p.x = x + p.ancho / 2; p.y = r.y; p.tam = r.tam; x += p.ancho + 24; }
    y += r.tam * 1.08;
  }
  const m = filas.flatMap((r) => r.palabras);
  cache.set(f.n, m);
  return m;
}

function letra(g, t, col, b) {
  const fs = v.frases;
  // un velo oscuro detrás de la letra, para que se lea sobre la ciudad
  const ve = g.createRadialGradient(CX, 900, 60, CX, 900, 620);
  ve.addColorStop(0, "rgba(0,0,0,0.55)"); ve.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = ve; g.fillRect(0, 250, 1080, 1300);
  fs.forEach((f, i) => {
    const sig = fs[i + 1];
    const a = f.inicio - 0.12, z = sig ? sig.inicio - 0.1 : v.duracion + 1;
    if (t < a || t > z) return;
    const sal = sig ? k.sale(k.tramo(t, z - 0.16, z)) : 0;
    const ps = maqueta(g, f);
    g.save();
    g.translate(CX, 900); g.scale(1 + 0.25 * sal, 1 + 0.25 * sal); g.translate(-CX, -900);
    for (const p of ps) {
      const ta = p.w.inicio - 0.06;
      if (t < ta) continue;
      const u = k.entra(k.tramo(t, ta, ta + (p.clave ? 0.22 : 0.16)));
      const esc = (p.clave ? 1.5 : 1.22) - (p.clave ? 0.5 : 0.22) * u + (p.clave ? 0.06 * b : 0);
      const sonando = t >= p.w.inicio - 0.06 && t < p.w.fin + 0.08;
      g.save();
      g.globalAlpha = u * (1 - sal);
      g.translate(p.x, p.y - 30 * (1 - u)); g.scale(esc, esc);
      g.font = fuente(p.tam); g.textAlign = "center"; g.textBaseline = "alphabetic";
      if (p.clave) {
        g.shadowColor = rgb(col, 0.95); g.shadowBlur = 40 + 30 * b;
        g.fillStyle = rgb(col); g.fillText(p.texto, 0, 0);
        g.shadowBlur = 0;
        const brillo = g.createLinearGradient(0, -p.tam * 0.8, 0, 0);
        brillo.addColorStop(0, "rgba(255,255,255,0.75)"); brillo.addColorStop(0.55, "rgba(255,255,255,0)");
        g.fillStyle = brillo; g.fillText(p.texto, 0, 0);
      } else {
        g.shadowColor = "rgba(0,0,0,0.85)"; g.shadowBlur = 18; g.shadowOffsetY = 6;
        g.fillStyle = sonando ? "#ffffff" : "rgba(235,235,245,0.82)";
        g.fillText(p.texto, 0, 0);
        if (sonando) { g.shadowColor = rgb(col, 0.9); g.shadowBlur = 26; g.shadowOffsetY = 0; g.fillText(p.texto, 0, 0); }
      }
      g.restore();
    }
    g.restore();
  });
}

// --- «rompe»: un fogonazo y la pantalla se agrieta un momento
function rompe(g, t) {
  for (const n of [1, 2]) {
    const tr = v.t("rompe", n), d = t - (tr - 0.04);
    if (d < 0 || d > 0.9) continue;
    const al = 1 - k.tramo(d, 0.35, 0.9);
    g.save();
    g.globalAlpha = 0.55 * Math.exp(-d / 0.07);
    g.fillStyle = "#ffffff"; g.fillRect(0, 0, 1080, 1920);
    g.globalAlpha = al;
    g.translate(CX, 900);
    const crece = k.entra(k.tramo(d, 0, 0.12));
    g.strokeStyle = "rgba(255,255,255,0.85)"; g.lineWidth = 3; g.shadowColor = "rgba(255,80,90,0.9)"; g.shadowBlur = 14;
    for (const pts of GRIETAS) {
      const hasta = Math.max(2, Math.round(pts.length * crece));
      g.beginPath(); g.moveTo(pts[0][0], pts[0][1]);
      for (let j = 1; j < hasta; j++) g.lineTo(pts[j][0] * (n === 2 ? -1 : 1), pts[j][1]);
      g.stroke();
    }
    g.restore();
  }
}

// --- «verde»: humo verde que sube
function humo(g, t) {
  const tv = v.t("quemando") - 0.3;
  if (t < tv) return;
  const u = k.suave(k.tramo(t, tv, tv + 1.2));
  g.save(); g.globalCompositeOperation = "lighter";
  for (const [x0, r, rad, fase] of humos) {
    const y = 1700 - ((t - tv) * (90 + r * 120)) - r * 900;
    const x = x0 + 60 * Math.sin(t * 0.8 + fase);
    const gr = g.createRadialGradient(x, y, 0, x, y, rad);
    gr.addColorStop(0, `rgba(70,255,130,${0.16 * u})`); gr.addColorStop(1, "rgba(70,255,130,0)");
    g.fillStyle = gr; g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  g.restore();
}

export function dibuja(g, t) {
  const col = colorEn(t), b = beat(t);
  fondo(g, t, col, b);
  humo(g, t);
  rompe(g, t);
  letra(g, t, col, b);
}
