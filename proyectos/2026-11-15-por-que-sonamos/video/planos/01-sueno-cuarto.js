// «¿Por qué soñamos, si al despertar casi nunca nos acordamos?» + «Cada noventa minutos, tu cerebro se enciende...»
// Un solo plano: dentro del sueño, y la cámara se aleja hasta el cuarto.
// - Fotograma 0: volando deprisa por el sueño (islas flotantes, la luna, la escalera); la ballena de luz cruza enorme.
// - «despertar»: la cámara se aleja de golpe: el sueño es una burbuja sobre la cabeza de alguien dormido.
// - «nunca nos acordamos»: la burbuja revienta en chispas que suben y se apagan.
// - «noventa minutos»: el reloj de la mesita corre hora y media; la cámara se acerca a la cabeza.
// - «se enciende»: dentro de la cabeza se enciende el cerebro de luz.
// - «película»: de la frente sube un haz y vuelve a formarse la burbuja del sueño; la cámara se aleja.
import * as k from "#kit";
import { v } from "#voz";
import { RS, TAU, cerebro, corredor, ballena, burbuja, cama, camino2D, cuarto, reloj, sueno, velo, vineta, vista, CAB } from "../mundo.js";

export const desde = 0;
const { suave: su, tramo: tr, mez, azar } = k;

const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3);
const Tlev = f3.t("levantes"), Tact = f3.t("actuarla"), Tapaga = f3.t("apaga"), Tmus = f3.t("musculos"), Tpar = f3.t("paralizado"), Tfin3 = f3.fin;
const Tdesp = f1.t("despertar"), Tnunca = f1.t("nunca"), Tacor = f1.t("acordamos");
const Tcada = f2.t("cada"), Tmin = f2.t("minutos"), Tcer = f2.t("cerebro"), Tenc = f2.t("enciende"), Tpone = f2.t("pone"), Tpeli = f2.t("pelicula");

export const B = [560, 800], RB = 280;
const Tdes = f2.t("despierto");
// el centro del cerebro, dentro de la cabeza, y cuánto está girado (la cabeza está tumbada)
const CB = [CAB[0] - 0.18 * 70, CAB[1] - 0.38 * 70], GIRO = -Math.PI / 2 + 0.25;
// la cámara gira al entrar para que el cerebro quede derecho, y vuelve al salir
const giro = (t) => -GIRO * (su(tr(t, Tcer, Tenc + 0.55)) - su(tr(t, Tdes + 0.5, Tpeli + 0.5)));
const dentro = (t) => su(tr(t, Tenc - 0.05, Tenc + 0.45)) - su(tr(t, Tdes + 0.5, Tdes + 1.0));
const Z0 = RS / RB;

const cam = camino2D([
  [0, [Z0, B[0], B[1]]],
  [Tdesp - 0.1, [Z0 * 0.92, B[0], B[1]]],
  [Tdesp + 0.75, [1, 540, 960]],
  [Tacor + 0.35, [1, 540, 960]],
  [Tcada + 0.1, [1.3, 420, 1060]],
  [Tmin + 0.4, [1.9, 250, 1130]],
  [Tcer - 0.1, [1.9, 250, 1130]],
  [Tenc + 0.55, [11, CB[0], CB[1] + 3]],
  [Tdes + 0.5, [11.6, CB[0], CB[1] + 3]],
  [Tpeli + 0.5, [1, 540, 960]],
  [Tlev + 0.3, [1.3, 640, 1040]],
  [Tmus + 0.4, [1.4, 650, 1060]],
  [Tfin3 + 0.3, [1.48, 655, 1075]],
]);
// frase 3: la manta se vuelve transparente, la pierna se levanta, los músculos se apagan de la cabeza a los pies
const manta = (t) => 1 - su(tr(t, f3.inicio, Tlev));
const pierna = (t) => su(tr(t, Tlev, Tact + 0.45)) * (1 - su(tr(t, Tapaga + 0.55, Tapaga + 1.0)));
const musc = (t) => (i, u) => 1 - su(tr(t, Tapaga - 0.05 + u * 0.9, Tapaga + 0.25 + u * 0.9));
const frio = (t) => su(tr(t, Tpar - 0.1, Tpar + 0.5));
// lo que vuela la cámara dentro del sueño: deprisa al principio, frena al alejarse
const avance = (t) => {
  const u = Math.max(0, t - Tdesp), T = 350 / 240;
  return 1500 * Math.min(t, Tdesp) + (u < T ? 500 * u - 120 * u * u : 500 * T - 120 * T * T + 150 * (u - T));
};
// las horas del reloj
const horas = (t) => 11.5 + 1.5 * su(tr(t, Tcada, Tmin + 0.45));
// el estallido de la burbuja
const azP = azar(99);
const CHISPAS = Array.from({ length: 140 }, () => { const a = azP() * TAU, d = Math.sqrt(azP()); return { a, d, v: 60 + azP() * 160, r: 2 + azP() * 5, c: azP() < 0.5 ? "255,200,250" : "180,230,255", f: azP() }; });
const T0p = Tnunca - 0.05, T1p = Tacor + 0.9;

