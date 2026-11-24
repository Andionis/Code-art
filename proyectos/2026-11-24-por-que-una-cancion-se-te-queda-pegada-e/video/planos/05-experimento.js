// «Pero lo más raro es que no necesitas oírla para escucharla.
//  En un experimento, apagaron unos segundos de canciones conocidas, y la parte del cerebro que oye siguió encendida.
//  Tu cerebro rellenaba el hueco: la seguía cantando por dentro.»
// - La cabeza de luz grande, con un audífono en la oreja: entran ondas de sonido y la parte que oye se enciende.
// - «oírla»: el audífono se apaga y las ondas se van. «escucharla»: la parte que oye sigue encendida y late.
// - «experimento»: abajo, la canción en una cinta, con su cursor que avanza; el audífono vuelve a sonar.
// - «apagaron»: el cursor entra en un tramo plano (silencio): no llegan ondas, pero la parte que oye sigue encendida;
//   en «encendida» late fuerte.
// - «Tu cerebro»: la cámara baja a la cinta. «rellenaba»: bajan notas de oro de la cabeza y el hueco se llena de
//   barras de oro. Reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { NEON, cabeza, fondo, nota, velo } from "../mundo.js";

export const desde = "pero";

const { suave: su, tramo: tr, mez, azar, entra, pulso } = k;
const f6 = v.frase(6), f7 = v.frase(7), f8 = v.frase(8);
const Tini = f6.inicio, Toir = f6.t("oirla"), Tesc = f6.t("escucharla");
const Texp = f7.t("experimento"), Tapa = f7.t("apagaron"), Tenc = f7.t("encendida");
const Ttu = f8.inicio, Trel = f8.t("rellenaba"), Thue = f8.t("hueco"), Tcan = f8.t("cantando"), Tfin = f8.fin;

// la cabeza
const HX = 470, HY = 1010, S = 1050;
const OREJA = [HX + 0.14 * S, HY + 0.02 * S];
const OYE = [HX + 0.03 * S, HY - 0.1 * S];      // la parte del cerebro que oye (cerca de la oreja, por dentro)

// la cinta de abajo
const YC = 1390, X0 = 110, X1 = 980, G0 = 330, G1 = 640;
const VEL = (G1 - G0) / 1.9;                      // el silencio dura ~1,9 s
const TG0 = Tapa - 0.05;                           // el cursor entra en el silencio en «apagaron»
const tCursor = (x) => TG0 + (x - G0) / VEL;
const cursor = (t) => G0 + (t - TG0) * VEL;
const TC0 = tCursor(X0), TC1 = tCursor(X1);
const az = azar(55);
const BARRAS = Array.from({ length: 30 }, (_, i) => ({ x: X0 + 15 + i * 30, h: 40 + 140 * az() * (0.5 + 0.5 * Math.abs(Math.sin(i * 0.5))) }));
export const momentos = { apaga: Toir, apagaron: Tapa, encendida: Tenc, rellena: BARRAS.filter((b) => b.x > G0 && b.x < G1).map((_, i) => Trel + 0.1 + i * 0.1) };

// ¿suena el audífono?
const suena = (t) => {
  if (t < Toir) return 1 - su(tr(t, Toir - 0.15, Toir + 0.1));
  if (t < Texp) return 0;
  const c = cursor(t);
  if (t < TC0) return su(tr(t, Texp, Texp + 0.3));
  if (c >= G0 && c <= G1) return 0;
  if (c > X1) return 1 - su(tr(c, X1, X1 + 40));
  return 1;
};

