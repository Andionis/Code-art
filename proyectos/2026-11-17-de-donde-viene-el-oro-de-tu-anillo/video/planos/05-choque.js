// «A veces, dos de esas bolas giran una alrededor de la otra, cada vez más rápido... y chocan. El choque lanza una
// nube de neutrones que se pegan a los átomos y los vuelven pesados en un segundo: así nace el oro. En 2017 vimos
// uno: fabricó tanto oro como para hacer varias Tierras enteras.»
// - Corte en «A»: dos estrellas de neutrones, grandes, girando una alrededor de la otra; de ellas salen ondas que se
//   abren por el espacio. Cada vez más juntas y más rápido; chocan en «chocan»: fogonazo.
// - «lanza una nube»: la nube de oro y fuego se abre hacia la cámara; en «de neutrones», la cámara entra en ella.
// - Dentro: corren bolitas grises (neutrones). En el medio, un átomo de hierro; en «se pegan», los neutrones vuelan
//   hacia él y se le pegan, y crece bolita a bolita («pesados en un segundo»). En «nace», se vuelve de oro.
// - «En 2017 vimos uno»: la cámara sale; la nube brilla a lo lejos. En «Tierras», cuatro Tierras de oro llegan y se
//   ponen en fila. Reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { bolaNeutron, chispa, destello, espiral, neutrones, racimo, tierraDeOro, veloArriba, ORO_RGB } from "../mundo.js";

export const desde = "a";
export const entrada = "corte";

const { suave, tramo, entra, sale, pulso, sum, por, uni, proyecta, F } = k;
const f7 = v.frase(7), f8 = v.frase(8), f9 = v.frase(9);
const T0 = f7.inicio, Tchocan = f7.t("chocan") + 0.05;
const Tlanza = f8.t("lanza"), Tneu = f8.t("neutrones"), Tpegan = f8.t("pegan"), Tseg = f8.t("segundo"), Tnace = f8.t("nace");
const T2017 = f9.inicio, Tvimos = f9.t("vimos"), Tfab = f9.t("fabrico"), Ttierras = f9.t("tierras"), Tfin9 = f9.fin;

// ---------------------------------------------------------------- fuera: la cámara
const C = [0, 0, 0], DUR = Tchocan - T0 + 0.3;
const ang = k.claves([[T0 - 1, 0.1], [T0, 0.25], [Tchocan, 1.05], [Tneu + 0.6, 1.2]]);
const dist = k.claves([[T0 - 1, 12], [T0, 11.4], [Tchocan, 8.8], [Tlanza, 8.4], [Tneu, 4], [Tneu + 0.7, 0.9]]);
const alto = k.claves([[T0 - 1, 3.6], [T0, 3.4], [Tchocan, 2.2], [Tneu + 0.7, 0.4]]);
const camFuera = (t) => {
  // al salir (En 2017), la cámara vuelve atrás más lejos y quieta
  const sal = suave(tramo(t, T2017 - 0.3, Tvimos + 0.2));
  const d = k.mez(dist(t), 16, sal), a = k.mez(ang(t), 1.35, sal), h = k.mez(alto(t), 1.2, sal);
  return k.mira(k.orbita(a, d, h, C), [0, k.mez(0.9 * (1 - tramo(t, Tlanza, Tneu)), -3.2, sal), 0]);
};
const cielo = k.cielo(41, 2400, C, 320, 14);

// ---------------------------------------------------------------- la nube del choque
const az = k.azar(52);
const nube = Array.from({ length: 320 }, () => {
  const d = uni([az() - 0.5, (az() - 0.5) * 0.8, az() - 0.5]);
  return { d, vel: 1.2 + Math.pow(az(), 0.7) * 6, tam: 0.06 + az() * 0.16, c: az() < 0.3 ? "255,236,170" : az() < 0.6 ? "255,130,60" : ORO_RGB };
});

// ---------------------------------------------------------------- dentro de la nube
const corren = Array.from({ length: 60 }, () => ({ a: az() * Math.PI * 2, f: az(), vel: 0.35 + az() * 0.4, r: 10 + az() * 12 }));
const NC = 197, N0 = 56, NX = 540, NY = 1120;
const tPega = (i) => Tpegan + 0.1 + ((i - N0) / (NC - N0)) * (Tseg + 0.45 - Tpegan);   // cuándo se pega el neutrón i
const pegados = (t) => N0 + (NC - N0) * k.tramo(t, Tpegan + 0.1, Tseg + 0.45);
const vienen = Array.from({ length: NC - N0 }, (_, j) => ({ a: az() * Math.PI * 2, d: 520 + az() * 300 }));
const dentroAl = (t) => suave(tramo(t, Tneu + 0.35, Tneu + 0.75)) * (1 - suave(tramo(t, T2017 - 0.3, T2017 + 0.15)));

