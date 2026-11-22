// «Los ríos se llevan esa sal hasta el mar, pero tan poquita que ni la notas al probarlos. Y en el mar, el sol calienta
// el agua y la evapora, pero la sal no se va con ella: se queda. Ese vapor forma nubes, las nubes vuelven a ser
// lluvia, y la lluvia trae más sal.»
// Corte en «Los», de vuelta al paisaje del principio. Una sola cámara para el viaje de la sal y del agua.
// - «Los ríos»: a ras del río, junto a la montaña; los granitos de sal bajan con la corriente hacia la cámara, que
//   retrocede con ellos hacia el mar.
// - «poquita»: la cámara baja hasta casi tocar el agua: son poquísimos granitos, separados, en mucha agua clara.
// - «Y en el mar»: la cámara sale sobre el mar y se ve el sol. «calienta»: el sol brilla fuerte; «evapora»: del agua
//   suben nubecillas de vapor. «la sal no se va»: los granos se quedan en el agua y en «queda» brillan todos.
// - «Ese vapor»: la cámara mira arriba con el vapor; en «nubes» se juntan y crecen nubes; en «nubes vuelven a ser
//   lluvia» se oscurecen y llueve sobre las montañas; en «más» el río baja cargado de más granos.
import * as k from "#kit";
import { v } from "#voz";
import { camPaisaje, paisaje, lluvia, velo, pp, rioX } from "../mundo.js";

export const desde = () => v.frase(6).inicio;

const { suave: su, tramo: tr, mez, claves, azar } = k;
const f6 = v.frase(6), f7 = v.frase(7), f8 = v.frase(8);
const T0 = f6.inicio, Tmar6 = f6.t("mar"), Tpoq = f6.t("poquita"), Tprob = f6.t("probarlos");
const T7 = f7.inicio, Tsol = f7.t("sol"), Tcal = f7.t("calienta"), Tevap = f7.t("evapora"), Tsal7 = f7.t("sal"), Tqueda = f7.t("queda");
const T8 = f8.inicio, Tnub = f8.t("nubes"), Tnub2 = f8.t("nubes", 2), Tllu = f8.t("lluvia"), Tmas = f8.t("mas"), Tfin = f8.fin;
export const momentos = { poquita: Tpoq, sol: Tsol, evapora: Tevap, queda: Tqueda, nubes: Tnub, lluvia: Tllu, mas: Tmas };

// la cámara
const camZ = claves([[T0, 75], [Tmar6, 30], [Tpoq, 12], [Tprob, 10], [T7 + 0.1, 4], [Tsol, -62], [Tqueda, -68], [Tfin, -70]]);
const camH = claves([[T0, 5], [Tmar6, 6], [Tpoq, 2.2], [Tprob, 2.1], [T7 + 0.1, 4], [Tsol, 14], [Tqueda, 15], [Tfin, 16]]);
const camHy = claves([[T0, 640], [Tmar6, 640], [Tpoq, 600], [T7 + 0.1, 640], [Tsol, 1000], [Tqueda, 1000], [T8 + 0.1, 1010], [Tnub2, 1480], [Tfin, 1500]]);
const camX = (t) => { const u = su(tr(t, Tprob, Tsol)); return mez(rioX(camZ(t) + 10), 0, u); };
export const camara = (t) => camPaisaje(camX(t), camH(t), camZ(t), camHy(t));

// el vapor: nubecillas que nacen en el agua y suben
const az = azar(5151);
const VAPOR = Array.from({ length: 70 }, () => ({ X: (az() - 0.5) * 50, Z: -6 - az() * 50, nace: mez(Tevap - 0.5, Tmas, az()), dur: 2.2 + az() * 1.2, sem: az() * 6 }));
// las nubes que se forman: [X, Y, Z, ancho]
const NUBES = [[-150, 125, 430, 240], [20, 140, 470, 290], [140, 115, 380, 220], [-60, 100, 330, 200], [90, 90, 290, 170], [-20, 85, 260, 140]];

export function dibuja(g, t, c = camara(t)) {
  const forma = su(tr(t, Tnub - 0.5, Tnub + 0.8)), oscuro = 0.65 * su(tr(t, Tnub2 - 0.2, Tllu + 0.2));
  const calor = su(tr(t, Tsol - 0.2, Tcal + 0.4)) * (1 - su(tr(t, Tnub2 - 0.3, Tllu)));
  paisaje(g, c, t, {
    sal: 1, nSal: mez(0.35, 1, su(tr(t, Tmas - 0.6, Tmas + 0.3))), velSal: 1.4,
    salMar: su(tr(t, T7, Tsal7)) * mez(0.5, 1, su(tr(t, Tmas - 0.3, Tmas + 0.4))), salMarAl: 1,
    oscuro, sol: [250, 660], solAl: 1,
    nubes: NUBES.map((n, i) => [n[0], n[1], n[2], n[3] * mez(0.3, 1, forma), oscuro, Math.min(1, forma * 1.5 - i * 0.07), 40 + i]),
  });
  // el sol que calienta: más brillo y un velo cálido sobre todo
  if (calor > 0.01) {
    k.brillo(g, 250, 660, 900, "255,220,150", 0.15 * calor);
    g.fillStyle = `rgba(255,170,80,${0.08 * calor})`; g.fillRect(0, 0, 1080, 1920);
  }
  // «queda»: los granos del mar brillan (un destello suave por encima del agua)
  const brilla = k.pulso(t, Tqueda + 0.12, 0.45);
  if (brilla > 0.02) {
    const C = pp(c, 0, 0, 0);
    if (C) k.brillo(g, 540, (C.y + 1920) / 2, 1100, "220,245,255", 0.35 * brilla);
  }
  // el vapor que sube: velos blancos que se enroscan hacia arriba
  for (const q of VAPOR) {
    const u = (t - q.nace) / q.dur;
    if (u < 0 || u > 1) continue;
    const P = pp(c, q.X + c.x, 0, q.Z);
    if (!P) continue;
    const esc = Math.min(1.6, Math.max(0.6, P.s / 30));
    const al = 0.5 * Math.sin(Math.PI * Math.min(1, u * 1.2)) * (1 - 0.5 * oscuro);
    for (let j = 0; j < 4; j++) {
      const uu = Math.max(0, u - j * 0.06);
      const y = P.y - uu * 1300 - 20, x = P.x + 60 * esc * Math.sin(uu * 6 + q.sem + j * 0.5);
      const r = mez(25, 120, uu) * esc;
      const gg = g.createRadialGradient(x, y, 0, x, y, r);
      gg.addColorStop(0, `rgba(250,252,255,${al * (1 - j * 0.2)})`); gg.addColorStop(1, "rgba(250,252,255,0)");
      g.fillStyle = gg; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
    }
  }
  // la lluvia, bajo las nubes, sobre las montañas
  const llueve = su(tr(t, Tllu - 0.2, Tllu + 0.4));
  if (llueve > 0) {
    const nb = pp(c, 0, 90, 340), ms = pp(c, 0, 0, 230);
    if (nb && ms) { g.save(); g.beginPath(); g.rect(0, nb.y, 1080, ms.y - nb.y + 60); g.clip(); lluvia(g, t, 0.8 * llueve, Tllu); g.restore(); }
  }
  velo(g, 0.4);
}