function audifono(g, x, y, s, luz) {
  g.save(); g.translate(x, y);
  g.fillStyle = "rgba(0,0,0,0.35)"; g.beginPath(); g.ellipse(8, 10, s * 1.05, s * 0.95, 0, 0, 6.2832); g.fill();
  const gr = g.createRadialGradient(-s * 0.35, -s * 0.35, s * 0.1, 0, 0, s);
  gr.addColorStop(0, "#ffffff"); gr.addColorStop(0.6, "#dfe3ea"); gr.addColorStop(1, "#8a92a0");
  g.fillStyle = gr; g.beginPath(); g.ellipse(0, 0, s, s * 0.9, 0, 0, 6.2832); g.fill();
  // el palito
  const pg = g.createLinearGradient(-s * 0.25, 0, s * 0.25, 0);
  pg.addColorStop(0, "#ffffff"); pg.addColorStop(1, "#9aa2ae");
  g.fillStyle = pg; k.redondo(g, -s * 0.25, s * 0.4, s * 0.5, s * 1.6, s * 0.25); g.fill();
  // la lucecita
  g.fillStyle = luz > 0.5 ? "#3dff8a" : "#55606a"; g.beginPath(); g.arc(s * 0.35, -s * 0.2, s * 0.1, 0, 6.2832); g.fill();
  if (luz > 0) k.brillo(g, s * 0.35, -s * 0.2, s * 1.2, "60,255,140", 0.6 * luz);
  g.restore();
}

