// «Y la mayor parte del dinero nunca apareció. Envíaselo a un amigo que le pueda interesar.»
// El corte del suelo, entero: de la casa al banco, con el túnel iluminado y la bóveda vacía.
// - «Y la mayor parte del dinero»: puntos dorados (los fajos) corren por el túnel de la bóveda a la casa y salen por
//   arriba como una nube de billetes que se reparte por el cielo.
// - «nunca apareció»: los billetes se van apagando hasta no quedar ninguno.
// - «Envíaselo»: la cámara se lanza a la boca del túnel, en la casa (enlaza con el primer fotograma).
import * as k from "#kit";
import { v } from "#voz";
import { CASA, SX, SY, T, seccion } from "../corte.js";
import { velo } from "../mundo.js";

export const desde = (v) => v.frase(11).t("y");
export const entrada = "corte";

const { suave: su, tramo: tr, mez, azar } = k;
const f11 = v.frase(11), f12 = v.frase(12);
const Ty = f11.t("y"), Tdin = f11.t("dinero"), Tnun = f11.t("nunca"), Tapa = f11.t("aparecio"), Tenv = f12.inicio;
export const momentos = { corren: Ty + 0.1, salen: Tdin, apagan: Tnun, lanza: Tenv };

const LEJOS = { cx: 44.5, cy: 7, s: 12 }, BOCA = { cx: T.x0 + 1.6, cy: (T.y0 + T.y1) / 2, s: 900 };
function camara(t) {
  const u = su(tr(t, Tenv - 0.1, Tenv + 1.35));
  const s = Math.exp(mez(Math.log(LEJOS.s), Math.log(BOCA.s), Math.pow(u, 1.6)));
  const w = Math.min(1, u * 1.6);
  return { cx: mez(LEJOS.cx, BOCA.cx, su(w)), cy: mez(LEJOS.cy, BOCA.cy, su(w)), s: s * (1 + 0.04 * tr(t, Ty, Tenv)) };
}

const az = azar(606);
const N = 120;
const BILL = Array.from({ length: N }, (_, i) => ({ t0: mez(Ty - 0.05, Tdin - 0.2, i / N), v: 62 + az() * 18, sale: az(), ang: mez(-2.5, -0.6, az()), vel: 10 + az() * 22, gira: (az() - 0.5) * 9, apaga: mez(Tnun + 0.1, Tapa + 0.75, az()) }));
function dinero(g, c, t) {
  for (const b of BILL) {
    const dt = t - b.t0; if (dt <= 0) continue;
    // por el túnel, de la bóveda a la casa
    const L = T.x1 - (T.x0 + 0.45), recorre = dt * b.v;
    let x, y, rot = 0, sz = 1.1;
    if (recorre < L) { x = T.x1 - recorre; y = (T.y0 + T.y1) / 2 - 0.1; }
    else {
      const d2 = recorre - L, sube = Math.min(d2, 4.5);
      if (d2 <= 4.5) { x = T.x0 + 0.45; y = (T.y0 + T.y1) / 2 + sube; }
      else {
        const t3 = (d2 - 4.5) / b.v * 1.6;
        x = T.x0 + 0.45 + Math.cos(b.ang + 1.2) * b.vel * t3 * 1.6 + 14 * t3; y = 2 + Math.abs(Math.sin(b.ang)) * b.vel * t3 * 1.2 + 6 * t3; rot = b.gira * t3; sz = 1.1 + 2.2 * Math.min(1, t3 * 1.5);
      }
    }
    const al = 1 - su(tr(t, b.apaga, b.apaga + 0.45));
    if (al <= 0) continue;
    const X = SX(c, x), Y = SY(c, y), w = sz * c.s * 1.6, h = w * 0.47;
    g.save(); g.globalAlpha *= al; g.translate(X, Y); g.rotate(rot);
    g.fillStyle = "#f2b45e"; g.fillRect(-w / 2, -h / 2, w, h);
    g.strokeStyle = "#8a5220"; g.lineWidth = Math.max(1, w * 0.06); g.strokeRect(-w / 2, -h / 2, w, h);
    g.restore();
    k.brillo(g, X, Y, w * 3, "255,200,110", 0.25 * al);
  }
}

export function dibuja(g, t) {
  const c = camara(t);
  seccion(g, c, { pozo: 1, punta: T.x1, focos: () => 1, dinero: 0, hoyo: 1, grietas: 1 }, t);
  dinero(g, c, t);
  // al lanzarse a la boca del túnel, la luz cálida lo llena todo
  const fin = su(tr(t, Tenv + 0.7, Tenv + 1.15));
  if (fin > 0) { g.fillStyle = `rgba(60,30,14,${fin})`; g.fillRect(0, 0, 1080, 1920); }
  velo(g, 0.45);
}
