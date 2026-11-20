// PLANTILLA: lyric video de Michi Lyrics (se copia a video/planos/01-letra.js; la prepara piezas/lyric/preparar.mjs).
// El video del creador de fondo, en bucle (fondo/f/), en blanco y negro y con un golpe de zoom en cada beat; la letra
// grande en el centro, palabra a palabra, como mucho 3 filas por pantalla, y la palabra clave de cada línea enorme y en
// color. Al final, la letra se va y la imagen se desvanece a negro con la música.
// Se ajusta en guion.json, "lyric": { "bn": true, "funde": <segundo del video>, "marca": true }.
import * as k from "#kit";
import { v } from "#voz";
import { loadImage, GlobalFonts } from "@napi-rs/canvas";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { marcaDeAgua } from "#piezas/marca-agua.js";

export const desde = 0;

const raiz = new URL("../../", import.meta.url);
const L = JSON.parse(readFileSync(new URL("guion.json", raiz), "utf8")).lyric || {};
const BN = L.bn !== false;                       // blanco y negro (la letra sigue a color)
const FUNDE = L.funde ?? v.duracion - 1.2;       // donde empieza el desvanecido (el mismo que el de la música)
const MARCA = L.marca !== false;                 // marca de agua Michi Lyrics

// el ritmo
const ritmo = existsSync(new URL("audio/golpes.json", raiz)) ? JSON.parse(readFileSync(new URL("audio/golpes.json", raiz), "utf8")) : { golpes: [] };
function beat(t) {
  let m = 0;
  for (const b of ritmo.golpes) { if (b > t) break; m = Math.max(m, Math.exp(-(t - b) / 0.16)); }
  return m;
}

// el color de cada línea: uno por frase, y de una a otra se funde
const PALETA = [[255, 40, 60], [255, 190, 40], [150, 70, 255], [40, 200, 255], [255, 40, 150], [60, 255, 120], [255, 120, 40], [255, 210, 80]];
function colorEn(t) {
  const fs = v.frases;
  let i = 0;
  while (i + 1 < fs.length && t >= fs[i + 1].inicio - 0.15) i++;
  const a = PALETA[Math.max(0, i - 1) % PALETA.length], b = PALETA[i % PALETA.length];
  const u = i === 0 ? 1 : k.suave(k.tramo(t, fs[i].inicio - 0.15, fs[i].inicio + 0.25));
  return a.map((x, j) => Math.round(k.mez(x, b[j], u)));
}

// el video de fondo: sus fotogramas (ya en vertical, 540 × 960, a 30 fps), cargados una vez
const carpeta = new URL("fondo/f/", raiz);
const cuadros = existsSync(carpeta)
  ? await Promise.all(readdirSync(carpeta).filter((f) => f.endsWith(".jpg")).sort().map((f) => loadImage(new URL(f, carpeta).pathname)))
  : [];
const FPS_FONDO = 30;

const CX = 515, ANCHO_MAX = 870;
const rgb = (c, a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

// --- el fondo: el video en bucle, con el color de la línea encima y un golpe de zoom en cada beat
function fondo(g, t, col, b) {
  const zoom = 1.04 + 0.04 * b;
  if (cuadros.length) {
    const img = cuadros[Math.floor(t * FPS_FONDO) % cuadros.length];
    g.save();
    g.translate(540, 960); g.scale(zoom, zoom); g.translate(-540, -960);
    g.drawImage(img, 0, 0, 1080, 1920);
    g.restore();
  } else {
    // sin video de fondo: un degradado oscuro con el color de la línea
    const d = g.createRadialGradient(540, 1000, 50, 540, 1000, 1300);
    d.addColorStop(0, rgb(col.map((x) => x * 0.35))); d.addColorStop(1, "#050508");
    g.fillStyle = d; g.fillRect(0, 0, 1080, 1920);
  }
  // el color de la línea, mezclado con la imagen
  g.save();
  if (BN) {
    // blanco y negro: se le quita todo el color y se le sube un poco el contraste
    g.globalCompositeOperation = "saturation";
    g.fillStyle = "#808080"; g.fillRect(0, 0, 1080, 1920);
    g.globalCompositeOperation = "soft-light";
    g.globalAlpha = 0.5; g.fillStyle = "#000000"; g.fillRect(0, 0, 1080, 1920);
  } else {
    g.globalCompositeOperation = "color";
    g.globalAlpha = 0.35;
    g.fillStyle = rgb(col); g.fillRect(0, 0, 1080, 1920);
  }
  g.globalCompositeOperation = "source-over";
  g.globalAlpha = 1;
  // un poco más oscuro, para que la letra mande
  g.fillStyle = "rgba(0,0,0,0.28)"; g.fillRect(0, 0, 1080, 1920);
  // un destello del color en cada beat
  g.globalCompositeOperation = "lighter";
  const hal = g.createRadialGradient(540, 1900, 50, 540, 1900, 1100);
  hal.addColorStop(0, BN ? `rgba(255,255,255,${0.12 * b})` : rgb(col, 0.35 * b)); hal.addColorStop(1, rgb(col, 0));
  g.fillStyle = hal; g.fillRect(0, 0, 1080, 1920);
  g.restore();
  // viñeta
  const vi = g.createRadialGradient(540, 900, 300, 540, 960, 1250);
  vi.addColorStop(0, "rgba(0,0,0,0)"); vi.addColorStop(1, "rgba(0,0,0,0.7)");
  g.fillStyle = vi; g.fillRect(0, 0, 1080, 1920);
}

// --- la letra
// la letra: Figtree por defecto; otra con "lyric": { "fuente": "Anton" } (sus .ttf en letras/ del proyecto)
const FUENTES = { Anton: ["Anton-Regular.ttf", 400], "Bebas Neue": ["BebasNeue-Regular.ttf", 400], "Archivo Black": ["ArchivoBlack-Regular.ttf", 400], Oswald: ["Oswald.ttf", 700] };
const FAM = process.env.FUENTE || L.fuente || "Figtree";
if (FUENTES[FAM]) GlobalFonts.registerFromPath(new URL("letras/" + FUENTES[FAM][0], raiz).pathname, FAM);
const PESO = FUENTES[FAM]?.[1] ?? 800;
const fuente = (tam) => `${PESO} ${tam}px "${FAM}"`;
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
  // como mucho 3 filas en pantalla: las líneas largas se reparten en pantallas seguidas, parejas (4 → 2 + 2, 5 → 3 + 2)
  const n = Math.ceil(filas.length / 3), paginas = [];
  for (let j = 0, i0 = 0; j < n; j++) {
    const cuantas = Math.ceil((filas.length - i0) / (n - j));
    paginas.push(filas.slice(i0, i0 + cuantas)); i0 += cuantas;
  }
  const m = paginas.map((fs) => {
    const alto = fs.reduce((s, r) => s + r.tam * 1.08, 0);
    let y = 1060 - alto / 2;
    for (const r of fs) {
      const total = r.palabras.reduce((s, p) => s + p.ancho, 0) + 24 * (r.palabras.length - 1);
      let x = CX - total / 2;
      r.y = y + r.tam * 0.8;
      for (const p of r.palabras) { p.x = x + p.ancho / 2; p.y = r.y; p.tam = r.tam; x += p.ancho + 24; }
      y += r.tam * 1.08;
    }
    const ps = fs.flatMap((r) => r.palabras);
    return { inicio: ps[0].w.inicio, palabras: ps };
  });
  cache.set(f.n, m);
  return m;
}

