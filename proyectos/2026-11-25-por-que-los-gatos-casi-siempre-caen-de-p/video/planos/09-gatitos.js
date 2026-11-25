// «Los gatitos empiezan a hacerlo a las tres semanas, y a las siete ya les sale perfecto.»
// Corte en «Los»: la sala, con dos cojines grandes en la alfombra. «tres semanas»: un gatito cae de espaldas sobre el
// cojín de la izquierda, gira a medias y se queda tumbado de lado; «3 semanas». «siete»: otro gatito cae de espaldas
// sobre el de la derecha, gira en dos mitades y cae de pie; «7 semanas»; «perfecto»: un destello.
import * as k from "#kit";
import { v } from "#voz";
import { gato, sala, cojin, veloArriba } from "../mundo.js";

const { suave: su, tramo: tr, mez, claves } = k;
const PI = Math.PI;
const f9 = v.frase(9);
const Ttres = f9.t("tres"), Tsie = f9.t("siete"), Tper = f9.t("perfecto");
const C1 = { x: 280, y: 1300 }, C2 = { x: 800, y: 1300 };
const toca1 = Ttres + 0.15, toca2 = Tsie + 0.3;
export const desde = () => f9.inicio;
export const momentos = { toca1, toca2, brillo: Tper + 0.05 };
const S = 0.52;

function cae(t, toca, dur) { const u = tr(t, toca - dur, toca); return mez(-1500, 0, u * u); }

export function dibuja(g, t) {
  sala(g);
  const h1 = k.pulso(t, toca1 + 0.05, 0.12), h2 = k.pulso(t, toca2 + 0.05, 0.12);
  cojin(g, C1.x, C1.y, 520, 250, undefined, h1);
  cojin(g, C2.x, C2.y, 520, 250, ["#7fd3ff", "#3a8fd6", "#1d5594"], h2);
  // gatito 1: gira a medias y cae de lado
  {
    const dy = cae(t, toca1, 1.6);
    const r = t < toca1 ? mez(PI, PI * 0.55, su(tr(t, toca1 - 0.9, toca1))) : PI * 0.55;
    const y = C1.y - 175 + dy + (t > toca1 ? 10 * h1 : 0);
    const ang = t < toca1 ? 0.15 * Math.sin(t * 6) : 0.12;
    gato(g, C1.x - 10, y, S, ang, r, r + 0.15, 0.4, 0.4, 0, t, { cabeza: 1.35, agita: t < toca1 ? 1 : 0.15, ojos: t > toca1 + 0.2 ? 0.55 : 1 });
  }
  // gatito 2: gira en dos mitades y cae de pie
  if (t > Tsie - 0.9) {
    const dy = cae(t, toca2, 0.85);
    const g0 = toca2 - 0.6;
    const rf = mez(PI, 0, su(tr(t, g0, g0 + 0.25))), rb = mez(PI, 0, su(tr(t, g0 + 0.2, g0 + 0.45)));
    const ef = claves([[0, 0.2], [g0, 1], [g0 + 0.25, 1], [g0 + 0.35, 0.1], [toca2, 0], [toca2 + 0.1, 0.45], [toca2 + 0.4, 0.15]])(t);
    const eb = claves([[0, 0.2], [g0, 0.1], [g0 + 0.2, 1], [g0 + 0.45, 1], [g0 + 0.55, 0.1], [toca2, 0], [toca2 + 0.1, 0.45], [toca2 + 0.4, 0.15]])(t);
    const y = C2.y - 260 + dy + (t > toca2 ? 12 * h2 : 0);
    gato(g, C2.x - 20, y, S, 0, rf, rb, ef, eb, 0.4 * Math.sin(PI * tr(t, g0, g0 + 0.5)), t, { cabeza: 1.35 });
  }
  // las etiquetas
  const e1 = su(tr(t, toca1 + 0.05, toca1 + 0.35)), e2 = su(tr(t, toca2 + 0.05, toca2 + 0.35));
  if (e1 > 0) k.pastilla(g, C1.x, 720, "3", "semanas", "255,255,255", e1, 100);
  if (e2 > 0) k.pastilla(g, C2.x, 720, "7", "semanas", "184,255,122", e2, 100);
  // «perfecto»: un destello sobre el gatito de pie
  const b = k.pulso(t, Tper + 0.1, 0.18);
  if (b > 0.01) k.brillo(g, C2.x, C2.y - 300, 600, "255,240,170", b * 0.9);
  veloArriba(g, 0.7);
}
