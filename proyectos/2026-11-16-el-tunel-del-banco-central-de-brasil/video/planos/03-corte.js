// «Durante tres meses cavaron, a cuatro metros bajo la calle, un túnel de casi ochenta metros: casi lo largo de una
//  cancha de fútbol. Era tan angosto que se pasaba a gatas, pero tenía luz eléctrica y hasta aire acondicionado.»
// El corte del suelo (../corte.js), con una sola cámara.
// - «Durante»: de cerca, la casa en corte; el pozo baja desde su piso, echando tierra.
// - «cuatro metros»: la cota «4 m», de la calle al túnel.
// - «túnel»: el túnel avanza hacia la derecha; la cámara lo sigue y se aleja hasta verlo entero, de la casa al banco.
// - «ochenta metros»: la cota «80 m». «cancha»: una cancha de fútbol se tiende bajo el túnel, del mismo largo y un poco más.
// - «angosto»: la cámara entra al túnel; una persona a gatas, con su casco y su linterna.
// - «luz eléctrica»: los focos se encienden uno tras otro. «aire acondicionado»: la manguera sopla aire frío azul.
import * as k from "#kit";
import { v } from "#voz";
import { SX, SY, T, cota, polvo, seccion } from "../corte.js";
import { velo } from "../mundo.js";

export const desde = "durante";
export const entrada = "corte";

const { suave: su, tramo: tr, mez } = k;
const f5 = v.frase(5), f6 = v.frase(6);
const Tdur = f5.inicio, Tcua = f5.t("cuatro"), Ttun = f5.t("tunel"), Toch = f5.t("ochenta"), Tmet = f5.t("metros", 2), Tcan = f5.t("cancha");
const Tang = f6.t("angosto"), Tgat = f6.t("gatas"), Tluz = f6.t("luz"), Tair = f6.t("aire");
export const momentos = { pozo: [Tdur + 0.15, Tcua - 0.3], tunel: [Ttun - 1.1, Tmet], cota4: Tcua, cota80: Tmet, cancha: Tcan, luz: Tluz, aire: Tair };

const P0 = Tdur + 0.1, P1 = Tcua - 0.2;            // el pozo baja
const A0 = Ttun - 1.2, A1 = Tmet;                  // el túnel avanza
const punta = (t) => mez(T.x0 + 0.9, T.x1, Math.pow(su(tr(t, A0, A1)), 1.15));

const gx = (t) => mez(34.6, 36.4, tr(t, Tang - 0.8, f6.fin + 0.4));
function camara(t) {
  const cerca = { cx: 6.4, cy: -1.9, s: 135 }, lejos = { cx: 52, cy: -6.5, s: 10 }, dentro = { cx: 34.3, cy: T.y0 + 0.5, s: 420 };
  const z = su(tr(t, A0 + 0.3, A1 + 0.1));
  let s = Math.exp(mez(Math.log(cerca.s), Math.log(lejos.s), z));
  let cx = mez(Math.max(cerca.cx, punta(t) - 2.6 / Math.max(0.3, s / 135)), lejos.cx, Math.pow(z, 2.2)), cy = mez(cerca.cy, lejos.cy, z);
  // se acerca un poco mientras baja el pozo
  s *= 1 - 0.06 * su(tr(t, Tdur, A0));
  const d = su(tr(t, Tang - 0.55, Tang + 0.75));
  s = Math.exp(mez(Math.log(s), Math.log(dentro.s), d));
  cx = mez(cx, gx(t) - 0.35, Math.pow(d, 0.6)); cy = mez(cy, dentro.cy, Math.pow(d, 0.6));
  return { cx, cy, s };
}

// la cancha de fútbol, vista desde arriba, tendida bajo el túnel desde el mismo punto (100 m)
function cancha(g, c, t) {
  const u = k.entra(tr(t, Tcan - 0.2, Tcan + 0.35)), al = u * (1 - su(tr(t, Tang - 0.6, Tang - 0.1)));
  if (al <= 0) return;
  const x0 = SX(c, T.x0), x1 = SX(c, T.x0 + 100), y0 = SY(c, -8.2) + (1 - u) * 500, h = 300;
  g.save(); g.globalAlpha *= al;
  g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 30;
  const gr = g.createLinearGradient(0, y0, 0, y0 + h); gr.addColorStop(0, "#4cc251"); gr.addColorStop(1, "#2f9a3a");
  g.fillStyle = gr; g.fillRect(x0, y0, x1 - x0, h); g.shadowBlur = 0;
  // franjas de césped
  g.fillStyle = "rgba(255,255,255,0.08)"; for (let i = 0; i < 10; i += 2) g.fillRect(mez(x0, x1, i / 10), y0, (x1 - x0) / 10, h);
  // las líneas
  g.strokeStyle = "rgba(255,255,255,0.95)"; g.lineWidth = 4;
  g.strokeRect(x0 + 6, y0 + 6, x1 - x0 - 12, h - 12);
  g.beginPath(); g.moveTo((x0 + x1) / 2, y0 + 6); g.lineTo((x0 + x1) / 2, y0 + h - 6); g.stroke();
  g.beginPath(); g.arc((x0 + x1) / 2, y0 + h / 2, h * 0.17, 0, 6.283); g.stroke();
  const ar = (x1 - x0) * 0.16;
  g.strokeRect(x0 + 6, y0 + h * 0.22, ar, h * 0.56); g.strokeRect(x1 - 6 - ar, y0 + h * 0.22, ar, h * 0.56);
  // los arcos
  g.fillStyle = "#fff"; g.fillRect(x0 - 8, y0 + h * 0.4, 14, h * 0.2); g.fillRect(x1 - 6, y0 + h * 0.4, 14, h * 0.2);
  g.restore();
}

export function dibuja(g, t) {
  const c = camara(t);
  const luz = (fx) => su(tr(t, Tluz - 0.1 + (fx - 33.5) * 0.12, Tluz + 0.12 + (fx - 33.5) * 0.12));
  const st = {
    pozo: su(tr(t, P0, P1)), punta: punta(t), focos: luz,
    aire: t > Tair - 0.3 ? { t: t - Tair, al: su(tr(t, Tair - 0.3, Tair + 0.2)) } : null,
    gateo: t > Tang - 0.8 ? { x: gx(t), fase: (t - Tang) * 7, al: 1 } : null,
  };
  seccion(g, c, st, t);
  // la tierra que sale de lo que cavan
  if (t < P1 + 0.1) polvo(g, c, T.x0 + 0.45, mez(-0.15, T.y0, st.pozo) + 0.2, t, 1 - su(tr(t, P1 - 0.1, P1 + 0.1)));
  if (t > A0 && t < A1 + 0.2) polvo(g, c, st.punta, T.y0 + 0.4, t, 1 - su(tr(t, A1, A1 + 0.2)));
  cancha(g, c, t);
  // las cotas
  const a4 = su(tr(t, Tcua - 0.15, Tcua + 0.15)) * (1 - su(tr(t, Ttun - 0.2, Ttun + 0.1)));
  cota(g, SX(c, T.x0 - 0.7), SY(c, 0), SX(c, T.x0 - 0.7), SY(c, (T.y0 + T.y1) / 2), "4 m", a4, "255,214,80", -1);
  const a80 = su(tr(t, Tmet - 0.15, Tmet + 0.15)) * (1 - su(tr(t, Tang - 0.6, Tang - 0.1)));
  cota(g, SX(c, T.x0), SY(c, T.y0 - 1.6), SX(c, T.x1), SY(c, T.y0 - 1.6), "80 m", a80, "255,214,80", -1);
  velo(g, 0.4);
}
