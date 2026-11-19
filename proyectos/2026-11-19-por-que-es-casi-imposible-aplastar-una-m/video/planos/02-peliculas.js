// «Tus ojos captan unas 60 imágenes por segundo. Los de la mosca, unas 250: más de cuatro veces más.»
// Otro sitio: las películas de los ojos. Corte en «Tus».
// - «Tus ojos»: un ojo humano grande arriba; de él sale una tira de película que baja, con la mano bajando hacia la
//   mosca en saltos grandes, un fotograma por casilla. «60»: su cifra.
// - «Los de la mosca»: la cámara se aleja a la izquierda y entra, a la derecha, la cabeza de la mosca con sus dos ojos
//   rojos y su tira: en el mismo espacio caben cuatro fotogramas por cada uno del humano, y la mano avanza a pasitos.
// - «250»: su cifra corre de 60 a 250. «cuatro veces»: «×4» entre las dos tiras. Antes del corte, todo se calma.
import * as k from "#kit";
import { v } from "#voz";
import { cocina, mosca, mano, FACETAS } from "../mundo.js";

export const desde = "tus";
export const entrada = "corte";
const { suave: su, tramo: tr, mez, entra } = k;
const TAU = Math.PI * 2;
const f3 = v.frase(3), f4 = v.frase(4);
const T0 = f3.inicio, T60 = f3.t("60"), T1 = f4.inicio, T250 = f4.t("250"), Tx4 = f4.t("cuatro"), Fin = f4.fin;
export const momentos = { sesenta: T60, entraMosca: T1, d250: T250, x4: Tx4 };

// Los fotogramas: la mano bajando hacia la mosca, en 48 pasos (se hacen la primera vez que hacen falta).
const N = 48, LADO = 300;
let FOTOS = null;
function fotos() {
  const big = k.lienzo(1080, 1920), c = big.getContext("2d");
  return Array.from({ length: N }, (_, i) => {
    const u = i / (N - 1);
    c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = "source-over";
    cocina(c, 1150);
    mosca(c, 520, 1330, 660, { t: i * 0.05, frota: 1 });
    mano(c, 540, mez(-180, 560, u), mez(620, 720, u), mez(0.62, 0.42, u), 1, Math.PI);
    const f = k.lienzo(LADO, LADO); f.getContext("2d").drawImage(big, -10, 380, 1100, 1100, 0, 0, LADO, LADO);
    return k.fijar(f);
  });
}

// Una tira de película que baja desde y0: casillas de LADO (o de LADO/2 en 2 × 2 si es la de la mosca).
function tira(g, cx, y0, esc, t, densa, al = 1) {
  FOTOS ??= fotos();
  const W = (LADO + 80) * esc, paso = (LADO + 24) * esc, vel = 260;
  const d = Fin - 0.65, te = t < d ? t - T0 : d - T0 + 0.3 * (1 - Math.pow(1 - tr(t, d, d + 0.6), 2)); // frena antes del corte
  const s = (te * vel * esc) / paso; // casillas que ya han salido
  g.save(); g.globalAlpha *= al;
  g.beginPath(); g.rect(cx - W / 2 - 4, y0, W + 8, 1920 - y0); g.clip();
  // la película
  const pg = g.createLinearGradient(cx - W / 2, 0, cx + W / 2, 0);
  pg.addColorStop(0, "#121216"); pg.addColorStop(0.5, "#24242c"); pg.addColorStop(1, "#0d0d10");
  g.fillStyle = pg; g.fillRect(cx - W / 2, y0, W, 1920 - y0);
  // las perforaciones, que bajan con ella
  const off = ((s % 1) * paso), hueco = paso / 4;
  g.fillStyle = "rgba(230,230,240,0.85)";
  for (let y = y0 - paso + off; y < 1920; y += hueco) for (const lx of [cx - W / 2 + 12 * esc, cx + W / 2 - 26 * esc]) { k.redondo(g, lx, y + hueco * 0.3, 14 * esc, hueco * 0.4, 3 * esc); g.fill(); }
  // las casillas
  const m0 = Math.floor(s), cuantos = Math.ceil((1920 - y0) / paso) + 1;
  for (let j = 0; j <= cuantos; j++) {
    const m = m0 - j, y = y0 + (s - m - 1) * paso + 12 * esc;
    const x = cx - (LADO * esc) / 2, L = LADO * esc;
    if (densa) {
      for (let q = 0; q < 4; q++) {
        const idx = (((m * 4 + q) * 1) % N + N) % N, qx = x + (q % 2) * (L / 2 + 2 * esc), qy = y + Math.floor(q / 2) * (L / 2 + 2 * esc);
        g.drawImage(FOTOS[idx], qx, qy, L / 2 - 2 * esc, L / 2 - 2 * esc);
      }
    } else {
      const idx = ((m * 4) % N + N) % N;
      g.drawImage(FOTOS[idx], x, y, L, L);
    }
    g.strokeStyle = "rgba(0,0,0,0.6)"; g.lineWidth = 3; g.strokeRect(x, y, L, L);
  }
  // brillo de la película
  g.globalCompositeOperation = "screen";
  const bg = g.createLinearGradient(cx - W / 2, 0, cx + W / 2, 0); bg.addColorStop(0.15, "rgba(255,255,255,0)"); bg.addColorStop(0.3, "rgba(255,255,255,0.1)"); bg.addColorStop(0.45, "rgba(255,255,255,0)");
  g.fillStyle = bg; g.fillRect(cx - W / 2, y0, W, 1920 - y0);
  g.restore();
}

