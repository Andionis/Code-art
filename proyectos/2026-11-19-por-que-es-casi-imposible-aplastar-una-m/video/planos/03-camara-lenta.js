// «Es como si viera tu manotazo en una película a cámara lenta.»
// Vuelta a la mesa, más cerca y más baja, dentro del marco de una película (perforaciones a los lados). Corte en «Es».
// - Desde el primer fotograma: la mano baja despacísimo desde arriba, con sus fotogramas fantasma detrás.
// - La mosca, tan tranquila, camina hacia la derecha, se sale del camino de la mano y se para a frotarse las patas.
// - «película»: el marco de la película se ve entero (la cámara se aleja un poco). Antes del corte, todo quieto.
import * as k from "#kit";
import { v } from "#voz";
import { cocina, mosca, mano } from "../mundo.js";

export const desde = (vz) => vz.frase(5).inicio;
export const entrada = "corte";
const { suave: su, tramo: tr, mez } = k;
const f5 = v.frase(5);
const T0 = f5.inicio, Tpel = f5.t("pelicula"), Fin = f5.fin;
export const momentos = { pasos: [T0 + 0.25, Tpel - 0.2] };

const yMano = (t) => mez(-380, 300, su(tr(t, T0 - 0.6, Fin - 0.05)));
export function dibuja(g, t) {
  const z = mez(1.12, 1.0, su(tr(t, Tpel - 0.5, Tpel + 0.5)));
  g.save(); g.translate(540, 1100); g.scale(z, z); g.translate(-540, -1100);
  cocina(g, 1180, 0.9);
  // la mosca camina de la mano hacia la derecha y se para
  const anda = su(tr(t, T0 + 0.1, Tpel + 0.1));
  const camina = tr(t, T0, T0 + 0.25) * (1 - tr(t, Tpel - 0.05, Tpel + 0.2));
  const frota = tr(t, Tpel + 0.25, Tpel + 0.55);
  mosca(g, mez(530, 670, anda), 1390, 720, { t, camina, frota });
  // la mano, en cámara lenta, con sus fotogramas fantasma
  for (const [d, a] of [[0.75, 0.14], [0.5, 0.22], [0.25, 0.32]]) mano(g, 470, yMano(t - d), 660, 0.55, a, Math.PI);
  mano(g, 470, yMano(t), 660, 0.55, 1, Math.PI);
  g.restore();
  // el marco de la película: bandas negras con perforaciones a los lados
  const B = 70;
  g.fillStyle = "#0c0c10"; g.fillRect(0, 0, B, 1920); g.fillRect(1080 - B, 0, B, 1920);
  g.fillStyle = "rgba(235,235,240,0.9)";
  const off = ((t - T0) * 40) % 90;
  for (let y = -90 + off; y < 1920; y += 90) { k.redondo(g, 22, y, 26, 44, 6); g.fill(); k.redondo(g, 1080 - 48, y, 26, 44, 6); g.fill(); }
  // grano de película, suave
  g.save(); g.globalAlpha = 0.07; g.globalCompositeOperation = "overlay"; g.drawImage(k.manchas, 0, 0, 1080, 1920); g.restore();
  const vg = g.createLinearGradient(0, 200, 0, 600); vg.addColorStop(0, "rgba(15,8,4,0.55)"); vg.addColorStop(1, "rgba(15,8,4,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 600);
}
