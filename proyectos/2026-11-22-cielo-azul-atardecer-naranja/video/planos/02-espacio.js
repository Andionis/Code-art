// «Es la misma luz del Sol. Lo único que cambia es cuánto aire tiene que cruzar.»
// Corte en «Es»: el Sol enorme, de cerca, hirviendo. «Lo único»: la cámara se aleja: el Sol arriba y la Tierra abajo,
// con su capa de aire azul. Baja un rayo hasta una persona en lo alto del planeta: cruza poca capa (el tramo se marca).
// «aire»: otro rayo baja rozando el borde hasta una persona en el lado: cruza muchísima capa, y ese tramo se pone naranja.
import * as k from "#kit";
import { v } from "#voz";
import { fondoEspacio, tierraConAire, persona, rayo } from "../mundo.js";

const f2 = v.frase(2);
export const desde = () => f2.inicio - 0.03;
const Tsol = f2.t("sol"), Tlo = f2.t("lo"), Tcambia = f2.t("cambia"), Taire = f2.t("aire");
export const momentos = { sol: Tsol, rayo1: Tcambia - 0.1, rayo2: Taire - 0.35 };

export const TIERRA = { x: 610, y: 1500, R: 390, aire: 0.3 };

export function dibuja(g, t) {
  const al = k.suave(k.tramo(t, Tlo - 0.15, Tlo + 0.9));
  fondoEspacio(g, t, 0, -al * 30);
  const { x: ex, R, aire } = TIERRA, ey = k.mez(2700, TIERRA.y, al), Ra = R * (1 + aire);
  // el Sol: de enorme a arriba del todo
  const acerca = k.suave(k.tramo(t, f2.inicio, Tlo));
  const sx = 610, sy = k.mez(960, 150, al), sr = k.mez(k.mez(430, 640, acerca), 120, al);
  g.save(); g.globalCompositeOperation = "lighter";
  k.brillo(g, sx, sy, sr * 4.5, "255,200,110", 0.85);
  g.restore();
  k.estrella(g, "amarilla", sx, sy, sr, t * 0.5, 0.85 + 0.1 * Math.sin(t * 3));
  g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, sx, sy, sr * 1.6, "255,230,160", 0.45); g.restore();
  if (al <= 0) return;
  tierraConAire(g, t, ex, ey, R, 0, -1, aire);
  // las dos personas: arriba (mediodía) y en el borde izquierdo (atardecer)
  const top = [ex, ey - R], lado = [ex - R, ey];
  persona(g, top[0], top[1] + 4, 64, 0);
  persona(g, lado[0] + 4, lado[1], 64, -Math.PI / 2);
  // rayo 1: baja recto a la de arriba
  const r1 = k.entra(k.tramo(t, Tcambia - 0.15, Tcambia + 0.35));
  const yAire1 = ey - Ra;
  if (r1 > 0) {
    const yb = k.mez(sy + sr, top[1] - 70, r1);
    rayo(g, sx, sy + sr * 0.8, sx, Math.min(yb, yAire1), ["255,250,235"], 16);
    if (yb > yAire1) tramoAire(g, sx, yAire1, sx, yb, "255,246,200", "255,236,170");
  }
  // rayo 2: baja rozando el borde izquierdo, hasta la persona del lado
  const r2 = k.entra(k.tramo(t, Taire - 0.4, Taire + 0.3));
  const xL = lado[0] - 22, yAire2 = ey - Math.sqrt(Ra * Ra - (ex - xL) * (ex - xL));
  if (r2 > 0) {
    const yb = k.mez(-50, lado[1] - 20, r2);
    const naranja = k.suave(k.tramo(t, Taire, Taire + 0.5));
    rayo(g, xL, -50, xL, Math.min(yb, yAire2), ["255,250,235"], 16);
    if (yb > yAire2) tramoAire(g, xL, yAire2, xL, yb, k.mezRgb("255,246,200", "255,190,60", naranja), k.mezRgb("255,236,170", "255,80,20", naranja));
  }
}

// El tramo del rayo que va dentro del aire: más grueso, del color a (arriba) al b (abajo), con su tope arriba.
function tramoAire(g, x0, y0, x1, y1, a, b) {
  const gr = g.createLinearGradient(x0, y0, x1, y1); gr.addColorStop(0, `rgb(${a})`); gr.addColorStop(1, `rgb(${b})`);
  g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, (x0 + x1) / 2, (y0 + y1) / 2, 160 + Math.abs(y1 - y0), b, 0.5); g.restore();
  g.save(); g.lineCap = "round"; g.strokeStyle = gr; g.lineWidth = 26; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
  g.strokeStyle = "rgba(255,255,255,0.9)"; g.lineWidth = 5; g.beginPath(); g.moveTo(x0 - 40, y0); g.lineTo(x0 + 40, y0); g.stroke();
  g.restore();
}
