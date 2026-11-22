// «Así que el atardecer no pinta el cielo de otro color: es la misma luz, que perdió su azul en el camino.»
// Corte en «Así»: el atardecer del hook, el Sol tocando el mar. «misma luz»: un rayo sale del Sol y viene hacia la
// cámara por encima del mar; «perdió su azul»: del rayo saltan chispas azules a los lados mientras se vuelve naranja;
// «camino»: el rayo llega naranja y la cámara se acerca despacio al Sol.
import * as k from "#kit";
import { v } from "#voz";
import { AZUL, cieloMar, camCielo } from "../mundo.js";

const f14 = v.frase(14);
export const desde = () => f14.inicio - 0.03;
const T0 = f14.inicio, Tmis = f14.t("misma"), Tper = f14.t("perdio"), Tcam = f14.t("camino"), Tfin = f14.fin;
const { suave: su, tramo: tr, mez, azar } = k;

const az = azar(9191);
const CH = Array.from({ length: 14 }, (_, i) => ({ f: (i + 0.5) / 14, t0: mez(Tper - 0.5, Tcam + 0.2, i / 13), lado: i % 2 ? 1 : -1, a: -0.3 + az() * 0.6, v: 220 + az() * 160 }));
export const momentos = { rayo: Tmis, chispas: CH.map((c) => c.t0) };

export function dibuja(g, t) {
  const cam = camCielo(1250 + 270 * su(tr(t, T0 - 0.2, Tfin + 0.1)), mez(1.5, 3, su(tr(t, T0, Tfin))), 0, 6);
  const { sol } = cieloMar(g, t, { cam, u: 1, sol: -0.6, nubes: 1 });
  if (!sol) return;
  // el rayo: del Sol hacia la cámara (abajo), ensanchándose
  const r = su(tr(t, Tmis - 0.4, Tmis + 0.6));
  if (r <= 0) return;
  const x0 = sol.x, y0 = sol.y, x1 = 540, y1 = mez(y0, 1900, r);
  const fr = su(tr(t, Tper - 0.5, Tcam + 0.4));
  g.save(); g.globalCompositeOperation = "lighter";
  const gr = g.createLinearGradient(0, y0, 0, 1900);
  gr.addColorStop(0, "rgba(255,250,235,0.9)");
  gr.addColorStop(0.5, `rgba(${k.mezRgb("255,250,235", "255,180,70", fr)},0.75)`);
  gr.addColorStop(1, `rgba(${k.mezRgb("255,250,235", "255,110,30", fr)},0.65)`);
  g.fillStyle = gr;
  g.beginPath(); g.moveTo(x0 - 10, y0); g.lineTo(x0 + 10, y0); g.lineTo(x1 + 170 * r, y1); g.lineTo(x1 - 170 * r, y1); g.closePath(); g.fill();
  g.restore();
  // las chispas azules que se van
  for (const c of CH) {
    const w = t - c.t0; if (w < 0 || w > 1.4) continue;
    const yy = mez(y0 + 40, 1750, c.f), half = 10 + 160 * ((yy - y0) / (1900 - y0));
    const d = c.v * w * (1 - 0.2 * w), x = x0 + c.lado * (half + d), y = yy + d * Math.sin(c.a);
    const al = 1 - tr(w, 0.9, 1.4), s = 0.6 + (yy - y0) / 900;
    g.save(); g.globalCompositeOperation = "lighter";
    k.brillo(g, x, y, 80 * s, AZUL, al);
    g.fillStyle = `rgba(190,225,255,${al})`; g.beginPath(); g.arc(x, y, 7 * s, 0, Math.PI * 2); g.fill();
    g.restore();
  }
}
