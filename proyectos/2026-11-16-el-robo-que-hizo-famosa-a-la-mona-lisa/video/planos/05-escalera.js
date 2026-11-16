// «Dejó el marco y el vidrio en una escalera, se la metió debajo de la bata y salió caminando.»
// La escalera de servicio: el marco de oro cae en un escalón, el vidrio se apoya al lado; el ladrón mete el cuadro bajo
// la bata y se va caminando hacia la luz de la puerta.
import * as k from "#kit";
import { v } from "#voz";
import { persona, marcoOro, mona, ML_W, ML_H, veloArriba } from "../mundo.js";

export const desde = (vz) => vz.frase(5).inicio;
const { suave: su, tramo: tr, mez } = k;
const f = v.frase(5);
const T0 = f.inicio, Tmar = f.t("marco"), Tvid = f.t("vidrio"), Tmet = f.t("metio"), Tcam = f.t("caminando"), Fin = f.fin;
export const caeMarco = Tmar + 0.05, poneVidrio = Tvid + 0.1, mete = Tmet, sale = Tcam - 0.3;

const _esc = k.lienzo(1080, 1920);
let hecha = false;
function escalera() {
  if (hecha) return _esc; hecha = true;
  const g = _esc.getContext("2d");
  let gr = g.createLinearGradient(0, 0, 1080, 1920); gr.addColorStop(0, "#3a3e48"); gr.addColorStop(1, "#14161c");
  g.fillStyle = gr; g.fillRect(0, 0, 1080, 1920);
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.5; g.drawImage(k.red, 0, 0, 1080, 1080); g.drawImage(k.red, 0, 1080, 1080, 1080); g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
  // los escalones de piedra, que suben hacia la derecha
  for (let i = 0; i < 16; i++) {
    const y = 1920 - i * 95, x0 = -200 + i * 40;
    gr = g.createLinearGradient(0, y - 95, 0, y); gr.addColorStop(0, "#6c6a66"); gr.addColorStop(0.18, "#8c8a84"); gr.addColorStop(0.2, "#4a4844"); gr.addColorStop(1, "#2e2c2a");
    g.fillStyle = gr; g.fillRect(x0, y - 95, 1400, 95);
  }
  // la barandilla de hierro
  g.strokeStyle = "#141414"; g.lineWidth = 14; g.beginPath(); g.moveTo(-50, 1250); g.lineTo(1150, 300); g.stroke();
  g.lineWidth = 6; for (let i = 0; i < 14; i++) { const x = -50 + i * 90, y = 1250 - i * 71; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 330); g.stroke(); }
  // la puerta de la calle, arriba a la derecha, llena de luz
  g.fillStyle = "#fff3d6"; g.fillRect(770, 360, 260, 520);
  return k.fijar(_esc);
}

export function dibuja(g, t) {
  g.drawImage(escalera(), 0, 0);
  k.brillo(g, 900, 620, 1200, "255,220,160", 0.55);
  // el ladrón: de frente con el cuadro en las manos; lo mete bajo la bata y se va hacia la puerta
  const se = tr(t, sale, Fin + 0.6), sx = mez(560, 880, su(se)), sy = mez(1420, 900, su(se)), sh = mez(950, 520, su(se));
  const metU = su(tr(t, mete - 0.1, mete + 0.45));
  persona(g, sx, sy, sh, { bata: true, sombrero: "gorra", anda: se > 0 ? 1 : 0, paso: (t - sale) * 7, bulto: metU, luz: 0.5, piel: "#3a2a22", espalda: se > 0.05, brazoI: 0.5 * (1 - metU) + 0.06, brazoD: 0.5 * (1 - metU) + 0.06 });
  if (metU < 1) {
    const s = sh / 1000, w = 190 * s, h = w * ML_H / ML_W;
    g.save(); g.globalAlpha = 1 - metU;
    const py = sy - 640 * s - metU * 80 * s;
    g.drawImage(mona(), sx - w / 2, py - h / 2, w, h * (1 - 0.5 * metU));
    g.restore();
  }
  // el marco cae y rebota en un escalón; el vidrio se apoya a su lado
  const cae = tr(t, caeMarco - 0.4, caeMarco), rb = Math.max(0, Math.sin(tr(t, caeMarco, caeMarco + 0.3) * Math.PI)) * 30 * (t > caeMarco ? 1 : 0);
  if (t > T0 - 0.1) {
    const my = mez(-400, 1560, k.sale(cae)) - rb, rot = mez(-0.6, -0.12, su(cae));
    g.save(); g.translate(250, my); g.rotate(rot);
    g.fillStyle = "rgba(10,10,12,0.7)"; g.fillRect(-120, -175, 240, 350);
    marcoOro(g, -120, -175, 240, 350, 34, 0.9);
    g.fillStyle = "#2a2622"; g.fillRect(-120, -175, 240, 350);
    g.restore();
    if (t > caeMarco) k.brillo(g, 250, 1700, 500, "255,220,150", 0.5 * k.pulso(t, caeMarco + 0.03, 0.12));
  }
  const vi = su(tr(t, poneVidrio - 0.35, poneVidrio));
  if (vi > 0) {
    const vx = mez(-300, 470, vi), vy = 1560, rot = mez(0.5, 0.18, vi);
    g.save(); g.translate(vx, vy); g.rotate(rot);
    g.fillStyle = "rgba(190,220,235,0.22)"; g.fillRect(-115, -170, 230, 340);
    g.strokeStyle = "rgba(230,245,255,0.75)"; g.lineWidth = 5; g.strokeRect(-115, -170, 230, 340);
    const gr = g.createLinearGradient(-115, -170, 115, 170); gr.addColorStop(0.3, "rgba(255,255,255,0)"); gr.addColorStop(0.42, "rgba(255,255,255,0.55)"); gr.addColorStop(0.5, "rgba(255,255,255,0)");
    g.fillStyle = gr; g.fillRect(-115, -170, 230, 340);
    g.restore();
  }
  veloArriba(g, 0.35);
}
