// «Pero al atardecer el Sol está bajito, y su luz cruza casi cuarenta veces más aire para llegar hasta ti.»
// «En ese camino tan largo, el azul se va rebotando y se pierde antes de llegar.»
// Corte en «Pero»: la Tierra desde el espacio, como en el hook, con el Sol arriba y las dos personas. «bajito»: la
// cámara gira y se acerca a la persona del borde: ahora está de pie, y la luz le llega rasante, de lado, cruzando la
// capa de aire entera. «cuarenta»: «×40» sobre ese tramo. «camino»: la cámara viaja a lo largo del rayo; del rayo
// saltan chispas azules a los lados, una tras otra, y detrás de ellas el rayo se va volviendo amarillo y naranja.
// «pierde»: salta la última; a la persona le llega naranja.
import * as k from "#kit";
import { v } from "#voz";
import { AZUL, fondoEspacio, tierraConAire, persona } from "../mundo.js";
import { TIERRA } from "./02-espacio.js";

const f8 = v.frase(8), f9 = v.frase(9);
export const desde = () => f8.inicio - 0.03;
const Tbaj = f8.t("bajito"), Tcuar = f8.t("cuarenta"), Tcam = f9.t("camino"), Taz = f9.t("azul"), Tpier = f9.t("pierde"), Tfin = f9.fin;

const { suave: su, tramo: tr, mez, entra, azar } = k;
const { x: ex, y: ey, R, aire } = TIERRA, Ra = R * (1 + aire);
const xL = ex - R - 22, yIn = ey - Math.sqrt(Ra * Ra - (ex - xL) * (ex - xL)), yOut = ey - 34;
const top = [ex, ey - R], lado = [ex - R, ey];

// las chispas azules que se van del rayo
const az = azar(4545);
const NCH = 16;
const T0ch = Tcam - 0.2, T1ch = Tpier + 0.1;
const CHISPAS = Array.from({ length: NCH }, (_, i) => ({ f: (i + 0.5) / NCH, t0: mez(T0ch, T1ch, i / (NCH - 1)), lado: i % 2 ? 1 : -1, a: (az() - 0.5) * 1.2, v: 160 + az() * 90 }));
export const momentos = { gira: Tbaj, cuarenta: Tcuar, chispas: CHISPAS.map((c) => c.t0) };

// cuánto ha avanzado el naranja por el tramo (0 = entrada, 1 = la persona)
const frente = (t) => su(tr(t, T0ch, T1ch + 0.1));

