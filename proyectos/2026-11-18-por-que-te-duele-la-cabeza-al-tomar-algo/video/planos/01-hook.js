// «¿Por qué te duele la cabeza cuando tomas algo muy helado?» · «Tu cerebro no se está congelando: el frío ni
// siquiera le llega.»
// - Fotograma 0: pegados a la boca, el granizado sube disparado por la pajita y estallan trozos de hielo hacia la
//   cámara; la cámara sube deprisa a la frente.
// - «duele»: rayos rojos en la frente. «cabeza»: la escarcha se extiende por la frente.
// - «helado»: la cámara se ha alejado hasta la cabeza entera con el vaso; latido rojo.
// - «cerebro»: la piel se vuelve transparente; dentro, el cerebro cálido, latiendo. «congelando»: la escarcha se
//   derrite contra su calor. «el frío ni siquiera le llega»: el frío azul se queda en la boca.
import * as k from "#kit";
import { v } from "#voz";
import { fondo, vista, sinVista, camino2D, cabeza, granizado, trozos, velo, vineta, aPantalla, BOCA } from "../mundo.js";

export const desde = 0;

const { suave: su, tramo: tr, pulso } = k;
const f1 = v.frase(1), f2 = v.frase(2);
const Tdue = f1.t("duele"), Tcab = f1.t("cabeza"), Thel = f1.t("helado");
const Tcer = f2.t("cerebro"), Tcon = f2.t("congelando"), Tfri = f2.t("frio"), Tlle = f2.t("llega");

export const cam = camino2D([
  [0, [2.3, -420, 330]],
  [Tdue - 0.05, [1.55, -300, -120]],
  [Tcab + 0.3, [1.4, -270, -170]],
  [Thel - 0.15, [0.66, -200, 170]],
  [Thel + 0.6, [0.64, -200, 170]],
  [Tcer + 0.8, [0.95, -40, -100]],
  [Tfri, [0.95, -60, 20]],
  [Tlle + 0.3, [1.15, -130, 150]],
  [f2.fin + 0.3, [1.25, -140, 170]],
]);

export const frio = (t) => su(tr(t, 0.25, Tcab + 0.35)) * (1 - su(tr(t, Tcon, Tcon + 0.9)));
export const estado = (t) => ({
  trans: su(tr(t, Tcer - 0.1, Tcer + 0.7)),
  calor: su(tr(t, Tcer, Tcer + 0.8)),
  frio: frio(t),
  fuera: su(tr(t, 0.25, Thel + 0.2)) * (1 - 0.6 * su(tr(t, Tcon, Tcon + 0.9))),
  dolor: (0.7 * su(tr(t, Tdue - 0.05, Tdue + 0.15)) + 0.35 * pulso(t, Thel + 0.1, 0.18)) * (1 - su(tr(t, Tcer - 0.2, Tcer + 0.5))),
  bocaFria: su(tr(t, Tfri - 0.1, Tfri + 0.6)),
});

export function dibuja(g, t) {
  const c = cam(t), e = estado(t);
  fondo(g, t, e.calor);
  vista(g, ...c);
  granizado(g, t, 0.85 - 0.08 * su(tr(t, 0, Thel)), 1 - su(tr(t, Thel, Thel + 0.6)));
  cabeza(g, t, e);
  sinVista(g);
  // los trozos de hielo que saltan de la boca al empezar
  const [bx, by] = aPantalla(c, BOCA[0], BOCA[1]);
  trozos(g, bx, by, tr(t, -0.05, 0.95));
  k.fogonazo(g, bx, by, t + 0.06, 900, "170,220,255");
  vineta(g);
  velo(g, 0.45);
}

export const momentos = { duele: Tdue, cabeza: Tcab, helado: Thel, cerebro: Tcer, congelando: Tcon, frio: Tfri };
