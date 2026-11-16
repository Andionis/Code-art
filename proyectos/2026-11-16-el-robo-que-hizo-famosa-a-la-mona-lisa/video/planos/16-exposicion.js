// «Antes de volver a París la expusieron en Italia, y la gente se empujaba para verla.»
// Una sala de Italia con banderas: la Mona Lisa en un caballete, con su cordón de terciopelo; la multitud, de
// espaldas, se empuja hacia ella. Flashes de magnesio de los fotógrafos.
import * as k from "#kit";
import { v } from "#voz";
import { monaEnMarco, multitud, fondoCuarto, veloArriba } from "../mundo.js";

export const desde = (vz) => vz.frase(21).inicio;
const { suave: su, tramo: tr, mez } = k;
const f = v.frase(21);
const T0 = f.inicio, Texp = f.t("expusieron"), Tgen = f.t("gente"), Temp = f.t("empujaba"), Fin = f.fin;
export const flashes = [Texp + 0.1, Tgen - 0.1, Temp + 0.05, Temp + 0.45, Fin - 0.2];

export function dibuja(g, t) {
  fondoCuarto(g, "#6a5a4a", "#1a120c", 540, 800);
  // las banderas de Italia colgadas arriba
  for (let i = 0; i < 6; i++) {
    const x = 20 + i * 180, y = 520 + Math.sin(i * 1.3) * 10, ond = Math.sin(t * 2 + i) * 6;
    ["#2a9a4a", "#f4f0e0", "#d8302a"].forEach((c, j) => { g.fillStyle = c; g.beginPath(); g.moveTo(x + j * 50, y); g.lineTo(x + j * 50 + 50, y); g.lineTo(x + j * 50 + 50 + ond, y + 150); g.lineTo(x + j * 50 + ond, y + 150); g.closePath(); g.fill(); });
  }
  // el cuadro en su caballete, con luz
  const z = mez(1, 1.15, su(tr(t, T0, Fin)));
  k.brillo(g, 540, 1000, 1200, "255,230,180", 0.45);
  g.strokeStyle = "#5a3a1a"; g.lineWidth = 22; g.beginPath(); g.moveTo(400, 1600); g.lineTo(540, 700); g.lineTo(680, 1600); g.stroke();
  monaEnMarco(g, 540, 1000, 520 * z);
  // el cordón de terciopelo
  g.strokeStyle = "#8a1a2a"; g.lineWidth = 16; g.beginPath(); g.moveTo(80, 1380); g.quadraticCurveTo(540, 1480, 1000, 1380); g.stroke();
  g.fillStyle = "#c8a040"; g.fillRect(65, 1360, 30, 300); g.fillRect(985, 1360, 30, 300);
  // la multitud que empuja
  const emp = 0.4 + 1.2 * su(tr(t, Tgen - 0.2, Temp + 0.3));
  multitud(g, t, mez(1500, 1330, su(tr(t, T0, Temp))), { empuje: emp, filas: 6, luz: 0.35 });
  // los flashes de magnesio
  for (const fl of flashes) { const p = k.pulso(t, fl, 0.07); if (p > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = `rgba(255,250,235,${0.55 * p})`; g.fillRect(0, 0, 1080, 1920); g.restore(); } }
  veloArriba(g, 0.4);
}
