// «La luz del Sol parece blanca, pero trae todos los colores mezclados, como un arcoíris escondido.»
// «Cada color viaja en ondas: el rojo, en ondas largas y tranquilas; el azul, en ondas cortas y nerviosas.»
// Corte en «La»: en la oscuridad, un rayo blanco grueso entra por la izquierda. «colores»: se abre en abanico en siete
// colores; «arcoíris»: el abanico se curva en un arcoíris que brilla. «Cada color»: los arcos se estiran y se vuelven
// ondas que avanzan. «rojo»: la cámara se acerca a la roja, ancha y lenta; «azul»: baja a la azul, apretada y rápida.
import * as k from "#kit";
import { v } from "#voz";
import { COLORES, fondoEspacio } from "../mundo.js";

const f3 = v.frase(3), f4 = v.frase(4);
export const desde = () => f3.inicio - 0.03;
const T0 = f3.inicio, Tblanca = f3.t("blanca"), Tcol = f3.t("colores"), Tarc = f3.t("arcoiris");
const Tcada = f4.t("cada"), Tondas = f4.t("ondas"), Trojo = f4.t("rojo"), Tazul = f4.t("azul"), Tfin = f4.fin;
export const momentos = { entra: T0, abre: Tcol - 0.3, arco: Tarc, ondas: Tcada, rojo: Trojo, azul: Tazul };

const { suave: su, tramo: tr, mez, entra } = k;
const S = [330, 1000], N = 140;
const LAMBDA = [560, 450, 360, 290, 220, 165, 130];
const YW = (i) => 600 + i * 118;
const AMP = 44, VEL = 330;

// el camino de cada color, para s de 0 a 1, según cómo de abierto (a), curvado (m1) y ondulado (m2) esté
function punto(i, s, t, a, m1, m2) {
  const E = [1180, 1000 + (i - 3) * 110 * a];
  const lin = [S[0] + (E[0] - S[0]) * s, S[1] + (E[1] - S[1]) * s];
  const r = 540 - i * 40, ang = Math.PI * (1 - s);
  const arc = [540 + r * Math.cos(ang), 1330 - 50 * su(tr(t, Tarc, Tcada)) - r * Math.sin(ang) * (1 + 0.015 * Math.sin(t * 3))];
  const x = -60 + 1200 * s;
  const Tq = Tfin - 0.35, te = t < Tq ? t : Tq + 0.12 * (1 - Math.exp(-(t - Tq) / 0.12));
  const ola = [x, YW(i) + AMP * Math.sin((2 * Math.PI * (x - VEL * (te - Tcada))) / LAMBDA[i])];
  const p = [mez(lin[0], arc[0], m1), mez(lin[1], arc[1], m1)];
  return [mez(p[0], ola[0], m2), mez(p[1], ola[1], m2)];
}

function trazo(g, pts, col, al, ancho) {
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round"; g.lineJoin = "round";
  g.beginPath(); pts.forEach(([x, y], j) => (j ? g.lineTo(x, y) : g.moveTo(x, y)));
  g.shadowColor = `rgba(${col},${0.9 * al})`; g.shadowBlur = ancho * 2.2;
  g.strokeStyle = `rgba(${col},${0.95 * al})`; g.lineWidth = ancho; g.stroke();
  g.shadowBlur = 0;
  g.strokeStyle = `rgba(255,255,255,${0.55 * al})`; g.lineWidth = ancho * 0.25; g.stroke();
  g.restore();
}

export function dibuja(g, t) {
  fondoEspacio(g, t);
  // una bruma de color detrás, que crece con el arcoíris
  const m1 = su(tr(t, Tarc - 0.35, Tarc + 0.6)) * (1 - su(tr(t, Tcada - 0.1, Tondas + 0.3)));
  const m2 = su(tr(t, Tcada - 0.1, Tondas + 0.3));
  const a = entra(tr(t, Tcol - 0.45, Tcol + 0.35));
  // la cámara: se acerca a la roja y luego baja a la azul
  const zr = su(tr(t, Trojo - 0.35, Trojo + 0.45)), za = su(tr(t, Tazul - 0.45, Tazul + 0.35));
  const zb = su(tr(t, Tcol - 0.7, Tcol + 0.5)); // al principio, cerca del rayo blanco; se aleja cuando se abre
  const z = mez(2.3, 1, zb) * mez(1, 1.9, zr), fy = mez(mez(1000, YW(0), zr), YW(5), za), fx = mez(S[0] - 60, 540, zb);
  g.save(); g.translate(540, 1000); g.scale(z, z); g.translate(-fx, -fy);
  // el rayo blanco que entra
  const llega = entra(tr(t, T0 - 0.1, T0 + 0.6)) * 0.55 + 0.45 * su(tr(t, T0 + 0.6, Tcol - 0.4));
  const blanco = 1 - su(tr(t, Tarc - 0.2, Tarc + 0.5));
  if (blanco > 0) {
    const xh = mez(60, S[0], llega);
    trazo(g, [[-100, S[1]], [xh, S[1]]], "255,250,240", blanco, 46 + 8 * Math.sin(t * 9));
    // chispas de colores escondidas que asoman en el rayo
    g.save(); g.globalCompositeOperation = "lighter";
    for (let j = 0; j < 14; j++) { const ph = (t * 1.3 + j / 14) % 1, x = mez(-60, xh, ph), c = COLORES[j % 7]; k.brillo(g, x, S[1] + Math.sin(j * 7 + t * 5) * 14, 60, c, 0.5 * blanco * Math.sin(ph * Math.PI)); }
    g.restore();
    g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, xh, S[1], 260 + 80 * a, "255,250,235", blanco * (0.8 + 0.3 * k.pulso(t, Tblanca, 0.25))); g.restore();
  }
  // los siete colores
  if (a > 0) {
    for (let i = 0; i < 7; i++) {
      const foco = mez(1, i === 0 ? 1 : 0.35, zr * (1 - za)) * mez(1, i === 5 ? 1 : 0.35, za);
      const crece = m1 > 0 || m2 > 0 ? 1 : a;
      const pts = [];
      for (let j = 0; j <= N; j++) { const s = (j / N) * crece; pts.push(punto(i, s, t, a, m1, m2)); }
      trazo(g, pts, COLORES[i], foco * (a < 1 ? 0.5 + 0.5 * a : 1), 16 + 4 * m1);
    }
    if (m1 > 0) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, 540, 1180, 1300, "255,240,220", 0.25 * m1 * (0.8 + 0.2 * Math.sin(t * 4))); g.restore(); }
  }
  g.restore();
}