export function dibuja(g, t) {
  const vista = su(tr(t, Tbaj - 0.7, Tbaj + 0.8));
  // el punto que mira la cámara: del centro al tramo largo, y luego a lo largo del rayo
  const viaje = su(tr(t, Tcam - 0.3, Tpier + 0.4));
  const Q = [xL + 40, mez(mez(yIn, yOut, 0.42), mez(yIn + 60, yOut - 40, 1), 0) + mez(0, 0, 0)];
  Q[1] = mez(mez(yIn, yOut, 0.45), mez(yIn + 90, yOut - 60, viaje), su(tr(t, Tcam - 0.3, Tcam + 0.2)));
  const foco = [mez(540, Q[0], vista), mez(1000, Q[1], vista)];
  const zoom = mez(1, 2.3, vista) * mez(1, 1.25, viaje);
  const giro = (Math.PI / 2) * vista;
  fondoEspacio(g, t, 0, 0);
  g.save();
  g.translate(540, 1000); g.rotate(giro); g.scale(zoom, zoom); g.translate(-foco[0], -foco[1]);
  // el Sol, arriba
  g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, 610, 150, 540, "255,200,110", 0.85); g.restore();
  k.estrella(g, "amarilla", 610, 150, 120, t * 0.5, 0.85);
  tierraConAire(g, t, ex, ey, R, 0, -1, aire);
  // la capa de aire, bien marcada al acercarse
  if (vista > 0) {
    const ga = g.createRadialGradient(ex, ey, R, ex, ey, Ra);
    ga.addColorStop(0, `rgba(120,190,255,${0.55 * vista})`); ga.addColorStop(0.8, `rgba(80,150,255,${0.3 * vista})`); ga.addColorStop(1, "rgba(60,120,255,0)");
    g.fillStyle = ga; g.beginPath(); g.arc(ex, ey, Ra, 0, Math.PI * 2); g.arc(ex, ey, R, 0, Math.PI * 2, true); g.fill();
  }
  persona(g, top[0], top[1] + 4, 64, 0);
  persona(g, lado[0] + 4, lado[1], 64, -Math.PI / 2);
  // el rayo corto (de mediodía)
  raya(g, 610, 270, 610, ey - Ra, "255,250,235", 16);
  tramo(g, 610, ey - Ra, 610, top[1] - 70, ["255,246,200", "255,236,170"]);
  // el rayo largo
  raya(g, xL, -1200, xL, yIn, "255,250,235", 16);
  const fr = frente(t);
  const cols = [];
  for (let i = 0; i <= 10; i++) {
    const s = i / 10, pasado = fr > 0 ? su(tr(fr - s * 1.0, 0, 0.35)) : 0; // detrás del frente ya no hay azul
    const base = k.mezRgb("255,250,240", "255,236,190", s * 0.3);
    cols.push(k.mezRgb(base, k.mezRgb("255,215,90", "255,110,30", s), pasado * su(Math.min(1, fr * 3))));
  }
  tramo(g, xL, yIn, xL, yOut, cols);
  // las chispas azules
  for (const c of CHISPAS) {
    const w = t - c.t0; if (w < 0 || w > 1.6) continue;
    const y0 = mez(yIn, yOut, c.f), d = c.v * w * (1 - 0.25 * w);
    const x = xL + c.lado * d * Math.cos(c.a), y = y0 + d * Math.sin(c.a) * 0.6;
    const al = 1 - tr(w, 1.0, 1.6);
    g.save(); g.globalCompositeOperation = "lighter";
    k.brillo(g, x, y, 70, AZUL, al);
    const d2 = Math.max(0, d - 60), xs = xL + c.lado * d2 * Math.cos(c.a), ys = y0 + d2 * Math.sin(c.a) * 0.6;
    g.strokeStyle = `rgba(${AZUL},${0.7 * al})`; g.lineWidth = 5; g.lineCap = "round"; g.beginPath(); g.moveTo(xs, ys); g.lineTo(x, y); g.stroke();
    g.fillStyle = `rgba(200,230,255,${al})`; g.beginPath(); g.arc(x, y, 6, 0, Math.PI * 2); g.fill();
    g.restore();
    if (w < 0.25) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, xL, y0, 110, AZUL, 1 - w / 0.25); g.restore(); }
  }
  g.restore();
  // ×40
  const p = entra(tr(t, Tcuar - 0.15, Tcuar + 0.3)) * (1 - su(tr(t, Tcam - 0.4, Tcam)));
  if (p > 0) { g.save(); const s = mez(0.6, 1, p); g.translate(540, 760); g.scale(s, s); k.pastilla(g, 0, 0, "×40", "", "255,190,90", p, 150); g.restore(); }
}

function raya(g, x0, y0, x1, y1, col, ancho) {
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
  g.shadowColor = `rgba(${col},0.9)`; g.shadowBlur = 30; g.strokeStyle = `rgba(${col},0.95)`; g.lineWidth = ancho;
  g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); g.restore();
}
function tramo(g, x0, y0, x1, y1, cols) {
  const gr = g.createLinearGradient(x0, y0, x1, y1);
  cols.forEach((c, i) => gr.addColorStop(i / (cols.length - 1), `rgb(${c})`));
  g.save(); g.lineCap = "round"; g.shadowColor = `rgba(${cols[cols.length - 1]},0.8)`; g.shadowBlur = 30;
  g.strokeStyle = gr; g.lineWidth = 26; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
  g.shadowBlur = 0; g.strokeStyle = "rgba(255,255,255,0.9)"; g.lineWidth = 5; g.beginPath(); g.moveTo(x0 - 40, y0); g.lineTo(x0 + 40, y0); g.stroke();
  g.restore();
}