// Un ojo humano, de frente. w: su ancho.
function ojoHumano(g, x, y, w, abre = 1) {
  g.save(); g.translate(x, y); g.scale(w, w);
  // la piel alrededor
  g.save(); g.scale(1, 0.6);
  const sk = g.createRadialGradient(0, 0, 0.1, 0, 0, 0.85); sk.addColorStop(0, "rgba(217,154,116,1)"); sk.addColorStop(0.55, "rgba(190,120,84,1)"); sk.addColorStop(1, "rgba(150,90,60,0)");
  g.fillStyle = sk; g.beginPath(); g.arc(0, 0, 0.85, 0, TAU); g.fill(); g.restore();
  // la forma del ojo (almendra), que se abre
  const a = 0.26 * abre;
  const almendra = () => { g.beginPath(); g.moveTo(-0.5, 0.02); g.bezierCurveTo(-0.25, -a * 1.3, 0.25, -a * 1.3, 0.5, -0.02); g.bezierCurveTo(0.25, a * 0.95, -0.25, a * 0.95, -0.5, 0.02); g.closePath(); };
  // el pliegue del párpado
  g.strokeStyle = "rgba(110,55,35,0.6)"; g.lineWidth = 0.02; g.beginPath(); g.moveTo(-0.52, -0.05); g.bezierCurveTo(-0.25, -0.46, 0.28, -0.46, 0.54, -0.08); g.stroke();
  almendra(); g.save(); g.clip();
  const sc = g.createRadialGradient(0, 0, 0.05, 0, 0, 0.55); sc.addColorStop(0, "#ffffff"); sc.addColorStop(0.7, "#ece6e6"); sc.addColorStop(1, "#c9a8a4");
  g.fillStyle = sc; g.fillRect(-0.6, -0.4, 1.2, 0.8);
  // el iris
  const ir = g.createRadialGradient(0, 0, 0.04, 0, 0, 0.2); ir.addColorStop(0, "#6b4a24"); ir.addColorStop(0.45, "#4f8a5a"); ir.addColorStop(0.85, "#2f5e48"); ir.addColorStop(1, "#14241c");
  g.fillStyle = ir; g.beginPath(); g.arc(0, 0, 0.2, 0, TAU); g.fill();
  g.strokeStyle = "rgba(200,230,180,0.25)"; g.lineWidth = 0.005;
  for (let i = 0; i < 48; i++) { const an = (i / 48) * TAU; g.beginPath(); g.moveTo(Math.cos(an) * 0.08, Math.sin(an) * 0.08); g.lineTo(Math.cos(an + 0.05) * 0.19, Math.sin(an + 0.05) * 0.19); g.stroke(); }
  g.fillStyle = "#050505"; g.beginPath(); g.arc(0, 0, 0.085, 0, TAU); g.fill();
  g.fillStyle = "rgba(255,255,255,0.9)"; g.beginPath(); g.ellipse(-0.06, -0.07, 0.04, 0.03, -0.5, 0, TAU); g.fill();
  // la sombra del párpado de arriba
  const ps = g.createLinearGradient(0, -a, 0, 0); ps.addColorStop(0, "rgba(60,20,10,0.5)"); ps.addColorStop(1, "rgba(60,20,10,0)");
  g.fillStyle = ps; g.fillRect(-0.6, -0.4, 1.2, 0.4);
  g.restore();
  g.strokeStyle = "rgba(70,30,20,0.8)"; g.lineWidth = 0.014; almendra(); g.stroke();
  // las pestañas
  g.strokeStyle = "#1a0f0a"; g.lineCap = "round"; g.lineWidth = 0.009;
  for (let i = 0; i <= 16; i++) {
    const u = i / 16, px = mez(-0.45, 0.47, u), py = -a * 1.3 * 0.75 * Math.sin(Math.PI * mez(0.06, 0.94, u)), dx = (u - 0.5) * 0.12;
    g.beginPath(); g.moveTo(px, py); g.quadraticCurveTo(px + dx, py - 0.08, px + dx * 2.2, py - 0.1); g.stroke();
  }
  g.restore();
}

