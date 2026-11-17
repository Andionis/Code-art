// «Choques así llenaron de oro la nube de polvo de la que nacieron el Sol y la Tierra. Casi todo se hundió hasta el
// centro del planeta...»
// - Corte en «Choques»: una nube de polvo enorme que gira en un disco; lejos, destellos de choques; en «llenaron»,
//   chorros de chispas de oro caen en ella y la llenan de puntos dorados.
// - «nacieron»: el disco se aprieta y gira más; en «Sol», el centro se enciende (el Sol); en «Tierra», un trozo del
//   disco se junta en una bola: la Tierra.
// - «Casi todo se hundió»: la cámara va hasta la Tierra, que se abre en corte (corteza, manto y núcleo). Los puntos
//   de oro caen hacia el centro y en «centro» el núcleo brilla de oro. Reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { ORO_RGB } from "../mundo.js";

export const desde = "choques";
export const entrada = "corte";

const { suave, tramo, entra, pulso, proyecta, F } = k;
const f10 = v.frase(10), f11 = v.frase(11);
const T0 = f10.inicio, Tllen = f10.t("llenaron"), Tnac = f10.t("nacieron"), Tsol = f10.t("sol"), Ttierra = f10.t("tierra");
const Thund = f11.t("hundio"), Tcentro = f11.t("centro"), Ttodo2 = f11.t("todo", 2);

// ---------------------------------------------------------------- el disco de polvo
const az = k.azar(73);
const polvo = Array.from({ length: 1700 }, () => {
  const r = 0.6 + Math.pow(az(), 0.8) * 9, a = az() * Math.PI * 2;
  return { r, a, y: (az() - 0.5) * 0.5 * (r / 9), tam: 0.05 + az() * 0.1, oro: az() < 0.3, c: az() < 0.5 ? "200,170,140" : "170,150,190", b: 0.3 + az() * 0.5 };
});
// los chorros de oro que llegan en «llenaron»
const chorros = Array.from({ length: 140 }, () => ({ de: [(az() - 0.5) * 30, 6 + az() * 8, -14 - az() * 10], a: az() * 6.28, r: 1 + az() * 8, t0: T0 + 0.2 + az() * (Tnac - T0 - 0.2), dur: 0.7 + az() * 0.5 }));
const giro = (r, t) => (t - T0) * (1.1 / Math.sqrt(r)) * (1 + 1.5 * suave(tramo(t, Tnac, Ttierra)));
const aprieta = (t) => k.mez(1, 0.75, suave(tramo(t, Tnac, Tsol + 0.3)));
const ETIERRA = 5.2;   // a qué distancia del Sol nace la Tierra
const angTierra = (t) => 0.9 + giro(ETIERRA, t) * 0;

// la cámara: mira el disco desde arriba en diagonal; luego va hasta la Tierra
const cam = (t) => {
  const P = posTierra(Ttierra);
  const u = suave(tramo(t, Ttierra + 0.35, Thund + 0.25));
  const pos = k.mezV(k.orbita(0.3 + (t - T0) * 0.03, 12, 10), k.sum(P, [0.05, 0.1, 1.4]), u);
  const mira = k.mezV([0, -1.2, 0], P, u);
  return k.mira(pos, mira);
};
const posTierra = (t) => { const a = 2.2 + giro(ETIERRA, Math.min(t, Ttierra)) * 0.25; return [ETIERRA * Math.cos(a), 0, ETIERRA * Math.sin(a)]; };

const cielo = k.cielo(91, 1800, [0, 0, 0], 300, 20);

// ---------------------------------------------------------------- la Tierra abierta
function tierraAbierta(g, x, y, R, t, oroCentro, abre) {
  k.tierra(g, x, y, R, t * 0.15, -0.8, -0.5);
  if (abre <= 0) return;
  // el corte: una cuña (de las 12 a las 3) que se abre y deja ver las capas
  const a0 = -Math.PI / 2, a1 = a0 + (Math.PI / 2) * abre;
  g.save();
  g.beginPath(); g.moveTo(x, y); g.arc(x, y, R * 1.002, a0, a1); g.closePath(); g.clip();
  const capas = [[1, "#6b4a2b", "#3d2a18"], [0.96, "#e8641a", "#9c2a0a"], [0.55, "#ffb347", "#c2410c"]];
  for (const [f, c0, c1] of capas) {
    const gr = g.createRadialGradient(x, y, 0, x, y, R * f);
    gr.addColorStop(0, c0); gr.addColorStop(1, c1);
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, R * f, 0, Math.PI * 2); g.fill();
  }
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.35; k.girado(g, k.manchas, x, y, R * 2.4, 0.4); g.globalCompositeOperation = "source-over"; g.globalAlpha = 1;
  // el núcleo de oro
  const nr = R * 0.3, ng = g.createRadialGradient(x - nr * 0.3, y - nr * 0.3, 0, x, y, nr);
  ng.addColorStop(0, k.mezColor("#d0603a", "#fff6cf", oroCentro)); ng.addColorStop(0.6, k.mezColor("#8a2a12", "#ffcf4a", oroCentro)); ng.addColorStop(1, k.mezColor("#4a140a", "#c88a10", oroCentro));
  g.fillStyle = ng; g.beginPath(); g.arc(x, y, nr, 0, Math.PI * 2); g.fill();
  // los puntos de oro que caen hacia el centro
  for (let i = 0; i < 70; i++) {
    const q = (i * 0.6180339) % 1, a = a0 + 0.08 + q * (a1 - a0 - 0.16), d0 = R * (0.4 + ((i * 0.37) % 1) * 0.55);
    const ts = Thund - 0.1 + ((i * 0.713) % 1) * 0.9, u = entra(tramo(t, ts, ts + 0.7));
    const d = k.mez(d0, nr * 0.6, u);
    if (u >= 1) continue;
    k.brillo(g, x + Math.cos(a) * d, y + Math.sin(a) * d, 26 + 20 * (1 - u), ORO_RGB, 1);
  }
  g.restore();
  k.brillo(g, x, y, R * 1.1, ORO_RGB, 0.8 * oroCentro);
  // el borde del corte
  g.save(); g.strokeStyle = "rgba(255,230,190,0.5)"; g.lineWidth = 3;
  g.beginPath(); g.moveTo(x + Math.cos(a0) * R, y + Math.sin(a0) * R); g.lineTo(x, y); g.lineTo(x + Math.cos(a1) * R, y + Math.sin(a1) * R); g.stroke(); g.restore();
}

