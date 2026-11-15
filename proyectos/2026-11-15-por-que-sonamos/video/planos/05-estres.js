// «La segunda: terapia. Mientras sueñas, la química del estrés baja al mínimo.»
// Dentro del cerebro: neuronas de luz y, entre ellas, un remolino de chispas rojas (la química del estrés).
// - «terapia»: una onda azul, suave, sale del centro.
// - «sueñas»: la luz se va volviendo azul.
// - «baja al mínimo»: las chispas rojas se van girando hacia abajo, como agua por un desagüe, y desaparecen; la cámara
//   baja con ellas y todo queda azul y en calma.
import * as k from "#kit";
import { v } from "#voz";
import { TAU, camino2D, velo, vineta, vista } from "../mundo.js";

const f7 = v.frase(7);
export const desde = (vv) => vv.frase(7).inicio;
const { suave: su, tramo: tr, mez, azar } = k;
const Tter = f7.t("terapia"), Tsue = f7.t("suenas"), Tquim = f7.t("quimica"), Tbaja = f7.t("baja"), Tmin = f7.t("minimo"), Tfin = f7.fin;
const DES = [0, 1250];   // el desagüe

const cam = camino2D([
  [f7.inicio - 0.05, [2.1, 0, 0]],
  [Tquim, [1.95, 0, 100]],
  [Tbaja - 0.1, [1.85, 0, 200]],
  [Tmin + 0.4, [1.7, 0, 1000]],
  [Tfin + 0.4, [1.68, 0, 1040]],
]);
const az = azar(707);
const NEURONAS = Array.from({ length: 26 }, (_, i) => ({ x: (az() - 0.5) * 1300, y: -900 + (i / 26) * 2500 + (az() - 0.5) * 120, r: 22 + az() * 16, f: az() * TAU }));
const RAMAS = [];
for (const [i, n] of NEURONAS.entries()) {
  const otras = NEURONAS.map((m, j) => [j, Math.hypot(m.x - n.x, m.y - n.y)]).filter(([j]) => j !== i).sort((a, b) => a[1] - b[1]).slice(0, 3);
  for (const [j] of otras) if (j > i) RAMAS.push([i, j, (az() - 0.5) * 160]);
}
const CHISPAS = Array.from({ length: 200 }, () => ({ x: (az() - 0.5) * 700, y: -600 + az() * 1500, r: 4 + az() * 6, f: az() * TAU, v: 0.6 + az() * 1.4, d: az() }));

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  const azul = su(tr(t, Tsue - 0.2, Tmin + 0.5));
  // el fondo
  const fg = g.createLinearGradient(0, cy - 1200, 0, cy + 1200);
  fg.addColorStop(0, k.mezColor("#1a0412", "#04102a", azul)); fg.addColorStop(1, k.mezColor("#3a0820", "#0a2850", azul));
  g.fillStyle = fg; g.fillRect(cx - 1000, cy - 1400, 2000, 2800);
  g.save(); g.globalCompositeOperation = "screen"; g.globalAlpha *= 0.08; g.drawImage(k.manchas, cx - 1000, cy - 1400, 2000, 2800); g.restore();
  // las ramas y las neuronas
  const colN = k.mezRgb("255,150,120", "120,200,255", azul);
  g.save(); g.lineCap = "round";
  for (const [i, j, c] of RAMAS) {
    const a = NEURONAS[i], b = NEURONAS[j];
    g.strokeStyle = `rgba(${colN},0.35)`; g.lineWidth = 7;
    g.beginPath(); g.moveTo(a.x, a.y); g.quadraticCurveTo((a.x + b.x) / 2 + c, (a.y + b.y) / 2 - c * 0.5, b.x, b.y); g.stroke();
    g.strokeStyle = `rgba(${colN},0.7)`; g.lineWidth = 2.5; g.stroke();
    // un pulso que corre por la rama
    const u = ((t * 0.6 + (i * 0.37 + j * 0.11)) % 1);
    const px = (1 - u) * (1 - u) * a.x + 2 * u * (1 - u) * ((a.x + b.x) / 2 + c) + u * u * b.x, py = (1 - u) * (1 - u) * a.y + 2 * u * (1 - u) * ((a.y + b.y) / 2 - c * 0.5) + u * u * b.y;
    g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, px, py, 40, colN, 0.6); g.restore();
  }
  for (const n of NEURONAS) {
    const azd = azar(Math.floor(n.f * 1000));
    g.strokeStyle = `rgba(${colN},0.55)`; g.lineWidth = 3;
    for (let d = 0; d < 7; d++) {
      const a = azd() * TAU, l = n.r * (2 + azd() * 2.5);
      const x1 = n.x + Math.cos(a) * l, y1 = n.y + Math.sin(a) * l;
      g.beginPath(); g.moveTo(n.x, n.y); g.quadraticCurveTo(n.x + Math.cos(a + 0.4) * l * 0.5, n.y + Math.sin(a + 0.4) * l * 0.5, x1, y1); g.stroke();
      g.beginPath(); g.moveTo(x1, y1); g.lineTo(x1 + Math.cos(a + 0.6) * l * 0.4, y1 + Math.sin(a + 0.6) * l * 0.4); g.moveTo(x1, y1); g.lineTo(x1 + Math.cos(a - 0.6) * l * 0.4, y1 + Math.sin(a - 0.6) * l * 0.4); g.stroke();
    }
    k.brillo(g, n.x, n.y, n.r * 7, colN, 0.45 + 0.15 * Math.sin(t * 2 + n.f));
    const ng = g.createRadialGradient(n.x - n.r * 0.3, n.y - n.r * 0.3, 0, n.x, n.y, n.r);
    ng.addColorStop(0, "#ffffff"); ng.addColorStop(0.5, `rgb(${colN})`); ng.addColorStop(1, `rgba(${k.mezRgb(colN, "0,0,0", 0.5)},1)`);
    g.fillStyle = ng; g.beginPath(); g.arc(n.x, n.y, n.r, 0, TAU); g.fill();
  }
  g.restore();
  // «terapia»: la onda azul
  const w = t - Tter;
  if (w > 0 && w < 1.6) { g.save(); g.globalCompositeOperation = "lighter"; g.strokeStyle = `rgba(120,200,255,${0.6 * (1 - w / 1.6)})`; g.lineWidth = 18 * (1 - w / 1.6) + 4; g.beginPath(); g.arc(0, 40, 80 + w * 900, 0, TAU); g.stroke(); g.restore(); }
  // las chispas del estrés: giran entre las neuronas; en «baja», se van por el desagüe
  g.save(); g.globalCompositeOperation = "lighter";
  for (const c of CHISPAS) {
    const ida = su(tr(t, Tbaja - 0.15 + c.d * 0.5, Tmin + 0.35 + c.d * 0.5));
    let x = c.x + Math.sin(t * c.v + c.f) * 60, y = c.y + Math.cos(t * c.v * 0.8 + c.f) * 50;
    if (ida > 0) {
      const a = c.f + ida * 9, rr = mez(Math.hypot(x - DES[0], y - DES[1]), 0, ida), a0 = Math.atan2(y - DES[1], x - DES[0]);
      x = mez(x, DES[0] + Math.cos(a0 + ida * 5) * rr, ida); y = mez(y, DES[1] + Math.sin(a0 + ida * 5) * rr * 0.4, ida);
    }
    const al = (1 - ida) * (0.6 + 0.4 * Math.sin(t * 6 + c.f));
    if (al <= 0.02) continue;
    k.brillo(g, x, y, c.r * 6, "255,60,50", al * 0.8);
    g.fillStyle = `rgba(255,110,80,${al})`; g.beginPath(); g.arc(x, y, c.r * 0.8, 0, TAU); g.fill();
  }
  // el remolino del desagüe, mientras se van
  const rem = k.pulso(t, (Tbaja + Tmin) / 2 + 0.3, 0.6);
  if (rem > 0.02) for (let i = 0; i < 4; i++) { g.strokeStyle = `rgba(255,120,100,${0.35 * rem})`; g.lineWidth = 6; g.beginPath(); g.ellipse(DES[0], DES[1], 70 + i * 60, 22 + i * 18, 0, t * 4 + i, t * 4 + i + 4); g.stroke(); }
  g.restore();
  vineta(g, 0.5);
  velo(g, 0.35);
}

export const momentos = { terapia: Tter, baja: Tbaja };
