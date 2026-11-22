// «Al entrar en el aire, la luz choca con millones de partículas diminutas.»
// «Y ahí las ondas cortas rebotan como una bola de pinball: el azul rebota más de cinco veces más que el rojo.»
// «Así que el azul sale disparado para todos lados y llena el cielo entero.»
// Corte en «Al»: dentro del aire, entre partículas que flotan; el rayo blanco entra y la cámara viaja con él. «choca»:
// golpea una partícula y destella; «millones»: la cámara se aleja y aparecen miles. «rebotan»: del choque salen bolitas
// azules que rebotan de partícula en partícula (pinball), y bolitas rojas que siguen recto. «cinco»: «×5» en azul.
// «disparado»: el azul sale a cientos en todas direcciones; «llena el cielo entero»: todo se tiñe de azul y queda el
// cielo sobre el mar.
import * as k from "#kit";
import { v } from "#voz";
import { AZUL, ROJO, cieloMar, camCielo } from "../mundo.js";

const f5 = v.frase(5), f6 = v.frase(6), f7 = v.frase(7);
export const desde = () => f5.inicio - 0.03;
const T5 = f5.inicio, Tchoca = f5.t("choca"), Tmill = f5.t("millones");
const Treb = f6.t("rebotan"), Tpin = f6.t("pinball"), Tcinco = f6.t("cinco");
const Tdisp = f7.t("disparado"), Tllena = f7.t("llena"), Tent = f7.t("entero"), Tfin = f7.fin;

const { suave: su, tramo: tr, mez, entra, azar } = k;
const C = [700, 1000]; // donde choca la luz

// las partículas del aire (en el mundo): cada una, dos bolitas pegadas
const az = azar(3131);
const MOL = Array.from({ length: 900 }, () => ({ x: -500 + az() * 2400, y: -900 + az() * 3800, s: 0.45 + az() * 0.8, a: az() * 6.28, f: az() * 6.28 }));
MOL.push({ x: C[0] + 14, y: C[1], s: 1.3, a: 0.5, f: 0 });
const SPR = (() => {
  const c = k.lienzo(120, 70), x = c.getContext("2d");
  for (const cx of [38, 82]) {
    const gr = x.createRadialGradient(cx - 9, 26, 3, cx, 35, 28);
    gr.addColorStop(0, "#ffffff"); gr.addColorStop(0.45, "#c9d6ff"); gr.addColorStop(1, "#5866b8");
    x.fillStyle = gr; x.beginPath(); x.arc(cx, 35, 27, 0, Math.PI * 2); x.fill();
  }
  return c;
})();

// los rebotes del azul: cada fotón sale de C y va saltando de partícula en partícula
function caminoAzul(sem, n) {
  const r = azar(sem), pts = [C.slice()];
  let p = C.slice();
  for (let i = 0; i < n; i++) {
    let best = null;
    for (let tries = 0; tries < 30 && !best; tries++) {
      const m = MOL[Math.floor(r() * (MOL.length - 1))];
      const d = Math.hypot(m.x - p[0], m.y - p[1]);
      if (d > 140 && d < 330) best = [m.x, m.y];
    }
    if (!best) { const a = r() * 6.28; best = [p[0] + Math.cos(a) * 220, p[1] + Math.sin(a) * 220]; }
    pts.push(best); p = best;
  }
  return pts;
}
const AZULES = Array.from({ length: 46 }, (_, i) => ({ t0: i < 6 ? Tchoca + 0.15 + i * 0.6 : Treb - 0.25 + (i - 6) * 0.15, pts: caminoAzul(500 + i, 14), vel: 950 }));
const ROJOS = Array.from({ length: 14 }, (_, i) => ({ t0: Tchoca + 0.15 + i * 0.75, y: C[1] + (i % 3 - 1) * 14 }));
// el disparo: cientos de azules en todas direcciones
const azD = azar(808);
const DISPARO = Array.from({ length: 260 }, () => ({ a: azD() * 6.28, v: 700 + azD() * 1300, t0: Tdisp - 0.25 + azD() * 1.2 }));

function posCamino(pts, d) {
  for (let i = 1; i < pts.length; i++) {
    const L = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (d <= L) { const u = d / L; return { p: [mez(pts[i - 1][0], pts[i][0], u), mez(pts[i - 1][1], pts[i][1], u)], i, resto: L - d }; }
    d -= L;
  }
  return null;
}

function bola(g, x, y, col, r, al = 1) {
  g.save(); g.globalCompositeOperation = "lighter";
  k.brillo(g, x, y, r * 9, col, 0.8 * al);
  g.fillStyle = `rgba(255,255,255,${al})`; g.beginPath(); g.arc(x, y, r * 0.55, 0, Math.PI * 2); g.fill();
  g.fillStyle = `rgba(${col},${al})`; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
  g.restore();
}

export const momentos = { choca: Tchoca, rebotes: [], disparo: Tdisp };
for (const a of AZULES) { let d = 0; for (let i = 1; i < a.pts.length; i++) { d += Math.hypot(a.pts[i][0] - a.pts[i - 1][0], a.pts[i][1] - a.pts[i - 1][1]); const tb = a.t0 + d / a.vel; if (tb < Tdisp) momentos.rebotes.push(tb); } }