function suenoDentro(g, t) {
  sueno(g, t, avance(t));
  const u = tr(t, -0.15, 1.9);
  if (u < 1) ballena(g, mez(820, -1150, u), mez(260, 120, u), 1250, t);
}

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy, giro(t));
  cuarto(g, t);
  reloj(g, horas(t), k.pulso(t, (Tcada + Tmin) / 2 + 0.2, 0.7));
  const enc = su(tr(t, Tenc - 0.15, Tenc + 0.35));
  const desp = k.pulso(t, f2.t("despierto") + 0.15, 0.35);
  cama(g, t, { cerebro: Math.min(1.25, enc * (1 + 0.25 * desp)), ojos: enc, manta: manta(t), pierna: pierna(t), musculos: musc(t), frio: frio(t) });
  if (t > Tapaga - 0.1) escarcha(g, t);
  // dentro de la cabeza: el cerebro de luz, enorme
  const dn = dentro(t);
  if (dn > 0.003) {
    g.save(); g.globalAlpha *= dn;
    const fg = g.createRadialGradient(CB[0], CB[1], 5, CB[0], CB[1], 200);
    fg.addColorStop(0, "#3a0c48"); fg.addColorStop(0.5, "#1a0628"); fg.addColorStop(1, "#08020e");
    g.fillStyle = fg; g.fillRect(CB[0] - 400, CB[1] - 400, 800, 800);
    k.brillo(g, CB[0], CB[1], 160, "255,110,220", 0.5 + 0.3 * desp);
    g.translate(CB[0], CB[1]); g.rotate(GIRO);
    cerebro(g, 0, 0, 35, t * (1 + desp), 1);
    g.restore();
  }

  // la burbuja: llena la pantalla, se aleja, revienta; vuelve en «película»
  if (t < T0p + 0.35) {
    const rompe = su(tr(t, T0p, T0p + 0.35));
    burbuja(g, B[0], B[1], RB * (1 + 0.06 * rompe), (gg) => suenoDentro(gg, t), 1 - rompe, 1 + rompe);
    // las burbujitas que la unen a la cabeza
    puntos(g, (1 - rompe) * su(tr(t, Tdesp, Tdesp + 0.5)), t);
  }
  if (t > T0p && t < T1p + 0.1) {
    const w = t - T0p;
    g.save(); g.globalCompositeOperation = "lighter";
    for (const c of CHISPAS) {
      const r0 = RB * (0.35 + 0.65 * c.d);
      const x = B[0] + Math.cos(c.a) * (r0 + c.v * w * 0.6), y = B[1] + Math.sin(c.a) * (r0 + c.v * w * 0.4) - 70 * w * w;
      const al = Math.max(0, 1 - w / (T1p - T0p)) * (0.6 + 0.4 * Math.sin(c.f * 9 + w * 4));
      k.brillo(g, x, y, c.r * 7, c.c, al);
    }
    g.restore();
  }
  // «película»: el haz que sube de la frente y la burbuja que vuelve
  const Th0 = Tpone - 0.15, Th1 = Tpeli + 0.35;
  if (t > Th0) {
    const u = su(tr(t, Th0, Th1)), hz = 1 - su(tr(t, Th1, Th1 + 0.5));
    if (hz > 0.01) {
      g.save(); g.globalCompositeOperation = "lighter";
      const x0 = CAB[0] + 35, y0 = CAB[1] - 80;
      const hg = g.createLinearGradient(x0, y0, B[0], B[1]);
      hg.addColorStop(0, `rgba(255,200,255,${0.75 * hz})`); hg.addColorStop(1, `rgba(200,170,255,${0.15 * hz})`);
      g.fillStyle = hg; g.beginPath(); g.moveTo(x0 - 10, y0); g.lineTo(x0 + 10, y0); g.lineTo(B[0] + RB * u * 0.8, B[1]); g.lineTo(B[0] - RB * u * 0.8, B[1]); g.closePath(); g.fill();
      k.brillo(g, x0, y0, 120, "255,210,255", hz);
      g.restore();
    }
    burbuja(g, B[0], B[1], RB * k.entra(u), (gg) => suenoCorre(gg, t), Math.min(1, u * 3));
    puntos(g, u, t);
  }
  vineta(g, 0.5 * su(tr(t, Tdesp, Tdesp + 0.6)));
  velo(g, 0.35);
}