export function dibuja(g, t) {
  const c = cam(t), antes = cam(t - 1 / 60);
  k.fondo(g, c);
  k.estrellas(g, c, antes, cielo);
  // destellos de choques lejanos
  for (const [x, y, tt] of [[160, 640, T0 + 0.05], [900, 560, T0 + 0.45], [780, 1500, T0 + 0.9]]) {
    k.brillo(g, x, y, 500, ORO_RGB, 0.9 * pulso(t, tt, 0.25) * (1 - tramo(t, Ttierra, Ttierra + 0.3)));
  }
  const ap = aprieta(t), cerca = suave(tramo(t, Ttierra + 0.35, Thund + 0.25));
  // el resplandor del disco: una elipse de luz suave (rosa y luego dorada)
  { const O = proyecta(c, [0, 0, 0]), E = proyecta(c, [9 * ap, 0, 0]), N = proyecta(c, [0, 0, 9 * ap]);
    if (O && E && N && cerca < 1) {
      const rx = Math.hypot(E.x - O.x, E.y - O.y), ry = Math.max(30, Math.hypot(N.x - O.x, N.y - O.y));
      g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha = 1 - cerca; g.translate(O.x, O.y); g.scale(1, ry / rx);
      const gr = g.createRadialGradient(0, 0, 0, 0, 0, rx);
      const col = k.mezRgb("200,120,160", ORO_RGB, tramo(t, Tllen, Tnac + 0.4));
      gr.addColorStop(0, `rgba(${col},0.45)`); gr.addColorStop(0.5, `rgba(${col},0.18)`); gr.addColorStop(1, `rgba(${col},0)`);
      g.fillStyle = gr; g.beginPath(); g.arc(0, 0, rx, 0, Math.PI * 2); g.fill(); g.restore();
    } }
  // el polvo del disco (lo que el oro va llenando)
  const llenado = tramo(t, Tllen, Tnac + 0.4);
  for (const p of polvo) {
    const a = p.a + giro(p.r, t), r = p.r * ap, P = proyecta(c, [r * Math.cos(a), p.y, r * Math.sin(a)]);
    if (!P || P.z < 0.5) continue;
    const s = Math.min(90, (F * p.tam) / P.z), oro = p.oro && llenado * 1.4 > (p.r / 9);
    k.brillo(g, P.x, P.y, s * (oro ? 3 : 2.2), oro ? ORO_RGB : p.c, Math.min(1, (oro ? 1 : p.b * 1.4)) * (1 - 0.7 * cerca));
  }
  // los chorros de oro
  for (const q of chorros) {
    const u = tramo(t, q.t0, q.t0 + q.dur); if (u <= 0 || u >= 1) continue;
    const dest = [q.r * Math.cos(q.a), 0, q.r * Math.sin(q.a)], X = k.mezV(q.de, dest, entra(u)), Xa = k.mezV(q.de, dest, entra(Math.max(0, u - 0.03)));
    const P = proyecta(c, X), A = proyecta(c, Xa); if (!P || !A) continue;
    g.save(); g.globalCompositeOperation = "lighter"; g.strokeStyle = `rgba(${ORO_RGB},0.6)`; g.lineWidth = 3; g.lineCap = "round";
    g.beginPath(); g.moveTo(A.x, A.y); g.lineTo(P.x, P.y); g.stroke(); g.restore();
    k.brillo(g, P.x, P.y, 34, ORO_RGB, Math.sin(Math.PI * u));
  }
  // el Sol, que se enciende en el centro
  const S = proyecta(c, [0, 0, 0]), sol = suave(tramo(t, Tsol - 0.1, Tsol + 0.3));
  if (S && sol > 0) {
    k.brillo(g, S.x, S.y, (F * 6) / S.z, "amarilla", 0.8 * sol);
    k.estrellaTransparente(g, "amarilla", S.x, S.y, (F * 0.9) / S.z * (0.6 + 0.4 * sol), t * 0.2, 0.5 + pulso(t, Tsol + 0.1, 0.2), sol);
    k.fogonazo(g, S.x, S.y, (t - Tsol) * 1.4, 900, "255,236,170");
  }
  // la Tierra, que se junta del polvo y luego se abre
  const T = proyecta(c, posTierra(t)), nace = entra(tramo(t, Ttierra - 0.15, Ttierra + 0.35));
  if (T && nace > 0) {
    const R = (F * 0.42) / T.z * (0.3 + 0.7 * nace);
    k.brillo(g, T.x, T.y, R * 4, "azul", 0.5 * pulso(t, Ttierra + 0.15, 0.2));
    g.save(); g.globalAlpha = Math.min(1, nace * 2);
    tierraAbierta(g, T.x, T.y, R, t, suave(tramo(t, Tcentro - 0.3, Tcentro + 0.3)), suave(tramo(t, Thund - 0.4, Thund + 0.1)));
    g.restore();
  }
}

export const enciendeSol = Tsol;
export const naceTierra = Ttierra;
export const hunde = Thund;
export const finPlano = Ttodo2;
