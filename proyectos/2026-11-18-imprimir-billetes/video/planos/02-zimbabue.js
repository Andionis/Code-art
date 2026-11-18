// «Zimbabue lo intentó, y terminó imprimiendo un billete de cien billones.»
// - «Zimbabue»: corte a un billete naranja y azul, grande, que entra deslizándose: «ZIMBABUE · 100 DÓLARES».
// - De «terminó» a «billones»: se le suman ceros, uno tras otro, con un golpe de luz cada uno; el billete se estira y
//   la cámara lo sigue hacia la derecha.
// - Tras «billones»: la cámara se aleja hasta ver el billete entero, 100.000.000.000.000, y reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { su, tr } from "../mundo.js";

export const desde = "zimbabue";

const f2 = v.frase(2);
const T0 = f2.inicio, Tterm = f2.t("termino"), Tbil = f2.t("billones"), Tfin = v.frase(3).inicio;

// los trozos que se van sumando tras el «100»: cuatro grupos «.000»
const TOK = [];
for (let gI = 0; gI < 4; gI++) { TOK.push("."); TOK.push("0", "0", "0"); }
const Tz0 = f2.t("intento") + 0.1, Tz1 = Tbil + 0.35;               // el primer cero y el último
const tTok = TOK.map((_, i) => k.mez(Tz0, Tz1, Math.pow(i / (TOK.length - 1), 0.85)));
const FT = 190;                                             // el alto de las cifras
const H = 520, PADL = 120, PADR = 150;                      // el alto del billete y sus márgenes

let anchos = null;                                          // se miden la primera vez (nunca fillText al cargar)
function medir(g) {
  g.font = `900 ${FT}px Figtree`;
  return { cien: g.measureText("100").width, tok: TOK.map((s) => g.measureText(s).width) };
}
const crece = (t, i) => k.entra(tr(t, tTok[i], tTok[i] + 0.16));
function textoFin(t) { let w = anchos.cien; TOK.forEach((_, i) => (w += anchos.tok[i] * crece(t, i))); return w; }

const azB = k.azar(77);
const BOKEH = Array.from({ length: 34 }, () => ({ x: azB() * 1300 - 110, y: azB() * 1920, r: 30 + azB() * 110, c: azB() < 0.5 ? "255,170,80" : "120,200,255", f: azB() * 6.28 }));

function fondo(g, t, ox) {
  const bg = g.createRadialGradient(540, 960, 100, 540, 960, 1300);
  bg.addColorStop(0, "#5a2a10"); bg.addColorStop(0.5, "#2a1206"); bg.addColorStop(1, "#0a0402");
  g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920);
  for (const b of BOKEH) {
    const x = ((((b.x - ox * 0.35) % 1300) + 1300) % 1300) - 110;
    k.brillo(g, x, b.y + 20 * Math.sin(t * 0.8 + b.f), b.r * 2.2, b.c, 0.35);
  }
}

function dibujaBillete(g, W, t) {
  // la sombra
  g.save(); g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 60; g.shadowOffsetY = 40;
  k.redondo(g, 0, 0, W, H, 26);
  const bg = g.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#f2a24a"); bg.addColorStop(0.45, "#ffe1a6"); bg.addColorStop(0.7, "#9fd0e0"); bg.addColorStop(1, "#2f6f8a");
  g.fillStyle = bg; g.fill(); g.restore();
  g.save(); k.redondo(g, 0, 0, W, H, 26); g.clip();
  g.lineWidth = 2;
  for (let i = 0; i < 30; i++) {
    g.strokeStyle = `rgba(${i % 2 ? "255,250,235" : "120,60,20"},0.28)`;
    g.beginPath();
    for (let x = 0; x <= W; x += 10) { const y = 30 + i * 16 + 12 * Math.sin(x / 40 + i * 0.6) + 6 * Math.sin(x / 13 + i); x ? g.lineTo(x, y) : g.moveTo(x, y); }
    g.stroke();
  }
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.2; g.drawImage(k.manchas, 0, 0, W, H);
  g.restore();
  g.strokeStyle = "#5a2a0c"; g.lineWidth = 10; k.redondo(g, 22, 22, W - 44, H - 44, 16); g.stroke();
  g.strokeStyle = "rgba(255,250,235,0.8)"; g.lineWidth = 3; k.redondo(g, 38, 38, W - 76, H - 76, 12); g.stroke();
  // el encabezado
  g.fillStyle = "#4a1e06"; g.textBaseline = "alphabetic"; g.textAlign = "left";
  g.font = "900 64px Figtree"; g.fillText("ZIMBABUE", PADL, 126);
  g.font = "800 58px Figtree"; g.fillText("DÓLARES", PADL, H - 72);
  // un brillo de papel satinado que pasa
  const sx = ((t - T0) * 900) % (W + 800) - 400, sg = g.createLinearGradient(sx - 200, 0, sx + 200, H);
  sg.addColorStop(0, "rgba(255,255,255,0)"); sg.addColorStop(0.5, "rgba(255,255,255,0.22)"); sg.addColorStop(1, "rgba(255,255,255,0)");
  g.save(); k.redondo(g, 0, 0, W, H, 26); g.clip(); g.fillStyle = sg; g.fillRect(0, 0, W, H); g.restore();
}