// ---------------------------------------------------------------- las Tierras de oro
const TIERRAS = [0, 1, 2, 3].map((i) => ({ x: 190 + i * 233, y: 1330 + (i % 2) * 40, t0: Ttierras - 0.55 + i * 0.12 }));
// el oro que sale de la nube en «fabricó» y va a juntarse donde nacerán las Tierras
const chorro = Array.from({ length: 220 }, (_, j) => ({ dest: j % 4, ts: Tfab - 0.2 + az() * (Ttierras - Tfab - 0.2), dur: 0.9 + az() * 0.6, giro: (az() - 0.5) * 2.4, off: [(az() - 0.5) * 90, (az() - 0.5) * 90], tam: 7 + az() * 14 }));

function dibujaFuera(g, t) {
  const cam = camFuera(t), antes = camFuera(t - 1 / 60);
  k.fondo(g, cam);
  k.estrellas(g, cam, antes, cielo);
  const Q = proyecta(cam, C);
  if (t < Tchocan) {
    // las ondas que salen de las dos (cada media vuelta, una), en el plano en que giran
    const vueltas = 5;
    for (let m = 1; m <= 18; m++) {
      const q = Math.pow(m / (2 * vueltas), 1.6), te = Tchocan - q * DUR;
      const u = t - te; if (u < 0 || u > 3.5) continue;
      const R = 1 + u * 3.2, al = 0.4 * (1 - u / 3.5) * tramo(t, T0, T0 + 0.3);
      g.save(); g.strokeStyle = `rgba(150,190,255,${al})`; g.lineWidth = 3; g.beginPath();
      for (let s = 0; s <= 64; s++) { const P = proyecta(cam, [R * Math.cos((s / 64) * 6.2832), 0, R * Math.sin((s / 64) * 6.2832)]); if (P) s ? g.lineTo(P.x, P.y) : g.moveTo(P.x, P.y); }
      g.stroke(); g.restore();
    }
    // las dos estrellas, con su estela
    const prox = suave(tramo(t, Tchocan - 1.5, Tchocan));
    for (let j = 8; j >= 1; j--) {
      const [a, b] = espiral(C, t - j * 0.025, Tchocan, 4.6, DUR, 5, 0);
      for (const X of [a, b]) { const P = proyecta(cam, X); if (P) k.brillo(g, P.x, P.y, (F * 1.6) / P.z, "azul", 0.22 * (1 - j / 9)); }
    }
    const [a, b] = espiral(C, t, Tchocan, 4.6, DUR, 5, 0), qa = proyecta(cam, a), qb = proyecta(cam, b);
    if (Q) k.brillo(g, Q.x, Q.y, (F * 7) / Q.z, "azul", 0.2 + 0.5 * prox);
    for (const P of qa.z > qb.z ? [qa, qb] : [qb, qa]) neutrones(g, P.x, P.y, (F * 0.75) / P.z, t, 0.4 * prox);
  } else if (Q) {
    const u = t - Tchocan;
    const lejos = suave(tramo(t, T2017 - 0.3, Tvimos + 0.2));
    // lo que queda: la nube de oro y fuego que se abre (y, vista de lejos, sigue brillando)
    k.brillo(g, Q.x, Q.y, Math.min(2200, (F * (6 + 8 * (1 - Math.exp(-u)))) / Q.z), ORO_RGB, 0.8 * Math.exp(-u * 0.25) + 0.5 * lejos);
    k.brillo(g, Q.x, Q.y, Math.min(1400, (F * (3 + 3 * (1 - Math.exp(-u)))) / Q.z), "255,120,60", 0.55);
    g.save(); g.globalAlpha = Math.exp(-u * 1.2) * (1 - lejos); k.estallido(g, Q.x, Q.y, u * 0.75, ORO_RGB, 0.9, 9, 140, 0); g.restore();
    k.fogonazo(g, Q.x, Q.y, u * 1.1, 2000, "255,225,170");
    const e = (1 - Math.exp(-u * 1.3)) / 1.3 + 0.05 * u;
    const corre = tramo(t, T2017 - 0.35, T2017 - 0.25) * (1 - tramo(t, Tvimos + 0.1, Tvimos + 0.2));
    for (const p of nube) chispa(g, cam, corre > 0 ? null : antes, sum(C, por(p.d, p.vel * e)), p.tam, 0.9, p.c);
  }
  // las Tierras de oro
  if (Q && t > Tfab - 0.2) {
    for (const c of chorro) {
      const u = tramo(t, c.ts, c.ts + c.dur);
      if (u <= 0 || u >= 1) continue;
      const T = TIERRAS[c.dest], e = entra(u), sw = Math.sin(Math.PI * u) * c.giro * 120;
      const x = k.mez(Q.x, T.x + c.off[0] * (1 - e), e) + sw, y = k.mez(Q.y, T.y + c.off[1] * (1 - e), e);
      k.brillo(g, x, y, c.tam * 3, ORO_RGB, 0.9 * Math.sin(Math.PI * Math.min(1, u * 1.3)));
    }
    for (const T of TIERRAS) {
      const junta = tramo(t, Tfab + 0.3, T.t0);
      k.brillo(g, T.x, T.y, 60 + 300 * junta, ORO_RGB, 0.6 * junta * (1 - tramo(t, T.t0, T.t0 + 0.6)));
    }
  }
  for (const T of TIERRAS) {
    const uu = entra(tramo(t, T.t0, T.t0 + 0.5));
    if (uu <= 0) continue;
    tierraDeOro(g, T.x, T.y, 108 * (0.3 + 0.7 * uu), t * 0.4, Math.min(1, uu * 2));
    k.brillo(g, T.x, T.y, 520, "255,236,180", 0.8 * pulso(t, T.t0 + 0.1, 0.15));
  }
  veloArriba(g, 0.35);
}

