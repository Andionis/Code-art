// «Como un lavamanos que rebosa, se sale por delante.»
// La comparación de casa: un lavamanos blanco con el grifo abierto a tope. Corte en «Como».
// - Primer fotograma: el grifo echa un chorro fuerte y el agua ya está casi en el borde.
// - «rebosa»: el agua llega arriba y se desborda por delante, hacia la cámara, en una cortina que cae.
// - «se sale por delante»: la cortina de agua cae por el frente del lavamanos. El grifo se cierra antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { velo } from "../mundo.js";

export const desde = (vz) => vz.frase(10).inicio;

const { suave: su, tramo: tr, mez, azar, pulso } = k;
const f10 = v.frase(10);
const T0 = f10.inicio, Treb = f10.t("rebosa"), Tfin = f10.fin;
export const momentos = { rebosa: Treb };

const BORDE = 980; // el borde delantero del lavamanos (y)
const az = azar(321);
const GOTAS = Array.from({ length: 70 }, () => ({ x: mez(170, 910, az()), v: 300 + az() * 500, ph: az(), r: 6 + az() * 10 }));

export function dibuja(g, t) {
  // la pared de azulejos y la luz del baño
  const fg = g.createLinearGradient(0, 0, 0, 1920);
  fg.addColorStop(0, "#9fc8d8"); fg.addColorStop(1, "#4f7f93");
  g.fillStyle = fg; g.fillRect(0, 0, 1080, 1920);
  g.strokeStyle = "rgba(255,255,255,0.35)"; g.lineWidth = 4;
  for (let y = 0; y < 1920; y += 150) { g.beginPath(); g.moveTo(0, y); g.lineTo(1080, y); g.stroke(); }
  for (let x = 0; x < 1080; x += 150) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 1920); g.stroke(); }
  k.brillo(g, 300, 300, 1400, "255,250,230", 0.35);
  // el mueble de debajo
  g.fillStyle = "#e9e3d8"; g.fillRect(90, BORDE + 40, 900, 1000);
  g.fillStyle = "rgba(0,0,0,0.15)"; g.fillRect(90, BORDE + 40, 900, 30);
  // el lavamanos: una pila blanca vista un poco desde arriba
  const sube = su(tr(t, T0, Treb)), rebosa = su(tr(t, Treb - 0.1, Treb + 0.3)), cierra = su(tr(t, Tfin - 0.5, Tfin));
  g.save();
  const bg = g.createLinearGradient(0, 620, 0, BORDE + 60);
  bg.addColorStop(0, "#ffffff"); bg.addColorStop(1, "#cfd6db");
  g.fillStyle = bg; k.redondo(g, 110, 620, 860, BORDE + 70 - 620, 70); g.fill();
  // el hueco de la pila, con el agua
  g.beginPath(); g.ellipse(540, 800, 380, 150, 0, 0, 6.2832);
  const hg = g.createLinearGradient(0, 650, 0, 950); hg.addColorStop(0, "#a9b4bb"); hg.addColorStop(1, "#eef2f4");
  g.fillStyle = hg; g.fill();
  g.save(); g.clip();
  const nivel = mez(860, 650, Math.min(1, sube * 0.9 + 0.1 * rebosa));
  const ag = g.createLinearGradient(0, nivel, 0, 960); ag.addColorStop(0, "rgba(120,200,240,0.9)"); ag.addColorStop(1, "rgba(30,110,170,0.95)");
  g.fillStyle = ag; g.fillRect(0, nivel + 6 * Math.sin(t * 9), 1080, 600);
  g.globalCompositeOperation = "lighter"; g.globalAlpha = 0.35; g.drawImage(k.causticas, -100 + (t * 60) % 100, nivel, 1300, 600);
  g.restore();
  // el reflejo de la cerámica
  g.strokeStyle = "rgba(255,255,255,0.9)"; g.lineWidth = 8; g.beginPath(); g.ellipse(540, 800, 395, 160, 0, 3.4, 6.0); g.stroke();
  g.restore();
  // el grifo de metal y su chorro
  const mg = g.createLinearGradient(470, 0, 610, 0); mg.addColorStop(0, "#7d8790"); mg.addColorStop(0.4, "#f4f7fa"); mg.addColorStop(1, "#6b747c");
  g.fillStyle = mg; k.redondo(g, 500, 520, 80, 130, 20); g.fill(); k.redondo(g, 500, 520, 200, 56, 26); g.fill();
  const chorro = 1 - cierra;
  if (chorro > 0.02) {
    const cg = g.createLinearGradient(640, 0, 690, 0); cg.addColorStop(0, `rgba(170,225,255,${0.7 * chorro})`); cg.addColorStop(0.5, `rgba(255,255,255,${0.9 * chorro})`); cg.addColorStop(1, `rgba(140,200,240,${0.7 * chorro})`);
    g.fillStyle = cg; g.fillRect(645, 576, 44 * chorro, nivel + 160 - 576);
    k.brillo(g, 667, 800, 260, "200,240,255", 0.5 * chorro);
  }
  // la cortina de agua que cae por delante
  if (rebosa > 0) {
    const ancho = 760 * rebosa, x0 = 540 - ancho / 2, largo = mez(0, 900, su(tr(t, Treb - 0.05, Treb + 0.7)));
    const wg = g.createLinearGradient(0, BORDE, 0, BORDE + largo);
    wg.addColorStop(0, "rgba(140,210,250,0.85)"); wg.addColorStop(1, "rgba(140,210,250,0.15)");
    g.save(); g.globalAlpha *= 1 - 0.85 * cierra; g.fillStyle = wg; g.beginPath(); g.moveTo(x0, BORDE - 10);
    for (let x = x0; x <= x0 + ancho; x += 30) g.lineTo(x, BORDE - 14 + 6 * Math.sin(x * 0.05 + t * 8));
    g.lineTo(x0 + ancho + 20, BORDE + largo); g.lineTo(x0 - 20, BORDE + largo); g.closePath(); g.fill(); g.restore();
    g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha = 0.4 * rebosa;
    for (let x = x0; x < x0 + ancho; x += 26) { g.strokeStyle = "rgba(255,255,255,0.6)"; g.lineWidth = 3; g.beginPath(); g.moveTo(x, BORDE); g.lineTo(x + 8 * Math.sin(x), BORDE + largo * 0.9); g.stroke(); }
    g.restore();
    // las gotas que saltan abajo
    for (const q of GOTAS) {
      if (q.x < x0 || q.x > x0 + ancho) continue;
      const u = (t * q.v / 700 + q.ph) % 1, y = BORDE + largo * u;
      g.fillStyle = `rgba(200,240,255,${0.8 * (1 - u)})`; g.beginPath(); g.arc(q.x, y, q.r, 0, 6.2832); g.fill();
    }
  }
  velo(g, 0.35);
}
