// «Pero cuando entra un virus, tu nariz se irrita y fabrica mucho más moco del que los pelitos pueden llevar.»
// El túnel de la nariz otra vez. Corte en «Pero».
// - «Pero cuando entra»: la cámara avanza despacio por el túnel; «virus»: un virus enorme llega girando desde el
//   fondo y se pega a la pared.
// - «irrita»: la pared se pone roja e hinchada, con latidos de calor.
// - «fabrica mucho más moco»: de toda la pared salen gotas que crecen y chorrean; en «más», gotas gordas por todas
//   partes que cuelgan y caen. Todo se calma antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { enPared, moco, tunel, velo, virus } from "../mundo.js";

export const desde = (vz) => vz.frase(9).inicio;

const { suave: su, tramo: tr, mez, azar, proyecta, F, claves, entra, pulso } = k;
const f9 = v.frase(9);
const T0 = f9.inicio, Tvir = f9.t("virus"), Tirr = f9.t("irrita"), Tfab = f9.t("fabrica"), Tmas = f9.t("mas"), Tpel = f9.t("pelitos"), Tfin = f9.fin;
export const momentos = { virus: Tvir, pega: Tvir + 0.5, irrita: Tirr, mas: Tmas };

const avance = claves([[T0, 0], [Tfin, 2.2]]);
// el virus: del fondo a la pared de arriba a la derecha
const zzV = claves([[T0, 18], [Tvir + 0.45, 4.6], [Tfin, 4.6 - 2.2]]);
const az = azar(9090);
const GOTAS = Array.from({ length: 110 }, (_, i) => {
  const a = az() * 6.2832;
  return { a, zw: 1.2 + az() * 14, s: 0.08 + az() * 0.14, nace: i < 25 ? -9 : mez(Tfab - 0.2, Tmas + 0.3, az()), sem: i + 300, gorda: i >= 70 };
});

export function dibuja(g, t) {
  const d = avance(t), irrita = su(tr(t, Tirr - 0.1, Tirr + 0.6)), late = 0.06 * irrita * pulso((t - Tirr) % 0.9, 0.2, 0.15);
  const cam = k.mira([0, 0, 0], [0, -0.05, -1]);
  tunel(g, cam, d, { irrita: irrita + late, largo: 24 });
  k.brillo(g, 540, 960, 2400, "255,60,40", 0.18 * irrita);
  const cosas = [];
  for (const q of GOTAS) {
    if (t < q.nace) continue;
    const zz = q.zw - d;
    if (zz < 0.4 || zz > 14) continue;
    const P = proyecta(cam, enPared(d, q.a, zz, 0.04, irrita));
    if (!P) continue;
    const crece = q.nace < 0 ? 1 : entra(tr(t, q.nace, q.nace + 0.6));
    const gord = q.gorda ? 1 + 0.9 * su(tr(t, Tmas - 0.2, Tmas + 0.5)) : 1 + 0.3 * irrita;
    const r = (F * q.s * crece * gord) / P.z, arriba = Math.sin(q.a) > -0.2;
    const al = Math.min(1, (14 - zz) / 4) * Math.min(1, (zz - 0.4) / 0.4);
    cosas.push({ z: P.z, dibuja: () => moco(g, P.x, P.y + (arriba ? r * 0.3 * (gord - 1) : 0), r, t, q.sem, { tono: 0.25 + 0.4 * irrita, estira: arriba ? 0.4 + 0.9 * (gord - 1) : 0.1, al }) });
  }
  // el virus
  {
    const zz = zzV(t), pega = su(tr(t, Tvir + 0.2, Tvir + 0.5));
    const W = enPared(d, -0.25, zz, mez(0.6, 0.38, pega));
    const P = proyecta(cam, [mez(0, W[0], pega), mez(0, W[1], pega), -zz]);
    if (P) {
      const r = (F * 0.45) / P.z, aplasta = pulso(t, Tvir + 0.5, 0.08);
      cosas.push({ z: P.z - 0.01, dibuja: () => { g.save(); g.translate(P.x, P.y); g.scale(1 + 0.15 * aplasta, 1 - 0.15 * aplasta); virus(g, 0, 0, r, t * 4 * (1 - pega) + 1); g.restore(); k.brillo(g, P.x, P.y, r * 5, "200,120,255", 0.4); } });
    }
  }
  k.deLejosACerca(cosas);
  velo(g, 0.6);
}
