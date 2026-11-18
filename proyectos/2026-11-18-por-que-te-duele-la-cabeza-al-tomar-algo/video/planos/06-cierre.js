// «Envíaselo a un amigo que le pueda interesar.»
// Vuelta a la cabeza de cristal con su granizado, como en el hook: sorbe otra vez, la escarcha empieza a subir a la
// frente y la cámara se acerca a la pajita hasta el encuadre del primer fotograma (el video enlaza consigo mismo).
import * as k from "#kit";
import { v } from "#voz";
import { fondo, vista, sinVista, camino2D, cabeza, granizado, velo, vineta } from "../mundo.js";
import { cam as camHook } from "./01-hook.js";

export const desde = "enviaselo";
export const entrada = "corte";

const { suave: su, tramo: tr } = k;
const f = v.frase(12), T0 = f.inicio - 0.05, Tfin = v.duracion;

const cam = camino2D([
  [T0, [0.66, -200, 170]],
  [f.t("amigo"), [0.72, -210, 170]],
  [Tfin - 0.5, [1.6, -380, 280]],
  [Tfin, camHook(0)],
]);

export function dibuja(g, t) {
  const c = cam(t);
  fondo(g, t, 0);
  vista(g, ...c);
  granizado(g, t, 0.85, su(tr(t, T0, T0 + 0.3)));
  cabeza(g, t, { trans: 0, frio: 0.6 * su(tr(t, f.t("pueda"), Tfin)), fuera: 0.3 * su(tr(t, f.t("pueda"), Tfin)) });
  sinVista(g);
  vineta(g);
  velo(g, 0.45);
}
