// «Y cuando el museo volvió a abrir, miles de personas fueron a mirar… la pared vacía.»
// El Salon de nuevo abierto, con luz: la cámara, pegada a la pared vacía, se aleja y aparece la multitud de espaldas,
// cada vez más grande. «vacía»: el hueco de la pared y sus cuatro ganchos se encienden.
import * as k from "#kit";
import { v } from "#voz";
import { dibujaSalon, multitud, MLX, MLY, GANCHOS, veloArriba } from "../mundo.js";

export const desde = (vz) => vz.frase(14).inicio;
const { suave: su, tramo: tr, mez } = k;
const f = v.frase(14);
const T0 = f.inicio, Tabr = f.t("abrir"), Tmil = f.t("miles"), Tvac = f.t("vacia"), Fin = f.fin;
export const enciende = Tvac - 0.05;

export function dibuja(g, t) {
  const u = su(tr(t, T0 + 0.2, Tvac - 0.2));
  const z = mez(1.7, 0.75, u), cy = mez(MLY, MLY + 280, u);
  dibujaSalon(g, MLX, cy, z, { mona: null });
  const w2s = (x, y) => ({ x: 540 + (x - MLX) * z, y: 960 + (y - cy) * z });
  const e = su(tr(t, enciende, enciende + 0.3));
  if (e > 0) {
    const c = w2s(MLX, MLY);
    k.brillo(g, c.x, c.y, 900 * z, "255,225,170", 0.35 * e);
    for (const [gx, gy] of GANCHOS) { const p = w2s(gx, gy); k.brillo(g, p.x, p.y, 200, "255,220,150", 0.7 * e); }
  }
  // la multitud entra por abajo y crece
  const m = su(tr(t, Tabr - 0.3, Tmil + 0.6));
  if (m > 0) multitud(g, t, mez(1900, 1180, m) - 140 * u, { empuje: 0.35, filas: 7, luz: 0.3 });
  veloArriba(g, 0.4);
}
