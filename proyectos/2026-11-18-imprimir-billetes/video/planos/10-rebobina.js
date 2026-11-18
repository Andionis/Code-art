// El final rebobina: cuando la voz termina el cierre, el vídeo entero pasa hacia atrás a toda velocidad, con rayas
// de cinta, y se para justo en el primer fotograma (para que el reel se vea en bucle sin notarlo).
import * as k from "#kit";
import { v } from "#voz";
import { dibuja as d1 } from "./01-hook.js";
import { dibuja as d2 } from "./02-zimbabue.js";
import { dibuja as d3 } from "./03-pueblo.js";
import { dibuja as d4 } from "./04-imprime.js";
import { dibuja as d5 } from "./05-doble.js";
import { dibuja as d6 } from "./06-inflacion.js";
import { dibuja as d7 } from "./07-precios.js";
import { dibuja as d8 } from "./08-remate.js";
import { dibuja as d9 } from "./09-siguenos.js";

const { suave: su, tramo: tr } = k;
export const T0 = v.frase(12).fin + 0.02;
export const desde = T0;
export const entrada = "corte";
const TF = v.duracion - 1 / 60;

const PL = [
  [0, d1], [v.t("zimbabue"), d2], [v.t("imagina"), d3], [v.t("ahora"), d4], [v.t("todos#2"), d5],
  [v.t("eso"), d6], [v.t("en"), d7], [v.t("porque"), d8], [v.t("siguenos"), d9],
].map(([a, d]) => [Math.max(0, a - 0.07), d]);
function pinta(g, s) { let d = PL[0][1]; for (const [a, f] of PL) if (s >= a) d = f; d(g, s); }

// el segundo del vídeo que se ve: arranca despacio, va a toda velocidad y frena hasta el fotograma 0
const fuente = (t) => T0 * (1 - su(tr(t, T0, TF)));

export function dibuja(g, t) {
  const u = tr(t, T0, TF), s = fuente(t);
  pinta(g, s);
  const al = Math.min(1, u * 8) * (1 - su(tr(u, 0.82, 0.97)));        // el efecto se va antes del último fotograma
  if (al <= 0.003) return;
  // rayas de cinta que bajan, y un velo azulado
  g.save();
  g.fillStyle = `rgba(20,30,60,${0.18 * al})`; g.fillRect(0, 0, 1080, 1920);
  for (let i = 0; i < 4; i++) {
    const y = ((t * 2600 + i * 530) % 2200) - 140, h = 30 + i * 14;
    g.fillStyle = `rgba(255,255,255,${0.16 * al})`; g.fillRect(0, y, 1080, h);
    g.fillStyle = `rgba(0,0,0,${0.22 * al})`; g.fillRect(0, y + h, 1080, h * 0.6);
  }
  // el símbolo de rebobinar
  g.globalAlpha = al; g.fillStyle = "#ffffff"; g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 20;
  const x = 150, y = 600, r = 46;
  for (const dx of [0, r * 1.1]) { g.beginPath(); g.moveTo(x + dx, y - r); g.lineTo(x + dx - r * 1.2, y); g.lineTo(x + dx, y + r); g.closePath(); g.fill(); }
  g.restore();
}
export const momentos = { empieza: T0 };
