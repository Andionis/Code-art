// «¿Sabías que la Mona Lisa no era famosa hasta que alguien se la robó?»
// El Salon Carré de noche: la cámara corre entre marcos de oro y la linterna se clava en la Mona Lisa, enorme.
// «alguien»: la sombra del ladrón cruza la luz. «robó»: la arrancan de la pared; quedan los cuatro ganchos.
import * as k from "#kit";
import { v } from "#voz";
import { dibujaSalon, oscuridad, MLX, MLY, MLH, GANCHOS, gancho, veloArriba } from "../mundo.js";

export const desde = 0;
const { suave: su, tramo: tr, mez } = k;
const f1 = v.frase(1);
const Talg = f1.t("alguien"), Trob = f1.t("robo");
export const arranca = Trob - 0.05;

function cam(t) {
  const u = k.entra(tr(t, 0, 1.5));
  const w = su(tr(t, 1.5, arranca));
  return { cx: mez(MLX + 60, MLX, u), cy: mez(MLY - 150, MLY + 40, u) - 30 * w, z: mez(4.2, 1.55, u) + 0.22 * w };
}

export function dibuja(g, t) {
  const c = cam(t);
  // la Mona Lisa: tiembla un instante y sale disparada hacia la izquierda y hacia la cámara
  const tira = k.sale(tr(t, arranca, arranca + 0.42));
  const tiembla = tr(t, arranca - 0.25, arranca) * (1 - tr(t, arranca, arranca + 0.05));
  const mona = tira >= 1 ? null : {
    dx: -tira * 1400 + Math.sin(t * 90) * 6 * tiembla, dy: -tira * 160 - 12 * tr(t, arranca - 0.2, arranca),
    rot: -tira * 0.5, esc: 1 + tira * 1.6,
  };
  dibujaSalon(g, c.cx, c.cy, c.z, { mona });
  // la linterna: barre la pared y se clava en ella
  const w2s = (x, y) => ({ x: 540 + (x - c.cx) * c.z, y: 960 + (y - c.cy) * c.z });
  const lu = su(tr(t, 0, 1.4));
  const lx = MLX + Math.sin(t * 1.7) * 18, ly = mez(MLY - 150, MLY - 20, lu);
  const L = w2s(lx, ly);
  // la sombra del ladrón cruza la luz en «alguien»
  const cruza = tr(t, Talg - 0.25, Trob + 0.1);
  const luces = [{ x: L.x, y: L.y, r: 700, al: 1 }];
  oscuridad(g, luces, 0.88);
  if (cruza > 0 && cruza < 1) {
    const sx = mez(1500, -400, k.suave(cruza));
    g.save(); g.globalAlpha = 0.75 * Math.sin(cruza * Math.PI);
    const gr = g.createRadialGradient(sx, 1100, 50, sx, 1100, 650); gr.addColorStop(0, "rgba(0,0,0,0.95)"); gr.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = gr; g.beginPath(); g.ellipse(sx, 1100, 330, 900, 0.1, 0, Math.PI * 2); g.fill();
    g.restore();
  }
  // los ganchos brillan cuando ya no hay cuadro
  const vacio = tr(t, arranca + 0.25, arranca + 0.6);
  if (vacio > 0) for (const [gx, gy] of GANCHOS) { const p = w2s(gx, gy); k.brillo(g, p.x, p.y, 160, "255,225,170", 0.55 * vacio * (0.8 + 0.2 * Math.sin(t * 5 + gx))); }
  veloArriba(g, 0.35);
}