export function dibuja(g, t) {
  anchos ??= medir(g);
  const tf = textoFin(t), W = PADL + tf + PADR, Wfin = PADL + anchos.cien + anchos.tok.reduce((a, b) => a + b, 0) + PADR;
  // la cámara: al principio, el billete centrado; luego sigue a la última cifra; al final, se aleja hasta verlo entero
  const Zf = 1060 / Wfin, uz = su(tr(t, Tbil + 0.4, Tbil + 0.95));
  const sigue = Math.max(W / 2, PADL + tf - 300);
  const camX = k.mez(sigue, Wfin / 2, uz), Z = k.mez(1.25 + 0.12 * su(tr(t, T0, Tz0 + 1)), Zf, uz);
  const entra = 1 - k.entra(tr(t, T0 - 0.32, T0 + 0.3));    // el billete llega deslizándose desde la derecha
  fondo(g, t, camX * Z);
  g.save();
  g.translate(540 + entra * 700, 1010);
  g.rotate(k.mez(-0.05, -0.4, uz) + entra * 0.1);
  g.scale(Z, Z);
  g.translate(-camX, -H / 2);
  dibujaBillete(g, W, t);
  // las cifras: «100» y los trozos que se van sumando, cada uno con su golpe
  g.font = `900 ${FT}px Figtree`; g.textBaseline = "alphabetic"; g.textAlign = "left";
  const by = H / 2 + FT * 0.36;
  g.fillStyle = "#3a1504"; g.fillText("100", PADL, by);
  let x = PADL + anchos.cien;
  TOK.forEach((s, i) => {
    const c = crece(t, i);
    if (c <= 0) return;
    g.save(); g.translate(x + (anchos.tok[i] * c) / 2, by - FT * 0.36); g.scale(0.4 + 0.6 * c + 0.25 * k.pulso(t, tTok[i] + 0.1, 0.06), 0.4 + 0.6 * c + 0.25 * k.pulso(t, tTok[i] + 0.1, 0.06));
    g.fillStyle = `rgba(58,21,4,${c})`; g.textAlign = "center"; g.fillText(s, 0, FT * 0.36); g.restore();
    if (s === "0") k.brillo(g, x + anchos.tok[i] / 2, by - FT * 0.36, 520, "255,220,140", 0.9 * k.pulso(t, tTok[i] + 0.06, 0.08));
    x += anchos.tok[i] * c;
  });
  g.restore();
  // velo para el subtítulo
  const vg = g.createLinearGradient(0, 180, 0, 640); vg.addColorStop(0, "rgba(10,4,2,0.5)"); vg.addColorStop(1, "rgba(10,4,2,0)"); g.fillStyle = vg; g.fillRect(0, 0, 1080, 640);
}

export const ceros = TOK.map((s, i) => (s === "0" ? tTok[i] + 0.06 : null)).filter((x) => x != null);
export const momentos = { entra: T0, aleja: Tbil + 0.4, fin: Tfin };
