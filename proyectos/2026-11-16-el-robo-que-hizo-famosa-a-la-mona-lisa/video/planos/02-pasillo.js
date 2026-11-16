// «Y el ladrón salió del museo con ella escondida debajo de la ropa.»
// Un pasillo de servicio a oscuras; el ladrón, con la bata blanca de los obreros, camina hacia la cámara con la puerta
// encendida detrás. «escondida»: el cuadro se transparenta bajo la bata.
import * as k from "#kit";
import { v } from "#voz";
import { persona, mona, ML_W, ML_H, veloArriba } from "../mundo.js";

export const desde = (vz) => vz.frase(2).inicio;
const { suave: su, tramo: tr, mez } = k;
const f2 = v.frase(2);
const T0 = f2.inicio, Tesc = f2.t("escondida"), Fin = f2.fin;
export const pasos = [];
for (let i = 0; i < 12; i++) { const tt = T0 + 0.12 + i * 0.36; if (tt < Fin + 0.3) pasos.push(tt); }

export function dibuja(g, t) {
  // el pasillo en perspectiva: la puerta encendida al fondo
  const VX = 540, VY = 900;
  g.fillStyle = "#07060a"; g.fillRect(0, 0, 1080, 1920);
  const pared = (lado) => {
    const gr = g.createLinearGradient(lado < 0 ? 0 : 1080, 0, VX, 0);
    gr.addColorStop(0, "#2a2020"); gr.addColorStop(1, "#0d0b0c");
    g.fillStyle = gr; g.beginPath();
    g.moveTo(lado < 0 ? 0 : 1080, -200); g.lineTo(VX + lado * 150, VY - 260); g.lineTo(VX + lado * 150, VY + 260); g.lineTo(lado < 0 ? 0 : 1080, 2200); g.closePath(); g.fill();
  };
  pared(-1); pared(1);
  // el suelo de baldosas que corren hacia la cámara
  const gr = g.createLinearGradient(0, VY + 260, 0, 1920); gr.addColorStop(0, "#1a1410"); gr.addColorStop(1, "#3a2a1e");
  g.fillStyle = gr; g.beginPath(); g.moveTo(VX - 150, VY + 260); g.lineTo(VX + 150, VY + 260); g.lineTo(1500, 2200); g.lineTo(-420, 2200); g.closePath(); g.fill();
  const para = tr(t, Fin - 0.35, Fin - 0.05), anda = 1 - su(para);
  const avance = (Math.min(t, Fin - 0.2) - T0) * 0.9 - 0.15 * su(para);
  g.strokeStyle = "rgba(0,0,0,0.5)"; g.lineWidth = 3;
  for (let i = 0; i < 14; i++) {
    const p = ((i / 14 + avance) % 1), s = Math.pow(p, 2.2), y = VY + 260 + s * 1500;
    g.beginPath(); g.moveTo(VX - 150 - s * 1100, y); g.lineTo(VX + 150 + s * 1100, y); g.stroke();
  }
  // la puerta al fondo, llena de luz
  g.save(); g.globalCompositeOperation = "lighter";
  k.brillo(g, VX, VY, 1300, "255,215,150", 0.55);
  g.restore();
  g.fillStyle = "#fff4dc"; g.fillRect(VX - 150, VY - 260, 300, 520);
  k.brillo(g, VX, VY, 700, "255,230,180", 0.7);
  // las lámparas apagadas de las paredes pasan
  for (let i = 0; i < 4; i++) {
    const p = ((i / 4 + avance * 0.5) % 1), s = Math.pow(p, 2);
    for (const lado of [-1, 1]) { const x = VX + lado * (150 + s * 1300), y = VY - 120 - s * 800; g.fillStyle = "rgba(160,120,60,0.35)"; g.fillRect(x - 6 - s * 20, y, 12 + s * 40, 30 + s * 90); }
  }
  // el ladrón: viene hacia la cámara, a contraluz
  const h = mez(1050, 1250, su(tr(t, T0, Fin - 0.1)));
  const x = 540, y = 960 + h * 0.62;
  const ver = su(tr(t, Tesc - 0.1, Tesc + 0.35));
  persona(g, x, y, h, { bata: true, sombrero: "gorra", anda, paso: (Math.min(t, Fin - 0.2) - T0) * Math.PI / 0.36, bulto: 0.4 + 0.6 * ver, luz: 0.7, piel: "#3a2a22" });
  // el cuadro, que se transparenta bajo la bata
  if (ver > 0) {
    const s = h / 1000, rebote = -Math.abs(Math.cos((Math.min(t, Fin - 0.2) - T0) * Math.PI / 0.36)) * 12 * s * anda;
    const bx = x - 100 * s, by = y - 760 * s + rebote, bw = 200 * s, bh = 300 * s;
    g.save(); g.globalAlpha = 0.6 * ver;
    g.drawImage(mona(), 0, 0, ML_W, ML_H, bx + 4, by + 4, bw - 8, bh - 8);
    g.restore();
    k.brillo(g, x, by + bh / 2, 520, "255,220,150", 0.35 * ver * (1 - 0.5 * tr(t, Tesc + 0.4, Fin)));
  }
  // viñeta
  const vg = g.createRadialGradient(540, 1000, 400, 540, 1000, 1300); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,0.75)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 1920);
  veloArriba(g, 0.3);
}
