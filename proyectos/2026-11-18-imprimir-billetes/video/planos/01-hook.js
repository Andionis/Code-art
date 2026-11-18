// «¿Por qué no imprimen más billetes para que todos seamos ricos?»
// - Fotograma 0: la cámara entra a toda velocidad en la nave, entre un huracán de billetes que sale disparado de la
//   rotativa hacia nosotros; los rodillos giran.
// - «imprimen»: los rodillos aceleran con un golpe de luz y el chorro se espesa.
// - «ricos»: revienta una explosión de billetes hacia la cámara con un fogonazo dorado; luego se calma antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { chorro, destello, explosion, nave, rotativa, su, tr, velo } from "../mundo.js";

export const desde = 0;

const f1 = v.frase(1);
const Timp = f1.t("imprimen"), Tric = f1.t("ricos"), Tfin = v.frase(2).inicio;

// la cámara: llega disparada de lejos y frena delante de la boca
const camZ = (t) => k.mez(80, 31, k.entra(tr(t, 0, 1.3))) - 3 * su(tr(t, 1.3, Tric));
const camY = (t) => k.mez(5, 2.2, k.entra(tr(t, 0, 1.3)));
const cam = (t) => k.mira([0, camY(t), camZ(t)], [0, 0.4, 0]);
const gira = (t) => 6 * t + 16 * Math.max(0, t - Timp) * su(tr(t, Timp - 0.1, Timp + 0.4));

export function dibuja(g, t) {
  const c = cam(t);
  nave(g, t);
  const p = k.proyecta(c, [0, 0, 0]), s = k.F / p.z;
  rotativa(g, p.x, p.y, s, t, gira(t), 0);
  const cosas = [
    ...chorro(g, c, t, { desde: -5, ritmo: 70, vel: 1 + 0.8 * su(tr(t, Timp - 0.1, Timp + 0.4)) + 2.5 * su(tr(t, Tric - 0.1, Tric + 0.3)), hasta: Tric - 0.1 }),
    ...explosion(g, c, t, Tric - 0.04, [0, 0.4, 3], { n: 220, fuerza: 2.4, sinFreno: true }),
  ];
  k.deLejosACerca(cosas);
  k.fogonazo(g, p.x, p.y, t - (Tric - 0.04), 1600, "255,220,120");
  destello(g, 0.35 * k.pulso(t, Timp + 0.02, 0.06) + 0.5 * k.pulso(t, Tric, 0.06), "255,250,225");
  velo(g);
}

export const momentos = { imprimen: Timp + 0.02, ricos: Tric - 0.04, fin: Tfin };
