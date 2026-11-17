// «Así que tu anillo es más viejo que el Sol: es polvo de estrellas que chocaron. Síguenos para más datos que te vuelan
// la cabeza.»
// - Corte en «Así»: el anillo de oro otra vez, cerca, girando.
// - «más viejo que el Sol»: detrás aparece el Sol, lejos, y se apaga.
// - «polvo de estrellas que chocaron»: al fondo, por el agujero, dos estrellas azules chocan con un destello y de ellas
//   llega un río de chispas de oro hasta el anillo, que brilla.
// - El cierre: la cámara se aleja hasta el encuadre del primer fotograma del video (mismo anillo, mismo giro, las dos
//   estrellas al fondo y las chispas llegando), para que el final enlace con el principio.
import * as k from "#kit";
import { v } from "#voz";
import { choque as choqueHook } from "./01-hook.js";
import { anillo, chispa, destello, espiral, puntoAnillo, veloArriba, ORO_RGB } from "../mundo.js";

export const desde = (v) => v.frase(12).inicio;
export const entrada = "corte";

const { suave, tramo, pulso, proyecta, F } = k;
const f12 = v.frase(12), f13 = v.frase(13);
const T0 = f12.inicio, Tanillo = f12.t("anillo"), Tviejo = f12.t("viejo"), Tsol = f12.t("sol"), Tpolvo = f12.t("polvo"), Tchoc = f12.t("chocaron") + 0.1;
const Tsig = f13.t("siguenos"), FIN = v.duracion ?? 74.24;

// la cámara y el giro del anillo terminan donde empieza el video (01-hook en t = 0), con la misma velocidad
const camZ = k.claves([[T0, 2.7], [Tviejo, 2.85], [Tchoc, 3.05], [FIN, 3.35], [FIN + 1, 2.95]]);
const camY = k.claves([[T0, 0.42], [FIN, 0.2], [FIN + 1, 0.2]]);
const camX = k.claves([[T0, -0.1], [FIN, 0.12], [FIN + 1, 0.1]]);
const camara = (t) => k.mira([camX(t), camY(t), camZ(t)], [0, 0.6, -40]);
const giroTh = k.claves([[T0, -4.6], [Tchoc, -2.5], [FIN, -1.2], [FIN + 1, -0.6]]);
const giroPs = k.claves([[T0, 0.2], [FIN, 0.42], [FIN + 1, 0.42]]);
const ejeAnillo = (t) => { const th = giroTh(t), ps = giroPs(t); return [Math.sin(th) * Math.cos(ps), Math.sin(ps), Math.cos(th) * Math.cos(ps)]; };

const C2 = [0, 0.1, -12], SOL = [-4.5, 3.2, -26];
const cielo = k.cielo(7, 2600, [0, 0, -30], 260, 6);
const az = k.azar(31);
const llegan = Array.from({ length: 70 }, () => ({
  a: [C2[0] + (az() - 0.5) * 3, C2[1] + (az() - 0.5) * 3, C2[2]],
  b: [(az() - 0.5) * 5, (az() - 0.5) * 6, 2 + az() * 3],
  fase: az(), vel: 0.22 + az() * 0.18, tam: 0.03 + az() * 0.05,
}));
// el río de oro del choque, hacia el anillo
const rio = Array.from({ length: 120 }, () => ({ t0: Tchoc + az() * 1.2, dur: 0.8 + az() * 0.5, off: [(az() - 0.5) * 1.6, (az() - 0.5) * 1.6, 0], tam: 0.07 + az() * 0.09 }));

export function dibuja(g, t) {
  const cam = camara(t);
  k.fondo(g, cam, 1);
  k.estrellas(g, cam, null, cielo);
  // el Sol, lejos, en «Sol»
  const sol = suave(tramo(t, Tviejo, Tsol + 0.2)) * (1 - suave(tramo(t, Tpolvo - 0.2, Tpolvo + 0.4)));
  const S = proyecta(cam, SOL);
  if (S && sol > 0.01) {
    k.brillo(g, S.x, S.y, (F * 6) / S.z, "amarilla", 0.7 * sol);
    k.estrellaTransparente(g, "amarilla", S.x, S.y, (F * 1.2) / S.z, t * 0.2, 0.4, sol);
  }
  // las dos estrellas azules: chocan en «chocaron»; al final vuelven a girar como en el primer fotograma
  const C = proyecta(cam, C2);
  if (C) {
    const antesCh = suave(tramo(t, Tpolvo - 0.6, Tpolvo)) * (t < Tchoc ? 1 : 0);
    const otraVez = suave(tramo(t, Tsig - 0.3, FIN - 0.3));
    const dibujaPar = (tt, Tc, al) => {
      const [a, b] = espiral(C2, tt, Tc, 3, 4.4, 5);
      for (const X of [a, b]) { const Q = proyecta(cam, X); if (Q) k.estrellaTransparente(g, "azul", Q.x, Q.y, (F * 0.42) / Q.z, tt * 0.8, 0.5, al); }
    };
    if (antesCh > 0) dibujaPar(t - (Tchoc - choqueHook), choqueHook, antesCh);
    if (otraVez > 0) dibujaPar(t - FIN, choqueHook, otraVez);
    if (t >= Tchoc) {
      const u = t - Tchoc;
      k.fogonazo(g, C.x, C.y, u * 1.4, 700, "255,222,150");
      k.brillo(g, C.x, C.y, (F * 4) / C.z, ORO_RGB, 0.8 * Math.exp(-u * 0.8));
      for (const p of rio) {
        const w = tramo(t, p.t0, p.t0 + p.dur); if (w <= 0 || w >= 1) continue;
        const X = k.mezV(k.sum(C2, p.off), k.sum([p.off[0] * 0.5, p.off[1] * 0.5, 0], [0, 0, 0.3]), w * w);
        chispa(g, cam, null, X, p.tam, Math.sin(Math.PI * w));
      }
    }
  }
  // las chispas que llegan del fondo, como al principio
  const al0 = suave(tramo(t, Tsig - 0.6, FIN - 0.4));
  if (al0 > 0) for (const c of llegan) {
    const f = (c.fase + t * c.vel) % 1, X = k.mezV(c.a, c.b, f);
    chispa(g, cam, null, X, c.tam, al0 * Math.sin(Math.PI * f) * 0.9);
  }
  // el anillo, que brilla cuando le llega el oro
  const brilla = pulso(t, Tanillo + 0.1, 0.22) * 0.6 + pulso(t, Tchoc + 1.0, 0.3);
  anillo(g, cam, [0, 0, 0], ejeAnillo(t), 1, 0.17, brilla);
  if (brilla > 0.02) { const Q = proyecta(cam, puntoAnillo([0, 0, 0], ejeAnillo(t), [-0.7, 0.75, 0.4])); if (Q) destello(g, Q.x, Q.y, 520, Math.min(1, brilla)); }
  veloArriba(g, 0.45);
}

export const choque = Tchoc;