// La cabeza de la mosca de frente: dos ojos rojos enormes hechos de facetas.
function cabezaMosca(g, x, y, w) {
  g.save(); g.translate(x, y); g.scale(w, w);
  const hg = g.createRadialGradient(0, -0.05, 0.05, 0, 0, 0.5); hg.addColorStop(0, "#77707a"); hg.addColorStop(1, "#1a171b");
  g.fillStyle = hg; g.beginPath(); g.ellipse(0, 0.02, 0.5, 0.38, 0, 0, TAU); g.fill();
  for (const sx of [-1, 1]) {
    g.save(); g.translate(sx * 0.26, -0.02);
    g.beginPath(); g.ellipse(0, 0, 0.25, 0.33, sx * 0.25, 0, TAU);
    const eg = g.createRadialGradient(-sx * 0.06, -0.12, 0.01, 0, 0, 0.36); eg.addColorStop(0, "#f06a52"); eg.addColorStop(0.4, "#b2251c"); eg.addColorStop(0.85, "#560c08"); eg.addColorStop(1, "#2a0504");
    g.fillStyle = eg; g.fill();
    g.save(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha *= 0.6; g.drawImage(FACETAS, -0.3, -0.36, 0.5, 0.5); g.drawImage(FACETAS, -0.3, 0.12, 0.5, 0.5); g.drawImage(FACETAS, 0.18, -0.36, 0.5, 0.5); g.drawImage(FACETAS, 0.18, 0.12, 0.5, 0.5); g.restore();
    g.save(); g.globalCompositeOperation = "lighter"; const bg = g.createRadialGradient(-sx * 0.08, -0.14, 0, -sx * 0.08, -0.14, 0.12); bg.addColorStop(0, "rgba(255,225,215,0.7)"); bg.addColorStop(1, "rgba(255,225,215,0)"); g.fillStyle = bg; g.fillRect(-0.3, -0.4, 0.6, 0.8); g.restore();
    g.restore();
  }
  // la cara entre los ojos y las antenas
  g.fillStyle = "#2d2830"; g.beginPath(); g.ellipse(0, 0.12, 0.07, 0.18, 0, 0, TAU); g.fill();
  g.strokeStyle = "#141114"; g.lineWidth = 0.025; g.lineCap = "round";
  for (const sx of [-1, 1]) { g.beginPath(); g.moveTo(sx * 0.03, -0.02); g.lineTo(sx * 0.07, 0.1); g.stroke(); }
  g.restore();
}

export function dibuja(g, t) {
  // el fondo: una sala oscura, azulada, con luz detrás de los ojos
  const bg = g.createLinearGradient(0, 0, 0, 1920); bg.addColorStop(0, "#0b1022"); bg.addColorStop(1, "#05060c");
  g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920);
  const sep = su(tr(t, T1 - 0.05, T1 + 0.6));            // la cámara se aleja: el humano a la izquierda
  const hx = mez(540, 290, sep), he = mez(1, 0.74, sep);
  const mx = mez(1400, 790, entra(tr(t, T1, T1 + 0.7)));
  k.brillo(g, hx, 700, 900 * he, "90,170,255", 0.45);
  if (t > T1) k.brillo(g, mx, 700, 700, "255,90,70", 0.45);
  // las tiras
  const y0 = mez(900, 860, sep);
  tira(g, hx, y0, he, t, false);
  if (t > T1) tira(g, mx, 860, 0.74, t, true);
  // los ojos, encima
  const abre = entra(tr(t, T0 - 0.05, T0 + 0.35));
  ojoHumano(g, hx, mez(690, 700, sep), 520 * he, mez(0.35, 1, abre));
  if (t > T1) cabezaMosca(g, mx, 690, 330);
  // las cifras
  const a60 = entra(tr(t, T60 - 0.1, T60 + 0.2));
  k.pastilla(g, hx, mez(900, 860, sep), "60", "", "120,210,255", a60, mez(110, 90, sep));
  if (t > T1) {
    const cuenta = Math.round(mez(60, 250, su(tr(t, T250 - 0.3, T250 + 0.35))));
    k.pastilla(g, mx, 860, String(cuenta), "", "255,120,95", entra(tr(t, T1 + 0.4, T1 + 0.7)), 90);
  }
  const ax4 = entra(tr(t, Tx4 - 0.1, Tx4 + 0.25));
  if (ax4 > 0) {
    g.save(); g.globalAlpha = ax4; g.translate(540, 1180); g.scale(mez(1.6, 1, ax4), mez(1.6, 1, ax4));
    g.font = "900 120px Figtree"; g.textAlign = "center"; g.textBaseline = "middle";
    g.shadowColor = "rgba(255,200,80,0.9)"; g.shadowBlur = 40; g.fillStyle = "#ffd25a"; g.fillText("×4", 0, 0);
    g.restore();
  }
  // velo para el subtítulo
  const vg = g.createLinearGradient(0, 200, 0, 560); vg.addColorStop(0, "rgba(5,6,12,0.6)"); vg.addColorStop(1, "rgba(5,6,12,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 560);
}
