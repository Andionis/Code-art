// «Debajo, miles de pelitos se mueven como remos, más de diez veces por segundo.
//  Así empujan el moco hacia la garganta, ...»
// La pared de la nariz vista de lado, con una sola cámara. Entra con un fundido desde la capa vista desde arriba.
// - «Debajo»: arriba, la capa de moco dorada con lo que atrapó; la cámara baja a través de ella.
// - «pelitos»: debajo, un campo de pelitos rosados sobre sus células, que reman en ola. «remos»: la ola se acelera.
// - «empujan»: la capa avanza hacia la derecha encima de los pelitos, con todo lo pegado; la cámara la sigue.
// - «garganta»: se acaba la pared y la capa cae por el borde a lo oscuro de la garganta. Reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { moco, polen, polvo, virus, velo } from "../mundo.js";

export const desde = (vz) => vz.frase(6).inicio;
export const entrada = "fundido";

const { suave: su, tramo: tr, mez, azar, claves, entra } = k;
const f6 = v.frase(6), f7 = v.frase(7);
const T0 = f6.inicio, Tpel = f6.t("pelitos"), Trem = f6.t("remos"), Tmas = f6.t("mas");
const Temp = f7.t("empujan"), Tgar = f7.t("garganta"), Tcomo = f7.t("como");

// la capa: cuánto ha avanzado hacia la derecha (px del mundo)
const avance = claves([[Temp - 0.2, 0], [Tgar - 0.2, 1250], [Tcomo - 0.4, 1600]]);
// la cámara: baja de la capa a los pelitos; luego sigue a la capa
const camY = claves([[T0, -124], [Tpel + 0.2, 57], [Temp, 57], [Tgar, 90]]);
const camX = (t) => Math.min(avance(t), 1330);
const BORDE = 1900; // donde se acaba la pared y empieza la garganta (x del mundo)

const az = azar(606);
const PELOS = [];
for (let x = -200; x < BORDE; x += 15) PELOS.push({ x: x + (az() - 0.5) * 5, l: 250 + az() * 40, fondo: false });
for (let x = -192; x < BORDE; x += 22) PELOS.push({ x, l: 230 + az() * 40, fondo: true });
const CELULAS = []; for (let x = -260; x < BORDE; x += 120) CELULAS.push({ x, w: 112 + az() * 10, h: 520 + az() * 40 });
// lo que va pegado en la capa (x relativa a la capa)
const PEGADO = [
  { t: "virus", x: 160, y: 120, r: 44 }, { t: "polen", x: 420, y: 150, r: 42 }, { t: "polvo", x: 650, y: 110, r: 44 },
  { t: "virus", x: 880, y: 160, r: 40 }, { t: "polen", x: 1080, y: 110, r: 40 }, { t: "virus", x: 1290, y: 140, r: 42 },
  { t: "polvo", x: 1500, y: 150, r: 40 }, { t: "polen", x: 1720, y: 120, r: 40 },
];

const SUELO = 860; // y del mundo donde empiezan las células (los pelos salen de aquí hacia arriba)
const CAPA0 = 260, CAPA1 = 0; // la capa de moco: de y 0 a y 260 (arriba de los pelos)

// la fase de la ola: más deprisa en «remos»
const Tq = Tcomo - 0.45, frena = (t) => (t < Tq ? t : Tq + 0.12 * (1 - Math.exp(-(t - Tq) / 0.12)));
const fase = (t0) => { const t = frena(t0); return 7 * t + 9 * Math.max(0, t - Trem) * su(tr(t, Trem - 0.2, Trem + 0.4)); };

function pelo(g, x, base, largo, t, fondo) {
  const ph = fase(t) - x * 0.018, b = Math.sin(ph); // b: de -1 a 1, la inclinación
  const golpe = b > 0 ? b : b * 0.6; // el remo: rápido hacia delante, más suave de vuelta
  const tx = x + golpe * largo * 0.55, ty = base - largo * (1 - 0.25 * Math.abs(golpe));
  const cx = x + golpe * largo * 0.1, cy = base - largo * 0.55;
  g.strokeStyle = fondo ? "rgba(170,80,100,0.8)" : "#ffc9d2"; g.lineWidth = fondo ? 7 : 10;
  g.beginPath(); g.moveTo(x, base); g.quadraticCurveTo(cx, cy, tx, ty); g.stroke();
  if (!fondo) { g.strokeStyle = "rgba(255,255,255,0.55)"; g.lineWidth = 3; g.beginPath(); g.moveTo(x - 2, base - 10); g.quadraticCurveTo(cx - 2, cy, tx - 2, ty); g.stroke(); }
}

