// «¿Por qué los gatos casi siempre caen de pie? Aunque se caigan de espaldas, en el aire, sin nada de dónde
// agarrarse, se dan la vuelta.»
// El cielo: fotograma 0, el gato naranja cae de espaldas, patas arriba y enorme, entre nubes que suben a toda velocidad
// (la cámara cae con él). «en el aire, sin nada de dónde agarrarse»: estira las patas buscando algo y no hay nada.
// «se dan»: gira en dos mitades (primero la de delante, luego la de atrás); el pasto sube y aterriza en «vuelta», con
// las patas como muelles y un poco de polvo. Reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { gato, cielo, pasto, polvo, sombraEnSuelo, veloArriba } from "../mundo.js";

export const desde = 0;
const { suave: su, tramo: tr, mez, claves } = k;
const PI = Math.PI;
const f2 = v.frase(2);
const Taire = f2.t("aire"), Tse = f2.t("se", 2), Tvuelta = f2.t("vuelta");
const G0 = Tse - 0.05;               // empieza el giro
const Tf = G0 + 0.45, Tb = G0 + 0.8; // acaba la mitad delantera / la trasera
const Tsuelo = Tvuelta + 0.18;        // toca el pasto
export const momentos = { giro: G0, giroAtras: G0 + 0.35, suelo: Tsuelo };

const CY = 980;                       // la cintura del gato en pantalla
const SUELO = CY + 330;               // el borde del pasto cuando ha llegado
// cuánto ha bajado la cámara: rápido todo el rato, frena hasta pararse al tocar el suelo
const vel = (t) => (t < Tsuelo - 0.5 ? 2600 : 2600 * (1 - su(tr(t, Tsuelo - 0.5, Tsuelo))));
function cae(t) { const tt = Math.min(t, Tsuelo); return 2600 * tt - (tt > Tsuelo - 0.5 ? 2600 * 0.5 * su(tr(tt, Tsuelo - 0.5, Tsuelo)) * (tt - (Tsuelo - 0.5)) : 0); }
const ySuelo = claves([[0, 2300], [Tsuelo - 0.75, 2300], [Tsuelo, SUELO]]);

export function dibuja(g, t) {
  cielo(g, cae(t), vel(t));
  const yS = t < Tsuelo - 0.75 ? 2300 : t > Tsuelo ? SUELO : ySuelo(t);
  pasto(g, yS, t);
  const busca = su(tr(t, Taire - 0.2, Taire + 0.4)) * (1 - su(tr(t, G0 - 0.25, G0)));
  // el giro en dos mitades
  const rf = mez(PI, 0, su(tr(t, G0, Tf)));
  const rb = mez(PI, 0, su(tr(t, G0 + 0.3, Tb)));
  const ef = claves([[0, 0.35], [G0 - 0.1, 0.1], [G0 + 0.05, 1], [Tf - 0.05, 1], [Tf + 0.15, 0.1], [Tsuelo, 0.05], [Tsuelo + 0.12, 0.45], [Tsuelo + 0.4, 0.2]])(t);
  const eb = claves([[0, 0.5], [G0, 0.1], [G0 + 0.2, 0.05], [Tf, 1], [Tb - 0.05, 1], [Tb + 0.15, 0.1], [Tsuelo, 0.05], [Tsuelo + 0.12, 0.45], [Tsuelo + 0.4, 0.2]])(t);
  const dobla = 0.55 * Math.sin(PI * tr(t, G0 - 0.05, Tb + 0.05));
  const bote = t > Tsuelo ? -18 * Math.sin(PI * tr(t, Tsuelo + 0.1, Tsuelo + 0.45)) + 16 * Math.exp(-Math.pow((t - Tsuelo - 0.08) / 0.06, 2)) : 0;
  const wob = (1 - su(tr(t, G0 - 0.2, G0))) * 0.07 * Math.sin(t * 2.3);
  if (yS < 1960) sombraEnSuelo(g, 520, yS + 30, 380 * mez(0.5, 1, tr(yS, 2000, SUELO)), su(tr(yS, 1950, SUELO)));
  const esc = mez(1.5, 1.12, su(tr(t, 0, 2.6))), gx = mez(430, 500, su(tr(t, 0, 2.6)));
  gato(g, gx, CY + bote, esc, wob, rf, rb, ef, eb, dobla, t, { agita: mez(0.6, 1.2, busca) * (1 - su(tr(t, G0 - 0.15, G0))), abre: busca, colaFase: t * 5 });
  polvo(g, 520, SUELO + 40, tr(t, Tsuelo, Tsuelo + 0.6));
  veloArriba(g, 1);
}
