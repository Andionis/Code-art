// «Así que se robaron un cuadro más del Louvre… y el que volvió era el más famoso del mundo. / Envíaselo a un amigo
// que le pueda interesar.»
// De vuelta en el Salon: la Mona Lisa baja y se cuelga otra vez en sus cuatro ganchos. La cámara se aleja: la
// multitud crece, los flashes saltan en «famoso». En el cierre, la cámara vuelve despacio a su cara (enlaza con el
// principio).
import * as k from "#kit";
import { v } from "#voz";
import { dibujaSalon, multitud, MLX, MLY, veloArriba } from "../mundo.js";

export const desde = (vz) => vz.frase(22).inicio;
const { suave: su, tramo: tr, mez } = k;
const f22 = v.frase(22), f23 = v.frase(23);
const T0 = f22.inicio, Tvol = f22.t("volvio"), Tfam = f22.t("famoso"), Tmun = f22.t("mundo"), T23 = f23.inicio, Tami = f23.t("amigo"), Fin = f23.fin;
export const cuelga = Tvol + 0.25;
export const flashes = [Tfam - 0.05, Tfam + 0.18, Tfam + 0.4, Tmun + 0.1, Tmun + 0.35];

export function dibuja(g, t) {
  // la cámara: cerca del hueco; se aleja en «volvió»; en el cierre vuelve a su cara
  const al = su(tr(t, Tvol - 0.2, Tfam + 0.2)), vuelve = su(tr(t, T23, Fin + 0.6));
  const z = mez(mez(1.5, 0.78, al), 3.2, vuelve), cx = MLX, cy = mez(mez(MLY - 50, MLY + 300, al), MLY - 120, vuelve);
  // la Mona Lisa baja desde arriba hasta sus ganchos
  const b = su(tr(t, T0 + 0.2, cuelga));
  const asienta = t > cuelga ? Math.sin(tr(t, cuelga, cuelga + 0.2) * Math.PI) * 10 : 0;
  dibujaSalon(g, cx, cy, z, { mona: { dy: mez(-900, 0, b) + asienta } });
  const w2s = (x, y) => ({ x: 540 + (x - cx) * z, y: 960 + (y - cy) * z });
  const c = w2s(MLX, MLY);
  k.brillo(g, c.x, c.y, 1100 * z, "255,225,170", 0.3 * su(tr(t, cuelga, cuelga + 0.4)) + 0.4 * k.pulso(t, cuelga + 0.03, 0.12));
  // la multitud crece por abajo
  const m = su(tr(t, Tvol, Tfam + 0.3)) * (1 - su(tr(t, T23 - 0.1, T23 + 0.9)));
  if (m > 0) multitud(g, t, mez(1950, 1200, m), { empuje: 0.5, filas: 7, luz: 0.3 });
  // los flashes
  for (const fl of flashes) { const p = k.pulso(t, fl, 0.06); if (p > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = `rgba(255,250,240,${0.5 * p})`; g.fillRect(0, 0, 1080, 1920); g.restore(); } }
  veloArriba(g, 0.4);
}