function letra(g, t, col, b) {
  const fs = v.frases;
  // un velo oscuro detrás de la letra, para que se lea sobre la ciudad
  const ve = g.createRadialGradient(CX, 1060, 60, CX, 1060, 620);
  ve.addColorStop(0, "rgba(0,0,0,0.55)"); ve.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = ve; g.fillRect(0, 250, 1080, 1300);
  const pags = fs.flatMap((f) => maqueta(g, f));
  pags.forEach((pg, i) => {
    const sig = pags[i + 1];
    const a = pg.inicio - 0.12, z = sig ? sig.inicio - 0.1 : v.duracion + 1;
    if (t < a || t > z) return;
    const sal = sig ? k.sale(k.tramo(t, z - 0.16, z)) : k.suave(k.tramo(t, FUNDE + 0.3, FUNDE + 1.3)) ; // la última letra se va al empezar el desvanecido: luego, solo música
    const ps = pg.palabras;
    g.save();
    g.translate(CX, 1060); g.scale(1 + 0.25 * sal, 1 + 0.25 * sal); g.translate(-CX, -1060);
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
        g.shadowColor = rgb(col, 0.95 * (1 - sal)); g.shadowBlur = 40 + 30 * b; // la sombra no respeta globalAlpha
        g.fillStyle = rgb(col); g.fillText(p.texto, 0, 0);
        g.shadowBlur = 0;
        const brillo = g.createLinearGradient(0, -p.tam * 0.8, 0, 0);
        brillo.addColorStop(0, "rgba(255,255,255,0.75)"); brillo.addColorStop(0.55, "rgba(255,255,255,0)");
        g.fillStyle = brillo; g.fillText(p.texto, 0, 0);
      } else {
        g.shadowColor = `rgba(0,0,0,${0.85 * (1 - sal)})`; g.shadowBlur = 18; g.shadowOffsetY = 6;
        g.fillStyle = sonando ? "#ffffff" : "rgba(235,235,245,0.82)";
        g.fillText(p.texto, 0, 0);
        if (sonando) { g.shadowColor = rgb(col, 0.9 * (1 - sal)); g.shadowBlur = 26; g.shadowOffsetY = 0; g.fillText(p.texto, 0, 0); }
      }
      g.restore();
    }
    g.restore();
  });
}

// --- un fogonazo suave en cada palabra clave
function fogonazo(g, t) {
  for (const w of v.palabras) {
    if (!w.clave) continue;
    const d = t - (w.inicio - 0.04);
    if (d < 0 || d > 0.4) continue;
    g.save(); g.globalAlpha = 0.22 * Math.exp(-d / 0.08); g.fillStyle = "#ffffff"; g.fillRect(0, 0, 1080, 1920); g.restore();
  }
}

export function dibuja(g, t) {
  const col = colorEn(t), b = beat(t);
  fondo(g, t, col, b);
  fogonazo(g, t);
  if (process.env.SIN_LETRA !== "1") letra(g, t, col, b); // SIN_LETRA=1: para la portada
  if (MARCA && process.env.SIN_LETRA !== "1") marcaDeAgua(g);
  // al final, todo se desvanece a negro con la música (desde que acaba «hombre»)
  const negro = k.suave(k.tramo(t, FUNDE, v.duracion - 0.05));
  if (negro > 0) { g.fillStyle = `rgba(0,0,0,${negro})`; g.fillRect(0, 0, 1080, 1920); }
}