const lienzoDentro = k.lienzo(1080, 1920);
function dibujaDentro(g, t) {
  // dentro de la nube: luz naranja y dorada que hierve
  const gr = g.createRadialGradient(NX, NY, 60, NX, NY, 1500);
  gr.addColorStop(0, "#ffe08a"); gr.addColorStop(0.25, "#ff9a3c"); gr.addColorStop(0.6, "#b8321a"); gr.addColorStop(1, "#2a0718");
  g.fillStyle = gr; g.fillRect(0, 0, 1080, 1920);
  g.save(); g.globalCompositeOperation = "screen"; g.globalAlpha = 0.4; k.girado(g, k.manchas, NX, NY, 2800, t * 0.07); g.restore();
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.3; k.girado(g, k.manchas, NX, NY, 2400, -t * 0.05 + 2); g.restore();
  // los neutrones que corren por la nube, hacia fuera
  for (const c of corren) {
    const f = (c.f + t * c.vel) % 1, r = 150 + f * 1100;
    g.save(); g.globalAlpha = Math.sin(Math.PI * f);
    bolaNeutron(g, NX + Math.cos(c.a) * r, NY + Math.sin(c.a) * r * 1.2, c.r * (0.6 + f));
    g.restore();
  }
  // el átomo del medio: hierro que crece bolita a bolita, y en «nace», oro
  const b = 30, oro = suave(tramo(t, Tnace - 0.15, Tnace + 0.35)), n = pegados(t);
  k.brillo(g, NX, NY, 900, ORO_RGB, 0.25 + 0.75 * oro);
  racimo(g, "Au", NX, NY, b * (1 + 0.15 * pulso(t, Tnace + 0.1, 0.15)), t * 0.35, 0.7 * (1 - oro), oro, 0, n);
  // los que vienen a pegarse
  for (let i = N0; i < NC; i++) {
    const ta = tPega(i), u = tramo(t, ta - 0.4, ta);
    if (u <= 0 || u >= 1) continue;
    const q = vienen[i - N0], d = q.d * (1 - sale(u)) + 150;
    bolaNeutron(g, NX + Math.cos(q.a) * d, NY + Math.sin(q.a) * d, b * 0.9);
  }
  k.fogonazo(g, NX, NY, (t - Tnace) * 1.3, 900, "255,230,160");
  destello(g, NX - 120, NY - 130, 520, pulso(t, Tnace + 0.2, 0.2));
  veloArriba(g, 0.45);
}

export function dibuja(g, t) {
  const al = dentroAl(t);
  if (al < 1) dibujaFuera(g, t);
  if (al > 0) {
    // al entrar, la nube de dentro crece desde el centro; al salir, se encoge hacia el centro de la nube
    const lg = lienzoDentro.getContext("2d");
    dibujaDentro(lg, t);
    const s = 1;
    g.save(); g.globalAlpha = al;
    g.drawImage(lienzoDentro, 540 - 540 * s, NY - NY * s, 1080 * s, 1920 * s);
    g.restore();
  }
}

export const choque = Tchocan;
export const llegaTierra = TIERRAS.map((T) => T.t0 + 0.4);
export const naceOro = Tnace;
export const pegan = Tpegan;
