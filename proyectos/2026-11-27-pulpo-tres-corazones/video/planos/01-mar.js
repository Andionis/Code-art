// «¿Por qué el pulpo tiene tres corazones? Y uno de ellos se detiene cada vez que nada.»
// El mar abierto, una sola cámara.
// - Fotograma 0: la cámara baja a toda velocidad por el agua, entre burbujas que suben; abajo, el pulpo rojo.
// - «pulpo»: llega encima de él, grande. «tres»: el cuerpo se vuelve transparente y se ven los tres corazones
//   latiendo, con la sangre azul corriendo.
// - «uno»: la cámara se acerca al corazón grande. «detiene»: deja de latir y se apaga.
// - «nada»: el pulpo aprieta el manto y sale disparado hacia arriba, con los brazos detrás; frena antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { mar, pulpo, latido, integra, velo } from "../mundo.js";

export const desde = 0;

const { suave: su, tramo: tr, mez, claves } = k;
const f1 = v.frase(1), f2 = v.frase(2);
const Tpul = f1.t("pulpo"), Ttres = f1.t("tres"), Tuno = f2.t("uno"), Tdet = f2.t("detiene"), Tnada = f2.t("nada"), Tfin = f2.fin;
export const momentos = { llega: Tpul, tres: Ttres, detiene: Tdet, nada: Tnada };

const camY = claves([[0, -900], [Tpul + 0.25, 230], [Tuno, 210], [Tuno + 0.7, 40], [Tnada, 40], [Tnada + 0.7, -230]]);
const camS = claves([[0, 0.42], [Tpul + 0.25, 1.0], [Tuno, 1.02], [Tuno + 0.7, 1.45], [Tnada, 1.45], [Tnada + 0.7, 1.05]]);
const azC = k.azar(91);
const CHORRO = Array.from({ length: 40 }, () => ({ d: azC() * 0.3, x: (azC() - 0.5) * 220, v: 250 + azC() * 450, r: 8 + azC() * 26 }));
const paraG = (t) => su(tr(t, Tdet - 0.05, Tdet + 0.35));
const fase = integra((t) => 70 * (1 - 0.7 * paraG(t)), 8);

export function dibuja(g, t) {
  const c = { x: 0, y: camY(t), s: camS(t) };
  mar(g, c, t, { burbujas: 1 - 0.7 * su(tr(t, Tpul, Tpul + 0.6)) });
  const ver = su(tr(t, Ttres - 0.1, Ttres + 0.35));
  const nada = su(tr(t, Tnada - 0.1, Tnada + 0.3));
  const sube = k.entra(tr(t, Tnada, Tnada + 0.65));
  const g0 = 1 - paraG(t);
  pulpo(g, c, t, {
    x: 0, y: 200 - 330 * sube, s: 1, rot: 0,
    pose: { relax: 1 - nada, nada, camina: 0 }, contrae: nada * (1 - 0.4 * su(tr(t, Tnada + 0.4, Tnada + 0.8))), ver,
    lat: { b: [latido(t, 95, 0.5), latido(t, 95, 0.5), latido(t, 80) * g0], on: [1, 1, g0], al: 1 },
    sangre: { fase: fase(t), al: 1, branquias: 1, brazos: 1, salida: 0.25 + 0.75 * g0 },
  });
  // el chorro de agua que lo empuja: burbujas que salen por debajo del manto
  // el chorro de agua que lo empuja: burbujas que salen por debajo del manto y se quedan atrás
  for (const q of CHORRO) {
    const sp = tr(t, Tnada + q.d, Tnada + q.d + 0.7);
    if (sp <= 0 || sp >= 1) continue;
    const wy = 200 - 330 * k.entra(tr(Tnada + q.d, Tnada, Tnada + 0.65)) + 40 + q.v * k.entra(sp);
    const x = 540 + (q.x * (1 + 1.5 * sp) - c.x) * c.s, y = 960 + (wy - c.y) * c.s, r = q.r * c.s;
    g.strokeStyle = `rgba(225,245,255,${0.75 * (1 - sp)})`; g.lineWidth = 4;
    g.fillStyle = `rgba(200,235,255,${0.15 * (1 - sp)})`;
    g.beginPath(); g.arc(x, y, r, 0, 6.283); g.fill(); g.stroke();
  }
  velo(g, 0.5);
}
