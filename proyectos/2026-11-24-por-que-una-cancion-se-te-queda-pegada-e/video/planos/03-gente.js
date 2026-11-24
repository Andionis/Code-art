// «Le pasa a nueve de cada diez personas, cada semana.»
// - Diez cabezas de luz de perfil, en dos filas, apagadas. La cámara se aleja un poco.
// - «nueve»: se encienden nueve, una tras otra, cada una con su bucle de notas dentro; la décima se queda apagada.
// - «diez»: «9 de cada 10». «semana»: las nueve laten a la vez. Luego el bucle frena y reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { NEON, cabeza, fondo, nota, CEREBRO, velo } from "../mundo.js";

export const desde = "le";

const { suave: su, tramo: tr, mez } = k;
const f3 = v.frase(3);
const Tini = f3.inicio, Tnue = f3.t("nueve"), Tdie = f3.t("diez"), Tsem = f3.t("semana"), Tfin = f3.fin;
const ENC = Array.from({ length: 9 }, (_, i) => Tnue - 0.15 + i * 0.11);
export const momentos = { enciende: ENC, semana: Tsem };

const S = 215;
// la apagada, la cuarta de la segunda fila
const SITIOS = [];
for (let f = 0; f < 2; f++) for (let c = 0; c < 5; c++) SITIOS.push([140 + c * 205 + (f ? 40 : 0), 800 + f * 470]);
const APAGADA = 8;
const ORDEN = [0, 6, 2, 9, 4, 5, 1, 7, 3];

// el bucle de cada cabeza frena antes del corte
const PA = Tsem + 0.3, PB = Tfin + 0.35;
const tb = (t) => { if (t < PA) return t; const x = Math.min(t, PB) - PA, L = PB - PA; return PA + x - (x * x) / (2 * L); };

export function dibuja(g, t) {
  fondo(g, 540, 1000);
  const esc = mez(1.18, 1, su(tr(t, Tini, Tdie + 0.3)));
  g.save(); g.translate(540, 1030); g.scale(esc, esc); g.translate(-540, -1030);
  const late = k.pulso(t, Tsem + 0.15, 0.18);
  for (let i = 0; i < 10; i++) {
    const [x, y] = SITIOS[i];
    const n = ORDEN.indexOf(i), te = n < 0 ? 99 : ENC[n];
    const on = n < 0 ? 0 : su(tr(t, te, te + 0.3));
    cabeza(g, x, y, S * (1 + 0.06 * late * on), { al: 0.45 + 0.55 * on, brilloCerebro: 0.1 + 0.9 * on + 0.5 * late * on });
    if (on > 0) {
      for (let j = 0; j < 4; j++) {
        const th = j * 1.5708 + 2.4 * (tb(t) - te) + i;
        const lx = CEREBRO.x + Math.cos(th) * CEREBRO.rx * 0.6, ly = CEREBRO.y + Math.sin(th) * CEREBRO.ry * 0.6;
        nota(g, x + lx * S, y + ly * S, S * 0.045 * on, NEON[(i + j) % NEON.length], 0, on, j % 3);
      }
      k.brillo(g, x + CEREBRO.x * S, y + CEREBRO.y * S, 260, "255,150,230", 0.6 * k.pulso(t, te + 0.05, 0.12));
    }
  }
  g.restore();
  // la cifra
  const cifra = k.entra(tr(t, Tdie - 0.25, Tdie + 0.1));
  if (cifra > 0) k.pastilla(g, 540, 1035, "9 de cada 10", "", "255,210,90", cifra, 110);
  velo(g, 0.5);
}
