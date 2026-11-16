// «Cerraron el museo y el robo salió en los periódicos de todo el mundo, y su cara con él.»
// Las puertas del Louvre se cierran de golpe delante de la cámara. Luego los periódicos, en varios idiomas, vuelan
// hacia la cámara girando y se apilan. «cara»: la cámara entra en la foto de la portada hasta que su cara la llena.
import * as k from "#kit";
import { v } from "#voz";
import { dibujaSalon, periodico, PW, PH, MLX, MLY, veloArriba } from "../mundo.js";

export const desde = (vz) => vz.frase(7).inicio;
const { suave: su, tramo: tr, mez } = k;
const f = v.frase(7);
const T0 = f.inicio, Trob = f.t("robo"), Tper = f.t("periodicos"), Tmun = f.t("mundo"), Tcar = f.t("cara"), Fin = f.fin;
export const cierran = T0 + 0.55;
const N = 5;
export const llegan = Array.from({ length: N }, (_, i) => Trob + 0.25 + i * ((Tmun + 0.35 - Trob - 0.25) / (N - 1)));
const POS = [[-170, -60, -0.18], [190, 40, 0.14], [-120, 120, 0.08], [150, -120, -0.1], [0, 20, -0.03]];

function puerta(g, lado, cierre) {
  // una hoja de la puerta: madera oscura con paneles y su tirador de bronce
  const w = 560, x = lado < 0 ? mez(-w, 0, cierre) : mez(1080, 540, cierre);
  g.save(); g.translate(x, 0);
  const gr = g.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, "#3a200e"); gr.addColorStop(0.5, "#5a3418"); gr.addColorStop(1, "#2a160a");
  g.fillStyle = gr; g.fillRect(0, 0, w, 1920);
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.4; g.drawImage(k.red, 0, 0, w, 1920); g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
  for (const [py, ph] of [[220, 520], [820, 520], [1420, 420]]) {
    g.strokeStyle = "rgba(0,0,0,0.5)"; g.lineWidth = 14; g.strokeRect(70, py, w - 140, ph);
    g.strokeStyle = "rgba(255,200,140,0.18)"; g.lineWidth = 4; g.strokeRect(84, py + 14, w - 168, ph - 28);
  }
  const hx = lado < 0 ? w - 70 : 70;
  g.fillStyle = "#c89a40"; g.beginPath(); g.arc(hx, 1050, 30, 0, Math.PI * 2); g.fill();
  g.fillStyle = "#f2d38a"; g.beginPath(); g.arc(hx - 8, 1042, 10, 0, Math.PI * 2); g.fill();
  g.restore();
}

export function dibuja(g, t) {
  const cierre = k.sale(tr(t, T0 - 0.05, cierran));
  const zoomCara = su(tr(t, Tcar - 0.15, Fin - 0.05));
  // la cámara: sobre el último periódico, entra en la foto en «cara»
  g.save();
  const ultimo = POS[N - 1];
  const fx = 540 + ultimo[0] - 156, fy = 960 + ultimo[1] + 92;   // el centro de la cara en la portada
  const Z = mez(1, 3.3, zoomCara);
  g.translate(540, 960); g.scale(Z, Z); g.translate(-mez(540, fx, zoomCara), -mez(960, fy, zoomCara));
  // detrás: el Salon que se queda a oscuras al cerrar
  if (cierre < 1) dibujaSalon(g, MLX, MLY + 100, 0.85, { mona: null });
  puerta(g, -1, cierre); puerta(g, 1, cierre);
  // el golpe de la puerta: un poco de polvo de luz
  k.brillo(g, 540, 960, 900, "255,220,170", 0.4 * k.pulso(t, cierran + 0.03, 0.1));
  // los periódicos: vienen de lejos girando y caen en su sitio
  for (let i = 0; i < N; i++) {
    const u = tr(t, llegan[i] - 0.45, llegan[i]);
    if (u <= 0) continue;
    const e = k.entra(u), [dx, dy, r] = POS[i];
    const esc = mez(0.12, 0.92, e), rot = r + (1 - e) * (i % 2 ? 6 : -6), x = 540 + dx * e, y = 960 + dy * e - (1 - e) * 300;
    g.save(); g.translate(x, y); g.rotate(rot); g.scale(esc, esc);
    g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 40; g.shadowOffsetY = 18;
    g.drawImage(periodico(i), -PW / 2, -PH / 2);
    g.restore();
  }
  g.restore();
  veloArriba(g, 0.4 * (1 - zoomCara * 0.3));
}