// frase 3: en el sueño, él corre por un camino de luz
function suenoCorre(g, t) {
  sueno(g, t, avance(t));
  const u = su(tr(t, Tpeli + 0.2, Tlev + 0.1));
  if (u <= 0) return;
  g.save(); g.globalAlpha *= u;
  const cg = g.createLinearGradient(0, 380, 0, 470); cg.addColorStop(0, "rgba(255,240,200,0.95)"); cg.addColorStop(1, "rgba(255,150,120,0.2)");
  g.fillStyle = cg; g.fillRect(-RS, 380, 2 * RS, 70);
  g.fillStyle = "rgba(255,255,255,0.8)"; const d = (avance(t) * 2.5) % 300;
  for (let x = -RS - d; x < RS; x += 300) g.fillRect(x, 392, 140, 10);
  g.restore();
  corredor(g, mez(-1300, -60, k.entra(u)), 384, 620, t * 1.7);
}

// frase 3: «paralizado»: el cuerpo, azul hielo, con cristales de escarcha que brillan
const azE = azar(31);
const ESCARCHA = Array.from({ length: 70 }, () => ({ x: 410 + azE() * 620, y: 1228 + azE() * 60, r: 3 + azE() * 7, u: azE(), f: azE() * TAU }));
function escarcha(g, t) {
  g.save(); g.globalCompositeOperation = "lighter";
  for (const e of ESCARCHA) {
    const on = su(tr(t, Tapaga + 0.1 + ((e.x - 410) / 620) * 0.9, Tapaga + 0.4 + ((e.x - 410) / 620) * 0.9)) * (0.4 + 0.6 * frio(t));
    if (on <= 0.01) continue;
    const al = on * (0.55 + 0.25 * Math.sin(t * 2 + e.f));
    g.strokeStyle = `rgba(200,240,255,${al})`; g.lineWidth = 1.5;
    for (let i = 0; i < 3; i++) { const a = (i / 3) * Math.PI + e.f; g.beginPath(); g.moveTo(e.x - Math.cos(a) * e.r, e.y - Math.sin(a) * e.r); g.lineTo(e.x + Math.cos(a) * e.r, e.y + Math.sin(a) * e.r); g.stroke(); }
    k.brillo(g, e.x, e.y, e.r * 3, "180,230,255", al * 0.5);
  }
  g.restore();
}

// tres burbujitas de la cabeza a la burbuja grande
function puntos(g, al, t) {
  if (al <= 0.01) return;
  for (const [u, r] of [[0.25, 14], [0.45, 22], [0.65, 32]]) {
    const x = mez(CAB[0] + 20, B[0] - 60, u), y = mez(CAB[1] - 95, B[1] + RB * 0.75, u) + Math.sin(t * 2 + u * 9) * 3;
    g.save(); g.globalAlpha *= al;
    k.brillo(g, x, y, r * 3, "200,160,255", 0.4);
    g.fillStyle = "rgba(235,220,255,0.35)"; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
    g.strokeStyle = "rgba(255,240,255,0.85)"; g.lineWidth = 2.5; g.stroke();
    g.restore();
  }
}

export const momentos = { pop: T0p, enciende: Tenc, pelicula: Tpeli };