export function dibuja(g, t) {
  // la cámara baja a la cinta en «Tu cerebro» y reposa
  const baja = su(tr(t, Ttu - 0.1, Trel + 0.1));
  const dy = -330 * baja;
  fondo(g, 540, 950 + dy);
  g.save(); g.translate(0, dy);
  // en la frase 6 la cámara se acerca a la parte que oye; vuelve atrás para el experimento
  const zz = 1 + 0.3 * su(tr(t, Tini, Tesc + 0.2)) * (1 - su(tr(t, Texp - 0.7, Texp + 0.1)));
  g.translate(OYE[0], OYE[1]); g.scale(zz, zz); g.translate(-OYE[0], -OYE[1]);
  const s = suena(t);
  // la parte que oye: encendida todo el rato; late en «escucharla» y en «encendida»
  const oye = 0.75 + 0.6 * pulso(t, Tesc + 0.1, 0.25) + 1.5 * pulso(t, Tenc + 0.1, 0.3) + 0.3 * s;
  cabeza(g, HX, HY, S, { brilloCerebro: 0.6 });
  // la zona que oye
  g.save(); g.globalCompositeOperation = "lighter";
  const zg = g.createRadialGradient(OYE[0], OYE[1], 0, OYE[0], OYE[1], 190);
  zg.addColorStop(0, `rgba(255,240,150,${Math.min(1, 0.75 * oye)})`); zg.addColorStop(0.35, `rgba(255,120,60,${0.5 * oye})`); zg.addColorStop(1, "rgba(255,80,60,0)");
  g.fillStyle = zg; g.beginPath(); g.ellipse(OYE[0], OYE[1], 190, 120, -0.15, 0, 6.2832); g.fill();
  g.restore();
  k.brillo(g, OYE[0], OYE[1], 700, "255,200,120", 0.7 * pulso(t, Tenc + 0.1, 0.25) + 0.4 * pulso(t, Tesc + 0.1, 0.25));
  // las ondas de sonido: del audífono hacia dentro (se van cuando deja de sonar)
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
  for (let i = 0; i < 5; i++) {
    const u = ((t * 1.4 + i / 5) % 1);
    const r = 40 + u * 170, al = s * Math.sin(u * Math.PI) * 0.9;
    if (al <= 0.01) continue;
    g.strokeStyle = `rgba(120,230,255,${al})`; g.lineWidth = 9;
    g.beginPath(); g.arc(OREJA[0], OREJA[1], r, Math.PI * 0.72, Math.PI * 1.28); g.stroke();
  }
  g.restore();
  audifono(g, OREJA[0] + 10, OREJA[1], 46, s);
  // el cable, del audífono a la cinta
  const cinta = su(tr(t, Texp - 0.2, Texp + 0.4));
  if (cinta > 0) {
    g.save(); g.globalAlpha *= cinta; g.strokeStyle = "#e7ebf1"; g.lineWidth = 7;
    g.beginPath(); g.moveTo(OREJA[0] + 10, OREJA[1] + 110); g.bezierCurveTo(OREJA[0] + 120, OREJA[1] + 220, X1 + 20, YC - 260, X1 + 10, YC - 120); g.stroke();
    g.restore();
    // la cinta: fondo oscuro, barras, el tramo de silencio y el cursor
    g.save(); g.globalAlpha *= cinta;
    g.fillStyle = "rgba(6,3,16,0.8)"; k.redondo(g, X0 - 30, YC - 130, X1 - X0 + 60, 260, 40); g.fill();
    g.strokeStyle = "rgba(255,255,255,0.15)"; g.lineWidth = 3; k.redondo(g, X0 - 30, YC - 130, X1 - X0 + 60, 260, 40); g.stroke();
    const c = cursor(t);
    g.lineCap = "round";
    const llenos = [];
    for (const [i, b] of BARRAS.entries()) {
      const enHueco = b.x > G0 && b.x < G1;
      const tocada = c > b.x;
      const col = NEON[Math.floor(i / 3) % NEON.length];
      if (enHueco) {
        // el silencio: una raya plana; luego se rellena de oro
        const j = llenos.length; llenos.push(b);
        const tr0 = Trel + 0.1 + j * 0.1, lleno = entra(tr(t, tr0, tr0 + 0.3));
        const baila = su(tr(t, Tcan - 0.4, Tcan)) * (1 - su(tr(t, Tfin - 0.1, Tfin + 0.3)));
        const h = (8 + (b.h - 8) * lleno) * (1 + 0.35 * baila * Math.sin(t * 11 + j * 1.3));
        g.strokeStyle = lleno > 0 ? `rgba(255,205,70,${0.4 + 0.6 * lleno})` : "rgba(255,255,255,0.35)";
        g.lineWidth = 16; g.beginPath(); g.moveTo(b.x, YC - h / 2); g.lineTo(b.x, YC + h / 2); g.stroke();
        if (lleno > 0) k.brillo(g, b.x, YC, 120, "255,200,60", 0.5 * lleno + 0.6 * pulso(t, Tcan + 0.1, 0.2));
      } else {
        g.strokeStyle = `rgba(${col},${tocada ? 1 : 0.45})`; g.lineWidth = 16;
        g.beginPath(); g.moveTo(b.x, YC - b.h / 2); g.lineTo(b.x, YC + b.h / 2); g.stroke();
      }
    }
    // el letrero del silencio
    const sil = su(tr(t, Tapa - 0.1, Tapa + 0.2));
    k.etiqueta(g, (G0 + G1) / 2 - 130, YC - 230, "SILENCIO", "255,120,120", sil * (1 - su(tr(t, Trel - 0.2, Trel + 0.2))), 50);
    // el cursor
    if (t > TC0 - 0.2 && c < X1 + 30) {
      const cx = Math.max(X0, Math.min(X1, c)), al = su(tr(t, TC0 - 0.2, TC0)) * (1 - su(tr(c, X1, X1 + 30)));
      g.globalAlpha = cinta * al; g.strokeStyle = "#ffffff"; g.lineWidth = 6;
      g.beginPath(); g.moveTo(cx, YC - 115); g.lineTo(cx, YC + 115); g.stroke();
      k.brillo(g, cx, YC - 115, 80, "255,255,255", 0.8 * al);
    }
    g.restore();
  }
  // las notas de oro que bajan de la parte que oye al hueco
  for (let i = 0; i < 10; i++) {
    const t0 = Trel - 0.3 + i * 0.1, u = su(tr(t, t0, t0 + 0.7));
    if (u <= 0 || u >= 1) continue;
    const xx = mez(OYE[0], G0 + 20 + i * 30, u), yy = mez(OYE[1] + 60, YC - 40, u) - 120 * Math.sin(u * Math.PI);
    nota(g, xx, yy, 24, "255,200,60", 0.2 * Math.sin(i + u * 5), Math.sin(u * Math.PI) * 1.2, i % 3);
  }
  // y la sigue cantando por dentro: notas que suben del hueco a la cabeza
  for (let i = 0; i < 7; i++) {
    const t0 = Tcan - 0.3 + i * 0.16, u = su(tr(t, t0, t0 + 0.9));
    if (u <= 0 || u >= 1) continue;
    const xx = mez(G0 + 30 + i * 42, OYE[0], u) + 40 * Math.sin(u * 6 + i), yy = mez(YC - 60, OYE[1], u);
    nota(g, xx, yy, 26, NEON[i % NEON.length], 0.2 * Math.sin(i + u * 5), Math.sin(u * Math.PI) * 1.3, i % 3);
  }
  g.restore();
  velo(g, 0.55);
}
