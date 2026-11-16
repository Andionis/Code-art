// «Un lunes, con el museo cerrado, un italiano que había trabajado ahí se vistió de obrero y la descolgó de la pared.»
// El Salon cerrado, con luz gris: el cartel «FERMÉ · LUNDI» pasa delante de la cámara; entra el ladrón con la bata
// blanca de los obreros, llega a la Mona Lisa y en «descolgó» la levanta de sus ganchos y la baja hacia él.
import * as k from "#kit";
import { v } from "#voz";
import { dibujaSalon, persona, monaEnMarco, MLX, MLY, MLH, SUELO, veloArriba } from "../mundo.js";

export const desde = (vz) => vz.frase(4).inicio;
const { suave: su, tramo: tr, mez } = k;
const f = v.frase(4);
const T0 = f.inicio, Tlun = f.t("lunes"), Tcer = f.t("cerrado"), Tita = f.t("italiano"), Tobr = f.t("obrero"), Tdes = f.t("descolgo"), Fin = f.fin;
export const llega = Tobr - 0.2, levanta = Tdes, baja = Tdes + 0.3;

function cam(t) {
  const u = su(tr(t, T0, Fin));
  return { cx: MLX - 60 + 160 * u, cy: MLY + 230 - 40 * u, z: mez(0.94, 1.1, u) };
}

export function dibuja(g, t) {
  const c = cam(t);
  // el cuadro: sube de los ganchos y baja hasta sus manos
  const sube = su(tr(t, levanta - 0.05, levanta + 0.25)), bajaU = su(tr(t, baja, baja + 0.7));
  const mona = { dx: 400 * bajaU, dy: -45 * sube + 380 * bajaU, esc: 1 - 0.25 * bajaU, rot: 0.12 * bajaU };
  // el ladrón: camina desde la izquierda y se para delante del cuadro
  const anda = tr(t, Tita - 0.3, llega), ax = mez(MLX - 1000, MLX, su(anda));
  const parado = anda >= 1;
  const brazos = su(tr(t, llega + 0.1, levanta - 0.05)) * (1 - 0.45 * bajaU);
  const delante = false;
  dibujaSalon(g, c.cx, c.cy, c.z, {
    mona: delante ? null : mona,
    encima: (g2) => {
      const bD = delante ? mez(2.75, 1.0, bajaU) : 2.75 * brazos;
      if (t > Tita - 0.3) persona(g2, ax, SUELO + 160, 900, { bata: true, sombrero: "gorra", espalda: true, anda: parado ? 0 : 1, paso: (t - Tita) * 7, brazoI: 2.75 * brazos * (1 - bajaU) + 0.06, brazoD: bD + 0.06, luz: 0.25 });
      if (delante) { g2.save(); g2.translate(MLX + mona.dx, MLY + mona.dy); g2.rotate(mona.rot); g2.scale(mona.esc, mona.esc); monaEnMarco(g2, 0, 0, MLH); g2.restore(); }
    },
  });
  // la luz gris de museo cerrado
  g.save(); g.globalCompositeOperation = "multiply"; g.fillStyle = "rgb(150,160,185)"; g.fillRect(0, 0, 1080, 1920); g.restore();
  const vg = g.createRadialGradient(540, 900, 300, 540, 900, 1300); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(5,8,18,0.6)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 1920);
  // el cartel «FERMÉ», colgado de una cadena, pasa delante de la cámara
  const pasa = tr(t, T0 - 0.05, Tcer + 0.9);
  if (pasa < 1) {
    const sx = mez(540, -700, k.sale(tr(pasa, 0.45, 1))), sy = 1080 + Math.sin(t * 3) * 10, esc = mez(1, 1.6, su(pasa)), rot = Math.sin(t * 2.5) * 0.04;
    g.save(); g.translate(sx, sy); g.rotate(rot); g.scale(esc, esc);
    g.strokeStyle = "#8a8a8a"; g.lineWidth = 6;
    g.beginPath(); g.moveTo(-200, -170); g.lineTo(-420, -900); g.moveTo(200, -170); g.lineTo(420, -900); g.stroke();
    g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 40; g.shadowOffsetY = 20;
    const gr = g.createLinearGradient(0, -170, 0, 170); gr.addColorStop(0, "#7a4a22"); gr.addColorStop(1, "#4a2a10");
    k.redondo(g, -330, -170, 660, 340, 26); g.fillStyle = gr; g.fill(); g.shadowColor = "rgba(0,0,0,0)";
    k.redondo(g, -300, -140, 600, 280, 18); g.fillStyle = "#f2ead6"; g.fill();
    g.fillStyle = "#b3201c"; g.font = "800 140px Figtree"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("FERMÉ", 0, -35);
    g.fillStyle = "#222"; g.font = "700 64px Figtree"; g.fillText("LUNDI", 0, 85);
    g.restore();
  }
  veloArriba(g, 0.35);
}