export function dibuja(g, t) {
  // el cielo, al final: el azul llena todo
  const cielo = su(tr(t, Tllena - 0.2, Tent + 0.35));
  const camX = mez(160, C[0], su(tr(t, T5, Tchoca + 0.2)));
  const z = mez(1.6, 1, su(tr(t, Tmill - 0.4, Tmill + 0.9))) * mez(1, 0.62, su(tr(t, Tdisp - 0.3, Tent)));
  const S = (wx, wy) => [540 + (wx - camX) * z, 1000 + (wy - C[1]) * z];
  // fondo: el aire de noche, que se va volviendo azul
  const azulea = su(tr(t, Treb, Tdisp + 0.5)) * 0.35 + 0.65 * su(tr(t, Tdisp, Tllena + 0.4));
  const gr = g.createLinearGradient(0, 0, 0, 1920);
  gr.addColorStop(0, k.mezColor("#050a1e", "#1d5fd0", azulea)); gr.addColorStop(1, k.mezColor("#0b1638", "#5aa2f0", azulea));
  g.fillStyle = gr; g.fillRect(0, 0, 1080, 1920);
  // las partículas, que tiemblan un poco
  const parts = 1 - cielo;
  if (parts > 0) {
    g.save(); g.globalAlpha = parts;
    for (const m of MOL) {
      const [x, y] = S(m.x + 5 * Math.sin(t * 1.3 + m.f), m.y + 5 * Math.cos(t * 1.1 + m.f));
      const w = 46 * m.s * z;
      if (x < -60 || x > 1140 || y < -60 || y > 1980) continue;
      k.girado(g, SPR, x, y, w, m.a + 0.3 * Math.sin(t * 0.7 + m.f));
    }
    g.restore();
  }
  // el rayo blanco que entra hasta C
  const head = mez(-120, C[0], su(tr(t, T5 - 0.1, Tchoca)));
  const rayoAl = parts * (1 - 0.4 * su(tr(t, Tdisp, Tent)));
  {
    const [x0, y0] = S(-900, C[1]), [x1] = S(head, C[1]);
    g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
    g.shadowColor = `rgba(255,250,235,${rayoAl})`; g.shadowBlur = 40;
    g.strokeStyle = `rgba(255,250,240,${0.95 * rayoAl})`; g.lineWidth = 22 * z;
    g.beginPath(); for (let x = x0; x <= x1; x += 8) { const y = y0 + 9 * z * Math.sin((x - t * 900) / 30); x === x0 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke();
    g.restore();
    if (t < Tchoca) bola(g, x1, y0, "255,250,235", 16 * z, rayoAl);
  }
  // el choque
  const [cx, cy] = S(C[0], C[1]);
  if (t > Tchoca - 0.05) { const u = (t - Tchoca + 0.05) * 1.6; if (u < 1) k.fogonazo(g, cx, cy, u, 1100 * z, "255,250,235"); }
  // los rojos: siguen recto
  for (const r of ROJOS) {
    const d = (t - r.t0) * 900; if (d < 0) continue;
    const [x, y] = S(C[0] + d, r.y);
    if (x > 1200) continue;
    g.save(); g.globalCompositeOperation = "lighter"; g.strokeStyle = `rgba(${ROJO},${0.85 * parts})`; g.lineWidth = 9 * z; g.lineCap = "round";
    const [xa] = S(C[0] + Math.max(0, d - 420), r.y); g.beginPath(); g.moveTo(xa, y); g.lineTo(x, y); g.stroke(); g.restore();
    bola(g, x, y, ROJO, 16 * z, parts);
  }
  // los azules: rebotan de partícula en partícula
  for (const a of AZULES) {
    const d = (t - a.t0) * a.vel; if (d < 0 || a.t0 > Tdisp) continue;
    const q = posCamino(a.pts, d); if (!q) continue;
    // la estela: los dos últimos tramos
    g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round"; g.lineJoin = "round"; g.strokeStyle = `rgba(${AZUL},${0.55 * parts})`; g.lineWidth = 6 * z;
    g.beginPath(); const [px, py] = S(q.p[0], q.p[1]); g.moveTo(px, py);
    for (let i = q.i - 1; i >= Math.max(0, q.i - 2); i--) { const [x, y] = S(a.pts[i][0], a.pts[i][1]); g.lineTo(x, y); }
    g.stroke(); g.restore();
    // destello en el último rebote
    const [bx, by] = S(a.pts[q.i - 1][0], a.pts[q.i - 1][1]);
    const desde = Math.hypot(q.p[0] - a.pts[q.i - 1][0], q.p[1] - a.pts[q.i - 1][1]) / a.vel;
    if (desde < 0.18 && q.i > 1) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, bx, by, 160 * z, AZUL, (1 - desde / 0.18) * parts); g.restore(); }
    bola(g, px, py, AZUL, 16 * z, parts);
  }
  // el disparo
  for (const p of DISPARO) {
    const w = t - p.t0; if (w < 0) continue;
    const d = p.v * w, [x, y] = S(C[0] + Math.cos(p.a) * d, C[1] + Math.sin(p.a) * d);
    if (x < -80 || x > 1160 || y < -80 || y > 2000) continue;
    bola(g, x, y, AZUL, 11 * z, 1 - cielo * 0.8);
  }
  // ×5
  const p5 = entra(tr(t, Tcinco - 0.15, Tcinco + 0.25)) * (1 - su(tr(t, Tdisp - 0.2, Tdisp + 0.2)));
  if (p5 > 0) { g.save(); const s = mez(0.6, 1, p5); g.translate(540, 1330); g.scale(s, s); k.pastilla(g, 0, 0, "×5", "", "120,180,255", p5, 150); g.restore(); }
  // el cielo sobre el mar
  if (cielo > 0) {
    g.save(); g.globalAlpha = cielo;
    const c = document_cielo(g, t);
    g.restore();
  }
}

const off = k.lienzo(1080, 1920), og = off.getContext("2d");
function document_cielo(g, t) {
  og.clearRect(0, 0, 1080, 1920);
  cieloMar(og, t, { cam: camCielo(2600 + 25 * (t - Tllena), 14, 0, 0), u: 0, sol: 30, nubes: 1 });
  g.drawImage(off, 0, 0);
}
