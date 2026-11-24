// «Casi siempre es el coro: unos quince a treinta segundos, que tu cerebro pone en bucle.
//  Y se pegan más las rápidas y fáciles, que suben y bajan como "Estrellita, ¿dónde estás?".»
// - La canción entera es una cinta de onda de colores que pasa de derecha a izquierda.
// - «coro»: un tramo se enciende en oro y la cinta frena con él en el centro. «quince»: «15-30 s».
// - «bucle»: el tramo sube, se sale de la cinta y se enrolla en un aro que gira; el resto se apaga.
// - «rápidas»: el aro gira más deprisa. «fáciles»: el aro se abre en una fila de notas.
// - «suben y bajan»: las notas forman una colina. «Estrellita»: se enciende una estrella sobre la cima y las notas
//   saltan una tras otra, como la melodía. Reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { NEON, fondo, nota, velo } from "../mundo.js";

export const desde = "casi";

const { suave: su, tramo: tr, mez, azar, entra } = k;
const f4 = v.frase(4), f5 = v.frase(5);
const Tini = f4.inicio, Tcoro = f4.t("coro"), Tqui = f4.t("quince"), Tcer = f4.t("cerebro"), Tbuc = f4.t("bucle");
const Trap = f5.t("rapidas"), Tfac = f5.t("faciles"), Tsub = f5.t("suben"), Tbaj = f5.t("bajan"), Test = f5.t("estrellita"), Tfin = f5.fin;

// la cinta: barras cada 22 px; el coro, de la 60 a la 79
const PASO = 30, NB = 110, C0 = 44, C1 = 62, YC = 1030;
const az = azar(321);
const ALTO = Array.from({ length: NB }, (_, i) => {
  const env = 0.45 + 0.55 * Math.abs(Math.sin(i * 0.09)) ;
  return (0.25 + 0.75 * az()) * env * (i >= C0 && i < C1 ? 1.15 : 1);
});
// dónde está la cinta: se desplaza y frena con el centro del coro en x=540
const xCoro = (C0 + C1) / 2 * PASO;
const desplaza = (t) => {
  const final = 540 - xCoro, ini = final + 1100;
  return mez(ini, final, su(tr(t, Tini - 0.05, Tcoro + 0.5)));
};
// el aro
const AX = 540, AY = 930, AR = 300;
const giroAro = (t) => {
  // gira despacio desde «bucle», más deprisa desde «rápidas»
  const a = Math.max(0, t - Tbuc), b = Math.max(0, t - Trap);
  return 2.2 * a + 4 * (b - Math.max(0, t - Trap - 0.6) * 0) * su(tr(t, Trap, Trap + 0.5));
};
// las notas de la colina (como «Estrellita»: do do sol sol la la sol fa fa mi)
const ALTURAS = [0, 0, 4, 4, 5, 5, 4, 3, 2, 1];
const NOTAS = ALTURAS.map((h, i) => ({ x: 110 + i * 94, y: 1290 - h * 100, c: NEON[i % NEON.length], tipo: i % 2 ? 2 : 0 }));
export const momentos = { coro: Tcoro, bucle: Tbuc, estrella: Test, saltos: NOTAS.map((_, i) => Test + 0.1 + i * 0.13) };

function estrella(g, x, y, R, al) {
  if (al <= 0) return;
  g.save(); g.globalAlpha *= al; g.translate(x, y);
  k.brillo(g, 0, 0, R * 5, "255,220,110", 0.8);
  g.beginPath();
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? R * 0.45 : R; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
  g.closePath();
  const gr = g.createRadialGradient(-R * 0.2, -R * 0.3, R * 0.05, 0, 0, R);
  gr.addColorStop(0, "#fffbe0"); gr.addColorStop(0.5, "#ffd23a"); gr.addColorStop(1, "#e08a00");
  g.fillStyle = gr; g.fill();
  g.strokeStyle = "rgba(255,255,230,0.9)"; g.lineWidth = 5; g.stroke();
  g.restore();
}