export function dibuja(g, t) {
  const cx = camX(t), cy = camY(t), av = avance(t);
  // el fondo: agua rosada clara entre los pelos, más oscura abajo
  const fg = g.createLinearGradient(0, 0, 0, 1920);
  fg.addColorStop(0, "#5a1426"); fg.addColorStop(0.5, "#a8435a"); fg.addColorStop(1, "#4a0c1c");
  g.fillStyle = fg; g.fillRect(0, 0, 1080, 1920);
  g.save(); g.translate(540, 1000); g.scale(1.55, 1.55); g.translate(-540, -1000);
  g.translate(-cx, 420 - cy); // se ve del mundo de x = cx a cx + 1080 (con el zoom, la parte del medio)
  // la garganta: después del borde, lo oscuro con un brillo rojo al fondo
  const gg = g.createRadialGradient(BORDE + 400, SUELO + 500, 50, BORDE + 400, SUELO + 500, 900);
  gg.addColorStop(0, "#3a0510"); gg.addColorStop(1, "#090103");
  g.fillStyle = gg; g.fillRect(BORDE, -1500, 2000, 4000);
  // las células, con su núcleo
  for (const c of CELULAS) {
    if (c.x > BORDE - 60) continue;
    const gr = g.createLinearGradient(c.x, 0, c.x + c.w, 0);
    gr.addColorStop(0, "#c0506a"); gr.addColorStop(0.3, "#f08c9f"); gr.addColorStop(1, "#9a2c46");
    g.fillStyle = gr; k.redondo(g, c.x, SUELO, Math.min(c.w, BORDE - c.x), c.h, 30); g.fill();
    const ng = g.createRadialGradient(c.x + c.w * 0.4, SUELO + 260, 5, c.x + c.w / 2, SUELO + 280, 40);
    ng.addColorStop(0, "#c58ad8"); ng.addColorStop(1, "#5a2a78");
    g.fillStyle = ng; g.beginPath(); g.ellipse(c.x + c.w / 2, SUELO + 280, 32, 46, 0, 0, 6.2832); g.fill();
  }
  // el borde redondeado de la pared
  g.fillStyle = "#8a2440"; g.beginPath(); g.arc(BORDE - 30, SUELO + 40, 50, -1.57, 1.57); g.fill();
  // los pelos: primero los de detrás, luego los de delante
  g.lineCap = "round";
  const vis0 = cx - 120, vis1 = cx + 1200;
  for (const p of PELOS) if (p.fondo && p.x > vis0 && p.x < vis1 && p.x < BORDE - 40) pelo(g, p.x, SUELO + 6, p.l, t, true);
  for (const p of PELOS) if (!p.fondo && p.x > vis0 && p.x < vis1 && p.x < BORDE - 40) pelo(g, p.x, SUELO + 10, p.l, t, false);
  // la capa de moco: una banda dorada encima de los pelos, que avanza; al pasar el borde, cae
  const y0 = SUELO - 300, alto = 260;
  g.save();
  const capaX0 = -300 + av, capaX1 = 1900 + av;
  g.beginPath();
  for (let x = capaX0; x <= capaX1; x += 20) {
    const cae = Math.max(0, x - BORDE), yy = y0 - alto + 14 * Math.sin(x * 0.01 + t * 2) + cae * cae * 0.004;
    x === capaX0 ? g.moveTo(x, yy) : g.lineTo(x, yy);
  }
  for (let x = capaX1; x >= capaX0; x -= 20) {
    const cae = Math.max(0, x - BORDE), yy = y0 + 10 * Math.sin(x * 0.013 - t * 2) + cae * cae * 0.004 + cae * 0.3;
    g.lineTo(x, yy);
  }
  g.closePath();
  const cg = g.createLinearGradient(0, y0 - alto, 0, y0);
  cg.addColorStop(0, "rgba(255,230,140,0.92)"); cg.addColorStop(0.5, "rgba(235,185,60,0.85)"); cg.addColorStop(1, "rgba(190,130,30,0.9)");
  g.fillStyle = cg; g.fill();
  g.save(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.25; g.drawImage(k.manchas, capaX0, y0 - alto - 200, capaX1 - capaX0, 700); g.restore();
  g.strokeStyle = "rgba(255,250,220,0.7)"; g.lineWidth = 6; g.stroke();
  g.restore();
  // lo pegado en la capa, que viaja con ella
  for (const p of PEGADO) {
    const x = p.x - 300 + av, cae = Math.max(0, x - BORDE), y = y0 - alto + p.y + cae * cae * 0.004 + cae * 0.15;
    if (x < vis0 - 100 || x > vis1 + 100) continue;
    if (p.t === "virus") virus(g, x, y, p.r, x * 0.004); else if (p.t === "polen") polen(g, x, y, p.r, x * 0.004); else polvo(g, x, y, p.r, 7);
  }
  g.restore();
  // brillo de la capa húmeda
  velo(g, 0.6);
}

export const momentos = { pelitos: Tpel, remos: Trem, empujan: Temp, garganta: Tgar, cae: Tgar + 0.1 };
