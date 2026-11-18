// Plano entero: el final rebobina. Cuando la voz termina el cierre, el vídeo entero pasa hacia atrás a toda velocidad,
// con rayas de cinta y el símbolo ◀◀, y frena justo en el primer fotograma (el reel se ve en bucle sin notarlo).
// Cópialo a video/planos/ como el último plano y pon en PLANOS los dibuja de tus planos con su palabra de inicio.
// Sonido: un «empujon» al revés (reves: true, vel 1.4) en momentos.empieza + 0.12 y dos «tic» rápidos.
import * as k from "#kit";
import { v } from "#voz";
import { dibuja as d1 } from "./01-hook.js";
import { dibuja as d2 } from "./02-xxx.js";

// [palabra en que empieza el plano (o 0), su dibuja]
const PLANOS = [[0, d1], ["palabra", d2]];

const { suave: su, tramo: tr } = k;
export const T0 = v.frase(v.frases.length).fin + 0.02;
export const desde = T0;
export const entrada = "corte";
const TF = v.duracion - 1 / 60;

const PL = PLANOS.map(([a, d]) => [Math.max(0, (typeof a === "number" ? a : v.t(a)) - 0.07), d]);
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
