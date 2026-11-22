// «Repite todo eso durante millones de años, y hoy...»
// Corte en «Repite», de vuelta al mar con la costa y el río. La cámara quieta: pasa el tiempo deprisa.
// - El sol cruza el cielo una y otra vez, cada vez más deprisa (días y noches suaves); las nubes corren; el río baja
//   lleno de granos y el mar se va llenando de sal que brilla.
// - «hoy»: frena en un día de sol, quieto un momento antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { camPaisaje, paisaje, velo } from "../mundo.js";

export const desde = "repite";

const { suave: su, tramo: tr, mez } = k;
const f10 = v.frase(10), T0 = f10.inicio, Thoy = f10.t("hoy"), Tcorte = f10.t("cada") - 0.04; // «cada» de esta frase (hay otra antes)
// las vueltas del sol: 3 días enteros que se aceleran y frenan en «hoy», con el sol alto
const vueltas = (t) => 3.25 * su(tr(t, T0, Thoy));
export const momentos = { dias: [0.5, 1.5, 2.5].map((n) => { let a = T0, b = Thoy; for (let i = 0; i < 30; i++) { const m = (a + b) / 2; vueltas(m) < n ? (a = m) : (b = m); } return a; }) };

export function dibuja(g, t) {
  const c = camPaisaje(0, 14, -62, 1000);
  const ph = vueltas(t) * Math.PI * 2 + Math.PI * 0.3;
  const sx = 540 - 560 * Math.cos(ph), sy = 1000 - 820 * Math.sin(ph);
  const noche = Math.max(0, Math.min(1, -Math.sin(ph) * 1.6 + 0.1));
  const sal = mez(0.35, 1, su(tr(t, T0, Thoy)));
  paisaje(g, c, t * 3, {
    sal: 1, nSal: 1, velSal: 2, salMar: sal, sol: [sx, sy], solAl: Math.sin(ph) > -0.15 ? 1 : 0,
    nubes: [0, 1, 2, 3].map((i) => [((i * 120 + (t - T0) * 160) % 520) - 260, 60 + 10 * i, 380 + 30 * i, 150, 0.2, 0.7, 60 + i]),
  });
  // la noche: un velo azul oscuro suave y unas estrellas
  if (noche > 0.01) {
    g.fillStyle = `rgba(6,12,40,${0.7 * noche})`; g.fillRect(0, 0, 1080, 1920);
    k.brillo(g, 1080 - sx, Math.max(500, 900 - 500 * Math.sin(ph + Math.PI)), 300, "220,230,255", 0.6 * noche);
  }
  velo(g, 0.4);
}