export function dibuja(g, t) {
  fondo(g, 540, 950);
  const dx = desplaza(t);
  const oro = su(tr(t, Tcoro - 0.1, Tcoro + 0.3));
  const sube = su(tr(t, Tcer - 0.1, Tbuc + 0.2));            // el coro sale de la cinta y se enrolla
  const apaga = su(tr(t, Tcer, Tbuc + 0.3));                  // el resto de la cinta se va
  const abre = su(tr(t, Tfac - 0.2, Tsub + 0.1));             // el aro se vuelve notas
  // la línea de la cinta
  if (apaga < 1) {
    g.save(); g.globalAlpha *= 1 - apaga;
    g.strokeStyle = "rgba(255,255,255,0.25)"; g.lineWidth = 3; g.beginPath(); g.moveTo(0, YC); g.lineTo(1080, YC); g.stroke();
    g.restore();
  }
  // las barras
  g.save(); g.lineCap = "round";
  for (let i = 0; i < NB; i++) {
    const enCoro = i >= C0 && i < C1;
    const x = dx + i * PASO;
    let h = ALTO[i] * 560 * (0.85 + 0.15 * Math.sin(t * 9 + i * 0.7));
    let c = NEON[Math.floor(i / 6) % NEON.length], al = 1;
    if (enCoro) c = k.mezRgb(c, "255,200,60", oro);
    else al = (1 - 0.6 * oro) * (1 - apaga);
    if (!enCoro && (x < -30 || x > 1110 || al <= 0)) continue;
    if (enCoro && abre >= 1) continue;
    let x0 = x, y0 = YC - h / 2, x1 = x, y1 = YC + h / 2;
    if (enCoro && sube > 0) {
      // en el aro: cada barra, un radio
      const j = i - C0, a = -Math.PI / 2 + (j / (C1 - C0)) * 6.2832 + giroAro(t);
      const cx = AX + Math.cos(a) * AR, cy = AY + Math.sin(a) * AR, hh = ALTO[i] * 230 * (0.85 + 0.15 * Math.sin(t * 9 + i * 0.7));
      const ax0 = cx - Math.cos(a) * hh / 2, ay0 = cy - Math.sin(a) * hh / 2, ax1 = cx + Math.cos(a) * hh / 2, ay1 = cy + Math.sin(a) * hh / 2;
      x0 = mez(x0, ax0, sube); y0 = mez(y0, ay0, sube); x1 = mez(x1, ax1, sube); y1 = mez(y1, ay1, sube);
      al = 1 - abre;
    }
    g.globalAlpha = al;
    g.strokeStyle = `rgba(${c},0.35)`; g.lineWidth = 28; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
    g.strokeStyle = `rgb(${k.mezRgb(c, "255,255,255", 0.25)})`; g.lineWidth = 15; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
  }
  g.restore();
  // el aro: una flecha de luz que da vueltas (el bucle)
  const aro = su(tr(t, Tbuc - 0.3, Tbuc + 0.2)) * (1 - abre);
  if (aro > 0) {
    const a0 = giroAro(t) * 1.3;
    g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
    for (const [w, al] of [[40, 0.18], [18, 0.5], [8, 1]]) {
      g.strokeStyle = `rgba(255,215,90,${al * aro})`; g.lineWidth = w;
      g.beginPath(); g.arc(AX, AY, AR * 0.55, a0, a0 + 5.3 * aro); g.stroke();
    }
    // la punta de la flecha
    const ap = a0 + 5.3 * aro, px = AX + Math.cos(ap) * AR * 0.55, py = AY + Math.sin(ap) * AR * 0.55;
    g.fillStyle = `rgba(255,235,150,${aro})`; g.translate(px, py); g.rotate(ap + Math.PI / 2);
    g.beginPath(); g.moveTo(34, 0); g.lineTo(-20, -30); g.lineTo(-20, 30); g.closePath(); g.fill();
    g.restore();
  }
  // el brillo del coro y del aro
  k.brillo(g, mez(540, AX, sube), mez(YC, AY, sube), 900, "255,190,60", 0.35 * oro * (1 - abre));
  // la cifra
  const cifra = entra(tr(t, Tqui - 0.2, Tqui + 0.15)) * (1 - su(tr(t, Tcer - 0.3, Tcer)));
  k.pastilla(g, 540, 1400, "15-30 s", "", "255,210,90", cifra, 100);
  // las notas de la colina: salen del aro y se colocan
  if (abre > 0) {
    for (const [i, q] of NOTAS.entries()) {
      const a = -Math.PI / 2 + (i / NOTAS.length) * 6.2832 + giroAro(t);
      const u = su(tr(t, Tfac - 0.2 + i * 0.04, Tsub + 0.2 + i * 0.06));
      // al principio, en fila recta; en «suben y bajan», la colina
      const colina = su(tr(t, Tsub - 0.1 + i * 0.05, Tbaj + 0.3 + i * 0.05));
      const yRecta = 1150;
      let x = mez(AX + Math.cos(a) * AR, q.x, u), y = mez(AY + Math.sin(a) * AR, mez(yRecta, q.y, colina), u);
      // saltan una tras otra con la melodía, desde «Estrellita»
      const ts = Test + 0.1 + i * 0.13;
      y -= 70 * k.pulso(t, ts, 0.09);
      // «rápidas»: antes de la colina rebotan deprisa
      y -= 22 * Math.abs(Math.sin((t - Tfac) * 12 + i)) * u * (1 - colina);
      nota(g, x, y, 38, q.c, 0, Math.min(1, abre * 1.5), q.tipo);
      k.brillo(g, x, y, 200, q.c, 0.5 * k.pulso(t, ts, 0.09));
    }
    // la línea de la melodía, que une las notas
    const linea = su(tr(t, Tbaj, Test));
    if (linea > 0) {
      g.save(); g.globalCompositeOperation = "lighter"; g.strokeStyle = `rgba(255,220,120,${0.45 * linea})`; g.lineWidth = 6; g.lineCap = "round";
      g.beginPath(); NOTAS.forEach((q, i) => (i ? g.lineTo(q.x, q.y + 20) : g.moveTo(q.x, q.y + 20))); g.stroke(); g.restore();
    }
  }
  // la estrella
  const es = entra(tr(t, Test - 0.15, Test + 0.3));
  estrella(g, NOTAS[5].x - 47, 700, 95 * es + 6 * Math.sin(t * 3) * es, es);
  velo(g, 0.5);
}
