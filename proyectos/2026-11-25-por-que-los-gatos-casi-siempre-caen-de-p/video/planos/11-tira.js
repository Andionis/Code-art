// «Así que no es suerte: es un giro en dos mitades que hacen sin pensar.»
// Corte en «Así»: sobre una mesa de madera, una tira de seis fotos (como las primeras que se le hicieron a un gato
// cayendo): el mismo gato en seis momentos, del revés al derecho. «no es suerte»: la tira entra. «giro en dos mitades»:
// las fotos se encienden una a una (primero gira la mitad turquesa, luego la rosa). «sin pensar»: las seis brillan
// juntas y la cámara se aleja un poco; reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { gato } from "../mundo.js";
import { HALO_F, HALO_B } from "./04-imposible.js";

export const desde = "asi";
const { suave: su, tramo: tr, mez } = k;
const PI = Math.PI;
const f11 = v.frase(11);
const T0 = f11.inicio, Tgiro = f11.t("giro"), Tsin = f11.t("sin"), Tfin = f11.fin;
const ENC = Array.from({ length: 6 }, (_, i) => Tgiro - 0.15 + i * 0.27);
export const momentos = { fotos: ENC, todas: Tsin };

// las seis posturas: [rf, rb, ef, eb, dobla, haloF, haloB]
const POS = [
  [PI, PI, 0.3, 0.3, 0, 0, 0],
  [PI, PI, 0.3, 0.3, -0.6, 1, 1],
  [PI * 0.5, PI + 0.08, 1, 0, -0.6, 1, 0],
  [0, PI + 0.18, 1, 0, -0.6, 1, 0],
  [0.06, PI * 1.5, 0, 1, -0.4, 0, 1],
  [0, 2 * PI, 0.1, 0.1, 0, 0, 0],
];
const FW = 440, FH = 300;
const XS = [300, 780], YS = [640, 1000, 1360];

const MESA = (() => {
  const c = k.lienzo(1080, 1920), g = c.getContext("2d");
  const gr = g.createLinearGradient(0, 0, 1080, 1920); gr.addColorStop(0, "#5a3218"); gr.addColorStop(1, "#2e170a");
  g.fillStyle = gr; g.fillRect(0, 0, 1080, 1920);
  const az = k.azar(1111); g.lineWidth = 2;
  for (let i = 0; i < 140; i++) { const y = az() * 1920; g.strokeStyle = `rgba(${az() < 0.5 ? "20,8,2" : "140,80,40"},0.25)`; g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(360, y + (az() - 0.5) * 60, 720, y + (az() - 0.5) * 60, 1080, y + (az() - 0.5) * 40); g.stroke(); }
  return k.fijar(c);
})();

function foto(g, x, y, i, luz, t) {
  g.save(); g.translate(x, y);
  // el papel
  g.fillStyle = "rgba(0,0,0,0.4)"; g.fillRect(-FW / 2 + 10, -FH / 2 + 14, FW, FH);
  g.fillStyle = "#f3ead6"; g.fillRect(-FW / 2 - 16, -FH / 2 - 16, FW + 32, FH + 32);
  // el cielo de la foto
  g.save(); g.beginPath(); g.rect(-FW / 2, -FH / 2, FW, FH); g.clip();
  const gc = g.createLinearGradient(0, -FH / 2, 0, FH / 2); gc.addColorStop(0, "#2a78d8"); gc.addColorStop(1, "#a6d6ff");
  g.fillStyle = gc; g.fillRect(-FW / 2, -FH / 2, FW, FH);
  const p = POS[i];
  gato(g, -15, 10, 0.3, 0, p[0], p[1], p[2], p[3], p[4], 0, { haloF: { c: HALO_F, al: p[5] * luz }, haloB: { c: HALO_B, al: p[6] * luz } });
  // apagada: en sepia y oscura
  g.fillStyle = `rgba(60,40,20,${0.55 * (1 - luz)})`; g.fillRect(-FW / 2, -FH / 2, FW, FH);
  g.restore();
  // el número
  g.fillStyle = "#5a3a1a"; g.font = "800 34px Figtree"; g.textAlign = "left"; g.fillText(String(i + 1), -FW / 2 - 4, FH / 2 + 2 + 0);
  g.restore();
}

export function dibuja(g, t) {
  g.drawImage(MESA, 0, 0);
  k.brillo(g, 540, 900, 1500, "255,210,150", 0.35);
  const ent = k.entra(tr(t, T0 - 0.03, T0 + 0.5));
  const z = mez(1.08, 1, su(tr(t, Tsin - 0.2, Tfin)));
  g.save(); g.translate(540, 1000); g.scale(z, z); g.translate(-540, -1000);
  g.translate(0, mez(160, 0, ent)); g.rotate(mez(0.04, -0.015, ent));
  for (let i = 0; i < 6; i++) {
    const luz = su(tr(t, ENC[i], ENC[i] + 0.2));
    foto(g, XS[i % 2], YS[Math.floor(i / 2)], i, luz, t);
  }
  g.restore();
  const todas = k.pulso(t, Tsin + 0.15, 0.25);
  if (todas > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; for (let i = 0; i < 6; i++) k.brillo(g, XS[i % 2], YS[Math.floor(i / 2)], 500, "255,235,190", 0.35 * todas); g.restore(); }
}
