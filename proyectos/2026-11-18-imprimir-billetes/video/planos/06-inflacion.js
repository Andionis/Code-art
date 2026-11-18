// «Eso es la inflación, y si no paras la máquina, se descontrola.»
// La rotativa: en «inflación» los rodillos aceleran y el chorro de billetes se espesa; en «paras» se pone al rojo y
// tiembla; en «descontrola» revienta en una tormenta de billetes con un fogonazo rojo. Se calma antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { chorro, destello, explosion, nave, rotativa, velo } from "../mundo.js";

export const desde = "eso";
const { suave: su, tramo: tr } = k;

const f8 = v.frase(8);
const Tini = f8.inicio, Tinf = f8.t("inflacion"), Tpar = f8.t("paras"), Tdes = f8.t("descontrola"), Tfin = v.frase(9).inicio;
const furia = (t) => su(tr(t, Tpar - 0.2, Tdes));
const tiembla = (t) => furia(t) * (1 - su(tr(t, Tdes + 0.4, Tfin - 0.2)));
const vel = (t) => 1 + 1.2 * su(tr(t, Tinf - 0.1, Tinf + 0.5)) + 2 * su(tr(t, Tpar, Tdes));
const gira = (t) => 6 * t + 14 * su(tr(t, Tinf - 0.1, Tinf + 0.5)) * (t - Tinf) + 30 * su(tr(t, Tpar, Tdes)) * (t - Tpar);
const camZ = (t) => k.mez(26, 30, su(tr(t, Tini, Tinf + 0.4))) + 9 * k.entra(tr(t, Tdes - 0.05, Tdes + 0.5));

export function dibuja(g, t) {
  const sh = tiembla(t) * 0.25;
  const c = k.mira([Math.sin(t * 53) * sh, 2.4 + Math.cos(t * 41) * sh, camZ(t)], [0, 0.4, 0]);
  nave(g, t, furia(t));
  const p = k.proyecta(c, [0, 0, 0]), s = k.F / p.z;
  rotativa(g, p.x, p.y, s, t, gira(t), furia(t), tiembla(t));
  k.deLejosACerca([
    ...chorro(g, c, t, { desde: Tini - 3, ritmo: 55, vel: vel(t), abre: 1 + furia(t), hasta: Tdes }),
    ...explosion(g, c, t, Tdes - 0.03, [0, 0.4, 2], { n: 260, fuerza: 3.2, sinFreno: true }),
  ]);
  k.fogonazo(g, p.x, p.y, t - Tdes + 0.03, 1700, "255,110,80");
  destello(g, 0.55 * k.pulso(t, Tdes, 0.07), "255,120,90");
  velo(g);
}
export const momentos = { inflacion: Tinf, paras: Tpar, descontrola: Tdes - 0.03, fin: Tfin };
